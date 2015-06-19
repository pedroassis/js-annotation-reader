
var JSParser = require('./JSParser')
var esprima = require('esprima');

var fs = require('fs');

function parseFirstFunction(file) {

    var tree = esprima.parse(file, { attachComment: true });

    // console.log(JSON.stringify(tree, null, 4));

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
        name : metadata.name.replace('@', '')
    }
}

module.exports.getMetadata = getMetadata;

module.exports.parseFirstFunction = parseFirstFunction;