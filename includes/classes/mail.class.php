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
		if ($line) {
			$time = date("H:i");
			Log::add('- Mail sending started - '.$time);
		}
		while($line) {
			$info = explode("|", $line);
			if (count($info)<3||empty($info[0])||empty($info[1])) Log::add('Mail-error: '.$line);
			else if (!method_exists('Mail', $info[0])) Log::add('Mail-error: Unkknown action - '.$info[0]);
			else if (!call_user_func('Mail::'.$info[0], $info[1], json_decode($info[2], true))) Log::add('Mail-error: Missing options - '.$line);
			$line = $fQueue->pop();
		}
		if ($time) Log::add('- Mail sending ended - '.$time);
	}
	private static function sendMail($mail,$subject,$message){
		Mailer::SmtpMail($mail,$subject,$message);
		return true;
	}
	private static function randomMail($to, $options=false){
		if (!$options&&!isset($options['number'])) return false;
		$subject = 'Mail-test QuickD';
		$message = 
			self::greeting($options) .
			'Dette er mail nr:'.$options['number']. "\n\n" .
			'De bedste hilsner,'."\n".
			'QuickD-teamet';
		self::sendMail($to,$subject,$message);
		return true;
	}
	private static function sendBetaConfirmation($to, $options=false){
		$subject = 'Registrering til beta-lancering af QuickD';
		$message = 
			self::greeting($options) .
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
		$subject = 'Glemt adgangskode til QuickD Forhandler';
		$message = 
			self::greeting($options).
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
		$subject = 'Glemt adgangskode til QuickD Forhandler';
		$message = 
			self::greeting($options).
			'Det her er pinligt.'."\n\n".
			'Du har fået kaldt en funktion vi endnu ikke understøtter. Det var pokkers.'."\n\n".		
			'Har I spørgsmål, kan I ringe til os på tlf. 30 911 911.'."\n\n".
			'De bedste hilsner,'."\n".
			'QuickD-teamet';
		self::sendMail($to,$subject,$message);
		return true;
	}
	private static function sendInvite($to, $options=false) {
		if (!$options||!isset($options['betakey'])) return false;
		$subject = 'Glemt adgangskode til QuickD Forhandler';
		$message = 
			'<h2>Velkommen til QuickD</h2>'.
			self::greeting($options).
			"Så blev det endelig den 20. april, og vi har nu fornøjelsen af at byde dig velkommen som
			én af de første til beta-testen af QuickD. Med QuickD kan du let finde gode tilbud omkring
			dig, direkte fra din smartphone.\n\n
			De sidste to uger har vi haft møder med ejerne fra nogle af de fedeste spisesteder, caféer
			og barer i Aarhus. Der er blevet taget rigtig godt imod det produkt vi er ved at udvikle til jer,
			og vi glæder os enormt meget til de næste par uger, hvor der vil begynde at tikke tilbud ind
			i app'en.\n\n
			For at prøve QuickD, skal du bare besøge <b><a href='http://beta.quickd.com/".$options['betakey']."'>http://beta.quickd.com/".$options['betakey']."</a></b> fra din
			smartphone - så er du igang.\n\n
			Alternativt kan du bruge <b>beta.quickd.com</b> og indtaste din personlige betanøgle, der er
			<b>".$options['betakey']."</b>\n\n
			Vi leder i øjeblikket efter ca. 25 personer, som er interesserede i at blive en del af vores
			Facebook-\"inner circle\". Som en del heraf er du med til at beslutte hvilke forretninger vi
			skal invitere i dit nærområde, stemme på de features du synes er vigtigst at få udviklet
			først og komme med nye idéer til tegnebrættet. Vi kører efter “først til mølle”-princippet -
			skriv til <a href='mailto:lasse@quickd.com'>lasse@quickd.com</a> hvis du er interesseret i at deltage. Og gør det med det samme,
			inden pladserne bliver fyldt.\n\n
			Vi håber, at du vil få nogle rigtig gode oplevelser ud af de tilbud, du finder med QuickD.\n\n
			De bedste hilsener,\n
			Kasper, Jeppe, Jens, Kristian, Lasse og Anders\n
			QuickD-teamet";
		self::sendMail($to,$subject,$message);
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

	private static function greeting($options) {
		if (isset($options['name'])&&$options['name']) $greet = "Hej ".$options['name']."\n\n";
		else $greet = "";
		return $greet;
	}
}
?>