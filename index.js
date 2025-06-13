#!/usr/bin/env node
// require('ts-node/register');
// require('./analyzeProject.ts');

const getFile = require('./getFile.js');
const fs = require('fs');
const parser = require('./parser.js')
// import fs from 'fs';

const currPath = getFile.getCurrPath()
console.log('解析项目目录:', currPath);

const srcPath = getFile.getSrcDirPath();
console.log('index: srcPath', srcPath);

if(srcPath == ''){
    console.error('请在src的同级目录下执行命令');
    return ''
}

// 读取当前目录下文件
const currFileList = fs.readdirSync(currPath, {recursive : false});
// console.log(currFileList)
const toParserFileList = getFile.getAllFileFromPath(currFileList);
for( let i of toParserFileList){


    const importInfo = parser.getImportInfo(i, srcPath);
    console.log('importInfo', importInfo)
}


