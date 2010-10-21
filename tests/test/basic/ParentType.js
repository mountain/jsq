jsq.cls("test.basic.ParentType")
.defines({
  z: null,
  constructs : function (z) {
    this.z = z;
  },
  getZ: function () {
    return this.z;
  },
  addToZ: function (val) {
    return this.z+val;
  }
})
.end();
