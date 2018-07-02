<?php
 header('Access-Control-Allow-Origin: *');  

// Return IP address

$useraddress = $_SERVER['REMOTE_ADDR'];

if($useraddress == '148.61.109.226') { 
// Second floor kiosk
echo '<script>var kioskFloor=2;console.log("This is a catalog kiosk. Adding customization script.");</script><script src="https://prod.library.gvsu.edu/labs/opac/js/kiosk.js"></script>';
}

if($useraddress == '148.61.107.208') { 
// Third floor kiosk
echo '<script>var kioskFloor=3;console.log("This is a catalog kiosk. Adding customization script.");</script><script src="https://prod.library.gvsu.edu/labs/opac/js/kiosk.js"></script>';
}

if($useraddress == '148.61.107.209') { 
// Fourth floor kiosk
echo '<script>var kioskFloor=4;console.log("This is a catalog kiosk. Adding customization script.");</script><script src="https://prod.library.gvsu.edu/labs/opac/js/kiosk.js"></script>';
}
