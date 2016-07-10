<?php
include_once("../../../wp-load.php");
global $wpdb;
$tb_name = $wpdb->get_blog_prefix() . 'map_firsovo';
foreach($_POST as $item => $value):
	$data[str_replace('m-path-', '', $item)] = $value;
endforeach;

if(current_user_can('edit_others_pages')):
	$wpdb->update( $tb_name,
		array( 'element_name' => $data['name'], 'element_place' => $data['square'] , 'element_price' => $data['cost'] , 'element_price_new' => $data['new-cost'] , 'element_status' => $data['status']  , 'element_cadaster_number' => $data['cn'], 'element_photo' => $data['picture-id']),
		array( 'element_uid' => $data['id'] )
	);
endif;
echo "true";