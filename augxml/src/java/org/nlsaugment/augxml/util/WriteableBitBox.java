/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.util;

import java.util.BitSet;

public final class WriteableBitBox {
  private BitSet _bits;
  private int _size;

  public WriteableBitBox(final int size) {
    this._bits = new BitSet(size);
    this._size = size;
  }
  
  public BitSet getBitSet() {
    return this._bits;
  }
  
  public void set(final int bitIndex, final boolean value) {
    this._bits.set(bitIndex, value);
  }
 
  public void set(final int fromIndex, final BitBox bitbox) {
    for (int i = 0; i < bitbox.getSize(); i++) {
      this._bits.set(fromIndex + i, bitbox.get(i));
    }
  }
 
  /**
   * Return the number of bits that the BitBox contains. The number of bits represents the 
   * physical storage of the BitBox.
   * @return the size of the BitBox
   */
  public int getSize() {
    return this._size;
  }

  public BitBox toBitBox() {
    return BitBox.fromWriteableBitBox(this);
  }
}
