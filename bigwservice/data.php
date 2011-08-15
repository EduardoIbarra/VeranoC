<?php
include '../conn.php';
$database = "multitut_vpbrmngr";
//connection String
$con = mysql_connect("localhost", "multitut_vuser", "b9124853") or die(mysql_error()); 
//select database
mysql_select_db($database, $con);
//Select The database
$bool = mysql_select_db($database, $con);
if ($bool === False){
	print "can't find $database";
}

$start = ($_REQUEST["start"] == null)? 0 : $_REQUEST["start"];
$limit = ($_REQUEST["limit"] == null)? 200 : $_REQUEST["limit"];	

// Gather all pending requests
$query = "SELECT
*
FROM checkin" ;

/* $query .= " ORDER BY PMNumber ASC "; */
$query .= " LIMIT ".$start.",".$limit;

$result = mysql_query($query, $con); 

// Here we do the count
$query_c = "SELECT
*
FROM checkin";
//get total
//echo($query_c);
$count_result = mysql_query($query_c, $con);
$total = mysql_num_rows($count_result);

if (mysql_num_rows($result) > 0){
while($obj = mysql_fetch_object($result))
	{
        $arr[] = $obj;
    }

// Now create the json array to be sent to our datastore

$myData = array('myInventory' => $arr, 'totalCount' => $total);
echo json_encode($myData);
return;
exit();

}

else { // If no requests found, we return nothing

//$myData = array('myInventory' => '', 'totalCount' => '0');
echo json_encode($myData);
return;
exit();

}

?>