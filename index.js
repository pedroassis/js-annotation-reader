
var JSParser = require('./src/JSParser')
var esprima = require('esprima');

var fs = require('fs');

function parseFirstFunction(file) {

    var tree = esprima.parse(file);

    var parser = new JSParser(tree);

    return parser.parseFirst();
};

function getMetadata(file) {

    return parseFirstFunction(file)
};

module.exports.getMetadata = getMetadata;

module.exports.parseFirstFunction = parseFirstFunction;