/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.util;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Properties;
import java.util.Set;

import org.nlsaugment.augxml.exception.AugmentException;

/**
 * This class stores additional metadata for an Augment file. It is used to store
 * additional attributes that may not be part of the file, such as the path used 
 * by the underlying filesystem to store the file name.
 * @author Jonathan Cheyer
 *
 */
public final class MetaData {
  
  // The path of the original filename representing the AugmentFile
  public static final String PATH = "PATH";
  
  private HashMap<String, String> _map = new HashMap<String, String>();
  
  public MetaData() {}
  
  public boolean contains(final String key) {
    return this._map.containsKey(key);
  }
  
  public String get(final String key) {
    if (! this._map.containsKey(key)) {
      throw new AugmentException("map does not contain a value with key: " + key);
    }
    return this._map.get(key);
  }

  public String get(final String key, final String defaultValue) {
    if (this._map.containsKey(key)) {
      return this._map.get(key);
    }
    return defaultValue;      
  }

  public void put(final String key, final String value) {
    this._map.put(key, value);
  }
  
  public Set<String> keySet() {
    return this._map.keySet();
  }
  
  public void addSystemProps(final String prefix) {
    final Properties props = System.getProperties();
    addProps(prefix, props);
  }
  
  public void addProps(final String prefix, final String filename) {
    try {
      final Properties props = new Properties();
      props.load(ClassLoader.getSystemClassLoader().getResourceAsStream(filename));
      addProps(prefix, props);
    } catch (FileNotFoundException e) {
      throw new AugmentException("unable to read properties file: " + filename, e);
    } catch (IOException e) {
      throw new AugmentException("error reading file: " + filename, e);
    } 
}
  
  private void addProps(final String prefix, final Properties props) {
    for (Object key : props.keySet()) {
      if (! (key instanceof String)) {
        throw new AugmentException("invalid type: " + key.getClass().getName());
      }
      final String keyString = (String) key;
      if (keyString.startsWith(prefix)) {
        put(keyString, props.getProperty(keyString));
      }
    }
  }
}
