angular.module('TestimonialCtrl',[]).controller("TestimonialController",function($scope, $http, $location, $routeParams, $route, flash) {

$scope.data = {};
$scope.testimonials = [];
$scope.path = $location.path();


$scope.getUnapprovedTestimonials = function(){
	$http.get('/api/testimonial/approve')
	.success(function(data){
		$scope.testimonials = data;
	});
}

$scope.getApprovedTestimonials = function(){
	$http.get('/api/testimonial')
	.success(function(data){
		$scope.testimonials = data;
		for(var i=0; i < $scope.testimonials.length; i++){
			var tempDate = $scope.testimonials[i].date.split("T");
			$scope.testimonials[i].date = tempDate[0];
		}
	});
}

$scope.approveTestimonial = function(id, isApproved){
	$http.put('/api/testimonial/' + id, {approved : isApproved})
	.success(function(data){
		flash.setMessage(data.message);
		$route.reload();
	});
}

$scope.submitTestimonial = function(){
	if($scope.data.anonymous == true) $scope.data.name = undefined;
	$http.post('/api/testimonial', $scope.data)
	.success(function(){
		flash.setMessage('Testimonial successfully submitted! Thank you!');
		$location.path('/');
	})
	.error(function(){
		flash.setMessage('Server error. Sorry, please try again later.');
		$location.path('/');
	});
}

if($scope.path == '/testimonials/approve') $scope.getUnapprovedTestimonials();
if($scope.path == '/testimonials') $scope.getApprovedTestimonials();

});