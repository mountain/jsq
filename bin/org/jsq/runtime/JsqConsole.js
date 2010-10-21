var sys = require('sys');

jsq.out = {
    print: function(arg) { sys.print(arg); },
    println: function(arg) { sys.puts(arg); }
};

jsq.err = {
    print: function(arg) { sys.print(arg); },
    println: function(arg) { sys.puts(arg); }
};

