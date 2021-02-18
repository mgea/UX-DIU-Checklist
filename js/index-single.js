$(document).ready(function() {
    // For button width animation we need a set max-width 
	$('.buy-banner--wrapper--is-folded').find('.buy-banner--button').css({
		'maxWidth' : $('.buy-banner--wrapper--is-folded').find('.buy-banner--button').outerWidth()
	});

    // slideup / down the banner
    $('#buy-banner-toggle').on('click', function(e) {
        $('#buy-banner').toggleClass('buy-banner--wrapper--is-folded buy-banner--wrapper--is-unfolded');
        e.preventDefault();
    });

});