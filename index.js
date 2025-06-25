#!/usr/bin/env node
// require('ts-node/register');
// require('./analyzeProject.ts');

const getFile = require('./getFile.js');
const fs = require('fs');
const parser = require('./parser.js')
// import fs from 'fs';

// const currPath = getFile.getCurrPath()
const currPath = 'D:\\code\\umi\\analyze\\analyzeTSX'
console.log('解析项目目录:', currPath);

// const srcPath = getFile.getSrcDirPath();
const srcPath = 'D:\\code\\umi\\analyze\\analyzeTSX\\src'
console.log('index: srcPath', srcPath);

if(srcPath == ''){
    console.error('请在src的同级目录下执行命令');
    return ''
}

// 读取当前目录下文件
const currFileList = fs.readdirSync(srcPath, {recursive : false});
// console.log(currFileList)
const toParserFileList = getFile.getAllFileFromPath(currFileList);

// 文件节点Map
const importInfoMap = new Map();
for( let i of toParserFileList){
    const importInfo = parser.getImportInfo(i, srcPath);
    // console.log('importInfo', importInfo)
    importInfoMap.set(importInfo.filePath, importInfo)
}
console.log('index: importInfoMap', importInfoMap)
// return;
// 项目的根节点
const rootSet = new Set();
// // 将解析节点放入树状图中
// for ( let filePath of importInfoMap.keys()){
//     const importInfoClass = importInfoMap.get(filePath);
//     // console.log('index: filePath', filePath)
//     // console.log('index: importInfo.sonImport', importInfoClass.sonImport)
//     for (sonFilePath of importInfoClass.sonImport){
//         const sonImportInfoClass = importInfoMap.get(sonFilePath);
//         // console.log('index: sonFilePath, sonImportInfoClass', sonImportInfoClass)
//         // 是项目中组件时，添加父组件信息
//         if(sonImportInfoClass){
//             sonImportInfoClass.fatherSet(filePath);
//             // console.log('index: sonImportInfoClass', sonImportInfoClass)
//         }
//     }
//     // if(importInfo.sonImport)
// }

// 获取路由页面

// 需通过routeConfig文件名或者route对象解析路由信息，判断是否为路由文件
// 获取路由配置信息
// const routePath = 'D:/code/umi/analyze/analyzeTSX/src/pages/customConfig/routeConfig.tsx';

// const routeInfo = require(routePath);
// console.log('index: routeInfo', routeInfo, typeof routeInfo)

// 获取根文件(路由文件)的导入信息
const routePath = './src/layouts/route/index.tsx';
// const sourceFile = parser.getAstInfo(routePath);
// console.log('index: sourceFile', sourceFile);
const rootRouteImports = parser.getImportInfo(routePath, srcPath);
console.log('index: rootRouteImport', rootRouteImports)
console.log('index: rootRouteImports.sonImport', rootRouteImports.sonImport)

console.log('----------------tree')
for(let rootRouteImport of rootRouteImports.importInfoList){
    console.log('rootRouteImport', rootRouteImport, rootRouteImport.isSelfImport);
    if(!rootRouteImport.isSelfImport){
        continue;
    }
    console.log('father: ', rootRouteImport);
    console.log('index: rootRouteImport.filePath', rootRouteImport.packageName)
    console.log('index: importInfoMap.keys()', importInfoMap.keys())
    const sonNode = importInfoMap.get(rootRouteImport.packageName);
    console.log('son:', sonNode)
}
// console.log('index: importInfoMap', importInfoMap)
// console.log('----------------------')

// for(let a of importInfoMap.keys()){
//     console.log('index: importInfoMap.get(a)', importInfoMap.get(a))
// }

