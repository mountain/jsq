Jsq README
==========

Jsq is an object system for javascript. This project is not maintained any more
and only for achieve purpose.

The API is similar to eBay's VJO system, but the ideas is rooted from MOP
of Lisp CLOS.

The overview of the API
-----------------------

Below code is an example of the jsq Object system.

```javascript
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
```

We intended to implements Namespace, Object(Singleton), Function, Class,
Enumeration, Mixin and Traits types in Jsq, but only Namespace, Object and Class
had been finished.

Jsq self descritption
---------------------

The most interesting part of Jsq implementation is that we implemented Jsq on
a simplified version of Jsq itself.

You can see two bootstrap code in org.jsq.bootstrap packages:

* uBootstrap.js: boot the simplified version of Jsq, only Class was supported
* Bootstrap.js: second round of bootstrap for full version of Jsq

The performance of the second Jsq is not alway slower than the first version.
MOP is not a layered achietecture, the second Jsq metaobject is created by the
first Jsq metaobject, but they are independent each other. After the creation
of second metaobject, the first metaobject will be discarded, and the execution
of jsq code afterwards is not dispached to the first metaobject.

Why not maintain it
-------------------

An Object System is too heavy for Javascript.




