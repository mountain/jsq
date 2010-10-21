jsq.cls('jsq.Object')
.imports(['jsq.Class'])
.includes({
    _hashCounter:-1 //< private int
})
.defines({
    _hashCode:-1, //< private int
    //> public int hashCode()
    hashCode:function(){
        if(this._hashCode=== -1){
            this._hashCode=++jsq.Object._hashCounter;
        }
        return this._hashCode;
    },
    //> public boolean equals(Object o)
    equals:function(o){
        return (this===o);
    },
    //> public String toString()
    toString:function(){
        return this.$s._name+"@"+this.hashCode();
    },
    getClass: function() {
        var array = this.$s._name.split('.'),
          name = array[array.length - 1];
        return this.$s[name].clazz;
    }
})
.end();

