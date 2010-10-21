jsq.nms('jsq.Traits')
.defines({
    Eq: jsq.trt().defines({
        eq: function(o) {
           return !this.neq(o);
        },
        neq: function(o) {
           return !this.eq(o);
        }
    }).end()
})
.end();
