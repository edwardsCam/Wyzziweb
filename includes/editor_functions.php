<?php
	require('configuration/config.php');

	session_start();

	require('configuration/database.php');

	$db = new database;

	$db->connect_to_db();

	$call = $_REQUEST['call'];

	if(!isset($_SESSION['user_id'])){
		header('Location: /wyzziweb/login.php?e=6');
	}

	switch($call){
		case 1:	$projects = getProjects($_SESSION['user_id']);
				date_default_timezone_set('America/Denver');
				for($i = 0; $i < count($projects); $i++){
					$projects[$i]['create_date'] = date('m/d/Y',strtotime($projects[$i]['create_date']));
				}
				die(json_encode($projects));
				break;
		case 2: if(!empty($_REQUEST['db_name']) && !empty($_REQUEST['db_user']) && !empty($_REQUEST['db_pass'])){
					$proj_arr = createProject($_SESSION['user_id'],$_REQUEST['p_name'],$_REQUEST['db_name'],$_REQUEST['db_user'],$_REQUEST['db_pass']);
				}else{
					$proj_arr = createProject($_SESSION['user_id'],$_REQUEST['p_name'],'','','');
				}
				die(json_encode($proj_arr));
				break;
		case 3: $images = getToolbarImages();
				die(json_encode($images));
				break;
		case 4: $files_list = getFilesList($_REQUEST['project_id']);
				die(json_encode($files_list));
				break;
		case 5: $proj_files = createFile($_REQUEST['project_id'],$_REQUEST['filename'],$_REQUEST['page_title']);
				die(json_encode($proj_files));
				break;
		case 6: $msg = removeProject($_REQUEST['project_id']);
				die(json_encode($msg));
				break;
		case 7: $file_contents = getFileData($_REQUEST['project_dir'],$_REQUEST['filename']);
				die(json_encode($file_contents));
				break;
		case 8: $file_data = saveFileData($_REQUEST['project_dir'],$_REQUEST['filename'],$_REQUEST['content']);
				die(json_encode($file_data));
				break;
		case 9: $tag_data = getTagData($_REQUEST['tag_name']);
				die(json_encode($tag_data));
				break;
		case 10: $css_data = getCSSStyles();
				 die(json_encode($css_data));
				 break;
		case 11: $success = renameFile($_REQUEST['project_dir'],$_REQUEST['filename'],$_REQUEST['newFileName']);
				 die(json_encode($success));
				 break;
		case 12: $success = removeFile($_REQUEST['project_dir'],$_REQUEST['filename']);
				 die(json_encode($success));
				 break;
		case 13: $tables = getDBTables($_REQUEST['project_db_id']);
				 die(json_encode($tables));
				 break;
		case 14: $success = createTable($_REQUEST['project_db_id'],$_REQUEST['table_name'], $_REQUEST['columns']);
				 die(json_encode($success));
				 break;
		case 15: $success = dropTable($_REQUEST['table_id']);
				 die(json_encode($success));
				 break;
		default: break;
	}

	function getProjects($user_id){
		global $db;
		$SQL = "SELECT id as project_id, name, md5(id) as project_directory,create_date,db_name, pd_id FROM projects p JOIN project_user_link pu ON p.id = pu.project_id 
				JOIN project_databases db ON db.project_id = id WHERE user_id = ?;";
		$params = array($user_id);

		return $db->executeCleanQuery($SQL,$params);
	}

	function createTable($project_db, $table_name, $columns){
		global $db;

		$Table_SQL = "INSERT INTO pdb_tables(pdb_id, table_name) VALUES(?, ?);";
		$params = array($project_db,$table_name);

		$t_id = $db->executeCleanQuery($Table_SQL,$params);

		$INS_COL_SQL = "INSERT INTO pdb_table_columns(table_id,column_name,data_type,auto_incr,nullable,primary_key,default_val) VALUES(?,?,?,?,?,?,?);";
		for($i = 0; $i < sizeof($columns); $i++){
			$col_name = $columns[$i]['cName'];
			$dType = $columns[$i]['dType'];
			$dLength = $columns[$i]['dLength'];
			$pKey = $columns[$i]['pKey'];
			$aInc = $columns[$i]['aInc'];
			$nu = $columns[$i]['nu'];
			$defValue = $columns[$i]['defValue'];

			$param_arr = array($t_id,$col_name,$dType,$aInc,$nu,$pKey,$defValue);
			$db->executeCleanQuery($INS_COL_SQL,$param_arr);
		}

		return true;
	}

	function dropTable($table_id){
		global $db;

		$SQL = "DELETE FROM pdb_table_columns WHERE table_id = ?";
		$params = array($table_id);

		$SQL1 = "DELETE FROM pdb_tables WHERE table_id = ?";

		return $db->executeCleanQuery($SQL,$params) && $db->executeCleanQuery($SQL1,$params);
	}

	function getDBTables($db_id){
		global $db;
		$SQL = "SELECT table_id, table_name FROM pdb_tables WHERE pdb_id = ?;";
		$params = array($db_id);

		return $db->executeCleanQuery($SQL, $params);
	}

	function getToolbarImages(){
		$im = scandir(TOOLBAR_IMG_DIR);
		array_shift($im);
		array_shift($im);

		return $im;
	}

	function getFilesList($project_id){
		$r_dir = PROJECT_ROOT . md5($project_id) . DS;
		$file_list = scandir(PROJECT_ROOT . md5($project_id));

		$file_arr = array();

		foreach($file_list as $file){
			if(!is_dir($r_dir . $file)){
				array_push($file_arr,$file);
			}
		}
		return $file_arr;
	}

	function createFile($p_id,$filename,$pageTitle){
		$file = PROJECT_ROOT . md5($p_id) . DS;

		$path_parts = pathinfo($filename);
		$style_name = $file . 'styles' . DS . $path_parts['filename'] . '_style.css';

		$file_handle = fopen($file . $path_parts['filename'] . '.php', 'w') or die("can't open file");

		$default_txt = "<!DOCTYPE html>".
					   "<html>".
					   "<head>".
						"<title>".$pageTitle."</title>".
						"<link rel='stylesheet' type='text/css' href='styles/".$path_parts['filename'] . "_style.css' >".	
						"</head><body></body></html>";

		fwrite($file_handle, $default_txt);
		fclose($file_handle);

		$style_handle = fopen($style_name, 'w') or die("can't open file");
		fclose($style_handle);

		chmod($file,0777);

		return $path_parts['filename'] . '.php';
	}

	function createProject($user_id,$name,$db_name,$db_user,$db_pass){
		global $db;
		$SQL = "INSERT INTO projects(name,create_date) VALUES (?,NOW());";
		$ins_params = array($name);

		$p_id = $db->executeCleanQuery($SQL, $ins_params);

		$Insert_SQL = "INSERT INTO project_user_link(project_id,user_id) VALUES(?,?);";
		$pu_params = array($p_id,$user_id);

		$db->executeCleanQuery($Insert_SQL,$pu_params);

		if(!empty($db_name) && !empty($db_user) && !empty($db_pass)){
			$dbSQL = "INSERT INTO project_databases(project_id,db_name,db_user,db_password) VALUES(?,?,?,?);";
			$pd_params = array($p_id,$db_name,$db_user,$db_pass);
			$pd_id = $db->executeCleanQuery($dbSQL,$pd_params);
		}else{
			$pd_id = 'na';
			$db_name = 'na';
		}

		$dir_name = md5($p_id);
		$path = '../projects/' . $dir_name;
		mkdir($path,0777);
		mkdir($path . DS . "styles");

		$_SESSION['project_id'] = $p_id;
		$_SESSION['project_name'] = $name;

		$project_arr = array('project_id' => $p_id,'project_name' => $name,'project_directory' => $dir_name,'project_db'=>$db_name,'project_db_id'=>$pd_id);
		return $project_arr;
	}

	function removeProject($project_id){
		global $db;
		$SQL = "DELETE FROM project_user_link WHERE project_id = ?";
		$params = array($project_id);

		$db->executeCleanQuery($SQL, $params);

		$SQL1 = "DELETE FROM projects WHERE id = ?";
		$db->executeCleanQuery($SQL1, $params);

		$dir = PROJECT_ROOT . md5($project_id);
		$it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
		$files = new RecursiveIteratorIterator($it,
		             RecursiveIteratorIterator::CHILD_FIRST);
		foreach($files as $file) {
		    if ($file->getFilename() === '.' || $file->getFilename() === '..') {
		        continue;
		    }
		    if ($file->isDir()){
		        rmdir($file->getRealPath());
		    } else {
		        unlink($file->getRealPath());
		    }
		}
		rmdir($dir);
	}

	function getFileData($project_dir,$filename){
		$file_content = file_get_contents(PROJECT_ROOT .$project_dir . "/" . $filename);
		return $file_content;
	}

	function saveFileData($project_dir,$filename,$contents){
		$url = PROJECT_ROOT . $project_dir . "/" . $filename;
		file_put_contents($url, $contents);
		return file_get_contents($url);
	}

	function getTagData($tag_name){	
		$xml=simplexml_load_file(HTML_XML_DIR . $tag_name . ".xml") or die("Error: Cannot create object");
		$fData = json_decode(json_encode((array) $xml), 1);

		//die($fData['attribute_list']);

		$xml_glob_attr = simplexml_load_file(HTML_XML_DIR . "global_attributes.xml") or die("Error: Cannot get global attributes");	
		$globData = json_decode(json_encode((array) $xml_glob_attr), 1);

		if(isset($fData['attribute_list']['attribute']))
			$fData['attribute_list']['attribute'] = array_merge($fData['attribute_list']['attribute'],$globData['attribute_list']);
		else
			$fData['attribute_list'] = $globData['attribute_list'];

		return $fData;
	}

	function getCSSStyles(){
		$xml = simplexml_load_file(HTML_XML_DIR . "css_attributes.xml") or die("Error: Cannot open style attributes");
		$styleData = json_decode(json_encode((array) $xml), 1);

		return $styleData;
	}

	function renameFile($proj_dir, $file_name, $newName){
		$old_path = PROJECT_ROOT . $proj_dir . DS .$file_name;
		$new_path = PROJECT_ROOT . $proj_dir . DS . $newName;
		return rename($old_path, $new_path);
	}

	function removeFile($proj_dir, $file_name){
		return unlink(PROJECT_ROOT . $proj_dir . DS . $file_name);
	}

	function XMLToArray($xml)
	{
	  if ($xml instanceof SimpleXMLElement) {
	    $children = $xml->children();
	    $return = null;
	  }

	  foreach ($children as $element => $value) {
	    if ($value instanceof SimpleXMLElement) {
	      $values = (array)$value->children();
	     
	      if (count($values) > 0) {
	        $return[$element] = XMLToArray($value);
	      } else {
	        if (!isset($return[$element])) {
	          $return[$element] = (string)$value;
	        } else {
	          if (!is_array($return[$element])) {
	            $return[$element] = array($return[$element], (string)$value);
	          } else {
	            $return[$element][] = (string)$value;
	          }
	        }
	      }
	    }
	  }
	 
	  if (is_array($return)) {
	    return $return;
	  } else {
	    return $false;
	  }
	} 
?>
