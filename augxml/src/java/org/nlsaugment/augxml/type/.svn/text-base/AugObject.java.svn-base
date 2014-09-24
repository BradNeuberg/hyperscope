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
import org.nlsaugment.augxml.util.BitBox;

/**
 * An AugObject represents that a ModelObject's field contains a reference to another ModelObject.
 * @author Jonathan Cheyer
 *
 */
public final class AugObject extends AugType {
  public AugObject(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
  }

  @Override
  public String toString() {
    return getValue().toString();
  }
  
  @Override
  public BitBox getValue() {
    return getBits();
  }
}
