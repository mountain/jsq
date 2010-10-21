jsq.cls('mop.types.ObjectType') //< public
//.imports(['mop.Namespace', 'mop.Loader'])
.bases('mop.types.BaseType')
.defines({
    //> public constructs(Namespace ns, Array lexStk, Loader ld, String name)
    constructs:function(ns, lexStk, ld, name){
        var namespace = ns, loader = ld;
        this.base(namespace, lexStk, loader, "object", name);
        this.defines = function(def) {
            namespace.put(this._$s._name, _.extend(new jsq.Object(), def));
            return this;
        };
    }
})
.end();