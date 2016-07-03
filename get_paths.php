<?php
include_once("../../../wp-load.php");
global $wpdb;
$newtable = $wpdb->get_results( "SELECT * FROM wp_map_firsovo" );
$return = json_encode($newtable);
print_r($return);