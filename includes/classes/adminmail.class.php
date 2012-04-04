<?php 
Class AdminMail{
	protected static $sender = 'mail@quickd.com';
	public static function sendAdminMail($mail,$doc_id){
		global $live;
		if(!$live) return false;
		switch($mail){
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
		self::sendMail($subject,$message);
		return 'send';
	}
	private static function sendMail($subject,$message){
		global $live;
		$headers = 
			'MIME-Version: 1.0' ."\n".
			'From: QuickD-teamet <' .self::$sender . ">". "\n" . 
			'Reply-To: QuickD-teamet <'.self::$sender . ">"."\n" .
			'Content-Type: text/plain; charset=utf-8'."\n".
    		'X-Mailer: PHP/' . phpversion();
		mail('admin@quickd.com',$subject,$message,$headers);
	}
}
?>