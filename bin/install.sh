#!usr/bin/env bash

ls | grep ace-builds

if [ $? ]
then
  echo 'Removing prior ace builds...'
  rm -rf ./ace-builds
fi

echo 'Cloning ace builds'
git clone https://github.com/ajaxorg/ace-builds
