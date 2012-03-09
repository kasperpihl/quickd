<? 

if(!isset($db)) echo die('cant call this directly - use update.php');
try{
	$doc = couchDocument::getInstance($db,"configuration");
	echo '<br/><br/>Hentede configuration dokumentet <br/>';
	$betakoder = new stdClass();
	echo 'betakoder objektet klar <br/>';
	$betakoder = array(
		'QD-ANETTES-A6EB' => 		'Anettes Sandwich',
		'QD-BILLABONG-B8E3' => 		'Billabong Bar',
		'QD-SIDEWALK-O6EA' => 		'Cafe Sidewalk',
		'QD-SMAGLOES-LE3V' =>		'Cafe Smagløs',	
		'QD-SVEJ-U6A3' =>			'Cafe Svej',
		'QD-VIGGO-AE32' =>			'Cafe Viggo',
		'QD-CAFEHACK-8HY2' =>		'Cafehack',
		'QD-CROSS-7AE2' =>			'Cross Cafe',
		'QD-DRUDENFUSS-UE12' =>		'Drudenfuss',
		'QD-ESKIL-P0LA'	=>			'Fatter Eskil',
		'QD-FIDELS-LA32' =>			'Fidels',
		'QD-SLAPAF-TI45' =>			'Slap Af',
		'QD-WAXIES-YY12' =>			'Waxies',
		'QD-SAMS-BB88' =>			'Sams Bar',
		'QD-THORUPS-JML2' =>		'Thorups Kælder',
		'QD-HEADQUARTERS-AA55' =>	'Headquarters',
		'QD-HEIDIS-JB78' =>			'Heidis Bier Bar',
		'kasperergud'	=>			'Kaspers Cafe'
	);
	$doc->betakoder = $betakoder;
	echo 'betakoder sat<br/>';
	echo 'Forlader configuration';
	
}
catch(Exception $e){
	echo '<br/><br/>fejl i configuration filen<br/>';
}
?>

	














