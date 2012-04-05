<?php
/**
 * @author: kasper@pihl.it
 */
class Mailer {

	static private $from = null;
	function __construct()
	{
	}

	static private function EscapeHead($string, $encoding='GB2312')
	{
		$string	= mb_convert_encoding($string, $encoding, "UTF-8");
		return '=?' . $encoding . '?B?'. base64_Encode($string) .'?=';
	}

	static private function EscapePart($string, $encoding='GB2312')
	{
		$string = mb_convert_encoding($string, $encoding, 'UTF-8');
		return preg_replace_callback( '/([\x80-\xFF]+.*[\x80-\xFF]+)/' ,create_function ( '$m' ,"return \"=?$encoding?B?\".base64_encode(\$m[1]).\"?=\";") ,$string);
	}
	static function SmtpMail($to, $subject, $message, $options=null, $bcc=array())
	{
		/* settings */
		if ( !isset($options['encoding']) )
			$options['encoding'] 	= 'UTF-8';

		if ( !isset($options['contentType']) )
			$options['contentType'] = 'text/plain';

		if ( 'UTF-8'!=$options['encoding'] )
			$message = mb_convert_encoding($message, $options['encoding'], 'UTF-8');

		$host = 'smtp.gmail.com';
		$port = '465';
		$ssl = 'ssl';
		$user = 'mailer@quickd.com';
		$pass = 'ka2jae2n';
		$from = 'mail@quickd.com';
		$reply = 'mail@quickd.com';
		$site = 'QuickD-teamet';

		$subject = self::EscapeHead($subject, $options['encoding']);
		$site = self::EscapeHead($site, $options['encoding']);
		$body = $message;

		$ishtml = ($options['contentType']=='text/html');
		//begin
		$mail = new PHPMailer();
		$mail->IsSMTP(); 
		$mail->CharSet = $options['encoding'];
		$mail->SMTPAuth   = true; 
		$mail->Host = $host;
		$mail->Port = $port;
		if ( $ssl=='ssl' ) {
			$mail->SMTPSecure = "ssl"; 
		} else if ( $ssl == 'tls' ) {
			$mail->SMTPSecure = "tls"; 
		}
		$mail->Username = $user;
		$mail->Password = $pass;
		$mail->SetFrom($from, $site);
		$mail->ClearReplyTos();
		//$mail->AddReplyTo($reply, $site);
		foreach($bcc AS $bo) {
			$mail->AddBCC($bo);
		}
		$mail->Subject = $subject;
		if ( $ishtml ) {
			$mail->MsgHTML($body);
		} else {
			$mail->Body = $body;
		}
		$mail->AddAddress($to);
		return $mail->Send();
	}
}
?>
