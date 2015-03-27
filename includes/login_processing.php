<?php 
	require('core_functions.php');

	$sql = "SELECT user_id, email, first_name, last_name, password FROM users WHERE email = ?";
	$params = array($_POST['email_addr']);

	$user_data = $db->executeCleanQuery($sql,$params);

	if(empty($user_data)){
		header('Location: ../login.php?e=4');
	}else if(!$db->connection->error){
		if(!password_verify($_POST['passwd'],$user_data[0]['password'])){
			header('Location: ../login.php?e=5');
		}else{
			session_start();
			$_SESSION['user_id'] = $user_data[0]['user_id'];
			$_SESSION['f_name'] = $user_data[0]['first_name'];
			$_SESSION['l_name'] = $user_data[0]['last_name'];
			header('Location: ../editor_main.php');
		}
	}
?>