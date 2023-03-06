#!/bin/bash

pwd

# first we install all for node 
npm install
if [ $? -eq 0 ] # this condition return 1 if last command executed, and 0 if not executed corectly
then
  echo "SUCCESS for node install"
else
  echo "FAIL for node install"
fi


# compile 
tsc -t es5 app.ts "@tsc_files_to_compile.txt"
if [ $? -eq 0 ] # this condition return 1 if last command executed, and 0 if not executed corectly
then
  echo "SUCCESS for node compile"
else
  echo "FAIL for node compile"
fi

# start node server
npm start
if [ $? -eq 0 ] # this condition return 1 if last command executed, and 0 if not executed corectly
then
  echo "SUCCESS for node start"
else
  echo "FAIL for node start"
fi


