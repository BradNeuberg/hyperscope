/**
 * HyperScope Project - augxml
 * Copyright (C) 2006 Bootstrap Alliance
 * All rights reserved.
 * 
 * Licensed under GPL Version 2.
 * http://www.gnu.org/licenses/gpl.html
 */
package org.nlsaugment.augxml.util;

import static org.nlsaugment.augxml.Constants.NUL;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.nlsaugment.augxml.type.AugUnsignedNumber;

/**
 * Various useful utility methods.
 * @author Jonathan Cheyer
 *
 */
public final class Util {
  
  /**
   * Remove any initial and trailing NUL characters (ASCII ordinal value of 0). Similar to the
   * String.trim() method, but applied to NUL characters instead of white space. NUL characters
   * in the middle of the string are not removed.
   * @param s
   * @return a string with no initial and NUL characters
   * @throws NullPointerException if s is null 
   */
  public static String trimNulChars(String s) {   
    if (s == null) {
      throw new NullPointerException("s is null");
    }
    int start = 0;
    int end = s.length();
    while (start < end && s.charAt(start) == NUL) {
      start++;
    }
    while (start < end && s.charAt(end - 1) == NUL) {
      end--;
    }
    if (start > 0 || end < s.length()) {
      return s.substring(start, end);
    }
    return s;
  }
  
  /**
   * Convert characters that are not displayable into their ordinal equivalents using
   * the format (ASC-XYZ) where X, Y, and Z are decimal digits. Non-displayable characters 
   * are in the range (0,31) and (127-255) inclusive.
   * @param s
   * @return the converted string
   */
  public static String convertInvisibleCharacters(final String s) {
    return convertInvisibleCharacters(s, true);
  }
  
  public static String convertInvisibleCharacters(final String s, final boolean forward) {
    if (forward) {
      return handleInvisibleCharacters(s, true);
    }
    return revertInvisibleCharacters(s);
  }
  
  /**
   * Remove characters that are not displayable. Non-displayable characters are in
   * the range (0,31) and (127-255) inclusive.
   * @param s
   * @return the string without invisible characters
   */
  public static String removeInvisibleCharacters(final String s) {
    return handleInvisibleCharacters(s, false);
  }
  
  /**
   * if convert is true, then use the format (ASC-XYZ) to display invisible characters. Otherwise,
   * ignore them completely. 
   * @param s
   * @param convert
   * @return a string whos invisible characters are either converted or removed (depending on 
   * the convert flag)
   */
  private static String handleInvisibleCharacters(final String s, final boolean convert) {
    final StringBuilder sb = new StringBuilder();
    for (int i = 0; i < s.length(); i++) {
      final char kar = s.charAt(i);
      if (kar >= 32 & kar < 127) {
        sb.append(kar);
      } else {
        if (convert) {
          sb.append("(ASC-" + ((int) kar) + ")");
        }
      }
    }
    return sb.toString();
  }

  private static String revertInvisibleCharacters(final String s) {
    final Pattern p = Pattern.compile("\\(ASC-([0-9]{1,2})\\)");
    final Matcher m = p.matcher(s);
    final StringBuffer sb = new StringBuffer();
    while (m.find()) {
      final int val = Integer.valueOf(m.group(1));
      final Character ch = (char) val;
      m.appendReplacement(sb, ch.toString());
    }
    m.appendTail(sb);
    return sb.toString();
  }
  
  public static String formatDate(final Date date) {
    SimpleDateFormat sdf = new SimpleDateFormat("EEE d MMM yyyy HH:mm:ss z");
    sdf.setTimeZone(TimeZone.getTimeZone("GMT+0"));    
    return sdf.format(date);
  }
  
  /**
   * Transform any Augment-style links found within the String into HTML-style links.
   * <p>The following Augment-style links will match:
   *  <ul>
   *  <li>&lt;link&gt;</li>
   *  <li>[link]</li>
   *  <li>(link)</li>
   *  <li>(see-- link)</li>
   *  </ul> 
   * @param s
   * @return a string containing only HTML-style links 
   */
  public static String transformLinks(final String s, final List<Map<String, String>> transformers) {
    String result = s;
    for (Map<String, String> transform : transformers) {
      final String start = transform.get("start");
      final String end = transform.get("end");
      if (start != null && end != null) {
        result = transformLink(start, end, result);
      }
    }
    return result;
  }

  private static String transformLink(final String pre, final String post, final String s) {
    final String pattern = "(.*)" + escapeRegex(pre) + "(.*)" + escapeRegex(post) + "(.*)";
    final Pattern p1 = Pattern.compile(pattern);
    final Matcher m1 = p1.matcher(s);
    if (m1.matches()) {
      final String anchor = "#";
      final String link = anchor + escapeRegex(m1.group(2));
      final String name = escapeRegex(pre + m1.group(2) + post);
      return m1.replaceAll(m1.group(1) + href(name, link) + m1.group(3));
    }
    return s;
  }

  /**
   * Convert various line feeds ('\n', '\r', '\037') to an HTML "<BR/>".
   * @param s
   * @return the transformed string
   */
  public static String transformLF(final String s) {
    String result = s.replaceAll("\n", "<BR/>");
    result = result.replaceAll("\r", "<BR/>");
    // ASCII decimal #31 (037 octal); Unit Separator; seems to be used by Augment for line feeds.
    // TODO: verify.
    result = result.replaceAll("\037", "<BR/>");
    return result;
  }
  

  private static String href(final String name, final String link) {
    return "<a href=\"" + escapeHtml(link) + "\">" + escapeHtml(name) + "</a>";
  }
  
  private static String escapeRegex(final String s) {
    final String regex = ".\\?*+&:{}[]()^$";
    final StringBuilder sb = new StringBuilder();
    for (int i = 0; i < s.length(); i++) {
      if (regex.indexOf(s.charAt(i)) >= 0) {
        sb.append("\\");        
      }
      sb.append(s.charAt(i));
    }
    return sb.toString();
  }
  
  private static String escapeHtml(final String s) {
    String result = s.replaceAll("&", "&amp;");
    result = result.replaceAll("\"", "&quot;");
    result = result.replaceAll("<", "&lt;");
    result = result.replaceAll(">", "&gt;");
    return result;
  }
  
  /**
   * Return the statement label (aka statement name) of a node.
   * @param leftDelimiter
   * @param rightDelimiter
   * @param text
   * @return the statement label of the node
   */
  public static String getLabel(final char leftDelimiter, final char rightDelimiter, final String text) {
    final int leftPos = getLeftPos(leftDelimiter, text);
    final int rightPos = leftPos + getRightPos(rightDelimiter, text.substring(leftPos));
    return text.substring(leftPos, rightPos);
  }
  
  private static int getLeftPos(final char leftDelimiter, final String text) {
    if ("".equals(leftDelimiter)) {
      return 0;
    }
    int pos = text.indexOf(leftDelimiter);
    if (pos == -1) {
      pos = 0;
    }
    return pos;       
  }
  
  private static int getRightPos(final char rightDelimiter, final String text) {
    int pos;
    if ("".equals(rightDelimiter)) {
      pos = -1;
    } else {
      pos = text.indexOf(rightDelimiter);
    }
    final String validLabelCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-@'";
    final int maxLabelLength = 100; // Statement names cannot be more than 100 characters;
    for (int i = 0; i < maxLabelLength && i < text.length(); i++) {
      if (validLabelCharacters.indexOf(text.charAt(i)) == -1) {
        pos = i;
        break;
      }
    }
    if (pos == -1) {  
      pos = text.indexOf(" ");
      if (pos == -1) {
        pos = text.length();
      }
    }
    if (pos >= maxLabelLength) {
      pos = maxLabelLength;
    }
    return pos;
  }
  
  public static String formatSid(AugUnsignedNumber sid) {
    return "0" + sid.toString();
  }
}
