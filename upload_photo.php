<?php
require_once( $_SERVER['DOCUMENT_ROOT'].'/wp-load.php' );

if (!file_exists(ABSPATH .'/wp-content/uploads/pictures/')) {
    mkdir(ABSPATH .'/wp-content/uploads/pictures/', 0755, true);
}

foreach($_FILES as $file) {
	if ($file['error'] === 0) {
		if (is_uploaded_file($file['tmp_name'])) {
			if(!move_uploaded_file($file['tmp_name'], ABSPATH .'/wp-content/uploads/pictures/'.$file['name']))
				die("Error");
			else 
                $file_name = $file['name'];
                $file_url = ABSPATH .'/wp-content/uploads/pictures/'.$file['name'];
                $file_type = $file['type'];
                $attachment_id = upload_user_file( $file_name, $file_url, $file_type);
                $nonce = wp_nonce_url( admin_url( 'tools.php?page=regenerate-thumbnails&goback=1&ids=' . $attachment_id ), 'regenerate-thumbnails' );
				echo $attachment_id;
		}
	}	
}
function upload_user_file( $file, $file_url, $file_type) {
          $filename = $file;
          $attachment = array(
              'post_mime_type' => $file_type,
              'post_title' => preg_replace( '/\.[^.]+$/', '', basename( $filename ) ),
              'post_content' => '',
              'post_status' => 'inherit',
              'guid' => $file_url
          );
          $attachment_id = wp_insert_attachment( $attachment, $file_url );
          require_once($_SERVER['DOCUMENT_ROOT'].'/wp-admin/includes/image.php');
          $attachment_data = wp_generate_attachment_metadata( $attachment_id, $filename );
          wp_update_attachment_metadata( $attachment_id, $attachment_data );
          if( 0 < intval( $attachment_id ) ) {
                return $attachment_id;
          }
      return false;
}
?> 


