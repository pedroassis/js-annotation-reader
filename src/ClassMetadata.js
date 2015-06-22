
var AnnotationParserClass = require('./AnnotationParser')

var AnnotationParser = new AnnotationParserClass();

var IMPORT_STATEMENT = "import ";
var PACKAGE_STATEMENT = "import ";

function ClassMetadata() {

    this.name;
    this.annotations = [];
    this.methods = [];

    var current = this;

    this.addMetadata = function(metadata) {

        if(isImport(metadata)){
            addImport(metadata);
        } else if(isPackage(metadata)){
            addPackage(metadata);
        } else {
            addAnnotation(metadata)
        }

        return this;
    };

    this.addParameters = function(params) {
        current.parameters = params & params.map(function(param) {
            return param.name;
        });
        return this;
    };

    this.addName = function(name) {
        current.name = name;
        for (var i = current.annotations.length - 1; i >= 0; i--) {
            current.annotations[i].targets = name;
        }
        if(current !== this){
            this.methods.push(current);
        }
        current = {
            annotations : []
        }
        return this;
    };

    this.hasName = function hasName () {
        return !!current.name;
    }

    function addAnnotation(metadata) {
        current.annotations.push(AnnotationParser.parse(metadata.replace(/@/g, '')));
    }

    function addImport(metadata) {
        current.imports = metadata.trim().replace(IMPORT_STATEMENT, "");
    }

    function addPackage(metadata) {
        current.packaged = metadata.trim().replace(IMPORT_STATEMENT, "");
    }

    function isImport(rawMetadata) {
        return rawMetadata && rawMetadata.trim().indexOf(IMPORT_STATEMENT) === 0;
    }

    function isPackage(rawMetadata) {
        return rawMetadata && rawMetadata.trim().indexOf(PACKAGE_STATEMENT) === 0;
    }

}

module.exports = ClassMetadata;
