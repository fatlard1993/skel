#!/bin/bash

echo "skel: ${1}"
echo "template: ${2}"

cd $2

chmod +x ./gradlew

./gradlew vscode
./gradlew genSources