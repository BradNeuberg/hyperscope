<?

header('Content-type: text/xml');

// -------------------------------------------------------------------
// fetchfeed() gets the contents of an external RSS feed,
// and saves its contents to the "cached" file on the server
// -------------------------------------------------------------------

$opmlURL = "http://xoxotools.ning.com/outlineconvert.php?xn_auth=no&url=http%3a%2f%2fapi.search.yahoo.com%2fWebSearchService%2fV1%2fwebSearch%3fappid%3dYahooDemo%26query%3dengelbart%26results%3d50&output=opml&simplify=true";

$xml = file_get_contents($opmlURL);
$xml = preg_replace("/<\?xml version=\"1.0\" \?>/", "<?xml-stylesheet type=\"text/xsl\" href=\"../client/lib/hs/xslt/hyperscope.xsl\"?>", $xml);

echo($xml);
?>

