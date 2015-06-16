
function JSParser (tree) {
    
    var extractedComments = {
        properties : []
    };

    this.parseFirst = function() {
        lookup[tree.type](tree);
        return extractedComments;
    };

    var lookup = {};

    lookup['Program'] = function(body) {
        var toParse = body.body || [];
        for (var i = toParse.length - 1; i >= 0; i--) {
            var innerItem = toParse[i];
            lookup[innerItem.type] && lookup[innerItem.type](innerItem);
        };
    };

    lookup['FunctionDeclaration'] = function(body) {
        var functionComments = body.id && body.id.leadingComments ? body.id.leadingComments : [];
        var functionName = body.id && body.id.name ? body.id.name : '';
        var innerBlock = body.body || {};
        extractedComments.class = {
            comments : functionComments,
            name : functionName
        }
        lookup[innerBlock.type] && lookup[innerBlock.type](innerBlock);
    };

    lookup['BlockStatement'] = lookup['Program'];

    lookup['ExpressionStatement'] = function(block) {
        lookup[block.expression.type] && lookup[block.expression.type](block.expression);
        if(block.leadingComments && block.expression.left && block.expression.left.property && block.expression.left.property.name){
            extractedComments.properties.push({
                comments : block.leadingComments,
                name : block.expression.left.property.name
            });
        }
    };

    lookup['AssignmentExpression'] = function(assignmentExpression) {
        if(assignmentExpression.left && assignmentExpression.left.leadingComments && assignmentExpression.left.property){
            assignmentComments = assignmentExpression.left.leadingComments;
            var name = assignmentExpression.left.property.name;

            extractedComments.properties.push({
                comments : assignmentComments,
                name : name
            });
        }
    };

    lookup['VariableDeclaration'] = function(block) {
        var firstDeclaration = block.declarations[0];
        if(firstDeclaration && firstDeclaration.id && firstDeclaration.id.leadingComments){
            var name = firstDeclaration.id.name;
            var declarationComments = firstDeclaration.id.leadingComments;

            extractedComments.properties.push({
                comments : declarationComments,
                name : name
            });
        }
    };
}

module.exports = JSParser;
