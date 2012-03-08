<?php 
Class Mail{
	protected static $sender = 'mail@quickd.dk';
	public static function sendBetaConfirmation($mail){
		$subject = 'Registrering til beta-lancering af QuickD';
		$message = 
			'Tusind tak for din interesse i QuickD.'. "\r\n\r\n" .
			'Du er nu skrevet op til beta-testen i Aarhus og vi sender dig en invitation på åbningsdagen d. 20. april.'."\r\n\r\n".
			'Hvis du har nogle spørgsmål, er du meget velkommen til at besvare denne mail.'. "\r\n\r\n".
			'Vi glæder os helt vildt til at kunne lancere for dig!'."\r\n\r\n".
			'De bedste hilsner,'."\r\n".
			'QuickD-teamet';
		self::sendMail($mail,$subject,$message);
	}
	private static function sendMail($to,$subject,$message){
		$headers = 
			'MIME-Version: 1.0' ."\n"
			'From: QuickD-teamet <' .self::$sender . ">". "\r\n" . 
			'Reply-To: '.self::$sender . "\r\n" .
    		'X-Mailer: PHP/' . phpversion();
		mail($to,$subject,$message,$headers);
	}
}
?>