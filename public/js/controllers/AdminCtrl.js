angular.module('AdminCtrl',[]).controller("AdminController",function($scope, $location, $route, $http, $routeParams, $rootScope, flash) {

	$scope.master = {};
	$scope.choices = [];
	$scope.product = {};
	$scope.product.choices = [];
	$scope.categories = [];
	$scope.product.categories = [];
	$scope.product.imageSrcSet = [];
	$scope.newsletter = {};
	$scope.uploadedFileSet = [];
	$scope.images = [];

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
			if ($scope.uploadedFileSet.length > 0){
				$scope.sendImage(0, productCopy);
			}
			else{
				$scope.master = angular.copy(productCopy);
				$http.post('/api/items',$scope.master);
				$location.path('/');
			}
		})
		.error(function(error){
			console.log(error);
		});

		
	};

	$scope.sendImage = function(index, productCopy) {
		var formdata = new FormData();
		formdata.append("uploadedFile", $scope.uploadedFileSet[index]);
		$http
		.post('/api/uploads', formdata, {
			headers:{
				'Content-Type':undefined
			}
		})
		.success(function(data){
			productCopy.imageSrcSet[index] = data.uploadedFile.name;
			index++;
			if(index == $scope.uploadedFileSet.length){
				$scope.master = angular.copy(productCopy);
				$http.post('/api/items',$scope.master);
				$location.path('/');
			}
			else{
				$scope.sendImage(index, productCopy);
			}
		})
	}

	$scope.addChoice = function() {
		$scope.choices.push({});
	}

	$scope.addCategory = function() {
		$scope.categories.push({});
	}

	$scope.addImage = function(){
		$scope.images.push({});
	}

	$scope.setFile = function (element) {
		$scope.uploadedFile = element.files[0];
	}

	$scope.setFileSet = function (element, index) {
		$scope.uploadedFileSet[index] = element.files[0];
		console.log($scope.uploadedFileSet.length);
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

	if($location.path() == '/admin/add' && $rootScope.editItem){
		console.log("Equal");
		$scope.product = $rootScope.editItem;
		for(var i = 0; i < $scope.product.choices.length; i++){
			$scope.addChoice();
			var tempString = '';
			for(var j = 0; j < $scope.product.choices[i].subChoices.length; j++){
				tempString = tempString + $scope.product.choices[i].subChoices[j].choice + ',' + $scope.product.choices[i].subChoices[j].price + ',';				
			}
			tempString = tempString.substring(0, tempString.length - 1)
			$scope.product.choices[i].subChoices = tempString;
		}
		for(var i=0; i < $scope.product.categories.length; i++){
			$scope.addCategory();
			var tempString = '';
			for(var j=0; j < $scope.product.categories[i].subOptions.length; j++){
				tempString = tempString + $scope.product.categories[i].subOptions[j] + ',';
			}
			tempString = tempString.substring(0, tempString.length - 1); 
			$scope.product.categories[i].subOptions = tempString;
		}
		$rootScope.editItem = undefined;
	}

});