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
import org.nlsaugment.augxml.util.MetaData;

/**
 * The interface that all Augment writers must implement. Implementations will
 * take the AugmentFile object graph and output a file-based representation of
 * the object graph. Some implementations will be lossless in nature, and others
 * will be lossy.
 * @author Jonathan Cheyer
 *
 */
public interface IAugmentWriter {
  
  /**
   * Save an AugmentFile object to file specified by filename.
   * @param file the AugmentFile object to save
   * @param metaData Additional metadata that the writer might need when writing, 
   * such as the path of the original file
   * @param filename the filename of the new file to create
   */
  public void save(AugmentFile file, MetaData metaData, String filename);
}
