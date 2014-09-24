/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.nlsaugment.augxml.exception.AugmentException;

/**
 * A FileUtil can read an Augment file into a byte[]. It can also write a byte[] into an Augment file.
 * @author Jonathan Cheyer
 */
public final class FileUtil {
  public static byte[] read(final String filename) {
    final File f = new File(filename);
    if (! f.exists()) {
      throw new AugmentException("file " + filename + " doesn't exist");
    }
    final long length = f.length();
    if (length == 0) {
      throw new AugmentException("file " + filename + " is a zero-length file");
    }
    if (length > Integer.MAX_VALUE) {
      throw new AugmentException("files larger than " + Integer.MAX_VALUE + " are not supported");
    }
    final int fileSize = (int) length;
    final byte[] bytes = new byte[fileSize];
    FileInputStream fis = null;
    try {
      fis = new FileInputStream(f);
      fis.read(bytes, 0, fileSize);
    } catch (FileNotFoundException e) {
      throw new AugmentException("file not found: " + filename, e);
    } catch (IOException e) {
      throw new AugmentException("unable to read file: " + filename, e);
    } finally {
      try {
        if (fis != null) {
          fis.close();
        }
      } catch (IOException e) {
        throw new AugmentException("unable to close file: " + filename, e);
      }
    }
    return bytes;
  }
  
  public static void write(final String filename, final byte[] bytes) {
    final File f = new File(filename);
    if (f.exists()) {
      throw new AugmentException("file " + filename + " already exists");
    }
    FileOutputStream fos = null;
    try {
      fos = new FileOutputStream(f);
      fos.write(bytes);
    } catch (FileNotFoundException e) {
      throw new AugmentException("unable to create new file: " + filename, e);
    } catch (IOException e) {
      throw new AugmentException("unable to write to file: " + filename, e);
    } finally {
      try {
        fos.close();
      } catch (IOException e) {
        throw new AugmentException("unable to close fiel: " + filename, e);
      }
    }
  }
}
