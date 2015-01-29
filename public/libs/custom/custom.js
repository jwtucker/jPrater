$(document).ready(function(){
	var navBarShown = 0;

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

	$(".mobileNavBar").click(function(){
		$(".navBar").stop().slideDown();
		navBarShown = 1;
	});

	$(document).mouseup(function (e)
	{
		var container = $(".navBar");

    if (!container.is(e.target) // if the target of the click isn't the container...
    	&& container.has(e.target).length === 0
        && $(window).width() < 992) // ... nor a descendant of the container
    {
    	container.stop().slideUp();
    }
	});

	$(window).resize(function(){
		if($(window).width() > 992){
			$(".navBar").show();
		}
	});

});

