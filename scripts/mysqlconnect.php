<?php 
//use the settings in config.php to connect to the specified database
include("config.php");

$dbc = mysql_connect (DB_DOMAIN, DB_USERNAME, DB_PASSWORD);
mysql_select_db (DB_NAME);

?>
