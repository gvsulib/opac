<?php
header("Access-Control-Allow-Origin: *");
include("mysqlconnect.php");

$navString = addslashes(urldecode($_SERVER['REQUEST_URI']));
// Returns "/pathto/script/LinkPosition/Type/Page/"

$parts = explode('/', $navString); // Break into an array

// Grab fixed position fields
//$parts[3] = Timestamp of search
$timestamp = trim($parts[3]);
//$parts[4] = Search type (e.g. Keyword, Title...)
$searchType = trim($parts[4]);
//$parts[5] = Search scope
$searchScope = trim($parts[5]);
//$parts[6] = search query
$searchQuery = trim($parts[6]);

//$parts[7] = set only when an advanced search is found
if(isset($parts[7]) && $parts[7] != ""){
	$advanced_search = true;
} else {
	$advanced_search = false;
}

// Save record to database
mysql_query("INSERT INTO iii_searches VALUES ('', '$timestamp', '$searchType', '$searchScope', '$searchQuery')") or die(mysql_error());

//deal with advanced searches
if($advanced_search){
	$ad_query = mysql_query("SELECT id_iii_searches_advanced, instances FROM iii_searches_advanced WHERE iii_searches_advanced = 'advanced'");
	if(mysql_num_rows($ad_query) > 0){
		//increment the instances in 'advanced'
		$ad_result = mysql_fetch_array($ad_query);
		$id = $ad_result['id_iii_searches_advanced'];
		$new_instances = 1 + $ad_result['instances'];
		mysql_query("UPDATE iii_searches_advanced SET instances = '$new_instances' WHERE id_iii_searches_advanced = '$id'") or die(mysql_error());
	} else {
		//insert a new row of 'advanced'
		mysql_query("INSERT INTO iii_searches_advanced VALUES('', 'advanced', '1')") or die(mysql_error());
	}
}
?>