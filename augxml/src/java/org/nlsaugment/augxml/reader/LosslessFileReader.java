/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.reader;

import static org.nlsaugment.augxml.Constants.bitsPerWord;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.LinkedHashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.memory.MemorySpace;
import org.nlsaugment.augxml.memory.WriteableMemorySpace;
import org.nlsaugment.augxml.model.AugmentFile;
import org.nlsaugment.augxml.model.BlockHeader;
import org.nlsaugment.augxml.model.BlockStatusRecord;
import org.nlsaugment.augxml.model.DataBlock;
import org.nlsaugment.augxml.model.FileHeaderBlock;
import org.nlsaugment.augxml.model.RingElement;
import org.nlsaugment.augxml.model.StatementDataBlock;
import org.nlsaugment.augxml.model.StatementDataBlockHeader;
import org.nlsaugment.augxml.model.StructureBlock;
import org.nlsaugment.augxml.util.Util;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public final class LosslessFileReader implements IAugmentReader {
  private WriteableMemorySpace _wms = null;
  
  public LosslessFileReader() {}
  
  public AugmentFile load(final String filename) {
    final Document document = loadFile(filename);
    return convert(document);
  }
  
  private Document loadFile(final String filename) {
    final File file = new File(filename);
    try {
      DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
      return builder.parse(file);
    } catch (ParserConfigurationException e) {
      throw new AugmentException("unable to parse file: " + filename, e);
    } catch (FileNotFoundException e) {
      throw new AugmentException("file not found: " + filename, e);
    } catch (IOException e) {
      throw new RuntimeException("unable to read file: " + filename, e);
    } catch (SAXException e) {
      throw new AugmentException("unable to parse file: " + filename, e);
    }
  }

  private AugmentFile convert(final Document document) {
    final Element documentElement = document.getDocumentElement();
    final NodeList nodes = documentElement.getElementsByTagName("aug:block");
    final int numBlocks = nodes.getLength();
    
    // TODO: fix me
    WriteableMemorySpace.setInstance(numBlocks);
    this._wms = WriteableMemorySpace.getInstance();
    
    for (int i = 0; i < numBlocks; i++) {
      final Element block = (Element) nodes.item(i);
      updateBlock(block, i);
    }
    final MemorySpace ms = new MemorySpace(this._wms.getBits().toBitBox());
    return AugmentFile.newInstance(ms);
  }
  
  private void updateBlock(final Element block, final int i) {
    final boolean empty = Boolean.parseBoolean(block.getAttribute("empty"));
    if (empty) {
      return;
    }
    final String blockType = block.getAttribute("type");
    final Location location = new Location(i);
    updateBlockHeader(block, location);
    if ("fileHeader".equals(blockType)) {
      if (i != 0) {     // TODO: replace constant value
        throw new AugmentException("FileHeaderBlock is only allowed for page number 0 but is on page number: " + i);
      }
      updateFileHeaderBlock(block, location);
    } else if ("structure".equals(blockType)) {
      if (i < 6 || i > 100) {     // TODO: replace constant value
        throw new AugmentException("StructureBlock is only allowed between pages 6 and 100 but is on page number: " + i);
      }
      final Location structureLocation = StructureBlock.getFieldLocation(StructureBlock.Record.ring, location);
      updateStructureBlock(block, structureLocation);
    } else if ("data".equals(blockType)) {
      if (i < 101) {
        throw new AugmentException("DataBlock is only allowed after page 101 but is on page number: " + i);
      }
      final Location dataLocation = DataBlock.getFieldLocation(DataBlock.Record.data, location);
      updateDataBlock(block, dataLocation);      
    }
  }
  
  private void updateBlockHeader(final Element block, final Location location) {
    final NodeList blockHeaders = block.getElementsByTagName("aug:blockHeader");
    if (blockHeaders.getLength() != 1) {
      throw new AugmentException("only one blockHeader is allowed but has: " + blockHeaders.getLength());
    }
    final Element blockHeader = (Element) blockHeaders.item(0);
    final LinkedHashMap<String, String> map = new LinkedHashMap<String, String>();
    map.put(BlockHeader.Record.fbind.name(), blockHeader.getAttribute(BlockHeader.Record.fbind.name()));
    map.put(BlockHeader.Record.fbpnum.name(), blockHeader.getAttribute(BlockHeader.Record.fbpnum.name()));
    map.put(BlockHeader.Record.fbtype.name(), blockHeader.getAttribute(BlockHeader.Record.fbtype.name()));
    BlockHeader.update(this._wms, location, map);    
  }
  
  private void updateFileHeaderBlock(final Element block, final Location location) {
    final NodeList fileHeaderBlocks = block.getElementsByTagName("aug:fileHeaderBlock");
    if (fileHeaderBlocks.getLength() != 1) {
      throw new AugmentException("only one fileheaderblock is allowed but has: " + fileHeaderBlocks.getLength());
    }
    final Element fhb = (Element) fileHeaderBlocks.item(0);
    final LinkedHashMap<String, String> map = new LinkedHashMap<String, String>();
    map.put(FileHeaderBlock.Record.filhed.name(), fhb.getAttribute(FileHeaderBlock.Record.filhed.name()));
    map.put("filhedBitSize", fhb.getAttribute("filhedBitSize"));
    map.put(FileHeaderBlock.Record.fcredt.name(), fhb.getAttribute(FileHeaderBlock.Record.fcredt.name()));
    map.put(FileHeaderBlock.Record.nlsvwd.name(), fhb.getAttribute(FileHeaderBlock.Record.nlsvwd.name()));
    map.put(FileHeaderBlock.Record.sidcnt.name(), fhb.getAttribute(FileHeaderBlock.Record.sidcnt.name()));
    map.put(FileHeaderBlock.Record.finit.name(), fhb.getAttribute(FileHeaderBlock.Record.finit.name()));
    map.put("finitType", fhb.getAttribute("finitType"));
    map.put(FileHeaderBlock.Record.funo.name(), fhb.getAttribute(FileHeaderBlock.Record.funo.name()));
    map.put(FileHeaderBlock.Record.lwtim.name(), fhb.getAttribute(FileHeaderBlock.Record.lwtim.name()));
    map.put(FileHeaderBlock.Record.namdl1.name(), fhb.getAttribute(FileHeaderBlock.Record.namdl1.name()));
    map.put(FileHeaderBlock.Record.namdl2.name(), fhb.getAttribute(FileHeaderBlock.Record.namdl2.name()));
    map.put(FileHeaderBlock.Record.rngl.name(), fhb.getAttribute(FileHeaderBlock.Record.rngl.name()));
    map.put(FileHeaderBlock.Record.dtbl.name(), fhb.getAttribute(FileHeaderBlock.Record.dtbl.name()));
    map.put(FileHeaderBlock.Record.rngst.name(), fhb.getAttribute(FileHeaderBlock.Record.rngst.name()));
    map.put(FileHeaderBlock.Record.dtbst.name(), fhb.getAttribute(FileHeaderBlock.Record.dtbst.name()));
    map.put(FileHeaderBlock.Record.mkrtxn.name(), fhb.getAttribute(FileHeaderBlock.Record.mkrtxn.name()));
    map.put(FileHeaderBlock.Record.mkrtbl.name(), fhb.getAttribute(FileHeaderBlock.Record.mkrtbl.name()));
    map.put(FileHeaderBlock.Record.mkrtb.name(), fhb.getAttribute(FileHeaderBlock.Record.mkrtb.name()));
//    map.put(FileHeaderBlock.Record.filhde.name(), fhb.getAttribute(FileHeaderBlock.Record.filhde.name()));
    
    FileHeaderBlock.update(this._wms, location, map);
    
    final NodeList rbsts = fhb.getElementsByTagName("aug:rngst");
    if (rbsts.getLength() != 1) {
      throw new AugmentException("only one RingBlockStatusTable is allowed but has: " + rbsts.getLength());      
    }
    final Element rbst = (Element) rbsts.item(0);
    updateBlockStatusTable(rbst, FileHeaderBlock.getFieldLocation(FileHeaderBlock.Record.rngst, location));
    
    final NodeList dbsts = fhb.getElementsByTagName("aug:dtbst");
    if (dbsts.getLength() != 1) {
      throw new AugmentException("only one DataBlockStatusTable is allowed but has: " + dbsts.getLength());      
    }
    final Element dbst = (Element) dbsts.item(0);
    final Location bstLocation = FileHeaderBlock.getFieldLocation(FileHeaderBlock.Record.dtbst, location);
    updateBlockStatusTable(dbst, bstLocation);    
  }
  
  private void updateBlockStatusTable(final Element rbst, final Location location) {
    Location nextLocation = location;
    final NodeList rfstrs = rbst.getElementsByTagName("aug:rfstr");    
    for (int i = 0; i < rfstrs.getLength(); i++) {
      Element bsr = (Element) rfstrs.item(i);
      updateBlockStatusRecord(bsr, nextLocation);
      nextLocation = nextLocation.newLocation(1 * bitsPerWord);
    }    
  }
  
  private void updateBlockStatusRecord(final Element bsr, final Location location) {
    if ("true".equals(bsr.getAttribute("empty"))) {
      return;
    }
    final LinkedHashMap<String, String> map = new LinkedHashMap<String, String>();    
    map.put(BlockStatusRecord.Record.rfexis.name(), bsr.getAttribute(BlockStatusRecord.Record.rfexis.name()));      
    map.put(BlockStatusRecord.Record.rfpart.name(), bsr.getAttribute(BlockStatusRecord.Record.rfpart.name()));
    map.put(BlockStatusRecord.Record.rfused.name(), bsr.getAttribute(BlockStatusRecord.Record.rfused.name()));
    map.put(BlockStatusRecord.Record.rffree.name(), bsr.getAttribute(BlockStatusRecord.Record.rffree.name()));
    map.put(BlockStatusRecord.Record.rfcore.name(), bsr.getAttribute(BlockStatusRecord.Record.rfcore.name()));
    BlockStatusRecord.update(this._wms, location, map);    
  }
  
  private void updateStructureBlock(final Element block, final Location location) {    
    final NodeList structureBlocks = block.getElementsByTagName("aug:structureBlock");
    if (structureBlocks.getLength() != 1) {
      throw new AugmentException("only one StructureBlock is allowed but has: " + structureBlocks.getLength());
    }
    Location nextLocation = location;
    final Element structureBlock = (Element) structureBlocks.item(0);
    final NodeList ringElements = structureBlock.getElementsByTagName("aug:ring");
    for (int i = 0; i < ringElements.getLength(); i++) {
      final Element ringElement = (Element) ringElements.item(i);
      updateRingElement(ringElement, nextLocation);
      nextLocation = nextLocation.newLocation(5 * bitsPerWord);     // TODO: replace constant value
    }
  }
  
  private void updateRingElement(final Element ringElement, final Location location) {
    if ("true".equals(ringElement.getAttribute("empty"))) {
      return;
    }
    final LinkedHashMap<String, String> map = new LinkedHashMap<String, String>();
    map.put(RingElement.Record.rsub.name(), ringElement.getAttribute(RingElement.Record.rsub.name()));
    map.put(RingElement.Record.rsuc.name(), ringElement.getAttribute(RingElement.Record.rsuc.name()));
    map.put(RingElement.Record.rsdb.name(), ringElement.getAttribute(RingElement.Record.rsdb.name()));
    map.put(RingElement.Record.rinst1.name(), ringElement.getAttribute(RingElement.Record.rinst1.name()));
    map.put(RingElement.Record.rinst2.name(), ringElement.getAttribute(RingElement.Record.rinst2.name()));
    map.put(RingElement.Record.rdummy.name(), ringElement.getAttribute(RingElement.Record.rdummy.name()));
    map.put(RingElement.Record.repet.name(), ringElement.getAttribute(RingElement.Record.repet.name()));
    map.put(RingElement.Record.rhf.name(), ringElement.getAttribute(RingElement.Record.rhf.name()));
    map.put(RingElement.Record.rtf.name(), ringElement.getAttribute(RingElement.Record.rtf.name()));
    map.put(RingElement.Record.rnamef.name(), ringElement.getAttribute(RingElement.Record.rnamef.name()));
    map.put(RingElement.Record.rtorgin.name(), ringElement.getAttribute(RingElement.Record.rtorgin.name()));
    map.put(RingElement.Record.rdelb.name(), ringElement.getAttribute(RingElement.Record.rdelb.name()));
    map.put(RingElement.Record.rnameh.name(), ringElement.getAttribute(RingElement.Record.rnameh.name()));
    map.put(RingElement.Record.rsid.name(), ringElement.getAttribute(RingElement.Record.rsid.name()));
    RingElement.update(this._wms, location, map);    
  }
  
  private void updateDataBlock(final Element block, final Location location) {
    Location nextLocation = location;
    final NodeList dataBlocks = block.getElementsByTagName("aug:dataBlock");
    if (dataBlocks.getLength() != 1) {
      throw new AugmentException("only one DataBlock is allowed but has: " + dataBlocks.getLength());
    }
    final Element dataBlock = (Element) dataBlocks.item(0);
    final NodeList sdbs = dataBlock.getElementsByTagName("aug:statementDataBlock");
    for (int i = 0; i < sdbs.getLength(); i++) {
      final Element sdb = (Element) sdbs.item(i);
      final int slength = updateStatementDataBlock(sdb, nextLocation);
      nextLocation = nextLocation.newLocation(slength * bitsPerWord);
    }
  }

  private int updateStatementDataBlock(final Element sdb, final Location location) {
    final NodeList sdbHeads = sdb.getElementsByTagName("aug:sdbhead");
    if (sdbHeads.getLength() != 1) {
      throw new AugmentException("only one sdbhead is allowed but has: " + sdbHeads.getLength());
    }
    final Element sdbHead = (Element) sdbHeads.item(0);
    updateStatementDataBlockHeader(sdbHead, location);

    final NodeList datas = sdb.getElementsByTagName("aug:data");
    if (datas.getLength() != 1) {
      throw new AugmentException("only one data is allowed but has: " + datas.getLength());
    }
    final Element data = (Element) datas.item(0);    
    final LinkedHashMap<String, String> map = new LinkedHashMap<String, String>();
    
    final int slength = Integer.parseInt(sdbHead.getAttribute(StatementDataBlockHeader.Record.slength.name()));
    if ("true".equals(sdbHead.getAttribute("sgarb"))) {
      map.put("textBase64", data.getAttribute("textBase64"));
      map.put("textBitSize", data.getAttribute("textBitSize"));
      StatementDataBlock.update(this._wms, location, map);
      return slength;
    }
    
    final String text = Util.convertInvisibleCharacters(data.getAttribute("text"), false);

    final int schars = Integer.parseInt(sdbHead.getAttribute(StatementDataBlockHeader.Record.schars.name()));
    if (schars != text.length()) {
      // TODO: need to handle invisible characters, which are currently printed as "ASC-5" or whatever
//      throw new AugmentException("length of text does not match schars field: " + text.length() + ", " + schars);
    }
    map.put(StatementDataBlock.Record.data.name(), text);    
    StatementDataBlock.update(this._wms, location, map);
    return slength;
  }
  
  private void updateStatementDataBlockHeader(final Element sdbHead, final Location location) {
    final LinkedHashMap<String, String> map = new LinkedHashMap<String, String>();
    map.put(StatementDataBlockHeader.Record.sgarb.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.sgarb.name()));
    map.put(StatementDataBlockHeader.Record.slength.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.slength.name()));
    if ("true".equals(sdbHead.getAttribute(StatementDataBlockHeader.Record.sgarb.name()))) {
      map.put("sdbhBase64", sdbHead.getAttribute("sdbhBase64"));
      map.put("sdbhBitSize", sdbHead.getAttribute("sdbhBitSize"));
    } else {
      map.put(StatementDataBlockHeader.Record.schars.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.schars.name()));
      map.put(StatementDataBlockHeader.Record.slnmdl.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.slnmdl.name()));
      map.put(StatementDataBlockHeader.Record.srnmdl.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.srnmdl.name()));
      map.put(StatementDataBlockHeader.Record.spsid.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.spsid.name()));
      map.put(StatementDataBlockHeader.Record.sname.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.sname.name()));
      map.put(StatementDataBlockHeader.Record.stime.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.stime.name()));
      map.put(StatementDataBlockHeader.Record.sinit.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.sinit.name()));
      map.put("sinitType", sdbHead.getAttribute("sinitType"));
      map.put(StatementDataBlockHeader.Record.sptype.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.sptype.name()));
      map.put(StatementDataBlockHeader.Record.spsdb.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.spsdb.name()));
      map.put(StatementDataBlockHeader.Record.sitpsid.name(), sdbHead.getAttribute(StatementDataBlockHeader.Record.sitpsid.name()));
    }
    StatementDataBlockHeader.update(this._wms, location, map);    
  }
}
