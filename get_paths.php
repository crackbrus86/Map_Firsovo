<?php
global $wpdb;
$newtable = $wpdb->get_results( "SELECT * FROM wp_map_firsovo" );
$out = '{';
foreach ($newtable as $item) {
	$out .= $item->element_uid.' : { path: "'.$item->d.'"}, ';
}
$out .= '}';
?>
<script>
	var paths = <?php echo $out; ?>
</script>