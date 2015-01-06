angular.module('ProductCtrl',[]).controller("ProductController",function($scope, $http, $routeParams, flash) {

	$scope.id = $routeParams.id;

	$http.get("/api/items/" + $scope.id)
	.success(function(product){
		console.log("Success!");
		$scope.product = product;
	})
	.error(function(items){
		console.log("Failed");
	});



});