angular.module('HeaderCtrl',[]).controller("HeaderController",function($scope, $http, $location, $route, $rootScope, $timeout, flash) {

	$scope.user = "No user!";
	$scope.flash = flash;
	$scope.numberItems = 0;

	$scope.$on('loginEvent',function(){
		$http.get('/api/user')
		.success(function(user){
			$scope.user = user;
		})
		.error(function(){
			console.log("failed");
		});
	});

	$scope.$on('$routeChangeSuccess',function(){
		$http.get('/api/user')
		.success(function(user){
			$scope.user = user;
		})
		if($scope.user.user)$scope.updateNumberItems();
	})

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

	$scope.updateNumberItems = function(){
		$scope.numberItems = $scope.user.user.cart.length;
		console.log($scope.numberItems);
	}

	$scope.updateOnLoad = function(){
		$rootScope.$broadcast('$routeChangeSuccess');
	}

	$scope.updateOnLoad();

});