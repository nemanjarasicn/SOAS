#!/bin/bash

pwd 
cd client/


# install all for client
npm install 
if [ $? -eq 0 ] # this condition return 1 if last command executed, and 0 if not executed corectly
then
  echo "SUCCESS for install client"
else
  echo "FAIL for install  client"
fi

# start the frontend 
ng build
if [ $? -eq 0 ] # this condition return 1 if last command executed, and 0 if not executed corectly
then
  echo "SUCCESS for start client"
else
  echo "FAIL for start client"
fi