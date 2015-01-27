angular.module('SignupCtrl',[]).controller("SignupController",function($scope, $http, $location, $route, $rootScope, flash) {
	
	$scope.flash = flash;
	$scope.signupData = {};
	$scope.loginData = {};
	$scope.lostPasswordData = {};

	$scope.processSignup = function(){
		if($scope.signupData.password != $scope.retypePassword){
			$scope.flash.setMessage("Passwords do not match");
			$rootScope.$broadcast('$routeChangeSuccess');
		}
		else{
			$http.post('/signup', $scope.signupData)
			.success(function(data){
				$scope.flash.setMessage(data.message);
				if(data.success == true){
					$rootScope.$broadcast('loginEvent');
					$location.path('/');
				} 
			})
			.error(function(err){
				$scope.flash.setMessage("Account Unavailable.");
				$rootScope.$broadcast('$routeChangeSuccess');
			});			
		}
	}

	$scope.processLogin = function(){
		$http.post('/login', $scope.loginData)
		.success(function(data){
			$scope.flash.setMessage(data.message);
			if(data.success == true) {
				$rootScope.$broadcast('loginEvent');
				$location.path('/');
			}
			if(data.success == false) ;			
		})
		.error(function(){
			$scope.flash.setMessage("Error with server. Please try again later.");
			$location.path('/')
		});
	}

	$scope.processLostPassword = function(){
		$http.put('/api/lostPassword', {email: $scope.lostPasswordData.email})
		.success(function(){
			$scope.flash.setMessage("If that account exists, and email has been sent.");
			$location.path('/');
		})
		.error(function(){
			$scope.flash.setMessage("Error with server. Please try again later.");
			$location.path('/');
		})
	}

});