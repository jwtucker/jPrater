var myApp = angular.module('sampleApp', ['ngRoute', 'ngAnimate', 'appRoutes', 'MainCtrl', 'GalleryCtrl', 'SignupCtrl', 'HeaderCtrl', 'ProductCtrl', 'AdminCtrl', "Filters", 'Service']);

// myApp.directive('turnRed', function() {  
//   return {      
//     link: function(scope, element, attr) {
//     	element.hover(function(){
//     		$(this).css("color","red");
//     	});
//     }
//   };  
// });

myApp.directive('slideDescriptionUp', function() {  
	return {      
		link: function(scope, element, attr) {
			element.hover(function(){
				$(this).find('.galleryTitleWrapper').stop().animate({"top":"30px"},300);
				$(this).find('img').stop().animate({opacity:0});
			},function(){
				$(this).find('.galleryTitleWrapper').stop().animate({"top":"230px"},300);
				$(this).find('img').stop().animate({opacity:1});
			});
		}
	};  
});