
function Annotation (name) {

    // Name of this annotation
    this.name = name;

    // Default value
    this.value; 

    // Member annotated by this annotation
    this.targets; 

    // Name of the package containing this annotation
    this.packaged;
}

module.exports = Annotation;
