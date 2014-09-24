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
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;

import org.junit.Ignore;
import org.junit.Test;
import org.nlsaugment.augxml.exception.AugmentException;

public final class TestBitBox {

  private static final byte[] __empty1 = new byte[] {};

  private static final byte[] __empty2 = new byte[] { 0 };

  private static final byte[] __empty3 = new byte[] { 0, 0 };

  private static final byte[] __bytes1 = new byte[] { 1 };

  private static final byte[] __bytes2 = new byte[] { 127 };

  private static final byte[] __bytes3 = new byte[] { 65, 66, 67 };

  private static final byte[] __bytes4 = new byte[] { -2, 5 };

  private static final byte[] __bytes5 = new byte[] { 0, -128, 54, 66, 5 };

  private static final BitBox __bitbox0 = BitBox.fromBytes(__empty1);

  private static final BitBox __bitbox1 = BitBox.fromBytes(__bytes1);

  private static final BitBox __bitbox2 = BitBox.fromBytes(__bytes2);

  private static final BitBox __bitbox3 = BitBox.fromBytes(__bytes3);

  private static final BitBox __bitbox4 = BitBox.fromBytes(__bytes4);

  private static final BitBox __bitbox5 = BitBox.fromBytes(__bytes5);

  /**
   * Test fromBytes(byte[]) with null parameter.
   */
  @Test(expected = NullPointerException.class)
  public void fromBytes1() {
    BitBox.fromBytes(null);
  }

  /**
   * Test fromBytes(byte[], int, int) with null parameter.
   */
  @Test(expected = NullPointerException.class)
  public void fromBytes2() {
    BitBox.fromBytes(null, 0, 1);
  }

  /**
   * Test fromBytes(byte[]) with empty parameter.
   */
  @Test
  public void fromBytes3() {
    BitBox.fromBytes(__empty1);
  }

  /**
   * Test fromBytes(byte[], int, int) with empty parameter.
   */
  @Test
  public void fromBytes4() {
    BitBox.fromBytes(__empty2, 0, 1);
  }

  /**
   * Test fromBytes(byte[], int, int) with valid parameters.
   */
  @Test
  public void fromBytes5() {
    BitBox.fromBytes(__bytes3, 8, 16);
  }

  /**
   * Test fromBytes(byte[], int, int) with invalid fromIndex (-1).
   */
  @Test(expected = IndexOutOfBoundsException.class)
  public void fromBytes6() {
    BitBox.fromBytes(__bytes3, -1, 5);
  }

  /**
   * Test fromBytes(byte[], int, int) with invalid toIndex (28 > 24).
   */
  @Test(expected = IndexOutOfBoundsException.class)
  public void fromBytes7() {
    BitBox.fromBytes(__bytes3, 3, 28);
  }

  /**
   * Test fromBytes(byte[], int, int) with invalid toIndex (25 > 24).
   */
  @Test(expected = IndexOutOfBoundsException.class)
  public void fromBytes8() {
    BitBox.fromBytes(__bytes3, 3, 25);
  }

  /**
   * Test fromBytes(byte[], int, int) with invalid toIndex (9 > 8).
   */
  @Test(expected = IndexOutOfBoundsException.class)
  public void fromBytes9() {
    BitBox.fromBytes(__bytes1, 3, 9);
  }

  /**
   * Test fromBytes(byte[], int, int) with fromIndex > toIndex (5 > 4).
   */
  @Test(expected = IndexOutOfBoundsException.class)
  public void fromBytes10() {
    BitBox.fromBytes(__bytes1, 5, 4);
  }

  /**
   * Test isEmpty() using zero-length byte[].
   */
  @Test
  public void isEmpty1() {
    final BitBox bitbox = BitBox.fromBytes(__empty1);
    assertTrue(bitbox.isEmpty());
  }

  /**
   * Test isEmpty() using one-length byte[] that contains all zeros for bits.
   */
  @Test
  public void isEmpty2() {
    final BitBox bitbox = BitBox.fromBytes(__empty2);
    assertTrue(bitbox.isEmpty());
  }

  /**
   * Test isEmpty() using one-length byte[] that contains all zeros for bits, on
   * a subrange of bits.
   */
  @Test
  public void isEmpty3() {
    final BitBox bitbox = BitBox.fromBytes(__empty2, 4, 6);
    assertTrue(bitbox.isEmpty());
  }

  /**
   * Test isEmpty() using two-length byte[] that contains all zeros for bits
   */
  @Test
  public void isEmpty4() {
    final BitBox bitbox = BitBox.fromBytes(__empty3);
    assertTrue(bitbox.isEmpty());
  }

  /**
   * Test isEmpty(), that a non-empty byte[] {1} is not empty.
   */
  @Test
  public void isEmpty5() {
    final BitBox bitbox = BitBox.fromBytes(__bytes1);
    assertFalse(bitbox.isEmpty());
  }

  /**
   * Test isEmpty(), that a non-empty byte[] {127} is not empty.
   */
  @Test
  public void isEmpty6() {
    final BitBox bitbox = BitBox.fromBytes(__bytes2);
    assertFalse(bitbox.isEmpty());
  }

  /**
   * Test isEmpty(), that a non-empty byte[] {65, 66, 67} is not empty.
   */
  @Test
  public void isEmpty7() {
    final BitBox bitbox = BitBox.fromBytes(__bytes3);
    assertFalse(bitbox.isEmpty());
  }

  /**
   * Test that the size of a BitBox from a zero-length byte[] is 0.
   */
  @Test
  public void getSize1() {
    final BitBox bitbox = BitBox.fromBytes(__empty1);
    assertEquals(0, bitbox.getSize());
  }

  /**
   * Test that the size of a BitBox from a one-length byte[] is 8.
   */
  @Test
  public void getSize2() {
    final BitBox bitbox = BitBox.fromBytes(__empty2);
    assertEquals(8, bitbox.getSize());
  }

  /**
   * Test that the size of a BitBox from a one-length byte[], then subranged (3,
   * 4) is 1.
   */
  @Test
  public void getSize3() {
    final BitBox bitbox = BitBox.fromBytes(__empty2, 3, 4);
    assertEquals(1, bitbox.getSize());
  }

  /**
   * Test that the size of a BitBox from a two-length byte[], then subranged (3,
   * 10) is 7.
   */
  @Test
  public void getSize4() {
    final BitBox bitbox = BitBox.fromBytes(__empty3, 3, 10);
    assertEquals(7, bitbox.getSize());
  }

  /**
   * Test that the size of a BitBox from a two-length byte[], then subranged (6,
   * 16) is 10.
   */
  @Test
  public void getSize5() {
    final BitBox bitbox = BitBox.fromBytes(__bytes3, 6, 16);
    assertEquals(10, bitbox.getSize());
  }

  /**
   * Test that getting bits (0, 3) returns 3 bits.
   */
  @Test
  public void get1() {
    final BitBox bitbox = BitBox.fromBytes(__bytes3);
    final BitBox bitbox2 = bitbox.get(0, 3);
    assertEquals(3, bitbox2.getSize());
  }

  /**
   * Test that getting bits (5, 15) returns 10 bits.
   */
  @Test
  public void get2() {
    final BitBox bitbox = BitBox.fromBytes(__bytes3);
    final BitBox bitbox2 = bitbox.get(5, 15);
    assertEquals(10, bitbox2.getSize());
  }

  /**
   * Test that getting bits (-1, 5) is invalid. Edge case on fromIndex.
   */
  @Test(expected = IndexOutOfBoundsException.class)
  public void get3() {
    __bitbox3.get(-1, 5);
  }

  /**
   * Test that getting bits (5, 9) on a one-byte BitBox is invalid. Edge case on
   * toIndex.
   */
  @Test(expected = IndexOutOfBoundsException.class)
  public void get4() {
    __bitbox1.get(5, 9);
  }

  /**
   * Test that getting bits (2, 1) is invalid, because fromIndex > toIndex.
   */
  @Test(expected = IndexOutOfBoundsException.class)
  public void get5() {
    __bitbox1.get(2, 1);
  }

  /**
   * Test that toBinary() for 1-byte BitBox.
   */
  @Test
  public void toBinary1() {
    assertEquals("00000001", __bitbox1.toBinary());
  }

  /**
   * Test that toBinary() for 1-byte BitBox (127). Edge case for value.
   */
  @Test
  public void toBinary2() {
    assertEquals("01111111", __bitbox2.toBinary());
  }

  /**
   * Test that toBinary() for 2-byte BitBox.
   */
  @Test
  public void toBinary3() {
    assertEquals("010000010100001001000011", __bitbox3.toBinary());
  }

  /**
   * Test toBinary() for negative value (-2) in first byte.
   */
  @Test
  public void toBinary4() {
    assertEquals("1111111000000101", __bitbox4.toBinary());
  }

  /**
   * Test toBinary() for 3-bit subrange.
   */
  @Test
  public void toBinary5() {
    // test over byte boundary
    final BitBox bitbox = __bitbox3.get(7, 10);
    assertEquals("101", bitbox.toBinary());
  }

  /**
   * Test toBinary() for 1-bit subrange.
   */
  @Test
  public void toBinary6() {
    // test initial bit
    final BitBox bitbox = __bitbox4.get(0, 1);
    assertEquals("1", bitbox.toBinary());
  }

  /**
   * Test toBinary() for 0-bit subrange.
   */
  @Test
  public void toBinary7() {
    // test zero length binary
    final BitBox bitbox = __bitbox4.get(0, 0);
    assertEquals("0", bitbox.toBinary());
  }

  /**
   * Test toBinary() for 3-byte BitBox.
   */
  @Test
  public void toBinary9() {
    // test full-length get and binary display
    final BitBox bitbox = __bitbox3.get(0, 24);
    assertEquals("010000010100001001000011", bitbox.toBinary());
  }

  /**
   * Test toHex() for 0-byte BitBox.
   */
  @Test
  public void toHex1() {
    final BitBox bitbox = __bitbox0;
    // empty bitbox always returns 0.
    assertEquals("0", bitbox.toHex());
  }

  /**
   * Test toHex() for 1-byte BitBox with value "1".
   */
  @Test
  public void toHex2() {
    // bitbox with byte[] {1} should yield:
    //  binary     hex
    // 000000001 = 01
    final BitBox bitbox = __bitbox1;
    assertEquals("01", bitbox.toHex());
  }

  /**
   * Test toHex() for 1-byte BitBox with value "127".
   */
  @Test
  public void toHex3() {
    final BitBox bitbox = __bitbox2;
    assertEquals("7F", bitbox.toHex());
  }

  /**
   * Test toHex() for 3-byte BitBox with values {65, 66, 67}. 
   */
  @Test
  public void toHex4() {
    final BitBox bitbox = __bitbox3;
    assertEquals("414243", bitbox.toHex());
  }

  /**
   * Test fromHex() for value 0. 
   */
  @Test
  public void fromHex1() {
    assertEquals("0", BitBox.fromHex("0", 4).toHex());
  }

  /**
   * Test fromHex() for value 1. 
   */
  @Test
  public void fromHex2() {
    assertEquals("1", BitBox.fromHex("1", 4).toHex());
  }

  /**
   * Test fromHex() for value A. 
   */
  @Test
  public void fromHex3() {
    assertEquals("A", BitBox.fromHex("A", 4).toHex());
  }

  /**
   * Test fromHex() for value 7F. 
   */
  @Test
  public void fromHex4() {
    assertEquals("7F", BitBox.fromHex("7F", 8).toHex());
  }

  /**
   * Test fromHex() for value 7FFF. 
   */
  @Test
  public void fromHex5() {
    assertEquals("7FFF", BitBox.fromHex("7FFF", 16).toHex());
  }

  /**
   * Test toSignedInteger() on 0. Edge case value.
   */
  @Test
  public void toSignedInteger1() {
    assertEquals(0, __bitbox0.toSignedInteger());
  }

  /**
   * Test toSignedInteger() on 1.
   */
  @Test
  public void toSignedInteger2() {
    assertEquals(1, __bitbox1.toSignedInteger());
  }

  /**
   * Test toSignedInteger() on 127. Edge case value.
   */
  @Test
  public void toSignedInteger3() {
    assertEquals(127, __bitbox2.toSignedInteger());
  }

  /**
   * Test toSignedInteger() across boundary signed integer.
   */
  @Test
  public void toSignedInteger4() {
    // test across boundary signed integer
    // bits [8-23] = {66, 67} = (0 in first byte so number is positive), 66 *
    // 256 + 67 = 16963
    final BitBox bitbox = BitBox.fromBytes(__bytes3, 8, 24);
    assertEquals(16963, bitbox.toSignedInteger());
  }

  /**
   * Test toSignedInteger() on 31 bits. Edge case.
   */
  @Test
  public void toSignedInteger5() {
    final BitBox bitbox = __bitbox5.get(8, 40);
    // 1 sign bit and 31 bits fit in a Java int
    bitbox.toSignedInteger();
  }

  /**
   * Test toSignedInteger() on 32 bits, should fail. Edge case.
   */
  @Test(expected = AugmentException.class)
  public void toSignedInteger6() {
    final BitBox bitbox = __bitbox5.get(7, 40);
    // 1 sign bit and 32 bits cannot fit in a Java int, so an exception should
    // be thrown
    bitbox.toSignedInteger();
  }

  /**
   * Test that signed integer value of 11111110 is -126.
   */
  @Test
  public void toSignedInteger7() {
    // bytes4[0] = -2, but a Java byte is stored using a two's complement
    // scheme.
    // -2 (two's complement) = 11111110 = -126 (sign-and-magnitude)
    final BitBox bitbox = BitBox.fromBytes(__bytes4, 0, 8);
    assertEquals(-126, bitbox.toSignedInteger());
  }

  /**
   * Test that unsigned integer value of 11111110 is 254.
   */
  @Test
  public void toUnsignedInteger1() {
    final BitBox bitbox = BitBox.fromBytes(__bytes4, 0, 8);
    assertEquals(254, bitbox.toUnsignedInteger());
  }

  /**
   * Test unsigned integer for 1.
   */
  @Test
  public void toUnsignedInteger2() {
    assertEquals(1, __bitbox1.toUnsignedInteger());
  }

  /**
   * Test fromInteger(0, 1) using signed integers.
   */
  @Test
  public void fromInteger1() {
    assertEquals("0", BitBox.fromSignedInteger(0, 1).toBinary());
  }

  /**
   * Test fromInteger(0, 1) using unsigned integers.
   */
  @Test
  public void fromInteger2() {
    assertEquals("0", BitBox.fromUnsignedInteger(0, 1).toBinary());
  }

  /**
   * Test fromInteger(1, 2) using signed integers.
   */
  @Test
  public void fromInteger3() {
    assertEquals("01", BitBox.fromSignedInteger(1, 2).toBinary());
  }

  /**
   * Test fromInteger(1, 2) using unsigned integers.
   */
  @Test
  public void fromInteger4() {
    assertEquals("01", BitBox.fromUnsignedInteger(1, 2).toBinary());
  }

  /**
   * Test fromInteger(-1, 2) using signed integers.
   */
  @Test
  public void fromInteger5() {
    assertEquals("11", BitBox.fromSignedInteger(-1, 2).toBinary());
  }

  /**
   * Test fromInteger(-1, 2) using unsigned integers. Should fail, because
   * negative numbers are not allowed to be stored as an unsigned integer.
   */
  @Test(expected = AugmentException.class)
  public void fromInteger6() {
    BitBox.fromUnsignedInteger(-1, 2);
  }

  /**
   * Test fromInteger(4, 4) using signed integers.
   */
  @Test
  public void fromInteger7() {
    assertEquals("0100", BitBox.fromSignedInteger(4, 4).toBinary());
  }

  /**
   * Test fromInteger(4, 4) using unsigned integers.
   */
  @Test
  public void fromInteger8() {
    assertEquals("0100", BitBox.fromUnsignedInteger(4, 4).toBinary());
  }

  /**
   * Test fromInteger(8, 4) using signed integers. Should fail since there is
   * not enough room to store the number.
   */
  @Test(expected = AugmentException.class)
  public void fromInteger9() {
    BitBox.fromSignedInteger(8, 4);
  }

  /**
   * Test fromInteger(8, 5) using signed integers.
   */
  @Test
  public void fromInteger10() {
    assertEquals("01000", BitBox.fromSignedInteger(8, 5).toBinary());
  }

  /**
   * Test unpacking 5-bit text, using full word.
   */
  @Test
  public void unpack5BitText1() {
    /*
     * A B C D " " " " " " unused 00001 00010 00011 00100 00000 00000 00000 0
     * 
     * 00001000 10000110 01000000 00000000 0000 8 -122 64 0 0
     */

    final BitBox bitbox = BitBox.fromBytes(new byte[] { 8, -122, 64, 0, 0 })
        .get(0, 36);
    assertEquals("ABCD   ", bitbox.unpack5BitText());
  }

  /**
   * Test unpacking 5-bit text, using five 5-bit values.
   */
  @Test
  public void unpack5BitText2() {
    final BitBox bitbox = BitBox.fromBytes(new byte[] { 8, -122, 64, 0, 0 })
        .get(0, 25);
    assertEquals("ABCD ", bitbox.unpack5BitText());
  }

  /**
   * Test unpacking 5-bit text, using four 5-bit values.
   */
  @Test
  public void unpack5BitText3() {
    final BitBox bitbox = BitBox.fromBytes(new byte[] { 8, -122, 64, 0, 0 })
        .get(0, 20);
    assertEquals("ABCD", bitbox.unpack5BitText());
  }

  /**
   * Test unpacking 5-bit text, using three 5-bit values.
   */
  @Test
  public void unpack5BitText4() {
    final BitBox bitbox = BitBox.fromBytes(new byte[] { 8, -122, 64, 0, 0 })
        .get(0, 15);
    assertEquals("ABC", bitbox.unpack5BitText());
  }

  /**
   * Test unpacking 5-bit text that contains 40 bits. This is more than one word
   * in length, so this should fail.
   */
  @Test(expected = AugmentException.class)
  public void unpack5BitText5() {
    final BitBox bitbox = BitBox.fromBytes(new byte[] { 8, -122, 64, 0, 0 });
    assertEquals("ABC", bitbox.unpack5BitText());
  }

  /**
   * This test is not currently needed, since unpack5BitText doesn't support
   * multi-word bytes. But it is a good test once it does, so I kept it around.
   */
  @Ignore
  public void unpack5BitText6() {
    /*
     * 2 words (72 bits) of packed data
     * 
     * A B C D 6 5 4 unused 3 2 Z Y " " " " " " unused 00001 00010 00011 00100
     * 11111 11110 11101 0 11100 11011 11010 11001 00000 00000 00000 0
     * 
     * 00001000 10000110 01001111 11111011 10101110 01101111 01011001 00000000
     * 00000000 8 -122 79 -5 -82 111 89 0 0
     */

    final BitBox bitbox = BitBox.fromBytes(new byte[] { 8, -122, 79, -5, -82,
        111, 89, 0, 0 });
    assertEquals("ABCD65432ZY   ", bitbox.unpack5BitText());
  }

  /**
   * Test packing an empty string with size 0.
   */
  @Test
  public void pack5BitText1() {
    final String s = "";
    assertEquals(s, BitBox.pack5BitText(s, 0).unpack5BitText());

  }

  /**
   * Test packing an empty string with size 5. Converting it back to a String
   * should yield " " (a space) instead of the empty string, because 5-bit text
   * has no way to represent length, so empty string (all zeros) is the first
   * character in the 5-bit set (namely, space).
   */
  @Test
  public void pack5BitText2() {
    final String s = "";
    final String s2 = " ";
    assertEquals(s2, BitBox.pack5BitText(s, 5).unpack5BitText());
  }

  /**
   * Test packing a string with "A", with size 5.
   */
  @Test
  public void pack5BitText3() {
    final String s = "A";
    assertEquals(s, BitBox.pack5BitText(s, 5).unpack5BitText());
  }

  /**
   * Test packing a string with "A", with size 6. This should fail (invalid
   * number of bits).
   */
  @Test(expected = AugmentException.class)
  public void pack5BitText4() {
    final String s = "A";
    assertEquals(s, BitBox.pack5BitText(s, 6).unpack5BitText());
  }

  /**
   * Test packing a string with "HELLO", with size 25.
   */
  @Test
  public void pack5BitText5() {
    final String s = "HELLO";
    assertEquals(s, BitBox.pack5BitText(s, 25).unpack5BitText());
  }

  /**
   * Test packing a string with "HELLO", with size 36. This should yield "HELLO "
   * (two trailing spaces) because the size of the BitBox can hold 7 characters.
   */
  @Test
  public void pack5BitText6() {
    final String s = "HELLO";
    final String s2 = "HELLO  ";
    assertEquals(s2, BitBox.pack5BitText(s, 36).unpack5BitText());
  }

  /**
   * Test packing a string with "HELLO", with size 35. This should yield "HELLO "
   * (two trailing spaces) because the size of the BitBox can hold 7 characters.
   */
  @Test
  public void pack5BitText7() {
    final String s = "HELLO";
    final String s2 = "HELLO  ";
    assertEquals(s2, BitBox.pack5BitText(s, 35).unpack5BitText());
  }

  /**
   * Test packing a string with "GOODBYE", with size 50. This should fail (more
   * than 5 characters).
   */
  @Test(expected = AugmentException.class)
  public void pack5BitText8() {
    final String s = "GOODBYE";
    assertEquals(s, BitBox.pack5BitText(s, 50).unpack5BitText());
  }

  /**
   * Test packing a string with "   R", with size 36.
   */
  @Test
  public void pack5BitText9() {
    final String s = "   R";
    final String s2 = "   R   ";
    assertEquals(s2, BitBox.pack5BitText(s, 36).unpack5BitText());
  }

  /**
   * Test unpacking 7-bit text, using four 7-bit values.
   */
  @Test
  public void unpack7BitText1() {
    /*
     * A B C D 1000001 1000010 1000011 1000100
     * 
     * 10000011 00001010 00011100 01000000 -125 10 28 64
     */
    final BitBox bitbox = BitBox.fromBytes(new byte[] { -125, 10, 28, 64 })
        .get(0, 28);
    assertEquals("ABCD", bitbox.unpack7BitText());
  }

  /**
   * Test unpacking 7-bit text, using one word.
   */
  @Test
  public void unpack7BitText2() {
    /*
     * A B C D E not used 1000001 1000010 1000011 1000100 1000101 0
     * 
     * 10000011 00001010 00011100 01001000 10100000 -125 10 28 72 -96
     */
    final BitBox bitbox = BitBox
        .fromBytes(new byte[] { -125, 10, 28, 72, -96 }).get(0, 36);
    assertEquals("ABCDE", bitbox.unpack7BitText());
  }

  /**
   * Test unpacking 7-bit text, using five 7-bit values.
   */
  @Test
  public void unpack7BitText3() {
    final BitBox bitbox = BitBox
        .fromBytes(new byte[] { -125, 10, 28, 72, -96 }).get(0, 35);
    assertEquals("ABCDE", bitbox.unpack7BitText());
  }

  /**
   * Test unpacking 7-bit text, using two 7-bit values.
   */
  @Test
  public void unpack7BitText4() {
    final BitBox bitbox = BitBox
        .fromBytes(new byte[] { -125, 10, 28, 72, -96 }).get(0, 14);
    assertEquals("AB", bitbox.unpack7BitText());
  }

  /**
   * Test unpacking 7-bit text, using 13 bits instead of 14 bits. This should
   * fail.
   */
  @Test(expected = AugmentException.class)
  public void unpack7BitText5() {
    final BitBox bitbox = BitBox
        .fromBytes(new byte[] { -125, 10, 28, 72, -96 }).get(0, 13);
    bitbox.unpack7BitText();
  }

  /**
   * Test unpacking 7-bit text, in which the "unused" bit is 1 instead of 0.
   * This should fail.
   */
  @Test(expected = AugmentException.class)
  public void unpack7BitText6() {
    /*
     * A B C D E not used 1000001 1000010 1000011 1000100 1000101 1
     * 
     * 10000011 00001010 00011100 01001000 10110000 -125 10 28 72 -80
     */
    final BitBox bitbox = BitBox
        .fromBytes(new byte[] { -125, 10, 28, 72, -80 }).get(0, 36);
    bitbox.unpack7BitText();
  }

  /**
   * Test that if a BitBox is empty, then empty string ("") is returned.
   */
  @Test
  public void unpack7BitText7() {
    final BitBox bitbox = BitBox.fromBytes(new byte[] { 0, 0, 0, 0, 0 }).get(0,
        36);
    assertEquals("", bitbox.unpack7BitText());
  }

  /**
   * Test packing an empty string with size 0.
   */
  @Test
  public void pack7BitText1() {
    final String s = "";
    assertEquals(s, BitBox.pack7BitText(s, 0).unpack7BitText());

  }

  /**
   * Test packing an empty string with size 7.
   */
  @Test
  public void pack7BitText2() {
    final String s = "";
    assertEquals(s, BitBox.pack7BitText(s, 7).unpack7BitText());
  }

  /**
   * Test packing a string with "a", with size 7.
   */
  @Test
  public void pack7BitText3() {
    final String s = "a";
    assertEquals(s, BitBox.pack7BitText(s, 7).unpack7BitText());
  }

  /**
   * Test packing a string with "a", with size 6. This should fail (invalid
   * number of bits).
   */
  @Test(expected = AugmentException.class)
  public void pack7BitText4() {
    final String s = "a";
    assertEquals(s, BitBox.pack7BitText(s, 6).unpack7BitText());
  }

  /**
   * Test packing a string with "hello", with size 36.
   */
  @Test
  public void pack7BitText5() {
    final String s = "hello";
    assertEquals(s, BitBox.pack7BitText(s, 36).unpack7BitText());
  }

  /**
   * Test packing a string with "hello", with size 35.
   */
  @Test
  public void pack7BitText6() {
    final String s = "hello";
    assertEquals(s, BitBox.pack7BitText(s, 35).unpack7BitText());
  }

  /**
   * Test packing a string with "goodbye", with size 50.
   */
  @Test
  public void pack7BitText7() {
    final String s = "goodbye";
    assertEquals(s, BitBox.pack7BitText(s, 50).unpack7BitText());
  }

  /**
   * Test packing a string with "goodbye", with size 57.
   */
  @Test
  public void pack7BitText8() {
    final String s = "goodbye";
    final String s1 = "goodbye\0";
    assertEquals(s1, BitBox.pack7BitText(s, 57).unpack7BitText());
  }

  /**
   * Test packing a string with "goodbye", with size 58. Should fail (invalid
   * number of bits).
   */
  @Test(expected = AugmentException.class)
  public void pack7BitText9() {
    final String s = "goodbye";
    assertEquals(s, BitBox.pack7BitText(s, 58).unpack7BitText());
  }

  /**
   * Test packing a string with "goodbye", with size 72.
   */
  @Test
  public void pack7BitText10() {
    final String s = "goodbye";
    final String s1 = "goodbye\0\0\0";
    assertEquals(s1, BitBox.pack7BitText(s, 72).unpack7BitText());
  }

  /**
   * Test that toBoolean() for an empty BitBox is false.
   */
  @Test
  public void toBoolean1() {
    assertFalse(__bitbox0.toBoolean());
  }

  /**
   * Test that toBoolean() for an BitBox containing 1 is true.
   */
  @Test
  public void toBoolean2() {
    assertTrue(__bitbox1.toBoolean());
  }

  /**
   * Test that toBoolean() for a range of zero-bits is false.
   */
  @Test
  public void toBoolean3() {
    final BitBox bitbox = __bitbox5.get(0, 8);
    assertFalse(bitbox.toBoolean());
  }

  /**
   * Test that toBoolean() for BitBox containing the value 127 is false (value
   * must be either 0 or 1).
   */
  @Test(expected = AugmentException.class)
  public void toBoolean4() {
    __bitbox2.toBoolean();
  }

  /**
   * Test that fromBytes() and then toBytes() on same object yields original
   * object for a zero-length byte[].
   */
  @Test
  public void toBytes1() {
    assertTrue(Arrays.equals(__empty1, BitBox.fromBytes(__empty1).toBytes()));
  }

  /**
   * Test that fromBytes() and then toBytes() on same object yields original
   * object for an empty one-length byte[].
   */
  @Test
  public void toBytes2() {
    assertTrue(Arrays.equals(__empty2, BitBox.fromBytes(__empty2).toBytes()));
  }

  /**
   * Test that fromBytes() and then toBytes() on same object yields original
   * object for an empty two-length byte[].
   */
  @Test
  public void toBytes3() {
    assertTrue(Arrays.equals(__empty3, BitBox.fromBytes(__empty3).toBytes()));
  }

  /**
   * Test that fromBytes() and then toBytes() on same object yields original
   * object for a non-empty one-length byte[] (value 1).
   */
  @Test
  public void toBytes4() {
    assertTrue(Arrays.equals(__bytes1, BitBox.fromBytes(__bytes1).toBytes()));
  }

  /**
   * Test that fromBytes() and then toBytes() on same object yields original
   * object for a non-empty one-length byte[] (value 127).
   */
  @Test
  public void toBytes5() {
    assertTrue(Arrays.equals(__bytes2, BitBox.fromBytes(__bytes2).toBytes()));
  }

  /**
   * Test that fromBytes() and then toBytes() on same object yields original
   * object for a non-empty two-length byte[].
   */
  @Test
  public void toBytes6() {
    assertTrue(Arrays.equals(__bytes3, BitBox.fromBytes(__bytes3).toBytes()));
  }

  /**
   * Test that fromBytes() and then toBytes() on same object yields original
   * object for a two-length byte[] with a negative number.
   */
  @Test
  public void toBytes7() {
    assertTrue(Arrays.equals(__bytes4, BitBox.fromBytes(__bytes4).toBytes()));
  }

  /**
   * Test that fromBytes() and then toBytes() on same object yields original
   * object for a five-length byte[].
   */
  @Test
  public void toBytes8() {
    assertTrue(Arrays.equals(__bytes5, BitBox.fromBytes(__bytes5).toBytes()));
  }

  /**
   * Test that a different subranges of different byte[] objects, in which the
   * subranges have the same values, should yield the same results, after using
   * fromBytes() and toBytes()
   */
  @Test
  public void toBytes9() {
    final byte[] bytes1 = BitBox.fromBytes(__bytes3, 8, 16).toBytes();
    final byte[] bytes2 = BitBox.fromBytes(__bytes5, 24, 32).toBytes();
    assertTrue(Arrays.equals(bytes1, bytes2));
  }

  /**
   * Start with a BitBox containing value {127}, then sub-range (6, 8), and then
   * call toBytes(). Calling toBytes() method on 2 bits does 0-padding for extra
   * 6 bits, yielding {-64}.
   */
  @Test
  public void toBytes10() {
    // bitbox2 = {127} = 01111111; take last 2 bits = 11 (binary) = 3 (decimal)
    // Calling toBytes() method on 2 bits does 0-padding for extra 6 bits
    // 11000000 = -128 + 64 = -64
    assertTrue(Arrays.equals(new byte[] { -64 }, __bitbox2.get(6, 8).toBytes()));
  }
  
  /**
   * Start with a BitBox containing value {65, 66}, then sub-range (0, 10), and then
   * call toBytes(). Calling toBytes() method on 10 bits does 0-padding for extra
   * 6 bits, yielding {65, 64}.
   */
  @Test
  public void toBytes11() {
    // bitbox3 = {65, 66} = 01000001 01000010
    // Calling toBytes() method on 10 bits does 0-padding for extra 6 bits
    assertTrue(Arrays.equals(new byte[] { 65, 64 }, __bitbox2.get(0, 10).toBytes()));
  }  
}
