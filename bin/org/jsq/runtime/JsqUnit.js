(function(){

  this.assertTrue = function (arg) {
    if(!arg) {
      jsq.out.println("assertion failuer");
      throw arg;
    }
  }

  this.assertFalse = function (arg) {
    if(arg) {
      jsq.out.println("assertion failuer");
      throw arg;
    }
  }

  this.assertEquals = function (arg0,arg1,arg2) {
    if(arg0 !== arg1) {
      jsq.out.println("assertion failuer");
      throw arg2;
    }
  }

  this.assertNotNull = function (arg) {
    if(arg !== undefined || arg !== null) {
      jsq.out.println("assertion failuer");
      throw arg;
    }
  }

  this.fail = function (arg) { throw arg; }

})();