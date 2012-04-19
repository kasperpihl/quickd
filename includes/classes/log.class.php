<?php
class Log{
	private static $filename = LOG_FILE;
	public static function add($message){
		$string = date("j/n Y G:i:s") . ' ' .$message . "\n";
		file_put_contents(self::$filename, $string,FILE_APPEND);
	}
	public static function clear(){
		file_put_contents(self::$filename, '');
	}
	public static function get(){
		if (file_exists(self::$filename)) {
			return file(self::$filename, FILE_SKIP_EMPTY_LINES);
		}
		return false;
	}
	public static function printLog(){
		$log = self::get();
		foreach ($this->objects as $value) {
			echo "$value<br/>";
		}
	}
}
?>