/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.util;

import static org.nlsaugment.augxml.Constants.bitsPerWord;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Stack;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.exception.UnusedFieldException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;
import org.nlsaugment.augxml.memory.WriteableMemorySpace;
import org.nlsaugment.augxml.model.ModelObject;
import org.nlsaugment.augxml.type.AugType;
import base64.Base64;

/**
 * Used to help locate specific locations for each Field. For more info, see Field.
 * There should be one FieldHelper instance per class in the org.nlsaugment.augxml.model package.
 * @author Jonathan Cheyer
 *
 */
public final class FieldHelper {
  private final Field[] _fields;
  private final HashMap<Enum, Field> _map;
  
  public FieldHelper(final Field[] fields) {
    this._fields = reorder(fields);
    this._map = initMap();
  }
  
  public AugType get(final ModelObject modelObject, final Enum fieldName) {
    // TODO: this is used for validity checking but is slow; can this be fixed?
    check(modelObject);
    
    return get(modelObject, this._map.get(fieldName));
  }

  public Location getFieldLocation(final Enum fieldName, final Location objectLocation) {
    final Field field = this._map.get(fieldName);
    return objectLocation.newLocation(field.getBitOffset());    
  }

  public void put(final WriteableMemorySpace wms, Location location, final Enum fieldName, String value) {
    final Field field = this._map.get(fieldName);
    final AugType.Type type = field.getType();
    put(wms, location, fieldName, value, type);
  }

  public void put(final WriteableMemorySpace wms, Location location, final Enum fieldName, String value, final int numBits) {
    final Field field = this._map.get(fieldName);
    final AugType.Type type = field.getType();
    put(wms, location, fieldName, value, type, numBits);    
  }
  
  public void put(final WriteableMemorySpace wms, Location location, final Enum fieldName, String value, final AugType.Type type) {
    final Field field = this._map.get(fieldName);
    final int numBits = field.getNumBits();
    put(wms, location, fieldName, value, type, numBits);
  }
  
  public void put(final WriteableMemorySpace wms, Location location, final Enum fieldName, String value, final AugType.Type type, final int numBits) {
    final Field field = this._map.get(fieldName);
    final Location fieldLocation = location.newLocation(field.getBitOffset());  
    if (type.equals(AugType.Type.UNSIGNED_NUMBER)) {
      final BitBox bitbox = BitBox.fromUnsignedInteger(Integer.parseInt(value), numBits);
      wms.setBits(fieldLocation, bitbox);
    } else if (type.equals(AugType.Type.SIGNED_NUMBER)) {
      final BitBox bitbox = BitBox.fromSignedInteger(Integer.parseInt(value), numBits);
      wms.setBits(fieldLocation, bitbox);
    } else if (type.equals(AugType.Type.PAGE_INDEX)) {
      final BitBox bitbox = BitBox.fromUnsignedInteger(Integer.parseInt(value), numBits);
      wms.setBits(fieldLocation, bitbox);
    } else if (type.equals(AugType.Type.FIVE_BIT_STRING)) {
      // TODO: fix this hack. Shouldn't have to look for FileHeaderBlock.finit explicitly in this class
      if (numBits == 36 && "finit".equals(fieldName.toString())) {
        // left-most 15 bits are empty in FileHeaderBlock.finit
        final WriteableBitBox wbb = new WriteableBitBox(36);
        final BitBox bitbox = BitBox.pack5BitText(value, 20);
        // skip 15 bits plus extra bit used to determine if type is 5-bit or 7-bit
        wbb.set(16, bitbox);
        wms.setBits(fieldLocation, wbb.toBitBox());
      } else if (numBits == 21 && "sinit".equals(fieldName.toString())) {
        final WriteableBitBox wbb = new WriteableBitBox(21);
        final BitBox bitbox = BitBox.pack5BitText(value, 20);
        wbb.set(1, bitbox);
        wms.setBits(fieldLocation, wbb.toBitBox());
      } else {
        throw new AugmentException("unexpected FIVE_BIT_STRING: " + fieldName.toString());
      }
    } else if (type.equals(AugType.Type.SEVEN_BIT_STRING)) {
      // TODO: fix this hack. Shouldn't have to look for FileHeaderBlock.finit explicitly in this class
      if (numBits == 36 && "finit".equals(fieldName.toString())) {
        // left-most 15 bits are empty in FileHeaderBlock.finit
        final WriteableBitBox wbb = new WriteableBitBox(36);
        final BitBox bitbox = BitBox.pack7BitText(value, 21);
        // skip 15 bits
        wbb.set(15, bitbox);
        wms.setBits(fieldLocation, wbb.toBitBox());
      } else if (numBits == 21 && "sinit".equals(fieldName.toString())) {
        final WriteableBitBox wbb = new WriteableBitBox(21);
        final BitBox bitbox = BitBox.pack7BitText(value, 21);
        wbb.set(0, bitbox);
        wms.setBits(fieldLocation, wbb.toBitBox());        
      } else {        
        if (value.length() > 2000) {  // TODO: is this the max allowed characters per statement in Augment?
          // TODO: this catches buffer overflow problems, may need more investigation
          throw new AugmentException("too many characters: " + value.length()); 
        }
        System.out.println("packing 7-bit string " + fieldName + ", value='" + value + "', length=" + value.length());
        final BitBox bitbox = BitBox.pack7BitText(value, numBits);
        wms.setBits(fieldLocation, bitbox);
      }
    } else if (type.equals(AugType.Type.SEVEN_BIT_CHARACTER)) {
      if (numBits == 7) {
        final BitBox bitbox = BitBox.pack7BitText(value, numBits);
        wms.setBits(fieldLocation, bitbox);
      } else if (numBits == 36) {
        final BitBox bitbox = BitBox.pack7BitText(value, 7);
        final WriteableBitBox wbb = new WriteableBitBox(36);        
        wbb.set(29, bitbox);
        wms.setBits(fieldLocation, wbb.toBitBox());        
      } else {
        throw new AugmentException("invalid number of bits: " + numBits);
      }
    } else if (type.equals(AugType.Type.DATE)) {
      final BitBox bitbox = TenexDate.fromString(value).getBits();
      wms.setBits(fieldLocation, bitbox);
    } else if (type.equals(AugType.Type.BOOLEAN)) {
      if (! "true".equals(value) && ! "false".equals(value)) {
        throw new AugmentException("invalid boolean value: " + value);
      }
      final int val = Boolean.parseBoolean(value) ? 1 : 0;
      final BitBox bitbox = BitBox.fromUnsignedInteger(val, numBits);
      wms.setBits(fieldLocation, bitbox);
    } else if (type.equals(AugType.Type.ADDRESS)) {
      // TODO: refactor this code
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
      final int blockIndex = Integer.parseInt(nums[0].trim());
      final int wordIndex = Integer.parseInt(nums[1].trim());
      final BitBox bbBlock = BitBox.fromUnsignedInteger(blockIndex, 9);
      final BitBox bbWord = BitBox.fromUnsignedInteger(wordIndex, 9);
      final WriteableBitBox wbb = new WriteableBitBox(18);
      wbb.set(0, bbBlock);
      wbb.set(9, bbWord);
      wms.setBits(fieldLocation, wbb.toBitBox());
    } else if (type.equals(AugType.Type.OBJECT)) {
      final byte[] bytes = Base64.decode(value);
      wms.setBits(fieldLocation, BitBox.fromBytes(bytes));
    } else {
      // nothing to do
    }
    // TODO - finish this method
  }
  
  private AugType get(final ModelObject modelObject, final Field field) {
    final MemorySpace ms = modelObject.getMemorySpace();
    final Location location = modelObject.getLocation();
    final Location fieldLocation = location.newLocation(field.getBitOffset());
    final int numBits = field.getNumBits();
    try {
      return AugType.newInstance(field.getType(), ms, fieldLocation, numBits);
    } catch (UnusedFieldException e) {
      throw new UnusedFieldException("field " + field.getEnum() + " is not empty", e);
    } catch (AugmentException e) {
      throw new AugmentException("unable to get field: " + field.getEnum(), e);
    }
  }
  
  private void check(final ModelObject modelObject) {
    int sum = 0;
    for (int i = 0; i < this._fields.length; i++) {
      // make sure that every field can be read using the get() method
      // some fields have their own check() that we want to make sure gets called early
      // for example, UNUSED fields must have isEmpty() for their bits or they will fail
      get(modelObject, this._fields[i]);      
      sum += this._fields[i].getNumBits();
    }
    if (sum % bitsPerWord != 0) {    
      throw new AugmentException("fields do not fit into a whole number of words");
    }
  }
  
  private HashMap<Enum, Field> initMap() {
    final HashMap<Enum, Field> map = new HashMap<Enum, Field>();
    for (int i = 0; i < this._fields.length; i++) {
      map.put(this._fields[i].getEnum(), this._fields[i]);
    }
    return map;
  }
  
  /**
   * Reorder the list of fields, based on the L10 language rules:
   *   <li>fields are stored from right-to-left within a given word</li>
   *   <li>fields are stored from left-to-right across words</li>
   * @param fields
   * @return a list of fields, stored as a Field[]
   */
  private Field[] reorder(final Field[] fields) {
    // TODO: this method doesn't work for fields which are non-whole number of words
    // especially if it is less than a single word. In that case, fields are pushed but
    // never popped, and this method returns null instead of a valid field[]. That will
    // cause a NPE in the initMap() method. Fix this.
    final ArrayList<Field> list = new ArrayList<Field>(fields.length);
    final Stack<Field> tmp = new Stack<Field>();
    int count = 0;
    int total = 0;
    for (int i = 0; i < fields.length; i++) {
      tmp.push(fields[i]);
      count += fields[i].getNumBits();
      if (count < bitsPerWord) {
        continue;
      } else if (count > bitsPerWord && count % bitsPerWord != 0) {
        // multiple words are ok as long as they are whole words
        throw new AugmentException("field went over word boundary: " + fields[i].getEnum());
      } else {
        while (! tmp.isEmpty()) {          
          final Field field = tmp.pop();
          field.setBitOffset(total);
          total += field.getNumBits();
          list.add(field);
          count = 0;
        }
      }      
    }
    return list.toArray(new Field[fields.length]);
  }
}
