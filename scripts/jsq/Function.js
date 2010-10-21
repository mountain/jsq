jsq.cls('jsq.Function')
.defines({
    base: undefined,

    constructs: function(fn) {
        this.base = fn;
    },

    apply: function(ctx, args) {
        this.base.apply(ctx, args);
    },

    call: function() {
        this.base.call(arguments);
    },

    /**
     * Invoking the function returned by this function only passes `n`
     * arguments to the underlying function.  If the underlying function
     * is not saturated, the result is a function that passes all its
     * arguments to the underlying function.  (That is, `aritize` only
     * affects its immediate caller, and not subsequent calls.)
     * >> '[a,b]'.lambda()(1,2) -> [1, 2]
     * >> '[a,b]'.lambda().aritize(1)(1,2) -> [1, undefined]
     * >> '+'.lambda()(1,2)(3) -> error
     * >> '+'.lambda().ncurry(2).aritize(1)(1,2)(3) -> 4
     *
     * `aritize` is useful to remove optional arguments from a function that
     * is passed to a higher-order function that supplies *different* optional
     * arguments.
     *
     * For example, many implementations of `map` and other collection
     * functions, including those in this library, call the function argument
     *  with both the collection element
     * and its position.  This is convenient when expected, but can wreak
     * havoc when the function argument is a curried function that expects
     * a single argument from `map` and the remaining arguments from when
     * the result of `map` is applied.
     */
    aritize: function(n) {
        var fn = this.base;
        return new jsq.Function(function() {
            return fn.apply(this, Array.slice(arguments, 0, n));
        });
    },

    /**
     * Returns a bound method on `object`, optionally currying `args`.
     * == f.bind(obj, args...)(args2...) == f.apply(obj, [args..., args2...])
     */
    bind: function(object/*, args...*/) {
        var fn = this.base;
        var args = Array.slice(arguments, 1);
        return new jsq.Function(function() {
            return fn.apply(object, args.concat(Array.slice(arguments, 0)));
        });
    },

    /**
     * `compose` returns a function that applies the underlying function
     * to the result of the application of `fn`.
     * == f.compose(g)(args...) == f(g(args...))
     * >> '1+'.lambda().compose('2*')(3) -> 7
     *
     * Note that, unlike `jsq.Function.compose`, the `compose` method on
     * function only takes a single argument.
     * == jsq.Function.compose(f, g) == f.compose(g)
     * == jsq.Function.compose(f, g, h) == f.compose(g).compose(h)
     */
    compose: function(fn) {
        var self = this.base;
        return new jsq.Function(function() {
            return self.apply(this, [fn.apply(this, arguments)]);
        });
    },

    /**
     * Returns a function that, applied to an argument list $arg2$,
     * applies the underlying function to $args ++ arg2$.
     * :: (a... b... -> c) a... -> (b... -> c)
     * == f.curry(args1...)(args2...) == f(args1..., args2...)
     *
     * Note that, unlike in languages with true partial application such as Haskell,
     * `curry` and `uncurry` are not inverses.  This is a repercussion of the
     * fact that in JavaScript, unlike Haskell, a fully saturated function is
     * not equivalent to the value that it returns.  The definition of `curry`
     * here matches semantics that most people have used when implementing curry
     * for procedural languages.
     *
     * This implementation is adapted from
     * [http://www.coryhudson.com/blog/2007/03/10/javascript-currying-redux/].
     */
    curry: function(/*args...*/) {
        var fn = this.base;
        var args = Array.slice(arguments, 0);
        return new jsq.Function(function() {
            return fn.apply(this, args.concat(Array.slice(arguments, 0)));
        });
    },

    /*
     * Right curry.  Returns a function that, applied to an argument list $args2$,
     * applies the underlying function to $args2 + args$.
     * == f.curry(args1...)(args2...) == f(args2..., args1...)
     * :: (a... b... -> c) b... -> (a... -> c)
     */
    rcurry: function(/*args...*/) {
        var fn = this.base;
        var args = Array.slice(arguments, 0);
        return new jsq.Function(function() {
            return fn.apply(this, Array.slice(arguments, 0).concat(args));
        });
    },

    /**
     * Same as `curry`, except only applies the function when all
     * `n` arguments are saturated.
     */
    ncurry: function(n/*, args...*/) {
        var fn = this.base;
        var largs = Array.slice(arguments, 1);
        return new jsq.Function(function() {
            var args = largs.concat(Array.slice(arguments, 0));
            if (args.length < n) {
                args.unshift(n);
                return fn.ncurry.apply(fn, args);
            }
            return fn.apply(this, args);
        });
    },

    /**
     * Same as `rcurry`, except only applies the function when all
     * `n` arguments are saturated.
     */
    rncurry: function(n/*, args...*/) {
        var fn = this.base;
        var rargs = Array.slice(arguments, 1);
        return new jsq.Function(function() {
            var args = Array.slice(arguments, 0).concat(rargs);
            if (args.length < n) {
                args.unshift(n);
                return fn.rncurry.apply(fn, args);
            }
            return fn.apply(this, args);
        });
    },

    /**
     * Returns a function that swaps its first two arguments before
     * passing them to the underlying function.
     * == f.flip()(a, b, c...) == f(b, a, c...)
     * :: (a b c...) -> (b a c...)
     * >> ('a/b'.lambda()).flip()(1,2) -> 2
     *
     * For more general derangements, you can also use `prefilterSlice`
     * with a string lambda:
     * >> '100*a+10*b+c'.lambda().prefilterSlice('a b c -> [b, c, a]')(1,2,3) -> 231
     */
    flip: function() {
        var fn = this.base;
        return new jsq.Function(function() {
            var args = Array.slice(arguments, 0);
            args = args.slice(1,2).concat(args.slice(0,1)).concat(args.slice(2));
            return fn.apply(this, args);
        });
    },

    /**
     * Returns a function that is equivalent to the underlying function when
     * `guard` returns true, and otherwise is equivalent to the application
     * of `otherwise` to the same arguments.
     *
     * `guard` and `otherwise` default to `jsq.Function.I`.  `guard` with
     * no arguments therefore returns a function that applies the
     * underlying function to its value only if the value is true,
     * and returns the value otherwise.
     * == f.guard(g, h)(args...) == f(args...), when g(args...) is true
     * == f.guard(g ,h)(args...) == h(args...), when g(args...) is false
     * >> '[_]'.lambda().guard()(1) -> [1]
     * >> '[_]'.lambda().guard()(null) -> null
     * >> '[_]'.lambda().guard(null, jsq.Function.K('n/a'))(null) -> "n/a"
     * >> 'x+1'.lambda().guard('<10', jsq.Function.K(null))(1) -> 2
     * >> 'x+1'.lambda().guard('<10', jsq.Function.K(null))(10) -> null
     * >> '/'.lambda().guard('p q -> q', jsq.Function.K('n/a'))(1, 2) -> 0.5
     * >> '/'.lambda().guard('p q -> q', jsq.Function.K('n/a'))(1, 0) -> "n/a"
     * >> '/'.lambda().guard('p q -> q', '-> "n/a"')(1, 0) -> "n/a"
     */
    guard: function(guard, otherwise) {
        var fn = this.base;
        guard = jsq.Function.toFunction(guard || jsq.Function.I);
        otherwise = jsq.Function.toFunction(otherwise || jsq.Function.I);
        return new jsq.Function(function() {
            return (guard.apply(this, arguments) ? fn : otherwise).apply(this, arguments);
        });
    },

    /**
     * Returns a function $f$ such that $f(args2)$ is equivalent to
     * the underlying function applied to a combination of $args$ and $args2$.
     *
     * `args` is a partially-specified argument: it's a list with "holes",
     * specified by the special value `_`.  It is combined with $args2$ as
     * follows:
     *
     * From left to right, each value in $args2$ fills in the leftmost
     * remaining hole in `args`.  Any remaining values
     * in $args2$ are appended to the result of the filling-in process
     * to produce the combined argument list.
     *
     * If the combined argument list contains any occurrences of `_`, the result
     * of the application of $f$ is another partial function.  Otherwise, the
     * result is the same as the result of applying the underlying function to
     * the combined argument list.
     */
    partial: function(/*args*/) {
        var fn = this.base;
        var _ = {};
        var args = Array.slice(arguments, 0);
        //substitution positions
        var subpos = [], value;
        for (var i = 0; i < arguments.length; i++)
            arguments[i] == _ && subpos.push(i);
        return new jsq.Function(function() {
            var specialized = args.concat(Array.slice(arguments, subpos.length));
            for (var i = 0; i < Math.min(subpos.length, arguments.length); i++)
                specialized[subpos[i]] = arguments[i];
            for (var i = 0; i < specialized.length; i++)
                if (specialized[i] == _)
                    return fn.partial.apply(fn, specialized);
            return fn.apply(this, specialized);
        });
    },

    /**
     * `sequence` returns a function that applies the underlying function
     * to the result of the application of `fn`.
     * == f.sequence(g)(args...) == g(f(args...))
     * == f.sequence(g) == g.compose(f)
     * >> '1+'.lambda().sequence('2*')(3) -> 8
     *
     * Note that, unlike `jsq.Function.compose`, the `sequence` method on
     * function only takes a single argument.
     * == jsq.Function.sequence(f, g) == f.sequence(g)
     * == jsq.Function.sequence(f, g, h) == f.sequence(g).sequence(h)
     */
    sequence: function(fn) {
        var self = this.base;
        fn = jsq.Function.toFunction(fn);
        return new jsq.Function(function() {
            return fn.apply(this, [self.apply(this, arguments)]);
        });
    },

    /**
     * Returns a function that applies the underlying function to `args`, and
     * ignores its own arguments.
     * :: (a... -> b) a... -> (... -> b)
     * == f.saturate(args...)(args2...) == f(args...)
     * >> Math.max.curry(1, 2)(3, 4) -> 4
     * >> Math.max.saturate(1, 2)(3, 4) -> 2
     * >> Math.max.curry(1, 2).saturate()(3, 4) -> 2
     */
    saturate: function () {
        var fn = this.base;
        var args = Array.slice(arguments, 0);
        return new jsq.Function(function() {
            return fn.apply(this, args);
        });
    },

    /**
     * `prefilterAt` returns a function that applies the underlying function
     * to a copy of the arguments, where the `index`th argument has been
     * replaced by the value of `filter(argument[index])`.
     * == fn.prefilterAt(i, filter)(a1, a2, ..., a_{n}) == fn(a1, a2, ..., filter(a_{i}), ..., a_{n})
     * >> '[a,b,c]'.lambda().prefilterAt(1, '2*')(2,3,4) -> [2, 6, 4]
     */
    prefilterAt: function(index, filter) {
        filter = jsq.Function.toFunction(filter);
        var fn = this.base;
        return new jsq.Function(function() {
            var args = Array.slice(arguments, 0);
            args[index] = filter.call(this, args[index]);
            return fn.apply(this, args);
        });
    },

    /**
     * `prefilterObject` returns a function that applies the underlying function
     * to the same arguments, but to an object that is the result of appyling
     * `filter` to the invocation object.
     * == fn.prefilterObject(filter).apply(object, args...) == fn.apply(filter(object), args...)
     * == fn.bind(object) == compose(fn.prefilterObject, jsq.Function.K(object))
     * >> 'this'.lambda().prefilterObject('n+1').apply(1) -> 2
     */
    prefilterObject: function(filter) {
        var fn = this.base;
        return new jsq.Function(function() {
            return fn.apply(filter(this), arguments);
        });
    },

    /**
     * `prefilterSlice` returns a function that applies the underlying function
     * to a copy of the arguments, where the arguments `start` through
     * `end` have been replaced by the value of `filter(argument.slice(start,end))`,
     * which must return a list.
     * == fn.prefilterSlice(i0, i1, filter)(a1, a2, ..., a_{n}) == fn(a1, a2, ..., filter(args_{i0}, ..., args_{i1}), ..., a_{n})
     * >> '[a,b,c]'.lambda().prefilterSlice('[a+b]', 1, 3)(1,2,3,4) -> [1, 5, 4]
     * >> '[a,b]'.lambda().prefilterSlice('[a+b]', 1)(1,2,3) -> [1, 5]
     * >> '[a]'.lambda().prefilterSlice(compose('[_]', Math.max))(1,2,3) -> [3]
     */
    prefilterSlice: function(filter, start, end) {
        start = start || 0;
        var fn = this.base;
        return new jsq.Function(function() {
            var args = Array.slice(arguments, 0);
            var e = end < 0 ? args.length + end : end || args.length;
            args.splice.apply(args, [start, (e||args.length)-start].concat(filter.apply(this, args.slice(start, e))));
            return fn.apply(this, args);
        });
    },

    /**
     * `prefilterObject` returns a function that applies the underlying function
     * to the same arguments, but to an object that is the result of appyling
     * `filter` to the invocation object.
     * == fn.prefilterObject(filter).apply(object, args...) == fn.apply(filter(object), args...)
     * == fn.bind(object) == compose(fn.prefilterObject, jsq.Function.K(object))
     * >> 'this'.lambda().prefilterObject('n+1').apply(1) -> 2
     */
    prefilterObject: function(filter) {
        var fn = this.base;
        return new jsq.Function(function() {
            return fn.apply(filter.call(this), arguments);
        });
    },

    toFunction: function() {
        if(this.base) return this.base;
    }

})
.includes({

  /**
   * The identity function: $x -> x$.
   * == I(x) == x
   * == I == 'x'.lambda()
   * :: a -> a
   * >> jsq.Function.I(1) -> 1
   */
  I: new jsq.Function(function(x) { return x; }),

  /**
   * Returns a constant function that returns `x`.
   * == K(x)(y) == x
   * :: a -> b -> a
   * >> jsq.Function.K(1)(2) -> 1
   */
  K: new jsq.Function(function(x) {return function() {return x}}),

  /**
   * Returns a function that applies the first function to the
   * result of the second, but passes all its arguments too.
   * == S(f, g)(args...) == f(g(args...), args...)
   *
   * This is useful for composing functions when each needs access
   * to the arguments to the composed function.  For example,
   * the following function multiples its last two arguments,
   * and adds the first to that.
   * >> Function.S('+', '_ a b -> a*b')(2,3,4) -> 14
   *
   * Curry this to get a version that takes its arguments in
   * separate calls:
   * >> jsq.Function.S.curry('+')('_ a b -> a*b')(2,3,4) -> 14
   */
  S: new jsq.Function(function(f, g) {
      return function() {
          return f.apply(this, [g.apply(this, arguments)].concat(Array.slice(arguments, 0)));
      }
  }),

  B: new jsq.Function(function() {
  }),

  C: new jsq.Function(function() {
  }),

  W: new jsq.Function(function() {
  }),

  Y: new jsq.Function(function() {
  })
})
.end();
