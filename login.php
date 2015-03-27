<?php 
	require('includes/core_functions.php');
?>
<!DOCTYPE HTML>
<html>
	<head>
		<title>Log in to WYZZI - A website builder for everyone</title>
		<link rel="stylesheet" type="text/css" href="style/main.css" />
	</head>
	<body>
		<div class='main_content'>
			<?php require('includes/header_menu.php'); ?>

			<div id='content'>
				<form id='login_frm' method='post' action='includes/login_processing.php'>
					<fieldset>
						<legend>Log In</legend>
						<div class='pad'>
							<span id='error'><?php if(!empty($error_msg)){echo $error_msg;}?></span>
							<label>Email</label><input class='inp_field' type='email' id='email' name='email_addr' />
							<label>Password</label><input class='inp_field' type='password' id='pass' name='passwd' />
							<input type='submit' value='Log In' name='login' />
							<a href='forgot_pass.php' id='forgot_passwd'>Forgot Password</a>
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