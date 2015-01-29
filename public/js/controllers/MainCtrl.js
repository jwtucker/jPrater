angular.module('MainCtrl',[]).controller("MainController",function($scope, $http, $location, flash) {

	$scope.contactData = {};
	
	$scope.processContact = function(){
		$http.put('/api/contact', $scope.contactData)
		.success(function(){
			flash.setMessage("Successfully sent message.");
			$location.path('/');
		})
		.error(function(){
			flash.setMessage("Error sending message. Please try again later.");
			$location.path('/');
		});
	}
});