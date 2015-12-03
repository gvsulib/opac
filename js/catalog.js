$(document).ready(function() {

	// Patch trim function for IE
	if(typeof String.prototype.trim !== 'function') {
 	 String.prototype.trim = function() {
	    return this.replace(/^\s+|\s+$/g, '');
	  }
	}

	String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	function createModal(triggerClass, modalTitle, modalContent, altLink, altTitle, defaultTitle, title) {

	$('.' + triggerClass).click(function(e) {
		e.preventDefault();
		console.log(title);
		var link = $(this).attr("href"); // Get the URL of the ASRS request

		if(altTitle === null) {
		// Insert a modal dialog box to direct users to Document Delivery
		$("body").append('<div class="overlay"><div class="modal-box"><h4 style="text-align:center;margin-bottom: 1em;">' + modalTitle + '</h4>' + modalContent + '<div class="line"><div style="width:48%;padding-right:2%;float:left;"><p><a href="' + link + '" class="btn btn-lg btn-default">' + defaultTitle + '</a></p></div></div><div class="close-button">[x]</div></div></div>');

		$(".close-button").click(function() {
			$(".overlay").hide();
		});
		} else {
			// Insert a modal dialog box to direct users to Document Delivery
		$("body").append('<div class="overlay"><div class="modal-box"><h4 style="text-align:center;margin-bottom: 1em;">' + modalTitle + '</h4>' + modalContent + '<div class="line"><div style="width:48%;padding-right:2%;float:left;"><p><a href="'+ altLink +'" class="btn btn-lg btn-primary">' + altTitle + '</a></p></div><div style="width:48%;padding-right:2%;float:left;"><p><a href="' + link + '" class="btn btn-lg btn-default">' + defaultTitle + '</a></p></div></div><div class="close-button">[x]</div></div></div>');

		$(".close-button").click(function() {
			$(".overlay").hide();
		});
		}
		
	});
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

		var reformatted = false;

var now = Date.now();
console.log(now);
if(now < 1449810095000){ // It's before December 11th

	if($('#bibDisplayBody').length > 0) {

		var title = $('.bib-record-details .bibInfoEntry').find('td.bibInfoLabel:contains("Title")').next('td').text();
		var author = $('.bib-record-details table.bib_detail tbody tr.bibInfoEntry td table[width="100%"]').find('tr td.bibInfoLabel:contains("Author")').next('td.bibInfoData').text();
		var isbn = $('table.bib_detail tbody tr.bibInfoEntry td table[width="100%"]').find('tr td.bibInfoLabel:contains("ISBN")').next('td.bibInfoData').text();
		var imprint = $('.bib-record-details table.bib_detail tbody tr.bibInfoEntry td table[width="100%"]').find('tr td.bibInfoLabel:contains("Imprint")').next('td.bibInfoData').text();
		var imprintParts = imprint.split(" ");
		// Get number of items in the imprintParts array
		var ii = imprintParts.length - 1;
		var pubDate = imprintParts[ii];
		console.log(imprintParts);
		console.log(pubDate);

		/*
		// Get publisher - can't because MARC fields all display differently depending on field
		var pubparts = imprint.split(':');
		var moreparts = pubparts[1].split(',');
		var publisher = encodeURIComponent(moreparts[0]);
		*/


		var illLink = 'https://gvsu.illiad.oclc.org/illiad/illiad.dll/OpenURL?ctx_ver=Z39.88-2004&amp;ctx_enc=info%3Aofi%2Fenc%3AUTF-8&amp;rft_val_fmt=info:ofi/fmt:kev:mtx:book&amp;rft.genre=book&amp;rft.title=' + encodeURIComponent(title) + '&amp;rft.au=' + encodeURIComponent(author) + '&amp;rft.date=' + encodeURIComponent(pubDate) + '&amp;rft.pub=' + /*publisher + */'&amp;rft.isbn=' + encodeURIComponent(isbn);

		console.log('Setting click handler');
		createMeLModal('melbutton', 'MelCat Requesting is Currently Unavailable', '<p>MeLCat is upgrading its servers, and isn&#8217;t allowing requests until December 11th. You are still able to search MeLCat.during the transition.</p><p>If you need this item, you can request it through Document Delivery.</p>' , illLink, 'Request from Document Delivery', 'Search MeLCat Anyway', 'Requesting from MeLCat');

	} else {

		createMeLModal('melbutton', 'MelCat Requesting is Currently Unavailable', '<p>MeLCat is upgrading its servers, and isn&#8217;t allowing requests until December 11th. You are still able to search MeLCat during the transition.</p><p>If you are looking for a specific item, you can request it through our Document Delivery Service.</p>' , 'http://gvsu.edu/library/docdel', 'Request from Document Delivery', 'Search MeLCat Anyway', 'Requesting from MeLCat');

	}
}

function createMeLModal(triggerClass, modalTitle, modalContent, altLink, altTitle, defaultTitle, title) {

	$('.' + triggerClass).parent('a').click(function(e) {
		e.preventDefault();
		console.log(title);
		var link = $(this).attr("href"); // Get the URL of the ASRS request

		if(altTitle === null) {
		// Insert a modal dialog box to direct users to Document Delivery
		$("body").append('<div class="overlay"><div class="modal-box"><h4 style="text-align:center;margin-bottom: 1em;">' + modalTitle + '</h4>' + modalContent + '<div class="line"><div style="width:48%;padding-right:2%;float:left;"><p><a href="' + link + '" class="btn btn-lg btn-default">' + defaultTitle + '</a></p></div></div><div class="close-button">[x]</div></div></div>');

		$(".close-button").click(function() {
			$(".overlay").hide();
		});
		} else {
			// Insert a modal dialog box to direct users to Document Delivery
		$("body").append('<div class="overlay"><div class="modal-box"><h4 style="text-align:center;margin-bottom: 1em;">' + modalTitle + '</h4>' + modalContent + '<div class="line"><div style="width:48%;padding-right:2%;float:left;"><p><a href="'+ altLink +'" class="btn btn-lg btn-primary">' + altTitle + '</a></p></div><div style="width:48%;padding-right:2%;float:left;"><p><a href="' + link + '" class="btn btn-lg btn-default">' + defaultTitle + '</a></p></div></div><div class="close-button">[x]</div></div></div>');

		$(".close-button").click(function() {
			$(".overlay").hide();
		});
		}
		
	});
}

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

				if(periodicals === true) {

					allHoldings.push({"Availability": availText, "Classes": "avail available", "Location": aLocation, "Callno": aCallNo, "Requestable": requestAble, "RequestURL": requestLink, "ASRS": asrs});

				} else {

					if(availText.indexOf('AVAILABLE') > -1) {
						// Add to available object
						availableHoldings.push({"Availability": availText, "Classes": "avail available", "Location": aLocation, "Callno": aCallNo, "Requestable": requestAble, "RequestURL": requestLink, "ASRS": asrs});
					} else {
						// Add to unavailable object
						unavailableHoldings.push({"Availability": availText, "Classes": "avail unavailable", "Location": aLocation, "Callno": aCallNo, "Requestable": requestAble, "RequestURL": requestLink, "ASRS": asrs});
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

		/*

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

*/

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
			    } else {
			    	var requestURL = $('#requestButton').parent('a').attr('href');
			    }

			  } else {
			  	console.log('Stacks item');
			  	var requestURL = $('#requestButton').parent('a').attr('href');
			  }
			  console.log(requestURL);


			  /* Create new availability line */
			  var newLine = document.createElement('div');
			  newLine.className = 'availability-table';
			  newLine.appendChild(newAvailability);
			  newLine.appendChild(newLocation);
			  newLine.appendChild(newCallNo);

			  console.log(locationText[0].indexOf('Reserve'));
			  console.log(locationText[0].indexOf('Reference'));
			  console.log(locationText[0].indexOf('Seidman'));
			  console.log(availability.indexOf('BILLED'));

			  // Don't show request button for Course Reserves, Special Collections, or Reference Materials
			  if((locationText[0].indexOf('Reference') == -1) && (locationText[0].indexOf('Seidman') == -1) && (locationText[0].indexOf('Resource') == -1) && (locationText[0].indexOf('Reserve') == -1) && (availability.indexOf('BILLED') == -1) && (typeof requestURL != 'undefined')) {
			  	console.log('This item circulates: Adding request button');
			  	var requestButton = document.createElement('a');
			 	 requestButton.href = requestURL;
			  	requestButton.innerHTML = 'Request';
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




	// If there is an ebook, record the provider info if someone uses it
if($('.bib_links').find('a:contains("Access full text online")').length > 0) {
	$('.bib_links').find('a:contains("Access full text online")').click(function(e) {
		var eBookUrl = $(this).attr('href');
		var provider = eBookUrl.split('/');
		console.log(provider[5]);
		var permalink = document.getElementById('recordnum').href;
		var eBookTracker = document.createElement('img');
		eBookTracker.src = '//labs.library.gvsu.edu/labs/ebooks/?source=catalog&prov=' + encodeURIComponent(provider[5] + '|||' + permalink);
		document.body.appendChild(eBookTracker);
	});
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
		$('.msg').html('<div class="noResults alert alert-danger row" style="padding:.25em 0;margin-bottom:.5em;"><div class="span1"><h4 style="font-weight:bold;text-align:center;font-size:1.2em;">No matches Found.</h4></div><div class="span2" style="font-size:80%;">' + searchTips + '</div><div class="cms-clear"></div></div><p style="margin:0 !important;font-weight:bold;font-size:80%;text-transform:capitalize;">' + pageType[1] + '</p><style>.noResults ul li { padding-bottom:.4em;}.search-term{font-weight:bold;color:#333!important;}</style>');

		// Hide the old weird links
		$('tr.yourEntryWouldBeHere td').find('a').css('display', 'none');
		$('tr.yourEntryWouldBeHere td').css('color', '#88B3DA').attr('align','left').css('background-color', '#88B3DA').css('border-color', '#6694cc')
		$('tr.yourEntryWouldBeHere td').find('b').css('display','inline-block').css('color', '#333').css('padding','1em 0 1em 2.4em');
	}
}

/* Script to capture search terms */

	var path = "//gvsuliblabs.com/labs/iiistats/", query = "", ts = Math.round((new Date()).getTime() / 1000), datastring = "", searchType, searchScope;

	if(document.getElementById("searcharg") != 'undefined' && document.getElementById("searcharg") != null ) { 
		recordBasicSearch();
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


	
	/* Show alert that ASRS is down */
	/*
	if(($(".bibItemsEntry").find("a.top-row-buttons").length > 0) && ($(".bibItemsEntry").find("a.top-row-buttons").find('img').attr("alt") == "ARS Request")) {

		$("table#bib_items").prepend('<tr><td colspan="3"><div style="display: block;line-height: 1.25em;margin: 1em 0;padding: 1em 2.5%;background: #ffff7f;border: 1px solid #cc6;text-align: left;color: #444;width:94%;font-size:.8125em;">The automated storage and retrieval system is down. Please call the library at 616-331-3500 if you need this item.</div></td></tr>');

	}*/

});
