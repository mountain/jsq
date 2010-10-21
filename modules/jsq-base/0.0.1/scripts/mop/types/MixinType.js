jsq.cls('mop.types.MixinType') //< public
//.imports(['mop.Namespace', 'mop.Loader'])
.bases('mop.types.BaseType')
.defines({
    //> public constructs(Namespace ns, Array lexStk, Loader ld, String name)
    constructs:function(ns, lexStk, ld, name){
        var namespace = ns, loader = ld;
        this.base(namespace, lexStk, loader, "mixin", name);
        this.defines = function(def) {
            return this;
        };
    }
})
.end();