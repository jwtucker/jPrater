angular.module('HeaderCtrl',[]).controller("HeaderController",function($scope, $http, $location, $route, flash) {

	$scope.user = "No user!";

	$http.get('/api/user')
	.success(function(user){
		$scope.user = user;
	})
	.error(function(){
		console.log("failed");
	});

	$http.get('/api/admin')
	.success(function(adminObject){
		$scope.admin = adminObject.admin;
		console.log($scope.admin);
	})
	.error(function(){
		console.log("failed");
	});

	$scope.logOut = function(){
		console.log("BAM");
		$http.get('/api/logout');
		window.location.reload();
	}

	$scope.tagline = 'To the Moon and Back!';

});