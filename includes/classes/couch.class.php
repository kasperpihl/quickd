<?php
class Database {
	function __construct(){
		if(TEST == true) {
			$user = TEST_DB_USER;
			$pass = TEST_DB_PASS;
			$url = TEST_DB_URL;
		}
		else{
			$user = DB_USER;
			$pass = DB_PASS;
			$url = DB_URL;
		}
		$this->db = new couchClient('http://'.$user.':'.$pass.'@'.$url.':5984','quickd');
	}
	public function get($design,$view,$options = array()){
		if($)
	}
	public function save($design,$handler,$model,$doc_id = false){
		return json_decode($db->updateDocFullAPI($design,$handler,array('doc_id'=>$doc_id, 'params'=>array('json'=>json_encode($model)))));
	}
}
?>