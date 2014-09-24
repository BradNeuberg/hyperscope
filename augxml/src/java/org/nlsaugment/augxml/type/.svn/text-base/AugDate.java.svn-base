/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.type;

import static org.nlsaugment.augxml.Constants.bitsPerAugDate;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;
import org.nlsaugment.augxml.util.TenexDate;
import org.nlsaugment.augxml.util.Util;

/**
 * This represents an instance of a Date in the MemorySpace. The underlying representation
 * is stored as a TenexDate.
 * @author Jonathan Cheyer
 *
 */
public final class AugDate extends AugType {
  public AugDate(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
    check();
  }

  private void check() {
    if (getNumBits() != bitsPerAugDate) {
      throw new AugmentException("invalid number of bits: " + getNumBits());
    }
  }
  
  /**
   * Return the value of the AugDate as a String.
   * @return the value of the AugDate
   * @see org.nlsaugment.augxml.util.TenexDate#toString() 
   */
  @Override
  public String toString() {
    return new TenexDate(getBits()).toString();
  }
  
  /**
   * Returns the AugDate in the format: EEE d MMM yyyy HH:mm:ss z.
   * @return the formatted date
   * @see java.text.SimpleDateFormat
   */
  public String formatString() {
    return Util.formatDate(getValue().toDate());
  }
  
  @Override
  public TenexDate getValue() {
    return new TenexDate(getBits());
  }
}
