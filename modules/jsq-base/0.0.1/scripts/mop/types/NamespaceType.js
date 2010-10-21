jsq.cls('mop.types.NamespaceType') //< public
//.imports(['mop.Namespace', 'mop.Loader'])
.bases('mop.types.BaseType')
.defines({
    //> public constructs(Namespace ns, Array lexStk, Loader ld, String name)
    constructs:function(ns, lexStk, ld, name){
        var namespace = ns, loader = ld;
        this.base(namespace, lexStk, loader, "namespace", name);
        this.defines = function(def) {
            namespace.put(this._$s._name, def);
            return this;
        };
    }
})
.end();