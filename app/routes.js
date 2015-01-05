 // app/routes.js

// grab the Item model we just created
var Item = require('./models/item');

    module.exports = function(app,passport) {


        app.get('/api/items', function(req, res) {

            Item.find(function(err, items) {

                if (err)
                    res.send(err);

                res.json(items); 
            });
        });

            // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); 
        });

    };

    function isLoggedIn(req,res,next) {
        if(req.isAuthenticated())
            return next();

        res.redirect('/');
    }

