
var JSParser = require('./JSParser')

function parseFirstFunction(file) {

    var esprima = require('esprima');

    var tree = esprima.parse(file, { attachComment: true });

    var parser = new JSParser(tree);

    return parser.parseFirst();
};

function getMetadata(file) {

    var parsedClass = parseFirstFunction(file);

    return {
        name : parsedClass.class.name,
        annotations : parsedClass.class.comments.map(parseAnnotation.bind(this, parsedClass.class.name)),
        methods : parsedClass.properties.map(function(property) {
            return {
                name : property.name,
                annotations : property.comments.map(parseAnnotation.bind(this, property.name))
            };
        })
    };
};

function parseAnnotation(itemName, comment) {
    return {
        target : itemName,
        name : comment.value.replace('@', '')
    }
}

module.exports.getMetadata = getMetadata;

module.exports.parseFirstFunction = parseFirstFunction;