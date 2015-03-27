<?php 
	
	ini_set("display_errors", "1");
	error_reporting(E_ALL);

	define('ROOT_DIR',dirname(dirname(dirname(__FILE__))));
	define('DS',DIRECTORY_SEPARATOR);

	define('PROJECT_ROOT',ROOT_DIR . DS . 'projects' . DS);
	define('TOOLBAR_IMG_DIR', ROOT_DIR . DS . 'images' . DS . 'html_images');
	define('HTML_XML_DIR', ROOT_DIR . DS . 'html_tag_xml' . DS);
?>
