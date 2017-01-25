// Script specific to catalog kiosks in the Mary Idema Pew Library

function kioskModal() {

	$("body").append('<div class="overlay"><div class="modal-box"><h4 style="text-align:center;margin-bottom: 1em;">Search Kiosk</h4><p>This computer only searches the GVSU University Libraries Catalog. If you need to access other sites, you&#8217;ll find a computer lab on the western end of this floor.</p><div class="line"><div style="width:48%;padding-right:2%;float:left;"><p><span class="btn btn-lg btn-default close-modal">Got it! Take me back to my search.</span></p></div></div></div></div>');

		$(".close-modal").click(function() {
			$(".overlay").hide();
		});
	}

// Disable the University Libraries link, show alert that this is a kiosk
$('h1').find('a').click(function(e) {
	e.preventDefault();
	kioskModal();
});

// Disable the GVSU logo link, show alert that this is a kiosk
$('#gvsu-cf_header-logo').find('a').click(function(e) {
	e.preventDefault();
	kioskModal();
});

// Disable the copyright footer links, show alert that this is a kiosk
$('#cms-copyright-wrapper').find('a').click(function(e) {
	e.preventDefault();
	kioskModal();
});

// Disable the footer links, show alert that this is a kiosk
$('#cms-footer-wrapper').find('a').click(function(e) {
	e.preventDefault();
	kioskModal();
});

// Don't show website navigation, but leave the chat button
$('#cms-navigation').find('li').each(function() {
	if($(this).attr('id') != 'library-chat') {
		$(this).hide();
	}
});

$('form#querybox').submit(function() {
		_gaq.push(['_trackEvent','Search','Kiosk','Floor: ' + kioskFloor]);
	});

$('form[name="searchtool"]').submit(function() {
		_gaq.push(['_trackEvent','Search','Kiosk','Floor: ' + kioskFloor]);
	});

$('form#search').submit(function() {
		_gaq.push(['_trackEvent','Search','Kiosk','Floor: ' + kioskFloor]);
	});
