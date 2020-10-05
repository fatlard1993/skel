#!/bin/bash

echo "skel: ${1}"
echo "template: ${2}"

cd $2

chmod +x ./src/index.js || chmod +x ./server/index.js

npm i