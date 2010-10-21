jsq.cls('mop.types.BaseType') //< public abstract
.imports(['mop.Namespace', 'mop.Loader'])
.defines({
    //> public constructs(Namespace ns, Array lexStk, Loader ld, String kind, String name)
    constructs:function(ns, lexStk, ld, kind, name){
        var namespace = ns, lexical = lexStk[lexStk.length - 1], loader = ld;
        lexStk.push(this);

        //jsq.out.println('create ' + kind + ' ' + name);
        this._$s = {};
        //this._$s._type = this;
        this._$s._name = name;
        this.$meta = {
            name:name, //< public String
            kind:kind, //< public String
            imports:null, //< public String[]
            bases:null, //< public BaseType
            fulfils:null, //< public InterfaceType[]
            mixins:null, //< public MixinType[]
            uses:null, //< public TraitType[]
            requires:null, //< public InterfaceType[]
            defines:null, //< public Object
            includes:null, //< public Object
            initializes:null, //< public Function
            completed:false, //< public boolean
        };

        var simpleName = function(qname) {
            if(!qname) return null;
            var names=qname.split("."); //<String[]
            return names[names.length-1];
        };

        this.modules = function(modules) {
            _.each(modules, function(mspec) {
                if(_.isString(mspec)) {
                    jsq.loader.addmodule(mspec, 'latest');
                    this.$meta.modules.push([mspec, 'latest']);
                } else
                if(_.isArray(mspec) && mspec.length===2) {
                    jsq.loader.addmodule(mspec[0], mspec[1]);
                    this.$meta.modules.push([mspec[0], mspec[1]]);
                } else {
                    throw 'module spec is not correct!'
                }
            }, this);
            this.$meta.modules = _.uniq(this.$meta.modules);
        };

        this.imports = function() {
            this.$meta.imports = arguments;
            if(arguments.length===1){
                _([arguments[0]]).chain().flatten().each(
                    function(arg) {
                      try {
                        var name = simpleName(arg);
                        this._$s[name] = loader.load(arg);
                      } catch (e) {
                        if(_.isString(e)) {
                            var qname = e, name = simpleName(qname);
                            this._$s[name] = loader.load(qname);
                        } else {
                            throw e;
                        }
                      }
                    }, this);
            } else if(arguments.length===2) {
                this._$s[arguments[1]] = loader.load(arguments[0]);
            }
            return this;
        };
        this.end = function() {
          var type = namespace.get(this._$s._name);
          if(!type.$s) type.$s = {};
          type.$s.outer = lexical._$s._type;
          lexStk.pop();
          return type;
        };
    }
})
.end();