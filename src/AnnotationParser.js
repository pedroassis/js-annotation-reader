
var esprima = require('esprima');

function AnnotationParser () {
        
    this.parse = function parser (rawAnnotation) {
        var tree = esprima.parse(rawAnnotation);
        return call(tree.body[0]);
    }

    var lookup = {};

    lookup['ExpressionStatement'] = function(block) {
        return call(block.expression);
    };

    // New annotation
    lookup['CallExpression'] = function(expression) {
        var annotation = {
            name : expression.callee.name
        };

        if(expression.arguments.length === 1){
            annotation.value = call(expression.arguments[0], annotation);
        }

        if(expression.arguments.length > 1){
            for (var i = expression.arguments.length - 1; i >= 0; i--) {
                var argument = expression.arguments[i];
                var value = call(argument, annotation);
                if(argument.type === 'Literal'){
                    annotation.value = annotation.value || [];
                    annotation.value.push(value);
                }
            }
        }

        return annotation;
    };

    lookup['Literal'] = function(literalArg) {
        return literalArg.value;
    };

    lookup['ObjectExpression'] = function(objectExpression) {
        var object = {};
        var properties = objectExpression.properties;
        for (var i = properties.length - 1; i >= 0; i--) {
            var property = properties[i];
            object[property.key.name] = call(property.value);
        };
        return object;
    };

    lookup['AssignmentExpression'] = function(assignmentExpression, destination) {
        var varName = assignmentExpression.left.name;
        destination[varName] = call(assignmentExpression.right);
    };

    lookup['Identifier'] = function(identifier) {
        return {
            name : identifier.name
        };
    };

    lookup['ArrayExpression'] = function(arrayExpression) {
        return arrayExpression.elements.map(function(element) {
            return call(element);
        });
    };

    function call (item, param) {
        return lookup[item.type] && lookup[item.type](item, param);
    }
}

module.exports = AnnotationParser;
