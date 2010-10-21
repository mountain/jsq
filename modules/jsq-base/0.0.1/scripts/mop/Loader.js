jsq.cls('mop.Loader') //< public
//.needs(['mop.Namespace'])
.defines({
    //> public constructs(Namespace ns)
    constructs:function(ns) {
        var loaded = ['jsq.Object', 'jsq.Class', 'jsq.Function'],
            stk = [], delegate = jsq.loader, namespace = ns;
        this.homepath = delegate.homepath;
        this.testFlag = delegate.testFlag;
        this.bases = delegate.bases;
        this.home = function(path) { delegate.home(path); };
        this.load = function(qname) {
            jsq.out.println('loading: ' + qname);
            stk.push(qname);
            var nms = namespace;
            if( _.indexOf(loaded, qname) === -1) {
              loaded.push(qname);
              if(delegate) {
                  delegate.load(qname);
                  jsq.out.println('loaded: ' + qname);
              }
            }
            stk.pop(qname);
            var result = nms.check(qname);
            if(result) {
              jsq.out.println('returned:' + qname);
              return result;
            } else {
              var n = nms;
              var defered = function() {
                return new n.get(qname)(arguments);
              };
              defered.defer = true;
              jsq.out.println('defered:' + qname);
              return defered;
            }
        };
        this.top = function() {
            return stk[stk.length - 1];
        }
    }
})
.end();