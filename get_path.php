<?php
include_once("../../../wp-load.php");
global $wpdb;
$euid = trim($_GET['euid']);
$query = "SELECT * FROM wp_map_firsovo WHERE element_uid = '".$euid."'";
$newtable = $wpdb->get_results( $query );
$return = json_encode($newtable);
print_r($return);