<?php require_once('../config.php'); 
require_admin();
header('Content-Type: text/html; charset=utf8');
if(!isset($_SESSION['approveindex'])) $_SESSION['approveindex'] = 0;
if(isset($_POST['action'])){
	if(isset($_POST['jumpover'])){
		$_SESSION['approveindex']++;
		redirect($_SERVER['PHP_SELF']);
	}
	$doc_id = $_POST['doc_id'];
	$type = $_POST['type'];
	$index = $_POST['index'];
	
	if(isset($_POST['approve'])) $action = 'approved';
	else if(isset($_POST['decline'])) $action = 'declined';
	else echo die('action must be set');

	$update = array('type'=>$type,'index'=>$index,'approved'=>$action);
	$update['message'] = isset($_POST['feedback']) ? $_POST['feedback'] : false;
	try{
		$db->updateDocFullAPI('admin','approve',array('doc_id'=>$doc_id,'params'=>array('json'=>json_encode($update))));
		redirect($_SERVER['PHP_SELF']);
	}
	catch(Exception $e){
		print_r($e);
	}
}
else{
	try{
		$res = $db->skip($_SESSION['approveindex'])->limit(1)->getView('admin','getStuff');
		$res = $res->rows;
		if(!empty($res)){
			$key = $res[0]->key;
			$doc = $res[0]->value;
			$doc_id = $key[0];
			$type = $key[1];
			$index = $key[2];
		}
		else{
			if($_SESSION['approveindex'] == 0){
				echo die('<a href="index.php">Tilbage</a>&nbsp;&nbsp;&nbsp;<a href="feedback.php">Tjek Feedback</a><br/><br/>tillykke du har ikke flere ting der skal godkendes');
			}
			else{
				$_SESSION['approveindex'] = 0;
				redirect($_SERVER['PHP_SELF']);
			}
		}
	}
	catch(Exception $e){
		print_r($e);
	}
}

	
?>
<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post"/>
	<input type="hidden" name="action" value="approval" />
	<input type="hidden" name="doc_id" value="<? echo $doc_id; ?>"/>
	<input type="hidden" name="type" value="<?php echo $type; ?>"/>
	<input type="hidden" name="index" value="<?php echo $index; ?>"/>
	<?php if(isset($type) && $type == 'shop') { ?>
	<div><?php echo $doc->name; ?>
	
	<? } else if($type=='template'){ ?>
		<?php if (isset($doc->image)) { ?><img src="<? echo IMAGES_URL . 'preview/'.$doc->image; ?>" width="200"/><br/><?php } ?>
		<?php echo $doc->template->title; ?><br/><br/>
		<?php echo $doc->template->description; ?>
	<? } ?></div>
	<div>
		<textarea name="feedback"></textarea>
		<input type="submit" name="approve" value="Godkend"/>
		<input type="submit" name="jumpover" value="Spring over"/>
		<input type="submit" name="decline" value="Afslå"/>
	</div>
</form>