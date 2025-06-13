const path = require('path');
const fs = require('fs');

// 需要解析的文件后缀
const IS_PARSER_FILE_KEYWORD = ['.js', '.ts', '.tsx'];
// 需要剔除的文件名称
const NO_NEED_PARSER_DIRNAME = ['node_modules']
/**
 * 获取输入命令位置的当前区域
 * @returns 当前文件所在路径
 */
const getCurrPath = () => {
    const currPath = path.resolve('./');
    return currPath;
}

// 获取项目下src目录的绝对路径
const getSrcDirPath = () =>{
    const currPath = getCurrPath();
    const srcPath = currPath + '/' + 'src';
    if(fs.existsSync(srcPath)){
        return srcPath;
    }
    return '';
}

/**
 * 输入文件路径，返回是否为文件夹
 * @param {string} pathName 文件路径
 * @returns 是否为文件夹
 */
const isDir = (pathName) => {
    const stats = fs.statSync(pathName);
    let flag = false;
    if (stats.isFile()) {
        flag = false;
    } else if (stats.isDirectory()) {
        flag = true;
    }
    return flag;
}

// 判断文件夹是否继续获取
/**
 * 当前文件夹是否需要继续获取子文件
 * @param {string} dirName 文件夹名称
 * @returns 需要继续解析
 */
const isParserDir = (dirName) => {
    let flag = true;
    if (NO_NEED_PARSER_DIRNAME.includes(dirName)) {
        flag = false;
    }
    // 开头为.的隐藏文件不获取
    if (dirName.indexOf('.') == 0) {
        flag = false;
    }
    return flag;
}

// 递归获取所有文件目录
const getAllFileFromPath = (filePathList) => {
    // 将传入的路径转成绝对路径
    const absoluteFileList = filePathList.map(
        relavateFilePath => path.resolve(relavateFilePath)
    )
    const pathQueue = absoluteFileList;
    const deepFileList = [];
    while (pathQueue.length !== 0) {
        const absouleFilePath = pathQueue.pop();
        const fileName = getFileName(absouleFilePath);

        // 提前过滤不符合的文件夹名称和隐藏文件
        if (!isParserDir(fileName)) {
            continue;
        }

        // 当前为文件夹，并且符合筛选条件，则加入解析文件夹列表
        if (isDir(absouleFilePath) && !NO_NEED_PARSER_DIRNAME.includes(fileName)) {
            const sonFileList = fs.readdirSync(absouleFilePath);
            sonFileList.forEach(sonFile => {
                const sonAbsolutePath = path.join(absouleFilePath, sonFile);
                pathQueue.push(sonAbsolutePath)
            });
        }
        // 当前为文件，且文件后缀符合条件，则加入解析文件列表
        if (!isDir(absouleFilePath) && isParserFile(fileName)) {
            deepFileList.push(absouleFilePath);
        }
    }
    return deepFileList;
}

// 判断是否为需要解析的文件
/**
 * 判断是否为js/ts/tsx等需要解析成ast的文件
 * @param {string} filePath 文件名称/文件路径
 * @returns 是否需要解析成ast
 */
const isParserFile = (filePath) => {
    const fileLastName = filePath.substring(filePath.indexOf("."));
    if (IS_PARSER_FILE_KEYWORD.includes(fileLastName)) {
        return true;
    }
    return false;
}

/**
 * 根据文件路径获取文件名称
 * @param {string} pathName 文件路径
 * @returns 文件名称
 */
const getFileName = (pathName) => {
    // return fileName.substring(0, fileName.indexOf("."))
    return pathName.substring(pathName.lastIndexOf("\\") + 1);
}

/**
 * 输入文件绝对路径，返回文件内容
 * @param {string} pathName 文件路径
 * @returns 文件内容
 */
const getFileContent = (pathName) => {
    const content = fs.readFileSync(currPath);
    return content
}

// 根据导入信息路径获取绝对路径 - ./  @  @@
// 考虑 ./  ../  @ 等路径
// 没有"/"的视为公共库，可能存在'anatd/es/form',@ant-design.icons
// 同时存在 ['./', '../', '@/', '@@/']的为自身依赖
const isImportSelf = (packageName) => {
    const importSelfFileKeyWord = ['./', '../', '@/', '@@/'];
    let flag = false;
    // 有上述关键字时，为自身文件，需要转换
    for (let keyWord of importSelfFileKeyWord) {
        if (packageName.indexOf(keyWord) > -1) {
            flag = true;
            break;
        }
    }
    return flag;
}

const cutPathArr = (pathUrl) =>{
    return pathUrl.replaceAll("'", '').replaceAll(/[\\|\\\\|/]/g, ',').split(',');
}

// 
// D:\code\umi\analyze\analyzeTSX\src\pages\index.tsx
// ../assets/yay.jpg
// D:\code\umi\analyze\analyzeTSX\src\assets\yay.jpg
/**
 * 将相对路径转换成绝对路径
 * @param {string} relativePathName 相对路径
 * @param {string} filePath 解析文件所在路径
 * @param {string} atPath '@'符号路径
 * @returns 文件所在绝对路径+文件名
 */
const getImportPath = (relativePathName, filePath, atPath) => {
    const PATH_SPACE_SYMBOL = '/';
    const pathArr = cutPathArr(relativePathName);
    const filePathArr = cutPathArr(filePath)
    const filePathArrLen = filePathArr.length;
    // 返回的绝对路径
    let resPath = '';
    // 引用项目自身的文件，需转换成绝对路径
    if (isImportSelf(relativePathName)) {
        // 路径前缀名称，'.' '..' '@'等
        const firstName = pathArr[0];
        // 路径后缀名称
        const lastPathName = pathArr.slice(1).join(PATH_SPACE_SYMBOL);
        switch (firstName) {
            case '.':
                const absoluteFile = filePathArr.slice(0, filePathArrLen - 1).join(PATH_SPACE_SYMBOL);
                resPath = absoluteFile + PATH_SPACE_SYMBOL + lastPathName;
                break;
            case '..':
                const absoluteFile1 = filePathArr.slice(0, filePathArrLen - 2).join(PATH_SPACE_SYMBOL);
                resPath = absoluteFile1 + PATH_SPACE_SYMBOL + lastPathName;
                break;
            case '@':
                resPath = atPath + PATH_SPACE_SYMBOL + lastPathName;
                break;
            default:
                break;
        }
        return resPath;

    }
    // 原样返回
    return relativePathName;

}

// 测试
const testFn = () => {
    // const path1 = '../assets/yay.jpg';
    // const filePath = 'D:/code/umi/analyze/analyzeTSX/src/pages/index.tsx';
    // const path1 = './index.less';
    // const filePath = 'D:\\code\\umi\\analyze\\analyzeTSX\\src\\layouts\\index.tsx';

    // const s = filePath.replaceAll(/[\\|\\\\|/]/g, ',');
    // console.log(s)
    const path1 = '@/route/route';
    console.log('getFile: path1', path1)
    const res = getSrcDirPath();
    console.log('getFile: res', res)
    // const filePath =JSON.stringify("D:\code\umi\analyze\analyzeTSX\src\layouts\index.tsx");
    // // const path1 = './yay.jpg';
    // // const filePath = 'D:/code/umi/analyze/analyzeTSX/src/assets/index.tsx';
    // const absoluteFilePath = getImportPath(path1, filePath, '');
    // console.log('getFile: absoluteFilePath', absoluteFilePath)
}

// testFn();

module.exports = {
    getCurrPath,
    isParserFile,
    getAllFileFromPath,
    getSrcDirPath,
    getImportPath
};
