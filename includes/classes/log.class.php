<?php
class Log{
	private static $filename = LOG_FILE;
	public static function add($message){
		$string = date("j/n Y G:i:s") . ' ## ' .$message . "\n";
		$r = file_put_contents(self::$filename, $string,FILE_APPEND);
		return $r===false?false:true;
	}
	public static function clear(){
		file_put_contents(self::$filename, '');
	}
	public static function get(){
		if (file_exists(self::$filename)) {
			return file(self::$filename, FILE_SKIP_EMPTY_LINES);
		}
		return array();
	}
	public static function printLog(){
		$log = self::get();
		foreach ($log as $value) {
			echo $value."<br/>";
		}
	}
}
?>