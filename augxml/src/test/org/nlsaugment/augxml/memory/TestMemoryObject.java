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
import org.nlsaugment.augxml.exception.LocationOutOfRangeException;
import org.nlsaugment.augxml.util.BitBox;

public final class TestMemoryObject {
  /**
   * Test creating a new MemoryObject with an invalid numBits.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor1() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location();
    new MyMemoryObject(ms, loc, -1);
  }

  /**
   * Test creating a new MemoryObject with an invalid location.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor2() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location(102, 0, 0);
    new MyMemoryObject(ms, loc, 1);
  }

  /**
   * Test creating a new MemoryObject with an invalid end location (location plus numBits).
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor3() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location(101, 511, 35);
    new MyMemoryObject(ms, loc, 2);
  }

  /**
   * Test creating a new MemoryObject with a valid location and numBits. Edge case on
   * end location. 
   */
  @Test
  public void constructor4() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location(101, 511, 35);
    new MyMemoryObject(ms, loc, 1);    
  }

  /**
   * Test creating a new MemoryObject with a valid location and numBits. Edge case on
   * numBits (0).
   */
  @Test
  public void constructor5() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location(101, 511, 35);
    new MyMemoryObject(ms, loc, 0);    
  }

  /**
   * Test retrieving the memory space from a MemoryObject after instantiating a new MemoryObject. 
   */
  @Test
  public void getMemorySpace() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    final Location loc = new Location(5, 2, 3);
    final MyMemoryObject my = new MyMemoryObject(ms, loc, 15);
    assertEquals(ms, my.getMemorySpace());
  }

  private static byte[] createPage(int numPages) {
    final byte[] bytes = new byte[numPages * 2304];
    Arrays.fill(bytes, (byte) 1);
    return bytes;
  }
}

class MyMemoryObject extends MemoryObject {
  public MyMemoryObject(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
  }
}