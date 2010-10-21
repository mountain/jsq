jsq.nms('test.namespace.SimpleNs')
.defines({
    O: jsq.obj().defines({
        abc: 'ABC',
        fun: function() {
           return 2;
        }
    }).end(),
    F: jsq.func().defines(function() {
       return 2;
    }).end(),
    C: jsq.cls().defines({
        def: 'DEF',
        fun: function() {
           return 2;
        }
    }).end()
})
.end();
