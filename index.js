
module.exports = function(file) {

    var esprima = require('esprima');

    var tree = esprima.parse(file, { attachComment: true });

    return rootParser(tree.body[0]);
};

function rootParser (body) {
    var classComments = body.id ? body.id.leadingComments : [];
    var innerDeclarations = body.body && body.body.body ? body.body.body : [];

    var innerComments = innerDeclarations.map(bodyParser).filter(function(commentHolder) {
        return commentHolder.comment.length && commentHolder.name;
    });

    return {
        classComments : classComments,
        innerComments : innerComments
    }
}

function bodyParser (body) {
    var left = body.expression ? body.expression.left : {};
    var propertyComment = left.leadingComments || [];
    var propertyName = left.property ? left.property.name : '';
    return {
        comment : propertyComment,
        name : propertyName
    };
}
