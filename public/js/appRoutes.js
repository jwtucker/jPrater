// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        .when('/retrofitKits',{
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
        });


    $locationProvider.html5Mode(true);

}]);