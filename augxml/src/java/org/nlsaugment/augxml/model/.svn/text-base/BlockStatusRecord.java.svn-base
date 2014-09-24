/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.type.AugType.Type.BOOLEAN;
import static org.nlsaugment.augxml.type.AugType.Type.PAGE_INDEX;
import static org.nlsaugment.augxml.type.AugType.Type.UNSIGNED_NUMBER;
import static org.nlsaugment.augxml.type.AugType.Type.UNUSED;

import java.util.Map;

import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;
import org.nlsaugment.augxml.memory.WriteableMemorySpace;
import org.nlsaugment.augxml.type.AugBoolean;
import org.nlsaugment.augxml.type.AugBlockIndex;
import org.nlsaugment.augxml.type.AugType;
import org.nlsaugment.augxml.type.AugUnsignedNumber;
import org.nlsaugment.augxml.type.AugUnused;
import org.nlsaugment.augxml.util.Field;
import org.nlsaugment.augxml.util.FieldHelper;

/**
 * A BlockStatusRecord is used by Augment to determine if the Block is in core memory,
 * or if it needs to be loaded from disk. Early machines on which Augment ran did not
 * have enough memory to entirely load large Augment files from disk.
 * @author Jonathan Cheyer
 *
 */
public final class BlockStatusRecord extends ModelObject {
  private final int _recordNumber;
  
  public enum Record {rfexis, rfpart, rfnull, rfused, rffree, rfcore, unused1}  
  private static final Field[] __fields = new Field[] {
    // true (i.e., nonzero) if the block exists in the file
    new Field(Record.rfexis,   1, BOOLEAN),
    
    //  true if block comes from partial copy
    new Field(Record.rfpart,   1, BOOLEAN),
    
    //  unused
    new Field(Record.rfnull,   2, UNUSED),
    
    //  used word count for the block
    new Field(Record.rfused,  10, UNSIGNED_NUMBER),
    
    //  free pointer for the block
    new Field(Record.rffree,  10, UNSIGNED_NUMBER),
    
    //  0 then not in core, else page index
    new Field(Record.rfcore,  9, PAGE_INDEX),
    
    //  unused bits that add up to a word boundary
    new Field(Record.unused1, 3, UNUSED)
  };
  private static final FieldHelper __helper = new FieldHelper(__fields);
  
  public BlockStatusRecord(final MemorySpace memorySpace, final Location location, final int numBits, final int recordNumber) {
    super(__fields, memorySpace, location, numBits);
    this._recordNumber = recordNumber;
  }

  public int getRecordNumber() {
    return this._recordNumber;
  }
  
  private AugType get(final Enum fieldName) {
    return __helper.get(this, fieldName);
  }

  public AugBoolean getExists() {
    return (AugBoolean) get(Record.rfexis);
  }

  public AugBoolean getPartial() {
    return (AugBoolean) get(Record.rfpart);
  }

  public AugUnused getNull() {
    return (AugUnused) get(Record.rfnull);
  }

  public AugUnsignedNumber getUsed() {
    return (AugUnsignedNumber) get(Record.rfused);
  }

  public AugUnsignedNumber getFree() {
    return (AugUnsignedNumber) get(Record.rffree);
  }

  public AugBlockIndex getCore() {
    return (AugBlockIndex) get(Record.rfcore);
  }
  
  private static void put(final WriteableMemorySpace wms, final Location location, final Enum fieldName, final String value) {
    __helper.put(wms, location, fieldName, value);
  }

  public static void update(final WriteableMemorySpace wms, final Location location, final Map<String, String> attributes) {
    put(wms, location, Record.rfexis, attributes.get(Record.rfexis.name()));
    put(wms, location, Record.rfpart, attributes.get(Record.rfpart.name()));
    put(wms, location, Record.rfused, attributes.get(Record.rfused.name()));
    put(wms, location, Record.rffree, attributes.get(Record.rffree.name()));
    put(wms, location, Record.rfcore, attributes.get(Record.rfcore.name()));    
  }
}
