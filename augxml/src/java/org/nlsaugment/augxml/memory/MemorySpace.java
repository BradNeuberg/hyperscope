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
import static org.nlsaugment.augxml.Constants.maxPagesPerMemorySpace;
import static org.nlsaugment.augxml.Constants.minPagesPerMemorySpace;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.exception.LocationOutOfRangeException;
import org.nlsaugment.augxml.util.BitBox;

/**
 * A MemorySpace is an immutable object that represents the entire set of bits in an 
 * Augment File, stored as multiple TENEX/TOPS-20 pages in memory. It always contains between
 * 102 and 471 pages, inclusive. The actual number of bits for a specific MemorySpace can be 
 * retrieved using the getNumBits() method.
 * @author Jonathan Cheyer
 *
 */
public final class MemorySpace {
  private final BitBox _bits;
  private final List<Page> _pages;

  /**
   * Instantiate a new MemorySpace from a given set of bits.
   * @param bits the bits used to create a new MemorySpace
   * @throws NullPointerException if bits is null
   * @throws AugmentException if the memory space is empty
   * @throws AugmentException if the size is not a whole number of pages (2304 bytes per page)
   * @throws AugmentException if the number of pages is not between 102 and 471, inclusive
   */
  public MemorySpace(final BitBox bits) {
    if (bits.isEmpty()) {
      throw new AugmentException("memory space is empty");
    }
    if (bits.getSize() % bitsPerPage != 0) {
      throw new AugmentException("memory space does not contain a whole number of pages: " + bits.getSize());
    }
    this._bits = bits;
    if (getNumPages() < minPagesPerMemorySpace) {
      throw new AugmentException("memory space has too few pages: " + getNumPages());
    }
    if (getNumPages() > maxPagesPerMemorySpace) {
      throw new AugmentException("memory space has too many pages: " + getNumPages());
    }
    final ArrayList<Page> pages = new ArrayList<Page>(getNumPages());
    for (int i = 0; i < getNumPages(); i++) {
      final Page page = new Page(this, new Location(i));
      pages.add(page);
    }
    this._pages = Collections.unmodifiableList(pages);
  }
  
  /**
   * Returns the number of bits in the MemorySpace.
   * @return the number of bits
   */
  public int getNumBits() {
    return this._bits.getSize();
  }
   
  /**
   * Returns the list of contiguous pages in the MemorySpace, in order.
   * @return the list of pages
   */
  public List<Page> getPages() {
    return this._pages;
  }

  /**
   * Return a BitBox containing the bits in the MemorySpace.
   * @return a BitBox
   */
  public BitBox getBits() {
    return this._bits;
  }

  /**
   * Return a new BitBox containing a subset of bits from the MemorySpace, starting at 
   * the given location and containing the number of bits specified.
   * @param location the location at which to start
   * @param numBits the number of bits to use when creating the new BitBox
   * @return a new BitBox with a subset of bits from the MemorySpace
   * @throws LocationOutOfRangeException if numBits < 0
   * @throws LocationOutOfRangeException if location plus numBits goes past the end of the MemorySpace
   */
  BitBox getBits(final Location location, final int numBits) {
    checkValidRange(location, numBits);
    final int fromIndex = location.getAbsoluteBitIndex();
    final int toIndex = fromIndex + numBits;
    return this._bits.get(fromIndex, toIndex);
  }
    
  /**
   * Determine the validity of the set of bits, within the MemorySpace that is numBits long and starting 
   * at Location. If the number of bits goes past the end of the MemorySpace, then the range is invalid. 
   * @param location the start of the range, specified as a Location
   * @param numBits the number of bits within the range
   * @throws LocationOutOfRangeException if numBits < 0
   * @throws LocationOutOfRangeException if location plus numBits goes past the end of the MemorySpace
   */
  void checkValidRange(final Location location, final int numBits) {
    if (numBits < 0) {
      throw new LocationOutOfRangeException("numBits must be at least 0: " + numBits);
    }
    final int fromIndex = location.getAbsoluteBitIndex();
    final int toIndex = fromIndex + numBits;
    if (toIndex > getNumBits()) {
      throw new LocationOutOfRangeException("location " + location.toString() + " plus numBits " + 
          numBits + " goes past the end of Memory Space. The Memory Space is " + getNumBits() + 
          " bits and its ending location is " + (new Location().newLocation(getNumBits() - 1)));
    }    
  }
  
  private int getNumPages() {
    return getNumBits() / bitsPerPage;
  }
}
