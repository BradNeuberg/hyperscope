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

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.model.AugmentFile;
import org.nlsaugment.augxml.model.Block;
import org.nlsaugment.augxml.model.RingElement;
import org.nlsaugment.augxml.model.StatementDataBlock;
import org.nlsaugment.augxml.model.StatementDataBlockHeader;
import org.nlsaugment.augxml.model.StructureBlock;
import org.nlsaugment.augxml.type.AugAddress;
import org.nlsaugment.augxml.util.MetaData;
import org.nlsaugment.augxml.util.Util;

/**
 * This file writer will print out an ASCII-text based representation of the Augment file.
 * It is similar to the file that is created by Augment after doing a 
 * "Create Sequential File from File" command.
 * @author Jonathan Cheyer
 *
 */
public final class TextFileWriter implements IAugmentWriter {
  public TextFileWriter() {}
  
  public void save(final AugmentFile file, final MetaData metaData, final String filename) {
    try {
      final PrintWriter pw = new PrintWriter(new BufferedWriter(new FileWriter(new File(filename))));
      convert(file, pw);
      pw.close();
    } catch (IOException e) {
      throw new AugmentException("unable to write to file: " + filename, e);
    }
  }
  
  private String asDisplayable(final String s) {
    final String result = Util.removeInvisibleCharacters(s);
    return result == null ? "" : result;
  }

  private void convert(final AugmentFile af, final PrintWriter pw) {
    final List<Block> blocks = af.getBlocks();
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
      traverseTree(re, re, blocks, -1, pw); // -1 allows both origin and top-level plex to use no indenting
    }
  }
  
  private void traverseTree(final RingElement parentRingElement, final RingElement current, final List<Block> blocks, final int level, final PrintWriter pw) {
    final Location currentPsid = current.getPsid();

    addStatement(current, blocks, level, pw);

    final AugAddress rsub = current.getSubstatementPsid();        
    final RingElement subre = findRingElementByPsid(rsub, blocks);    
    // nodes with no substatements have substatement psids that point to themselves
    if (! subre.getPsid().equals(currentPsid)) {  
      traverseTree(current, subre, blocks, level + 1, pw);
    }
    
    final AugAddress rsuc = current.getSuccessorPsid();
    final RingElement sucre = findRingElementByPsid(rsuc, blocks);
    // TODO another way to check if tail of plex is to use rtf field from RingElement
    // nodes with no successive statement have successive psids that point to their parent
    if (! sucre.getPsid().equals(parentRingElement.getPsid())) {
      traverseTree(parentRingElement, sucre, blocks, level, pw);
    }    
  }

  private void addStatement(final RingElement re, final List<Block> blocks, final int level, final PrintWriter pw) {
    final Location rsdb = re.getPropertyPsid().toLocation();
    
    final int statusTableIndex = rsdb.getPageIndex() + 101;
    final int wordIndex = rsdb.getWordIndex();
    
    final Location sdbhLocation = new Location(statusTableIndex, wordIndex);
    final StatementDataBlockHeader sdbh = new StatementDataBlockHeader(re.getMemorySpace(), sdbhLocation, 5 * bitsPerWord);
    if (sdbh.getGarbageFlag().getValue()) {
      return;
    }
    final int numWords = sdbh.getNumberOfWords().getValue();
   
    // TODO: clean this up
    final Location deLocation = new Location(statusTableIndex, wordIndex + 5);
    final StatementDataBlock sdb = new StatementDataBlock(re.getMemorySpace(), deLocation, numWords * bitsPerWord - bitsPerStatementDataBlockHeader, sdbh);
    final String text = sdb.getText();
    
    pw.println(indent(asDisplayable(text.toString()), level));
  }
  
  private String indent(final String s, final int level) {
    final StringBuilder sb = new StringBuilder();
    for (int i = 0; i < level; i++) {
      sb.append("   ");
    }
    sb.append(s);
    return sb.toString();
  }
  
  private RingElement findRingElementByPsid(AugAddress psid, List<Block> blocks) {
    final int structureBlockIndex = psid.getBlockIndex() + 6;
    final int ringElementIndex = psid.getWordIndex() / 5;
    final StructureBlock sb = (StructureBlock) blocks.get(structureBlockIndex);
    final RingElement[] re = sb.getRingElements();
    return re[ringElementIndex];
  }
}
