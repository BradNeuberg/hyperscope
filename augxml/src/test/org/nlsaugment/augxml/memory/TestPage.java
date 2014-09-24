/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.memory;

import java.util.Arrays;

import org.junit.Test;
import org.nlsaugment.augxml.exception.LocationOutOfRangeException;
import org.nlsaugment.augxml.util.BitBox;

public final class TestPage {
  
  /**
   * Test creating a new page, using a location that is close to the end of the MemorySpace.
   * Edge case.
   */
  @Test
  public void constructor1() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    new Page(ms, new Location(101, 0, 0));
  }

  /**
   * Test creating a new page, using a location that is close to the end of the MemorySpace.  
   * Edge case, this should fail.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor2() {
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(createPage(102)));
    new Page(ms, new Location(101, 0, 1));
  }

  private static byte[] createPage(int numPages) {
    final byte[] bytes = new byte[numPages * 2304];
    Arrays.fill(bytes, (byte) 1);
    return bytes;
  } 
}
