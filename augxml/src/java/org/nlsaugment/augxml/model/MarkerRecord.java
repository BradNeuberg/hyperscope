/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.type.AugType.Type.ADDRESS;
import static org.nlsaugment.augxml.type.AugType.Type.BOOLEAN;
import static org.nlsaugment.augxml.type.AugType.Type.SEVEN_BIT_STRING;
import static org.nlsaugment.augxml.type.AugType.Type.UNSIGNED_NUMBER;

import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;
import org.nlsaugment.augxml.type.Aug7BitString;
import org.nlsaugment.augxml.type.AugAddress;
import org.nlsaugment.augxml.type.AugBoolean;
import org.nlsaugment.augxml.type.AugType;
import org.nlsaugment.augxml.type.AugUnsignedNumber;
import org.nlsaugment.augxml.util.Field;
import org.nlsaugment.augxml.util.FieldHelper;

/**
 * A MarkerRecord contains the data for an Augment marker, such as the name of the marker
 * and where the marker points to.
 * @author Jonathan Cheyer
 *
 */
public final class MarkerRecord extends ModelObject {
  public enum Record {mkname, mkpsid, mkfix, mkccnt, mkexis, unused1}
  private static final Field[] __fields = new Field[] {    
    new Field(Record.mkname, 36, SEVEN_BIT_STRING),
    new Field(Record.mkpsid, 18, ADDRESS),
    new Field(Record.mkfix, 1, BOOLEAN),
    new Field(Record.mkccnt, 12, UNSIGNED_NUMBER),
    new Field(Record.mkexis, 1, BOOLEAN),
    
    // TODO: find out why this field has bits in it. Setting as UNSIGNED for now
    new Field(Record.unused1, 4, UNSIGNED_NUMBER)
  };
  private static final FieldHelper __helper = new FieldHelper(__fields);
  
  private final int _recordNumber;
  
  public MarkerRecord(final MemorySpace memorySpace, final Location location, final int numBits, final int recordNumber) {
    super(__fields, memorySpace, location, numBits);
    this._recordNumber = recordNumber;
  }

  private AugType get(final Enum fieldName) {
    return __helper.get(this, fieldName);
  }

  public int getRecordNumber() {
    return this._recordNumber;
  }
  
  public Aug7BitString getMkname() {
    return (Aug7BitString) get(Record.mkname);
  }

  public AugAddress getMkpsid() {
    return (AugAddress) get(Record.mkpsid);
  }

  public AugBoolean getMkfix() {
    return (AugBoolean) get(Record.mkfix);
  }

  public AugUnsignedNumber getMkccnt() {
    return (AugUnsignedNumber) get(Record.mkccnt);
  }

  public AugBoolean getMkexis() {
    return (AugBoolean) get(Record.mkexis);
  }
}
