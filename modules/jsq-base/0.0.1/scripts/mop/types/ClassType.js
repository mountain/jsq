jsq.cls('mop.types.ClassType') //< public
.imports(['mop.Namespace', 'mop.Loader'])
.bases('mop.types.BaseType')
.defines({
    //> public constructs(Namespace ns, Array lexStk, Loader ld, String name)
    constructs:function(ns, lexStk, ld, name){
        var namespace = ns, loader = ld;
        this.base(namespace, lexStk, loader, "class", name);

        var simpleName = function(qname){
            if(!qname) return null;
            var names=qname.split("."); //<String[]
            return names[names.length-1];
        };

        var Factory = function(self){
            var qname = self._$s._name;
            if(!self.$meta.bases && qname !=='jsq.Object') self.base('jsq.Object');
            var base = self._$s._parent.prototype.constructs;
            base = base? base : function(){};
            var wrapper = baseWrapper(self._$s._parent.prototype);
            _.extend(base, wrapper);
            var construction = function() {
                this.base = base;
                this.base._invoker = this;
                if(this.constructs)
                    this.constructs.apply(this, arguments);
                else
                    this.base.apply(this);
            };
            var name = simpleName(qname);
            construction.$s = self._$s;
            construction.$s._type = construction;
            construction.$s[name] = construction;
            namespace.put(qname, construction);
            return construction;
        };

        var classHierarchy = function(proto, hierarchy) {
            if(!proto) return;
            var parent = (proto.$s? proto.$s._parent : undefined);
            if(parent) {
              classHierarchy(parent.prototype, hierarchy);
            }
            hierarchy.push(proto);
        };

        var baseWrapper = function(proto) {
            var wrapper = {};
            _(proto).chain().keys().each( function(key) {
              var func = this[key];
              wrapper[key] = function() {
                func.apply(this._invoker, arguments);
              }
            }, proto);
            return wrapper;
        };

        this.bases = function(name){
            var base = loader.load(name);
            this.$meta.bases = base;
            this._$s._parent = base;
            return this;
        };

        this.fulfils = function(intfs){
            intfs = _.flattern([intfs]);
            this.$meta.fulfils = _.map(intfs, function(intf) {
                return loader.load(intf);
            });
        };

        this.includes = function(def){
            if(!this.$meta.bases && this._$s._name!=='jsq.Object') this.bases('jsq.Object');

            var name = this._$s._name;
            this.$meta.includes = def;
            var factory = undefined;
            if(!namespace.check(name)){
                factory = Factory(this);
            } else {
                factory = namespace.get(name);
            }
            _.extend(factory, def);
            _.extend(factory.$s, def);

            return this;
        };

        this.defines = function(def) {
            if(!this.$meta.bases && this._$s._name!=='jsq.Object') this.bases('jsq.Object');

            var name = this._$s._name;
            this.$meta.defines = def;
            var factory = undefined;
            if(!namespace.check(name)){
                factory = Factory(this);
            } else {
                factory = namespace.get(name);
            }
            factory.prototype.$s = {};
            _.extend(factory.prototype.$s, this._$s);
            _.extend(factory.prototype, def);
            _.extend(factory.prototype, {
              getClass: function() {
                return jsq.Class.create(name);
              }
            });

            var hierachy = [];
            classHierarchy(_(factory.prototype).clone(), hierachy);
            _(hierachy).each(function(ancestor) {
                _.extend(factory.prototype, ancestor)
            },this);

            return this;
        };

        this.initializes = function(fun) {
            this.$meta.initializes = fun;
            return this;
        };

        this.end = function() {
            if(!this.$meta.includes) this.includes({});
            if(!this.$meta.defines) this.defines({});
            var init = this.$meta.initializes,
            fun = function (name) {
              if(!jsq.Class) {
                  jsq.loader.load('jsq.Class');
              }
              this.clazz = jsq.Class.create(name);
              if(init) init.apply(this);
            };
            //jsq.out.println('create clazz:' + this._$s._name);
            fun.apply(this._$s._type, [this._$s._name]);

            return namespace.get(this._$s._name);
        };
    }
})
.end();