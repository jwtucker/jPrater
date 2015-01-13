angular.module('ProductCtrl',[]).controller("ProductController",function($scope, $sce, $http, $routeParams, $location, flash) {

	$scope.id = $routeParams.id;
	$scope.cost = [];

	console.log($scope.id);

	$http.get("/api/item/" + $scope.id)
	.success(function(product){
		$scope.product = product;
		$scope.trustedLongDescription = $sce.trustAsHtml($scope.product.longDescription);
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

	$scope.updateTotal = function(){
		if($scope.cost.length > 0)	$scope.costTotal = $scope.cost.reduce();
	}

});