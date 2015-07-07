$(document).ready(function() {

	// Patch trim function for IE
	if(typeof String.prototype.trim !== 'function') {
 	 String.prototype.trim = function() {
	    return this.replace(/^\s+|\s+$/g, '');
	  }
	}


	//Helper function for recordBasicSearch()
		function getSelectedText(elementId) {
			var elt = document.getElementById(elementId);

			if (elt.selectedIndex == -1)
			return null;

			return elt.options[elt.selectedIndex].text;
		}

	/************ Record the Basic search **********************/
		function recordBasicSearch() {
			// Get value of search field

			if(document.getElementById("searcharg").value.length > 0) { // Keyword
				searchQuery = document.getElementById("searcharg").value;
				searchQuery = encodeURI(searchQuery);

				// Get search type - could also grab from the URL and parse into readable value

				var searchType = encodeURI(getSelectedText('searchtype'));
				var searchScope = encodeURI(getSelectedText('searchscope'));
				// Record the search and other details by doing a get request.

				datastring = ts + "/" + searchType + "/" + searchScope + "/" + searchQuery;
				datastring = path + datastring;

				//if this is an advanced search, append an indicator to the datastring
				if(document.URL.indexOf("X?") != -1){
					datastring += "/advanced";
				}

				// Silly hack to play nice with any browser. (I'm looking at you, IE and your fincky support of Cross-domain requests).

				var iFrame = document.createElement('iframe');
				iFrame.src = datastring;
				iFrame.width = '0';
				iFrame.height = '0';

				document.body.appendChild(iFrame);
			}
		}

	if($("#bibDisplayBody").length > 0) {

		// There are holdings for this item

		var requestURL, requestable;

		// Create modal dialog for requesting journals
		if(($(".bib_items:contains('PERIODICALS')").length > 0) || ($(".bib_items:contains('Periodicals')").length > 0)) {

			console.log('This is a periodical.');

			var journalTitle = encodeURIComponent($("td.bibInfoLabel:contains('Title')").first().next("td").text());
			journalTitle = journalTitle.replace(/\s/g, '+');
			console.log(journalTitle);
			var journalIssn = $("td.bibInfoLabel:contains('ISSN')").first().next("td").text();
			journalIssn = journalIssn.replace(/\-/g,"");
			console.log(journalIssn);
			// alert(link);

			$(".bib_items").find("tr").find("td:first").find("a").click(function(e) {
				e.preventDefault();
				var link = $(this).attr("href"); // Get the URL of the ASRS request

				// Insert a modal dialog box to direct users to Document Delivery
				$("body").append('<div class="modal-box"><p><strong>Are you looking for a specific article?</strong> <a href="http://gvsu.edu/library/ill">Document Delivery</a> can send an electronic copy to you, free of charge.</p><p>Need the whole journal? We can put it on hold for you.</p><div class="line"><div class="span2 unit left"><p><a href="https://gvsu.illiad.oclc.org/illiad/illiad.dll/OpenURL?sid=&genre=article&aulast=&aufirst=&issn=' + journalIssn + '&title=' + journalTitle + '&atitle=&volume=&part=&issue=&spage=&epage=&date=" class="lib-button-small">Request an Article</a></p></div><div class="span2 unit left lastUnit"><p><a href="' + link + '" class="lib-button-small-grey">Request the Journal</a></p></div></div><div class="close-button">[x]</div></div><style>.modal-box{font-size:1.2em;width:30em;background-color: #fff;padding:1em;position:fixed;top:20%;left:39%;z-index:1000;box-shadow:5px;border:2px solid #bbb;}.close-button{cursor:pointer;}@media screen and (max-width:700px){.modal-box{width:90%;left:0;}}</style>');

				$(".close-button").click(function() {
					$(".modal-box").hide();
				});
			});
			// Close modal dialogs

		}

		// Get the URL for the top request button, then hide it
		$(".navigationrow.bibScreen a").each(function() {

			if($(this).find("img").attr("alt") == "Hold this item") {

				requestURL = $(this).attr("href");
				$(this).css('display','none');

				requestable = true;

			}

		});

		if(($("tr.bibItemsEntry").length > 0) && (requestable === true)) {

			$("tr.bibItemsEntry").each(function() {

				if(($(this).find("td:contains('AVAILABLE')")) || ($(this).find("td:contains('DUE')"))) {

				// Item is requestable
				// Get first two letters of status

				var isAvailable = $(this).find("td[width='24%']").text().trim().substr(0,2);
				var locationCode = $(this).find("td:first-child").text().trim();
				console.log(locationCode);

					if ($(this).find("td:first-child a").length > 0) {
						// This is an ASRS item

						if(isAvailable !== 'AV') { // Item is not available
							$(this).find("td:first-child a").attr("href", requestURL);
						}

					} else {

						// This is not an ASRS item
						// Does it circulate?

						// Note sure why this query is failing
							if(locationCode.indexOf("Reference") >= 0 || locationCode.indexOf("Seidman") >= 0) {

								console.log("This item does not circulate");
								//$(this).css('color','red');
							} else {
								$(this).find("td:first").append('<a href="' + requestURL + '" class="top-row-buttons"><img src="/screens/asrsicon.gif" alt="ARS Request" border="0"></a>');
							}
					}
				}
			});

		}
	}

/* Move the MARC button */

	if($('#marc-button').length > 0) { 

		console.log('Moving the MARC View link...');

		var marcUrl = $('#marc-button').parent('a').attr('href');
		$('#marc-button').parent('a').hide();
		$('.bibRecordLink').append('&nbsp;//&nbsp;<a id="marc-link" href="' + marcUrl + '<abbr title="Machine Readable Cataloging">MARC</abbr> View</a>');
	}

// If this is an eBook record, hide the call number
	if($('table.bib_links').length > 0) {

		console.log('Hiding eBook call numbers...');		
		$('table.bib_detail').find('td.bibInfoLabel:contains("Call #")').parent('tr').hide();
	}

/* Script to make non-keyword results screens look better when no results */

if($('.yourEntryWouldBeHere').length > 0) {

	var invertSearchTxt, invertSearchUrl, newMelSearch, pageText, pageType, invertSearchPrefix, searchTips;

	// Make a nice no results message
	// First, get the links for MeL and for changing the search

	searchTerm = $('tr.yourEntryWouldBeHere td').find('font').text();
	pageText = $('tr.msg').find('td').text();

	var pageWords = pageText.split(" ");

	// Don't run this script on the "Nearby" results page, just on Not found pages

	if(pageWords[0].trim() !== "Nearby") {

		pageText = pageText.toLowerCase();
		pageType = pageText.split("; ");
		invertSearchText = $('tr.yourEntryWouldBeHere td').find('a:first').text();
		invertSearchUrl = $('tr.yourEntryWouldBeHere td').find('a:first').attr('href');
		newMelSearch = $('tr.yourEntryWouldBeHere td').find('a:last').attr('href');

		if(newMelSearch === undefined) {
				// Probably Journal Title Search
				searchTips = '<ul class="bullet-list"><li><a href="#export_form">Show Similar Results</a></li></ul>';
		} else {
			// Title, subject, or author search
			if(invertSearchText != 'Search as Words') {
				// This is an author search
				invertSearchPrefix = 'Change search to <span class="search-term">';
				invertSearchText = invertSearchText + '</span>';
			} else {
				// This is probably a title or subject search
				invertSearchPrefix = '';
				invertSearchText = 'Search <span class="search-term">' + searchTerm + '</span> as keywords';
			}
			// Set extra search terms

			searchTips = '<ul class="bullet-list"><li><a href="#export_form">Show Similar Results</a></li><li>' + invertSearchPrefix + '<a href="' + invertSearchUrl + '">' + invertSearchText + '</a></li><li><a href="' + newMelSearch + '">Search other libraries for <span class="search-term">' + searchTerm + '</span></a></li><li>Revise your search and try again</li></ul>';
		}

		// Write the new HTML
		$('.msg').html('<div class="noResults lib-note line" style="padding:.25em 0;margin-bottom:.5em;"><div class="span2 unit left"><h4 style="font-weight:bold;text-align:center;font-size:1.2em;">No matches Found.</h4></div><div class="span2 unit left lastUnit" style="font-size:80%;">' + searchTips + '</div></div><p style="margin:0 !important;font-weight:bold;font-size:80%;text-transform:capitalize;">' + pageType[1] + '</p><style>.noResults ul li { padding-bottom:.4em;}.search-term{font-weight:bold;color:#333!important;}</style>');

		// Hide the old weird links
		$('tr.yourEntryWouldBeHere td').find('a').css('display', 'none');
		$('tr.yourEntryWouldBeHere td').css('color', '#88B3DA').attr('align','left').css('background-color', '#88B3DA').css('border-color', '#6694cc')
		$('tr.yourEntryWouldBeHere td').find('b').css('display','inline-block').css('color', '#333').css('padding','1em 0 1em 2.4em');
	}
}

/* Script to capture search terms */

	var path = "http://gvsuliblabs.com/labs/iiistats/", query = "", ts = Math.round((new Date()).getTime() / 1000), datastring = "", searchType, searchScope;

	if(document.getElementById("searcharg") != 'undefined' && document.getElementById("searcharg") != null ) { 
		recordBasicSearch();
	}
	
// Try to head off syntax errors for Author searches
	if($('select[name="searchtype"]').length > 0) {
		$('select[name="searchtype"]').change(function() {
			if($(this).val() == 'a') {
				$("input#searcharg").attr("placeholder", "Last Name, First Name");
			}
		});
	}

// Don't style puppet or other image links like buttons

if($('table.bib_links').find('img').length > 0) {
	$('table.bib_links').find('a').addClass('lib-puppets');
}

// Fix the poor display of the error on failed renewals

if(document.getElementById('renewfailmsg') != 'undefined' && document.getElementById('renewfailmsg') != null) {
	// Renewal failed by III makes it hard to see

	var renewalFailText = document.getElementById('renewfailmsg').innerText;
	console.log(renewalFailText);

	// Get rid of the see details below part.
	var renewalMessage = renewalFailText.split('. ');
	var renewalError = document.createElement('div');
	renewalError.className = 'lib-error';
	renewalError.style.clear = 'both';
	renewalError.style.marginTop = '3em';
	renewalError.innerHTML = '<b>' + renewalMessage[0] + '.</b> (This usually means that someone else has recalled the book, or you&#8217;ve renewed it several times already.)';
	var accountTools = document.getElementById('myaccount-tools');
	accountTools.appendChild(renewalError);
}

/* Google Analytics Tracking Scripts */

	var linkLabel;

	// Assign numbers to records on briefcitTitles

	if ($(".briefCitRow").length > 0) {

		var i = 1;

		$('span.briefcitTitle').find('a').each(function() {

			$(this).attr("data-click", i);
			i = i + 1;

		});

	}
	
	// Add target_blank to MeL icon parent
	$('img.MeLIcon').parent('a').attr("target", "_blank");
	
	// Accessibility workarounds
	$('input[name="availlim"]').attr('id', 'availlim');

	$('form[name="searchtool"]').find('option[value="c"]').text("Call Number");
	$('form[name="searchtool"]').find('option[value="i"]').text("ISBN/ISSN");

	if($("div.browseResourceTable").length > 0) {
		$("div.browseResourceTable").closest('td[width="15%"]').css("display","none");
	}

	// Assign classes to some other buttons

	$("div#bibDisplayBody a").each(function() {
		$(this).addClass("top-row-buttons");
	});

	// Analytics triggers

	$('img.MeLIcon').click(function() {
		_gaq.push(['_trackEvent', 'Buttons', 'Click', 'MeLCat']);
	});
	$('span.briefcitTitle').find('a').click(function() {
		_gaq.push(['_trackEvent', 'Result Position', 'Click', $(this).attr("data-click")]);
	});
	$('.top-row-buttons').click(function() {
		linkLabel = 'Buttons: ' + $(this).find("img").attr("alt");
		_gaq.push(['_trackEvent', 'Buttons', 'Click', linkLabel]);
	});
	$('.top-banner').click(function() {
		linkLabel = 'Banner Link: ' + $(this).text();
		_gaq.push(['_trackEvent', 'Buttons', 'Click', linkLabel]);
	});
	$('.sidebar').click(function() {
		linkLabel = 'Sidebar Link: ' + $(this).text();
		_gaq.push(['_trackEvent', 'Buttons', 'Click', linkLabel]);
	});
	$('table.bibLinks').find('a').click(function() {
		_gaq.push(['_trackEvent', 'Buttons', 'Click', "Full Text Link"]);
	});
	$('td#coverImage').find('a').click(function() {
		_gaq.push(['_trackEvent', 'Buttons', 'Click', "Cover Image Syndetics"]);
	});
	$('.bibSearchtoolMessage').find('a').click(function() {
		linkLabel = 'Sort by ' + $(this).text();
		_gaq.push(['_trackEvent', 'Buttons', 'Click', linkLabel]);
	});
	$('tr.browsePager').find('a').click(function() {
		linkLabel = 'Go to page ' + $(this).text();
		_gaq.push(['_trackEvent', 'Buttons', 'Click', linkLabel]);
	});

	(function() {
	    var x = document.createElement("script"); x.type = "text/javascript"; x.async = true;
	    x.src = (document.location.protocol === "https:" ? "https://" : "http://") + "us.libraryh3lp.com/js/libraryh3lp.js?multi,poll";
	    var y = document.getElementsByTagName("body")[0]; y.appendChild(x);
	  })();
	
	/* Show alert that ASRS is down */
	/*
	if(($(".bibItemsEntry").find("a.top-row-buttons").length > 0) && ($(".bibItemsEntry").find("a.top-row-buttons").find('img').attr("alt") == "ARS Request")) {

		$("table#bib_items").prepend('<tr><td colspan="3"><div style="display: block;line-height: 1.25em;margin: 1em 0;padding: 1em 2.5%;background: #ffff7f;border: 1px solid #cc6;text-align: left;color: #444;width:94%;font-size:.8125em;">The automated storage and retrieval system is down. Please call the library at 616-331-3500 if you need this item.</div></td></tr>');

	}*/

});
