angular.module('GalleryCtrl',[]).controller("GalleryController",function($scope, $http, $location) {
	$scope.brandSelect = [];	
	var brandList = [];
	

	$http.get("/api/items")
	.success(function(items){
		$scope.items = items;
		for(i=0; i < $scope.items.length; i++){
			for(j=0; j < $scope.items[i].brand.length; j++){
				if(!(_.contains(brandList,$scope.items[i].brand[j]))){
					brandList.push($scope.items[i].brand[j]);
 				}
			}
		}
		console.log(brandList);
		$scope.brandList = brandList;
	})
	.error(function(items){
		console.log("Failed");
	});

	$scope.path = $location.path();
	console.log("DING");

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
		console.log($scope.brandSelect + "  :  " + brand);
		if (_.contains($scope.brandSelect, brand)) {
			console.log("returning");
			return 'glyphicon-ok';
		}
		return false;
	};

});