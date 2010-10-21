jsq.cls('mop.Namespace') //< public
.defines({
    root:null,
    //> public constructs(Object root)
    constructs:function(root){
        this.root = root;
    },
    //> private String normalize(String qname)
    normalize: function(qname) {
        if(qname === 'Object') qname = 'jsq.Object';
        if(qname === 'Class') qname = 'jsq.Class';
        return qname;
    },
    //> public Object get(String qname)
    get: function(qname){
        qname = this.normalize(qname);
        return _.reduce(qname.split('.'), this.root, function(pkg, name){
            pkg = pkg[name];
            if(pkg) return pkg;
            throw "package[" + qname + "] seeking failed at " + name;
        }, this);
    },
    //> public boolean check(String qname)
    check: function(qname){
        qname = this.normalize(qname);
        var result = undefined;
        try {
           result = _.reduce(qname.split('.'), this.root,
             function(pkg, name){
               return pkg?pkg[name]:false;
             }, this);
        } catch(e) {
          throw qname;
        }
        return result;
    },
    //> public void put(String qname, Object namable)
    put: function(qname, namable){
        qname = this.normalize(qname);
        var names = qname.split('.');
        var simple = names.pop();
        var pkg = _.reduce(names, this.root, function(pkg, name){
            if(!pkg[name]) pkg[name] = {};
            return pkg[name];
        }, this);
        pkg[simple] = namable;
    }
})
.end();