<?php
include_once("../../../wp-load.php");
print_r(($_GET['editor_map']==true && current_user_can('edit_others_pages'))? "true" : "false" );
?>