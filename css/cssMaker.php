<?php

/*
CSS Builder. This is a quick and dirty tool for generating one minimized CSS file from a bunch scattered on
different servers.

The CSS files that populate the final product are set in order in css.json. To learn more, see the Github
repo at http://github.com/gvsulib/opac
*/

// Set initial variables
$prefs = "css.json";
$new_css = 'iii.css';
$i = 1;

// Parse the preferences file
$json = json_decode(file_get_contents($prefs), true);
$count = count($json);

// Cycle through all the CSS files and add them to a single file
while($i <= $count) {
	addStyles($i, $json[$i]);
	$i++;
}

function addStyles($i, $path) {
	
	// Add new styles to iii.css document

	global $new_css;

	$css = compress(file_get_contents($path));
	
	if($i == 1) { // Erase existing file
	
		file_put_contents ($new_css, $css);
	
	} else { // Append to file
	
		file_put_contents ($new_css, $css, FILE_APPEND);
	}
}

// This function by Reinhold Weber, cited at http://www.catswhocode.com/blog/3-ways-to-compress-css-files-using-php
// Compress CSS on the fly

function compress($buffer) {
	
    // Remove comments
    $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);

    // Remove tabs, spaces, newlines, etc.
    $buffer = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $buffer);

    return $buffer;
 }


