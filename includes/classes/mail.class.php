<?php 
Class Mail{
	protected static $sender = 'mail@quickd.com';
	public static function sendBetaConfirmation($mail, $name=false){
		$subject = 'Registrering til beta-lancering af QuickD';
		if ($name) $greet = "Hej ".$name."\n\n";
		else $greet = "";
		$message = 
			$greet .
			'Tusind tak for din interesse i QuickD.'. "\n\n" .
			'Du er nu skrevet op til beta-testen i Aarhus, og vi sender dig en invitation på åbningsdagen d. 20. april.'."\n\n".
			'Hvis du har nogle spørgsmål, er du meget velkommen til at besvare denne mail.'. "\n\n".
			'Vi glæder os helt vildt til at kunne lancere for dig!'."\n\n".
			'De bedste hilsner,'."\n".
			'QuickD-teamet';
		self::sendMail($mail,$subject,$message);
	}
	public static function sendNewPasswordForDealer($mail, $url,$name = false){
		$subject = 'Glemt adgangskode til QuickD Forhandler';
		if ($name) $greet = "Hej ".$name."\n\n";
		else $greet = "";
		$message = 
			$greet.
			'I har anmodet om en ny adgangskode til forhandler.quickd.dk.'."\n".
			'Følg venligst nedenstående link inden for 24 timer for at komme videre:'."\n\n".
			DEALER_RESET_URL.$url."\n\n".	
			'Har I spørgsmål, kan I ringe til os på tlf. 30 911 911.'."\n\n".
			'De bedste hilsner,'."\n".
			'QuickD-teamet';
		self::sendMail($mail,$subject,$message);
		
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