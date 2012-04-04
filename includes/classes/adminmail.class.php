<?php 
Class AdminMail{
	protected static $sender = 'mail@quickd.com';
	public static function sendAdminMail($mail,$doc_id){
		switch($mail){
			case 'newTemplate':
				$subject = 'Ny skabelon oprettet';
				$message = 
				'Check http://admin.quickd.com'."\n\n";
			break;
			case 'editTemplate':
				$subject = 'En skabelon er ændret';
				$message = 
				'Check http://admin.quickd.com'."\n\n";
			break;
			default:
				return false;
			break;
		}
		self::sendMail($subject,$message);
		return 'send';
	}
	private static function sendMail($subject,$message){
		global $adminmails;
		$mails = implode(', ', $adminmails);
		$mails = 'kasperpihl@me.com';
		$headers = 
			'MIME-Version: 1.0' ."\n".
			'From: QuickD-teamet <' .self::$sender . ">". "\n" . 
			'Reply-To: QuickD-teamet <'.self::$sender . ">"."\n" .
			'Content-Type: text/plain; charset=utf-8'."\n".
    		'X-Mailer: PHP/' . phpversion();
		mail($mails,$subject,$message,$headers);
	}
}
?>