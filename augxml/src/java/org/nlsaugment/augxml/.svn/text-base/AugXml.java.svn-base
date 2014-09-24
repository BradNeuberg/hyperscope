/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml;

import org.nlsaugment.augxml.memory.MemorySpace;
import org.nlsaugment.augxml.model.AugmentFile;
import org.nlsaugment.augxml.reader.LosslessFileReader;
import org.nlsaugment.augxml.util.BitBox;
import org.nlsaugment.augxml.util.FileUtil;
import org.nlsaugment.augxml.util.MetaData;
import org.nlsaugment.augxml.writer.AugmentFileWriter;
import org.nlsaugment.augxml.writer.HyperscopeFileWriter;
import org.nlsaugment.augxml.writer.LosslessFileWriter;
import org.nlsaugment.augxml.writer.TextFileWriter;
import org.nlsaugment.augxml.writer.XmlFileWriter;

/**
 * The main class that takes an Augment file as input and outputs four files:
 * lossless, generic xml, hyperscope xml (OPML), and generic text.
 * @author Jonathan Cheyer
 *
 */
public final class AugXml {
  private static final String __propsPrefix = "augxml.";
  private static final String __defaultPropsFilename = __propsPrefix + "properties";
  private static final String __propertySuffixLossless = __propsPrefix + "writer.lossless.suffix";
  private static final String __propertySuffixXml = __propsPrefix + "writer.xml.suffix";
  private static final String __propertySuffixHyperscope = __propsPrefix + "writer.hyperscope.suffix";
  private static final String __propertySuffixText = __propsPrefix + "writer.text.suffix";
  private static final String __propertySuffixAugment = __propsPrefix + "writer.augment.suffix";
  
  private static void convertAugment(final String filename) {
    final MetaData metaData = new MetaData();
    metaData.addProps(__propsPrefix, __defaultPropsFilename);
    metaData.addSystemProps(__propsPrefix);
    metaData.put(MetaData.PATH, filename);    
    final MemorySpace ms = new MemorySpace(BitBox.fromBytes(FileUtil.read(filename)));
    final AugmentFile af = AugmentFile.newInstance(ms);
    new LosslessFileWriter().save(af, metaData, filename + metaData.get(__propertySuffixLossless));
//    new XmlFileWriter().save(af, metaData, filename + metaData.get(__propertySuffixXml));
    new HyperscopeFileWriter().save(af, metaData, filename + metaData.get(__propertySuffixHyperscope));
    new TextFileWriter().save(af, metaData, filename + metaData.get(__propertySuffixText));    
  }
  
  private static void convertXml(final String filename) {
    final MetaData metaData = new MetaData();
    metaData.put(MetaData.PATH, filename);    
    final AugmentFile af = new LosslessFileReader().load(filename);
    new LosslessFileWriter().save(af, metaData, filename + metaData.get(__propertySuffixLossless));
    new AugmentFileWriter().save(af, metaData, filename + metaData.get(__propertySuffixAugment));
  }
  
  public static final void main(final String[] args) throws Exception {
    if (args.length != 2) {
      System.out.println("AugXml -a|-x <augment_file>");
    }
    if (args[0].equals("-a")) {
      convertAugment(args[1]);
    } else if (args[0].equals("-x")) {
      convertXml(args[1]);
    } else {
      System.out.println("AugXml -a|-x <augment_file>");
    }
  }
}
