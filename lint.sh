#!/bin/bash
echo $1 | ./node_modules/.bin/commitlint > error_message.txt
pwd
