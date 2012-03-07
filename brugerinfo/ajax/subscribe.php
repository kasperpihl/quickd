<?php
header('Content-Type: application/json');
require_once('../../config.php');

if(isset($_POST['action']) && $_POST['action'] == 'doSignup' && isset($_POST['email'])){
  
  $email = strtolower(strip_tags($_POST['email']));

  $doc = new stdClass();
  $doc->type = 'user';
  $doc->email = $email;
  $doc->fb_id = intval($_POST['fb_id']);
  $values = array('name', 'gender', 'lang');
  for ($values as $key) {
    if (isset($_POST[$key])&& !empty($_POST[$key])) $doc->$key = $_POST[$key];
  }
  if (isset($_POST['lat'])&&isset($_POST['lng'])) {
    $doc->city->lat = floatval($_POST['lat']);
    $doc->city->lng = floatval($_POST['lng']);
  }

  
  try {
      $db->storeDoc($doc);
      echo json_encode(array('success'=>true));
  } catch ( Exception $e ) {
     echo json_encode(array('success'=>false));
  }
  
}
else{
  echo json_encode(array('success'=>false));
}

?>