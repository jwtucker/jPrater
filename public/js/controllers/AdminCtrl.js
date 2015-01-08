angular.module('AdminCtrl',[]).controller("AdminController",function($scope, $route, $http, $routeParams, flash) {

	$scope.master = {};
	$scope.choices = [];
	$scope.product = {};
	$scope.product.choices = [];

	$scope.update = function(productCopy) {
		for(var i=0; i < productCopy.choices.length; i++){
			var splitString = productCopy.choices[i].subChoices.split(",");
			var choicesTemp = []
			for(var j=0; j < splitString.length; j++){
				var choicesTempName = splitString[j];
				j++;
				var choicesTempPrice = parseInt(splitString[j]);
				choicesTemp.push({choice:choicesTempName, price:choicesTempPrice})
			}
			productCopy.choices[i].subChoices = choicesTemp;
		}
        $scope.master = angular.copy(productCopy);
        $http.post('/api/items',$scope.master);
        //$route.reload();
    };

    $scope.addChoice = function() {
    	$scope.choices.push({});
    }

});