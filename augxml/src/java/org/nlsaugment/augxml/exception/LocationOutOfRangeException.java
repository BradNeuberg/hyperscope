/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.exception;


public final class LocationOutOfRangeException extends AugmentException {
  private static final long serialVersionUID = 1L;
  
  public LocationOutOfRangeException(final String message) {
    super(message);
  }
  
  public LocationOutOfRangeException(final String message, final Exception e) {
    super(message, e);
  }  
}
