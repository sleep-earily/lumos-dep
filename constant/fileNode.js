
class FileNode {
    filePath = '';
    importInfoList = [];
    constructor(filePath, importInfoList){
        this.filePath = filePath;
        this.importInfoList = importInfoList;
    }


    get sonImport(){
        return importInfoList.map(importInfo => importInfo.packageName);
    }
    
}


module.exports = {
    FileNode
}