/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.writer;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.nlsaugment.augxml.exception.AugmentException;
import org.nlsaugment.augxml.model.AugmentFile;
import org.nlsaugment.augxml.model.Block;
import org.nlsaugment.augxml.model.BlockHeader;
import org.nlsaugment.augxml.model.BlockStatusRecord;
import org.nlsaugment.augxml.model.BlockStatusTable;
import org.nlsaugment.augxml.model.DataBlock;
import org.nlsaugment.augxml.model.DataBlockStatusTable;
import org.nlsaugment.augxml.model.DataElement;
import org.nlsaugment.augxml.model.FileHeaderBlock;
import org.nlsaugment.augxml.model.MarkerRecord;
import org.nlsaugment.augxml.model.MarkerTable;
import org.nlsaugment.augxml.model.RingBlockStatusTable;
import org.nlsaugment.augxml.model.RingElement;
import org.nlsaugment.augxml.model.StatementDataBlock;
import org.nlsaugment.augxml.model.StatementDataBlockHeader;
import org.nlsaugment.augxml.model.StructureBlock;
import org.nlsaugment.augxml.type.AugBlockIndex;
import org.nlsaugment.augxml.type.AugUnsignedNumber;
import org.nlsaugment.augxml.util.MetaData;
import org.nlsaugment.augxml.util.Util;
import org.nlsaugment.augxml.util.XmlSerializer;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import base64.Base64;

/**
 * This file writer is a lossless writer. In other words, it preserves complete
 * information about the original Augment file. Files written by this writer can
 * be converted back into the original Augment file format and the converted
 * file will be byte-equivalent with the original.
 * 
 * @author Jonathan Cheyer
 * 
 */
public final class LosslessFileWriter implements IAugmentWriter {
  private static final String __propertyLossless = "augxml.writer.lossless.";
  private static final String __propertyUri = __propertyLossless + "namespace.uri";
  private static final String __propertyPrefix = __propertyLossless + "namespace.prefix";

  public LosslessFileWriter() {
  }

  public void save(final AugmentFile file, final MetaData metaData,
      final String filename) {
    final Document xmlDocument = convert(file, metaData);
    XmlSerializer.serialize(xmlDocument, filename);
  }

  private Document convert(final AugmentFile file, final MetaData metaData) {
    try {
      final Document document = DocumentBuilderFactory.newInstance()
          .newDocumentBuilder().newDocument();
      final Element rootElement = document.createElementNS(metaData.get(__propertyUri),
          metaData.get(__propertyPrefix) + "document");
      document.appendChild(rootElement);
      for (Block block : file.getBlocks()) {
        final Element childElement = convert(block, document, metaData);
        rootElement.appendChild(childElement);
      }
      return document;
    } catch (ParserConfigurationException e) {
      throw new AugmentException("unable to create new XML structure", e);
    }
  }

  private Element convert(final Block block, final Document document, final MetaData metaData) {
    final Element element = document.createElementNS(__propertyUri, metaData.get(__propertyPrefix)
        + "block");

    element.setAttribute("recordNumber", Integer.toString(block
        .getRecordNumber()));
    element.setAttribute("locationNumber", block.getLocation().toString());
    String type = "";
    if (block.isEmpty()) {
      element.setAttribute("empty", "true");
    } else {
      final Element blockHeader = convert(block.getBlockHeader(), document, metaData);
      element.appendChild(blockHeader);
      if (block instanceof FileHeaderBlock) {
        FileHeaderBlock fhb = (FileHeaderBlock) block;
        final Element fileHeader = convert(fhb, document, metaData);
        element.appendChild(fileHeader);
        type = "fileHeader";
      } else if (block instanceof StructureBlock) {
        StructureBlock sb = (StructureBlock) block;
        final Element structureBlock = convert(sb, document, metaData);
        element.appendChild(structureBlock);
        type = "structure";
      } else if (block instanceof DataBlock) {
        DataBlock db = (DataBlock) block;
        final Element dataBlock = convert(db, document, metaData);
        element.appendChild(dataBlock);
        type = "data";
      } else {
        throw new AugmentException("invalid block type: "
            + block.getClass().getName());
      }
    }
    element.setAttribute("type", type);
    return element;
  }

  private Element convert(final BlockHeader blockHeader, final Document document, final MetaData metaData) {
    final Element element = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
        + "blockHeader");

    element.setAttribute("locationNumber", blockHeader.getLocation().toString());
    
    final AugUnsignedNumber statusTableIndex = blockHeader.getStatusTable();
    element.setAttribute(BlockHeader.Record.fbind.toString(), statusTableIndex
        .toString());

    final AugBlockIndex pageIndex = blockHeader.getBlockNumber();
    element.setAttribute(BlockHeader.Record.fbpnum.toString(), pageIndex
        .toString());

    final BlockHeader.BlockType type = blockHeader.getType();
    element.setAttribute(BlockHeader.Record.fbtype.toString(), type.toString());

    return element;
  }

  private Element convert(final FileHeaderBlock fhb, final Document document, final MetaData metaData) {
    final Element element = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
        + "fileHeaderBlock");
    element.setAttribute("locationNumber", fhb.getLocation().newLocation(fhb.getBlockHeader().getNumBits()).toString());
    element.setAttribute(FileHeaderBlock.Record.filhed.toString(), Base64.encodeBytes(fhb.getFilhed().getValue().toBytes()));
    element.setAttribute("filhedBitSize", Integer.toString(fhb.getFilhed().getValue().getSize()));
    element.setAttribute("filhedMaxLength", fhb.getFilhedMaxLength().toString());
    element.setAttribute("filhedActualLength", fhb.getFilhedActualLength().toString());
    element.setAttribute("filhedText", fhb.getFilhedText().toString());
    element.setAttribute(FileHeaderBlock.Record.fcredt.toString(), fhb
        .getCreationDate().toString());
    element.setAttribute(FileHeaderBlock.Record.nlsvwd.toString(), fhb
        .getAugmentVersion().toString());
    element.setAttribute(FileHeaderBlock.Record.sidcnt.toString(), fhb
        .getSidCount().toString());
    element.setAttribute(FileHeaderBlock.Record.finit.toString(), Util
        .convertInvisibleCharacters(fhb.getLastModUser().toString()));
    element.setAttribute("finitType", fhb.getLastModUserType().toString());
    element.setAttribute(FileHeaderBlock.Record.funo.toString(), fhb
        .getFileOwner().toString());
    element.setAttribute(FileHeaderBlock.Record.lwtim.toString(), fhb
        .getLastModTime().toString());
    element.setAttribute(FileHeaderBlock.Record.namdl1.toString(), fhb
        .getLeftDelimiter().toString());
    element.setAttribute(FileHeaderBlock.Record.namdl2.toString(), fhb
        .getRightDelimiter().toString());
    element.setAttribute(FileHeaderBlock.Record.rngl.toString(), fhb
        .getNumRings().toString());
    element.setAttribute(FileHeaderBlock.Record.dtbl.toString(), fhb
        .getNumData().toString());
    final Element rbst = convert(fhb.getRingBlockStatusTable(), document, metaData);
    element.appendChild(rbst);
    final Element dbst = convert(fhb.getDataBlockStatusTable(), document, metaData);
    element.appendChild(dbst);
    element.setAttribute(FileHeaderBlock.Record.mkrtxn.toString(), fhb
        .getMaxMarkerTableLength().toString());
    element.setAttribute(FileHeaderBlock.Record.mkrtbl.toString(), fhb
        .getMarkerTableLength().toString());
    final Element mkrtb = convert(fhb.getMarkerTable(), document, metaData);
    element.appendChild(mkrtb);
    return element;
  }

  private Element convert(final MarkerTable markerTable, final Document document, final MetaData metaData) {
    final Element element = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
        + "mkrtb");
    final MarkerRecord[] records = markerTable.getRecords();
    final int numRecords = markerTable.getNumRecords();
    for (int i = 0; i < records.length; i++) {
      final MarkerRecord record = records[i];
      if (record.getBits().isEmpty()) {
        if (i < numRecords) {
          throw new AugmentException("marker should not be null but is null");
        }
        continue;
      }
      final Element childElement = convert(record, document, markerTable
          .getNumRecords(), metaData);
      element.appendChild(childElement);
    }
    return element;
  }

  private Element convert(final MarkerRecord markerRecord,
      final Document document, final int numRecords, final MetaData metaData) {
    final Element element = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
        + "mrker");
    element.setAttribute("locationNumber", markerRecord.getLocation().toString());
    element.setAttribute("mkname", Util.trimNulChars(markerRecord.getMkname().toString())); 
    element.setAttribute("mkpsid", markerRecord.getMkpsid().toString());
    element.setAttribute("mkfix", markerRecord.getMkfix().toString());
    element.setAttribute("mkccnt", markerRecord.getMkccnt().toString());
    element.setAttribute("mkexis", markerRecord.getMkexis().toString());
    return element;
  }

  private Element convert(final BlockStatusTable bst, final Document document, final MetaData metaData) {
    String name;
    if (bst instanceof RingBlockStatusTable) {
      name = FileHeaderBlock.Record.rngst.toString();
    } else if (bst instanceof DataBlockStatusTable) {
      name = FileHeaderBlock.Record.dtbst.toString();
    } else {
      throw new AugmentException("invalid block status table: "
          + bst.getClass().getName());
    }
    final Element element = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
        + name);
    for (BlockStatusRecord bsr : bst.getRecords()) {
      final Element childElement = convert(bsr, document, metaData);
      element.appendChild(childElement);
    }
    return element;
  }

  private Element convert(final BlockStatusRecord bsr, final Document document, final MetaData metaData) {
    final Element element = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
        + BlockStatusTable.Record.rfstr.toString());
    element.setAttribute("recordNumber", Integer
        .toString(bsr.getRecordNumber()));
    element.setAttribute("locationNumber", bsr.getLocation().toString());
    if (bsr.isEmpty()) {
      element.setAttribute("empty", "true");
    } else {
      element.setAttribute(BlockStatusRecord.Record.rfexis.toString(), bsr
          .getExists().toString());
      element.setAttribute(BlockStatusRecord.Record.rfpart.toString(), bsr
          .getPartial().toString());
      element.setAttribute(BlockStatusRecord.Record.rfused.toString(), bsr
          .getUsed().toString());
      element.setAttribute(BlockStatusRecord.Record.rffree.toString(), bsr
          .getFree().toString());
      element.setAttribute(BlockStatusRecord.Record.rfcore.toString(), bsr
          .getCore().toString());
    }
    return element;
  }

  private Element convert(final StructureBlock sb, final Document document, final MetaData metaData) {
    final Element element = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
        + "structureBlock");
    final RingElement[] re = sb.getRingElements();
    for (int i = 0; i < re.length; i++) {
      final Element childElement = convert(re[i], sb.getLocation()
          .getPageIndex(), document, metaData);
      element.appendChild(childElement);
    }
    return element;
  }

  private Element convert(final RingElement re, final int blockNumber,
      final Document document, final MetaData metaData) {
    // TODO - clean up method, remove blockNumber parameter
    final Element element = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
        + "ring");

    element
        .setAttribute("recordNumber", Integer.toString(re.getRecordNumber()));
    element.setAttribute("locationNumber", re.getLocation().toString());
    element.setAttribute("psidNumber", re.getPsid().toString());
    if (re.isEmpty()) {
      element.setAttribute("empty", "true");
    } else {
      element.setAttribute(RingElement.Record.rsub.toString(), re
          .getSubstatementPsid().toString());
      element.setAttribute(RingElement.Record.rsuc.toString(), re
          .getSuccessorPsid().toString());
      element.setAttribute(RingElement.Record.rsdb.toString(), re
          .getPropertyPsid().toString());
      element.setAttribute(RingElement.Record.rinst1.toString(), re
          .getDexInterpolationString1().toString());
      element.setAttribute(RingElement.Record.rinst2.toString(), re
          .getDexInterpolationString2().toString());
      element.setAttribute(RingElement.Record.rdummy.toString(), re
          .getDexDummyFlag().toString());      
      element.setAttribute(RingElement.Record.repet.toString(), re
          .getDexRepetition().toString());
      element.setAttribute(RingElement.Record.rhf.toString(), re.getHeadFlag()
          .toString());
      element.setAttribute(RingElement.Record.rtf.toString(), re.getTailFlag()
          .toString());
      element.setAttribute(RingElement.Record.rnamef.toString(), re
          .getNameFlag().toString());
      element.setAttribute(RingElement.Record.rtorgin.toString(), re
          .getOriginFlag().toString());
      element.setAttribute(RingElement.Record.rdelb.toString(), re
          .getDeleteBranchFlag().toString());      
      element.setAttribute(RingElement.Record.rnameh.toString(), re
          .getNameHash().toString());
      element.setAttribute(RingElement.Record.rsid.toString(), Util.formatSid(re.getSid()));
    }
    return element;
  }

  private Element convert(final DataBlock db, final Document document, final MetaData metaData) {
    final Element element = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
        + "dataBlock");
    final DataElement[] dataElements = db.getDataElements();
    if (dataElements.length == 0) {
    	throw new AugmentException("dataElements.length is zero");
    }
    for (int i = 0; i < dataElements.length; i++) {
      final DataElement dataElement = dataElements[i];
      if (! (dataElement instanceof StatementDataBlock)) {
        throw new AugmentException(
            "DataElements which are not StatementDataBlocks are not currently supported");
      }

      final Element child = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
          + "statementDataBlock");
      element.appendChild(child);

      final StatementDataBlock sdb = (StatementDataBlock) dataElement;
      final Element childSdb = convert(sdb, document, metaData);

      final StatementDataBlockHeader sdbh = sdb.getStatementDataBlockHeader();
      final Element childSdbh = convert(sdbh, document, metaData);

      child.appendChild(childSdbh);
      child.appendChild(childSdb);
    }
    return element;
  }

  private Element convert(final StatementDataBlockHeader sdbh,
      final Document document, final MetaData metaData) {
    final Element element = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
        + "sdbhead");
    element.setAttribute("locationNumber", sdbh.getLocation().toString());
    element.setAttribute("psdbNumber", sdbh.getPsdb().toString());

    if (sdbh.isEmpty()) {
    	element.setAttribute("empty", "true");
    	return element;
    }

    element.setAttribute(StatementDataBlockHeader.Record.sgarb.toString(), sdbh
        .getGarbageFlag().toString());
    if (sdbh.getGarbageFlag().getValue()) {
      element.setAttribute(StatementDataBlockHeader.Record.slength.toString(),
          sdbh.getNumberOfWords().toString());
      element.setAttribute("sdbhBase64", sdbh.getBase64Data());
      element.setAttribute("sdbhBitSize", Integer.toString(sdbh.getBits().getSize()));
      element.setAttribute("sdbhBinary", sdbh.getBits().toBinary());
    } else {
      element.setAttribute(StatementDataBlockHeader.Record.slength.toString(),
          sdbh.getNumberOfWords().toString());
      element.setAttribute(StatementDataBlockHeader.Record.schars.toString(),
          sdbh.getNumberOfCharacters().toString());
      element.setAttribute(StatementDataBlockHeader.Record.slnmdl.toString(),
          sdbh.getLeftDelimiter().toString());
      element.setAttribute(StatementDataBlockHeader.Record.srnmdl.toString(),
          sdbh.getRightDelimiter().toString());
      element.setAttribute(StatementDataBlockHeader.Record.spsid.toString(),
          sdbh.getStatementPsid().toString());
      element.setAttribute(StatementDataBlockHeader.Record.sname.toString(),
          sdbh.getPositionAfterStatementName().toString());
      element.setAttribute(StatementDataBlockHeader.Record.stime.toString(),
          sdbh.getCreationDate().toString());
      element.setAttribute(StatementDataBlockHeader.Record.sinit.toString(),
          Util.convertInvisibleCharacters(sdbh.getCreationUser().toString()));
      element.setAttribute("sinitType", sdbh.getCreationUserType().toString());
      element.setAttribute(StatementDataBlockHeader.Record.sptype.toString(),
          Long.toOctalString(sdbh.getPropertyType()));
      element.setAttribute(StatementDataBlockHeader.Record.spsdb.toString(),
          sdbh.getNextDataBlock().toString());
      element.setAttribute(StatementDataBlockHeader.Record.sitpsid.toString(),
          sdbh.getInferiorTree().toString());
    }
    return element;
  }

  private Element convert(final StatementDataBlock sdb, final Document document, final MetaData metaData) {
    final Element element = document.createElementNS(metaData.get(__propertyUri), metaData.get(__propertyPrefix)
        + "data");
    final StatementDataBlockHeader sdbh = sdb.getStatementDataBlockHeader();
    element.setAttribute("locationNumber", sdb.getLocation().toString());
    if (sdb.isEmpty()) {
    	element.setAttribute("empty", "true");
    	return element;
    }
    if (sdbh.getGarbageFlag().getValue()) {
      element.setAttribute("textBase64", sdb.getBase64Data());
      element.setAttribute("textBitSize", Integer.toString(sdb.getBits().getSize()));
    } else {
      element.setAttribute("text", Util.convertInvisibleCharacters(sdb.getText()));
    }
    return element;
  }
}
