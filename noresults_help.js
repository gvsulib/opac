var errMsg = document.getElementById('search_error').innerText;
if(errMsg.trim() === 'NO ENTRIES FOUND') {
	var searchQuery = document.getElementById('st1').value;
	

	document.getElementById('search_error').innerHTML = '<div class="alert alert-warning"> <h1 class="h2 center">Your search returned 0 results</h1> <hr /> <div class="span1 col-8 col-md-12 col-sm-12"> <h3>Revise your search</h3> <ul> <li>Broaden your search below, or remove search terms</li> <li>Check your spelling</li> <li>If searching for a title or author, select the title or author search</li> </ul><!--/div><div class="span1 col-5 col-md-6 col-sm-12"--> <h3>Search other libraries</h3> <p>Free access to over 400 Michigan libraries, with materials delivered quickly to GVSU through MeLCat:<br /> <a href="https://elibrary.mel.org/search/X?' + encodeURIComponent(searchQuery) + '&SORT=D&backlink=https://library.catalog.gvsu.edu:443/search~S19?/X?' + encodeURIComponent(searchQuery) + '&SORT=D" id="melLink" target="_blank"> <span class="btn btn-default melbutton"><span class="text">Search Michigan Libraries</span></span></a></p> <p>We can also borrow materials for you from other libraries through <a href="#">Document Delivery</a>.</p>  </div> <div class="hspan1 col-4 col-md-6 col-sm-12"><h3>Need additional help?</h3> <ul> <li><a class="btn btn-primary btn-sm" href="https://prod.library.gvsu.edu/labs/chat" target="_blank">Chat with us</a></li> <li><a href="sms:6168180219">Text us at (616) 818-0219</a></li> <li><a href="tel:6163313500">Call us at (616) 331-3500</a></li> <li><a href="mailto:library@gvsu.edu">Email us</a></li> </ul> </div> <div style="clear:both;"></div></div> <style> h1.center { text-align:center; }h1.h2.padding-none {display:none;}.melbutton{display:none;}#search_error .melbutton{display:inline-block;}#search_error {margin:0 3% 2em 3%;}.srchhelpText {margin:1% 0; }</style>';

} else {
	console.log('Normal advanced search.');
}

