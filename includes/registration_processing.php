<?php 

	require('core_functions.php');

	if(empty($_POST['f_name']) || empty($_POST['l_name']) || empty($_POST['email']) || empty($_POST['passwd'])){
		header('Location: ../register.php?e=1');
	}

	$select_email = "SELECT email FROM users WHERE email = ?";

	$email_params = array($_POST['email']);

	$reg_data = $db->executeCleanQuery($select_email,$email_params);

	if(!empty($reg_data)){
		header('Location: ../register.php?e=2');
	}else{
		$options = [
    		'cost' => 12,
		];

		$pass = password_hash($_POST['passwd'],PASSWORD_BCRYPT,$options);

		$insert_sql = "INSERT INTO users (first_name,last_name,email,password,create_date,cred_src,activated) 
						VALUES (?,?,?,?,NOW(),1,false);";

		$ins_params = array($_POST['f_name'],$_POST['l_name'],$_POST['email'],$pass);

		if(!$db->executeCleanQuery($insert_sql,$ins_params)){
			header('Location: ../register.php?e=3');
		}else{
			$uID_query = "SELECT user_id FROM users WHERE email = ?";
			$uID_params = array($_POST['email']);
			$result = $db->executeCleanQuery($uID_query,$uID_params);
			$uID = $row[0]['user_id'];

			$insert_perm_sql = "INSERT INTO user_access_link(user_id,access_id,paid) VALUES (?,1,true);";
			$ins_perm_params = array($uID);

			$db->executeCleanQuery($insert_perm_sql,$ins_perm_params);

				$subject = "Welcome to Wyzzi";
				$message = "Welcome to Wyzzi, \n\n 
							Click the link to activate your account.\n\n
							http://wyzziweb.com/login.php?a=".md5(4);
							//mail($email,$subject,$message);
							header('Location: ../login.php?e=10');
		}
	}
?>