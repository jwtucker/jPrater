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

	$scope.getTestimonials = function(){
		$http.get('/api/testimonialHomepage')
		.success(function(data){
			$scope.testimonials = data;
			for(var i=0; i < $scope.testimonials.length; i++){
				var tempDate = $scope.testimonials[i].date.split("T");
				$scope.testimonials[i].date = tempDate[0];
			}

		});
	}

	$scope.getTestimonials();
});