 // app/routes.js

// grab the Item model we just created
var Item = require('./models/item');

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


    app.put('/api/addToCart', isLoggedIn, function(req,res){
        req.user.cart.push(req.body);
        console.log(req.user);
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

    //Admin Controls

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


            // process the signup form
            app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

            app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


            app.get('*', function(req, res) {
                res.sendfile('./public/views/index.html'); 
            });




        };

        function isLoggedIn(req,res,next) {
            if(req.isAuthenticated())
                return next();
        }

        function isAdmin(req,res,next) {
            if(req.user.local.admin == true) return next();
        }

