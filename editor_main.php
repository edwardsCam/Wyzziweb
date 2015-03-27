<?php
	require('includes/core_functions.php'); 
	
	verifyPermissions();
?>

<!DOCTYPE html>
<html>
	<head>
		<title>Wyzzi Editor</title>
		<link rel="stylesheet" type="text/css" href="style/editor.css">	
		<link rel="stylesheet" href="js/colpick/css/colpick.css" type="text/css"/>
	</head>
	<body>
		<script type='text/javascript' src='js/jquery.js'></script>
		<script type='text/javascript' src='js/jquery-ui.js'></script>
		<script src="js/colpick/js/colpick.js" type="text/javascript"></script>
		<script src="js/ace_src/ace.js" type="text/javascript" charset="utf-8"></script>
		<script type='text/javascript' src='js/editor_functions.js'></script>
		<script type='text/javascript' src='js/canvas_functions.js'></script>
		<script type='text/javascript' src='js/code_editor_functions.js'></script>

		<div id='side_menu'></div>
		<header>
			<img id='side_menu_icon' src='images/menu_img.svg' alt='side menu icon' />
			<img id='logo' src='images/wyzziFull.svg' alt='Wyzzi Logo' />

			<ul id='main_menu'></ul>

			<div id='file_list_area' class='list_area'>
				<div class='list_header'>
					Files 
					<div class='opt_container'>
						<img id='add_file' src='images/add_img.svg' alt='Add File' title='Add File' />
					</div>
				</div>
				<img src='images/loader.gif' class='loader_icon' id='files_loader_icon' />
				<ul id='file_list'></ul>
			</div>
			<div id='dbTable_list_area' class='list_area'>
				<div class='list_header'>Databases
					<div class='opt_container'>
						<img id='add_dbTable' src='images/add_img.svg' alt='Add Table' />
					</div>
				</div>
				<img src='images/loader.gif' class='loader_icon' id='db_loader_icon' />
				<ul id='db_list'></ul>
			</div>

			<ul id='view_modes'>
				<li id='design_view'>Design</li>
				<li id='code_view'>Code</li>
			</ul>
		</header>

		<div id='init_screen'>
			<div id='project_select_screen'>
				<h3>Select Project</h3>
				<ul id='project_list'></ul>
				<button id='create_project'>Create Project</button>
			</div>
			<div id='project_create_screen'>
				<h3>Create Project</h3>
				<div class='create_content'>
					<label>Project Name: <span class='side_note'>(can not be changed later)</span></label>
					<input type='text' id='project_name' name='p_name' />
					<label>
						Link project to a new database?
						<input type="checkbox" name="database_yn" id="db_check" value="yes" />
					</label>
					
					<div id="addinput"></div>

					<img src='images/loader.gif' class='loader_icon' id='create_project_loader' />

					<button id='p_create'>Create</button>
					<button id='pc_cancel'>Cancel</button>
				</div>
			</div>
		</div>
		<div id='blackout'></div>
		<div id='load_screen'><img src='images/loader.gif' /></div>
		<div id='account_settings_screen'></div>
		<div id='file_mod_screen'>
			<fieldset>
				<legend>Rename File</legend>
				<input type='text' id='rename_file_txt' />
				<input type='submit' id='rename_submit' value='Rename File'/>
			</fieldset>
			<fieldset>
				<legend>Delete File</legend>
				<input type='submit' id='file_remove' value='Delete File' />
			</fieldset>
			<input type='submit' id='file_mod_cancel' value='Cancel' />
		</div>

		<div id='file_add_screen'>
			<input type='text' class='fc_field' id='add_file_name' placeholder='Page Name' />
			<input type='text' class='fc_field' id='file_title' placeholder='Page Title' />
			<div class='btn_box'>
				<button id='file_create_commit'>Create File</button>
				<button id='file_create_cancel'>Cancel</button>
			</div>
		</div>

		<div id='dbTable_add_screen'>
			<input type='text' class='fc_field' id='add_dbTable_name' placeholder='Table Name' />
			<table id='tbTable_columns_table'>
				<tr id='row0'>
					<td><button id='dbTable_add_new_column'>+</button></td>
				</tr>

			<!-- Columns - This will become some kind of table with the following properties -->
			<!-- List of Data Types -->
			<!-- Primary Key selector -->
			<!-- auto Increment Selector -->
			<!-- Check Box for nullability of column -->
			<!-- set default value -->	
			</table>
			
			<div class='btn_box'>
				<button id='dbTable_create_commit'>Create Table</button>
				<button id='dbTable_create_cancel'>Cancel</button>
			</div>
		</div>
		
		<div id="accordion-resizer" class="ui-widget-content">
			<div id="accordion">
				<h3>Toolbox</h3>
				<div id='toolbox'></div>
				<h3>Style</h3>
				<div id='stylebox'></div>
				<h3>Attributes</h3>
				<div id='attrbox'></div>
			</div>
		</div>
		<div id='open_file_name'></div>
		<button id='save_btn' disabled>Save File</button>
		<button id='close_btn' disabled>Close File</button>

		<div id='editor_content'></div>
	</body>
</html>