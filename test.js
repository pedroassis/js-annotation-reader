
var index = require('./index').getMetadata;

var path = require('path');
var fs = require('fs');
var esprima = require('esprima');

var name = path.join(__dirname, 'User.js');

var code = fs.readFileSync(name).toString();

console.log(JSON.stringify(index(code), null, 4))