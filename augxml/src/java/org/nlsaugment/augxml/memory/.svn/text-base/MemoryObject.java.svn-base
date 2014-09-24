/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.memory;

import org.nlsaugment.augxml.exception.LocationOutOfRangeException;
import org.nlsaugment.augxml.util.BitBox;

/**
 * A MemoryObject is an object which corresponds to a specific set of bits in a MemorySpace.
 * The object contains a Location and a number of bits. Subclasses of MemoryObject will define
 * specific attributes and operations that are useful for these bits.
 * @author Jonathan Cheyer
 *
 */
public abstract class MemoryObject {
  private final MemorySpace _memorySpace;
  private final Location _location;
  private final int _numBits;

  /**
   * Instantiate a new MemoryObject, based on a specific Location and numBits within the given
   * MemorySpace.
   * @param memorySpace the MemorySpace which the new MemoryObject is located in
   * @param location the start of where the MemoryObject's bits are located
   * @param numBits the length (in bits) of the MemoryObject
   * @throws LocationOutOfRangeException if numBits < 0
   * @throws LocationOutOfRangeException if location plus numBits goes past the end of the MemorySpace
   */
  protected MemoryObject(final MemorySpace memorySpace, final Location location, final int numBits) {
    memorySpace.checkValidRange(location, numBits);
    this._memorySpace = memorySpace;
    this._location = location;
    this._numBits = numBits;
  }

  public final MemorySpace getMemorySpace() {
    return this._memorySpace;
  }
  
  public final Location getLocation() {
    return this._location;
  }
  
  public final int getNumBits() {
    return this._numBits;
  }
  
  public final BitBox getBits() {
    return this._memorySpace.getBits(this._location, this._numBits);
  }
  
  public final boolean isEmpty() {
    return getBits().isEmpty();
  }
}
