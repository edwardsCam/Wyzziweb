<?php 
	require('includes/core_functions.php');
?>

<!DOCTYPE HTML>
<html>
	<head>
		<title>Sign up for WYZZI - A website builder for everyone</title>
		<link rel="stylesheet" type="text/css" href="style/main.css">
	</head>
	<body>
		<div class='main_content'>
			<?php require('includes/header_menu.php'); ?>
			<div id='content'>
				<form method='post' action='includes/registration_processing.php' id='register_frm'>
					<fieldset>
						<legend>Create a WYZZI Account</legend>
						<div class='pad'>
							<span id='error'><?php if(!empty($error_msg)){echo $error_msg;}?></span>
							<label>First Name</label>
							<input type='text' class='inp_field' id='f_name' name='f_name' />
							<label>Last Name</label>
							<input type='text' class='inp_field' id='l_name' name='l_name' />
							<label>Email</label>
							<input type='email' class='inp_field' id='email' name='email' />
							<label>Password</label>
							<input type='password' class='inp_field' id='passwd' name='passwd' />
							<input id='signUp' type='submit' value='Create Account' />
						</div>	
					</fieldset>
				</form>
				<div id='social_login_btns'></div>
			</div>

		</div>
	</body>
	<script type='text/javascript' src='js/jquery.js'></script>
	<script type='text/javascript' src='js/main_page.js'></script>
	<script type='text/javascript' src='social_plugin/login_auth.js'></script>
</html>