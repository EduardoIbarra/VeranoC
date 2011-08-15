<?php
if(isset($_GET)){ 
include 'conn.php';
mysql_query("INSERT INTO checkin(longitude, latitude, accuracy) values(".$_GET['longitude'].", ".$_GET['latitude'].", ".$_GET['accuracy'].")");
}
?>