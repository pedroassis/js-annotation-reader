"use strict";

var AnnotationParserClass = require('./AnnotationParser')

var AnnotationParser = new AnnotationParserClass();

var IMPORT_STATEMENT = "import ";
var PACKAGE_STATEMENT = "import ";
var USE_STRICT = "use strict";

function ClassMetadata() {

    this.name;
    this.packaged;
    this.annotations = [];
    this.imports = [];
    this.methods = [];

    var current = this;

    this.addMetadata = function(metadata) {

        if(isImport(metadata)){
            addImport(metadata);
        } else if(isPackage(metadata)){
            addPackage(metadata);
        } else if(isAnnotation(metadata)){
            addAnnotation(metadata)
        }

        return this;
    };

    this.addParameters = function(params) {
        current.parameters = params && params.map(getParameterName);
        return this;
    };

    function getParameterName(param) {
        return current.imports && getImportStatement(param.name) || param.name;
    }

    function getImportStatement(name) {
        var importStatement;
        var dotName = '.' + name;
        for (var i = current.imports.length - 1; i >= 0; i--) {
            var imported = current.imports[i];
            var endsWith = imported.indexOf(dotName, imported.length - dotName.length) !== -1
            importStatement = !importStatement && endsWith ? imported : importStatement;
        }
        return importStatement;
    }

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
        current.imports = current.imports || [];
        current.imports.push(metadata.trim().replace(IMPORT_STATEMENT, ""));
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

    function isAnnotation(rawMetadata) {
        return rawMetadata && rawMetadata.trim() !== USE_STRICT;
    }

}

module.exports = ClassMetadata;
