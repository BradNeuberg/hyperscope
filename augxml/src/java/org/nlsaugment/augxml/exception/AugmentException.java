/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.exception;

/**
 * All exceptions that are thrown in AugXml should use or subclass this exception.
 * @author Jonathan Cheyer
 */
public class AugmentException extends RuntimeException {
  private static final long serialVersionUID = 1L;

  public AugmentException(final String message) {
    super(message);
  }
  
  public AugmentException(final String message, final Exception e) {
    super(message, e);
  }  
}
