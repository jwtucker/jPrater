 // app/routes.js

// grab the Item model we just created
var Item = require('./models/item');
var User = require('./models/user');
var Testimonial = require('./models/testimonial');
var paypal = require('paypal-rest-sdk');
var config = require('../config/config');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var smtpPool = require('nodemailer-smtp-pool');
var gm = require('gm');
var fs = require('fs');

paypal.configure({
    'mode' : 'sandbox',
    'client_id' : config.client_id,
    'client_secret' : config.client_secret
});

module.exports = function(app,passport) {

    //Item Handling

    app.get('/api/items/*', function(req, res) {
        var path = req.path;
        path = path.replace("/api/items/","");
        Item.find({type: path},function(err, items) {
            if (err)
                res.send(err);
            if(req.user){
                if(req.user.local.wholesale){
                    for(var i = 0; i < items.length; i++){
                        items[i].price = items[i].wholesalePrice;
                    }
                }                
            }
            res.json(items); 
        });
    });

    app.get('/api/item/:item_id', function(req,res){
        Item.findById(req.params.item_id, function(err,item){
            if(err) res.send(err);
            if(req.user){
                if(req.user.local.wholesale){
                    item.price = item.wholesalePrice;
                }
            }
            res.json(item);
        });
    });

    app.delete('/api/item/:item_id', isAdmin, function(req,res){
        console.log("ding!");
        Item.remove({_id: req.params.item_id},
         function(err, item){
            if(err) res.send(err);
            res.json({message: 'Successfully Deleted'});
        });
    });

    app.post('/api/items', isAdmin, function(req,res) {
        var item = new Item();
        item.name = req.body.name;
        item.type = req.body.type;
        item.brand = req.body.brand;
        item.description = req.body.description;
        item.longDescription = req.body.longDescription;
        item.price = req.body.price;
        item.wholesalePrice = req.body.wholesalePrice;
        item.choices = req.body.choices;
        item.categories = req.body.categories;
        item.imageSrc = req.body.imageSrc;

        item.save(function(err) {
            if (err)
                res.send(err);

            res.json({message:'Item Created.'});
        });
    });


    //Cart Routes

    app.put('/api/addToCart', isLoggedIn, function(req,res){
        req.user.cart.push(req.body);
        console.log("User: " + req.user);
        if(req.user == undefined) console.log("User undefined!");
        req.user.save(function(err){
            if(err) res.send(err);
            res.json("Item Added to Cart!");
        });
    });

    app.put('/api/removeFromCart', isLoggedIn, function(req,res){
        console.log(req.body._id);
        for(i = 0; i < req.user.cart.length; i++){
            if(req.user.cart[i].id == req.body._id){
                req.user.cart.splice(i,1);
                i--;
            }
        }
        req.user.save(function(err){
            if(err) res.send(err);
            res.json("Item removed from cart");
        });
    });

    //Paypal Routes

    app.put('/api/checkout', isLoggedIn, validateCart, function(req,res){

        var userCart = req.user.cart;

        //Create the item list
        var items = [];
        for(var i = 0; i < userCart.length; i++){
            var tempItem = {};
            var nameTemp = "";
            var priceTemp = 0;
            for(var j = 0; j < userCart[i].selectedOptions.length; j++){
                // Puts options in the name field for paypal request.
                var nameTemp = nameTemp + ", " + userCart[i].selectedOptions[j].selectedOption + " : " + userCart[i].selectedOptions[j].choice;
                // Incorporates option prices into final paypal item price
                var priceTemp = priceTemp + userCart[i].selectedOptions[j].price;
            }
            tempItem.name = userCart[i].name + nameTemp;
            tempItem.quantity = userCart[i].quantity;
            tempItem.price = userCart[i].price + priceTemp;
            tempItem.currency = "USD";
            items.push(tempItem);
        }

        //Now compute the total
        var total = 0;
        for(var i = 0; i < items.length; i++){
            total = total + (items[i].price * items[i].quantity);
        }

        if(total == 0) throw("ZERO TOTAL");

        var createPayment = {
            "intent": "authorize",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": config.return_url,
                "cancel_url": config.cancel_url
            },
            "transactions": [{
                "item_list": {
                    "items": items
                },
                "amount": {
                    "currency": "USD",
                    "total": total
                },
                "description": "This is the payment description."
            }]
        };

        console.log("createPayment: " + createPayment);

        paypal.payment.create(createPayment, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } 
            else {
                for (var index = 0; index < payment.links.length; index++) {
                    if (payment.links[index].rel === 'approval_url') {
                        console.log(payment.links[index].href);
                    }
                }
                //console.log(payment);
                payment.success = true;
                res.json(payment);
            }
        });
    });

    app.put('/api/confirmOrder', isLoggedIn, function(req, res){
        paymentId = req.body.paymentId;
        payerId = req.body.payerId;
        console.log("Payment ID: " + paymentId);
        paypal.payment.execute(paymentId, { "payer_id" : payerId }, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            }
            else {
                console.log("Get Payment Response");
                console.log(JSON.stringify(payment));
                req.user.cart = [];
                req.user.save(function(err){
                    if(err) throw(err);
                    res.json({message: "Payment Completed!"});
                });
            }
        });
    });


    //Admin Routes

    app.post('/api/uploads', isAdmin, function(req, res){
        console.dir(req.files);
        console.log('../' + req.files.uploadedFile.path);
        console.log(fs.readdirSync('public'));
        gm(req.files.uploadedFile.path)
        .resize(500)
        .write(req.files.uploadedFile.path,function(err){
            if(err) throw(err);
        });
        res.json(req.files);
    });

    //Profile Handling
    app.get('/api/user', isLoggedIn, function(req, res){
        res.json({user:req.user});
    });

    app.get('/api/admin', isLoggedIn, function(req,res){
        res.json({admin:req.user.local.admin});
    });

    app.get('/api/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/signup', function(req, res, next) {
        req.body.email = req.body.email.toLowerCase();
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) {
                console.log("Throwing 500!");
                return next(err);
            }
            req.logIn(user,function(err){
                if(err) return next(err);
                console.log("User Created!");
                req.user.local.newsletter = req.body.newsletter;
                req.user.save(function(err){
                    if(err) throw(err);
                    return res.json({ success : true, message : 'Account created!' });                    
                });
            })
        })(req, res, next);
    });

    app.post('/login', function(req, res, next) {
        req.body.email = req.body.email.toLowerCase();
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                console.log("Throwing 500!");
                return next(err);
            }
            if (! user) {
                console.log("No User!");
                return res.json({ success : false, message : 'Username/password combination does not exist.' });
            }
            req.logIn(user, function(err){
                console.log("Auth Succeeded!");
                if(err) return next(err);
                return res.json({ success : true, message : 'You have logged in.' });                    
            })
        })(req, res, next);
    });

    //Newsletter and wholesaler routes

    app.put('/api/wholesale', isAdmin , function(req,res){
        var email = req.body.email;
        User.findOne({'local.email' : email}, function(err,user){
            if(!user) res.json({success : false, message : "User not found!"});
            user.local.wholesale = !user.local.wholesale;
            user.save(function(err){
                if(err) throw(err);
                res.json({success : true, message : "User wholesale status is now: " + user.local.wholesale});
            })
        });
    });

    //Mailing routes
    app.put('/api/lostPassword', function(req,res){
        var email = req.body.email;
        User.findOne({'local.email' : email}, function(err,user){
            if(!user) res.json({message: "User not found."});

            crypto.randomBytes(20, function(err,buf){
                var token = buf.toString('hex');
                user.lostPasswordToken = token;
                user.lostPasswordExpires = Date.now() + 3600000; //1 Hour

                user.save(function(err){
                    if(err) throw(err);
                });
                var transporter = nodemailer.createTransport(config.transporter);
                var mailOptions = {
                    to: email,
                    from: 'retrofitauthority@gmail.com',
                    subject: 'Retrofit Authority Password Reset',
                    text: 'You are receiving this email because you have requested a password reset on Retrofit Authority. If you did not ask for this, please disregard this email. In order to reset the password, please click the following link: \n\n' + config.url + '/reset/' + token
                }
                transporter.sendMail(mailOptions, function(err){
                    if(err) throw(err);
                });
                res.json({message: "Email sent!"});
            });                                


})
});

    app.put('/api/checkResetKey', function(req,res){
        User.findOne({'local.email' : req.body.email, lostPasswordToken: req.body.resetKey, lostPasswordExpires: {$gt: Date.now()}}, function(err,user){
            if(!user) res.json({message: "User/key combination not found. Please try resetting again."});
            user.local.password = user.generateHash(req.body.password);
            user.lostPasswordToken = undefined;
            user.lostPasswordExpires = undefined;
            user.save(function(err){
                if(err) throw(err);
                console.log("Returning now!?")
                res.json({message: "Password changed!"});                
            });
        });
    });


    //Footer functions

    app.put('/api/contact', function(req,res){
        var transporter = nodemailer.createTransport(config.transporter);
        var mailOptions = {
            to: 'justin.prater@ymail.com, tuckerjeremyw@gmail.com',
            from: req.body.email,
            subject: 'Message on Retrofit Authority from ' + req.body.email,
            text: "Reply to: " + req.body.email + "\n\n\n" + req.body.message
        }
        transporter.sendMail(mailOptions, function(err){
            if(err) throw(err);
        });
        res.json({message: "Message Sent."})
    });

    //Testimonial API
    app.post('/api/testimonial', function(req,res){
        var testimonial = new Testimonial();
        testimonial.name = req.body.name;
        testimonial.testimonial = req.body.testimonial;
        testimonial.save(function(err){
            if(err) throw(err);
            else res.json({success:true, message: "Testimonial Submitted!"});
        });
    });

    app.put('/api/testimonial/:testimonial_id',isAdmin,function(req,res){
        console.log(req.params.testimonial_id);
        Testimonial.findById(req.params.testimonial_id, function(err,testimonial){
            if (req.body.approved == true) {
                testimonial.approved = true;
                testimonial.save(function(err){
                    if(err) throw(err);
                    res.json({success: true, message:"Testimonial Approved!"})
                });
            }
            if (req.body.approved == false){
                testimonial.remove();
                res.json({success: true, message:'Testimonial Removed!'});
            } 
        });
    });

    app.get('/api/testimonial/approve', isAdmin, function(req,res){
        Testimonial.find({approved: false}, function(err,testimonials){
            if(err) throw(err);
            res.json(testimonials);
        })
    });

    app.get('/api/testimonial', function(req,res){
        Testimonial.find({approved: true}, function(err,testimonials){
            if(err) throw(err);
            res.json(testimonials);
        })
    });


    //Newsletter Handling
    app.put('/api/newsletter', isAdmin, function(req,res){
        var transporter = nodemailer.createTransport(smtpPool(config.transporterMailgun));
        User.find({'local.newsletter':'true'},function(err,users){
            users.forEach(function(user){
                var mailOptions = {
                    to: user.local.email,
                    from: 'noreply@retrofitauthority.com',
                    subject: req.body.subject,
                    text: req.body.message
                }
                transporter.sendMail(mailOptions, function(err){
                    if(err) throw(err);
                });
            });            
        });
        
        res.json({message: "Message sent."});
    });



    //Sets index file
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); 
    });
};

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated())
        return next();
    else
        throw("User not logged in");
}

function isAdmin(req,res,next) {
    if(req.user.local.admin == true) return next();
}

function validateCart(req,res,next){
    var userCart = req.user.cart;
    var success = true;
    var counter = 0;
    var max = userCart.length;

    //Check if the price and the options match to prevent bogus carts
    for(var i = 0; i < userCart.length; i++){
        (function(){
            var cartID = userCart[i].id;
            var cartPrice = userCart[i].price;
            var cartOptions = userCart[i].selectedOptions;
            Item.findById(cartID, function(err,item){
                console.log (cartPrice + ":::::" + item.price);
                if(cartPrice != item.price && !req.user.local.wholesale) success = false;
                if(cartPrice != item.wholesalePrice && req.user.local.wholesale) success = false;
                if(cartOptions.length != item.choices.length) success = false;
                for(var j = 0; j < cartOptions.length; j++){
                    if(cartOptions[j].selectedOption != item.choices[j].name) success = false;
                    var matchFound = false;             //Need a way to detect if no matches are found
                    for(var k = 0; k < item.choices[j].subChoices.length; k++){
                        if(item.choices[j].subChoices[k].choice == cartOptions[j].choice){
                            matchFound = true;
                            if(item.choices[j].subChoices[k].price != cartOptions[j].price) success = false;
                        }
                    }
                    if(matchFound == false) success = false;
                }
                counter++;
                if(counter==max){
                    if(success) return next();
                    else {
                        res.json({success:false});
                        res.end();
                    };                    
                }             
            });
        })();
    }





}

