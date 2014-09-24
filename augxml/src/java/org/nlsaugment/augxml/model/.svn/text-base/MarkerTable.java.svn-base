/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.Constants.bitsPerMarkerRecord;
import static org.nlsaugment.augxml.Constants.bitsPerMarkerTable;
import static org.nlsaugment.augxml.Constants.markerRecordsPerMarkerTable;
import static org.nlsaugment.augxml.type.AugType.Type.OBJECT;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.type.AugObject;
import org.nlsaugment.augxml.util.Field;

/**
 * A MarkerTable contains multiple MarkerRecords.
 * @author Jonathan Cheyer
 *
 */
public final class MarkerTable extends ModelObject {
  public enum Record {mrker}  
  private static final Field[] __fields = new Field[] {
    new Field(Record.mrker, bitsPerMarkerTable, OBJECT)
  };

  private final MarkerRecord[] _markerRecords;
  private final int _numRecords;
  
  public MarkerTable(final AugObject markerTable, final int numRecords) {
    super(__fields, markerTable.getMemorySpace(), markerTable.getLocation(), markerTable.getNumBits());
    this._numRecords = numRecords;
    check();
    final int maxRecords = markerRecordsPerMarkerTable;
    this._markerRecords = new MarkerRecord[maxRecords];
    for (int i = 0; i < maxRecords; i++) {      
      this._markerRecords[i] = new MarkerRecord(getMemorySpace(), getLocation().newLocation(i * bitsPerMarkerRecord), bitsPerMarkerRecord, i);
    }
  }
  
  private void check() {
    if (getNumBits() != bitsPerMarkerTable) {
      throw new AugmentException("bits must be " + bitsPerMarkerTable + " but is " + getNumBits());
    }    
  }
    
  public int getNumRecords() {
    return this._numRecords;
  }
  
  public int getMaxRecords() {
    return this._markerRecords.length;
  }

  public MarkerRecord[] getRecords() {
    return this._markerRecords;
  }
}
