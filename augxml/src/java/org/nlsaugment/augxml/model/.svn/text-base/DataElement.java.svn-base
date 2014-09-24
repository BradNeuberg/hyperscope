/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.model;

import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemoryObject;
import org.nlsaugment.augxml.memory.MemorySpace;

/**
 * A DataBlock is composed of multiple variable-sized DataElement objects. Examples of DataElements
 * are StatementDataBlocks (SDBs), and graphical data elements (not currently implemented in this code). 
 * Each DataElement has a DataElementHeader, which is 5 words in length, followed by the
 * variable-sized data.
 *  
 * @author Jonathan Cheyer
 *
 */
public abstract class DataElement extends MemoryObject {  
  protected DataElement(final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
  }  
}
