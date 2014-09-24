/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.Constants.bitsPerPage;
import static org.nlsaugment.augxml.Constants.bitsPerStatementDataBlockHeader;
import static org.nlsaugment.augxml.Constants.charactersPerStatement;
import static org.nlsaugment.augxml.Constants.numFileHeaderBlocks;
import static org.nlsaugment.augxml.Constants.numStructureBlocks;
import static org.nlsaugment.augxml.Constants.numUnusedBlocks;
import static org.nlsaugment.augxml.Constants.wordsPerDataBlockData;
import static org.nlsaugment.augxml.type.AugType.Type.ADDRESS;
import static org.nlsaugment.augxml.type.AugType.Type.BOOLEAN;
import static org.nlsaugment.augxml.type.AugType.Type.DATE;
import static org.nlsaugment.augxml.type.AugType.Type.FIVE_BIT_STRING;
import static org.nlsaugment.augxml.type.AugType.Type.SEVEN_BIT_CHARACTER;
import static org.nlsaugment.augxml.type.AugType.Type.UNSIGNED_NUMBER;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;
import org.nlsaugment.augxml.memory.WriteableMemorySpace;
import org.nlsaugment.augxml.type.Aug5BitString;
import org.nlsaugment.augxml.type.Aug7BitCharacter;
import org.nlsaugment.augxml.type.Aug7BitString;
import org.nlsaugment.augxml.type.AugAddress;
import org.nlsaugment.augxml.type.AugBoolean;
import org.nlsaugment.augxml.type.AugDate;
import org.nlsaugment.augxml.type.AugString;
import org.nlsaugment.augxml.type.AugType;
import org.nlsaugment.augxml.type.AugUnsignedNumber;
import org.nlsaugment.augxml.util.BitBox;
import org.nlsaugment.augxml.util.Field;
import org.nlsaugment.augxml.util.FieldHelper;

import base64.Base64;

/**
 * Each StatementDataBlock (SDB) contains its own StatementDataBlockHeader. It stores fields
 * such as if the SDB is in use, the number of characters in the statement, and the number of
 * Words the entire SDB uses. 
 * @author Jonathan Cheyer
 *
 */
public final class StatementDataBlockHeader extends ModelObject {

  public enum Record {
    sgarb, slength, schars, slnmdl, srnmdl, unused1, // word 1
    spsid, sname, unused2,                           // word 2
    stime,                                           // word 3
    sinit, sptype,                                   // word 4
    spsdb, sitpsid                                   // word 5
  }

  private static final Field[] __fields = new Field[] {
    
    // word 1
    
    // true (nonzero) if this SDB is garbage; i.e., no longer used
    new Field(Record.sgarb,   1, BOOLEAN),  
    // number of words in this SDB
    new Field(Record.slength,   9, UNSIGNED_NUMBER),    
    // number of characters in this statement
    new Field(Record.schars,  11, UNSIGNED_NUMBER),    
    // left name delimiter for statement
    new Field(Record.slnmdl,  7, SEVEN_BIT_CHARACTER),    
    // right name delimiter for statement
    new Field(Record.srnmdl,  7, SEVEN_BIT_CHARACTER),   
    // unused bits that add up to a word boundary
    // TODO: why is this not empty?
    new Field(Record.unused1,  1, UNSIGNED_NUMBER),
    
    // word 2
    
    // PSID of the statement for this SDB
    new Field(Record.spsid,  18, ADDRESS),    
    // position of character after name
    new Field(Record.sname,  11, UNSIGNED_NUMBER),
    // unused bits that add up to a word boundary
    // TODO: why is this not empty?
    new Field(Record.unused2,  7, UNSIGNED_NUMBER),
    
    // word 3
    
    // date and time when this SDB was created
    new Field(Record.stime,  36, DATE),
    
    // word 4

    // initials of user who created this SDB
    // 5 bit string by default, but can also be a 7 bit string
    // see getCreationUser() method for details
    new Field(Record.sinit,  21, FIVE_BIT_STRING),        
    // property type of this data block
    new Field(Record.sptype,  15, UNSIGNED_NUMBER),
    
    //  word 5

    // PSDB of the next property data block; 0 = tail
    new Field(Record.spsdb,  18, ADDRESS),    
    // PSID to head of inferior tree, if any
    new Field(Record.sitpsid,  18, ADDRESS)
  };
  private static final FieldHelper __helper = new FieldHelper(__fields);

  public enum PropertyType {
    /*
    TODO: Verify the values of these types with the corresponding ones in L10
          Where did these values come from?    

    txttyp (0),  // text data block (SDB)
    dhdtyp (1),  // diagram header block
    segtyp (2);  // segment data block
    */

    // These values are from DEV:<BESRC>BCONST.AUG
    txttyp (0),  // text data block
    gtftyp (1),  // graphics text format data block
    lwtyp  (2),  // line work data block
    chtyp  (3),  // cell header data block
    dhtyp  (4),  // diagram header data block

    /*
    The properties reserved for such experimental user applications are 040000-077777 (octal) 
    (16384-32767 decimal).
     */

    // These values are from DEV:<BESRC>SIGNATURES.AUG   
    sigtyp (040100),  // the property that delimits the tail of a signed structure
    sghtyp (040101),  // the property that delimits the head of a signed structure
    crytyp (040102),  // 
    pktyp  (040103),  // data block containing a public key
    pvtyp  (040104);  // data block containing a private key
        
    private final int _value;
    private static final HashMap<Integer, PropertyType> __map = initMap();
    
    PropertyType(final int value) {   
      this._value = value;
    }
      
    private static HashMap<Integer, PropertyType> initMap() {
      final HashMap<Integer, PropertyType> map = new HashMap<Integer, PropertyType>();
      final EnumSet<PropertyType> set = EnumSet.allOf(PropertyType.class);
      for (PropertyType element : set) {
        map.put(element._value, element);
      }
      return map;
    }
    
    public int getValue() {
      return this._value;
    }
    
    public static PropertyType valueOf(final int value) {
      final PropertyType result = __map.get(value);
      if (result == null) {
         throw new AugmentException("invalid value for PropertyType: " + value);
      }
      return result;
    }
  }

  public StatementDataBlockHeader(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(__fields, memorySpace, location, numBits);
    check();
  }
    
  private void check() {
    if (getNumBits() != bitsPerStatementDataBlockHeader) {
      throw new AugmentException("data block header is wrong size: " + getNumBits());
    }
    if (getNumberOfWords().getValue() > wordsPerDataBlockData) {
      throw new AugmentException("invalid slength: " + getNumberOfWords().getValue());
    }
    if (! getGarbageFlag().getValue() && getNumberOfCharacters().getValue() > charactersPerStatement) {
      throw new AugmentException("invalid schars: " + getNumberOfCharacters().getValue());
    }    
  }
  
  public Location getPsdb() {
    return getLocation().newLocation(-1 * (numFileHeaderBlocks + numUnusedBlocks + numStructureBlocks) * bitsPerPage);
  }
  

  /**
   * Return the entire StatementDataBlockHeader as a Base64-encoded String.
   * This method is meant to be used if getGarbageFlag() is true.
   * @return the StatementDataBlockHeader as a Base64-encoded String
   */
  public String getBase64Data() {
    final byte[] bytes = getBits().toBytes();
    return Base64.encodeBytes(bytes);
  }
  
  private AugType get(final Enum fieldName) {
    return __helper.get(this, fieldName);
  }

  public AugBoolean getGarbageFlag() {
    return (AugBoolean) get(Record.sgarb);
  }
  
  public AugUnsignedNumber getNumberOfWords() {
    return (AugUnsignedNumber) get(Record.slength);
  }
  
  public AugUnsignedNumber getNumberOfCharacters() {
    return (AugUnsignedNumber) get(Record.schars);
  }
  
  public Aug7BitCharacter getLeftDelimiter() {
    return (Aug7BitCharacter) get(Record.slnmdl);    
  }
  
  public Aug7BitCharacter getRightDelimiter() {
    return (Aug7BitCharacter) get(Record.srnmdl);
  }
  
  public AugAddress getStatementPsid() {
    return (AugAddress) get(Record.spsid);
  }
  
  public AugUnsignedNumber getPositionAfterStatementName() {
    return (AugUnsignedNumber) get(Record.sname);
  }
  
  public AugDate getCreationDate() {
    return (AugDate) get(Record.stime);
  }
  
  /**
   * Get the initials of the person who created this statement. This method returns either
   * an Aug5BitString or an Aug7BitString, depending on the particular instance of 
   * StatementDataBlockHeader. In particular, if the sinit field has bit 21 enabled
   * <code>(sinit & 04000000 == 04000000)</code>, then an Aug7BitString is returned. 
   * Otherwise, an Aug5BitString is returned. The reason there are two separate mechanisms 
   * for storing initials is historical. From inspecting files that contain both styles within
   * the same file (depending on the creation date of the particular StatementDataBlockHeader), 
   * it appears that Aug7BitString ("old style init") occurred for statements up until August 1971.
   * The Aug5BitString occurred for statements after September 1971.  
   * <p>Getting initials are only valid when the getGarbageFlag() is false.
   * <p>See <besrc,filmnp,> (getint) function for details.
   * @return the initials of the person who created this statement (as an AugString)
   */
  public AugString getCreationUser() {
    if (getGarbageFlag().getValue()) {
      throw new AugmentException("getCreationUser() is invalid when garbage flag is set");
    }
    final AugUnsignedNumber num = new AugUnsignedNumber(getMemorySpace(), get(Record.sinit).getLocation(), 21);
    if ((num.getValue() & 04000000) == 04000000) {
      return new Aug7BitString(getMemorySpace(), get(Record.sinit).getLocation(), 21);
    }
    return new Aug5BitString(getMemorySpace(), get(Record.sinit).getLocation().newLocation(1), 20);
  }
  
  /**
   * Returns "5-bit" if the finit field is stored as a 5-bit String, and "7-bit" otherwise. 
   * @return "5-bit" or "7-bit". You can also called getCreationUser() to return an AugString object,
   * and then check if the (object instanceof Aug5BitString) or (object instanceof Aug7BitString).
   * @see #getCreationUser()
   */
  public String getCreationUserType() {
    final AugString sinit = getCreationUser();
    if (sinit instanceof Aug5BitString) {
      return "5-bit";
    } else if (sinit instanceof Aug7BitString) {
      return "7-bit";
    } else {
      throw new AugmentException("error! unexpected type: " + sinit.getClass().getName());
    }
  }

  public long getPropertyType() {
    // TODO: for now, returning a long instead of PropertyType enum.
    // There are too many different property types, because there can be user-defined ones.
    // Need to re-think the enum strategy.
    final long type = ((AugUnsignedNumber) get(Record.sptype)).getValue();
    return type;
//      return PropertyType.valueOf((int) type);
  }
  
  public AugAddress getNextDataBlock() {
    return (AugAddress) get(Record.spsdb);
  }
  
  public AugAddress getInferiorTree() {
    return (AugAddress) get(Record.sitpsid);
  }
  
  private static void put(final WriteableMemorySpace wms, final Location location, final Enum fieldName, final String value) {
    __helper.put(wms, location, fieldName, value);
  }

  private static void put(final WriteableMemorySpace wms, final Location location, final Enum fieldName, final String value, AugType.Type type) {
    __helper.put(wms, location, fieldName, value, type);
  }

  public static void update(final WriteableMemorySpace wms, final Location location, final Map<String, String> attributes) {
    if (attributes.containsKey("sdbhBase64")) {      
      final int numBits = Integer.parseInt(attributes.get("sdbhBitSize"));
      wms.setBits(location, BitBox.fromBytes(Base64.decode(attributes.get("sdbhBase64")), 0, numBits));
    } else {
      put(wms, location, Record.sgarb, attributes.get(Record.sgarb.name()));
      put(wms, location, Record.slength, attributes.get(Record.slength.name()));
      put(wms, location, Record.schars, attributes.get(Record.schars.name()));
      put(wms, location, Record.slnmdl, attributes.get(Record.slnmdl.name()));
      put(wms, location, Record.srnmdl, attributes.get(Record.srnmdl.name()));
      put(wms, location, Record.spsid, attributes.get(Record.spsid.name()));
      put(wms, location, Record.sname, attributes.get(Record.sname.name()));
      put(wms, location, Record.stime, attributes.get(Record.stime.name()));
      
      // TODO: fix this. This attribute is specific to LosslessFileWriter
      if ("5-bit".equals(attributes.get("sinitType"))) {     
        put(wms, location, Record.sinit, attributes.get(Record.sinit.name()), AugType.Type.FIVE_BIT_STRING);
      } else if ("7-bit".equals(attributes.get("sinitType"))) {      
        put(wms, location, Record.sinit, attributes.get(Record.sinit.name()), AugType.Type.SEVEN_BIT_STRING);
      } else {
        throw new AugmentException("invalid or missing sinitType: " + attributes.get("sinitType"));
      }
      put(wms, location, Record.sptype, attributes.get(Record.sptype.name()));
      put(wms, location, Record.spsdb, attributes.get(Record.spsdb.name()));
      put(wms, location, Record.sitpsid, attributes.get(Record.sitpsid.name()));
    }
  }
}
