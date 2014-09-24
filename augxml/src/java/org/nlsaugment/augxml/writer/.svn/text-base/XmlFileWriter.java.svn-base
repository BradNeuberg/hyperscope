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

import java.util.List;

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

/**
 * This file writer will write out an Augment file in a format that is suitable for modern
 * viewers and editors. In particular, it is useful for the Hyperscope project.
 * However, it is a lossy writer. In other words, certain information 
 * about the original Augment file will be lost. When files written by this writer are 
 * converted back into the original Augment file format, they will not be byte-equivalent with the
 * original file.
 * @author Jonathan Cheyer
 *
 */
public final class XmlFileWriter implements IAugmentWriter {
  private static final String __propertyXml = "augxml.writer.xml.";
  private static final String __propertyUri = __propertyXml + "namespace.uri"; 
  private static final String __propertyPrefix = __propertyXml + "namespace.prefix";

  public XmlFileWriter() {}
  
  public void save(final AugmentFile file, final MetaData metaData, final String filename) {
    final Document xmlDocument = convert(file, metaData);
    XmlSerializer.serialize(xmlDocument, filename);
  }
  
  private Document convert(final AugmentFile af, final MetaData metaData) {
    try {
      final Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
      final Element rootElement = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix) + "document");          
      document.appendChild(rootElement);
      
      final List<Block> blocks = af.getBlocks();
      final FileHeaderBlock fhb = (FileHeaderBlock) blocks.get(0);
      rootElement.setAttribute("creationDate", fhb.getCreationDate().formatString());
      rootElement.setAttribute("modificationUser", fhb.getLastModUser().toString());
      rootElement.setAttribute("modificationDate", fhb.getLastModTime().formatString());
      rootElement.setAttribute("nidCount", fhb.getSidCount().toString());

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
        traverseTree(rootElement, re, re, blocks, document, metaData);
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
    final String text = sdb.getText();
    
    final Element statement = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix) + "statement");
    statement.setAttribute("sid", Util.formatSid(re.getSid()));
    statement.setAttribute("text", text.toString());
    statement.setAttribute("creationUser", sdbh.getCreationUser().toString());
    statement.setAttribute("creationDate", sdbh.getCreationDate().formatString());
    statement.setAttribute("leftDelimiter", sdbh.getLeftDelimiter().toString());
    statement.setAttribute("rightDelimiter", sdbh.getRightDelimiter().toString());
    parent.appendChild(statement);
    return statement;
  }
  
  private RingElement findRingElementByPsid(AugAddress psid, List<Block> blocks) {
    final int structureBlockIndex = psid.getBlockIndex() + 6;
    final int ringElementIndex = psid.getWordIndex() / 5;
    final StructureBlock sb = (StructureBlock) blocks.get(structureBlockIndex);
    final RingElement[] re = sb.getRingElements();
    return re[ringElementIndex];
  }
}
