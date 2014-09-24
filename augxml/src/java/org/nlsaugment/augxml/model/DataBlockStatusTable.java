/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.Constants.bitsPerDataBlockStatusTable;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.type.AugObject;

/**
 * The block status table for the data blocks.
 * This stores status information for blocks 101-470. Each record in
 * the table is one word and stores information for one block.
 * The table is 370 words in length.
 * @author Jonathan Cheyer
 */
public final class DataBlockStatusTable extends BlockStatusTable {
  public DataBlockStatusTable(final AugObject statusTable) {
    super(statusTable);
    check();
  }
  
  private void check() {
    if (getNumBits() != bitsPerDataBlockStatusTable) {
      throw new AugmentException("data block status table size is invalid: " + getNumBits());
    }    
  }
}
