#!/bin/bash

####
# HyperScope Project - augxml
# Copyright (C) 2006 Bootstrap Alliance
# All rights reserved.
# 
# Licensed under GPL Version 2.
# http://www.gnu.org/licenses/gpl.html
#
# Author: Jonathan Cheyer
####

top=$(cd `dirname $0` && pwd)
JAVA_HOME=${JAVA_HOME:?"JAVA_HOME not set"}

jvmargs=
args=
while getopts :D: o; do
  case "$o" in 
    D)    jvmargs="$jvmargs -D$OPTARG";;
    [?])  args="$args -$OPTARG";;
  esac
done
shift $(($OPTIND-1))

cp=$top/augxml.jar
cp=$cp:$top/base64.jar

$JAVA_HOME/bin/java $jvmargs -classpath $cp org.nlsaugment.augxml.AugXml $args $@

