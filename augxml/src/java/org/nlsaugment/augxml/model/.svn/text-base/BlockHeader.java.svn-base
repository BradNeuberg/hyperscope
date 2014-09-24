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
import static org.nlsaugment.augxml.Constants.maxBlocksPerFile;
import static org.nlsaugment.augxml.type.AugType.Type.PAGE_INDEX;
import static org.nlsaugment.augxml.type.AugType.Type.UNSIGNED_NUMBER;
import static org.nlsaugment.augxml.type.AugType.Type.UNUSED;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;
import org.nlsaugment.augxml.memory.WriteableMemorySpace;
import org.nlsaugment.augxml.type.AugBlockIndex;
import org.nlsaugment.augxml.type.AugType;
import org.nlsaugment.augxml.type.AugUnsignedNumber;
import org.nlsaugment.augxml.util.Field;
import org.nlsaugment.augxml.util.FieldHelper;

/**
 * All Blocks contain a BlockHeader. The BlockHeader is 2 Words in length and contains
 * information such as the type of Block and the page number of the block.
 * @author Jonathan Cheyer
 *
 */
public final class BlockHeader extends ModelObject {
  
  public enum Record {fbnull, fbind, fbpnum, fbtype, unused}  
  private static final Field[] __fields = new Field[] {
    new Field(Record.fbnull, 36, UNUSED),  // unused
    new Field(Record.fbind,   9, UNSIGNED_NUMBER),  // status table index
    new Field(Record.fbpnum,  9, PAGE_INDEX), // page number in file of this block
    new Field(Record.fbtype,  5, UNSIGNED_NUMBER),  // type of this block (must be one of BlockType enum)
    new Field(Record.unused, 13, UNUSED)
  };
  private static final FieldHelper __helper = new FieldHelper(__fields);
  
  public enum BlockType {    
    hdtyp (0),   // header
    sdbtyp (1),  // data
    rngtyp (2),  // ring
    jnktyp (3);  // misc (such as keyword, viewchange, etc.  Not currently used.)
    
    private final int _value;
    private static final HashMap<Integer, BlockType> __map = initMap();
    
    BlockType(final int value) {   
      this._value = value;
    }
      
    private static HashMap<Integer, BlockType> initMap() {
      final HashMap<Integer, BlockType> map = new HashMap<Integer, BlockType>();
      final EnumSet<BlockType> set = EnumSet.allOf(BlockType.class);
      for (BlockType element : set) {
        map.put(element._value, element);
      }
      return map;
    }
    
    public int getValue() {
      return this._value;
    }
    
    public static BlockType valueOf(final int value) {
      final BlockType result = __map.get(value);
      if (result == null) {
        throw new AugmentException("invalid value for BlockType: " + value);
      }
      return result;
    }    
  }
    
  public BlockHeader(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(__fields, memorySpace, location, numBits);
    check();
  }

  private void check() {
    if (getNumBits() != bitsPerBlockHeader) {
      throw new AugmentException("blockHeader number of bits is invalid: " + getNumBits());
    }
    final AugBlockIndex blockIndex = getBlockNumber();
    if (blockIndex.getValue() < 0 || blockIndex.getValue() > maxBlocksPerFile) {
      throw new AugmentException("invalid block number: " + blockIndex.toString());
    }
  }

  private AugType get(final Enum fieldName) {
    return __helper.get(this, fieldName);
  }
  
  public AugUnsignedNumber getStatusTable() {
    return (AugUnsignedNumber) get(Record.fbind);
  }

  public AugBlockIndex getBlockNumber() {
    return (AugBlockIndex) get(Record.fbpnum);
  }

  public BlockType getType() {
    final long type = ((AugUnsignedNumber) get(Record.fbtype)).getValue();
    return BlockType.valueOf((byte) type);
  }

  private static void put(final WriteableMemorySpace wms, final Location location, final Enum fieldName, String value) {
    __helper.put(wms, location, fieldName, value);
  }

  public static void update(final WriteableMemorySpace wms, final Location location, final Map<String, String> attributes) {
    put(wms, location, Record.fbind, attributes.get(Record.fbind.name()));
    put(wms, location, Record.fbpnum, attributes.get(Record.fbpnum.name()));
    put(wms, location, Record.fbtype, Integer.toString(BlockType.valueOf(attributes.get(Record.fbtype.name())).getValue()));
  }  
}
