/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.memory;

import static org.nlsaugment.augxml.Constants.bitsPerPage;

import org.nlsaugment.augxml.exception.LocationOutOfRangeException;

/**
 * A Page represents a TENEX/TOPS-20 Page (512 words, or 18432 bits). Like all MemoryObjects, 
 * each instance of a Page has a specific Location in the MemorySpace.
 * @author Jonathan Cheyer
 *
 */
public final class Page extends MemoryObject {
  /**
   * Instantiate a new Page, based on a specific Location within the given MemorySpace.
   * @param memorySpace the MemorySpace which the new MemoryObject is located in
   * @param location the start of where the MemoryObject's bits are located
   * @throws LocationOutOfRangeException if location is closer than 512 words to the end
   * of the MemorySpace
   */
  public Page(final MemorySpace memorySpace, final Location location) {
    super(memorySpace, location, bitsPerPage);
  }      
}
