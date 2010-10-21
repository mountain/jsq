jsq.cls("test.basic.ChildType")
.bases("test.basic.ParentType")
.defines({
  constructs : function (x, y) {
    this.base(x+y);
    this.x = x;
    this.y = y;
  },
  getX : function () {
    return this.x;
  },
  addToY : function (val) {
    return this.y+val;
  }
})
.end();
