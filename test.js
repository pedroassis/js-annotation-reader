
var index = require('./index').getMetadata;

var path = require('path');
var fs = require('fs');
var esprima = require('esprima');

var name = path.join(__dirname, 'Simple.js');

var code = fs.readFileSync(name).toString();

// index(code)
console.log(JSON.stringify(index(code), null, 4))