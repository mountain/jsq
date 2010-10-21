(function() {

  /*------------------------- Baseline setup ---------------------------------*/

  // Establish the root object, "window" in the browser, or "global" on the server.
  var root = this;

  var jsq = root.jsq = {
      out:null,
      err:null,
      loader:null,
      inspect: function(o) { inspect(o); },
      cls: function(name) {
        return new Cls(name);
      }
  };

  // Export the Underscore object for CommonJS.
  if (typeof exports !== 'undefined') exports.jsq = jsq;
  root.jsq = jsq;

  // Current version.
  jsq.VERSION = '0.0.1';

  /*------------------------- Namespace and loading functions ---------------------------------*/

  var stk = [];
  function load(qname) {
    if(_.indexOf(stk, qname) === -1) {
      stk.push(qname);
      if(jsq.loader) {
          //jsq.out.println("loading: " + qname);
          jsq.loader.load(qname);
      }
    }
    if(NAMESPACE.check(qname)) {
        return NAMESPACE.get(qname);
    } else {
      var defered = function() {
        return new NAMESPACE.get(qname)(arguments);
      };
      defered.defer = true;
      return defered;
    }
  }

  function simpleName(qname) {
    var array = qname.split('.');
    return array[array.length - 1];
  }

  function NameSpace(root) {
    this.root = root;
    this.normalize = function(qname) {
        if(qname === 'Object') qname = 'jsq.Object';
        if(qname === 'Class') qname = 'jsq.Class';
        return qname;
    };
    this.get = function(qname){
      qname = this.normalize(qname);
        return _(qname.split('.')).reduce(this.root, function(pkg, name){
            pkg = pkg[name];
            if(pkg) return pkg;
            throw "package[" + qname + "] seeking failed at " + name;
        }, this);
    };
    this.check = function(qname){
        qname = this.normalize(qname);
        return _(qname.split('.')).reduce(this.root,
          function(pkg, name){
            return pkg?pkg[name]:false;
        }, this);
    };
    this.put = function(qname,namable){
        qname = this.normalize(qname);
        var names = qname.split('.');
        var simple = names.pop();
        var pkg = _(names).reduce(this.root, function(pkg, name){
            if(!pkg[name]) pkg[name] = {};
            return pkg[name];
        }, this);
        pkg[simple] = namable;
    };
  }

  var NAMESPACE = new NameSpace(root);

  /*------------------------- Metadata setup ---------------------------------*/

  function Metadata(kind, name) {
      this.kind = kind;
      this.name = name;

      this.modules = [];
      this.imports = undefined;
      this.exports = undefined;
      this.bases = undefined;
      this.includes = undefined;
      this.defines = undefined;
      this.initializes = undefined;

      this.completed = false;
      this.valid = false;
  }

  /*------------------------- Cls setup ---------------------------------*/

  function Cls(name) {
      this.$meta = new Metadata('class', name);
      this.$s = {};
      this.$s._kind = 'class';
      this.$s._name = name;
      this.$s._type = undefined;
      this.$s._parent = undefined;
  };

  Cls.prototype.modules = function(modules) {
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
      return this;
  };

  Cls.prototype.imports = function() {
      this.$meta.imports = arguments;
      if(arguments.length===1){
          _([arguments[0]]).chain().flatten().each(
              function(arg) {
                this.$s[simpleName(arg)] = load(arg);
              }, this);
      } else if(arguments.length===2) {
          load(arguments[0], arguments[1]);
      }
      return this;
  };

  Cls.prototype.exports = function() {
      this.$meta.exports = arguments;
      return this;
  };

  Cls.prototype.bases = function(name) {
      this.$meta.bases = name;
      if(this.$s._name != "jsq.Object") this.$s._parent = load(name);
      return this;
  };

  Cls.prototype.includes = function(def){
      var name = this.$s._name, fun = factory(name, this);
      this.$meta.includes = def;
      this.$s._type = fun;
      this.$s[simpleName(name)] = fun;
      fun.$s = {};
      _.extend(fun.$s, this.$s);
      _.extend(fun, def);
      return this;
  };

  Cls.prototype.defines = function(def) {
      if(!this.$meta.bases && this.$s._name!=='jsq.Object') this.bases('jsq.Object');

      var name = this.$s._name, fun = factory(name, this);
      this.$meta.defines = def;
      this.$s._type = fun;
      this.$s[simpleName(name)] = fun;
      fun.prototype.$s = {};
      _.extend(fun.prototype.$s, this.$s);
      _.extend(fun.prototype, def);
      _.extend(fun.prototype, {
        getClass: function() {
            return jsq.Class.create(name);
        }
      });
      var hierachy = [];

      classHierarchy(_(fun.prototype).clone(), hierachy);
      _.each(hierachy, function(ancestor) {
        _.extend(fun.prototype, ancestor);
      });

      return this;
  };

  Cls.prototype.initializes = function(fun) {
      this.$meta.initializes = fun;
      return this;
  };

  Cls.prototype.end = function() {
      if(!this.$meta.includes) this.includes({});
      if(!this.$meta.defines) this.defines({});
      var init = this.$meta.initializes,
      fun = function (name) {
        if(!jsq.Class) load('jsq.Class');
        this.clazz = jsq.Class.create(name);
        if(init) init.apply(this);
      };
      fun.apply(this.$s._type, [this.$s._name]);
  };

  /*------------------------- utilities ---------------------------------*/

  function inspect(raw) {
      jsq.out.println(raw);
      _(raw).chain().keys().each( function(key) {
        jsq.out.println(key + ":" + this[key]);
      }, raw);
  };

  function factory(name, ctx) {
      var fun = undefined;
      if(!NAMESPACE.check(name)) {
          fun = Factory(ctx);
          NAMESPACE.put(name, fun);
      } else {
        fun = NAMESPACE.get(name);
      }
      return fun;
  }

  function Factory(ctx) {
      var parent = ctx.$s._parent ? ctx.$s._parent : function() {},
          constructs = parent.prototype.constructs,
          base = constructs ? constructs : function() {};
      var wrapper = baseWrapper(parent.prototype);
      _.extend(base, wrapper);
      var construction = function() {
        this.base = base;
        this.base._invoker = this;
          var c = this.constructs,
          cstr = (c) ? c.toString() : "",
          b = (cstr.indexOf("this.base(")===-1 && cstr.indexOf("this.constructs")===-1);
          if(c && b) this.base();
          if(c) {
            c.apply(this, arguments);
          }
      };
      return construction;
  };


  function classHierarchy(proto, hierarchy) {
      if(!proto) return;
      var parent = (proto.$s? proto.$s._parent : undefined);
      if(parent) {
        classHierarchy(parent.prototype, hierarchy);
      }
      hierarchy.push(proto);
  };

  function baseWrapper(proto) {
      var wrapper = {};
      _(proto).chain().keys().each(function(key) {
        var func = this[key];
        wrapper[key] = function() {
          func.apply(this._invoker, arguments);
        }
      }, proto);
      return wrapper;
  };

})();