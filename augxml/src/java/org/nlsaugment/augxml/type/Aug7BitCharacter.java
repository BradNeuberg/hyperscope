/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.type;

import static org.nlsaugment.augxml.Constants.NUL;
import static org.nlsaugment.augxml.Constants.bitsPerWord;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;

/**
 * This represents an instance of a single 7-bit character in the MemorySpace. Augment has two
 * approaches for physically storing the Aug7BitCharacter. 
 * <p>The first approach is to allocate exactly 7 bits for the storage. This is done in the
 * StatementDataBlockHeader in the slnmdl and srnmdl fields. 
 * <p>The second approach is to allocate 1 word (36 bits) of storage. In this case, the
 * 7-bit character is stored in the lowest 7 bits of the word, not in the highest 7 bits of the word
 * as it would do with an Aug7BitString. This approach is used in the FileHeaderBlock in the
 * namdl1 and namdl2 fields. The highest 29 bits should be empty (zero bits).
 * @author Jonathan Cheyer
 */
public final class Aug7BitCharacter extends AugType {
  public Aug7BitCharacter(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
    check();
  }

  private void check() {
    if (super.getNumBits() != 7 && super.getNumBits() != bitsPerWord) {
      throw new AugmentException("invalid number of bits: " + super.getNumBits());
    }
    if (super.getNumBits() == bitsPerWord) {
      if (! super.getBits().get(0, 29).isEmpty()) {
        throw new AugmentException("highest 29 bits at location " + super.getLocation() + " for bits " + super.getNumBits() + " should be empty but is: " + super.getBits().toBinary());
      }
    }
  }
  
  /**
   * Return the value of the Aug7BitCharacter, as a String. Although Augment
   * allows the character to be NUL (ASCII 0), this method will return an empty
   * String since NUL is not displayable. If you want the NUL character, use
   * the getValue() method instead.
   * @see #getValue()
   */
  @Override
  public String toString() {
    if (super.getNumBits() == 7) {
      return getBits().unpack7BitText();
    } // else getNumBits() == 36, and the useful bits are in the lowest 7 bits
    return getBits().get(29, 36).unpack7BitText();
  }

  /**
   * Return the value of the Aug7BitCharacter, as a java.lang.Character.
   * Augment allows the character to be NUL (ASCII 0), and this method will return
   * NUL. If you want only displable values, use the toString() method instead.
   * @see #toString()
   */
  @Override
  public Character getValue() {
    final String s = toString();
    if ("".equals(s)) {
      return NUL;
    }
    return toString().charAt(0);
  }
}
