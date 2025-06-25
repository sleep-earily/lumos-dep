const ts = require("typescript");
const fs = require('fs');
const imp = require("./constant/importInfo");
const fn = require('./constant/fileNode');
const getFile = require('./getFile');

const getAstInfo = (filePath)=>{
    const sourceFile = ts.createSourceFile(
        filePath,
        fs.readFileSync(filePath).toString(),
        ts.ScriptTarget.ES2015,
    /*setParentNodes */ true
    )
    return sourceFile;
}
// 从一个node节点中解析import信息，存储
const getImportDeclarationFromNode = (node, filePath, srcPath) => {
    let importInfo;
    // 仅处理node中的导入节点
    if (ts.isImportDeclaration(node)) {
        // 导入的包名或路径 moduleSpecifier模块标识
        const packageName = node.moduleSpecifier.getText();
        // 将导入的包名转成绝对路径
        const absolutePackageName = getFile.getImportPath(packageName, filePath, srcPath);
        // 默认导入 解构导入
        const defaultImport = node.importClause?.name?.getText();
        // 解构导入
        const bindsImport = node.importClause?.namedBindings || { elements: [] };
        // names就是解构的变量名
        const names = bindsImport.elements.map(item => item.getText());
        importInfo = new imp.ImportInfo(absolutePackageName, defaultImport, names.join(','), packageName!==absolutePackageName);
    }
    return importInfo;
}

// 获取当前文件的导入信息
const getImportInfo = (filePath, srcPath) => {
    const importInfoList = []
    // 构建ts解析目录
    const sourceFile = getAstInfo(filePath);
    ts.forEachChild(sourceFile, (node) => {
        const importInfo = getImportDeclarationFromNode(node, filePath, srcPath);
        // 剔除 其他节点信息
        if (importInfo) {
            importInfoList.push(importInfo);
        }

    })

    const fileNode = new fn.FileNode(filePath, importInfoList);
    return fileNode;
}


module.exports = {
    getAstInfo,
    getImportInfo,
}