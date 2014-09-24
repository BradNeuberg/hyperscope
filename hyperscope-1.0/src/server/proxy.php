<?

// report only fatal errors
error_reporting(E_ERROR); 

$url = $_GET['url'];

// only http and https supported
if(preg_match("/^https?\:.*/", $url)){
	$xml = file_get_contents($url);
	
	// make sure we have XML and not some other
	// content type or an error message
	if(preg_match("/^\<\?\s*xml/", $xml)){
		header('Content-type: text/xml');
		echo($xml);
	}else{
		header('HTTP/1.1 403 Forbidden');
		header('Content-type: text/html');
		echo("You are not allowed to retrieve this resource");
	}
}else{
	header('HTTP/1.1 403 Forbidden');
	header('Content-type: text/html');
	echo("You are not allowed to retrieve this resource");
}
?>

