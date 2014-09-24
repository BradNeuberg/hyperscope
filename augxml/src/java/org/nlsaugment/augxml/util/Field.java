/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.util;

import org.nlsaugment.augxml.type.AugType;

/**
 * <p>ModelObjects contain a Field[], which stores the data for each ModelObject. The Field
 * is meant to store the name, type, and number of bits for that field. The Field[] is 
 * represented in each Java class file in a way that is as similar as possible to that
 * of the original L10 code. This includes the ordering of the fields.</p>
 * <p>It is important to understand how L10 physically stores fields. Records (Field[]) 
 * that are longer than one Word are broken up into sub-groups that each fill exactly one
 * Word. Fields must be contained within the Word and must not cross over a Word boundary. 
 * If a field is too large to fit within an existing sub-group, it is stored in the next sub-group
 * instead. Multi-word records are stored from lowest to highest memory address. However, within
 * a Word, each records is filled from the right (highest to lowest), NOT from the left.</p>
 * <p>The Field (and the FieldHelper class) will do the work to figure handle all of this 
 * automatically, so that each ModelObject class can order their fields in the exact same way
 * as they are done in the L10 code.</p>
 * @author Jonathan Cheyer
 *
 */
public final class Field {
  private final Enum _enum;
  private final int _numBits;
  private final AugType.Type _type;
  private int _bitOffset;
  
  /**
   * 
   * @param e
   * @param numBits
   * @param type
   */
  public Field(final Enum e, int numBits, AugType.Type type) {
    this._enum = e;
    this._numBits = numBits;
    this._type = type;
  }
  
  public Enum getEnum() {
    return this._enum;
  }
  
  public int getNumBits() {
    return this._numBits;
  }
  
  public AugType.Type getType() {
    return this._type;
  }

  public int getBitOffset() {
    return this._bitOffset;
  }
  
  public void setBitOffset(final int bitOffset) {
    this._bitOffset = bitOffset;
  }
}
