package org.hyperscope.transformers.xhtml;

import java.lang.ref.WeakReference;

class CacheEntry{
	private String url;
	private WeakReference content;
	
	public CacheEntry(String url, String content){
		this.url = url;
		this.content = new WeakReference(content);
	}
	
	public String getURL(){ return url; }
	
	public String getContent(){
		Object results = null;
		results = this.content.get();
		if(results != null){
			return (String)results;
		}else{
			return null;
		}
	}
	
	public int hashCode(){
		return url.hashCode();
	}
	
	public String toString(){
		return this.url + ":" + this.getContent();
	}
}