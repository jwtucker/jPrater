angular.module('ProductCtrl',[]).controller("ProductController",function($scope, $http, $routeParams, $location, flash) {

	$scope.id = $routeParams.id;

	console.log($scope.id);

	$http.get("/api/item/" + $scope.id)
	.success(function(product){
		$scope.product = product;
	})
	.error(function(items){
	});

	$http.get('/api/admin/')
	.success(function(adminObject){
		$scope.admin = adminObject.admin;
		console.log($scope.admin);
	})
	.error(function(){
		console.log("failed");
	});

	$scope.deleteProduct = function(){
		$http.delete("/api/item/" + $scope.id);
		$location.path('/');
	};

});