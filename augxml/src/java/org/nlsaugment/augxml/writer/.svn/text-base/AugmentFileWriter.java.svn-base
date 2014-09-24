/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.writer;

import org.nlsaugment.augxml.model.AugmentFile;
import org.nlsaugment.augxml.util.FileUtil;
import org.nlsaugment.augxml.util.MetaData;

/**
* This file writer will write out an Augment file in its native file format, that is, the
* one that is used by the original Augment system itself. It is a binary file, made up of
* between 102 and 471 pages of 36-bit words. 
* @author Jonathan Cheyer
*/
public final class AugmentFileWriter implements IAugmentWriter {
  public AugmentFileWriter() {}
  
  public void save(final AugmentFile file, final MetaData metaData, final String filename) {
    FileUtil.write(filename, convert(file));
  } 
  
  private byte[] convert(final AugmentFile af) {
    return af.getMemorySpace().getBits().toBytes();
  }
}
