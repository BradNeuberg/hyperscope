/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.type;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemoryObject;
import org.nlsaugment.augxml.memory.MemorySpace;

/**
 * An AugType represents a "primitive" data type for an Augment file. It includes types such as
 * 5BitStrings, 7BitStrings, Booleans, and Dates. Like all MemoryObjects, each instance of an AugType
 * has a specific Location in the MemorySpace. Each of the specific ModelObjects will have a field[]
 * in which each field has a name, number of bits, and a AugType. In addition to the primitive types,
 * a field may also use an AugObject to represent a reference to another ModelObject.
 * @author Jonathan Cheyer
 *
 */
public abstract class AugType extends MemoryObject {
  public enum Type {
    FIVE_BIT_STRING,
    SEVEN_BIT_STRING,
    SEVEN_BIT_CHARACTER,
    DATE,
    UNSIGNED_NUMBER,
    SIGNED_NUMBER,
    BOOLEAN,
    PAGE_INDEX,
    ADDRESS,
    OBJECT,  // an object that extends ModelObject
    UNUSED;
  }
  
  protected AugType(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
  }
  
  public static AugType newInstance(AugType.Type type, final MemorySpace memorySpace, final Location location, final int numBits) {
    if (Type.FIVE_BIT_STRING == type) {
      return new Aug5BitString(memorySpace, location, numBits);
    } else if (Type.SEVEN_BIT_STRING == type) {
      return new Aug7BitString(memorySpace, location, numBits);
    } else if (Type.SEVEN_BIT_CHARACTER == type) {
      return new Aug7BitCharacter(memorySpace, location, numBits);      
    } else if (Type.DATE == type) {
      return new AugDate(memorySpace, location, numBits);
    } else if (Type.UNSIGNED_NUMBER == type) {
      return new AugUnsignedNumber(memorySpace, location, numBits);
    } else if (Type.SIGNED_NUMBER == type) {
      return new AugSignedNumber(memorySpace, location, numBits);
    } else if (Type.BOOLEAN == type) {
      return new AugBoolean(memorySpace, location, numBits);
    } else if (Type.PAGE_INDEX == type) {
      return new AugBlockIndex(memorySpace, location, numBits);
    } else if (Type.ADDRESS == type) {
      return new AugAddress(memorySpace, location, numBits);
    } else if (Type.OBJECT == type) {
      return new AugObject(memorySpace, location, numBits);
    } else if (Type.UNUSED == type) {
      return new AugUnused(memorySpace, location, numBits);
    } else {
      throw new AugmentException("invalid type: " + type.getClass().getName());
    }
  }

  @Override
  public abstract String toString();
  
  public abstract Object getValue();
}
