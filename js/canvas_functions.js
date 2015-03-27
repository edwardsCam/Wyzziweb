var elementCount = 0;
var root_im_dir = "http://localhost/wyzziweb/images/";
$(function(){
});

function reloadDesign(isFirst){
	if(isFirst){
		$('#editor').hide();
		createElement('editor_content','iframe','',{'id':'design_canvas','src':root_project_dir + localStorage.project_dir + "/" + localStorage.open_file},'');
	}else{
		$('#code_view').removeClass('mode_selected');
		$('#editor').hide();
		saveFile(true);
	}

	var dv = $('#design_canvas').contents();
	var dv_elems = dv.find('body').find('*');
	var cont_arr = [];
	$.each(dv_elems,function(k,v){
		cont_arr.push($(v).attr('id'));
	});

	$.each(cont_arr,function(k,v){
		dv.find('body').find('#'+v).on('click',function(){
			setActiveElement(this);
		});
	});
	//console.log(cont_arr);
}

function addElementToCanvas(tag){
	var tag_data = fetchTagData(tag);
}

function fetchTagData(tag){
	var tag_name = tag.replace('_tag','');
	var return_data;
	makeAJAXCall({'call':9,'tag_name':tag_name}).done(function(data){
		appendToCanvas(tag_name,data);
	});
}

function appendToCanvas(tag_name,data){
	console.log(tag_name);
	var canvas = $('#design_canvas').contents().find('body');
	var el = $('<'+data.tag+' />');
	var id = data.tag + '_' + elementCount;
	el.attr('id',id);
	el.addClass('draggable');

	if(data.tag == 'img')
	{
		el.attr('src', root_im_dir + 'defaultImage.svg');
	}
	else if(data.tag == 'a')
	{
		el.attr('title','Link');
		el.attr('href','http://www.google.com');
		el.text('link');
	}
	else if(data.tag == 'source')
	{
		el.attr('src', root_im_dir + 'defaultSource.svg');
	}
	else
	{
		el.text("test");
	}

	canvas.append(el);

	el.on('click',function(){
		el.attr('contenteditable',true);
		setActiveElement(this);
	});
	elementCount++;
}

function fillAttributeBox(element){
	$('#attrbox').empty();
	console.log(element);

	
}

function setActiveElement(me){
	console.log($(me).attr('id'));
	localStorage.active_element_id = $(me).attr('id');
	fillAttributeBox(me);
}