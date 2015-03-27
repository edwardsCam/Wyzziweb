$(function(){
	
});

function saveFile(isToggle){
	var changes = '';
	if($('#design_canvas').is(':hidden')){
		changes = editor.getSession().getValue();
	}
	else{ 
		var doc = document.getElementById('design_canvas').contentDocument
		var serializer = new XMLSerializer();
		changes = serializer.serializeToString(doc);
	}
	makeAJAXCall({'call':8,'project_dir':localStorage.project_dir,'filename':localStorage.open_file,'content':changes}).done(function(){
		if(!isToggle){
			alert(localStorage.open_file + " saved successfully");
		}
		else{
			$('#design_canvas').attr('src',root_project_dir + localStorage.project_dir + "/" + localStorage.open_file);
			$('#design_canvas').show();
		}
	});
	
	saveStyles();
}

function saveStyles(){

}

function loadEditor(){
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/monokai");

	var file = localStorage.open_file;
	var fileext = file.split('.').pop();
	editor.getSession().setMode("ace/mode/"+fileext);

	makeAJAXCall({'call':7,'project_dir':localStorage.project_dir,'filename':localStorage.open_file}).done(function(data){
		editor.getSession().setValue(data);
	});
}

function updateEditor(){
	var doc = document.getElementById('design_canvas').contentDocument
	var serializer = new XMLSerializer();
	var content = serializer.serializeToString(doc);

	editor.getSession().setValue(content);
}