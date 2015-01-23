// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
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

        .when('/user/confirm', {
            templateUrl: 'views/userconfirm.html',
            controller: "UserController"
        });


    $locationProvider.html5Mode(true);

}]);
