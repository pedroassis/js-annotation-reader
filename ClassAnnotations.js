
function ClassAnnotations() {

    this.name;
    this.annotations = [];
    this.methods = [];

    var currentMetadata = this;

    this.addAnnotation = function(name) {
        currentMetadata.annotations.push({
            name : name,
            target : currentMetadata.name
        });
    };

}
