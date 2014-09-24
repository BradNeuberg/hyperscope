/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.type;

import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;

/**
 * The AugUnsignedNumber class stores positive integer values.
 * The implementation only holds Integer values less than Integer.MAX_VALUE.
 * This should be sufficient for all values used in Augment files, but more investigation may need 
 * to be done. Only the FileHeaderBlock appears to have NUMBER fields which could theoretically store values
 * up to 36 bits, but in all cases actually appear to have limits no larger than 2^30.
 * 
 * TODO: investigate if there are any cases in which values outside of the range of Integer values need
 * to be stored.
 * @author Jonathan Cheyer
 *
 */
public final class AugUnsignedNumber extends AugType {
  public AugUnsignedNumber(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
  }

  @Override
  public String toString() {
    return Integer.toString(getValue());
  }
  
  @Override
  public Integer getValue() {
    return getBits().toUnsignedInteger();
  }
}
