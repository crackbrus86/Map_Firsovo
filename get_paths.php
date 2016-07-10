<?php
include_once("../../../wp-load.php");
global $wpdb;
$tb_name = $wpdb->get_blog_prefix() . 'map_firsovo';
$newtable = $wpdb->get_results( "SELECT * FROM $tb_name" );
$return = json_encode($newtable);
print_r($return);