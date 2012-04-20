<?
require_once(dirname(__FILE__).'/../config.php');
//print_r(Log::get());
/*for ($i = 0 ; $i < 10 ; $i++ ){
	Log::add($i);
	sleep(1);
}*/
//Log::printLog();
echo "<br><br>";

if ($_GET['spam']) {
	for ($i=0;$i<=5;$i++) {
		echo "Created ".$i."<br />";
		echo Mail::create('sendInvite', 'kasper@tornoe.org', array('betakey'=>b3df4ee1, 'name'=>'Fissekarl'));
		//Mail::create('randomMail', $_GET['spam'],array('name'=>'Mr. Nice Guy', 'number'=>$i));
		
	}
	
	Mail::dequeueMails();
	echo "<br><br>Done!";
}
?>