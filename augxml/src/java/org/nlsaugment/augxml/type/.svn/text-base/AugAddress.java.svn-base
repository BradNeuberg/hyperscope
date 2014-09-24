/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.type;

import static org.nlsaugment.augxml.Constants.bitsPerAugAddress;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;

/**
 *  This represents an instance of a Address in the MemorySpace. An Address contains two
 *  9-bit pointers: a blockIndex and a wordIndex. When used by RingElements to look up
 *  other RingElements, an Address is known as a PSID. When used by RingElements to look up
 *  DataElements, an Address is known as a PSDB.
 * @author Jonathan Cheyer
 *
 */
public final class AugAddress extends AugType {
    
  public AugAddress(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
    if (numBits != bitsPerAugAddress) {
      throw new AugmentException("bits must be of size " + bitsPerAugAddress + ": " + numBits);
    }
  }
  
  public int getBlockIndex() {
    return getBits().get(0, 9).toUnsignedInteger();
  }
  
  public int getWordIndex() {
    return getBits().get(9, 18).toUnsignedInteger();
  }
  
  @Override
  public String toString() {
    return getValue();
  }
  
  @Override
  public String getValue() {    
    return "(" + getBlockIndex() + ", " + getWordIndex() + ")";
  }
  
  /**
   * This method converts the value of the AugAddress to an equivalent Location object.
   * Careful. Do not confuse toLocation with getLocation() that it inherits from MemoryObject.
   * The getLocation() method returns the Location of the AugAddress itself, NOT the value of
   * Address that it is representing.
   * 
   * @return the AugAddress converted into a Location
   */
  public Location toLocation() {
    return new Location(getBlockIndex(), getWordIndex());
  }
  
  @Override
  public boolean equals(Object o) {
    if (! (o instanceof AugAddress)) {
      return false;
    }
    final AugAddress p = (AugAddress) o;
    final int bi1 = this.getBlockIndex();
    final int wi1 = this.getWordIndex();
    final int bi2 = p.getBlockIndex();
    final int wi2 = p.getWordIndex();
    return bi1 == bi2 && wi1 == wi2;        
  }
  
  @Override
  public int hashCode() {
    return getValue().hashCode();
  }
}
