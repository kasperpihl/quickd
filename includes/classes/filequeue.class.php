<? 
// Title Manager class (essentially a queue) that uses a simple text file for storage
class FileQueue {
	private $filename = "file.txt";
	// use 0 for no limit
	private $queueLimit = 5;
	private $duplicates = true;
	private $autosave = true;
	private $objects;
	
	// Upon creation, load up our titles from the file
	public function __construct() {
		$this->objects = array();
		$this->loadObjects();
	}
	

	private function loadObjects() {
		if (file_exists($this->filename)) {
			$this->objects = file($this->filename, FILE_SKIP_EMPTY_LINES);
		}
	}
	
	// Add a title to the queue and if we are at our limit, drop one off the end.
	public function push($string) {
		if (!empty($string)) {
			if(!$this->duplicates && !$this->objectExists($string)) return false;
			array_unshift($this->objects, $string . "\n"); 
			
			if (count($this->objects) > $this->queueLimit && $this->queueLimit > 0) {
				$this->dequeue();
			}
			if($this->autosave) $this->save();
		}
	}
	
	// Remove a title item from the end of our list
	public function pop() {
		if (count($this->objects) > 0) {
			return trim(array_pop($this->objects));
		}
		return "";
	}
	
	// Save the contents of our array back to the file.
	public function save() {				
		if (file_put_contents($this->filename, $this->objects)) {
			return true;
		}
		return false;
	}


	// Check if an item is already in our list. 
	// Note: We could have also used in_array here instead of a loop.
	public function objectExists($string = "") {
		if (!empty($string)) {
			foreach ($this->objects as $str) {
				$trimmedStr = trim($str);
				$string = trim($string);
				if (strtolower($string) == strtolower($trimmedStr)) { return true; }
			}
			
			return false;
		}
		return -1;
	}
	
	
	// Mainly a debug function to print our values to screen.
	public function printValues() {
		//print_r($this->objects);
		foreach ($this->objects as $value) {
			echo "$value<br/>";
		}
	}
}
?>