/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import static org.nlsaugment.augxml.Constants.maxBlocksPerFile;
import static org.nlsaugment.augxml.Constants.minBitsPerFile;
import static org.nlsaugment.augxml.Constants.minBlocksPerFile;
import static org.nlsaugment.augxml.type.AugType.Type.OBJECT;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;
import org.nlsaugment.augxml.memory.Page;
import org.nlsaugment.augxml.util.Field;
import org.nlsaugment.augxml.util.RingElementManager;

/**
 * An AugmentFile represents an Augment file. It contains multiple Blocks.
 * @author Jonathan Cheyer
 *
 */
public final class AugmentFile extends ModelObject {
  private final List<Block> _blocks;
  private final RingElementManager _rem;

  public enum Record {blocks}
  private static final Field[] __fields = new Field[] {
    new Field(Record.blocks, minBitsPerFile, OBJECT)
  };

  private AugmentFile(final List<Block> blocks, final RingElementManager rem) {
    super(__fields, blocks.get(0).getMemorySpace(), new Location(), blocks.get(0).getMemorySpace().getNumBits());
    this._blocks = Collections.unmodifiableList(blocks);
    this._rem = rem;
  }
  
  /**
   * Create a new AugmentFile object from the memory space.
   * @param ms the MemorySpace used to create the AugmentFile
   */
  public static AugmentFile newInstance(final MemorySpace ms) {
    final ArrayList<Block> blocks = new ArrayList<Block>();
    if (ms.getPages().size() < minBlocksPerFile) {
      throw new AugmentException("Augment file cannot be smaller than " + minBlocksPerFile + " blocks");
    }
    if (ms.getPages().size() > maxBlocksPerFile) {
      throw new AugmentException("Augment file cannot be larger than " + maxBlocksPerFile + " blocks");
    } 
    int i = 0;
    FileHeaderBlock fhb = null;
    for (final Page page : ms.getPages()) {
      final Block block = Block.newInstance(page, i, fhb);
      blocks.add(block);
      if (i == 0) {
        fhb = (FileHeaderBlock) block;
      }
      i++;
    }
    final RingElementManager rem = new RingElementManager(blocks);
    checkElementBlockPsids(blocks, rem);
    return new AugmentFile(blocks, rem);
  }

  private static void checkElementBlockPsids(final List<Block> blocks, final RingElementManager rem) {
    for (final Block block : blocks) {
      if (! (block instanceof StructureBlock)) {
        continue;
      }
      final StructureBlock sb = (StructureBlock) block;
      if (sb.isEmpty()) {
        continue;
      }
      final RingElement[] re = sb.getRingElements();
      for (int j = 0; j < re.length; j++) {
        re[j].checkPsids(rem);
      }
    }
  }
  
  public List<Block> getBlocks() {
    return this._blocks;
  }

  public RingElementManager getRingElementManager() {
    return this._rem;
  }  
}
