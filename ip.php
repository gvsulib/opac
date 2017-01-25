<?php
 header('Access-Control-Allow-Origin: *');  

// Return IP address

$useraddress = $_SERVER['REMOTE_ADDR'];

if($useraddress == '148.61.109.226') { 
// Second floor kiosk
echo '<script>var kiosk_floor=2;</script><script src="//gvsuliblabs.com/labs/opac/js/kiosk.js"></script>';
}

if($useraddress == '148.61.107.208') { 
// Third floor kiosk
echo '<script>var kiosk_floor=3;</script><script src="//gvsuliblabs.com/labs/opac/js/kiosk.js"></script>';
}

if($useraddress == '148.61.107.209') { 
// Fourth floor kiosk
echo '<script>var kiosk_floor=4;</script><script src="//gvsuliblabs.com/labs/opac/js/kiosk.js"></script>';
}
