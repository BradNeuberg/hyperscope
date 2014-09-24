/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.Constants.bitsPerBlockHeader;
import static org.nlsaugment.augxml.Constants.bitsPerRingElement;
import static org.nlsaugment.augxml.Constants.bitsPerWord;
import static org.nlsaugment.augxml.Constants.ringElementsPerStructureBlock;
import static org.nlsaugment.augxml.Constants.wordsPerRingElement;
import static org.nlsaugment.augxml.type.AugType.Type.OBJECT;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.Page;
import org.nlsaugment.augxml.type.AugType;
import org.nlsaugment.augxml.util.Field;
import org.nlsaugment.augxml.util.FieldHelper;


/**
 * A Structure Block is also known as a Ring Block. It is effectively a table of Ring Elements.
 * It contains exactly 102 Ring Elements.
 * @author Jonathan Cheyer
 *
 */
public final class StructureBlock extends Block {
  private final RingElement[] _ringElements;

  public enum Record {blockHeader, ring}  
  private static final Field[] __fields = new Field[] {              
    new Field(Record.blockHeader, bitsPerBlockHeader, OBJECT), // see BlockHeader class
    
    //  102 individual ring elements
    new Field(Record.ring, ringElementsPerStructureBlock * wordsPerRingElement * bitsPerWord, OBJECT)
  };
  private static final FieldHelper __helper = new FieldHelper(__fields);
      
  public StructureBlock(final Page page, final int recordNumber) {
    super(__fields, page, recordNumber);
    if (isEmpty()) {
      this._ringElements = null;
    } else {
      check();
      this._ringElements = new RingElement[ringElementsPerStructureBlock];
      for (int i = 0; i < ringElementsPerStructureBlock; i++) {
        final Location location = get(Record.ring).getLocation();
        final Location newLocation = location.newLocation(i * bitsPerRingElement);
        this._ringElements[i] = new RingElement(getMemorySpace(), newLocation, bitsPerRingElement, i);
      }
    }
  }
   
  private AugType get(final Enum fieldName) {
    return __helper.get(this, fieldName);
  }

  private void check() {
    if (getBlockHeader().getType() != BlockHeader.BlockType.rngtyp) {
      throw new AugmentException("block header should be of type rngtyp but is: " + getBlockHeader().getType());
    }
  }
  
  public RingElement[] getRingElements() {
    return this._ringElements;
  }
  
  public static Location getFieldLocation(final Enum field, final Location objectLocation) {
    return __helper.getFieldLocation(field, objectLocation);
  }
}
