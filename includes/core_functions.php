<?php

require('configuration/config.php');
session_start();

require('configuration/database.php');

$db = new database;

$db->connect_to_db();

if(!empty($_REQUEST['e'])){
	$err = $_REQUEST['e'];
	$error_msg = "";

	switch($err){
		case 1:	$error_msg = "All fields are required";
				break;
		case 2: $error_msg = "An account with that email already exists";
				break;
		case 3: $error_msg = "An error occurred creating your account, try again";
				break; 
		case 4: $error_msg = "No account associated with that email";
				break; 
		case 5: $error_msg = "Email and password combination do not match";
				break; 
		case 6: $error_msg = "You must sign in to access that page";
				break;
		case 8: $error_msg = "Error creating account. Please try again.";
				break;
		case 10: $error_msg = "Account successfully created";
				 break;

		default: break;
	}
}

function verifyPermissions(){
	if(!isset($_SESSION['user_id'])){
		header('Location: login.php?e=6');
	}
}
?>