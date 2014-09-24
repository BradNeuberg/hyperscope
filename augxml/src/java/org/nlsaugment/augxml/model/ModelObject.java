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
import org.nlsaugment.augxml.util.Field;

/**
 * A ModelObject represents an abstraction of an object on top of the MemoryObject.
 * While MemoryObjects represent the Location of an object in a MemorySpace and are focused
 * on bits, ModelObjects are focused on what type of thing those bits are representing.
 * Most ModelObject classes contain their own Field[] which contains the fields for that object. The
 * Field[] is represented in each Java class file in a way that is as similar as possible to that
 * of the original L10 code. For more info, see Field. 
 * @author Jonathan Cheyer
 * @see Field
 *
 */
public abstract class ModelObject extends MemoryObject { 
  protected ModelObject(final Field[] fields, final MemorySpace memorySpace, final Location location, final int numBits) {
    super(memorySpace, location, numBits);
  }  
}
