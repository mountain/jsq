jsq.loader = {
    homepath: null,
    testFlag: false,
    bases: [],
    load: function(qname) {
        var loaded = false, excpt = undefined,
        path = qname.split('.').join('/'),
        len = jsq.loader.bases.length, i = 0;
        while(!loaded && i < len) {
            var full_path = jsq.loader.bases[i] + '/' + path;
            try {
                //jsq.out.println("before require: " + qname);
                require(full_path);
                //jsq.out.println("after require: " + qname);
                loaded = true;
            } catch (e) {
                loaded = false;
                if(
                  !e.toString().match(//Node error msg pattern
                    /^Error: Cannot find module.*/
                  )
                ) {
                  excpt = e;
                }
            }
            i = i + 1;
        }
        if(!loaded && excpt) throw excpt;
    },
    home: function(path) {
        this.homepath = path;
    },
    addmodule: function(module, version) {
        this.bases.push(this.homepath + '/modules/' + module + '/' + version + '/scripts');
        if(this.testFlag) {
            this.bases.push(this.homepath + '/modules/' + module + '/' + version + '/tests');
        }
    }
};