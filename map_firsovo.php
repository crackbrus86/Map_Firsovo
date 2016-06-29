<?php
/*
Plugin Name: Map for the camp Firsovo
Description: Interactive map for the camp Firsovo
Version: 1.0
Author: Salivon Eugene
*/

$fpath = trailingslashit(dirname(__FILE__));

//Activation of the page for plugin settings
add_action('admin_menu', array('MapFirsovo', 'MapSettingsInit'));
add_action( 'admin_init', array('MapFirsovo', 'InitDB'));

//Map shortcode
function build_map_f(){
	require_once($fpath."/get_paths.php");
	
	wp_register_style('style_map_f', plugins_url( '/css/firsovo.css', __FILE__ ));
    wp_enqueue_style( 'style_map_f'); 	
	wp_register_script( 'raphael_f', plugins_url( '/js/raphael.js', __FILE__ ) );
	wp_enqueue_script(  'raphael_f');
	wp_register_script( 'init_f', plugins_url( '/js/init.js', __FILE__ ) );
	wp_enqueue_script(  'init_f');	

	echo '<div id="fmap"></div>';
}

add_shortcode( 'FirsovoM', 'build_map_f' );

//Class for handling map areas on manager side
class MapFirsovo{


	function __construct(){

	}

	function MapSettingsInit(){
		add_menu_page('Map Firsovo Settings', 'Map Firsovo Settings', 'edit_posts', 'firsovo_map', array('MapFirsovo', 'MapFirsovoSettings'), plugin_dir_url( __FILE__ ) .'/images/ficon.png');
	}

	//Preparing table in db
	function InitDB(){
		global $wpdb;

		$tb_name = $wpdb->get_blog_prefix() . 'map_firsovo';

		$charset_collate = "DEFAULT CHARACTER SET {$wpdb->charset} COLLATE {$wpdb->collate}";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

		$sql = "CREATE TABLE IF NOT EXISTS {$tb_name} (
					`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
					`element_uid` VARCHAR(100) DEFAULT NULL,
					`element_name` VARCHAR(500) NOT NULL,
					`element_status` VARCHAR(500) NOT NULL,
					`d` mediumtext NOT NULL,
					`element_place` VARCHAR(500) NOT NULL,
					`element_price` VARCHAR(500) NOT NULL,
					`element_photo` BIGINT(20) NOT NULL,
					`element_price_new` VARCHAR(500) NOT NULL,
					`element_cadaster_number` VARCHAR(50) NOT NULL
		) {$charset_collate};";

		dbDelta($sql);
	}

	//Page for plugin settings
	function MapFirsovoSettings(){
		?>
		<div class="wrap">
			<h2>Список участков поселка "Фирсово"</h2>
			<section class="grid">
				
			</section>
		</div>
		<?php
	}		
			
}

?>