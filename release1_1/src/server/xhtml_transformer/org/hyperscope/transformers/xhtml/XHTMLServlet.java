package org.hyperscope.transformers.xhtml;

import java.io.*;
import java.net.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class XHTMLServlet extends HttpServlet {
	private Map cache;
	
	public void init() throws ServletException {
		cache = Collections.synchronizedMap(new HashMap());
	}
	
	public void doGet(HttpServletRequest req,
						HttpServletResponse res)
							throws IOException,
									ServletException {
		String fetchMe = req.getParameter("url");
		boolean reload = false;
		if(req.getParameter("reload") != null 
			&& req.getParameter("reload").equals("true")){
			reload = true;
		}
		
		// do we already have this page cached?
		if(cache.get(fetchMe) != null){
			CacheEntry entry = (CacheEntry)cache.get(fetchMe);
			// force a reload?
			if(reload == true){
				cache.remove(fetchMe);
			}else{
				String content = entry.getContent();
				if(content != null){
					returnResults(res, content);
					return;
				}
			}
		}
		
		// otherwise, process it for the first time now
		String results = null;
		try{
			String realPath = getServletContext().getRealPath(".");
			String path = getServletContext().getRealPath(".");
			XHTMLTransformer t = new XHTMLTransformer(path);
			results = t.transform(fetchMe, true);
		}catch(Exception e){
			returnError(res, fetchMe, e);
			return;
		}
		
		// cache it
		CacheEntry entry = new CacheEntry(fetchMe, results);
		cache.put(fetchMe, entry);
		
		// return results
		returnResults(res, results);
	}
	
	private void returnResults(HttpServletResponse res,
								String content)
										throws IOException,
												ServletException{
		res.setContentType("text/xml");
		PrintWriter out = res.getWriter();
		out.write(content);
		out.close();
	}
	
	private void returnError(HttpServletResponse res,
							String fetchMe, Exception e)
										throws IOException,
												ServletException{
		if(e instanceof SecurityException){
			// HTTP Status Code 403
			res.sendError(HttpServletResponse.SC_FORBIDDEN, 
							"You do not have permission to access this resource");
		}else if(e instanceof IOException){
			// HTTP Status Code 500
			res.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
							"Error while fetching resource: " + e.toString());
		}else{
			// turn the stack trace into a string
			StringWriter writer = new StringWriter();
			e.printStackTrace(new PrintWriter(writer));
			String message = writer.toString();
			
			// HTTP Status Code 500
			res.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, 
							"Server error: " + message);
		}
	}
}