# js-annotation-reader
Annotation Reader for JS files

This module uses esprima to extract metadata off JS files, for now it only works on NodeJS.

JavaScript does not have a implementation of Annotations.
Then again, it didn't had classes and we used class-like functions to do the job.

# Class-like function

```js
    function User(name){
        this.name = name;
    }
```

Javascript didn't had Threads, (We can agree it still don't) but we write async code, so screw threads.

JavaScript does have a type of metadata, one that can change the behavior of your code.
But without this metadata your code would also run, a little different.

I'm talking of course of 'use strict' literal expression.

Use strict is not part of your code, although is it code, much like an Annotation mind you.  
[Reference Link](http://stackoverflow.com/a/17560270/1727493)


## Usage

```js
    // Only extracting metadata from the first function inside the file, we can change that later
    var parse = require('js-annotation-reader').parseFirstFunction;
    var path = require('path');
    var fs = require('fs');
    
    var name = path.join(__dirname, 'Simple.js'); // Your file
    var code = fs.readFileSync(name).toString(); // String pls
    console.log(JSON.stringify(parse(code), null, 4));
```

This is the Simple.js file:
```js
  '@AnotherAnnotationClass'
  function Simple(){
  
      '@AnnotationField'
      this.someMethod = function() {};
  }
```

This is going to print in your console the metadata extracted from that class.

```js
  {
      "name": "Simple", // Class name
      "parameters": [], // Constructor parameters,
      "imports": [],    // All imports declarations
      "annotations": [ // Class annotations
          {
              "name": "AnotherAnnotationClass", // Annotation name
              "targets": "Simple" // Annotation target, just the name not the function
          }
      ],
      "methods": [ //  Array of method's metadata
          {
              "name": "someMethod", // Method name
              "annotations": [ // Method's Annotations
                  {
                      "name": "AnnotationField", // Annotation name
                      "targets": "someMethod"
                  }
              ]
          }
      ]
  }
```

The fields imports and packaged are just declarations, as all the other informations, this does not creates any magic.

Things can get fancy here, checkout our User.js file:

```js
  'package com.pedroassis.whatever' // package declaration, to avoid naming colisions of course
  
  'import com.pedroassis.asdfgbh'; // imports, also to avoid naming colisions of course
  'import com.pedroassis.AnotherAnnotationClass';
  'import com.pedroassis.AnotherAnnotationField';
  
  '@AnnotationMethod2put("")' // Annotation with default value set to a empty string
  '@AnnotationClass(s=234565432)' // Default value is a object {s:234565432}
  '@AnotherAnnotationClass()' // No Default value
  function User(asdcvb, asdfgbh){ // <-- This parameters names are going to be also extrated
  
      '@AnnotationMethod({s:234567})' // Default value is a object
      '@AnotherAnnotationMethod(1,5,6)'; // Default value is a Array [1,5,6]
      this.put = function put() {
          function innerInner (argument) {
          }
      };
  
      function inner (argument) {
      }
  
      '@AnnotationMethod';'@AnotherAnnotationMethodGet' // Same line to prove a point   
      
      '@Get(@Whatever([1]))' // huuuuuu, nested annotations like a charm
      this.get = function() {
  
      };
  }
```

Thats a lot of metadata, checkout our UserMetadata.json to see the output, or just scroll as you will, nothing else to see.

```js
  {
      "annotations": [
          {
              "name": "AnnotationMethod2put",
              "value": "",
              "targets": "User"
          },
          {
              "name": "AnnotationClass",
              "s": 234565432,
              "targets": "User"
          },
          {
              "name": "AnotherAnnotationClass",
              "packaged": "com.pedroassis.AnotherAnnotationClass",
              "targets": "User"
          }
      ],
      "imports": [
          "com.pedroassis.asdfgbh",
          "com.pedroassis.AnotherAnnotationClass",
          "com.pedroassis.AnotherAnnotationField"
      ],
      "methods": [
          {
              "annotations": [
                  {
                      "name": "AnnotationMethod",
                      "value": {
                          "s": 234567,
                          "packaged": false
                      },
                      "targets": "put"
                  },
                  {
                      "name": "AnotherAnnotationMethod",
                      "value": [
                          6,
                          5,
                          1
                      ],
                      "targets": "put"
                  }
              ],
              "name": "put"
          },
          {
              "annotations": [
                  {
                      "name": "AnnotationMethod",
                      "targets": "get"
                  },
                  {
                      "name": "AnotherAnnotationMethodGet",
                      "targets": "get"
                  },
                  {
                      "name": "Get",
                      "value": {
                          "name": "Whatever",
                          "value": [
                              1
                          ]
                      },
                      "targets": "get"
                  }
              ],
              "name": "get"
          }
      ],
      "packaged": "package com.pedroassis.whatever",
      "parameters": [
          "asdcvb",
          "com.pedroassis.asdfgbh" // <-- matched the import
      ],
      "name": "User"
  }
```
