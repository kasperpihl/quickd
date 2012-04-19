<?php 
Class Mail{
	private static $queueFile = 'mailQueue.txt';
	
	public static function create($action, $to, $options=array()) {
		$fQueue = new FileQueue(self::$queueFile);
		$options = $options ? json_encode($options) : "{}";
		$fLine = $action."|".$to."|".$options;
		$fQueue->push($fLine);
	}

	public static function dequeueMails() {
		$fQueue = new FileQueue(self::$queueFile);
		$fQueue->clearFile();
		$line = $fQueue->pop();
		while($line) {
			$info = explode("|", $line);
			if (count($info)<3||empty($info[0])||empty($info[1])) Log::add('Mail-error: '.$line);
			else if (!method_exists('Mail', $info[0])) Log::add('Mail-error: Unkknown action - '.$info[0]);
			else if (!call_user_func('Mail::'.$info[0], $info[1], json_decode($info[2], true))) Log::add('Mail-error: Missing options - '.$line);
			$line = $fQueue->pop();
		}
	}
	private static function randomMail($to, $options=false){
		if (!$options&&!isset($options['number'])) return false;
		if ($options && isset($options['name'])) $greet = "Hej ".$options['name']."\n\n";
		else $greet = "";
		$subject = 'Mail-test QuickD';
		$message = 
			$greet .
			'Dette er mail nr:'.$options['number']. "\n\n" .
			'De bedste hilsner,'."\n".
			'QuickD-teamet';
		self::sendMail($to,$subject,$message);
		return true;
	}
	private static function sendBetaConfirmation($to, $options=false){
		$subject = 'Registrering til beta-lancering af QuickD';
		if ($options && isset($options['name'])) $greet = "Hej ".$options['name']."\n\n";
		else $greet = "";
		$message = 
			$greet .
			'Tusind tak for din interesse i QuickD.'. "\n\n" .
			'Du er nu skrevet op til beta-testen i Aarhus, og vi sender dig en invitation på åbningsdagen d. 20. april.'."\n\n".
			'Hvis du har nogle spørgsmål, er du meget velkommen til at besvare denne mail.'. "\n\n".
			'Vi glæder os helt vildt til at kunne lancere for dig!'."\n\n".
			'De bedste hilsner,'."\n".
			'QuickD-teamet';
		self::sendMail($to,$subject,$message);
		return true;
	}
	private static function sendNewPasswordForDealer($to, $options=false){
		if (!$options||!isset($options['url'])) return false;
		if (isset($options['name'])) $greet = "Hej ".$options['name']."\n\n";
		else $greet = "";
		$subject = 'Glemt adgangskode til QuickD Forhandler';
		$message = 
			$greet.
			'I har anmodet om en ny adgangskode til forhandler.quickd.dk.'."\n".
			'Følg venligst nedenstående link inden for 24 timer for at komme videre:'."\n\n".
			DEALER_RESET_URL.$options['url']."\n\n".	
			'Har I spørgsmål, kan I ringe til os på tlf. 30 911 911.'."\n\n".
			'De bedste hilsner,'."\n".
			'QuickD-teamet';
		self::sendMail($to,$subject,$message);
		return true;
		
	}
	private static function sendNewPasswordForUser($to, $options=false) {
		if (isset($options['name'])) $greet = "Hej ".$options['name']."\n\n";
		else $greet = "";
		$subject = 'Glemt adgangskode til QuickD Forhandler';
		$message = 
			$greet.
			'Det her er pinligt.'."\n\n".
			'Du har fået kaldt en funktion vi endnu ikke understøtter. Det var pokkers.'."\n\n".	
			'Har I spørgsmål, kan I ringe til os på tlf. 30 911 911.'."\n\n".
			'De bedste hilsner,'."\n".
			'QuickD-teamet';
		self::sendMail($to,$subject,$message);
		return true;
	}
	private static function sendMail($mail,$subject,$message){
		
		Mailer::SmtpMail($mail,$subject,$message);
		return true;
		
	}
	public static function sendAdminMail($action,$doc_id=false){
		global $live;
		if(!$live) return;
		return;
		switch($action){
			case 'newTemplate':
				$subject = 'Ny skabelon oprettet';
				$message = 
				'http://admin.quickd.com/approve.php'."\n\n";
			break;
			case 'editTemplate':
				$subject = 'En skabelon er ændret';
				$message = 
				'http://admin.quickd.com/approve.php'."\n\n";
			break;
			case 'feedback':
				$subject = 'Der er skrevet feedback';
				$message = 
				'http://admin.quickd.com/feedback.php'."\n\n";
			break;
			default:
				return false;
			break;
		}
		self::sendMail('admin@quickd.com',$subject,$message);
	}
}
?>