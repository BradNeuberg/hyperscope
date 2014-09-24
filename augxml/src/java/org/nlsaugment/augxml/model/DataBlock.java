/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.Constants.bitsPerBlockHeader;
import static org.nlsaugment.augxml.Constants.bitsPerWord;
import static org.nlsaugment.augxml.Constants.wordsPerDataBlockData;
import static org.nlsaugment.augxml.Constants.wordsPerPage;
import static org.nlsaugment.augxml.Constants.wordsPerStatementDataBlockHeader;
import static org.nlsaugment.augxml.type.AugType.Type.OBJECT;

import java.util.ArrayList;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.exception.LocationOutOfRangeException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.Page;
import org.nlsaugment.augxml.util.BitBox;
import org.nlsaugment.augxml.util.Field;
import org.nlsaugment.augxml.util.FieldHelper;

/**
 * A DataBlock stores the non-structural data for an Augment file. It contains multiple
 * variable-length DataElements. Most Augment files have DataElements which are textual in nature,
 * (as opposed to graphical or other). Textual DataElements are called StatementDataBlocks.
 * @author Jonathan Cheyer
 *
 */
public final class DataBlock extends Block {
  private final DataElement[] _dataElements;
  
  public enum Record {blockHeader, data}  
  private static final Field[] __fields = new Field[] {
    new Field(Record.blockHeader, bitsPerBlockHeader, OBJECT), // see BlockHeader class
    
    // 510 words of text
    new Field(Record.data, wordsPerDataBlockData * bitsPerWord, OBJECT)
  };
  private static final FieldHelper __helper = new FieldHelper(__fields);
  
  private DataBlock(final Page page, final int recordNumber, final DataElement[] dataElements) {
    super(__fields, page, recordNumber);
    this._dataElements = dataElements;
    check();
  }
      
  static DataBlock newInstance(final Page page, final int recordNumber, final FileHeaderBlock fhb) {
    
//    System.out.println("page location is: " + page.getLocation());
//    System.out.println("recordNumber is: " + recordNumber);
    
    final DataBlockStatusTable dbst = fhb.getDataBlockStatusTable();
    final int rffree = dbst.getRecords()[recordNumber].getFree().getValue();
//    System.out.println("rffree=" + rffree);
    final ArrayList<StatementDataBlock> list = new ArrayList<StatementDataBlock>();
    Location sdbhLocation = page.getLocation().newLocation(2 * bitsPerWord);
    while (true) {
//      System.out.println("sdbhLocation is " + sdbhLocation);
      if (rffree != 0 && sdbhLocation.getWordIndex() >= rffree) {
//        System.out.println("breaking to next page! sdbhLocation is >= to rffree");
        // the rest of the data in this page is not valid (even sgarb and slength).
        // TODO: the rest of the data needs to be stored in base64 format by the LosslessFileWriter.
        //       it is not guaranteed to be empty (all zeros).
        break;
      }
      if (sdbhLocation.getWordIndex() + wordsPerStatementDataBlockHeader > 511) {
    	  final BitBox bb = page.getBits().get(sdbhLocation.getWordIndex() * bitsPerWord, 511 * bitsPerWord);
    	  if (! bb.isEmpty()) {
//    		  System.out.println("bb=" + bb.toBinary());
//    		  throw new AugmentException("remaining bits are not empty");
    	  }
    	  break;
    	  // TODO: store in base64
      }
      final int sdbhSize = wordsPerStatementDataBlockHeader;
//      System.out.println("sdbhSize=" + sdbhSize);
      final StatementDataBlockHeader sdbh = new StatementDataBlockHeader(page.getMemorySpace(), sdbhLocation, sdbhSize * bitsPerWord);
      final boolean sgarb = sdbh.getGarbageFlag().getValue(); 

      int slength = sdbh.getNumberOfWords().getValue();

 //     System.out.println("garbage=" + sdbh.getGarbageFlag().getValue());
 //     System.out.println("slength is " + slength);
      if (sgarb) {
        if (slength < 0 || slength >= wordsPerPage) {
          throw new AugmentException("slength is out of range: " + slength);
        }
        if (slength == 0) {
//          System.out.println("breaking to next page! numWords = 0, unable to locate next DataBlock");
          // TODO: the rest of the data needs to be stored in base64 format by the LosslessFileWriter.
          //       it is not guaranteed to be empty (all zeros).
          break;
        }
      } else {
    	  if (slength == 0) {
// 		    break;
    	  }
    	  else if (slength < wordsPerStatementDataBlockHeader || slength >= wordsPerPage) {
          throw new AugmentException("slength is out of range: " + slength);
        }        
      }

      final Location sdbLocation = sdbhLocation.newLocation(sdbhSize * bitsPerWord);
      // final int sdbSize = slength == 0 ? 0 : slength - sdbhSize;
      int sdbSize = slength == 0 ? 0 : slength - sdbhSize;
      if (sdbSize < 0) {
    	  // throw new AugmentException("invalid size: " + sdbSize);
    	  sdbSize = 5;
      }
      StatementDataBlock sdb = null;
      try {
        sdb = new StatementDataBlock(page.getMemorySpace(), sdbLocation, sdbSize * bitsPerWord, sdbh);
      } catch (LocationOutOfRangeException e) {
        // some files appear to have a bogus sdbSize; for now, just ignore this particular sdb
        // TODO: fix this
        break;
      }
      if (sdb.isEmpty()) {
//    	  System.out.println("sdb is empty");
      }

      list.add(sdb);
      final int nextLocation = sdbh.getLocation().getWordIndex() + sdbhSize + sdbSize;
      if (nextLocation > wordsPerPage) {
    	  break;
//        throw new AugmentException("nextLocation is too large: " + nextLocation);
      }
      if (nextLocation == wordsPerPage) {
//        System.out.println("breaking to next page! nextLocation = " + nextLocation + ", exactly the number of words per page. Perfect!");
        break;
      }
      sdbhLocation = sdbhLocation.newLocation((sdbhSize + sdbSize) * bitsPerWord);
    }
    final StatementDataBlock[] sdbs = list.toArray(new StatementDataBlock[list.size()]);
    return new DataBlock(page, recordNumber, sdbs);
  }
  
  private void check() {
    if (getBlockHeader().getType() != BlockHeader.BlockType.sdbtyp) {
      throw new AugmentException("block header should be of type sdbtyp but is: " + getBlockHeader().getType());
    }
  }
  
  public DataElement[] getDataElements() {
    return this._dataElements;
  }
  
  public static Location getFieldLocation(final Enum field, final Location objectLocation) {
    return __helper.getFieldLocation(field, objectLocation);
  }
}
