package org.hyperscope.transformers.xhtml;

import java.io.*;
import java.net.*;

import javax.xml.transform.*;
import javax.xml.transform.stream.*;

import org.apache.commons.httpclient.*;
import org.apache.commons.httpclient.methods.*;

import org.w3c.tidy.*;

import net.sf.saxon.trans.*;
import net.sf.saxon.value.*;

public class XHTMLTransformer{
	private static String XSL_FILENAME = "xhtml.xsl";
	private String path;

	/**
		@param currentPath The path to the directory
		where our XSLT stylesheet is.
	*/
	public XHTMLTransformer(String currentPath){
		if(currentPath.endsWith(File.separator) == false){
			currentPath += File.separator;
		}
	
		path = currentPath + XSL_FILENAME;
		
		// indicate that we will use Saxon for our XSLT transformer
		// FIXME: is this threadsafe? Probably not.
		System.setProperty("javax.xml.transform.TransformerFactory", 
							"net.sf.saxon.TransformerFactoryImpl");
	}
	
	/**
		Entry point for fetching a given URL, tidying it up,
		and then transforming it into OPML.
		
		@param fetchMe String url to fetch. Security will be done
		on this url to make sure it is safe to fetch.
		@param beSecure Boolean variable that controls whether we check
		to make sure URL's are safe. If true, then we filter out unsafe schemes
		and localhost; if false, then we don't.
		@throws SecurityException Thrown if the URL or content is unsafe
		somehow.
		@returns OPML results as a String.
	*/
	public String transform(String fetchMe, boolean beSecure)
							throws SecurityException, HttpException,
									IOException, TransformerException{
		// get the URL to fetch and make sure it is safe
		URL url = toURL(fetchMe, beSecure);
		
		// get the content
		String html = getContent(url);
		
		// tidy up the content and turn it
		// into XML (XHTML)
		String xml = tidyHTML(html);
		
		// transform the XHTML into OPML
		String opml = transformToOPML(xml);
		
		return opml;
	}

	private URL toURL(String fetchMe, boolean beSecure) throws SecurityException{
		if(fetchMe == null || fetchMe.trim().equals("")){
			throw new SecurityException("No URL provided");
		}
		
		try{
			URL url = new URL(fetchMe);
			
			if(beSecure){
				// secure protocol?
				if(!url.getProtocol().equals("http") &&
					!url.getProtocol().equals("https")){
					throw new SecurityException("Protocol not allowed");
				}
					
				// Loopback address or DNS name that is
				// only resolvable behind the firewall?
				if(url.getHost().equals("localhost")
					|| url.getHost().equals("127.0.0.1")
					|| url.getHost().indexOf(".local") != -1
					|| url.getHost().indexOf(".") == -1){
					throw new SecurityException("You do not have permission "
												+ "to access this host");
				}
			}
			
			return url;
		}catch(MalformedURLException e){
			throw new SecurityException("Malformed URL");
		}
	}
	
	private String getContent(URL url) 
						throws HttpException,
								IOException,
								SecurityException{
		// get the contents
		HttpClient client = new HttpClient();
		HttpMethod method = new GetMethod(url.toString());
		int statusCode = client.executeMethod(method);
		
		// make sure it executed correctly
		if(statusCode != HttpStatus.SC_OK){
			throw new HttpException("Request failed: "
									+ method.getStatusLine());
		}
		
		// make sure we have HTML or XHTML
		String mimeType = method.getResponseHeader("Content-type").toString();
		if(mimeType.indexOf("text/html") == -1
			&& mimeType.indexOf("application/xhtml+xml") == -1
			&& mimeType.indexOf("text/xml") == -1
			&& mimeType.indexOf("application/xml") == -1){
				throw new SecurityException("Insecure MIME type returned");
		}
		
		// get the actual response returned; should automatically
		// use the underlying response character encoding when
		// creating the string
		String content = method.getResponseBodyAsString();
		
		method.releaseConnection();
		
		return content;
	}
	
	private String tidyHTML(String content)
									throws IOException{
		Tidy tidy = new Tidy();
		
		// set configuration values
		tidy.setDropEmptyParas(true); // drop empty P elements
		tidy.setEncloseBlockText(true); // wrap blocks of text in P elements
		tidy.setEncloseText(true); // wrap text right under BODY element in P elements
		tidy.setHideEndTags(false); // force optional end tags
		tidy.setIndentContent(true); // indent content for easy reading
		tidy.setLiteralAttribs(false); // no new lines in attributes
		tidy.setLogicalEmphasis(true); // replace i and b by em and strong, respectively
		tidy.setMakeClean(true); // strip presentational cruft
		tidy.setNumEntities(true); // convert entities to their numeric form
		tidy.setWord2000(true); // strip Word 2000 cruft
		tidy.setXHTML(true); // output XHTML
		tidy.setXmlPi(true); // add <?xml?> processing instruction
		
		// parse
		StringReader in = new StringReader(content);
		StringWriter out = new StringWriter();
		tidy.parse(in, out);
		in.close();
		out.close();
		String results = out.toString();
				
		return results;
	}
	
	private String transformToOPML(String content) 
									throws TransformerException,
											IOException{
		TransformerFactory factory = TransformerFactory.newInstance();
		Templates templ = factory.newTemplates(new StreamSource(
													new File(path)));
		Transformer transformer = templ.newTransformer();
		StringWriter out = new StringWriter();
		StringReader in = new StringReader(content);
		transformer.transform(new StreamSource(in), new StreamResult(out));
		out.close();
		content = out.toString();
		return content;
	}
	
	public static void main(String args[]){
		if(args.length == 0){
			System.out.println("Usage:");
			System.out.println("org.hyperscope.transformers.xhtml.XHTMLTransformer url [beSafe]");
			System.exit(1);
		}
		
		String fetchMe = args[0];
		boolean beSafe = false;
		
		if(args.length > 1){
			beSafe = new Boolean(args[1]).booleanValue();
		}
		
		try{
			String currentPath = new File("src" + File.separator
											+ "server" + File.separator
											+ "xhtml_transformer").toString();
			XHTMLTransformer t = new XHTMLTransformer(currentPath);
			String results = t.transform(fetchMe, beSafe);
			System.out.println(results);
			System.exit(0);
		}catch(Exception e){
			System.out.println(e);
			System.exit(1);
		}
	}
}