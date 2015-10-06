<?php

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));
$query = mysql_real_escape_string($data->query);
$assessor = mysql_real_escape_string($data->assessor);
$url = mysql_real_escape_string($data->url);
$rank = mysql_real_escape_string($data->rank);

$con = mysql_connect('localhost', 'root', '');
mysql_select_db('calaca', $con);

$qry = 'INSERT INTO grades (query,assessor,url,rank) values ("' . $query . '","' . $assessor . '","' . $url . '","' . $rank . '")';
$qry_res = mysql_query($qry);
if ($qry_res) {
	$arr = array('msg' => "Page Ranked Successfully!!!", 'error' => '');
	$jsn = json_encode($arr);
	print_r($jsn);
} else {
	$arr = array('msg' => "", 'error' => 'Error In inserting record');
	$jsn = json_encode($arr);
	print_r($jsn);
}

?>