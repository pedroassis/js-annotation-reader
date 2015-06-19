
'@AnnotationClass'
'@AnotherAnnotationClass'
function User(){

    '@AnnotationMethod'
    '@AnnotationMethod2put'
    '@AnotherAnnotationMethod'
    this.put = function put() {

        function innerInner (argument) {
        }
    };

    function inner (argument) {
    }

    '@AnnotationField';'@AnotherAnnotationField'
    this.a = '';

    '@AnnotationMethod';'@AnotherAnnotationMethodGet'    
    this.get = function() {

    };
}

module.exports = User;