<?php
include_once("../../../wp-load.php");
global $wpdb;
$tb_name = $wpdb->get_blog_prefix() . 'map_firsovo';
$euid = trim($_GET['euid']);
$query = "SELECT * FROM $tb_name WHERE element_uid = '".$euid."'";
$newtable = $wpdb->get_results( $query );
$return = json_encode($newtable);
print_r($return);