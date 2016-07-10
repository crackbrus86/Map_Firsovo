<?php
	include_once("../../../wp-load.php");
	global $wpdb;
	$pId = $_GET['photoId'];
	$img = wp_get_attachment_image($pId, 'large');
	$img = str_replace('width="1"', 'width="100%"', $img);
	$img = str_replace('height="1"', '', $img);
	print_r($img);
?>