<?
class Shopowner {
	public static function register($model){
		global $db,$session;
		try{
			$email = isset($model['email']) ? strtolower($model['email']) : '';
			$password = isset($model['password']) ? $model['password'] : '';
			if(strlen($password) < 6) return array('success'=>'false','error'=>'password_must_be_6_long');
			if(!$email || self::checkEmail($email)) return array('success'=>'false','error'=>'user_exists');
			$update = 'registerUser';
			if(BETA_MODE){
				if(!isset($model['betacode'])) return array('success'=>'false','error'=>'betacode_must_be_included');
				$betakoder = $db->getDoc('configuration');
				$betakoder = $betakoder->betakoder;
				
				if(!property_exists($betakoder,$model['betacode'])) return array('success'=>'false','error'=>'wrong_betacode');
				$model['name'] = $betakoder->$model['betacode'];
			}
			$model['hours'] = 25;
			$model['privileges'] = 3;
			$model['password'] = md5(MD5_STRING.$model['password']);
			$result = json_decode($db->updateDocFullAPI('dealer',$update,array('params'=>array('json'=>json_encode($model)))));
			
			if($result->success == 'true'){
				$result->data->hours = $model['hours'];
				$result->data->email = $model['email'];
				$session->login($result->data->id,$model['privileges']);
			}
			
			return $result;
		}
		catch(Exception $e){
			echo json_encode(array('success'=>'false','error'=>'database_error','function'=>'shopowner_register','e'=>$e->getMessage())); }
	}
	public static function checkEmail($email){
		global $db;
		try{
			$user = $db->key($email)->getView('dealer','getUsersByMail');
			$user = $user->rows;
			return !empty($user);
		}
		catch(Exception $e){ echo json_encode(array('success'=>'false','error'=>'database_error','e'=>$e->getMessage())); }
	}
	public static function getShopowner(){
	
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
		catch(Exception $e){ echo die(json_encode(array('success'=>'false','error'=>'database_error','e'=>$e->getMessage()))); }
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
				echo json_encode(array('success'=>'false','error'=>'database_error','e'=>$e->getMessage())); 
			}
			
		}
		
	}
	public static function checkDeal($model){
		global $dealer,$db;
		$model = json_decode($model);
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
			$makeDeal = json_decode($db->updateDocFullAPI('dealer','startDeal',array('params'=>array('json'=>json_encode($deal)))));
			if($makeDeal->success != 'true') return $makeDeal;
			return $dealResult;
		}
		catch(Exception $e){
			echo die(json_encode(array('success'=>'false','error'=>'database_error','e'=>$e->getMessage()))); 
		}
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