/**
 * 存储文件内导入信息
 */
class ImportInfo {

    // filePath = '';
    packageName = '';
    // importPath = '';
    defaultImport = '';
    bindsImport = '';
    isSelfImport = false;

    constructor(packageName, defaultImport, bindsImport, isSelfImport=false) {
        this.packageName = packageName;
        this.defaultImport = defaultImport;
        this.bindsImport = bindsImport;
        this.isSelfImport = isSelfImport;
    }
    get getPackageName() {
        return this.packageName;
    }
    get getDefaultImport() {
        return this.defaultImport;
    }

    get getBindsImport() {
        return this.bindsImport;
    }
    get isSelfImport(){
        return this.isSelfImport;
    }


    toString() {
        return (
            'packageName: ' + packageName +
            'defaultImport' + defaultImport +
            'bindsImport' + bindsImport
        )
    }


    // filePath = '';

    // fatherNodeList = [];
    // sonNodeList=[]

}

module.exports = {
    ImportInfo
}