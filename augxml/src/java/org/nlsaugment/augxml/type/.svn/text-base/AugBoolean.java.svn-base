/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.type;

import static org.nlsaugment.augxml.Constants.bitsPerAugBoolean;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;

/**
 * This represents an instance of a Boolean in the MemorySpace. Although in some cases, it may 
 * be physically stored using more than 1 bit, the value of those bits will always be 
 * either 0 or 1, and it logically represents true or false. 
 * @author Jonathan Cheyer
 */
public final class AugBoolean extends AugType {
  public AugBoolean(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
    check();
  }

  private void check() {
    if (getNumBits() != bitsPerAugBoolean) {
      throw new AugmentException("invalid number of bits: " + getNumBits());
    }
    final long value = getBits().toUnsignedInteger();
    if (value != 0 && value != 1) {
      throw new AugmentException("boolean internal value must be 0 or 1 but is: " + value);
    }
  }
  
  @Override
  public String toString() {
    return getValue().toString();
  }
  
  @Override
  public Boolean getValue() {
    return getBits().toUnsignedInteger() != 0;
  }
}
