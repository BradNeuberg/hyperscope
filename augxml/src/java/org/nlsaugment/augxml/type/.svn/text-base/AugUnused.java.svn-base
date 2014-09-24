/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.type;

import org.nlsaugment.augxml.exception.UnusedFieldException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;

/**
 * This represents that a ModelObject's field is UNUSED. In other words, although there is space
 * for the field (usually to pad bits within a Word boundary), none of the bits are used for any
 * purpose. An AugUnused should always be empty (have all 0 bits).
 * @author Jonathan Cheyer
 *
 */
public final class AugUnused extends AugType {
  public AugUnused(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
    if (! isEmpty()) {
      throw new UnusedFieldException("Unused types must not have any bits set");
    }
  }

  @Override
  public String toString() {
    return "";
  }
  
  @Override
  public String getValue() {
    return toString();
  }
}
