<?php 

class database{
	public $root_db = 'richar19_wyzzi';
	public $server_name = 'wyzziweb.com:3306';
	public $root_db_user = 'richar19_wyzzi';
	public $root_db_pass = 'WyZZ1P@ss';
	public $connection;
	public $error = false;

	function connect_to_db(){
		$this->connection = new mysqli($this->server_name,$this->root_db_user,$this->root_db_pass,$this->root_db);

		if($this->connection->connect_error){
			$this->error = "Connection Failed: " . $this->connection->connect_error;
		}
	}

	function executeCleanQuery($query,$params){
		$type_string = '';
		$param_arr = array();

		if(!empty($params)){
			for($i = 0; $i < count($params); $i++){
				$type = gettype($params[$i]);
				$type_string .= $type[0];

				$param_arr[$i] = $this->connection->real_escape_string(htmlentities($params[$i]));
			}

			array_unshift($param_arr,$type_string);

			if(!$stmt = $this->connection->prepare($query))
				$error = "Unable to prepare statement";

			call_user_func_array(array($stmt, "bind_param"),$this->refValues($param_arr));

			if (!$stmt->execute())
				$error = "Unable to execute statement";

			$result = $stmt->get_result();

			if($result && (strstr($query,"SELECT") || strstr($query,"select")))
				return $result->fetch_all(MYSQLI_ASSOC);
			else{
				return $this->connection->insert_id;
			}
		}else if(strstr($query,"SELECT") || strstr($query,"select")){
			$result = $this->connection->query($query);
			return $result->fetch_all(MYSQLI_ASSOC);
		}else{
			return true;
		}
	}

	function refValues($arr){
	    if (strnatcmp(phpversion(),'5.3') >= 0) //Reference is required for PHP 5.3+
	    {
	        $refs = array();
	        foreach($arr as $key => $value)
	            $refs[$key] = &$arr[$key];
	        return $refs;
	    }
	    return $arr;
}
}
?>