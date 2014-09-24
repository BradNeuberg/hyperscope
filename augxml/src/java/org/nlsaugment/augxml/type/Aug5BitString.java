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
 * This represents an instance of a 5-bit string in the MemorySpace.
 * @author Jonathan Cheyer
 *
 */
public final class Aug5BitString extends AugString {
  public Aug5BitString(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
  }
  
  @Override
  public String toString() {
    return getBits().unpack5BitText();
  }
  
  @Override
  public String getValue() {
    return toString();
  }
}
