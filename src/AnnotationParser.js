"use strict";

var esprima = require('esprima');

var Annotation = require('./Annotation');

function AnnotationParser () {
        
    this.parse = function parser (rawAnnotation) {
        var tree;
        var annotation;
        var error;
        try {
            tree = esprima.parse(rawAnnotation);
            var body = tree.body[0];
            annotation = call(body);
        } catch(e){
            error = true;
        }

        if(body.expression.type !== "CallExpression" && body.expression.type !== "Identifier" || error){
            throw new Error("Invalid Annotation '" + rawAnnotation + "'. Please verify the input");
        }
        return annotation;
    }

    var lookup = {};

    lookup['ExpressionStatement'] = function(block) {
        return call(block.expression);
    };

    // New annotation
    lookup['CallExpression'] = function(expression) {
        var annotation = new Annotation(expression.callee.name);

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
        return new Annotation(identifier.name);
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
