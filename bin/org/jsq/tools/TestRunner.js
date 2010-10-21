(function() {
    require('../bootstrap/underscore');
    require('../bootstrap/uBootstrap');

    require('../runtime/JsqLoader');
    require('../runtime/JsqConsole');
    require('../runtime/JsqUnit');

    var home = process.argv[2];
    jsq.loader.home(home);
    jsq.loader.testFlag = true;
    jsq.loader.bases = [home + '/scripts', home + '/tests'];

    require('../bootstrap/Bootstrap');

    var qname = process.argv[3],
        args = process.argv.slice(3);
    if(!qname) {
        throw 'Error: No class to execute...';
    }

    (function(qname, args) {
        jsq.loader.load(qname);
        var target = _(qname.split('.')).reduce(this, function(pkg, name){
            pkg = pkg[name];
            var msg = 'package[' + qname + '] seeking failed at ' + name;
            if(pkg) return pkg;
            jsq.err.println(msg);
            throw msg;
        }, this);
        if(target && target.main) {
          target.main(args);
        } else {
          throw 'Error: No main method to execute...';
        }
    })(qname, args);
}).apply(this);