
var JSParser = require('./src/JSParser')
var AnnotationParserClass = require('./src/AnnotationParser')
var esprima = require('esprima');

var fs = require('fs');

var AnnotationParser = new AnnotationParserClass();

function parseFirstFunction(file) {

    var tree = esprima.parse(file);

    var parser = new JSParser(tree);

    return parser.parseFirst();
};

function getMetadata(file) {

    var classMetadata = parseFirstFunction(file);

    return {
        name : classMetadata.name,
        annotations : classMetadata.metadata.map(parseAnnotation.bind(this, classMetadata.name)),
        methods : classMetadata.methods.map(function(property) {
            return {
                name : property.name,
                annotations : property.metadata.map(parseAnnotation.bind(this, property.name))
            };
        })
    };
};

function parseAnnotation(itemName, metadata) {
    return {
        target : itemName,
        name : AnnotationParser.parse(metadata.name.replace(/@/g, ''))
    }
}

module.exports.getMetadata = getMetadata;

module.exports.parseFirstFunction = parseFirstFunction;