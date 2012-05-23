<?php
$type = isset($_GET['type']) ? $_GET['type'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : '';
$result = '';
if($type&&$id){
  //$result = array('success'=>'false','error'=>'testing', 'data'=>array('type'=>$type, 'id'=>$id));
  $result = Shopowner::delete($type,$id);
}
?>