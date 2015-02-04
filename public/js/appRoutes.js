// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        .when('/aboutus', {
            templateUrl: 'views/aboutus.html',
            controller: 'MainController'
        })

        .when('/policies', {
            templateUrl: 'views/policies.html',
            controller: 'MainController'
        })

        .when('/testimonials', {
            templateUrl: 'views/testimonials.html',
            controller: 'TestimonialController'
        })

        .when('/testimonials/submit', {
            templateUrl: 'views/testimonialsubmit.html',
            controller: 'TestimonialController'
        })

        .when('/testimonials/approve', {
            templateUrl: 'views/testimonialapprove.html',
            controller: 'TestimonialController'
        })

        .when('/retrofitkits',{
        	templateUrl: 'views/gallery.html',
        	controller: 'GalleryController'
        })

        .when('/hidsystems',{
            templateUrl: 'views/gallery.html',
            controller: 'GalleryController'
        })

        .when('/components',{
            templateUrl: 'views/gallery.html',
            controller: 'GalleryController'
        })

        .when('/ledlighting',{
            templateUrl: 'views/gallery.html',
            controller: 'GalleryController'
        })

        .when('/offroadlighting',{
            templateUrl: 'views/gallery.html',
            controller: 'GalleryController'
        })

        .when('/accessories',{
            templateUrl: 'views/gallery.html',
            controller: 'GalleryController'
        })

        .when('/housings',{
            templateUrl: 'views/gallery.html',
            controller: 'GalleryController'
        })

        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'SignupController'
        })

        .when('/product/:id',{
            templateUrl: "views/product.html",
            controller: "ProductController"
        })

        .when('/admin/add',{
            templateUrl: "views/adminadd.html",
            controller: "AdminController"
        })

        .when('/admin/edit',{
            templateUrl: "views/adminedit.html",
            controller: "AdminController"
        })

        .when('/user', {
            templateUrl: "views/user.html",
            controller: "UserController"
        })

        .when('/lostpassword',{
            templateUrl: "views/lostpassword.html",
            controller:  "SignupController"
        })

        .when('/reset/:id', {
            templateUrl: "views/reset.html",
            controller: "SignupController"
        })

        .when('/user/confirm', {
            templateUrl: 'views/userconfirm.html',
            controller: "UserController"
        })

        .when('/admin/send', {
            templateUrl: 'views/adminsend.html',
            controller: 'AdminController'
        })

        .when('/admin/wholesale', {
            templateUrl: 'views/adminwholesale.html',
            controller: 'AdminController'
        })

        //Footer Content

        .when('/contact', {
            templateUrl: 'views/contact.html',
            controller: 'MainController'
        });


    $locationProvider.html5Mode(true);

}]);
