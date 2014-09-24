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
import static org.nlsaugment.augxml.Constants.bitsPerRingElement;
import static org.nlsaugment.augxml.Constants.numFileHeaderBlocks;
import static org.nlsaugment.augxml.Constants.numUnusedBlocks;
import static org.nlsaugment.augxml.type.AugType.Type.ADDRESS;
import static org.nlsaugment.augxml.type.AugType.Type.BOOLEAN;
import static org.nlsaugment.augxml.type.AugType.Type.UNSIGNED_NUMBER;
import static org.nlsaugment.augxml.type.AugType.Type.UNUSED;

import java.util.Map;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;
import org.nlsaugment.augxml.memory.WriteableMemorySpace;
import org.nlsaugment.augxml.type.AugAddress;
import org.nlsaugment.augxml.type.AugBoolean;
import org.nlsaugment.augxml.type.AugType;
import org.nlsaugment.augxml.type.AugUnsignedNumber;
import org.nlsaugment.augxml.util.Field;
import org.nlsaugment.augxml.util.FieldHelper;
import org.nlsaugment.augxml.util.RingElementManager;

/**
 * A RingElement represents the structural information for a single Statement (node) in
 * an Augment file. It allows you to move between nodes by storing pointers to the sub-statement and
 * successive statement. It also allows you to retrieve the non-structural data by storing a pointer
 * to the DataElement.
 * @author Jonathan Cheyer
 *
 */
public final class RingElement extends ModelObject {
  private final int _recordNumber;
  
  public enum Record {
    rsub, rsuc,                                         // word 1
    rsdb, rinst1, rinst2, rdummy, repet,                // word 2
    rhf, rtf, rnamef, rtorgin, rdelb, rnameh, unused1,  // word 3
    rsid, unused2,                                      // word 4
    unused3                                             // word 5
  }

  private static final Field[] __fields = new Field[] {              

    // The first two words in every block is the BlockHeader. This field is stored in the Block class. 
    // blockHeader (blocksPerBlockHeader * bitsPerWord), // see BlockHeader class
    
    // word 1
    
    //  a pointer to the first substatement of this statement
    new Field(Record.rsub, 18, ADDRESS), // psid of sub of this statement
    //  a pointer to the successor of this statement (to the parent if no successor)
    new Field(Record.rsuc, 18, ADDRESS), // psid of suc of this statement
  
    // word 2
    
    // Pointer to the first property in the property list of data blocks for this statement.
    new Field(Record.rsdb, 18, ADDRESS), // PSDB of first property for this statement
    
    // Information in scratch fields may be reset and used by other subsystems such as DEX.  
    // No other assumption concerning their contents should be made.

    // TODO: find out what this value is supposed to be used for (it isn't empty)
    // for now, store as unsigned numbers (boolean for rdummy) so that it can be transformed
    // without losing any data
    
    // DEX interpolation string-- scratch space
    new Field(Record.rinst1, 7, UNSIGNED_NUMBER),
    // DEX interpolation string-- scratch space
    new Field(Record.rinst2, 7, UNSIGNED_NUMBER),
    // DEX dummy flag-- scratch space
    new Field(Record.rdummy, 1, BOOLEAN),
    // DEX repetition-- scratch space
    new Field(Record.repet, 3, UNSIGNED_NUMBER),
    
    // word 3

    // head flag. true (=1) if this is head of plex
    new Field(Record.rhf, 1, BOOLEAN),
    //  tail flag, true if tail of plex
    new Field(Record.rtf, 1, BOOLEAN),
    // name flag, true if statement has a name
    new Field(Record.rnamef, 1, BOOLEAN),
    // inferior tree origin flag, true if origin
    new Field(Record.rtorgin, 1, BOOLEAN),

    // this was "rnull" from around 1976 to 1983(?), but became "rdelb" sometime after that.
    // It is listed as "rnull" in Harvey's <AUGMENT,103489,> document from 1975.
    // It is listed as "rdelb" in <DEV:COMPSRC, RT-MAIN.AUG.42,> from Doug's machine.
    new Field(Record.rdelb, 1, BOOLEAN), // delete branch flag (was rnull)
    
    // hash algorithm may be found in (nls, utilty, hash)
    new Field(Record.rnameh, 30, UNSIGNED_NUMBER), // name hash for this statement
    
    new Field(Record.unused1, 1, UNUSED), // unused
    
    // word 4

    new Field(Record.rsid, 30, UNSIGNED_NUMBER),   // statement identifier
    new Field(Record.unused2, 6, UNUSED), // unused
    
    // word 5
    
    new Field(Record.unused3, 36, UNUSED),  // unused
  };
  private static final FieldHelper __helper = new FieldHelper(__fields);
    
  public RingElement(final MemorySpace memorySpace, final Location location, final int numBits, final int recordNumber) {
    super(__fields, memorySpace, location, numBits);
    this._recordNumber = recordNumber;
    
    check();    
  }

  private void check() {
    if (getNumBits() != bitsPerRingElement) {
      throw new AugmentException("ring element is wrong size: " + getNumBits());
    }
  }
  
  void checkPsids(final RingElementManager rem) {
    final Location origin = new Location(0);
    final Location rsub = getSubstatementPsid().toLocation();
    if (rem.get(rsub) == null && ! rsub.equals(origin)) {
      throw new AugmentException("rsub not found for psid " + getPsid() + ": " + rsub);
    }
    final Location rsuc = getSuccessorPsid().toLocation();
    if (rem.get(rsuc) == null && ! rsuc.equals(origin)) {
      throw new AugmentException("rsuc not found for psid " + getPsid() + ": " + rsuc);
    }
  }

  public int getRecordNumber() {
    return this._recordNumber;
  }
  
  public Location getPsid() {
    return getLocation().newLocation(-1 * (numFileHeaderBlocks + numUnusedBlocks) * bitsPerPage);
  }
  
  private AugType get(final Enum fieldName) {
    return __helper.get(this, fieldName);
  }

  public AugAddress getSubstatementPsid() {
    return (AugAddress) get(Record.rsub);
  }

  public AugAddress getSuccessorPsid() {
    return (AugAddress) get(Record.rsuc);
  }

  public AugAddress getPropertyPsid() {
    return (AugAddress) get(Record.rsdb);
  }

  public AugUnsignedNumber getDexInterpolationString1() {
    return (AugUnsignedNumber) get(Record.rinst1);
  }

  public AugUnsignedNumber getDexInterpolationString2() {
    return (AugUnsignedNumber) get(Record.rinst2);
  }

  public AugBoolean getDexDummyFlag() {
    return (AugBoolean) get(Record.rdummy);
  }

  public AugUnsignedNumber getDexRepetition() {
    return (AugUnsignedNumber) get(Record.repet);
  }

  public AugBoolean getHeadFlag() {
    return (AugBoolean) get(Record.rhf);
  }

  public AugBoolean getTailFlag() {
    return (AugBoolean) get(Record.rtf);
  }

  public AugBoolean getNameFlag() {
    return (AugBoolean) get(Record.rnamef);
  }

  public AugBoolean getOriginFlag() {
    return (AugBoolean) get(Record.rtorgin);
  }

  public AugBoolean getDeleteBranchFlag() {
    return (AugBoolean) get(Record.rdelb);
  }

  public AugUnsignedNumber getNameHash() {
    return (AugUnsignedNumber) get(Record.rnameh);
  }

  public AugUnsignedNumber getSid() {
    return (AugUnsignedNumber) get(Record.rsid);
  }
  
  private static void put(final WriteableMemorySpace wms, final Location location, final Enum fieldName, final String value) {
    __helper.put(wms, location, fieldName, value);
  }

  public static void update(final WriteableMemorySpace wms, final Location location, final Map<String, String> attributes) {
    put(wms, location, Record.rsub, attributes.get(Record.rsub.name()));
    put(wms, location, Record.rsuc, attributes.get(Record.rsuc.name()));
    put(wms, location, Record.rsdb, attributes.get(Record.rsdb.name()));
    put(wms, location, Record.rinst1, attributes.get(Record.rinst1.name()));
    put(wms, location, Record.rinst2, attributes.get(Record.rinst2.name()));
    put(wms, location, Record.rdummy, attributes.get(Record.rdummy.name()));
    put(wms, location, Record.repet, attributes.get(Record.repet.name()));
    put(wms, location, Record.rhf, attributes.get(Record.rhf.name()));
    put(wms, location, Record.rtf, attributes.get(Record.rtf.name()));
    put(wms, location, Record.rnamef, attributes.get(Record.rnamef.name()));
    put(wms, location, Record.rtorgin, attributes.get(Record.rtorgin.name()));
    put(wms, location, Record.rdelb, attributes.get(Record.rdelb.name()));
    put(wms, location, Record.rnameh, attributes.get(Record.rnameh.name()));
    put(wms, location, Record.rsid, attributes.get(Record.rsid.name()));    
  }
}
