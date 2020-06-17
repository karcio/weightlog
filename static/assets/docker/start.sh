#!/bin/bash

echo "Clone repository"
git clone -b develop https://github.com/karcio/weightlog.git

cd weightlog

echo "Install nodemon"
npm install -g nodemon

echo "Install app dependencies"
npm install

#hostname -i
nodemon app.js 