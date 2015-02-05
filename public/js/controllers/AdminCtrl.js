angular.module('AdminCtrl',[]).controller("AdminController",function($scope, $location, $route, $http, $routeParams, flash) {

	$scope.master = {};
	$scope.choices = [];
	$scope.product = {};
	$scope.product.choices = [];
	$scope.categories = [];
	$scope.product.categories = [];
	$scope.newsletter = {};

	$scope.update = function(productCopy) {

		if($scope.product.wholesalePrice == undefined) $scope.product.wholesalePrice = $scope.product.price;

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

		// $scope.test = document.getElementById("uploadForm");
		// console.log($scope.test);
		// angular.element("#fileUploadSubmit").trigger('click');

		var fd = new FormData();
		fd.append("uploadedFile", $scope.uploadedFile);
		$http
		.post('/api/uploads', fd, {
			headers:{
				'Content-Type':undefined
			},
			//transformRequest:angular.identity
		})
		.success(function(data){
			productCopy.imageSrc = data.uploadedFile.name;
			$scope.master = angular.copy(productCopy);
			$http.post('/api/items',$scope.master);
			$location.path('/');
		})
		.error(function(error){
			console.log(error);
		});

		
	};

	$scope.addChoice = function() {
		$scope.choices.push({});
	}

	$scope.addCategory = function() {
		$scope.categories.push({});
	}

	$scope.setFile = function (element) {
		$scope.uploadedFile = element.files[0];
	}

	$scope.submitWholesale = function(){
		$http.put('/api/wholesale', {email : $scope.wholesale.email})
		.success(function(data){
			flash.setMessage(data.message);
			$route.reload();
		})
		.error(function(data){
			flash.setMessage("Error submitting request");
			$route.reload();
		})
	}

	$scope.submitNewsletter = function(){
		$http.put('/api/newsletter', {message: $scope.newsletter.message, subject : $scope.newsletter.subject})
		.success(function(){
			flash.setMessage("Newsletter successfully sent.");
			$location.path('/');	
		})
		.error(function(){
			flash.setMessage("Error sending newsletter.");
			$location.path('/');
		})
	}

});