/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.Constants.augmentVersion;
import static org.nlsaugment.augxml.Constants.bitsPerBlockHeader;
import static org.nlsaugment.augxml.Constants.bitsPerBlockStatusRecord;
import static org.nlsaugment.augxml.Constants.bitsPerMarkerRecord;
import static org.nlsaugment.augxml.Constants.bitsPerWord;
import static org.nlsaugment.augxml.Constants.markerTableMaximumLength;
import static org.nlsaugment.augxml.type.AugType.Type.DATE;
import static org.nlsaugment.augxml.type.AugType.Type.FIVE_BIT_STRING;
import static org.nlsaugment.augxml.type.AugType.Type.OBJECT;
import static org.nlsaugment.augxml.type.AugType.Type.SEVEN_BIT_CHARACTER;
import static org.nlsaugment.augxml.type.AugType.Type.SIGNED_NUMBER;
import static org.nlsaugment.augxml.type.AugType.Type.UNSIGNED_NUMBER;
import static org.nlsaugment.augxml.type.AugType.Type.UNUSED;

import java.util.Map;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.Page;
import org.nlsaugment.augxml.memory.WriteableMemorySpace;
import org.nlsaugment.augxml.type.Aug5BitString;
import org.nlsaugment.augxml.type.Aug7BitCharacter;
import org.nlsaugment.augxml.type.Aug7BitString;
import org.nlsaugment.augxml.type.AugDate;
import org.nlsaugment.augxml.type.AugObject;
import org.nlsaugment.augxml.type.AugSignedNumber;
import org.nlsaugment.augxml.type.AugString;
import org.nlsaugment.augxml.type.AugType;
import org.nlsaugment.augxml.type.AugUnsignedNumber;
import org.nlsaugment.augxml.type.AugUnused;
import org.nlsaugment.augxml.util.Field;
import org.nlsaugment.augxml.util.FieldHelper;

/**
 * The first Block in a file is the FileHeaderBlock. It contains a number of fields about
 * the Augment file.
 * @author Jonathan Cheyer
 *
 */
public final class FileHeaderBlock extends Block {
    
  public enum Record {blockHeader, 
    filhed, fcredt, nlsvwd, sidcnt, finit, funo, lwtim, namdl1,
    namdl2, rngl, dtbl, rfbs, rngst, dtbst, mkrtxn, mkrtbl, mkrtb, filhde}
  
  private static final Field[] __fields = new Field[] {               
    new Field(Record.blockHeader, bitsPerBlockHeader, OBJECT), // see BlockHeader class
    
    // original info found in DEV:<BESRC>BDATA.AUG 
    // these extra words may be taken for additions to header
    // except that default directory for links uses it if the 
    // directory name is less than 20 chars (See csetlindf).  
    // ----------------
    // Bill Barns response to Jonathan Cheyer's question about filhed
    // current semantics for filhed is: "default directory for links"
    // stored as Augment-style STRUCTURE:DIRECTORY (maps to STRUCTURE:<DIRECTORY> in TOPS-20).
    // word 1, bits 0-18  <-- maximum length in characters of text (constant = "20")
    // word 1, bits 18-36 <-- actual length in characters of text
    // words 2-5, 7-bit packed text
    // email - http://blueoxen.net/c/hyperscope/forums/dev/2006-05/msg00086.html#nid02    
    new Field(Record.filhed, 5 * bitsPerWord, OBJECT),
    
    new Field(Record.fcredt, 1 * bitsPerWord, DATE),     // file creation date--TENEX gtad JSYS internal format
    
    // effectively a constant: always "1" in almost all known Augment files
    // a very small number of files (13 = ~ 0.2%) have their version set to 0 instead of 1
    // Unsure if this was intended or was a bug
    // TODO: research this
    new Field(Record.nlsvwd, 1 * bitsPerWord, UNSIGNED_NUMBER),     // nls version word; changed when NLS file structure changes
    
    // An SID (statement identifier) should not be confused with
    // PSIDs (see below).  The SID is uniquely generated for each
    // statement in a file and is not reused if a statement is
    // deleted; it is unchanged if a statement is moved.  It may be
    // used by a user for accessing particular statements in a file
    // without worrying about changes because of additions or
    // deletions (as is the case with statement numbers).  The
    // sidcnt field in the header is increased by one as statements
    // are created.  The value is stored in the RSID field of the
    // ring element (see description below).
    //
    // Although this field has enough room for 2^36 values, the real maximum for SIDs is determined
    // by the size of the RingElement.rsid field, which only has enough room for 2^30 values.
    new Field(Record.sidcnt, 1 * bitsPerWord, UNSIGNED_NUMBER),     // count for generating SIDs
    
    // initials of user who made the last write (by updating or
    // outputting the file)--see DATA BLOCK description below for
    // explanation of initials.
    // 5 bit string by default, but can also be a 7 bit string
    // see getLastModUser() method for details
    new Field(Record.finit, 1 * bitsPerWord, FIVE_BIT_STRING),     // initials of user who made the last write
    
    // user number (file owner)
    // if <0, RH is pointer to string in fileheader
    // see DEV/BESRC/BDATA.AUG
    // TODO: can this field ever be larger than 2^30?
    new Field(Record.funo, 1 * bitsPerWord, SIGNED_NUMBER),
    
    new Field(Record.lwtim, 1 * bitsPerWord, DATE),      // last write time--TENEX internal JSYS gtad format
    new Field(Record.namdl1, 1 * bitsPerWord, SEVEN_BIT_CHARACTER),     // left name delimiter default character
    new Field(Record.namdl2, 1 * bitsPerWord, SEVEN_BIT_CHARACTER),     // right name delimiter default character
    
    // should never be larger than 102
    new Field(Record.rngl, 1 * bitsPerWord, UNSIGNED_NUMBER),       // upper bound on ring (structure) file blocks used
    
    // should never be larger than 370
    new Field(Record.dtbl, 1 * bitsPerWord, UNSIGNED_NUMBER),       // upper bound on data file blocks used
    new Field(Record.rfbs, 6 * bitsPerWord, UNUSED),       // start of random file block status tables (see description below)
    new Field(Record.rngst, 95 * bitsPerBlockStatusRecord, OBJECT),      // ring block status table
    new Field(Record.dtbst, 370 * bitsPerBlockStatusRecord, OBJECT),    // data block status table
    
    new Field(Record.mkrtxn, 1 * bitsPerWord, UNSIGNED_NUMBER),     // marker table maximum length. CONST = 20
    new Field(Record.mkrtbl, 1 * bitsPerWord, UNSIGNED_NUMBER),     // marker table current length
    new Field(Record.mkrtb, 20 * bitsPerMarkerRecord, OBJECT),     // marker table
    
    // TODO: figure out what is supposed to go in this field
    new Field(Record.filhde, 2 * bitsPerWord, UNSIGNED_NUMBER)
    //new Field(Record.filhde, 2 * bitsPerWord, UNUSED)     // end of the file header; not used
  };
  private static final FieldHelper __helper = new FieldHelper(__fields);
    
  private final RingBlockStatusTable _ringBlockStatusTable;
  private final DataBlockStatusTable _dataBlockStatusTable;
  private final MarkerTable _markerTable;
  
  FileHeaderBlock(final Page page, final int recordNumber) {
    super(__fields, page, recordNumber);
    if (isEmpty()) {
      this._ringBlockStatusTable = null;
      this._dataBlockStatusTable = null;
      this._markerTable = null;
    } else {
      this._ringBlockStatusTable = new RingBlockStatusTable((AugObject) get(Record.rngst));
      this._dataBlockStatusTable = new DataBlockStatusTable((AugObject) get(Record.dtbst));
      this._markerTable = new MarkerTable((AugObject) get(Record.mkrtb), getMarkerTableLength().getValue());
      check();
    }
  }
   
  private AugType get(final Enum fieldName) {
    return __helper.get(this, fieldName);
  }

  private void check() {
    if (getBlockHeader().getType() != BlockHeader.BlockType.hdtyp) {
      throw new AugmentException("block header should be of type hdtyp but is: " + getBlockHeader().getType());
    }
    
    //  TODO: is 0 a valid version number?
    // see field definition of Record.nlsvwd for more info
    if ((getAugmentVersion().getValue() != augmentVersion) &&
        (getAugmentVersion().getValue() != 0)) {
      throw new AugmentException("augment version is a constant, should be " + augmentVersion + ", but is: " + getAugmentVersion().getValue());
    }
    if (getMaxMarkerTableLength().getValue() != markerTableMaximumLength) {
      throw new AugmentException("marker table maximum length is a constant, should be " + markerTableMaximumLength + ", but is: " + getMaxMarkerTableLength().getValue());
    }
    if (getFileOwner().getValue() != -2) {
      throw new AugmentException("current implementation expects funo to equal -2 but it is: " + getFileOwner().getValue());  
    }
    if (getFilhedActualLength().getValue() > 20) {
      throw new AugmentException("current implementation expects filhed actual length to be between 0 to 20 but is: " + getFilhedActualLength().getValue()); 
    }
  }
  
  /**
   * Return the contents of the filhed field. This field was adapted once Augment
   * was used on TOPS-20. The semantics are "default directory for links".
   * @return the filhed field, as an AugObject.
   */
  public AugObject getFilhed() {
    return (AugObject) get(Record.filhed);
  }

  /**
   * Return the value of the maximum length of the text stored in the filhed field.
   * This is a constant and should always be 20.
   */
  public AugUnsignedNumber getFilhedMaxLength() {
    final AugObject filhed = (AugObject) get(Record.filhed);
    return new AugUnsignedNumber(filhed.getMemorySpace(), filhed.getLocation(), 18);
  }

  /**
   * Return the value of the actual length of the text stored in the filhed field.
   * This is normally a number between 0 and 20, but valid range is actually between 0-74 characters.
   * http://blueoxen.net/c/hyperscope/forums/cgi-bin/mesg.cgi?a=dev&i=01b601c67e28$4b0bbd50$6601a8c0@spring
   */
  public AugUnsignedNumber getFilhedActualLength() {
    final AugObject filhed = (AugObject) get(Record.filhed);
    return new AugUnsignedNumber(filhed.getMemorySpace(), filhed.getLocation().newLocation(18), 18);
  }

  /**
   * Return the text stored in the filhed field.
   * This should be a number between 0 and 20.
   */
  public Aug7BitString getFilhedText() {
    final AugObject filhed = (AugObject) get(Record.filhed);
    final Location location = filhed.getLocation().newLocation(bitsPerWord);
    final int numChars = getFilhedActualLength().getValue();
    int numBits;
    if (numChars == 5) {
      numBits = 36;      
    } else {
      numBits = (numChars / 5) * 36 + (numChars % 5) * 7; 
    }
    return new Aug7BitString(filhed.getMemorySpace(), location, numBits);
  }
  
  public AugDate getCreationDate() {
    return (AugDate) get(Record.fcredt);
  }

  public AugUnsignedNumber getAugmentVersion() {
    final AugUnsignedNumber version = (AugUnsignedNumber) get(Record.nlsvwd);
    return version;
  }

  public AugUnsignedNumber getSidCount() {
    return (AugUnsignedNumber) get(Record.sidcnt);
  }

  /**
   * Get the initials of the person who created this statement. This method returns either
   * an Aug5BitString or an Aug7BitString, depending on the particular instance of 
   * StatementDataBlockHeader. In particular, if the finit field has bit 16 enabled
   * <code>(finit & 04000000 == 04000000)</code>, then an Aug7BitString is returned. 
   * Otherwise, an Aug5BitString is returned. The reason there are two separate mechanisms 
   * for storing initials is historical. From inspecting files that contain both styles within
   * the same file (depending on the creation date of the particular FileHeaderBlock), 
   * it appears that Aug7BitString ("old style init") occurred for statements up until August 1971.
   * The Aug5BitString occurred for statements after September 1971.
   * <p>Although the field size is 36 bits, only 21 bits are used. The left-most 15 bits are
   * always zero. Either three 7-bit characters or four five-bit characters will be returned.  
   * <p>See ?????????????????? function for details.
   * @return the initials of the person who created this statement (as 3 or 4 character AugString)
   */
  public AugString getLastModUser() {
    final AugUnsignedNumber num = new AugUnsignedNumber(getMemorySpace(), get(Record.finit).getLocation(), 36);

    // TODO: verify the javadoc above
    
    if ((num.getValue() & 04000000) == 04000000) {
      return new Aug7BitString(getMemorySpace(), get(Record.finit).getLocation().newLocation(15), 21);
    }
    return new Aug5BitString(getMemorySpace(), get(Record.finit).getLocation().newLocation(16), 20);
  }

  /**
   * Returns "5-bit" if the finit field is stored as a 5-bit String, and "7-bit" otherwise. 
   * @return "5-bit" or "7-bit". You can also called getLastModUser() to return an AugString object,
   * and then check if the (object instanceof Aug5BitString) or (object instanceof Aug7BitString).
   * @see #getLastModUser()
   */
  public String getLastModUserType() {
    final AugString finit = getLastModUser();
    if (finit instanceof Aug5BitString) {
      return "5-bit";
    } else if (finit instanceof Aug7BitString) {
      return "7-bit";
    } else {
      throw new AugmentException("error! unexpected type: " + finit.getClass().getName());
    }
  }
  
  public AugSignedNumber getFileOwner() {
    return (AugSignedNumber) get(Record.funo);
  }

  public AugDate getLastModTime() {
    return (AugDate) get(Record.lwtim);
  }

  public Aug7BitCharacter getLeftDelimiter() {
    return (Aug7BitCharacter) get(Record.namdl1);
  }

  public Aug7BitCharacter getRightDelimiter() {
    return (Aug7BitCharacter) get(Record.namdl2);
  }

  public AugUnsignedNumber getNumRings() {
    return (AugUnsignedNumber) get(Record.rngl);
  }

  public AugUnsignedNumber getNumData() {
    return (AugUnsignedNumber) get(Record.dtbl);
  }

  public RingBlockStatusTable getRingBlockStatusTable() {
    return this._ringBlockStatusTable;
  }

  public DataBlockStatusTable getDataBlockStatusTable() {
    return this._dataBlockStatusTable;
  }

  public AugUnsignedNumber getMaxMarkerTableLength() {
    final AugUnsignedNumber mkrtxn = (AugUnsignedNumber) get(Record.mkrtxn);
    return mkrtxn;
  }

  public AugUnsignedNumber getMarkerTableLength() {
    return (AugUnsignedNumber) get(Record.mkrtbl);
  }

  public MarkerTable getMarkerTable() {
    return this._markerTable;
  }
  
  public AugUnused getEndOfFile() {
    return (AugUnused) get(Record.filhde);
  }
  
  private static void put(final WriteableMemorySpace wms, final Location location, final Enum fieldName, final String value) {
    __helper.put(wms, location, fieldName, value);
  }

  private static void put(final WriteableMemorySpace wms, final Location location, final Enum fieldName, final String value, AugType.Type type) {
    __helper.put(wms, location, fieldName, value, type);
  }

  private static void put(final WriteableMemorySpace wms, final Location location, final Enum fieldName, final String value, final int numBits) {
    __helper.put(wms, location, fieldName, value, numBits);
  }

  public static Location getFieldLocation(final Enum field, final Location objectLocation) {
    return __helper.getFieldLocation(field, objectLocation);
  }
  
  public static void update(final WriteableMemorySpace wms, final Location location, final Map<String, String> attributes) {
    put(wms, location, Record.filhed, attributes.get(Record.filhed.name()), Integer.parseInt(attributes.get("filhedBitSize")));
    put(wms, location, Record.fcredt, attributes.get(Record.fcredt.name()));
    put(wms, location, Record.nlsvwd, attributes.get(Record.nlsvwd.name()));
    put(wms, location, Record.sidcnt, attributes.get(Record.sidcnt.name()));
    
    // TODO: fix this. This attribute is specific to LosslessFileWriter
    if ("5-bit".equals(attributes.get("finitType"))) {     
      put(wms, location, Record.finit, attributes.get(Record.finit.name()), AugType.Type.FIVE_BIT_STRING);
    } else if ("7-bit".equals(attributes.get("finitType"))) {      
      put(wms, location, Record.finit, attributes.get(Record.finit.name()), AugType.Type.SEVEN_BIT_STRING);
    } else {
      throw new AugmentException("invalid or missing finitType: " + attributes.get("finitType"));
    }
    put(wms, location, Record.funo, attributes.get(Record.funo.name()));
    put(wms, location, Record.lwtim, attributes.get(Record.lwtim.name()));
    put(wms, location, Record.namdl1, attributes.get(Record.namdl1.name()));
    put(wms, location, Record.namdl2, attributes.get(Record.namdl2.name()));
    put(wms, location, Record.rngl, attributes.get(Record.rngl.name()));
    put(wms, location, Record.dtbl, attributes.get(Record.dtbl.name()));
    put(wms, location, Record.rngst, attributes.get(Record.rngst.name()));
    put(wms, location, Record.dtbst, attributes.get(Record.dtbst.name()));
    put(wms, location, Record.mkrtxn, attributes.get(Record.mkrtxn.name()));
    put(wms, location, Record.mkrtbl, attributes.get(Record.mkrtbl.name()));
    put(wms, location, Record.mkrtb, attributes.get(Record.mkrtb.name()));
//    put(wms, location, Record.filhde, attributes.get(Record.filhde.name()));
  }  
}
