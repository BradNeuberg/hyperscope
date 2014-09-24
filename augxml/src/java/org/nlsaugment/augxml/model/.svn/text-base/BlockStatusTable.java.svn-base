/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.Constants.bitsPerBlockStatusRecord;
import static org.nlsaugment.augxml.type.AugType.Type.OBJECT;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.type.AugObject;
import org.nlsaugment.augxml.util.Field;

/**
 * A BlockStatusTable contains multiple BlockStatusRecords. There are two types of
 * BlockStatusTables: DataBlockStatusTable and RingBlockStatusTable.
 * @author Jonathan Cheyer
 *
 */
public abstract class BlockStatusTable extends ModelObject {
  
  public enum Record {rfstr}  
  private static final Field[] __fields = new Field[] {
    new Field(Record.rfstr, bitsPerBlockStatusRecord, OBJECT)
  };

  // Random file block status record. (The entry will be
  // equal to 0 if the page (i.e., block) in the file is unallocated.
  // Otherwise, the entry will be an instance of the following record.)
  private final BlockStatusRecord[] _blockStatusRecords;

  protected BlockStatusTable(final AugObject statusTable) {
    super(__fields, statusTable.getMemorySpace(), statusTable.getLocation(), statusTable.getNumBits());
    if (getNumBits() % bitsPerBlockStatusRecord != 0) {
      throw new AugmentException("bits must be a multiple of " + bitsPerBlockStatusRecord + " but is " + getNumBits());
    }
    final int numRecords = getNumBits() / bitsPerBlockStatusRecord;
    this._blockStatusRecords = new BlockStatusRecord[numRecords];
    for (int i = 0; i < numRecords; i++) {
      final Location newLocation = getLocation().newLocation(i * bitsPerBlockStatusRecord);
      this._blockStatusRecords[i] = new BlockStatusRecord(getMemorySpace(), newLocation, bitsPerBlockStatusRecord, i); 
    }
  }

  public final int getNumRecords() {
    return this._blockStatusRecords.length;
  }

  public final BlockStatusRecord[] getRecords() {
    return this._blockStatusRecords;
  }
}
