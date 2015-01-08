angular.module('GalleryCtrl',[]).controller("GalleryController",function($scope, $rootScope, $http, $location, flash) {
	$scope.flash = flash;
	$scope.brandSelect = [];	
	var brandList = [];
	$scope.path = $location.path();

	console.log($scope.path);

	$http.get("/api/items" + $scope.path)
	.success(function(items){
		$scope.items = items;
		// for(i=0; i < $scope.items.length; i++){
		// 	for(j=0; j < $scope.items[i].brand.length; j++){
		// 		if(!(_.contains(brandList,$scope.items[i].brand[j]))){
		// 			brandList.push($scope.items[i].brand[j]);
 		// 		}
		// 	}
		// }
		//$scope.brandList = brandList;
	})
	.error(function(items){
		console.log("Failed");
	});

	

	$scope.setSelectedBrand = function(){
		var brand = this.brand;
		if(_.contains($scope.brandSelect,brand)){
			$scope.brandSelect = _.without($scope.brandSelect,brand);
		}
		else {
			$scope.brandSelect.push(brand);
		}
		return false;
	};

	$scope.isChecked = function (brand) {
		if (_.contains($scope.brandSelect, brand)) {
			return 'glyphicon-ok';
		}
		return false;
	};

	$scope.setTargetId = function(id){
		console.log(id);
		$rootScope.targetId = id;
		$location.path('/product/' + id)
	}

});