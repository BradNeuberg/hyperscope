/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.memory;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.exception.LocationOutOfRangeException;
import org.nlsaugment.augxml.util.BitBox;
import org.nlsaugment.augxml.util.WriteableBitBox;

/**
 * A WriteableMemorySpace allows modification of the memory space, unlike MemorySpace, which is immutable.
 * This should only be used by IAugmentReader classes. 
 * @author Jonathan Cheyer
 *
 */
public final class WriteableMemorySpace {
  private static WriteableMemorySpace __wms;
  private final WriteableBitBox _bits;
  
  public static void setInstance(final int pages) {
    // TODO: fix me
    __wms = new WriteableMemorySpace(pages * 512 * 36);
  }
  
  public static final WriteableMemorySpace getInstance() {
    return __wms;
  }
  
  private WriteableMemorySpace(final int size) {
    this._bits = new WriteableBitBox(size);
  }

  public WriteableBitBox getBits() {
    return this._bits;
  }
  
  public void setBits(final Location location, final BitBox bits) {
    System.out.printf("setting %s to %s\n", location.toString(), bits.toBinary());
    // TODO - remove
    // this is for testing purposes. setBits() currently only needs to be called once per location,
    // so if there are existing bits set, then someone else either called it already, or there is a
    // math slipup causing overlapping writing bits.
    final BitBox bb = this.getBits().toBitBox().get(location.getAbsoluteBitIndex(), location.getAbsoluteBitIndex() + bits.getSize());
    if (! bb.isEmpty()) {
      throw new AugmentException("underlying bits should be empty but are not! " + bb.toBinary());
    }
    checkValidRange(location, bits.getSize());
    final int fromIndex = location.getAbsoluteBitIndex();
    this._bits.set(fromIndex, bits);
  }
  
  /**
   * Determine the validity of the set of bits, within the MemorySpace that is numBits long and starting 
   * at Location. If the number of bits goes past the end of the MemorySpace, then the range is invalid. 
   * @param location the start of the range, specified as a Location
   * @param numBits the number of bits within the range
   * @throws LocationOutOfRangeException if numBits < 0
   * @throws LocationOutOfRangeException if location plus numBits goes past the end of the MemorySpace
   */
  final void checkValidRange(final Location location, final int numBits) {
    if (numBits < 0) {
      throw new LocationOutOfRangeException("numBits must be at least 0: " + numBits);
    }
    final int fromIndex = location.getAbsoluteBitIndex();
    final int toIndex = fromIndex + numBits;
    if (toIndex > this._bits.getSize()) {
      throw new LocationOutOfRangeException("location " + location.toString() + " plus numBits " + 
          numBits + " goes past the end of Memory Space. The Memory Space is " + this._bits.getSize() + 
          " bits and its ending location is " + (new Location().newLocation(this._bits.getSize() - 1)));
    }    
  }
}
