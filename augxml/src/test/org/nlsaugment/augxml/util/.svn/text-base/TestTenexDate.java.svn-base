/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.util;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.TimeZone;

import org.junit.Test;
import org.nlsaugment.augxml.exception.AugmentException;

public final class TestTenexDate {
  /**
   * Test the TenexDate constructor using the Tenex epoch.
   */
  @Test
  public void constructor1() {
    final BitBox bitbox = new WriteableBitBox(36).toBitBox();
    final TenexDate td = new TenexDate(bitbox);    
    assertEquals(0, td.getDayNumber());
    assertEquals(0, td.getTimeNumber());
  }

  /**
   * Test creating a TenexDate with an invalid number of bits.
   */
  @Test(expected = AugmentException.class)
  public void constructor2() {
    final BitBox bitbox = new WriteableBitBox(35).toBitBox();
    new TenexDate(bitbox);    
  }

  /**
   * Test constructing a new TenexDate at the TenexDate epoch (Nov 17, 1858).
   * The epoch itself is verified.
   */
  @Test
  public void constructor3() {
    final GregorianCalendar epoch = new GregorianCalendar(TimeZone.getTimeZone("GMT+0"), Locale.US);
    epoch.clear();
    epoch.set(1858, Calendar.NOVEMBER, 17);
    final Date date = epoch.getTime();
    
    final BitBox bitbox = new WriteableBitBox(36).toBitBox();
    final TenexDate td = new TenexDate(bitbox);
    final Date date2 = td.toDate();
    
    assertEquals(date, date2);    
  }

  /**
   * Test constructing a new TenexDate at the maximum TenexDate (August 7, 2576 23:59:59 and 2/3 second).
   */
  @Test
  public void constructor4() {
    final GregorianCalendar epoch = new GregorianCalendar(TimeZone.getTimeZone("GMT+0"), Locale.US);
    epoch.clear();
    epoch.set(2576, Calendar.AUGUST, 7, 23, 59, 59);
    epoch.add(Calendar.MILLISECOND, (int) (329.589844 * 2));
    final Date date = epoch.getTime();
    
    final WriteableBitBox wbb = new WriteableBitBox(36);
    for (int i = 0; i < 36; i++) {
      wbb.set(i, true);
    }    
    final BitBox bitbox = wbb.toBitBox();
    final TenexDate td = new TenexDate(bitbox);
    final Date date2 = td.toDate();
    
    assertTrue(Math.abs(date2.getTime() - date.getTime()) < 330);
  }

  /**
   * Test constructing a new TenexDate at the maximum TenexDate day but no time (August 7, 2576 00:00:00).
   */
  @Test
  public void constructor5() {
    final GregorianCalendar epoch = new GregorianCalendar(TimeZone.getTimeZone("GMT+0"), Locale.US);
    epoch.clear();
    epoch.set(2576, Calendar.AUGUST, 7);
    final Date date = epoch.getTime();
    
    final WriteableBitBox wbb = new WriteableBitBox(36);
    for (int i = 0; i < 18; i++) {
      wbb.set(i, true);
    }    
    final BitBox bitbox = wbb.toBitBox();
    final TenexDate td = new TenexDate(bitbox);
    final Date date2 = td.toDate();
    
    assertEquals(date, date2);   
  }

  /**
   * Test creating a TenexDate using the unix epoch.
   */
  @Test
  public void fromDate1() {
    final Date date = new Date(0);
    assertEquals(date, TenexDate.fromDate(date).toDate());
  }

  /**
   * Test creating a TenexDate using today's date.
   */
  @Test
  public void fromDate2() {
    final Date date = new Date();
    final TenexDate td = TenexDate.fromDate(date);
    final int day = td.getDayNumber();
    final int time = td.getTimeNumber();
    final TenexDate td2 = TenexDate.newInstance(day, time);
    assertEquals(td.toDate(), td2.toDate());
  }
  
  /**
   * Test creating a TenexDate using today's date. Converting it back to a java.util.Date
   * should create a date that is within ~ 1/3 second (330 milliseconds) of the original date.
   */
  @Test
  public void fromDate3() {
    final Date date = new Date();
    final TenexDate td = TenexDate.fromDate(date);
    final Date date2 = td.toDate();    
    assertTrue(Math.abs(date2.getTime() - date.getTime()) < 330);
  }  

  /**
   * Test creating a TenexDate using negative milliseconds from unix epoch. 
   * Converting it back to a java.util.Date should create a date that is 
   * within ~ 1/3 second (330 milliseconds) of the original date.
   */
  @Test
  public void fromDate4() {
    final Date date = new Date(-1000);  // 1 second before Jan 1, 1970
    final TenexDate td = TenexDate.fromDate(date);
    final Date date2 = td.toDate();
    assertTrue(Math.abs(date2.getTime() - date.getTime()) < 330);
  }  

  /**
   * Test creating a TenexDate using Integer.MIN_VALUE * 1000 milliseconds (the earliest
   * allowable unix date). This should succeed because java.util.Date and TenexDate allows this value.
   */
  @Test
  public void fromDate5() {
    final Date date = new Date(Integer.MIN_VALUE * 1000L);   
    TenexDate.fromDate(date);
  }  

  /**
   * Test creating a TenexDate using Integer.MAX_VALUE * 1000 milliseconds (the earliest
   * allowable unix date). This should succeed because java.util.Date and TenexDate allows this value.
   */
  @Test
  public void fromDate6() {
    final Date date = new Date(Integer.MAX_VALUE * 1000L);   
    TenexDate.fromDate(date);
  }  

  /**
   * Test creating a TenexDate using date of Jan 1, 1967. 
   * Converting it back to a java.util.Date should create a date that is 
   * within ~ 1/3 second (330 milliseconds) of the original date.
   */
  @Test
  public void fromDate7() {
    final Date date = new Date((365 + 366 + 365) * 24 * 60 * 60 * -1000L + 500);  // Jan 1, 1967    
    final TenexDate td = TenexDate.fromDate(date);
    final Date date2 = td.toDate();
    assertTrue(Math.abs(date2.getTime() - date.getTime()) < 330);
  }  

  /**
   * Test that TenexDate.newInstance(40587, 0) is equivalent to a java.util.Date(0).
   * Uses the toDate() method for comparison. 
   */
  @Test
  public void newInstance1() {
    final TenexDate td = TenexDate.newInstance(40587, 0);
    final Date date = new Date(0);
    assertEquals(date, td.toDate());
  }
  
  /**
   * Test that TenexDate.newInstance(40587, 0) is equivalent to a java.util.Date(0).
   * Uses the fromDate() method for comparison. 
   */
  @Test
  public void newInstance2() {
    final TenexDate td = TenexDate.newInstance(40587, 0);
    final Date date = new Date(0);
    assertEquals(td.toDate(), TenexDate.fromDate(date).toDate());
  }
}
