jsq.cls('jsq.Class')
.bases('jsq.Object')
.defines({
    name: undefined,
    isClassOf: function(o) {
        if(o.getClass) {
          return o.getClass().name === this.name;
        }
        return false;
    }
})
.includes({
    _cache: {},

    create: function(name) {
        var clz = this._cache[name];
        if(clz) return clz;

        clz = new this();
        clz.name = name;
        this._cache[name] = clz;

        return clz;
    }
})
.end();