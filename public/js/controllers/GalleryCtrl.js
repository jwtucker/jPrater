angular.module('GalleryCtrl',[]).controller("GalleryController",function($scope, $rootScope, $http, $location, flash) {
	$scope.flash = flash;
	$scope.brandSelect = [];	
	$scope.outCategories = [];
	$scope.path = $location.path();

	$http.get("/api/items" + $scope.path)
	.success(function(items){
		$scope.items = items;
		$scope.createOutCategories(items);
	})
	.error(function(items){
		console.log("Failed");
	});


	//FILTERING FUNCTIONS
	$scope.setSelectedBrand = function(index){
		var subOption = this.subOption;
		if(_.contains($scope.subOptionList[index],subOption)){
			$scope.subOptionList[index] = _.without($scope.subOptionList[index],subOption);
		}
		else {
			$scope.subOptionList[index].push(subOption);
		}
		return false;
	};

	$scope.isChecked = function (index) {
		var subOption = this.subOption;
		if (_.contains($scope.subOptionList[index], subOption)) {
			return ' glyphicon glyphicon-ok';
		}
		return false;
	};

	$scope.setUnchecked = function(index){
		$scope.subOptionList[index] = [];
	}

	$scope.setChecked = function(index){
		for(var i=0; i < $scope.outCategories[index].subOptions.length; i++){
			if(!(_.contains($scope.subOptionList[index],$scope.outCategories[index].subOptions[i]))){
				$scope.subOptionList[index].push($scope.outCategories[index].subOptions[i]);
			}
		}
	}

	$scope.setTargetId = function(id){
		console.log(id);
		$rootScope.targetId = id;
		$location.path('/product/' + id)
	}

	$scope.createOutCategories = function(items){
		var foundCategory = false;
		for(var i=0; i < items.length; i++){
			for(var j=0; j < items[i].categories.length; j++){
				var categoryName = items[i].categories[j].name;
				for(var k=0; k < $scope.outCategories.length; k++){
					if(categoryName == $scope.outCategories[k].name){
						foundCategory = true;
						for(var l=0; l < items[i].categories[j].subOptions.length; l++){
							if(!(_.contains($scope.outCategories[k].subOptions,items[i].categories[j].subOptions[l]))){
								$scope.outCategories[k].subOptions.push(items[i].categories[j].subOptions[l]);
							}
						}
					}
				}
				if(foundCategory == false){
					$scope.outCategories.push(items[i].categories[j])
				}
				foundCategory = false;
			}
		}
		$scope.subOptionList = [];
		for(var i=0; i < $scope.outCategories.length; i++){
			$scope.subOptionList.push([]);
		}
	}

});