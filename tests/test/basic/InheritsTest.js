jsq.cls("test.basic.InheritsTest")
.imports(["test.basic.ParentType", "test.basic.ChildType"])
.includes({
  main : function () {
    var a = new this.$s.ChildType(2,3);
    var b = new this.$s.ChildType(4,5);
    assertTrue(a.x===2);
    assertTrue(a.y===3);
    assertTrue(a.z===5);
    assertTrue(b.x===4);
    assertTrue(b.y===5);
    assertTrue(b.z===9);
    assertTrue(a.getX()===2);
    assertTrue(a.addToY(4)===7);
    assertTrue(b.x===4);
    assertTrue(b.y===5);
    assertTrue(b.getX()===4);
    assertTrue(b.addToY(4)===9);
    assertTrue(b.getZ()===9);
    assertTrue(b.addToZ(4)===13);
    jsq.out.println("Success!!");
  }
})
.end();