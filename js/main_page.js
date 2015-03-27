$(function(){
	$('#wyzzi_logo').on('click',function(){
		window.location.href = "index.php";
	});

	$('#plans').on('click',function(){
		window.location.href = "plans.php";
	});

	$('#contact').on('click',function(){
		window.location.href = "contact.php";
	});

	$('#register').on('click',function(){
		window.location.href = "register.php";
	});

	$('#login').on('click',function(){
		window.location.href = "login.php";
	});



	$('#passwd').on('input',function(){
		var re = /[A-Z].*\d|\d.*[A-Z]/;
		if(re.test($(this).val())){
			$('#error').text("");
		}else{
			$('#error').text("Password must contain an uppercase letter and a number");
		}
	});

});