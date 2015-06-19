
'@AnnotationClass(s=234565432)'
'@AnotherAnnotationClass()'
function User(){

    '@AnnotationMethod({s:234567})'
    '@AnnotationMethod2put("")'
    '@AnotherAnnotationMethod(1,5,6)'
    this.put = function put() {

        function innerInner (argument) {
        }
    };

    function inner (argument) {
    }

    '@AnnotationField(@AnotherAnnotationField)'
    this.a = '';

    '@AnnotationMethod';'@AnotherAnnotationMethodGet'    
    this.get = function() {

    };
}

module.exports = User;