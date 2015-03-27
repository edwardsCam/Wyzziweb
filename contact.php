<!DOCTYPE HTML>
<html>
	<head>
		<title>WYZZI - A website builder for everyone</title>
		<link rel="stylesheet" type="text/css" href="style/main.css">
	</head>
	<body>
		<div class='main_content'>
			<?php require('includes/header_menu.php'); ?>
			<div id='contact_content'>
				<h2>Contact</h2>
				<form id='contact_form' method='post' action='includes/mail.php'>
					<label>Name</label>
					<input type='text' name='name' />
					<label>Email</label>
					<input type='email' name='email' />
					<label>Phone</label>
					<input type='phone' name='phone_num' />
					<label>Message</label>
					<textarea name='message'></textarea>
					<input type='submit' value='Send' />
				</form>

			</div>
		</div>
	</body>
	<script type='text/javascript' src='js/jquery.js'></script>
	<script type='text/javascript' src='js/main_page.js'></script>
</html>