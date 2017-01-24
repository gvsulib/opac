$(document).ready(function() {

/****************Prototypes ***********************/

	// Patch trim function for IE
	if(typeof String.prototype.trim !== 'function') {
 	 String.prototype.trim = function() {
	    return this.replace(/^\s+|\s+$/g, '');
	  }
	}

	// Function to make text sentence case
	String.prototype.toProperCase = function () {
		return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

/****************Functions*************************/

	// Function to create modal windows in the catalog
	function createModal(triggerClass, modalTitle, modalContent, altLink, altTitle, defaultTitle, title) {

		$('.' + triggerClass).click(function(e) {
			e.preventDefault();
			console.log(title);
			var link = $(this).attr("href"); // Get the URL of the link that spawned the modal

			if(altTitle === null) {
				// Insert a modal dialog box with an alternate title for a link
				$("body").append('<div class="overlay"><div class="modal-box"><h4 style="text-align:center;margin-bottom: 1em;">' + modalTitle + '</h4>' + modalContent + '<div class="line"><div style="width:48%;padding-right:2%;float:left;"><p><a href="' + link + '" class="btn btn-lg btn-default">' + defaultTitle + '</a></p></div></div><div class="close-button">[x]</div></div></div>');

				$(".close-button").click(function() {
					$(".overlay").hide();
				});
			} else {
			
				// Insert a modal dialog box 
				$("body").append('<div class="overlay"><div class="modal-box"><h4 style="text-align:center;margin-bottom: 1em;">' + modalTitle + '</h4>' + modalContent + '<div class="line"><div style="width:48%;padding-right:2%;float:left;"><p><a href="'+ altLink +'" class="btn btn-lg btn-primary">' + altTitle + '</a></p></div><div style="width:48%;padding-right:2%;float:left;"><p><a href="' + link + '" class="btn btn-lg btn-default">' + defaultTitle + '</a></p></div></div><div class="close-button">[x]</div></div></div>');

				$(".close-button").click(function() {
					$(".overlay").hide();
				});
			}
		});
	}

// Define common variables
var reformatted = false;
var now = Date.now();

// There are additional copies, make this less awful

if($('#bibDisplayContent center form').find('input[type="submit"]').val() == 'View additional copies or search for a specific volume/copy') {

	reformatted = true;

	// Reformat new items into arrays
	var allHoldings = new Array(), availableHoldings = new Array(), unavailableHoldings = new Array(), periodicals;
	
	console.log('There are more than 10 holdings for this item.');

	// Get URL of additional copies
	var loadUrl = $('#bibDisplayContent center').find('form').attr('action');

	// Load additional copies into hidden div for processing
	var hiddenDiv = document.createElement('div');
	hiddenDiv.id = 'additionalCopies';
	hiddenDiv.style.display = 'none';
	document.body.appendChild(hiddenDiv);

	$('#additionalCopies').load(loadUrl + ' .bib_items', function() {

		console.log('The element has loaded');

		// Hide the view additional button

		$('#bibDisplayContent center').hide();

		var periodicals = false, microform = false;
		var content = $(this).find('table.bib_items tbody');
		if($(content).find('tr td:first:contains("Periodicals")').length > 0) {
			periodicals = true;
			console.log('This is a periodical');
			var journalTitle = encodeURIComponent($("td.bibInfoLabel:contains('Title')").first().next("td").text());
			journalTitle = journalTitle.replace(/\s/g, '+');
			console.log(journalTitle);
			var journalIssn = $("td.bibInfoLabel:contains('ISSN')").first().next("td").text();
			journalIssn = journalIssn.replace(/\-/g,"");
			console.log(journalIssn);
		}
		if($(content).find('tr td:first:contains("Microform")').length > 0) {
			microform = true;
			console.log('This is a microform');
			var journalTitle = encodeURIComponent($("td.bibInfoLabel:contains('Title')").first().next("td").text());
			journalTitle = journalTitle.replace(/\s/g, '+');
			console.log(journalTitle);
		}

		$(this).find('tr.bibItemsEntry').each(function() {

				var availText = $(this).find('td:last-child').text().trim();
				var aLocation = $(this).find('td:first').text().trim();
				console.log(aLocation);
				//var splitLocation = newLocation.split('<br>');
				//var aLocation = splitLocation[0];
				var aCallNo = $(this).find('td:nth-child(2)').text().trim();
				// if ASRS item, grab ASRS URL
				if($(this).find('td:first').find('a').length > 0) {
					var asrs = true;
					var asrsUrl = $(this).find('td:first').find('a').attr('href');
					console.log('This is an ASRS item');
				} else {
					var asrs = false;
					var asrsUrl = '';
					console.log('This is not an ASRS item');
				}

				if(aCallNo.indexOf('Browse Sim') > -1) {
				  aCallNo = aCallNo.replace("Browse Similar", "");
				}

			  	if((aLocation.indexOf('Reference') == -1) && (aLocation.indexOf('Seidman') == -1) && (aLocation.indexOf('Resource') == -1) && (aLocation.indexOf('Reserves') == -1)  &&(availText.indexOf('BILLED') == -1)) {
			  		var requestAble = true;
			  		var requestLink = $('#requestButton').parent('a').attr('href');
			  	} else {
			  		var requestAble = false;
			  		var requestLink = '';
			  	}

			  	if(asrs === true) {
			  		if(availText.indexOf('AVAILABLE') > -1) {
			  			requestLink = asrsUrl;
					} 
			  	}

			  	var melRequestLink = $('span.melbutton').parent('a').attr('href');

				if(periodicals === true) {

					allHoldings.push({"Availability": availText, "Classes": "avail available", "Location": aLocation, "Callno": aCallNo, "Requestable": requestAble, "RequestURL": requestLink, "ASRS": asrs});

				} else {

					if(availText.indexOf('AVAILABLE') > -1) {
						// Add to available object
						availableHoldings.push({"Availability": availText, "Classes": "avail available", "Location": aLocation, "Callno": aCallNo, "Requestable": requestAble, "RequestURL": requestLink, "ASRS": asrs});
					} else {
						// Add to unavailable object
						unavailableHoldings.push({"Availability": availText, "Classes": "avail unavailable", "Location": aLocation, "Callno": aCallNo, "Requestable": requestAble, "RequestURL": melRequestLink, "ASRS": asrs});
					}
				}

			});


			// Combine all items
			if(periodicals === false) {
				allHoldings = availableHoldings.concat(unavailableHoldings);
			}

			console.log(allHoldings);

			// Now start inserting the additional items under the first ten
			// Keep this DIV hidden, and also include a trigger to show additional items

			$('.bib-record-details').append('<div id="top-results"></div>');
			$('.bib-record-details').append('<div id="trigger">Show Additional Copies</div>');
			$('.bib-record-details').append('<div id="additional-results" style="display:none;"></div>');
			$('.bib-record-details').append('<div class="cms-clear"></div>');
			$('#trigger').css('color', '#1F65A0').css('cursor','pointer').css('margin-top','1em');

			$('#trigger').click(function() {
				$('#additional-results').slideToggle(400);
				if($(this).text() == 'Show Additional Copies') {
					$(this).text('Hide Additional Copies');
				} else {
					$(this).text('Show Additional Copies');
				}
			});



			function addRequestButton(x) {

				if(allHoldings[x].Requestable === true) {
					var requestButton = '<a href="' + allHoldings[x].RequestURL + '" class="request-button btn btn-primary btn-sm">Request</a>';
					return requestButton;
				} else {
					return '';
				}
			}


			for(t=0;t < allHoldings.length; t++) {

				if(t < 10) {
					$('#top-results').append('<div class="availability-table"><span class="' + allHoldings[t].Classes + '">' + allHoldings[t].Availability + '</span> <span class="location">' + allHoldings[t].Location + '</span> <span class ="call-number">' + allHoldings[t].Callno + '</span> ' + addRequestButton(t) + '</div>');
				} else {
					$('#additional-results').append('<div class="availability-table"><span class="' + allHoldings[t].Classes + '">' + allHoldings[t].Availability + '</span> <span class="location">' + allHoldings[t].Location + '</span> <span class ="call-number">' + allHoldings[t].Callno + '</span> ' + addRequestButton(t) + '</div>');
				}
			}



			// Hide the old table and request button
			$('table.bib_items').hide();
			$('#requestButton').hide();

			if($('table.bib_holdings').length > 0) { 

					var holdingsLabels = new Array();
					var holdingsData = new Array();
					var newHoldingTable = '';

					$('table.bib_holdings').find('.bibHoldingsLabel').each(function() {
						holdingsLabels.push($(this).text());
					});

					$('table.bib_holdings').find('.bibHoldingsEntry').each(function() {
						holdingsData.push($(this).html());
					});

					// Move the holdings info to the top:
					var arrayLength = holdingsLabels.length;

					for (var i = 0; i < arrayLength; i++) {
				    	var newHoldings = '<div class="holding"><span class="holdingLabel">' + holdingsLabels[i] + '</span> <span class="holdingsEntry">' + holdingsData[i] + '</span></div>';
				    	newHoldingTable = newHoldingTable + newHoldings;
					}

					console.log(newHoldingTable);

					$('#top-results').prepend(newHoldingTable);
					$('table.bib_holdings').hide();
				}

			console.log(periodicals);

			if(periodicals === true) {

				var illLink = 'https://gvsu.illiad.oclc.org/illiad/illiad.dll/OpenURL?sid=&genre=article&aulast=&aufirst=&issn=' + journalIssn + '&title=' + journalTitle + '&atitle=&volume=&part=&issue=&spage=&epage=&date=';

					console.log('Adding periodical modal');

					createModal('request-button', 'Are you looking for a specific article?', '<p><a href="http://gvsu.edu/library/ill">Document Delivery</a> can send an electronic copy to you, free of charge.</p><p>Need the whole journal? We can put it on hold for you.</p>', illLink, 'Request an Article', 'Request the Journal', 'Requesting a journal from the ASRS');
				
			}
			if(microform === true) {
				
				var illLink = 'https://gvsu.illiad.oclc.org/illiad/illiad.dll/OpenURL?sid=&genre=article&aulast=&aufirst=&issn=&title=' + journalTitle + '&atitle=&volume=&part=&issue=&spage=&epage=&date=';

					createModal('request-button', 'Are you looking for a specific article?', '<p><a href="http://gvsu.edu/library/ill">Document Delivery</a> can send an electronic copy to you, free of charge.</p><p>Need the whole journal? This item has been scanned to <strong>microfilm</strong> and can only be read with a Microfilm reader. Readers are available at Steelcase and Mary Idema Pew Libraries only.</p>', illLink, 'Request an Article', 'Request the Microform', 'Requesting a microform');
				

			}

	});
}



/* Reformat the results page availability tables */
if($('.searchResultsPage').length > 0) {


		$('tr.bibItemsEntry').each(function() {
	  
	  var availability = $(this).find('td[width="24%"]').text();
	  var location = $(this).find('td:nth-child(1)').text();
	  var callno = $(this).find('td:nth-child(2)').text();
	  var callnotext = callno.split('Browse Similar');
	  locationText = location.split('<br>');
	  //console.log(availability);

	  /* Create Availability Span */
	  availability = availability.trim();
	  var newAvailability = document.createElement('span');
	  if(availability == 'AVAILABLE') {
	    newAvailability.className = 'available avail';
	  } else {
	    newAvailability.className = 'unavailable avail';
	  }
	  newAvailability.innerHTML = availability.toProperCase();
	  console.log(newAvailability);

	  /* Create Location Span */
	  var newLocation = document.createElement('span');
	  newLocation.className = 'location';
	  newLocation.innerHTML = locationText[0].trim();

	  /* Create Call Number Span */
	  var newCallNo = document.createElement('span');
	  newCallNo.className = 'call-number';
	  newCallNo.innerHTML = callnotext[0].trim();

	  /* Create new availability line */
	  var newLine = document.createElement('div');
	  newLine.className = 'availability-table';
	  newLine.appendChild(newAvailability);
	  newLine.appendChild(newLocation);
	  newLine.appendChild(newCallNo);

	  $(this).closest('.briefcitItems').append(newLine);
	  $(this).hide();

	});
	$('.bib_items').hide();
}

if($('#return-to-browse').length > 0) {
	var returnButtonUrl = $('#return-to-browse').parent('a').attr('href');
	$('#return-to-browse').parent('a').hide();
	$('#cms-content .lib-horizontal-list:first').prepend('<span class="return-link"><a href="' + returnButtonUrl + '">&laquo;&nbsp;Return to Results</a></span>');
}
	
if($("#bibDisplayBody").length > 0) {

		// There are holdings for this item
		var requestURL, requestable;

if(reformatted === false) {
		// Reformat the availability table

		var periodicals = false, microform = false;
		var content = $('table.bib_items').find('tbody');
		if($(content).find('tr td:first:contains("Periodicals")').length > 0) {
			periodicals = true;
			console.log('This is a periodical');
			var journalTitle = encodeURIComponent($("td.bibInfoLabel:contains('Title')").first().next("td").text());
			journalTitle = journalTitle.replace(/\s/g, '+');
			console.log(journalTitle);
			var journalIssn = $("td.bibInfoLabel:contains('ISSN')").first().next("td").text();
			journalIssn = journalIssn.replace(/\-/g,"");
			console.log(journalIssn);
		}
		if($(content).find('tr td:first:contains("Microform")').length > 0) {
			microform = true;
			console.log('This is a microform');
			var journalTitle = encodeURIComponent($("td.bibInfoLabel:contains('Title')").first().next("td").text());
			journalTitle = journalTitle.replace(/\s/g, '+');
			console.log(journalTitle);
			
		}

		if($('table.bib_holdings').length > 0) { 

					var holdingsLabels = new Array();
					var holdingsData = new Array();
					var newHoldingTable;

					$('table.bib_holdings').find('.bibHoldingsLabel').each(function() {
						holdingsLabels.push($(this).text());
					});

					$('table.bib_holdings').find('.bibHoldingsEntry').each(function() {
						holdingsData.push($(this).html());
					});

					// Move the holdings info to the top:
					var arrayLength = holdingsLabels.length;
					for (var i = 0; i < arrayLength; i++) {
				    	var newHoldings = '<div class="holding"><span class="holdingLabel">' + holdingsLabels[i] + '</span> <span class="holdingsEntry">' + holdingsData[i] + '</span></div>';
				    	newHoldingTable = newHoldingTable + newHoldings;
					}

					$('.bib-record-details').append(newHoldingTable);
					$('table.bib_holdings').hide();
				}

		$('tr.bibItemsEntry').each(function() {
  
			  var availability = $(this).find('td[width="24%"]').text();
			  var location = $(this).find('td:nth-child(1)').text();
			  var callnotext = $(this).find('td:nth-child(2)').text();
			  var callno = callnotext.split('Browse Similar');
			  locationText = location.split('<br>');
			  console.log(availability);

			  var melRequestLink = 

			  /* Create Availability Span */
			  availability = availability.trim();
			  var newAvailability = document.createElement('span');
			  if(availability == 'AVAILABLE') {
			    newAvailability.className = 'available avail';
			  } else {
			    newAvailability.className = 'unavailable avail';
			  }
			  newAvailability.innerHTML = availability.toProperCase();

			  /* Create Location Span */
			  var newLocation = document.createElement('span');
			  newLocation.className = 'location';
			  newLocation.innerHTML = locationText[0].trim();

			  /* Create Call Number Span */
			  var newCallNo = document.createElement('span');
			  newCallNo.className = 'call-number';
			  newCallNo.innerHTML = callno[0].trim();
			  
			  if($(this).find('td[width="38%"]:first').find('a').length > 0) {
			    console.log('ASRS item');

			    // Check to see if the item is available or not
			    if(availability == 'AVAILABLE') {
			    	var requestURL = $(this).find('td[width="38%"]:first').find('a').attr('href');
			    	var requestLabel = 'Request';
			    } else {
			    	var requestURL = $('span.melbutton').parent('a').attr('href');
			    	var requestLabel = 'Request from another library';
			    }

			  } else {
			  	 if(availability == 'AVAILABLE') {
			  		console.log('Stacks item');
			  		var requestURL = $('#requestButton').parent('a').attr('href');
			  		var requestLabel = 'Request';
			  	} else {
					var requestURL = $('span.melbutton').parent('a').attr('href');
			    	var requestLabel = 'Request from another library';
			  	}
			  }
			  console.log(requestURL);


			  /* Create new availability line */
			  var newLine = document.createElement('div');
			  newLine.className = 'availability-table';
			  newLine.appendChild(newAvailability);
			  newLine.appendChild(newLocation);
			  newLine.appendChild(newCallNo);

			// Don't show request button for Course Reserves, Special Collections, or Reference Materials
			  if((locationText[0].indexOf('Reference') == -1) && (locationText[0].indexOf('Seidman') == -1) && (locationText[0].indexOf('Resource') == -1) && (locationText[0].indexOf('Reserve') == -1) && (availability.indexOf('BILLED') == -1) && (typeof requestURL != 'undefined')) {
			  	console.log('This item circulates: Adding request button');
			  	var requestButton = document.createElement('a');
			 	 requestButton.href = requestURL;
			  	requestButton.innerHTML = requestLabel;
			  	requestButton.className = 'request-button btn btn-primary btn-sm';
			  	newLine.appendChild(requestButton);
			  } else {
			  	console.log('This item does not circulate');
			  }
			  
			  console.log('Reformating the availability table');
			  $('#requestButton').hide();

			  $('.bib-record-details').append(newLine);
			  $(this).hide();



});

console.log(periodicals);

	if(periodicals === true) {
				
				var illLink = 'https://gvsu.illiad.oclc.org/illiad/illiad.dll/OpenURL?sid=&genre=article&aulast=&aufirst=&issn=' + journalIssn + '&title=' + journalTitle + '&atitle=&volume=&part=&issue=&spage=&epage=&date=';

				console.log('Adding click handlers for request buttons');

					createModal('request-button', 'Are you looking for a specific article?', '<p><a href="http://gvsu.edu/library/ill">Document Delivery</a> can send an electronic copy to you, free of charge.</p><p>Need the whole journal? We can put it on hold for you.</p>', illLink, 'Request an Article', 'Request the Journal', 'Requesting a journal from the ASRS');
				

	}
	if(microform === true) {
				
				var illLink = 'https://gvsu.illiad.oclc.org/illiad/illiad.dll/OpenURL?sid=&genre=article&aulast=&aufirst=&issn=&title=' + journalTitle + '&atitle=&volume=&part=&issue=&spage=&epage=&date=';

					createModal('request-button', 'Are you looking for a specific article?', '<p><a href="http://gvsu.edu/library/ill">Document Delivery</a> can send an electronic copy to you, free of charge.</p><p>Need the whole journal? This item has been scanned to <strong>microfilm</strong> and can only be read with a Microfilm reader. Readers are available at Steelcase and Mary Idema Pew Libraries only.</p>', illLink, 'Request an Article', 'Request the Microform', 'Requesting a microform');
				

	}
}

/******************** Small UI Changes ********************************/

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

}

// Script to make non-keyword results screens look better when no results

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
			$('.msg').html('<div class="noResults alert alert-danger row" style="padding:.25em 0;margin-bottom:.5em;"><div class="span1"><h4 style="font-weight:bold;text-align:center;font-size:1.2em;">No matches Found.</h4></div><div class="span2" style="font-size:80%;">' + searchTips + '</div><div class="cms-clear"></div></div><p style="margin:0 !important;font-weight:bold;font-size:80%;text-transform:capitalize;">' + pageType[1] + '</p><style>.noResults ul li { padding-bottom:.4em;}.search-term{font-weight:bold;color:#333!important;}</style>');

			// Hide the old weird links
			$('tr.yourEntryWouldBeHere td').find('a').css('display', 'none');
			$('tr.yourEntryWouldBeHere td').css('color', '#88B3DA').attr('align','left').css('background-color', '#88B3DA').css('border-color', '#6694cc')
			$('tr.yourEntryWouldBeHere td').find('b').css('display','inline-block').css('color', '#333').css('padding','1em 0 1em 2.4em');
		}
	}

// Add class to subject links for analytics tracking
	if($('td.bibInfoLabel').length > 0) {
		$('td.bibInfoLabel').each(function() { 
			if($(this).text() !== '') {
				var label=$(this).text();  
			}
			
			if(label=='Subject' || label=='Subjects') { 
				console.log('Setting click handlers on subject links.'); 
				$(this).next('td.bibInfoData').find('a').addClass('subjectLink'); 
			} 
		});
	}

// Add Doc Del link to Account page
	if($('table.patfunc').length > 0) {
		$('div.patFuncArea').find('table.patfunc').find('th.patFuncTitle').append(' from <span style="text-transform: uppercase !important;">GVSU</span>');
		$('table.patfunc').before('<div class="alert alert-info" style="margin-top:1em;">Don&#8217;t see the book you&#8217;re looking for? Check your <a href="https://www.gvsu.edu/library/docdel">Document Delivery account</a> for books borrowed from other libraries!</div>');
	}
	
// Try to head off syntax errors for Author searches
	if($('select[name="searchtype"]').length > 0) {
		$('select[name="searchtype"]').change(function() {
			if($(this).val() == 'a') {
				$("input#searcharg").attr("placeholder", "Last Name, First Name");
			} else {
				$("input#searcharg").attr("placeholder", "");
			}
		});
	}

// Don't style puppet or other image links like buttons

	if($('table.bib_links').find('img').length > 0) {
		$('table.bib_links').find('a').addClass('lib-puppets');
	}

// Fix the poor display of the error on failed renewals
	if($('#renewfail;msg').length > 0) {
		if((document.getElementById('renewfailmsg') != 'undefined') || (document.getElementById('renewfailmsg') != null) || (document.getElementById('renewfailmsg').style.display != 'none')) {
			// Renewal failed by III makes it hard to see

			var renewalFailText = document.getElementById('renewfailmsg').innerText;
			console.log(renewalFailText);

			// Get rid of the see details below part.
			var renewalMessage = renewalFailText.split('. ');
			var renewalError = document.createElement('div');
			renewalError.className = 'alert alert-danger';
			renewalError.style.clear = 'both';
			renewalError.style.marginTop = '3em';
			renewalError.innerHTML = '<b>' + renewalMessage[0] + '.</b> (This usually means that someone else has recalled the book, you&#8217;ve renewed it several times already, or you owe too much in late fines or replacement fees.)';
			$('.patronName').after(renewalError);
		}
	}

// Highlight search scope if not everything
	if(document.getElementById('searchscope').value != 19) {
		document.getElementById('searchscope').style.backgroundColor = '#006699';
		document.getElementById('searchscope').style.color = '#ffffff';
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
	$('span.melbutton').parent('a').attr("target", "_blank");
	
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

	$('form#querybox').submit(function() {
		// Get search type
		var searchtype = $('select#searchtype option:selected').text();
		_gaq.push(['_trackEvent','Search','Type',searchtype]);
	});

	$('form[name="searchtool"]').submit(function() {
		// Get search type
		var searchtype = $('select#searchtype option:selected').text();
		_gaq.push(['_trackEvent','Search','Form',searchtype]);
	});

	$('a.subjectLink').click(function() {
		console.log('Search term clicked');
		_gaq.push(['_trackEvent', 'Search', 'Click','Subject']);
	});

	$('span.melbutton').click(function() {
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

});
