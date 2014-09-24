/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.writer;

import static org.nlsaugment.augxml.Constants.bitsPerStatementDataBlockHeader;
import static org.nlsaugment.augxml.Constants.bitsPerWord;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.model.AugmentFile;
import org.nlsaugment.augxml.model.Block;
import org.nlsaugment.augxml.model.FileHeaderBlock;
import org.nlsaugment.augxml.model.RingElement;
import org.nlsaugment.augxml.model.StatementDataBlock;
import org.nlsaugment.augxml.model.StatementDataBlockHeader;
import org.nlsaugment.augxml.model.StructureBlock;
import org.nlsaugment.augxml.type.AugAddress;
import org.nlsaugment.augxml.util.MetaData;
import org.nlsaugment.augxml.util.Util;
import org.nlsaugment.augxml.util.XmlSerializer;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.ProcessingInstruction;

/**
 * This file writer will write out an Augment file in the format that is expected by
 * the Hyperscope. In particular, it is an OPML 2.0 document with a few Hyperscope-specific
 * custom attributes. However, it is a lossy writer. In other words, certain information 
 * about the original Augment file will be lost. When files written by this writer are 
 * converted back into the original Augment file format, they will not be byte-equivalent with the
 * original file.
 * @author Jonathan Cheyer
 *
 */
public final class HyperscopeFileWriter implements IAugmentWriter {
  private static final String __propertyHs = "augxml.writer.hyperscope.";
  private static final String __propertyStylesheet = __propertyHs + "stylesheet";
  private static final String __propertyPrefix = __propertyHs + "namespace.prefix";
  private static final String __propertyUri = __propertyHs + "namespace.uri"; 
  private static final String __propertyOpmlVersion = __propertyHs + "opmlVersion";
  private static final String __propertyEnableLinks = __propertyHs + "link.enable";  
  private static final String __propertyLinkStart = __propertyHs + "link.start.";
  private static final String __propertyLinkEnd = __propertyHs + "link.end.";
  
  //Augment only has 4 known link syntaxes: "<>", "()", "[]", and "(see-- )"
  private static final int __maxLinkTypes = 4;
  
  public HyperscopeFileWriter() {}
  
  public void save(final AugmentFile file, final MetaData metaData, final String filename) {
    final Document xmlDocument = convert(file, metaData);
    XmlSerializer.serialize(xmlDocument, filename);
  }
  
  private String asDisplayable(final String s) {
    final String result = Util.removeInvisibleCharacters(s);
    return result == null ? "" : result;
  }
  
  private Document convert(final AugmentFile af, final MetaData metaData) {
    try {
      final Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
      final String stylesheet = metaData.get(__propertyStylesheet);
      final String piTarget = "xml-stylesheet";
      final String piData = "type='text/xsl' href='" + stylesheet + "'";
      final ProcessingInstruction pi = document.createProcessingInstruction(piTarget, piData);
      document.appendChild(pi);
      final String prefix = metaData.get(__propertyPrefix);
      final String uri = metaData.get(__propertyUri);
      final Element rootElement = document.createElement("opml");
      rootElement.setAttribute("version", metaData.get(__propertyOpmlVersion));
      document.appendChild(rootElement);
            
      final List<Block> blocks = af.getBlocks();
      final FileHeaderBlock fhb = (FileHeaderBlock) blocks.get(0);

      final Element headElement = document.createElement("head");
      rootElement.appendChild(headElement);
      headElement.setAttributeNS(uri, prefix + "nidCount", fhb.getSidCount().toString());
      final String left = asDisplayable(fhb.getLeftDelimiter().toString());
      headElement.setAttributeNS(uri, prefix + "left-label-delim", left);
      final String right = asDisplayable(fhb.getRightDelimiter().toString());
      headElement.setAttributeNS(uri, prefix + "right-label-delim", right);

      final Element titleElement = document.createElement("title");
      titleElement.setTextContent(metaData.get(MetaData.PATH));
      headElement.appendChild(titleElement);
      
      final Element dateCreatedElement = document.createElement("dateCreated");
      dateCreatedElement.setTextContent(fhb.getCreationDate().formatString());
      headElement.appendChild(dateCreatedElement);
      
      final String owner = asDisplayable(fhb.getLastModUser().toString()).trim();
      final Element ownerNameElement = document.createElement("ownerName");
      ownerNameElement.setTextContent(owner);
      headElement.appendChild(ownerNameElement);

      final Element dateModifiedElement = document.createElement("dateModified");
      dateModifiedElement.setTextContent(fhb.getLastModTime().formatString());
      headElement.appendChild(dateModifiedElement);
      
      final StructureBlock sb = (StructureBlock) blocks.get(6);
      // TODO: a handleful (about ten, or ~ 0.2%) of journal files appear to have no 
      // structure blocks at all. I'm not sure if this was a valid configuration for
      // those journal files at some point in time, or if they are corrupted. 
      // More research needed.
      // Files should, in general, always have at least one structure block.
      // Anyway, for now, just check if the structure block is not empty before proceeding
      // to get its ring elements.
      if (! sb.isEmpty()) {
        final RingElement re = sb.getRingElements()[0];
        
        final Element bodyElement = document.createElement("body");
        rootElement.appendChild(bodyElement);
        
        traverseTree(bodyElement, re, re, blocks, document, metaData);
      }
      return document;
    } catch (ParserConfigurationException e) {
      throw new AugmentException("unable to create new XML structure", e);
    }
  }  

  private void traverseTree(final Element parent, final RingElement parentRingElement, final RingElement current, final List<Block> blocks, final Document document, final MetaData metaData) {
    final Location currentPsid = current.getPsid();

    final Element child = addStatement(parent, current, blocks, document, metaData);
    if (child == null) {
      return;
    }

    final AugAddress rsub = current.getSubstatementPsid();        
    final RingElement subre = findRingElementByPsid(rsub, blocks);    
    // nodes with no substatements have substatement psids that point to themselves
    if (! subre.getPsid().equals(currentPsid)) {  
      traverseTree(child, current, subre, blocks, document, metaData);
    }
    
    final AugAddress rsuc = current.getSuccessorPsid();
    final RingElement sucre = findRingElementByPsid(rsuc, blocks);
    // TODO another way to check if tail of plex is to use rtf field from RingElement
    // nodes with no successive statement have successive psids that point to their parent
    if (! sucre.getPsid().equals(parentRingElement.getPsid())) {
      traverseTree(parent, parentRingElement, sucre, blocks, document, metaData);
    }    
  }
  
  private Element addStatement(final Element parent, final RingElement re, final List<Block> blocks, final Document document, final MetaData metaData) {
    final Location rsdb = re.getPropertyPsid().toLocation();
    
    final int statusTableIndex = rsdb.getPageIndex() + 101;
    final int wordIndex = rsdb.getWordIndex();
    
    final Location sdbhLocation = new Location(statusTableIndex, wordIndex);
    final StatementDataBlockHeader sdbh = new StatementDataBlockHeader(re.getMemorySpace(), sdbhLocation, 5 * bitsPerWord);
    if (sdbh.getGarbageFlag().getValue()) {
      return null;
    }
    final int numWords = sdbh.getNumberOfWords().getValue();
    
    // TODO: clean this up
    final Location sdbLocation = new Location(statusTableIndex, wordIndex + 5);
    final StatementDataBlock sdb = new StatementDataBlock(re.getMemorySpace(), sdbLocation, numWords * bitsPerWord - bitsPerStatementDataBlockHeader, sdbh);
    final String sdbText = sdb.getText();
    
    final String uri = metaData.get(__propertyUri);
    final String prefix = metaData.get(__propertyPrefix);
    
    final Element statement = document.createElement("outline");    
    final boolean enableLinks = "true".equals(metaData.get(__propertyEnableLinks));
    
    // pre-encode ampersand. The "&" character will get double-encoded, which we want.
    String text = sdbText.toString().replaceAll("&", "&amp;");
    
    if (enableLinks) {
      final List<Map<String, String>> transformers = getTransformers(metaData);
      text = asDisplayable(Util.transformLF(Util.transformLinks(text, transformers)));
    } else {
      text = asDisplayable(Util.transformLF(text));
    }
    statement.setAttribute("text", text);
    
    statement.setAttributeNS(uri, prefix + "nid", Util.formatSid(re.getSid()));
    final String owner = asDisplayable(sdbh.getCreationUser().toString()).trim();
    statement.setAttributeNS(uri, prefix + "createdBy", owner);    
    statement.setAttributeNS(uri, prefix + "createdOn", sdbh.getCreationDate().formatString());
    final String left = asDisplayable(sdbh.getLeftDelimiter().toString());
    statement.setAttributeNS(uri, prefix + "left-label-delim", left);
    final String right = asDisplayable(sdbh.getRightDelimiter().toString());
    statement.setAttributeNS(uri, prefix + "right-label-delim", right);      
    final String label = asDisplayable(sdb.getLabel().toString());
    statement.setAttributeNS(uri, prefix + "label", label);    
    
    parent.appendChild(statement);
    return statement;
  }

  private List<Map<String, String>> getTransformers(final MetaData metaData) {
    final ArrayList<Map<String, String>> list = new ArrayList<Map<String, String>>();
    for (int i = 0; i < __maxLinkTypes; i++) {
      if (metaData.contains(__propertyLinkStart + i) && metaData.contains(__propertyLinkEnd + i)) {
        final String start = metaData.get(__propertyLinkStart + i);
        final String end = metaData.get(__propertyLinkEnd + i);
        final HashMap<String, String> map = new HashMap<String, String>();
        map.put("start", start);
        map.put("end", end);
        list.add(map);
      }
    }
    return list;
  }
  
  private RingElement findRingElementByPsid(AugAddress psid, List<Block> blocks) {
    final int structureBlockIndex = psid.getBlockIndex() + 6;
    final int ringElementIndex = psid.getWordIndex() / 5;
    final StructureBlock sb = (StructureBlock) blocks.get(structureBlockIndex);
    final RingElement[] re = sb.getRingElements();
    return re[ringElementIndex];
  }
}
