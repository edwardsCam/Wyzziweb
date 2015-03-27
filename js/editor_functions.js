var root_project_dir = "/wyzziweb/projects/";
var root_url = "/wyzziweb/includes/editor_functions.php";
var code_viewer;
var design_viewer;

$(document).ready(function(){
	buildToolbar();
	buildSideMenu();
	buildMainMenu();
	buildProjectScreen();

	$('#design_view').on('click',function(){
		openDesignEditor();
	});

	$('#code_view').on('click',function(){
		openTextEditor(); 
	});

	$('#close_btn').on('click',function(){
		closeFile();
	});

	if(typeof(localStorage.project_id) == "undefined"){
		displayProjectScreen();
	}

	if(typeof(localStorage.open_file) !== "undefined"){
		openFile(localStorage.open_file);
	}

	$('#save_btn').on('click',function(){
		saveFile();
	});

	$('#rename_submit').on('click',function(){
		var newName = $('#rename_file_txt').val();
		var file_name = $(this).data('file_name');
		makeAJAXCall({'call':11,'project_dir':localStorage.project_dir,'filename':file_name,'newFileName':newName}).done(function(data){
			$('#file_mod_screen').hide();
			$('#blackout').hide();
			alert(file_name + " changed to " + newName);
			closeFile();
			openFile(newName);
		});
	});

	$('#file_remove').on('click',function(){
		var file_name = $(this).data('file_name');
		makeAJAXCall({'call':12,'project_dir':localStorage.project_dir,'filename':file_name}).done(function(data){
			closeFile();
			$('#file_mod_screen').hide();
			$('#blackout').hide();
			alert(file_name + " deleted!");
		});
	});

	$('#file_mod_cancel').on('click',function(){
		$('#file_mod_screen').hide();
		$('#blackout').hide();
	});
});

  $(document).ajaxStop(function () {
      hideLoadScreen();
      if(typeof(localStorage.open_file) !== 'undefined')
      	$('.toolbox_icon').attr('disabled',false);
  });

function buildProjectScreen(){

	$("#db_check").change(function() {
		if(this.checked) {
			$('#addinput').append("<p><label class='dynamic_inp'>Database Name: <input type='text' id='db_name' name='database_name' /></label></p>");
			$('#addinput').append("<p><label class='dynamic_inp'>Database Username: <input type='text' id='db_username' name='database_username' /></label></p>");
			$('#addinput').append("<p><label class='dynamic_inp'>Database Password: <input type='text' id='db_pass' name='database_password' /></label></p>");
		} else
			$('.dynamic_inp').remove();
	});
	
	$('#create_project').on('click',function(){
		$('#project_select_screen').hide();
		$('#project_create_screen').show();
	});

	$('#pc_cancel').on('click',function(){
		$('#project_name').val("");
		$('#project_select_screen').show();
		$('#project_create_screen').hide();
	});

	$('#p_create').on('click',function(){
		$('#p_create').attr('disabled',true);
		$('#pc_cancel').attr('disabled',true);
		$('#create_project_loader').show();
		makeAJAXCall({'call':2,'p_name':$('#project_name').val(),'db_name':$('#db_name').val(),'db_user':$('#db_username').val(),'db_pass':$('#db_pass').val()}).done(function( data ) {
			setCurrentProject(data.project_id,data.project_directory,data.project_name,data.project_db,data.project_db_id);
			refreshProjects();
			$('#project_name').val("");
			$('#project_select_screen').show();
			$('#project_create_screen').hide();
			$('#p_create').attr('disabled',false);
			$('#pc_cancel').attr('disabled',false);
			$('#create_project_loader').hide();
		});
	});
}

function displayProjectScreen(){
	$('#blackout').show();
	$('#init_screen').show();
}

function buildToolbar(){
	$( "#accordion" ).accordion({
		heightStyle: "fill"
	});

	$( "#accordion-resizer" ).resizable({
		minHeight: 140,
		minWidth: 200,
		resize: function() {
			$( "#accordion" ).accordion( "refresh" );
		}
	});

	fetchToolBoxImages();
}

function fetchToolBoxImages(){
	makeAJAXCall({'call':3},"GET").done(function(data){
		for(var i = 0; i < data.length; i++){
			var tag_name = data[i].split('.',1).toString();
			var el_attr = {
				'id':tag_name + '_tag',
				'src':'images/html_images/'+data[i],
				'alt':tag_name + " tag", 
				'class':'toolbox_icon draggable',
				'title': tag_name +' tag',
				'type':'image',
				'disabled':true
			}
			createElement('toolbox','input','',el_attr,'');

			$('#'+tag_name +'_tag').on('click',function(){
				addElementToCanvas($(this).attr('id'));
			});
		}
	});
}

function getStyleOptions(){
	makeAJAXCall({'call':10},"GET").done(function(data){
		$.each(data,function(cat_name,value){
			//console.log(value);
			createElement('stylebox','fieldset','',{'id':cat_name +'_fldset'},'');
			var ind_title = capitalize(cat_name.replace(/_/g,' '));
			createElement(cat_name+'_fldset','legend',ind_title,'','');
			createElement(cat_name+'_fldset','div','',{'id':cat_name,'class':'style_pad'},'');

			$.each(value,function(index,value2){
				if(typeof(value2.name) !== 'undefined'){
					createElement(cat_name,'p',value2.name,{'class':'style_prop_label'},'');
					if(typeof(value2.value_fields.field.name) !== 'undefined'){
						makeFieldInput(cat_name,value2.value_fields.field,value2.name);
					}else{
						for(var i = 0; i < value2.value_fields.field.length; i++){
							makeFieldInput(cat_name,value2.value_fields.field[i],value2.name);
						}
					}
				}else{
					for(var i = 0; i < value2.length; i++){
						createElement(cat_name,'p',value2[i].name,{'class':'style_prop_label'},'');
						if(typeof(value2[i].value_fields.field.name) !== 'undefined'){
							makeFieldInput(cat_name,value2[i].value_fields.field,value2[i].name);
						}else{
							for(var j = 0; j < value2[i].value_fields.field.length; j++){
								makeFieldInput(cat_name,value2[i].value_fields.field[j],value2[i].name);
							}
						}
					}
				}
			});
		})
	});
}

function makeFieldInput(cat_name,field_arr,field_name){
	var id = '';
	if(field_arr.name.length == 0)
		id = field_name + '_id';
	else
		id = field_name + '_' + field_arr.name + '_id';
	
	var el_attr = {
		'class':'style_input',
		'placeholder':field_arr.name,
		'type':'text',
		'id': id
	};

	var el_data = {
		'property':field_name.replace('_','-')
	}

	if(field_arr.values.value.indexOf('HEX') != -1 || field_arr.values.value.indexOf('RGB') != -1){
		createElement(cat_name,'input','',el_attr,el_data);
		$('#'+id).colpick({
			layout:'hex',
			submit:0,
			colorScheme:'dark',
			onChange:function(hsb,hex,rgb,el,bySetColor) {
				if(!bySetColor) $(el).val(hex);
			}
		}).keyup(function(){
			$(this).colpickSetColor(this.value);
		});
	}
else if(field_arr.values.value.indexOf('px') != -1 || field_arr.values.value.indexOf('NUM') != -1 || field_arr.values.value.indexOf('URL') != -1){
          if(field_arr.values.value.indexOf('URL') != -1){
               if(field_arr.name == 'href')
                    //creat input box with title "URL" for links
                    createElement(cat_name, 'input','URL',el_attr,el_data);
               else
                    //create input box with title "Source URL" for media items
                    createElement(cat_name, 'input','Source URL',el_attr,el_data);
          }
          else
               createElement(cat_name,'input',field_arr.name,el_attr,el_data);
	}else{
		var att = {
			'class':'style_select',
			'id': id
		}
		createElement(cat_name,'select','',att,el_data);
		createElement(id,'option',field_arr.name, {'value':''},'');
		$.each(field_arr.values.value,function(index,value){
			var attr = {'value':value};
			createElement(id,'option',value,attr,'');
		});
	}

	$('#'+id).on('focusout',function(){
		var property = $(this).data('property');
		var val = $(this).val();
		console.log(property + ' -> ' + val);

		if(val != '' && (property.indexOf('color')!=-1 || $(this).attr('id').indexOf('color') != 1)){
			val = '#'+val;
		}
		var element = $('#design_canvas').contents().find('#'+localStorage.active_element_id);
		console.log(element);
		element.css(property,val);
	});
}

function buildSideMenu(){
	buildProjectList();
	buildAccountSettings();
	$('#side_menu_icon').on('click',function(){
		if($('#side_menu').is(':hidden'))
			refreshProjects();
		$('#dbTable_list_area').hide();
		$('#file_list_area').hide();
		$('#side_menu').toggle("slide");
	});
}

function buildMainMenu(){

	//Files Menu (editor_main)
	createElement('main_menu','li','Files',{'id':'file_list_menu'},'');
	$('#file_list_menu').on('click',function(){
		openFilesMenu();
	});

	$('#add_file').on('click',function(){
		$('#file_list_area').hide();
		$('#file_add_screen').show();
		$('#blackout').show();
	});

	$('#file_create_cancel').on('click',function(){
		$('#add_file_name').val("");
		$('#file_title').val("");
		$('#blackout').hide();
		$('#file_add_screen').hide();
	});

	$('#file_create_commit').on('click',function(){
		var filename = $('#add_file_name').val();
		var page_title = $('#file_title').val().trim();

		if(!filename.trim()){
			$('#file_add_screen').hide();
			$('#blackout').hide();
			alert("No filename inserted!");
			return;
		}else{
			filename = filename.trim().replace(/ /g,"_");
			makeAJAXCall({'call':5,'project_id':localStorage.project_id,'filename':filename,'page_title':page_title}).done(function(data){	
				$('#file_add_screen').hide();
				$('#blackout').hide();
				$('#add_file_name').val("");
				$('#file_title').val("");
				openFile(data);
			});
		}
	});

	//Database Table Menu (editor_main)
	function dataTypeHasSize(dataType){
		//return true if dataType has a user-defined size associcated with it
	}
	createElement('main_menu','li','Databases',{'id':'dbTable_list_menu'},'');
	$('#dbTable_list_menu').on('click',function(){
		openDatabaseMenu();
	});
	//Add Database Table button in Database Table Menu
	numRow = 0;
	$('#add_dbTable').on('click',function(){
		$('#dbTable_list_area').hide();
		$('#dbTable_add_screen').show();
		$('#blackout').show();
	});
	$('#dbTable_create_cancel').on('click',function(){
		$('#add_dbTable_name').val("");
		//Clear the columns table
		$('#blackout').hide();
		$('#dbTable_add_screen').hide();
		numRow = 0;
		$('.dbTable_row').remove();
	});
	$('#dbTable_add_new_column').on('click',function(){
		++numRow;
		$('#tbTable_columns_table')
			.append(
				'<tr id="row' + numRow + '" class="dbTable_row">'
				+'<form>'
				+'<td><input type="text" class="db_col_inp" id="columnName" placeholder="Column Name"></td>'
				+'<td><select id="dataType" class="db_col_select">'
					//those with //n have user defined lengths
					+'<option value="">[Select Data Type]</option>'	//n
					+'<option value="character">Character</option>'	//n
					+'<option value="varchar">VarChar</option>'	//n
					+'<option value="binary">Binary</option>'		//n
					+'<option value="boolean">Boolean</option>'
					+'<option value="varbinary">VarBinary</option>'	//n
					+'<option value="integerUserDef">Integer User-Def</option>'//n
					+'<option value="smallint">SmallInt</option>'
					+'<option value="integer">Integer</option>'
					+'<option value="bigint">BigInt</option>'
					+'<option value="decimal">Decimal</option>'	//n
					+'<option value="numeric">Numeric</option>'	//n
					+'<option value="floatUserDef">Float User-Def</option>'//n
					+'<option value="real">Real</option>'
					+'<option value="float">Float</option>'
					+'<option value="double">Double</option>'
					+'<option value="date">Date</option>'
					+'<option value="time">Time</option>'
					+'<option value="timestamp">TimeStamp</option>'
					+'<option value="interval">Interval</option>'
					+'<option value="array">Array</option>'
					+'<option value="multiset">Multiset</option>'
					+'<option value="xml">XML</option>'
				+'</select></td>'
				+'<td><input type="text" class="db_col_inp" id="dataLength" placeholder="Data Length (n)"></td>'
				+'<td><input type="checkbox" id="PrimaryKey" value="primaryKey">Primary Key</td>'
				+'<td><input type="checkbox" id="AutoInc" value="autoInc">Auto Increment</td>'
				+'<td><input type="checkbox" id="Nullable" value="nullable">Nullable</td>'
				+'<td><input type="text" class="db_col_inp" id="DefaultValue" placeholder="Default Value"></td>'
				+'</form>'
			+'</tr>');
	});
	$('#dbTable_create_commit').on('click',function(){
		var tableName = $('#add_dbTable_name').val();
		//Read in columns information from main editor.
		var ret_arr = [];
		if(!tableName.trim()){
			alert("No Table Name Inserted!");
			return;
		}
		//elseif improperly filled out table
		else{
			tableName = tableName.trim().replace(/ /g,"_");
			var columns = [];
			for( i = 1; i <= numRow; i++){
				rowname = "row"+i;
				col_name = 'col'+i;
				columns.push({
					rowName : rowname,
					cName   : $('#'+rowname).find('#columnName').val().trim().replace(/ /g,"_"),
					dType 	: $('#'+rowname).find('#dataType').val(),
					dLength : $('#'+rowname).find('#dataLength').val(),
					pKey 	: $('#'+rowname).find('#PrimaryKey').is(':checked'),
					aInc 	: $('#'+rowname).find('#AutoInc').is(':checked'),
					nu 		: $('#'+rowname).find('#Nullable').is(':checked'),
					defValue: $('#'+rowname).find('#DefaultValue').val()
				});
			}

			makeAJAXCall({'call':14,'project_db_id':localStorage.project_db_id,'table_name':tableName, 'columns':columns}).done(function(data){
				$('#dbTable_add_screen').hide();
				$('#blackout').hide();
			});
		}
	});
}

function openFilesMenu(){
	if($('#file_list_area').is(':hidden'))
		refreshFiles();
	$('#side_menu').hide();
	$('#dbTable_list_area').hide();
	$('#file_list_area').slideToggle();
}

function openDatabaseMenu(){
	if($('#dbTable_list_area').is(':hidden'))
		refreshDatabases();
	$('#side_menu').hide();
	$('#file_list_area').hide();
	$('#dbTable_list_area').slideToggle();
}

function buildAccountSettings(){
	createElement('side_menu','ul','',{'id':'account_functions'},'');
	createElement('account_functions','li','Account Settings',{'id':'acc_settings'},'');
	$('#acc_settings').on('click',function(){
		openAccountSettings();
	});
	createElement('account_functions','li','Log Out',{'id':'logout'},'');
	$('#logout').on('click',function(){
		localStorage.clear();
		window.location.href = "includes/logout.php";
	});
}

function buildProjectList(){
	if($('#side_menu > h2').length == 0){
		createElement("side_menu","h2","Projects","","");
		createElement('side_menu > h2','img',"",{'id':'add_project_link','src':'images/add_img.svg'},"");
		createElement("side_menu","img",'',{'id':'project_list_loader','src':'images/loader.gif','class':'loader_icon'},"");
		$('#add_project_link').on('click',function(){
			displayProjectScreen();
		});
	}

	refreshProjects();
}

function refreshProjects(){
	$('#project_menu_list').empty();
	$('#project_list').empty();
	$('#project_list_loader').show();
	makeAJAXCall({'call':1},"GET").done(function(data){
		for(var i = 0; i < data.length; i++){
			var el_attr = {'id':'project_'+data[i].project_id,'class':'project_list_item'};
			var el_data = {'project_id':data[i].project_id, 'project_dir':data[i].project_directory, 'project_name':data[i].name,'project_db':data[i].db_name,'project_db_id':data[i].pd_id};
			createElement('project_list','li','',el_attr,el_data);
			createElement('project_'+data[i].project_id,'h3',data[i].name,'','');
			createElement('project_'+data[i].project_id,'div',data[i].create_date,{'class':'create_date'},'');

			if(data[i].project_id == localStorage.project_id)	
				var elm_attr = {'id':'project_menu_'+data[i].project_id,'class':'project_menu_item selected'};
			else
				var elm_attr = {'id':'project_menu_'+data[i].project_id,'class':'project_menu_item'};

			createElement('side_menu','ul','',{'id':'project_menu_list'},'');
			createElement('project_menu_list','li',data[i].name,elm_attr,el_data);
			createElement('project_menu_'+data[i].project_id,'img','',{'id':'project_del_'+data[i].project_id,'class':'delete_icon','src':'images/del_img.png'},{'project_id':data[i].project_id});
			
			$('#project_'+data[i].project_id).on('click',function(){
				setCurrentProject($(this).data('project_id'),$(this).data('project_dir'),$(this).data('project_name'),$(this).data('project_db'),$(this).data('project_db_id'));
			});

			$('#project_menu_'+data[i].project_id).on('click',function(){
				setCurrentProject($(this).data('project_id'),$(this).data('project_dir'),$(this).data('project_name'),$(this).data('project_db'),$(this).data('project_db_id'));
				$('#project_menu_list li').removeClass('selected');
				$(this).addClass('selected');
			});

			$('#project_del_'+data[i].project_id).on('click',function(evt){
				evt.stopPropagation();
				if(confirm("Are you sure you want to delete this project? This can not be undone.")){
					makeAJAXCall({'call':6,'project_id':$(this).data('project_id')}).done(function(data){});
					alert('Project successfully deleted');
					refreshProjects();
					localStorage.clear();
				}
			});
		}
		$('#project_list_loader').hide();
	});
}

function setCurrentProject(p_id,p_dir,p_name,pd_name,pd_id){
	closeFile();
	localStorage.setItem('project_id',p_id);
	localStorage.setItem('project_dir',p_dir);
	localStorage.setItem('project_name',p_name);
	localStorage.setItem('project_db',pd_name);
	localStorage.setItem('project_db_id',pd_id);

	$('#init_screen').hide();
	$('#blackout').hide();
};

function openFile(filename){
	closeFile();
	localStorage.setItem('open_file',filename);
	openTextEditor(true);
	openDesignEditor(true);
	$('#open_file_name').text(filename);
	$('#view_modes').show();
	$('#file_list_area').hide();

	$('#save_btn').attr('disabled',false);
	$('#close_btn').attr('disabled',false);
	$('#save_btn').show();
	$('#close_btn').show();
}

function openDesignEditor(isFirst){
	reloadDesign(isFirst);
	getStyleOptions();
	$('.toolbox_icon').attr('disabled',false);
	$('#design_view').addClass('mode_selected');
}

function openTextEditor(isFirst){
	$('#stylebox').empty();
	if(isFirst){
		createElement('editor_content','div','',{'id':'editor'},{});
		loadEditor();
		//$('#editor').hide();
	}else{
		localStorage.removeItem('active_element_id');
		$('#design_view').removeClass('mode_selected');
		$('#design_canvas').hide();
		$('#editor').show();
		$('#code_view').addClass('mode_selected');
		updateEditor();
	}
	$('.toolbox_icon').attr('disabled',true);
}

function closeFile(){
	localStorage.removeItem('open_file');
	localStorage.removeItem('active_element_id');
	$('#open_file_name').text("");
	$('#design_canvas').remove();
	$('#editor').remove();
	$('#view_modes').hide();

	$('#save_btn').attr('disabled',true);
	$('#close_btn').attr('disabled',true);
	$('#save_btn').hide();
	$('#close_btn').hide();
	$('.toolbox_icon').attr('disabled',true);
}

function refreshFiles(){
	$('#files_loader_icon').show();
	makeAJAXCall({'call':4,'project_id':localStorage.project_id},"GET").done(function(data){
		$('#file_list').empty();
		for(var i = 0; i < data.length; i++){
			createElement('file_list','li',data[i],{'id':'project_file_'+i},{'filename':data[i]});
			$('#project_file_'+i).mousedown(function(e) {
				e.stopPropagation();
			    if(e.which == 1){
			    	openFile($(this).data('filename'));
			    }
			    if(e.which == 3) {
			        //alert($(this).data('filename'));
			        $('#rename_file_txt').attr('value',$(this).data('filename'));
			        $('#rename_submit').data('file_name',$(this).data('filename'));
			        $('#file_remove').data('file_name',$(this).data('filename'));
			        $('#file_mod_screen').show();
			        $('#blackout').show();
			    }
			});
		}
		$('#files_loader_icon').hide();
	});
}

function refreshDatabases(){
	$('#db_loader_icon').show();
		makeAJAXCall({'call':13,'project_db_id':localStorage.project_db_id},"GET").done(function(data){
			$('#db_list').empty();
			for(var i = 0; i < data.length; i++){
				createElement('db_list','li',data[i].table_name,{'id':'project_db_'+i},{'table_id':data[i].table_id});
				/*$('#project_file_'+i).mousedown(function(e) {
					e.stopPropagation();
				    if(e.which == 1){
				    	openFile($(this).data('filename'));
				    }
				    if(e.which == 3) {
				        //alert($(this).data('filename'));
				        $('#rename_file_txt').attr('value',$(this).data('filename'));
				        $('#rename_submit').data('file_name',$(this).data('filename'));
				        $('#file_remove').data('file_name',$(this).data('filename'));
				        $('#file_mod_screen').show();
				        $('#blackout').show();
				    }
				});*/
			}
			$('#db_loader_icon').hide();
		});
}

function openAccountSettings(){
	$('#blackout').show();
	$('#account_settings_screen').show();
}

//Creates an element that attaches to the given parent element.  alt_attr and alt_data are JSON arrays where the key is the attribute name and the values is the attribute value
function createElement(parent_el, tag, inner_txt, alt_attr, alt_data){
	var root_el = $('#' + parent_el);

	var el = $("<"+tag+" />");
	
	if(inner_txt != "")
		el.text(inner_txt);
	

	$.each(alt_attr, function(k,v) {
			if(k == "class")
				el.addClass(v);
			else
	  			el.attr(k,v);
	});
		
	$.each(alt_data, function(k, v) {
		el.data(k,v);
	});

	root_el.append(el);
}

//Send it the call ID, a JSON array with the data to pass, a success function name, and an error function name
function makeAJAXCall(dataValues,requestType){
	requestType = (typeof requestType === "undefined") ? "POST" : requestType;
	return $.ajax({
				type: requestType,
				url: root_url,
				data: dataValues,
				dataType: "json"
			});
}

function hideLoadScreen(){
	$('#load_screen').hide();
}

function capitalize(s)
{
    return s && s[0].toUpperCase() + s.slice(1);
}