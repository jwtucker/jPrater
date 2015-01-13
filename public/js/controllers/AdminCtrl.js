angular.module('AdminCtrl',[]).controller("AdminController",function($scope, $route, $http, $routeParams, flash) {

	$scope.master = {};
	$scope.choices = [];
	$scope.product = {};
	$scope.product.choices = [];
	$scope.categories = [];
	$scope.product.categories = [];

	$scope.update = function(productCopy) {

		for(var i=0; i < productCopy.choices.length; i++){
			var splitString = productCopy.choices[i].subChoices.split(",");
			var choicesTemp = [];
			for(var j=0; j < splitString.length; j++){
				var choicesTempName = splitString[j];
				j++;
				var choicesTempPrice = parseInt(splitString[j]);
				choicesTemp.push({choice:choicesTempName, price:choicesTempPrice});
			}
			productCopy.choices[i].subChoices = choicesTemp;
		}

		for(var i=0; i < productCopy.categories.length; i++){
			var splitString = productCopy.categories[i].subOptions.split(",");
			var optionsTemp = [];
			for(var j=0; j < splitString.length; j++){
				optionsTemp.push(splitString[j]);
			}
			productCopy.categories[i].subOptions = optionsTemp;
		}

		$scope.master = angular.copy(productCopy);
		$http.post('/api/items',$scope.master);
        //$route.reload();
    };

    $scope.addChoice = function() {
    	$scope.choices.push({});
    }

    $scope.addCategory = function() {
    	$scope.categories.push({});
    }

});