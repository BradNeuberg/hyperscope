/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.util;

import java.util.HashMap;
import java.util.List;

import org.nlsaugment.augxml.memory.Location;
import org.nlsaugment.augxml.model.Block;
import org.nlsaugment.augxml.model.RingElement;
import org.nlsaugment.augxml.model.StructureBlock;

/**
 * Track all RingElement Locations. Used to verify that all PSIDs are valid in a file.
 * @author Jonathan Cheyer
 *
 */
public final class RingElementManager {
  private final HashMap<Location, RingElement> _map = new HashMap<Location, RingElement>();
  public RingElementManager(final List<Block> blocks) {
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
        final Location psid = re[j].getPsid();
        put(psid, re[j]);
      }
    }
  }
  
  public RingElement get(final Location location) {
    return this._map.get(location);
  }
  
  private void put(final Location location, final RingElement ringElement) {
    this._map.put(location, ringElement);
  }
}
