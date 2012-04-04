<?php 
class Session {
	private $user_id;
	private $privileges;
	
	function __construct(){
		session_start();
		$this->check_login();
	}
	public function logged_user(){
		return (isset($this->user_id,$this->privileges) && $this->privileges >= 1) ? $this->user_id : false;
	}
	public function logged_dealer(){
		return (isset($this->user_id,$this->privileges) && $this->privileges >= 3) ? $this->user_id : false;
	}
	public function logged_admin(){
		return (isset($this->user_id,$this->privileges) && $this->privileges >= 5) ? $this->user_id : false;
	}
	
	private function check_login($cookie=true){
		global $db;
		unset($this->user_id);
		unset($this->privileges);
		$bool = false;
		if( $user_id = $this->get('user_id')){
			$this->user_id = $user_id;
			$bool = true;
		}
		if( $privileges = $this->get('privileges')){
			$this->privileges = $privileges;
		}
		if(!$bool && $cookie && isset($_COOKIE['md5string']) && $_COOKIE['md5string']){
			$md5string = $_COOKIE['md5string'];
			$array = explode('_-_',$md5string);
			try{
				if(!isset($array[0],$array[1])) return;
				$doc = $db->key($array[0])->limit(1)->getView('dealer','getPassById');
				$doc = $doc->rows;
				if(empty($doc)) return;
				$doc = $doc[0]->value;
				if(!property_exists($doc,'md5_password')) return;
				if($array[1] == md5($doc->md5_password . MD5_STRING))
					$this->login($array[0],$doc->privileges);
			}
			catch(Exception $e){
				return false;
			}
		}
	}
	public function login($id,$privileges=1,$cookie=false){
		global $dealer;
		$this->user_id = $_SESSION['user_id'] = $id;
		$this->privileges = $_SESSION['privileges'] = $privileges;
		if($cookie){
			$md5string = $id . '_-_' . md5($cookie . MD5_STRING);
			$expire=time()+60*60*24*30;
			setcookie('md5string',$md5string,$expire,'/');
		}
	}
	public function unsets($key){
		unset($_SESSION[$key]);
	}
	public function set($key,$value){
		return $_SESSION[$key] = $value;
	}
	public function get($key){
		if(isset($_SESSION[$key])){ return $_SESSION[$key]; }
		return false;
	}
	public function logout($type="all"){
		unset($this->user_id,$this->privileges,$_SESSION['user_id'],$_SESSION['privileges']);
		$expire=time()-60*60*24*30;
		setcookie('md5string','',$expire,'/');		
	}
}
?>