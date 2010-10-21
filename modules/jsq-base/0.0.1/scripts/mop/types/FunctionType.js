jsq.cls('mop.types.FunctionType') //< public
//.imports(['mop.Namespace', 'mop.Loader'])
.imports('jsq.Function')
.bases('mop.types.BaseType')
.defines({
    //> public constructs(Namespace ns, Array lexStk, Loader ld, String name)
    constructs:function(ns, lexStk, ld, name){
        var namespace = ns, loader = ld;
        this.base(namespace, lexStk, loader, "function", name);
        this.defines = function(def) {
            namespace.put(this._$s._name, new jsq.Function(def));
            return this;
        };
    }
})
.end();