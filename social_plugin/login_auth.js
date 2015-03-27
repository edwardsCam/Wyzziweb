//Specify which div to attach to
var root_div = $('#social_login_btns');
//What do you want it to say on top
var header_txt = "Or sign in with social media:";

//Which sites to integrate OAUTH for (supports Google, Facebook, and LinkedIn)
var sites = ["Google","Facebook","LinkedIn"];

//Size of the icons
var width = 30;
var height = 30;

var FBID = "288873961310931";
var GoogleID = "709661517387-7ortnnvdjbs2b5l5cq7ubp1phojpf8i5.apps.googleusercontent.com";
var LinkedInID = "";


$(document).ready(function(){
	
	createSocialIcons();

	importOAuthJS();

	if(sites.indexOf('Google') != -1){
		initGoogle();
	}

	if(sites.indexOf('Facebook') != -1){
		initFB();
	}

	if(sites.indexOf('LinkedIn') != -1){
		initLinkedIn();
	}

});

function importOAuthJS(){
	site_src = ["https://apis.google.com/js/client:platform.js","//connect.facebook.net/en_US/all.js"];

	for(var i = 0; i < site_src.length; i++){
		var d = document.createElement("script");
		d.type = "text/javascript";
		d.src = site_src[i];

		if(sites[i] == 'Google'){
			d.async = 1;
			d.defer = 1;
		}

		$("head").append(d);
	}
}

function createSocialIcons(){
	root_div.append($('<span />').addClass("social_header").text(header_txt));

	var social_list = $('<ul />').attr('id','social_media_icons');

	root_div.append(social_list);

	var list = $('#social_media_icons');

	for(var i = 0; i < sites.length; i++){
		var el = $('<li />').attr('id',sites[i].toLowerCase());
		el.attr('style',"display:inline-block; margin:10px 10px 0");
		el.html("<img src='social_plugin/images/"+sites[i].toLowerCase()+".png' alt='"+sites[i]+" log in' title='Log in with "+sites[i]+"' />");
		list.append(el);
	}
}


function initFB(){
		
	$('#facebook').on('click',function(){
		window.fbAsyncInit = function(){
			FB.init({
				appId : FBID,
				cookie : true,
				xfbml : false,
				version : 'v2.1'
			});

			FB.getLoginStatus(function(response){
				signInCallBack(response);
			});
		}
	});
}

function initGoogle(){
	var g_icon = $('#google');

	g_icon.on("click",function(){
		gapi.auth.signIn(
			{
				'clientid' : GoogleID,
				'cookiepolicy' : 'single_host_origin',
				'callback' : 'signInCallBack',
				'scope' : 'https://www.googleapis.com/auth/plus.login'
			}
		);
	});
}

function initLinkedIn(){

}

function signInCallBack(data){
	console.log(data);
}