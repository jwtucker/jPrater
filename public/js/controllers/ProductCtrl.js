angular.module('ProductCtrl',[]).controller("ProductController",function($scope, $sce, $http, $routeParams, $location, flash) {

	$scope.id = $routeParams.id;
	$scope.cost = [];
	$scope.selectedOptions = [];
	$scope.costTotal = 0;

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
	})
	.error(function(){
		console.log("failed");
	});

	$scope.deleteProduct = function(){
		$http.delete("/api/item/" + $scope.id);
		$location.path('/');
	};

	$scope.updateTotal = function(){
		for(var i = 0; i < $scope.selectedOptions.length; i++){
			$scope.selectedOptions[i].selectedOption = $scope.product.choices[i].name;
			$scope.cost[i] = $scope.selectedOptions[i].price;			
		}
		if($scope.cost.length > 0)	$scope.costTotal = $scope.cost.reduce(function(a,b){
			return a+b;
		});
	}

	$scope.addToCart = function(){
		if(parseInt($scope.quantity) < 1 || $scope.quantity == undefined) $scope.quantity = 1;
		$scope.quantity = parseInt($scope.quantity);
		var tempObject = { "id" : $scope.id, "name" : $scope.product.name, "quantity" : $scope.quantity , "selectedOptions" : $scope.selectedOptions, "price" : $scope.product.price};
		console.log(tempObject);
		$http.put('/api/addToCart', tempObject);
		$location.path('/user');
	}
});