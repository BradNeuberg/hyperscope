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
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.nlsaugment.augxml.exception.AugmentException;
import org.w3c.dom.Document;

/**
 * Serialize a DOM Document object to an XML file.
 * @author Jonathan Cheyer
 *
 */
public final class XmlSerializer {
  private static final int __indentLevel = 3;
  
  /**
   * Serialize a DOM Document to file. Indenting is enabled and set to 3.
   * @param document the DOM Document to serialize
   * @param filename the filename of the file to save to
   */
  public static void serialize(final Document document, final String filename) {
    doSerialize(document, filename);
  }
  
  /**
   * Due to a bug in JDK 1.5, it is necessary to create the StreamResult using a wrapped \
   * OutputStreamWriter. This apparently does work as a workaround,
   * although I'm not sure why at the moment.
   * For more info, see: http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6296446
   * @param document
   * @param filename
   */
  private static void doSerialize(final Document document, final String filename) {
    try {
      final TransformerFactory factory = TransformerFactory.newInstance();      
      factory.setAttribute("indent-number", __indentLevel);
      final Transformer transformer = factory.newTransformer();
      transformer.setOutputProperty(OutputKeys.INDENT, "yes");
      final DOMSource source = new DOMSource(document);
      final StreamResult result = new StreamResult(new OutputStreamWriter(new FileOutputStream(filename), "utf-8"));
      transformer.transform(source, result);
    } catch (TransformerConfigurationException e) {
      throw new AugmentException("unable to serialize XML for " + filename, e);
    } catch (TransformerException e) {
      throw new AugmentException("unable to serialize XML for " + filename, e);
    } catch (FileNotFoundException e) {
      throw new AugmentException("unable to serialize XML for " + filename, e);
    } catch (UnsupportedEncodingException e) {
      throw new AugmentException("unable to serialize XML for " + filename, e);
    }
  }
}
