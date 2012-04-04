<?php 
Class AdminMail{
	protected static $sender = 'mail@quickd.com';
	public static function newTemplateNeedApproval(){
		$subject = 'Ny skabelon';
		$message =
			'http://admin.quickd.dk'."\n\n";
		self::sendMail($subject,$message);
	}
	private static function sendMail($subject,$message){
		$headers = 
			'MIME-Version: 1.0' ."\n".
			'From: QuickD-teamet <' .self::$sender . ">". "\n" . 
			'Reply-To: QuickD-teamet <'.self::$sender . ">"."\n" .
			'Content-Type: text/plain; charset=utf-8'."\n".
    		'X-Mailer: PHP/' . phpversion();
		mail($to,$subject,$message,$headers);
	}
}
?>