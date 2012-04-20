<?php
class User {

	public function __construct($email) {
		global $db;
		$this->errors = array();
		$this->email = $email;
		try { 
			$user = $db->key($email)->limit(1)->getView('quickd','getUsersByMail')->rows;
		} catch(Exception $e) {
			$this->errors[] = array('success'=>'false', 'error'=>'user_not_found', 'e'=>$e->getMessage());
		}
		if (empty($user)) $this->doc_id = false;
		else {
			$this->doc_id = $user[0]->id;
			$this->user = $user[0]->value;
			$this->name = isset($this->user->name) ? $this->user->name : null;
		}
	}

	public function inviteUser() {
		global $db, $session;
		if(!$admin = $session->logged_admin()) return array('success'=>'false', 'error'=>'not_admin');
		if(!$this->doc_id) return array('success'=>'false', 'error'=>'user_not_found');
		try{
			$betakey = $this->calcBetaUserKey();
			$model = array('userbeta'=>$betakey);
			$result = json_decode($db->updateDocFullAPI('admin','inviteBetaUser',array('doc_id'=>$this->doc_id,'params'=>array('json'=>json_encode($model)))));
			if (isset($result->success) && $result->success=='true') {
				Mail::create('sendInvite', $this->email, array('betakey'=>$betakey, 'name'=>$this->name));
				return array('success'=>'true');
			} else if(isset($result->error)) {
				Log::add('Invite error: '.$result->error);
				return array('success'=>'false', 'error'=>$result->error);
			} else return "Error: ".$result;
		}
		catch(Exception $e){
			return array('success'=>'false','error'=>'database_error','e'=>$e->getMessage()); 
	
		}
	}

	private function calcBetaUserKey(){
		return strtolower(substr(md5(time().rand(1,1000000).rand(1,1000000)),0,8));
		/*global $db;
		$array = $db->getView('quickd','getUsers');
		$usedKeys = array();
		foreach($array->rows as $item){
			$user_id = $item->value;
			do {
				$userbeta = strtoupper(substr(md5(time().rand(1,1000000).rand(1,1000000)),0,8));
			} while (in_array($userbeta,$usedKeys));
			$usedKeys[] = $userbeta;
			$model = array('userbeta'=>$userbeta);
			$result = $db->updateDocFullAPI('quickd','setBetaUser',array('doc_id'=>$user_id, 'params'=>array('json'=>json_encode($model))));
			print_r($result.'<br/>');
		}*/
	}

	public function printUser() {
		echo "Email=".$this->email."<br/>";
		print_r($this->user);
		echo "<br/>";
	}
}