/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml;

/**
 * The constants used within the augxml project.
 * @author Jonathan Cheyer
 *
 */
public final class Constants {
  // generally useful constants
  
  public static final char NUL = (char) 0;
  
  
  // constants used for memory object

  public static final int bitsPerByte = 8;
  public static final int bitsPerWord = 36; 
  public static final int wordsPerPage = 512;
  public static final int bitsPerPage = bitsPerWord * wordsPerPage; // 18432 bits = 2304 bytes
  // MemorySpace constants are defined below, because they make use of Augment constants
  

  // constants used for Augment model
    
  public static final int wordsPerBlockHeader = 2;
  public static final int bitsPerBlockHeader = bitsPerWord * wordsPerBlockHeader; // 72 bits
  
  public static final int numFileHeaderBlocks = 1;
  
  public static final int wordsPerMarkerRecord = 2;
  public static final int bitsPerMarkerRecord = bitsPerWord * wordsPerMarkerRecord; // 72 bits
  public static final int markerRecordsPerMarkerTable = 20;
  public static final int wordsPerMarkerTable = wordsPerMarkerRecord * markerRecordsPerMarkerTable;
  public static final int bitsPerMarkerTable = bitsPerWord * wordsPerMarkerTable;
  
  public static final int numUnusedBlocks = 5;
  
  public static final int numStructureBlocks = 95;
  public static final int wordsPerRingElement = 5;
  public static final int bitsPerRingElement = bitsPerWord * wordsPerRingElement;
  public static final int ringElementsPerStructureBlock = 102;
    
  public static final int wordsPerStatementDataBlockHeader = 5;
  public static final int bitsPerStatementDataBlockHeader = bitsPerWord * wordsPerStatementDataBlockHeader; // 180 bits
  public static final int wordsPerDataBlockData = 510;

  public static final int charactersPerWord = 5;
  public static final int charactersPerStatement = 2000;
  
  public static final int minDataBlocks = 1;
  public static final int maxDataBlocks = 370;
  
  public static final int wordsPerRingBlockStatusTable = numStructureBlocks;
  public static final int bitsPerRingBlockStatusTable = wordsPerRingBlockStatusTable * bitsPerWord; // 3420 bits
  public static final int wordsPerDataBlockStatusTable = maxDataBlocks;
  public static final int bitsPerDataBlockStatusTable = wordsPerDataBlockStatusTable * bitsPerWord; // 13320 bits = 1665 bytes
  public static final int wordsPerBlockStatusRecord = 1;
  public static final int bitsPerBlockStatusRecord = wordsPerBlockStatusRecord * bitsPerWord; // 36 bits

  public static final int minBlocksPerFile = numFileHeaderBlocks + numUnusedBlocks + numStructureBlocks + minDataBlocks; // 102 blocks
  public static final int minBitsPerFile = bitsPerPage * minBlocksPerFile; // 1880064 bits = 235008 bytes = 229.5 KiB  
  public static final int maxBlocksPerFile = numFileHeaderBlocks + numUnusedBlocks + numStructureBlocks + maxDataBlocks; // 471 blocks
  public static final int maxBitsPerFile = bitsPerPage * maxBlocksPerFile; // 8681472 bits = 1085184 bytes = 1059.75 KiB = ~1.03 MiB

  // constants used for MemorySpace objects
  
  // the maximum size for MemorySpace is currently tied to the Augment maxBlocksPerFile
  // even though true TENEX memory space sizes would not be limited by Augment file size limitations
  public static final int minPagesPerMemorySpace = minBlocksPerFile;
  public static final int maxPagesPerMemorySpace = maxBlocksPerFile;
  public static final int wordsPerMemorySpace = maxPagesPerMemorySpace * wordsPerPage;
  public static final int bitsPerMemorySpace = wordsPerMemorySpace * bitsPerWord;
  
  // constants used for AugTypes
  
  public static final int bitsPerAugBoolean = 1;
  public static final int bitsPerAugDate = 36;
  public static final int bitsPerAugBlockIndex = 9;
  public static final int bitsPerAugAddress = 18;
  
  // numbers are limited to 36 bits, although they are further constrained at run-time to Integer.MAX_VALUE
  public static final int maxBitsPerAugNumber = 36;

  // constants found within the Augment file format itself
  
  public static final int augmentVersion = 1;
  public static final int markerTableMaximumLength = markerRecordsPerMarkerTable;
}
