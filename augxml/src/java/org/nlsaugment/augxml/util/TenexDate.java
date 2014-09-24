/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.util;

import java.util.Date;

import org.nlsaugment.augxml.exception.AugmentException;



/**
 * As described in the TOPS-20 Monitor Calls Reference Manual:
 * <blockquote>
 * TOPS-20 internal date and time is maintained in a 36-bit word  and  is
 * based on Greenwich Mean Time.  The date is in the left half and is the
 * number of days since November 17, 1858;  the time is in the right half
 * and  is  represented  as  a fraction of a day.  This allows the 36-bit
 * value to be in units of days with a binary point between the left  and
 * right  halves.  The resolution is approximately one-third of a second;
 * that is, the least significant bit represents approximately  one-third
 * of  a  second.  The date changes at the transition from 11:59:59 PM to
 * 12:00:00 midnight.
 * </blockquote>
 *
 * <p>The range for a TenexDate is from Nov 17, 1858 at midnight to
 * August 7, 2576 23:59:59 and approximately 2/3 second. 
 * The range for a java.util.Date is based on a signed 64-bit long value. However,
 * this implementation forces the range to match the range of the TenexDate.
 * 
 * <p>TenexDate has a smaller range than a java.util.Date, and its resolution 
 * is only accurate to approximately 1/3 second (compared with millisecond resolution).
 * <p>The actual resolution of a TenexDate is:
 * <code>(60 * 60 * 24 = 86400 seconds per day) / (2^18 bits = 262144 TenexDate BitsPerDay) =
 * ~0.329589844 seconds per bit</code>
 * <p>Date conversion to a java.util.Date will yield a Date in GMT timezone, but the TenexDate
 * is representing a time in an (indeterminate) local timezone, based on the timezone of the
 * particular TENEX/TOPS-20 machine that was used when the date was created. 
 * 
 * @author Jonathan Cheyer
 */
public final class TenexDate {
  private static final int __daySize = 18;
  private static final int __timeSize = 18;
  private static final int __tenexDateSize = __daySize + __timeSize;
  private static final TenexDate __unixEpoch = initUnixEpoch();
  private static final long __millisPerDay = 1000 * 60 * 60 * 24;
  private static final double __millisPerThirdsOfSecond = __millisPerDay / Math.pow(2, 18);

  private final BitBox _bits;

  public TenexDate(final BitBox bits) {
    if (bits.getSize() != TenexDate.__tenexDateSize) {
      throw new AugmentException("tenexDateSize is invalid: " + bits.getSize());
    }
    this._bits = bits;
  }
  
  private static TenexDate initUnixEpoch() {
    // Nov 17, 1858
    final int novemberDays1858 = (30 - 17) + 1;    
    // Dec 1, 1858
    final int decemberDays1858 = 31;
    // Jan 1, 1859
    final int yearDays1859 = 365;
    // Jan 1, 1860    
    final int years = 1970 - 1860;    
    // 365 days in each year, plus 1 leap year every 4th year, but subtract one for 1900 (no leap year)
    final int yearDays18601970 = years * 365 + ((int) Math.ceil((years * 1.0) / 4)) - 1;
    // Jan 1, 1970
    
    // number of days between Nov 17, 1858 and Jan 1, 1970
    final int numDays = novemberDays1858 + decemberDays1858 + yearDays1859 + yearDays18601970;
    
    return newInstance(numDays, 0);
  }

  public BitBox getBits() {
    return this._bits;
  }
  
  /**
   * Returns the 18 bit date portion of the TenexDate.
   * @return the day portion of the TenexDate. This represents the number of days since
   * November 17, 1858.
   */
  public int getDayNumber() {
    return this._bits.get(0, __daySize).toUnsignedInteger();
  }
  
  /**
   * Returns the 18 bit time portion of the TenexDate.
   * @return the time portion of the TenexDate
   */
  public int getTimeNumber() {
    return this._bits.get(__daySize, __tenexDateSize).toUnsignedInteger();
  }

  /**
   * Converts the TenexDate to a java.util.Date (in GMT time zone).
   * @return the date as a java.util.Date
   */
  public Date toDate() {
    // number of days since Jan 1, 1970
    final int t1 = getDayNumber() - __unixEpoch.getDayNumber();
    // number of thirds of a second in a day
    final int t2 = getTimeNumber();
    
    final Date date = new Date(t1 * __millisPerDay + ((long) (t2 * __millisPerThirdsOfSecond)));
    return date;
  }

  /**
   * Create a new TenexDate from two numbers. The two numbers represent the Tenex day unit and the
   * Tenex time unit, respectively. The Tenex day unit can be obtained from an existing TenexDate
   * with the getDateNumber() and the Tenex time unit can be obtained from an existing TenexDate
   * with the getTimeNumber() method.
   * @param dayNumber the number of days since November 17, 1858.
   * @param timeNumber the number of Tenex time units. One Tenex time unit is exactly equivalent to
   * (86400 seconds per day / 2^18 time units per day), or approximately 1/3 second. 
   * @return new TenexDate
   */
  public static TenexDate newInstance(final int dayNumber, final int timeNumber) {
    if (dayNumber < 0 || dayNumber > 262144) { // must be an unsigned integer from 0 to 2^18
      throw new AugmentException("dayNumber is out of range: " + dayNumber);
    }
    if (timeNumber < 0 || timeNumber > 262144) { // must be an unsigned integer from 0 to 2^18
      throw new AugmentException("timeNumber is out of range: " + timeNumber);
    }
    
    final WriteableBitBox wbb = new WriteableBitBox(__tenexDateSize);
    wbb.set(0, BitBox.fromUnsignedInteger(dayNumber, __daySize));
    wbb.set(__daySize, BitBox.fromUnsignedInteger(timeNumber, __timeSize));
    return new TenexDate(wbb.toBitBox());    
  }

  /**
   * Converts a java.util.Date (in GMT time zone) to a TenexDate.
   * <p><b>Note</b>: Because the resolutions of java.util.Date and TenexDate are not the same
   * (millisecond vs approximately 1/3 second resolution), converting from a TenexDate to a java.util.Date
   * and back again (or vice versa) will not yield the original date. The difference between the two
   * numbers will always be less than 330 milliseconds. Times that contain a whole number of seconds
   * (no milliseconds or 1/3 second blocks) will always convert back and forth exactly.  
   * If you need to keep the original TenexDate exact in all cases (when there is not a whole number
   * of seconds), use the getDateNumber() and getTimeNumber() methods and store the two separate integers.  
   * @param date the java.util.Date to convert
   * @return a date as a new TenexDate
   */
  public static TenexDate fromDate(final Date date) {      
    final long millis = date.getTime();
    final int numDays = (int) Math.floor((millis * 1.0) / __millisPerDay);
     
    // thos = thirds of second
    final int numThos = (int) ((millis - (numDays * __millisPerDay)) / __millisPerThirdsOfSecond);
    return TenexDate.newInstance(__unixEpoch.getDayNumber() + numDays, numThos);
  }

  /**
   * Converts a String into a TenexDate. The required format of the string is:
   * (dayValue, timeValue)
   * @param value the String value of the date that will be converted to a TenexDate
   * @return a new TenexDate
   * @see #toString()
   */
  public static TenexDate fromString(final String value) {
    if (value == null || value.length() < 6) {
      throw new AugmentException("invalid value: '" + value + "'");
    }
    if (value.charAt(0) != '(' || value.charAt(value.length() - 1) != ')') {
      throw new AugmentException("invalid format: " + value);
    }
    if (value.indexOf(',') < 0) {
      throw new AugmentException("invalid format: " + value);
    }
    final String[] nums = value.substring(1, value.length() - 1).split(",");
    if (nums.length != 2) {
      throw new AugmentException("invalid format: " + value);
    }
    final int dayNumber = Integer.parseInt(nums[0].trim());
    final int wordNumber = Integer.parseInt(nums[1].trim());
    return newInstance(dayNumber, wordNumber);
  }
  
  /**
   * Returns the value of the TenexDate. The format used is:
   * (dayValue, timeValue)
   * @return the value of the TenexDate as a string
   */
  @Override
  public String toString() {
    return "(" + getDayNumber() + ", " + getTimeNumber() + ")";
  }
} 
