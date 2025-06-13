/**
 * 存储文件内导入信息
 */
class ImportInfo {

    // filePath = '';
    packageName = '';
    // importPath = '';
    defaultImport = '';
    bindsImport = '';

    constructor(packageName, defaultImport, bindsImport) {
        this.packageName = packageName;
        this.defaultImport = defaultImport;
        this.bindsImport = bindsImport;
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