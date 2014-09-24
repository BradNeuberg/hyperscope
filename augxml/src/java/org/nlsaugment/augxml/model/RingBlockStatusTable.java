/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.Constants.bitsPerRingBlockStatusTable;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.type.AugObject;

/**
 * The block status table for the structure blocks (ring blocks).
 * This stores status information for blocks 6-100. Each record in
 * the table is one word and stores information for one block.
 * The table is 95 words in length.
 * @author Jonathan Cheyer
 *
 */
public final class RingBlockStatusTable extends BlockStatusTable {
  public RingBlockStatusTable(final AugObject statusTable) {
    super(statusTable);
    check();
  }
  
  private void check() {
    if (getNumBits() != bitsPerRingBlockStatusTable) {
      throw new AugmentException("ring block status table size is invalid: " + getNumBits());
    }
  }
}
