/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.memory;

import static org.junit.Assert.assertEquals;

import java.util.Arrays;

import org.junit.Test;
import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.exception.LocationOutOfRangeException;
import org.nlsaugment.augxml.util.BitBox;

public final class TestMemorySpace {
      
  /**
   * Test creating a MemorySpace with a null BitBox.
   */
  @Test(expected = NullPointerException.class)
  public void constructor1() {
    new MemorySpace(null);        
  }
  
  /**
   * Test creating a MemorySpace with an empty BitBox.
   */
  @Test(expected = AugmentException.class)
  public void constructor2() {
    new MemorySpace(BitBox.fromBytes(new byte[] {}));
  }

  /**
   * Test creating a MemorySpace with a non-whole number of pages.
   */
  @Test(expected = AugmentException.class)
  public void constructor3() {
    new MemorySpace(BitBox.fromBytes(new byte[] {6}));
  }

  /**
   * Test creating a MemorySpace with a BitBox consisting of too few pages (101). Edge case on pages.
   */
  @Test(expected = AugmentException.class)
  public void constructor4() {
    new MemorySpace(BitBox.fromBytes(createPage(101)));
  }
  
  /**
   * Test creating a MemorySpace with a BitBox consisting of a valid number of pages (102).
   * Edge case on pages.
   */
  @Test
  public void constructor5() {
    new MemorySpace(BitBox.fromBytes(createPage(102)));
  }

  /**
   * Test creating a MemorySpace with a BitBox consisting of a valid number of pages (471).
   * Edge case on pages.
   */
  @Test
  public void constructor6() {
    new MemorySpace(BitBox.fromBytes(createPage(471)));
  }

  /**
   * Test creating a MemorySpace with a BitBox consisting of too many pages (472).
   * Edge case on pages.
   */
  @Test(expected = AugmentException.class)
  public void constructor7() {
    new MemorySpace(BitBox.fromBytes(createPage(472)));
  }
  
  /**
   * Test getting number of bits for a 102-page memory space.
   */
  @Test
  public void getNumBits1() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    assertEquals(102 * 18432, ms.getNumBits());
  }
 
  /**
   * Test getting a new BitBox of negative length. This should fail. Edge case for length.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void getBits1() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location();
    ms.getBits(loc, -1);
  }
  
  /**
   * Test getting a new BitBox of zero length. Edge case for length.
   */
  @Test
  public void getBits2() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location();
    ms.getBits(loc, 0);
  }
  
  /**
   * Test getting a new BitBox of positive length.
   */
  @Test
  public void getBits3() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location(5, 10, 22);
    ms.getBits(loc, 26);
  }
  
  /**
   * Test getting a new BitBox at end of Memory Space. Edge case.
   */
  @Test
  public void getBits4() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location(101, 511, 35);
    ms.getBits(loc, 1);
  }

  /**
   * Test getting a new BitBox at end of Memory Space, with 1 bit too long. This should fail. Edge case.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void getBits5() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location(101, 511, 35);
    ms.getBits(loc, 2);
  }

  /**
   * Test checking valid range of location and numBits at end of Memory Space. Edge case.
   */
  @Test
  public void checkValidRange1() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location(101, 511, 35);
    ms.checkValidRange(loc, 1);
  }

  /**
   * Test checking valid range of location and numBits at end of Memory Space, with 1 bit 
   * too long. This should fail. Edge case.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void checkValidRange2() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location(101, 511, 35);
    ms.checkValidRange(loc, 2);
  }

  private static byte[] createPage(int numPages) {
    final byte[] bytes = new byte[numPages * 2304];
    Arrays.fill(bytes, (byte) 1);
    return bytes;
  } 
}
