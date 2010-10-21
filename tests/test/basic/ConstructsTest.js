jsq.cls("test.basic.ConstructsTest")
.defines({
    field1: undefined,
    field2: 2,
    field3: 3,
    constructs:function(){
        this.field1 = this.field2 * this.field3;
    }
})
.includes({
    staticField1: 4,
    staticField2: 5,
    staticField3: 6,

    main: function() {
      var instA = new test.basic.ConstructsTest();

      assertTrue(instA.field1 === 6);
      assertTrue(this.staticField1 === 7);
      assertTrue(test.basic.ConstructsTest.staticField2 === 8);
      assertTrue(this.$s.ConstructsTest.staticField3 === 9);

      assertTrue(this.$s.ConstructsTest.clazz.isClassOf(instA));
      assertTrue(test.basic.ConstructsTest.clazz === instA.getClass());
      assertFalse(jsq.Object.clazz.isClassOf(instA));
      assertFalse(jsq.Object.clazz === instA.getClass());
      assertFalse(test.basic.ConstructsTest.clazz.isClassOf("A"));
      jsq.out.println('Success!');
    }
})
.initializes(function() {
    test.basic.ConstructsTest.staticField1 = 7;
    this.$s.ConstructsTest.staticField2 = 8;
    this.staticField3 = 9;
})
.end();