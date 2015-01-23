angular.module('UserCtrl',[]).controller("UserController",function($scope, $route, $http, $location, $window) {
	$scope.cart = [];
	$scope.optionCostTotal = [];

	$http.get('/api/user')
	.success(function(user){
		$scope.user = user;
		for(var i = 0; i < $scope.user.user.cart.length; i++){
			console.log("ding");
			var tempTotal = [0,0];
			for(var j=0; j < $scope.user.user.cart[i].selectedOptions.length; j++){
				tempTotal.push($scope.user.user.cart[i].selectedOptions[j].price);
			}
			$scope.optionCostTotal[i] = tempTotal.reduce(function(a,b){
				return a + b;
			})
		}

		for(i=0; i < $scope.user.user.cart.length; i++){
			$http.get('/api/item/' + $scope.user.user.cart[i].id, {
				params: {
					quantity : $scope.user.user.cart[i].quantity,
					optionCostTotal : $scope.optionCostTotal[i]
				}
			})
			.success(function(data,status,headers,config,statusText){
				data.quantity = config.params.quantity;
				data.price = data.price + config.params.optionCostTotal;
				$scope.cart.push(data);
			});
		}
	});


	$scope.removeItem = function(item){
		$http.put('/api/removeFromCart',item);
		window.location.reload();
	}

	$scope.checkout = function(){
		$http.put('/api/checkout', $scope.user.user.cart)
		.success(function(data){
			$window.location.href = data.links[1].href;
		});
	}

	$scope.confirmOrder = function(){
		var paymentId = $location.search().paymentId;
		var payerId = $location.search().PayerID;

		$http.put('/api/confirmOrder', {"paymentId" : paymentId, "payerId" : payerId})
		.success(function(){
			$location.path('/');
		});
	}


});