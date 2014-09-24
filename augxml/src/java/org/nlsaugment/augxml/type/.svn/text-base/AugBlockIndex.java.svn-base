/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.type;

import static org.nlsaugment.augxml.Constants.bitsPerAugBlockIndex;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;

/**
 * A BlockIndex is a 9-bit pointer to a Block. It is essentially half of an AugAddress, and is
 * used by certain fields which don't store a full AugAddress but only need the BlockIndex portion.
 * @author Jonathan Cheyer
 *
 */
public final class AugBlockIndex extends AugType {    
  public AugBlockIndex(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
    if (numBits != bitsPerAugBlockIndex) {
      throw new AugmentException("bits must be of size " + bitsPerAugBlockIndex + ": " + numBits);
    }
  }
  
  public int getBlockIndex() {
    return getBits().toUnsignedInteger();
  }

  @Override
  public String toString() {
    return getValue().toString();
  }
  
  @Override
  public Integer getValue() {    
    return getBlockIndex();
  }
  
  @Override
  public boolean equals(Object o) {
    if (! (o instanceof AugBlockIndex)) {
      return false;
    }
    final AugBlockIndex p = (AugBlockIndex) o;
    return this.getBlockIndex() == p.getBlockIndex();
  }
  
  @Override
  public int hashCode() {
    return getBlockIndex();
  }
}
