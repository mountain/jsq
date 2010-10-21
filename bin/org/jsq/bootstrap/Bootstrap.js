jsq.cls('org.jsq.bootstrap.Bootstrap') //< public
.modules([['jsq-base', '0.0.1']])
.imports(['mop.MetaObject', 'mop.Namespace'])
.end();

(function () {
    var ns = new mop.Namespace(this),
        meta = new mop.MetaObject(ns);

    meta.Object = jsq.Object;
    meta.Class = jsq.Class;
    meta.Function = jsq.Function;
    delete meta.base;

    this.jsq = meta;
})();

