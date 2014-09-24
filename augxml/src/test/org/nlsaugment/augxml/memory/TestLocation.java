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

import org.junit.Test;
import org.nlsaugment.augxml.exception.LocationOutOfRangeException;

public final class TestLocation {
  /**
   * Test empty constructor.
   */
  @Test
  public void constructor1() {
    new Location();
  }

  /**
   * Test constructor with invalid page (-1).
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor2() {
    new Location(-1);
  }

  /**
   * Test constructor with valid page (470), edge case.
   */
  @Test
  public void constructor3() {
    new Location(470);
  }

  /**
   * Test constructor with invalid page (471), edge case.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor4() {
    new Location(471);
  }

  /**
   * Test constructor with valid page, word, bit. Edge case on bit.
   */
  @Test
  public void constructor5() {
    new Location(10, 20, 35);
  }

  /**
   * Test constructor with valid page, word, and invalid bit. Edge case on bit.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor6() {
    new Location(10, 20, 36);
  }

  /**
   * Test constructor with valid page, word, and bit. Edge case on word.
   */
  @Test
  public void constructor7() {
    new Location(10, 511, 35);
  }

  /**
   * Test constructor with valid page, invalid word, and valid bit. Edge case on word.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor8() {
    new Location(10, 512, 35);
  }

  /**
   * Test constructor with valid page, word, and bit. Edge case on page (470).
   */
  @Test
  public void constructor9() {
    new Location(470, 20, 30);
  }

  /**
   * Test constructor with invalid page, valid word, and valid bit. Edge case on page.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor10() {
    new Location(471, 20, 30);
  }

  /**
   * Test constructor with valid page, word, and bit. Edge case on page (0).
   */
  @Test
  public void constructor11() {
    new Location(0, 20, 30);
  }

  /**
   * Test constructor with invalid page, valid word, and valid bit. Edge case on page (-1).
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor12() {
    new Location(-1, 20, 30);
  }

  /**
   * Test constructor with valid page, invalid word, and valid bit. Edge case on word (-1).
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor13() {
    new Location(20, -1, 30);
  }

  /**
   * Test constructor with valid page, valid word, and invalid bit. Edge case on bit (-1).
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void constructor14() {
    new Location(20, 42, -1);
  }

  /**
   * Test constructor with valid page, valid word, and invalid bit. Edge case on page, word, and bit.
   * End of memory space (470, 511, 35).
   */
  @Test
  public void constructor15() {
    new Location(470, 511, 35);
  }

  /**
   * Test getting the page index of the Location, using no-parameter constructor.   
   */
  @Test
  public void getPageIndex1() {
    final Location location = new Location();
    assertEquals(0, location.getPageIndex());
  }

  /**
   * Test getting the page index of the Location, using a constructor that specifies the page index.   
   */
  @Test
  public void getPageIndex2() {
    final Location location = new Location(47, 3, 23);
    assertEquals(47, location.getPageIndex());
  }

  /**
   * Test getting the word index of the Location, using no-parameter constructor.   
   */
  @Test
  public void getWordIndex1() {
    final Location location = new Location();
    assertEquals(0, location.getWordIndex());
  }

  /**
   * Test getting the word index of the Location, using a constructor that specifies the word index.   
   */
  @Test
  public void getWordIndex2() {
    final Location location = new Location(47, 3, 23);
    assertEquals(3, location.getWordIndex());
  }

  /**
   * Test getting the bit index of the Location, using no-parameter constructor.   
   */
  @Test
  public void getBitIndex1() {
    final Location location = new Location();
    assertEquals(0, location.getBitIndex());
  }

  /**
   * Test getting the bit index of the Location, using a constructor that specifies the bit index.   
   */
  @Test
  public void getBitIndex2() {
    final Location location = new Location(47, 3, 23);
    assertEquals(23, location.getBitIndex());
  }

  /**
   * Test getting the absolute bit index of the Location (0, 0, 0). Edge case for
   * smallest valid Location.   
   */
  @Test
  public void getAbsoluteBitIndex1() {
    final Location location = new Location();
    assertEquals(0, location.getAbsoluteBitIndex());
  }

  /**
   * Test getting the absolute bit index of the Location (1, 1, 1).   
   */
  @Test
  public void getAbsoluteBitIndex2() {
    final Location location = new Location(1, 1, 1);
    assertEquals(18469, location.getAbsoluteBitIndex());
  }

  /**
   * Test getting the absolute bit index of the Location (470, 511, 35). Edge case for 
   * largest valid Location.    
   */
  @Test
  public void getAbsoluteBitIndex3() {
    final Location location = new Location(470, 511, 35);
    assertEquals(8681471, location.getAbsoluteBitIndex());
  }

  /**
   * Test toString() with no-param constructor.
   */
  @Test
  public void toString1() {
    final Location location = new Location();
    assertEquals("(0)", location.toString());
  }

  /**
   * Test that toString() with Location(46, 0, 0) returns (46).
   */
  @Test
  public void toString2() {
    final Location location = new Location(46, 0, 0);
    assertEquals("(46)", location.toString());
  }

  /**
   * Test that toString() with Location(46, 22) returns same value.
   */
  @Test
  public void toString3() {
    final Location location = new Location(46, 22);
    assertEquals("(46, 22)", location.toString());
  }

  /**
   * Test that toString() with Location(46, 22, 5) returns same value.
   */
  @Test
  public void toString4() {
    final Location location = new Location(46, 22, 5);
    assertEquals("(46, 22, 5)", location.toString());
  }

  /**
   * Test that Location() and Location(0) are equal.
   */
  @Test
  public void equals1() {
    final Location loc1 = new Location();
    final Location loc2 = new Location(0);
    assertEquals(loc1, loc2);
  }

  /**
   * Test that Location(46) and Location(46, 0, 0) are equal.
   */
  @Test
  public void equals2() {
    final Location loc1 = new Location(46);
    final Location loc2 = new Location(46, 0, 0);
    assertEquals(loc1, loc2);
  }

  /**
   * Test newLocation() that Location() plus 25 bits equals Location(0, 0, 25).
   */
  @Test
  public void newLocation1() {
    final Location loc1 = new Location();
    final Location loc2 = new Location(0, 0, 25);
    final Location loc3 = loc1.newLocation(25);
    assertEquals(loc2, loc3);
  }
  
  /**
   * Test newLocation() that Location(0, 0, 8) plus 29 bits equals Location(0, 1, 1).
   */
  @Test
  public void newLocation2() {
    final Location loc1 = new Location(0, 0, 8);
    final Location loc2 = new Location(0, 1, 1);
    final Location loc3 = loc1.newLocation(29);
    assertEquals(loc2, loc3);    
  }

  /**
   * Test newLocation() that Location(0, 0, 8) minus 8 bits is valid.
   */
  @Test
  public void newLocation3() {
    final Location loc1 = new Location(0, 0, 8);
    loc1.newLocation(-8);
  }

  /**
   * Test newLocation() that Location(0, 0, 8) minus 9 bits is invalid.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void newLocation4() {
    final Location loc1 = new Location(0, 0, 8);
    loc1.newLocation(-9);
  }

  /**
   * Test newLocation() that Location(470, 511, 34) plus 1 bit is valid. Edge case on bit.
   */
  @Test
  public void newLocation5() {
    final Location loc1 = new Location(470, 511, 34);    
    loc1.newLocation(1);
  }

  /**
   * Test newLocation() that Location(470, 511, 35) plus 1 bit is invalid. Edge case on bit.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void newLocation6() {
    // end of memory space plus 1 more bit should throw an exception
    final Location loc1 = new Location(470, 511, 35);    
    loc1.newLocation(1);
  }
  
  /**
   * Test newLocation() that Location(470, 510, 0) plus 71 bits is valid. Edge case on word.
   */
  @Test
  public void newLocation7() {
    final Location loc1 = new Location(470, 510, 0);
    loc1.newLocation(71);
  }

  /**
   * Test newLocation() that Location(470, 510, 0) plus 72 bits is invalid. Edge case on word.
   */  
  @Test(expected = LocationOutOfRangeException.class)
  public void newLocation8() {
    final Location loc1 = new Location(470, 510, 0);
    loc1.newLocation(72);
  }

  /**
   * Test newLocation() that Location() + 8681471 bits is valid. Edge case on adding bits.
   */
  @Test
  public void newLocation9() {
    // 470(512 * 36 * 1) + 511(36 * 1) + 35(1) = 8681471
    final Location loc1 = new Location();
    final Location loc2 = new Location(470, 511, 35);
    final Location loc3 = loc1.newLocation(8681471);
    assertEquals(loc2, loc3);
  }

  /**
   * Test newLocation() that Location() + 8681472 bits is invalid. Edge case on adding bits.
   */
  @Test(expected = LocationOutOfRangeException.class)
  public void newLocation10() {
    //  470(512 * 36 * 1) + 511(36 * 1) + 35(1) + 1 = 8681472
    final Location loc1 = new Location();
    loc1.newLocation(8681472);
  }
  
  /**
   * Test newLocation() that Location() + 0 bits is the same Location. Edge case for Location().
   */
  @Test
  public void newLocation11() {
    final Location loc1 = new Location();
    final Location loc2 = loc1.newLocation(0);
    assertEquals(loc1, loc2);
  }
  
  /**
   * Test newLocation() that Location(46, 22, 10) + 0 bits is the same Location for a
   * random Location.
   */
  @Test
  public void newLocation12() {
    final Location loc1 = new Location(46, 22, 10);
    final Location loc2 = loc1.newLocation(0);
    assertEquals(loc1, loc2);
  }
  
  /**
   * Test newLocation() that Location(46, 22, 10) - 12 bits is (46, 21, 34).
   */
  @Test
  public void newLocation13() {
    final Location loc1 = new Location(46, 22, 10);
    final Location loc2 = loc1.newLocation(-12);
    final Location loc3 = new Location(46, 21, 34);
    assertEquals(loc2, loc3);
  }
}
