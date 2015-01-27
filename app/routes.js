7 // app/routes.js

// grab the Item model we just created
var Item = require('./models/item');
var User = require('./models/user');
var paypal = require('paypal-rest-sdk');
var config = require('../config/config');
var transporter = config.transporter;

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
            res.json(items); 
        });
    });

    app.get('/api/item/:item_id', function(req,res){
        Item.findById(req.params.item_id, function(err,item){
            if(err) res.send(err);
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

    app.put('/api/checkout', isLoggedIn, function(req,res){

        console.log(req.body);


        //Query the cart
        var userCart = req.user.cart;

        //console.log("HERE IS THE USERCART" + userCart);

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

        console.log(items);
        console.log(total);

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
                res.json({message: "Payment Completed!"})
            }
        });
    });


    //Admin Routes

    app.post('/api/uploads', isAdmin, function(req, res){
        console.dir(req.files);
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
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) {
                console.log("Throwing 500!");
                return next(err);
            }
            req.logIn(user,function(err){
                if(err) return next(err);
                console.log("User Created!");
                return res.json({ success : true, message : 'Account created!' });                    
            })
        })(req, res, next);
    });

    app.post('/login', function(req, res, next) {
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

    //Mailing routes
    app.put('/api/lostPassword', function(req,res){
        var email = req.body.email;
        console.log(email);
        User.findOne({'local.email' : email}, function(err,user){
            if(!user) console.log("User not found");
            else console.log(user);
        })
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

