"use strict";

var AnnotationParserClass = require('./AnnotationParser')

var AnnotationParser = new AnnotationParserClass();

var Annotation = require('./Annotation')

var IMPORT_STATEMENT = "import ";
var PACKAGE_STATEMENT = "package ";
var USE_STRICT = "use strict";

function ClassMetadata() {

    this.name;
    this.packaged;
    this.annotations = [];
    this.imports = [];
    this.methods = [];

    var current = this;

    var that = this;

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
        return that.imports && getImportStatement(param.name) || param.name;
    }

    function getImportStatement(name) {
        var importStatement;
        for (var i = that.imports.length - 1; i >= 0; i--) {
            var imported = that.imports[i];
            var prefix = imported.indexOf('.') !== -1 ? '.' : ' ';
            var dotName = prefix + name; 

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
        var annotation = AnnotationParser.parse(metadata.replace(/@/g, ''));
        fillPackage(annotation);
        current.annotations.push(annotation);
    }

    function fillPackage(annotation) {
        annotation.packaged = that.imports && annotation instanceof Annotation && getImportStatement(annotation.name);
        annotation.value && fillPackage(annotation.value);
    };

    function addImport(metadata) {
        that.imports = that.imports || [];
        that.imports.push(metadata.trim().replace(IMPORT_STATEMENT, ""));
    }

    function isImport(rawMetadata) {
        return rawMetadata && rawMetadata.trim().indexOf(IMPORT_STATEMENT) === 0;
    }

    function addPackage(metadata) {
        current.packaged = metadata.trim().replace(PACKAGE_STATEMENT, "");
    }

    function isPackage(rawMetadata) {
        return rawMetadata && rawMetadata.trim().indexOf(PACKAGE_STATEMENT) === 0;
    }

    function isAnnotation(rawMetadata) {
        return rawMetadata && rawMetadata.trim() !== USE_STRICT;
    }

}

module.exports = ClassMetadata;
