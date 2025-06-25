
class FileNode {
    // 文件路径
    filePath = '';
    // 引入的文件（子组件）
    importInfoList = [];
    // 父组件
    fatherSet;
    constructor(filePath, importInfoList){
        this.filePath = filePath;
        this.importInfoList = importInfoList;
        this.fatherSet = new Set();
    }


    get sonImport(){
        return this.importInfoList.map(importInfo => importInfo.packageName);
    }
    set fatherSet(fatherPath){
        this.fatherSet.add(fatherPath);
    }
    get fatherSet(){
        return this.fatherSet;
    }
    
}


module.exports = {
    FileNode
}