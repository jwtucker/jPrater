$(document).ready(function(){

	$(".navBarElement").hover(function(){
		$(this).find('div').show();
	},function(){
		$(this).find('div').hide();
	});

	$(".navBarMenu").hover(function(){
		$(this).show();
	},function(){
		$(this).hide();
	});

});

