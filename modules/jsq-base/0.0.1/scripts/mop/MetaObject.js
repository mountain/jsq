jsq.cls('mop.MetaObject') //< public
.imports(['mop.types.NamespaceType', 'mop.types.ObjectType', 'mop.types.FunctionType',
    'mop.types.ClassType', 'mop.types.InterfaceType',
    'mop.types.EnumType', 'mop.types.MixinType', 'mop.types.TraitType'])
.imports(['mop.Namespace', 'mop.Loader'])
.defines({
    //> public constructs(Namespace ns)
    constructs: function(ns) {
        var namespace = ns, lexStk = [];
        this.out = jsq.out;
        this.err = jsq.err;
        this.loader = new mop.Loader(namespace);

        this.inspect = function(raw){
            jsq.out.println(raw);
            if(!raw) return;
            _(raw).chain().keys().each(function(key) {
              jsq.out.println(key);
              //jsq.out.println(key + ":" + this[key]);
            }, raw);
        };

        this.nms =  function(tpName) {
            if(!_.isUndefined(tpName))
                return new mop.types.NamespaceType(namespace, lexStk, this.loader, tpName);
            else
                return new mop.types.NamespaceType(new mop.Namespace({}), lexStk, this.loader, "_");
        };
        this.obj =  function(tpName) {
            if(!_.isUndefined(tpName))
                return new mop.types.ObjectType(namespace, lexStk, this.loader, tpName);
            else
                return new mop.types.ObjectType(new mop.Namespace({}), lexStk, this.loader, "_");
        };
        this.func =  function(tpName) {
            if(!_.isUndefined(tpName))
                return new mop.types.FunctionType(namespace, lexStk, this.loader, tpName);
            else
                return new mop.types.FunctionType(new mop.Namespace({}), lexStk, this.loader, "_");
        };
        this.cls = function(tpName) {
            if(!_.isUndefined(tpName))
                return new mop.types.ClassType(namespace, lexStk, this.loader, tpName);
            else
                return new mop.types.ClassType(new mop.Namespace({}), lexStk, this.loader, "_");
        };
        this.intf = function(tpName) {
            if(!_.isUndefined(tpName))
                return new mop.types.InterfaceType(namespace, lexStk, this.loader, tpName);
            else
                return new mop.types.InterfaceType(new mop.Namespace({}), lexStk, this.loader, "_");
        };
        this.enm = function(tpName) {
            if(!_.isUndefined(tpName))
                return new mop.types.EnumType(namespace, lexStk, this.loader, tpName);
            else
                return new mop.types.EnumType(new mop.Namespace({}), lexStk, this.loader, "_");
        };
        this.mxn = function(tpName){
            if(!_.isUndefined(tpName))
                return new mop.types.MixinType(namespace, lexStk, this.loader, tpName);
            else
                return new mop.types.MixinType(new mop.Namespace({}), lexStk, this.loader, "_");
        };
        this.trt = function(tpName){
            if(!_.isUndefined(tpName))
                return new mop.types.TraitType(namespace, lexStk, this.loader, tpName);
            else
                return new mop.types.TraitType(new mop.Namespace({}), lexStk, this.loader, "_");
        };
    }
})
.end();