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
import static org.nlsaugment.augxml.Constants.bitsPerWord;
import static org.nlsaugment.augxml.Constants.maxPagesPerMemorySpace;
import static org.nlsaugment.augxml.Constants.wordsPerPage;

import org.nlsaugment.augxml.exception.LocationOutOfRangeException;

/**
 * A Location is an immutable object that represents a specific location within a MemorySpace.
 * It contains a PageIndex, WordIndex, and BitIndex. In the Tenex/TOPS-20 memory space,
 * a page contains exactly 512 words, and a word contains exactly 36 bits. The number of
 * pages in the MemorySpace can vary, but it is at least 102 pages and no more 
 * than 471 pages, inclusive. All indexes are zero-based. 
 * <p>The valid range of a Location is from (0) to (470, 511, 35). Note that since a memory space 
 * may have fewer than 471 pages, not all valid Location objects actually refer to a valid location
 * in a particular memory space.  
 * <p>New Locations can be created from an existing Location by specifying a relative number of bits.
 * @author Jonathan Cheyer
 */
public final class Location {
  private final int _pageIndex;
  private final int _wordIndex;
  private final int _bitIndex;
  
  /**
   * Instantiate a new Location that refers to the beginning of the memory space.
   */
  public Location() {
    this(0, 0, 0);
  }
  
  /**
   * Instantiate a new Location object, using the specified pageIndex.
   * @param pageIndex the page index; must be between 0 and 470, inclusive
   * @throws LocationOutOfRangeException if pageIndex < 0 or pageIndex > 470
   */
  public Location(final int pageIndex) {
    this(pageIndex, 0, 0);
  }
  
  /**
   * Instantiate a new Location object, using the specified pageIndex and wordIndex.
   * @param pageIndex the page index; must be between 0 and 470, inclusive
   * @param wordIndex the word index; must be between 0 and 511, inclusive
   * @throws LocationOutOfRangeException if pageIndex < 0 or pageIndex > 470
   * @throws LocationOutOfRangeException if wordIndex < 0 or wordIndex > 511
   */
  public Location(final int pageIndex, final int wordIndex) {
    this(pageIndex, wordIndex, 0);
  }

  /**
   * Instantiate a new Location object, using the specified pageIndex, wordIndex, and bitIndex.
   * @param pageIndex the page index; must be between 0 and 470, inclusive
   * @param wordIndex the word index; must be between 0 and 511, inclusive
   * @param bitIndex the bit index; must be between 0 and 35, inclusive
   * @throws LocationOutOfRangeException if pageIndex < 0 or pageIndex > 470
   * @throws LocationOutOfRangeException if wordIndex < 0 or wordIndex > 511
   * @throws LocationOutOfRangeException if bitIndex < 0 or bitIndex > 35
   */
  public Location(final int pageIndex, final int wordIndex, final int bitIndex) {    
    this._pageIndex = pageIndex;
    this._wordIndex = wordIndex;
    this._bitIndex = bitIndex;
    check();
  }

  private void check() {
    if (this._pageIndex >= maxPagesPerMemorySpace || this._pageIndex < 0) {
      throw new LocationOutOfRangeException("location is out of range: pageIndex=" + this._pageIndex);
    }
    if (this._wordIndex >= wordsPerPage || this._wordIndex < 0) {
      throw new LocationOutOfRangeException("location is out of range: wordIndex=" + this._wordIndex);
    }
    if (this._bitIndex >= bitsPerWord || this._bitIndex < 0) {
      throw new LocationOutOfRangeException("location is out of range: bitIndex=" + this._bitIndex);
    }
  }
  
  /**
   * Return the page index. The range is between 0 and 470, inclusive.
   * @return the page index
   */
  public int getPageIndex() {
    return this._pageIndex;
  }
  
  /** 
   * Return the word index. The range is between 0 and 511, inclusive.
   * @return the word index
   */
  public int getWordIndex() {
    return this._wordIndex;
  }

  /**
   * Return the bit index. The range is between 0 and 35, inclusive.
   * @return the bit index
   */
  public int getBitIndex() {
    return this._bitIndex;
  }

  /**
   * Return the absolute bit index. The index is calculated as
   * <code>getPageIndex() * bitsPerPage + getWordIndex() * bitsPerWord + getBitIndex()</code>.
   * The range is between 0 and 8681471, inclusive. 8681471 is <code>maxBitsPerFile - 1</code>.
   * @return the absolute bit index
   * @see org.nlsaugment.augxml.Constants#maxBitsPerFile
   */
  public int getAbsoluteBitIndex() {
    return getPageIndex() * bitsPerPage + getWordIndex() * bitsPerWord + getBitIndex();
  }
  
  /**
   * Return a string representation of the Location. 
   * 
   * <p>The format for a general Location contains a comma-delimited list of 
   * pageIndex, wordIndex, and bitIndex, surrounded by parentheses. For example:
   * <code>(26, 42, 13)</code>
   * <p>If the bitIndex is 0, the bitIndex is not displayed. For example:
   * <code>(26, 42)</code>
   * <p>If the wordIndex is 0, the wordIndex is not displayed. For example:
   * <code>(26)</code>
   * <p>The pageIndex is always displayed even if it is zero. For example:
   * <code>(0)</code>
   * @return the string representation of the Location
   */
  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("(");
    sb.append(getPageIndex());
    if (getWordIndex() != 0 || getBitIndex() != 0) {
      sb.append(", ");
      sb.append(getWordIndex());
      if (getBitIndex() != 0) {
        sb.append(", ");
        sb.append(getBitIndex());
      }
    }
    sb.append(")");
    return sb.toString();    
  }
  
  @Override
  public boolean equals(Object o) {
    if (! (o instanceof Location)) {
      return false;
    }
    Location l = (Location) o;
    return this.getPageIndex() == l.getPageIndex() && this.getWordIndex() == l.getWordIndex() &&
    this.getBitIndex() == l.getBitIndex();
  }
  
  @Override
  public int hashCode() {
    return this._pageIndex + this._wordIndex + this._bitIndex;
  }
  
  /**
   * Return a new Location that is relativeNumberOfBits away from this Location. The relative
   * number may be either positive or negative.  
   * @param relativeNumberOfBits the number of bits (positive or negative) to move from the existing Location
   * @return the new Location
   * @throws LocationOutOfRangeException if the relative number would cause the new Location to be either
   * before the beginning of the memory space (0) or after the end of the memory space (470, 511, 35).
   */
  public Location newLocation(final int relativeNumberOfBits) {
    if (relativeNumberOfBits < 0) {
      return newLocationNeg(relativeNumberOfBits);
    }
    int bitIndex = this._bitIndex + relativeNumberOfBits;
    int wordIndex = this._wordIndex;
    int pageIndex = this._pageIndex;
    if (bitIndex >= bitsPerWord) {
      wordIndex += bitIndex / bitsPerWord;
      bitIndex = bitIndex % bitsPerWord;
    }
    if (wordIndex >= wordsPerPage) {
      pageIndex += wordIndex / wordsPerPage;
      wordIndex = wordIndex % wordsPerPage;
    }
    return new Location(pageIndex, wordIndex, bitIndex);
  }
  
  private Location newLocationNeg(final int relativeNumberOfBits) {
    int bitIndex = this._bitIndex + relativeNumberOfBits;
    int wordIndex = this._wordIndex;
    int pageIndex = this._pageIndex;
    while (bitIndex < 0) {
      wordIndex--;
      bitIndex += bitsPerWord;
    }
    while (wordIndex < 0) {
      pageIndex--;
      wordIndex += wordsPerPage;
    }
    return new Location(pageIndex, wordIndex, bitIndex);    
  }
}
