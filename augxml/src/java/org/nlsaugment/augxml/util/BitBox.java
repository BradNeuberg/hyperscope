/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.util;

import static org.nlsaugment.augxml.Constants.bitsPerByte;
import static org.nlsaugment.augxml.Constants.maxBitsPerAugNumber;

import java.util.BitSet;

import org.nlsaugment.augxml.exception.AugmentException;

/**
 * A BitBox is an immutable object which contains a bunch of bits and it stores 
 * the size (number of bits). It also has methods to convert those bits into other formats 
 * (signed integer, unsigned integer, binary, boolean, 5-bit string, 7-bit string, byte[]).
 * @author Jonathan Cheyer
 *
 */
public final class BitBox {
  // see <DEV:BESRC, FILMNP.AUG.172,>
  private static final String __characterSet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ23456";

  private BitSet _bits;
  private int _size;

  private BitBox(final BitSet bits, final int size) {
    this._bits = bits;
    this._size = size;
  }

  /**
   * Return the value of the bit with the specified index. Used only by WriteableBitBox.
   * @param bitIndex the bitIndex used to look up the bit value.
   */
  boolean get(final int bitIndex) {
    return this._bits.get(bitIndex);
  }
  
  /**
   * Return a new BitBox containing a subset of the original bits, from beginIndex to (endIndex - 1).
   * The new BitBox contains (endIndex - beginIndex) bits. 
   * @param beginIndex the beginning index, inclusive
   * @param endIndex the ending index, exclusive. In other words,
   * the byte[] will contain bits from beginIndex to (endIndex - 1), and its length will be 
   * (endIndex - beginIndex).
   * @return a subset of the original bits
   * @throws IndexOutOfBoundsException if (beginIndex < 0)
   * @throws IndexOutOfBoundsException if (endIndex > bytes.length * 8)
   * @throws IndexOutOfBoundsException if (beginIndex > endIndex)
   */
  public BitBox get(final int beginIndex, final int endIndex) {
    if (beginIndex < 0) {
      throw new IndexOutOfBoundsException("beginIndex < 0: " + beginIndex);
    }
    if (endIndex > getSize()) {
      throw new IndexOutOfBoundsException("endIndex > getSize(): " + endIndex + ", " + getSize());
    }
    if (beginIndex > endIndex) {
      throw new IndexOutOfBoundsException("beginIndex > endIndex: " + beginIndex + ", " + endIndex);
    }
    return new BitBox(this._bits.get(beginIndex, endIndex), endIndex - beginIndex);
  }
  
  /**
   * Return the number of bits that the BitBox contains. The number of bits represents the 
   * physical storage of the BitBox.
   * @return the size of the BitBox
   */
  public int getSize() {
    return this._size;
  }

  /**
   * Returns true if all the bits in the BitBox are zeros. Note that getSize() of the BitBox
   * may be non-zero even if isEmpty() returns true.
   * @return true if no bits are set to 1 (true); false otherwise
   */
  public boolean isEmpty() {
    return this._bits.cardinality() == 0;
  }
  
  /**
   * Return a binary string representation of BitBox. The bits are displayed from left to right,
   * starting with the bit at index 0 and ending with the bit at index (getSize() - 1).
   * If a bit is on (true), then a "1" is used. Otherwise, a "0" is used.
   * The number of bits returned is the number returned by getSize(). The only exception is if getSize() 
   * is 0, in which case a "0" is returned (instead of ""). If it is important to distinguish between a "0"
   * that is 0 bits long and a "0" that is 1 bit long, use getSize() to return the size.
   * @see #getSize()
   * @return the binary string representation
   */
  public String toBinary() {
    final StringBuilder sb = new StringBuilder(this._bits.length());
    if (this._size == 0) {
      return "0";
    }
    for (int i = 0; i < this._size; i++) {
      sb.append(this._bits.get(i) ? '1' : '0');
    }
    return sb.toString();
  }

  /**
   * Return a hexadecimal representation of BitBox. The bits are pulled from left to right,
   * in groups of 4, to represent one hexadecimal number. If (size % 4 != 0), then an
   * exception will be thrown, since it will not be able to display the BitBox correctly as a
   * set of hexadecimal numbers. 
   * @throws AugmentException if the BitBox does not have a bit size equal to a multiple of 4. 
   * @return the hexadecimal representation
   */
  public String toHex() {
    // TODO: unit testing
    if (this._size == 0) {
      return "0";
    }
    if (this._size % 4 != 0) {
      throw new AugmentException("unable to convert to hex (size=" + this._size + ")");
    }
    final String hex = "0123456789ABCDEF";
    final StringBuilder sb = new StringBuilder(this._bits.length() / 4 + 1);
    int i = 0;
    while (true) {
      if (i + 3 < this._size) {
        int num = (this._bits.get(i) ? 8 : 0) + 
        (this._bits.get(i + 1) ? 4 : 0) + 
        (this._bits.get(i + 2) ? 2 : 0) + 
        (this._bits.get(i + 3) ? 1 : 0);
        if (num < 0 || num > 15) {
          throw new AugmentException("invalid number: " + num);
        }
        sb.append(hex.charAt(num));
        i += 4;
      } else {
        break;
      }
    }
    return sb.toString();
  }
  
  public static BitBox fromHex(final String string, final int numBits) {
    // TODO unit testing
    final String hex = "0123456789ABCDEF";
    if (numBits < string.length() * 4) {
      throw new AugmentException("not enough bits (" + numBits + ") to store a string of length " + string.length());
    }
    final BitSet bitset = new BitSet(numBits);
    for (int i = 0; i < string.length(); i++) {
      int ch = string.charAt(i);
      if (hex.indexOf(ch) < 0) {
        throw new AugmentException("invalid hex digit: " + ch);
      }
      int val = hex.indexOf(ch);
      for (int j = 0; j < 4; j++) {
        bitset.set(i * 4 + j, (val & (int) Math.pow(2, (4 - j - 1))) > 0);
      }
    }
    return new BitBox(bitset, numBits);    
  }
  
  /**
   * Return an ASCII text representation of the BitBox, by using a 5-bit packing scheme to
   * unpack the characters. This is only useful to unpack bits which have been previously 
   * packed using the same scheme in Augment. This is typically used retrieve initials of
   * Augment file authors.
   * <p>Since the character set is only represented by 5 bits, only 32 characters can be 
   * represented in this scheme. The characters used, ordered in the mapping, are:
   * <code>" ABCDEFGHIJKLMNOPQRSTUVWXYZ23456"</code>
   * <p>The size of the bits must either be a multiple of 5 bits (but less than 36 bits), 
   * or exactly 36 bits (in which case the last bit is ignored). Any other size will cause
   * an AugmentException to be thrown.
   * 
   * @throws AugmentException if bit size > 36
   * @throws AugmentException if bit size != 36 && bit size mod 5 != 0
   * @see org.nlsaugment.augxml.model.FileHeaderBlock#getLastModUser
   * @see org.nlsaugment.augxml.model.StatementDataBlockHeader#getCreationUser
   */
  public String unpack5BitText() {
    if (this.getSize() > 36) {
      throw new AugmentException("size must be less than 36 bits: " + this.getSize());
    }
    if (this.getSize() != 36 && this.getSize() % 5 != 0) {
      throw new AugmentException("should be either 36 bits or multiple of 5 bits, but is " + this.getSize() + " bits");
    }
    final StringBuilder sb = new StringBuilder();
    int max;
    if (this.getSize() == 36) {
      max = 7;
    } else {
      max = this.getSize() / 5;
    }
    for (int i = 0; i < max; i++) {
      final BitBox charBit = this.get(i * 5, (i * 5) + 5);
      final int num = charBit.toUnsignedInteger();
      final char kar = __characterSet.charAt(num);
      sb.append(kar);
    }
    return sb.toString();
  }

  /**  
   * Return a new BitBox from the given string. The string is packed using a 5-bit approach,
   * as defined in the unpack5BitText() method.  
   * @param string the string to pack
   * @param numBits the number of bits used to create the BitBox 
   * @return a new BitBox
   * @see #unpack5BitText()
   */
  public static BitBox pack5BitText(final String string, final int numBits) {
    if (numBits > 36) {
      throw new AugmentException("size must be less than 36 bits: " + numBits);
    }
    if (numBits != 36 && numBits % 5 != 0) {
      throw new AugmentException("should be either 36 bits or multiple of 5 bits, but is " + numBits + " bits");
    }
    if (string.length() > 5) {
      throw new AugmentException("string must be 5 characters or less but is: " + string.length());
    }
    final BitSet bitset = new BitSet(numBits);
    int index = 0;
    for (int i = 0; i < string.length(); i++) {
      index += 5;
      int ch = string.charAt(i);
      int pos = __characterSet.indexOf(ch); 
      if (pos < 0) {
        throw new AugmentException("invalid character #" + ch);
      }
      for (int j = 4; j >= 0; j--) {
        index--;
        if (pos % 2 == 1) {
          bitset.set(index, true);
        }
        pos = pos / 2;
      }
      index += 5;
    }
    return new BitBox(bitset, numBits);
  }
  
  /**
   * Return an ASCII text representation of the BitBox, by using a 7-bit packing scheme to
   * unpack the characters. Five 7-bit characters are stored in a word, with the last bit 
   * in the word tossed away. Each 7-bit character represents an ASCII character, using the
   * standard 7-bit ASCII mapping. 
   * 
   * <p>In general, the size of the bits must be a multiple of 36 bits (in which case the last 
   * bit within each word is dropped). The remaining word (or less) of bits is allowed to be either 
   * a multiple of 7 bits, or exactly 36 bits. More precisely, the size is valid if
   * (size % 36 == 0 || ((size % 36) % 7 == 0)). Any other size will cause an 
   * AugmentException to be thrown.
   * 
   * <p>If the BitBox has trailing empty bits (resulting in trailing NUL chars), they
   * are left as is. If you want to remove the trailing NUL (ASCII 0) chars, 
   * use the removeTrailingNulCharacters() method.
   * 
   * <p>However, if the entire BitBox is empty, then an empty string ("") is returned.
   * @return a String representing the unpacked 7-bit characters, or "" if all bits are zero.
   * @throws AugmentException if size is invalid
   * @throws AugmentException if the last bit in the word is not 0.
   */
  public String unpack7BitText() {
    if (this.getSize() % 36 != 0 && ((this.getSize() % 36) % 7 != 0)) {
      throw new AugmentException("invalid size: " + this.getSize());
    }
    if (this.isEmpty()) {
      return "";
    }
    final StringBuilder chars = new StringBuilder(5 * this.getSize() / 36);
    // careful - make sure this the ceil() is performed on a double value
    int jmax = (int) Math.ceil(1.0 * this.getSize() / 36);
    for (int j = 0; j < jmax; j++) {      
      for (int i = 0; i < 5; i++) {
        final int start = j * 36 + i * 7;
        final int end = j * 36 + (i + 1) * 7;
        if (end > this.getSize()) {
          break;
        }
        final BitBox charBit = this.get(start, end);
        final int num = charBit.toUnsignedInteger() & 0xFF;
        final char kar = (char) num;
        chars.append(kar);
      }
      if (this.getSize() % 36 == 0) {
        final BitBox bit = this.get(j * 36 + 35, j * 36 + 36);
        if (bit.toBoolean()) {
          // TODO: figure out if this is the correct behavior
//          throw new AugmentException("last bit in word is 1 instead of 0");          
        }
      }
    }
    return chars.toString();
  }

  /**  
   * Return a new BitBox from the given string. The string is packed using a 7-bit approach,
   * as defined in the unpack7BitText() method. The BitBox must be at least large enough to
   * store the string, but it may be larger.  
   * @param string the string to pack
   * @param numBits the number of bits used to create the BitBox 
   * @return a new BitBox
   * @see #unpack7BitText()
   */
  public static BitBox pack7BitText(final String string, final int numBits) {
    final int minSize = (string.length() / 5) * 36 + (string.length() % 5) * 7;
    if ((string.length() % 5 == 0 && numBits < minSize - 1) || 
        (string.length() % 5 != 0 && numBits < minSize)) {
      throw new AugmentException("the string of length " + string.length() + " has an invalid numBits: " + numBits);
    }
    final BitSet bitset = new BitSet(numBits);
    int index = 0;
    for (int i = 0; i < string.length(); i++) {
      index += 7;
      int ch = string.charAt(i);
      for (int j = 6; j >= 0; j--) {
        index--;
        if (ch % 2 == 1) {
          bitset.set(index, true);
        }
        ch = ch / 2;
      }
      index += 7;
      if (index % 36 == 35) {
        index++;
      }
    }
    return new BitBox(bitset, numBits);
  }
  
  /**
   * Convert a BitBox to a signed integer value.
   * <p>Augment uses a sign-and-magnitude approach to represent signed integers, in which
   * the most-significant bit (BitBox index 0) is used to store the sign. Although Augment 
   * contains numeric field data which is up to 36 bits in length (which would allow numbers up to
   * +-2^35 to be stored), the Augment file format doesn't appear to use all the bits.
   * In fact, there doesn't appear to be any fields which store values larger than +- 2^30. This is 
   * sufficient to store the value in a Java int primitive, so an int is returned by this method. 
   * For more info, see the AugSignedNumber class. 
   * <p>A run-time check is done to make sure that every value is within this range. If the value
   * is outside this range, an AugmentException is thrown (and this method would need to be
   * redesigned to allow Java long values).
   * <p>Zero bit numbers return a 0 value. One bit numbers are assumed to be boolean flags and 
   * treated as such (meaning, no sign-and-magnitude approach is used with boolean flags). With 
   * boolean flags, the single bit determines whether the value is 1 or 0. Numbers with 2 or more 
   * bits will have their first bit evaluated as a sign bit. 
   * <p>This assumes Big-Endian storage.
   * @see org.nlsaugment.augxml.type.AugSignedNumber
   * @return the signed integer representation of the BitBox
   * @throws AugmentException if the signed integer value of BitBox cannot be represented by a Java int
   */
  public int toSignedInteger() {
    // TODO: Verify that Augment uses a sign-and-magnitude approach for all signed integers in the system.
    if (this._size == 0) {
      return 0;
    }
    if (this._size == 1) {
      return this._bits.get(0) ? 1 : 0;
    }
    final boolean negative = this._bits.get(0);
    long num = toUnsignedInteger(1);
    if (negative) {
      num = num * -1;
    }
    if (num > Integer.MAX_VALUE || num < Integer.MIN_VALUE) {
      throw new AugmentException("num is outside of the Integer range: " + num + ", " + toBinary());
    }
    return (int) num;
  }

  /**
   * Convert a BitBox to an unsigned integer value.
   * <p>Although Augment contains numeric field data which is up to 36 bits in length (which 
   * would allow numbers up to +-2^35 to be stored), the Augment file format doesn't appear to 
   * use all the bits. In fact, there doesn't appear to be any fields which store values larger 
   * than +- 2^30. This is sufficient to store the value in a Java int primitive, so an int is 
   * returned by this method. For more info, see the AugUnsignedNumber class. 
   * <p>A run-time check is done to make sure that every value is within this range. If the value
   * is outside this range, an AugmentException is thrown (and this method would need to be
   * redesigned to allow Java long values).
   * <p>Zero bit numbers return a 0 value. Numbers with one or more bits are evaluated as an unsigned integer. 
   * <p>This assumes Big-Endian storage. BitBox index 0 is the high bit.
   * @see org.nlsaugment.augxml.type.AugUnsignedNumber
   * @return the unsigned integer representation of the BitBox
   * @throws AugmentException if the unsigned integer value of BitBox cannot be represented by a Java int
   */
  public int toUnsignedInteger() {
    long num = toUnsignedInteger(0);
    if (num > Integer.MAX_VALUE) {
      throw new AugmentException("num is outside of the Integer range: " + num + ", " + toBinary());
    }
    return (int) num;    
  }
  
  private long toUnsignedInteger(final int startBit) {
    if (this._size == 0) {
      return 0;
    }
    long num = 0;
    for (int i = startBit; i < this._size - 1; i++) {
      if (this._bits.get(i) && (this._size - i > maxBitsPerAugNumber)) {
        // We need to make sure the number isn't bigger than a long, and 36 bits is big enough.
        // It's only a problem if the upper bits are on though; you can have any number of bits if the
        // bits above 36 bits are all zeros
        throw new AugmentException("BitBox contains too many bits to convert to a signed integer: " + this._size);  
      }
      num += (this._bits.get(i) ? 1 : 0);      
      num = num << 1;
    }
    num += (this._bits.get(this._size - 1) ? 1 : 0);
    return num;    
  }
  
  /**
   * Return a new BitBox from the given number. The numBits specifies the size of the BitBox.
   * The storage used for the BitBox is the sign-and-magnitude approach, in which
   * the most-significant bit (BitBox index 0) is used to store the sign.
   * @param integer the integer used to create the new BitBox
   * @param numBits the number of bits used to create the BitBox
   * @return a new BitBox
   */
  public static BitBox fromSignedInteger(final int integer, final int numBits) {
    return fromInteger(integer, numBits, true);
  }

  /**
   * Return a new BitBox from the given number. The numBits specifies the size of the BitBox.
   * @param integer the integer used to create the new BitBox
   * @param numBits the number of bits used to create the BitBox
   * @return a new BitBox
   */
  public static BitBox fromUnsignedInteger(final int integer, final int numBits) {
    return fromInteger(integer, numBits, false);
  }

  private static BitBox fromInteger(final int integer, final int numBits, final boolean signed) {
    final BitSet bitset = new BitSet(numBits);
    int number = integer;
    if (signed) {
      if (number < 0) {
        bitset.set(0, 1);
        number = Math.abs(number);
      }
    } else {
      if (number < 0) {
        throw new AugmentException("negative number cannot be stored as an unsigned number: " + number);
      }
    }
    int i = numBits - 1;
    while (true) {
      if ((i < 0 && ! signed) || (i < 1 && signed)) {
        if (number != 0) {
          throw new AugmentException("number is too large to store in " + numBits + " bits");
        }
        break;
      }
      if (number % 2 == 1) {
        bitset.set(i, true);
      }
      number = number >> 1;
      i--;
    }
    return new BitBox(bitset, numBits);
  }
  
  /**
   * Return true if the BitBox is equal to 1 and false if it equals 0. The numeric value is 
   * determined by calling toUnsignedInteger(). Note that non-zero values (besides 1) will cause an
   * AugmentException to be thrown (not a return result of true).
   * @see #toUnsignedInteger
   * @return true if BitBox is 1; false if BitBox is 0
   * @throws AugmentException if BitBox does not equal either 0 or 1
   */
  public boolean toBoolean() {
    final long num = toUnsignedInteger();
    if (num != 0 && num != 1) {
      throw new AugmentException("number " + num + " is not of type boolean");
    }
    return num == 1;
  }

  /**
   * Converts a BitBox to a byte[]. 
   * <p>The byte[] is filled by reading bits from BitBox going from BitBox[0] to BitBox[BitBox.getSize()].
   * The byte[] is filled one byte at a time, from highest bit to lowest bit. The byte[] is filled 
   * from bytes[0] to bytes[bytes.length - 1].
   * <p>If the length is not divisible by 8, then
   * the extra bits will be stored in a final byte with the extra bits 0-padded. The extra bits are
   * filled from highest to lowest bit, with the 0-padded bits filling towards the lowest bit.
   * CAUTION: you need to store the length of bits yourself, or you will not be
   * able to correctly convert back from a byte[] to a BitBox without loss in accuracy.
   * @return the bits stored as a byte[]
   */
  public byte[] toBytes() {
    final int byteSize = (int) Math.ceil(1.0 * this._size / bitsPerByte);
    final byte[] bytes = new byte[byteSize];
    for (int i = 0; i < this._size / bitsPerByte; i++) {
      bytes[i] = (byte) get(i * bitsPerByte, (i + 1) * bitsPerByte).toUnsignedInteger();
    }
    if (this._size % bitsPerByte != 0) {
      final int start = (this._size / bitsPerByte);
      final int end = start + (this._size % bitsPerByte);
      bytes[byteSize - 1] = (byte) (get(start, end).toUnsignedInteger() << (bitsPerByte - (end - start)));
    }
    return bytes;
  }

  /**
   * Return a new instance of a BitBox c
   * @param bitbox
   * @return a new BitBox
   */
  public static BitBox fromWriteableBitBox(final WriteableBitBox bitbox) {
    return new BitBox(bitbox.getBitSet(), bitbox.getSize());
  }
  
  /**
   * Factory for BitBox. Creates a new BitBox from an existing byte[]. The BitBox is filled
   * by reading bytes one byte at a time, from highest bit to lowest bit. The byte[] is read 
   * from bytes[0] to bytes[bytes.length - 1].
   * @param bytes the byte[] to use when creating a new BitBox. Any length for the byte[]
   * is allowed (including zero), but if bytes is null, then an NPE is thrown.
   * @return a new BitBox
   * @throws NullPointerException if bytes is null
   */
  public static BitBox fromBytes(final byte[] bytes) {
    return fromBytes(bytes, 0, bytes.length * bitsPerByte);
  }
  
  /**
   * Factory method for BitBox. Creates a new BitBox from an existing byte[], using the range
   * of bits between beginIndex (inclusive) and endIndex (exclusive). The BitBox is filled
   * by reading bytes one byte at a time, from highest bit to lowest bit. The byte[] is read 
   * from bytes[0] to bytes[bytes.length - 1].
   * @param bytes the byte[] to use when creating a new BitBox. Any length for the byte[]
   * is allowed (including zero), but if bytes is null, then an NPE is thrown.
   * @param beginIndex the beginning index, inclusive
   * @param endIndex the ending index, exclusive. In other words,
   * the byte[] will contain bits from beginIndex to (endIndex - 1), and its length will be 
   * (endIndex - beginIndex).
   * @return a new BitBox
   * @throws NullPointerException if bytes is null
   * @throws IndexOutOfBoundsException if (beginIndex < 0)
   * @throws IndexOutOfBoundsException if (endIndex > bytes.length * 8)
   * @throws IndexOutOfBoundsException if (beginIndex > endIndex)
   */
  public static BitBox fromBytes(final byte[] bytes, final int beginIndex, final int endIndex) {
    final int[] nums = new int[] {128, 64, 32, 16, 8, 4, 2, 1};

    if (beginIndex < 0) {
      throw new IndexOutOfBoundsException("beginIndex < 0");
    }
    if (endIndex > bytes.length * bitsPerByte) {
      throw new IndexOutOfBoundsException("endIndex > bytes.length * 8");
    }
    if (beginIndex > endIndex) {
      throw new IndexOutOfBoundsException("beginIndex > endIndex");
    }
    final BitSet bits = new BitSet(endIndex - beginIndex);
    if (bytes.length == 0) {
      return new BitBox(bits, 0);
    }
    int current = (bytes[beginIndex / 8] + 256) % 256;
    for (int i = beginIndex; i < endIndex; i++) {
      if (i % 8 == 0) {
        current = (bytes[i / 8] + 256) % 256;
      }
      final int num = nums[i % 8];
      if ((current & num) == num) {
        bits.set(i - beginIndex);
      }
    }
    return new BitBox(bits, endIndex - beginIndex);
  }  
}
