angular.module('HeaderCtrl',[]).controller("HeaderController",function($scope, $http, flash) {

	$scope.user = "No user!";

	$http.get('/api/user')
	.success(function(user){
		console.log(user.message);
		$scope.user = user;
	})
	.error(function(){
		console.log("failed");
	});

	$scope.tagline = 'To the Moon and Back!';

});