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
import static org.nlsaugment.augxml.Constants.maxBlocksPerFile;
import static org.nlsaugment.augxml.Constants.numFileHeaderBlocks;
import static org.nlsaugment.augxml.Constants.numStructureBlocks;
import static org.nlsaugment.augxml.Constants.numUnusedBlocks;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Page;
import org.nlsaugment.augxml.util.Field;

/**
 * There are three types of blocks in the Augment file structure:
 *  <li>File Header Block</li>
 *  <li>Structure (Ring) Block</li>
 *  <li>Data Block</li>
 * An Augment block is stored as a TENEX/TOPS-20 page. A page is exactly 512 36-bit words (2304 bytes).
 * A block consists of a 2 word BlockHeader, followed by 510 words of block-specific data.
 * @author Jonathan Cheyer
 */
public abstract class Block extends ModelObject {
  private final int _recordNumber;
  private final BlockHeader _blockHeader;
  
  protected Block(final Field[] fields, final Page page, final int recordNumber) {
    super(fields, page.getMemorySpace(), page.getLocation(), page.getNumBits());
    this._blockHeader = new BlockHeader(page.getMemorySpace(), page.getLocation(), bitsPerBlockHeader);
    this._recordNumber = recordNumber;
    check();
  }

  private void check() {
    if (isEmpty()) {
      return; // empty blocks will not have their BlockHeader.fbpnum field set
    }
    if (this._blockHeader.getBlockNumber().getValue() != getRecordNumber()) {
      throw new AugmentException("block number from block header should be " + getRecordNumber() + " but is: " + this._blockHeader.getBlockNumber().getValue());
    }
  }
  
  public int getRecordNumber() {
    return this._recordNumber;
  }
  
  public final BlockHeader getBlockHeader() {
    return this._blockHeader;
  }
  
  /**
   * Create a new Block, based on the page data and the record number. The type of the block
   * that is created is dependent on the record number, as follows:
   *  <li>0       - FileHeaderBlock
   *  <li>1-100   - StructureBlock
   *  <li>101-470 - DataBlock
   * @param page the page data which is used to create the new Block
   * @param recordNumber the page record number (from 0 to 470 inclusive)
   * @param fhb the FileHeaderBlock is null for record number 0, because that is the type of block
   *        that is created by this method. However, DataBlock creation makes use of information that
   *        is found in the FileHeaderBlock, so that Block needs to be passed back in to this method
   *        specifically for that case. Other Block creation (FileHeaderBlock and StructureBlock)
   *        do not need this Block and fhb should be null in those cases.
   * @return a new Block of the correct type, as determined by the record number above.
   */
  static Block newInstance(final Page page, final int recordNumber, final FileHeaderBlock fhb) {
    final int pageIndex = page.getLocation().getPageIndex();
    if (pageIndex != recordNumber) {
      throw new AugmentException("pageIndex should be " + recordNumber + " but is: " + pageIndex);
    }
    if (recordNumber < 0) {
      throw new AugmentException("negative block number: " + recordNumber);
    }
    if (recordNumber < numFileHeaderBlocks + numUnusedBlocks) {
      return new FileHeaderBlock(page, recordNumber);
    } else if (recordNumber < numFileHeaderBlocks + numUnusedBlocks + numStructureBlocks) {
      return new StructureBlock(page, recordNumber);
    } else if (recordNumber < maxBlocksPerFile) {
      return DataBlock.newInstance(page, recordNumber, fhb);
    } else {
      throw new AugmentException("invalid block number: " + recordNumber);
    }
  }    
}
