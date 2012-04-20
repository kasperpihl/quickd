<?php 
require_once(dirname(__FILE__).'/config.php');
Mail::create('randomMail', 'kasper@tornoe.org',array('name'=>'Mr. Nice Guy', 'number'=>$i));
Mail::dequeueMails();
?>