
function ClassMetadata() {

    this.name;
    this.metadata = [];
    this.methods = [];

    var current = this;

    this.addMetadata = function(metadata) {
        current.metadata.push({
            name : metadata,
            target : current.name
        });
    };

    this.addName = function(name) {
        current.name = name;
        for (var i = current.metadata.length - 1; i >= 0; i--) {
            current.metadata[i].target = name;
        }
        if(current !== this){
            this.methods.push(current);
        }
        current = {
            metadata : []
        }
    };

    this.hasName = function hasName () {
        return !!current.name;
    }

}

module.exports = ClassMetadata;
