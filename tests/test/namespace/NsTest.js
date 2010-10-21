jsq.cls('test.namespace.NsTest')
.imports(['test.namespace.SimpleNs'])
.includes({
    main: function() {
      var o = test.namespace.SimpleNs.O;
      var f = test.namespace.SimpleNs.F;
      var c = test.namespace.SimpleNs.C;

      assertTrue(o.abc === 'ABC');
      assertTrue(o.fun() === 2);
      assertTrue(f.toFunction()() === 2);

      var i = new c();
      assertTrue(i.def === 'DEF');
      assertTrue(i.fun() === 2);

      o = this.$s.SimpleNs.O;
      f = this.$s.SimpleNs.F;
      c = this.$s.SimpleNs.C;

      assertTrue(o.abc === 'ABC');
      assertTrue(o.fun() === 2);
      assertTrue(f.toFunction()() === 2);

      i = new c();
      assertTrue(i.def === 'DEF');
      assertTrue(i.fun() === 2);

      jsq.out.println('Success!');
    }
})
.end();
