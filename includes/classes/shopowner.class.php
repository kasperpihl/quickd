<?php
class Shopowner {
	public static function register($model, $type='subscribe'){
		global $db,$session;
		try{
			$email = isset($model['email']) ? strtolower($model['email']) : '';
			if (!isValidEmail($email)) return array('success'=>'false','error'=>'email_not_valid', 'data'=>$model);
			$password = isset($model['password']) ? $model['password'] : null;
			if(($password && strlen($password) < 6) || (!$password && $type=='dealer')) return array('success'=>'false','error'=>'password_must_be_6_long');
			$user = (object) json_decode(self::checkEmail($email));
			if(!$email || $user->success=='true') {
				if ($type==='subscribe') {
					$session->login($user->data->id,$user->data->value->privileges);
					return array('success'=>'true', 'data'=>$user);
				}
				return array('success'=>'false','error'=>'user_exists', 'data'=>$user);
			}
			$update = 'registerUser';
			if ($type==='dealer') {
				if(BETA_MODE&&$type=='dealer'){
					if(!isset($model['betacode'])) return array('success'=>'false','error'=>'betacode_must_be_included');
					$betakoder = $db->getDoc('configuration');
					$betakoder = $betakoder->betakoder;
					
					if(!property_exists($betakoder,$model['betacode'])) return array('success'=>'false','error'=>'wrong_betacode');
					$model['name'] = $betakoder->$model['betacode'];
				}
				$model['hours'] = 25;
				$model['privileges'] = 3;
			} else {
				$model['privileges'] = 1;
			}
			$model['password'] = $password?md5(MD5_STRING.$model['password']):'null';
			$result = json_decode($db->updateDocFullAPI('dealer',$update,array('params'=>array('json'=>json_encode($model)))));
			
			if($result->success == 'true'){
				if ($type=='dealer') $result->data->hours = $model['hours'];
				$result->data->email = $email;
				$session->login($result->data->id,$model['privileges']);
				Mail::sendBetaConfirmation($email);
			}
			
			return $result;
		}
		catch(Exception $e){
			return array('success'=>'false','error'=>'database_error','function'=>'shopowner_register','e'=>$e->getMessage()); 
		}
	}

	public static function fb_connect() {
		global $db,$session,$facebook;

		// Get User ID
		$user = $facebook->getUser();
		if ($user) {
			try {
		    // Proceed knowing you have a logged in user who's authenticated.

		    $user_profile = (object) $facebook->api('/me');
		    $email = $user_profile->email;
		    //User exist?
		    if (!$email) return array('success'=>'false','error'=>'no_fb_email','function'=>'fb_connect','data'=>$user_profile);

		    //User exists?
	    	$user = (object) json_decode(self::checkEmail($email));
	    	
	    	if($user&&$user->success=='true'&&isset($user->data,$user->data->value,$user->data->value->fb_info)) {
	    		//Fb user already exists
	    		$fb = $user->data->value->fb_info;
	    		if (isset($fb->lastUpdate) && $fb->lastUpdate >= time()-7*24*60*60) {
	    			$session->login($user->data->id,$user->data->value->privileges);
	    			return  array('success'=>'true', 'id'=>$fb->id, 'updated'=>'no');
	    		}
	    			
	    	} else $user = false;

		    // Getting facebook info
		    $fb_info = new stdClass();
			  $fb_info->id = intval($user_profile->id);
			  $fb_info->lastUpdate = time();
			  $values = array('name', 'gender', 'locale');
			  foreach ($values as $key) {
			    if (isset($user_profile->$key)&& !empty($user_profile->$key)) $fb_info->$key = $user_profile->$key;
			  }
			  if (isset($user_profile->location, $user_profile->location['id'])) {
			  	$location = (object) $facebook->api('/'.$user_profile->location['id']);
			  	$fb_info->city->name = $location->name;
			  	$fb_info->city->lat = floatval($location->location['latitude']);
			  	$fb_info->city->lng = floatval($location->location['longitude']);
			  }
			  $model = new stdClass();
			  $model->email = $email;
			  $model->password = 'null';
			  $model->privileges = 1;
			  $model->fb_info = $fb_info;
			  
		    
		    if ($user) {
		    	//updating user;
		    	$result = json_decode($db->updateDocFullAPI('dealer','updateFbInfo',array('doc_id'=>$user->data->id, 'params'=>array('json'=>json_encode($model)))));
		    } else {
		    	//new user
		    	$result = json_decode($db->updateDocFullAPI('dealer','updateFbInfo',array('params'=>array('json'=>json_encode($model)))));
		    	//Send mail
		    	if (isset($user_profile->first_name)) $name = $user_profile->first_name;
		    	else $name = false;
		    	Mail::sendBetaConfirmation($email, $name);
		    }
		    if($result && $result->success == 'true'){
					$result->data->email = $email;
					$session->login($result->data->id,$model->privileges);
				}
				return $result;
		    
		  } catch (FacebookApiException $e) {
		    return array('success'=>'false','error'=>'facebook_error','function'=>'fb_connect','e'=>$e->getMessage(),'data'=>$user_profile);
		  } catch(Exception $e){
				return array('success'=>'false','error'=>'database_error','function'=>'fb_connect','e'=>$e->getMessage(), 'data'=>$model); 
			}
		} else {
			return array('success'=>'false','error'=>'facebook_not_logged_in','function'=>'fb_connect');
		}
	}

	public static function checkEmail($email){
		global $db;
		try{
			$user = $db->key($email)->limit(1)->getView('dealer','getUsersByMail');
			$user = $user->rows;
			if (empty($user)) return  json_encode(array('success'=>'false','error'=>'no_user','function'=>'checkEmail'));
			else return json_encode(array('success'=>'true','data'=>$user[0]));
		}
		catch(Exception $e){ return json_encode(array('success'=>'false','error'=>'database_error','function'=>'checkEmail', 'e'=>$e->getMessage())); }
	}
	public static function requestNewPassword($model){
		global $db;
		$email = $model['email'];
		$type = isset($model['type']) ? $model['type'] : 'dealer';
		try{
			$user = self::checkEmail($email);
			$user = json_decode($user);
			if($user->success != 'true') return json_encode($user);
			$user = $user->data;
			
			if(isset($user->value->newPass,$user->value->newPass->endtime)){
				$end = $user->value->newPass->endtime;
				//if($end > time()) return array('success'=>'false','error'=>'cant_request_until_24_hours', 'data'=>$model);
			}
			$doc_id = $user->id;
			$endtime = time() + (60*60*24);
			$url = md5(MD5_STRING.$user->id.$endtime);
			$model = array('newPass'=>array('endtime'=>$endtime, 'url'=>$url));
			$result = json_decode($db->updateDocFullAPI('dealer','requestNewPassword',array('doc_id'=>$doc_id,'params'=>array('json'=>json_encode($model)))));
			if($result->success != 'true') return json_encode($result);
			switch($type){
				case 'dealer':
					Mail::sendNewPasswordForDealer($email,$url);
				break;
				case 'user':
					Mail::sendNewPasswordForUser($email,$url);
				break;
			}
			return $result;

		}
		catch(Exception $e){ return json_encode(array('success'=>'false','error'=>'database_error','function'=>'requestNewPassword', 'e'=>$e->getMessage())); }
	}
	public static function resetPassword($model){
		if(isset($model['email'])) return self::requestNewPassword($model);
		if(!isset($model['password'],$model['id'],$model['doc_id'])) return array('success'=>'false','error'=>'password_or_id_not_provided');

		global $db;
		try{
			$doc_id = $model['doc_id'];
			$newPass = md5(MD5_STRING.$model['password']);
			$model = array('md5_password'=>$newPass);
			$result = json_decode($db->updateDocFullAPI('dealer','editUser',array('doc_id'=>$doc_id,'params'=>array('json'=>json_encode($model)))));
			return $result;
			
		}
		catch(Exception $e){
			return array('success'=>'false','error'=>'database_error','e'=>$e->getMessage()); 
	
		}

	}
	public static function getShopowner(){
		
	}
	public static function getStuffForMobile(){
		$results = Shopowner::get('dealsNTemplates');
		$deals = array();
		$templates = array();
		if($results['success'] == 'true'){
			$results = $results['results'];
			$test = array_filter($results,function($item){
				if($item->value->type == 'template') return true;
				else if($item->value->type == 'deal'){ 
					$time = (int)$item->value->end;
					return ($time > time()) ? true : false;
				}
			});
			return json_encode($test);
		}
		else return $results;
	}
	public static function login($model,$stuff=true){
		if(!isset($model['email'],$model['password'])) return array('success'=>'false','error'=>'most_include_both_email_and_password');
		$email = strtolower($model['email']);
		$password = $model['password'];
		global $session,$db;
		try{
			$dealer = $db->key($email)->limit(1)->getView('dealer','getUsersByMail');
			$dealer = $dealer->rows;
			if(empty($dealer)) return array('success'=>'false','error'=>'username_not_exist');
			$id = $dealer[0]->id;
			$dealer = $dealer[0]->value;
			if (!isset($dealer->md5_password)||empty($dealer->md5_password) || $dealer->md5_password=='null' || $dealer->md5_password=='undefined') return array('success'=>'false','error'=>'pass_not_set');
			if(md5(MD5_STRING.$password) != $dealer->md5_password) return array('success'=>'false','error'=>'wrong_pass');
			unset($dealer->md5_password);
			$session->login($id,$dealer->privileges);
			if($stuff){
				$ownerStuff = self::get('all');
				$ownerStuff = ($ownerStuff['success'] == 'true') ? $ownerStuff['results'] : '';
			}
			else $ownerStuff = '';
			
			return array('success'=>'true','dealer'=>$dealer,'stuff'=>$ownerStuff);		
		}
		catch(Exception $e){ return array('success'=>'false','error'=>'database_error','e'=>$e->getMessage()); }
	}
	public static function save($type,$model){
		global $db,$session;
		if(!$session->logged_dealer()) return array('success'=>'false','error'=>'not_logged_in');
		$shopowner = $session->logged_dealer();
		$doc_id = $shopowner;
		switch($type){
			case 'shops':
				$update = 'addEditShop';
			break;
			case 'templates':
				$update = 'addEditTemplate';
			break;
			case 'deals':
				$deal = json_decode($model);
				$doc_id = $deal->id;
				$update = 'startStopDeal';
			break;
			case 'feedback':
				$update = 'sendFeedback';
			break;
			case 'images':
				$update = 'addEditImage';
				$response = Shopowner::updateImage($model);
				if ($response && isset($response['success']) && ($response['success']===true||$response['success']=='true') ) 
					$model = json_encode($response['data']);
				else if ($response) return $response;
			break;
				
		}
		if(isset($update) && $update){
			try{
				$result = $db->updateDocFullAPI('dealer',$update,array('doc_id'=>$doc_id,'params'=>array('json'=>$model)));
				return json_decode($result);
			}
			catch(Exception $e){
				return json_encode(array('success'=>'false','error'=>'database_error','e'=>$e->getMessage())); 
			}
			
		}
		
	}
	public static function delete($type,$id){
		global $db,$session;
		if(!$session->logged_dealer()) return array('success'=>'false','error'=>'not_logged_in');
		$shopowner = $session->logged_dealer();
		$doc_id = $shopowner;
		switch($type){
			case 'templates':
				$update = 'delTemplate';
			break;
			case 'deals':
				$update = 'delDeal';
			break;
			/*case 'images':
				$update = 'delImage';
				$response = Shopowner::updateImage($model);
				if ($response && isset($response['success']) && ($response['success']===true||$response['success']=='true') ) 
					$model = json_encode($response['data']);
				else if ($response) return $response;
			break;*/
				
		}
		if(isset($update) && $update){
			try{
				if ($update == 'delDeal') {
					$doc = $db->getDoc($id);
					if (!$doc->shopowner_id ||$doc->shopowner_id!=$shopowner) return json_encode(array('success'=>'false', 'error'=>'user_not_authorized'));
					if (!$doc->type ||$doc->type!='deal') return json_encode(array('success'=>'false', 'error'=>'doc_not_a_deal'));
					$time = time();
					if (!$doc->start || !$doc->end || $doc->start > $time || $doc->end < $time) {
						$db->deleteDoc($doc);
						return json_encode(array('success'=>'true','data'=>'deleted')); 
					} else return json_encode(array('success'=>'false', 'error'=>'cannot_delete_active'));
				} else {
					$json = json_encode(array('id'=>$id));
					$result = $db->updateDocFullAPI('dealer',$update,array('doc_id'=>$doc_id,'params'=>array('json'=>$json)));
				}
				return json_decode($result);
			}
			catch(Exception $e){
				return json_encode(array('success'=>'false','error'=>'database_error','e'=>$e->getMessage())); 
			}
			
		}
		
	}
	public static function updateDeal($model){
		global $dealer,$db;
		$model = json_decode($model);
		try{
			$editDeal = json_decode($db->updateDocFullAPI('dealer','startStopDeal',array('doc_id'=>$model->id,'params'=>array('json'=>json_encode($model)))));
			return $editDeal;
		}
		catch(Exception $e){
			return json_encode(array('success'=>'false','error'=>'database_error','e'=>$e->getMessage())); 
		}
		
	}
	public static function checkDeal($model){
		global $dealer,$db;
		$model = json_decode($model);

		if (property_exists($model, 'status') && $model->status=='soldout') {
			self::updateDeal($model);
		}

		/* Checking initial conditions to continue */
		if(!property_exists($model,'start') OR !property_exists($model,'end')) return array('success'=>'false','error'=>'start_and_end_time_must_be_specified');
		/* Checking and setting time */
		if(!property_exists($model,'template_id') OR !property_exists($model,'shop_id')) return array('success'=>'false','error'=>'shop_and_template_id_required');
		$start_time = isset($model->seconds) ? (int)$model->start : strtotime($model->start);
		$end_time = isset($model->seconds) ? (int)$model->end : strtotime($model->end);
		$template_id = $model->template_id;
		$shop_id = $model->shop_id;
		if(!$start_time OR !$end_time) return array('success'=>'false','error'=>'error_parsing_time'); 
		$model->hours = ceil(($model->end-$model->start)/3600);
		try{
			$deals = $db->startkey(array($dealer,$start_time))->endkey(array($dealer,'z'))->getView('dealer','getCheckDeals');
			$deals = $deals->rows;
			if(!empty($deals)){
				$test = true;
				foreach($deals as $deal){
					$deal = $deal->value;
					if($deal->template_id != $template_id) continue;
					if($deal->shop_id != $shop_id) continue;
					if($deal->start > $end_time) continue;
					$test = false;
					break;
				}
				if(!$test) return array('success'=>'false','error'=>'deal_already_planned'); 
			}		
			$dealResult = json_decode($db->updateDocFullAPI('dealer','checkDeal',array('doc_id'=>$dealer,'params'=>array('json'=>json_encode($model)))));
			if($dealResult->success != 'true') return $dealResult;
			$deal = $dealResult->data;
			if(isset($deal->image,$deal->template)){
				$deal->template->image = $deal->image;
				unset($deal->image);
			} 
			$deal->shopowner_id = $dealer;
			$deal->start = $start_time;
			$deal->end = $end_time;
			$makeDeal = json_decode($db->updateDocFullAPI('dealer','startStopDeal',array('params'=>array('json'=>json_encode($deal)))));
			if($makeDeal->success != 'true') return $makeDeal;
			if(property_exists($model, 'mobile') && $model->mobile == 'true'){
				$dealResult->data = self::stripDealToMobile($dealResult->data);
			}
			
			return $dealResult;
		}
		catch(Exception $e){
			echo die(json_encode(array('success'=>'false','error'=>'database_error','e'=>$e->getMessage()))); 
		}
	}
	public static function stripDealToMobile($deal){
		$res =  array(
			'id' => (isset($deal->_id) ? $deal->_id : $deal->id),
			'type' => 'deal',
			'title' => $deal->template->title,
			'description' => $deal->template->description,
			'template_id' => $deal->template->id,
			'orig_price' => $deal->template->orig_price,
			'deal_price' => $deal->template->deal_price,
			'end' => $deal->end,
			'start' => $deal->start
		);
		if(isset($deal->template->image)) $res['image'] = $deal->template->image;
		return $res;
	}
	public static function setImage($imagedata){
		global $db,$dealer;
		try{
			$imagedata = array('json'=>json_encode(array('image'=>$imagedata)));
			$result = $db->updateDocFullAPI('dealer','addEditImage',array('doc_id'=>$dealer,'params'=>$imagedata));
			return json_decode($result);
		}
		catch(Exception $e){
			echo json_encode(array('success'=>'false','error'=>'database_error','e'=>$e->getMessage())); 
		}
	}
	public static function updateImage($model) {
		global $db,$dealer;
		$imgData = json_decode($model);
		if (isset($imgData->new, $imgData->filename)) {
			//New image!
			$image = new MyImages(array('filename'=>$imgData->filename));
			if ($image->getErrors()) return array('success'=>false, 'error'=>$image->getErrors());
			else return array('success'=>true, 'data'=>$image->getImgData());
		} else {
			//Existing image
			$oldImgData = Shopowner::get('images',$imgData->id);
			if($oldImgData['success'] == 'true') $oldImgData = $oldImgData['data'];
			else return $oldImgData;
	
			$image = new MyImages(array('imagedata'=>$oldImgData));
	
			if ($imgData->r != $oldImgData->r) {
				$image->rotateTo($imgData->r);
				if ($image->getErrors()) return array('success'=>false, 'error'=>$image->getErrors());
				else return array('success'=>true, 'data'=>$image->getImgData());
			} else if (isset($imgData->t, $oldImgData->t) && ($imgData->t != $oldImgData->t)) {
				if(isset($imgData->t->x, $imgData->t->y, $imgData->t->w, $imgData->t->h)) {
					$image->editThumbnail($imgData->t->x, $imgData->t->y, $imgData->t->w, $imgData->t->h);
					return array('success'=>true, 'data'=>$image->getImgData());
				} else return array('success'=>false, 'error'=>'wrong_parameters_given');
			} 
		}
		if ($image->getErrors()) return $image->getErrors();
	}
	public static function get($type,$id=''){
		global $db,$session;
		if(!$session->logged_dealer()) return array('success'=>'false','error'=>'not_logged_in');
		$shopowner = $session->logged_dealer();
		if($type){	
			$key = false;
			switch($type){
				case 'deals':
					$view = 'getDeals';
					break;
				case 'dealsNTemplates':
					$view = 'getDealsNTemplates';
					break;
				case 'images':
					$view = 'getImages';
					break;
				case 'feedback':
					$view = 'getFeedback';
					break;
				case 'templates':
					$view = 'getTemplates';
					break;
				case 'shops':
					$view = 'getShops';
					break;
				case 'shopowner':

					$view = 'getShopowner';
					$id = true;
					$key = true;
					break;
				case 'all':
					$key = true;
					$view = 'getAll';
					break;
			}
			try{

				if(isset($view) && $view && !$id){

					if($key) $dbq = $db->key($shopowner);
					else $dbq = $db->startkey(array($shopowner,0))->endkey(array($shopowner,'z'));
					$results = $dbq->getView('dealer',$view);
					$results = $results->rows;
					if(empty($results)) return array('success'=>'false','error'=>'no_results','shopowner'=>$shopowner);
					return array('success'=>'true','type'=>$type,'results'=>$results);
				}
				else if($id){
					if($view != 'getDeals') $id = (int)$id;
					$result = array('success'=>'false','error'=>'no_result','shopowner'=>$shopowner);
					if(!$key) $dbq = $db->key(array($shopowner,$id));
					else $dbq = $db->key($shopowner);
					$data = $dbq->getView('dealer',$view);
					$data = $data->rows;
					if(empty($data)) return array('success'=>'false','error'=>'no_result_from_'.$type);
					$res = $data[0]->value;
					return array('success'=>'true','data'=>$res);
				}
			}
			catch(Exception $e){ echo json_encode(array('success'=>'false','error'=>'database_error','e'=>$e->getMessage())); }
		}
	
	}
}
?>