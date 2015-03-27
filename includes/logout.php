<?php 
	require('core_functions.php');
	unset($_SESSION);
	session_destroy();

	header('Location: ../index.php');

?>