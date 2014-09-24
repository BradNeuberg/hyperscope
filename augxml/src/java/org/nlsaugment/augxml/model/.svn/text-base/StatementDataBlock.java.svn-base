/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.Constants.bitsPerStatementDataBlockHeader;
import static org.nlsaugment.augxml.Constants.bitsPerWord;
import static org.nlsaugment.augxml.type.AugType.Type.OBJECT;
import static org.nlsaugment.augxml.type.AugType.Type.SEVEN_BIT_STRING;

import java.util.Map;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.exception.LocationOutOfRangeException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;
import org.nlsaugment.augxml.memory.WriteableMemorySpace;
import org.nlsaugment.augxml.type.Aug7BitString;
import org.nlsaugment.augxml.type.AugType;
import org.nlsaugment.augxml.util.Field;
import org.nlsaugment.augxml.util.FieldHelper;
import org.nlsaugment.augxml.util.Util;

import base64.Base64;

/**
 * A (Textual) Statement Data Block (SDB) is a DataElement that contains the text of NLS statements.
 * Like all DataElements, it contains a 5-word header, followed by variable-length data. The header
 * is stored in the StatementDataBlockHeader, and the header's slength field determines the number
 * of words in this SDB.  
 * @author Jonathan Cheyer
 *
 */
public final class StatementDataBlock extends DataElement {
  public enum Record {sdbHeader, data}  
  
  private static final Field[] __fields = new Field[] {
    new Field(Record.sdbHeader, bitsPerStatementDataBlockHeader, OBJECT),
    
    // TODO: fix this
    // this is added just to fill a word, since FieldHelper.reorder() method breaks if not full word
    new Field(Record.data, 1 * bitsPerWord, SEVEN_BIT_STRING) // size is not really 1 word; it is dynamically determined
    
  };
  private static final FieldHelper __helper = new FieldHelper(__fields);
  
  private final StatementDataBlockHeader _header;

  public StatementDataBlock(final MemorySpace memorySpace, final Location location, final int numBits, final StatementDataBlockHeader header) {
    super(memorySpace, location, numBits);
    this._header = header;
  }
  
  public StatementDataBlockHeader getStatementDataBlockHeader() {
    return this._header;
  }
  
  /**
   * Return the entire StatementDataBlock as a Base64-encoded String.
   * This method is meant to be used if StatementDataBlockHeader.getGarbageFlag() is true.
   * @return a Base64-encoded String
   */
  public String getBase64Data() {
    final byte[] bytes = getBits().toBytes();
    return Base64.encodeBytes(bytes);  
  }
  
  public String getText() {
    final int numChars = this._header.getNumberOfCharacters().getValue();
    if (numChars == 0) {
      return "";
    }
    final int numBits = (numChars / 5) * 36 + ((numChars % 5) * 7);
    if (numBits < 7) {
      throw new AugmentException("numBits must be at least 7 but is: " + numBits);
    }
    try {
      final Aug7BitString text = new Aug7BitString(getMemorySpace(), getLocation(), numBits);
      return text.toString();
    } catch (LocationOutOfRangeException e) {
      // TODO: Fix this out of range problem and remove the try/catch block
      return "ERROR - LocationOutOfRangeException" + e.getMessage();
    }
  }
  
  /**
   * Return the statement label (also known as statement name) of a statement.
   * @return the statement label
   */
  public String getLabel() {
    final String text = getText();
    final char left = getStatementDataBlockHeader().getLeftDelimiter().getValue();
    final char right = getStatementDataBlockHeader().getRightDelimiter().getValue();    
    return Util.getLabel(left, right, text);
  }
  
  private static void put(final WriteableMemorySpace wms, final Location location, final Enum fieldName, final String value, final int numBits) {
    __helper.put(wms, location, fieldName, value, numBits);
  }

  private static void put(final WriteableMemorySpace wms, final Location location, final Enum fieldName, final String value, AugType.Type type, final int numBits) {
    __helper.put(wms, location, fieldName, value, type, numBits);
  }
  
  public static void update(final WriteableMemorySpace wms, final Location location, final Map<String, String> attributes) {
    if (attributes.containsKey(Record.data.name())) {
      final String data = attributes.get(Record.data.name());
      final int numBits = (data.length() / 5) * 36 + ((data.length() % 5) * 7);      
//    TODO: investigate - does this approach allow for buffer overrun problems?    
      put(wms, location, Record.data, data, numBits);
    } else if (attributes.containsKey("textBase64")) {
      final String base64 = attributes.get("textBase64");
      final int numBits = Integer.parseInt(attributes.get("textBitSize"));      
      put(wms, location, Record.data, base64, AugType.Type.OBJECT, numBits);      
    } else throw new AugmentException("must contain either 'data' or 'base64' field");
  }
}
