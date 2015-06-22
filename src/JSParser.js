
var ClassMetadata = require('./ClassMetadata');

function JSParser (tree) {
    
    var classMetadata = new ClassMetadata();

    this.parseFirst = function() {
        lookup[tree.type](tree, true);
        return classMetadata;
    };

    var lookup = {};

    lookup['Program'] = function(body, transverse) {
        var toParse = body.body || [];
        for (var i = 0; i < toParse.length; i++) {
            var innerItem = toParse[i];
            lookup[innerItem.type] && lookup[innerItem.type](innerItem, transverse);
        }
    };

    lookup['ExpressionStatement'] = function(block) {
        lookup[block.expression.type] && lookup[block.expression.type](block.expression);
    };

    lookup['Literal'] = function(expression) {
        if(expression.value){
            classMetadata.addMetadata(expression.value);
        }
    };

    lookup['FunctionDeclaration'] = function(body, transverse) {
        if(transverse){
            var functionName = body.id && body.id.name ? body.id.name : '';
            var innerBlock = body.body || {};
        
            classMetadata.addName(functionName);
            classMetadata.addParameters(body.params);
            
            lookup[innerBlock.type] && lookup[innerBlock.type](innerBlock);
        }
    };

    lookup['BlockStatement'] = lookup['Program'];

    lookup['AssignmentExpression'] = function(assignmentExpression) {
        if(assignmentExpression.left.property.name && assignmentExpression.left.object.type === "ThisExpression"){
            var name = assignmentExpression.left.property.name;
            classMetadata.addName(name);
        }
    };

}

module.exports = JSParser;
