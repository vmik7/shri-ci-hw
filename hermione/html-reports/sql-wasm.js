// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined;

var initSqlJs = function (moduleConfig) {
    if (initSqlJsPromise) {
        return initSqlJsPromise;
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise((resolveModule, reject) => {
        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort'];
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction) {
                originalOnAbortFunction(errorThatCausedAbort);
            }
        };

        Module['postRun'] = Module['postRun'] || [];
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module);
        });

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined;

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort
        var f;
        f || (f = typeof Module !== 'undefined' ? Module : {});
        var ua = function () {
            var a;
            var b = h(4);
            var c = {};
            var d = (function () {
                function a(a, b) {
                    this.hb = a;
                    this.db = b;
                    this.pb = 1;
                    this.Gb = [];
                }
                a.prototype.bind = function (a) {
                    if (!this.hb) throw 'Statement closed';
                    this.reset();
                    return Array.isArray(a) ? this.bc(a) : this.cc(a);
                };
                a.prototype.step = function () {
                    var a;
                    if (!this.hb) throw 'Statement closed';
                    this.pb = 1;
                    switch ((a = kc(this.hb))) {
                        case c.Yb:
                            return !0;
                        case c.DONE:
                            return !1;
                        default:
                            return this.db.handleError(a);
                    }
                };
                a.prototype.jc = function (a) {
                    null == a && (a = this.pb++);
                    return lc(this.hb, a);
                };
                a.prototype.kc = function (a) {
                    null == a && (a = this.pb++);
                    return mc(this.hb, a);
                };
                a.prototype.getBlob = function (a) {
                    var b;
                    null == a && (a = this.pb++);
                    var c = nc(this.hb, a);
                    var d = oc(this.hb, a);
                    var e = new Uint8Array(c);
                    for (
                        a = b = 0;
                        0 <= c ? b < c : b > c;
                        a = 0 <= c ? ++b : --b
                    )
                        e[a] = l[d + a];
                    return e;
                };
                a.prototype.get = function (a) {
                    var b, d;
                    null != a && this.bind(a) && this.step();
                    var e = [];
                    a = b = 0;
                    for (
                        d = vb(this.hb);
                        0 <= d ? b < d : b > d;
                        a = 0 <= d ? ++b : --b
                    )
                        switch (pc(this.hb, a)) {
                            case c.Xb:
                            case c.FLOAT:
                                e.push(this.jc(a));
                                break;
                            case c.Zb:
                                e.push(this.kc(a));
                                break;
                            case c.Wb:
                                e.push(this.getBlob(a));
                                break;
                            default:
                                e.push(null);
                        }
                    return e;
                };
                a.prototype.getColumnNames = function () {
                    var a, b;
                    var c = [];
                    var d = (a = 0);
                    for (
                        b = vb(this.hb);
                        0 <= b ? a < b : a > b;
                        d = 0 <= b ? ++a : --a
                    )
                        c.push(qc(this.hb, d));
                    return c;
                };
                a.prototype.getAsObject = function (a) {
                    var b, c;
                    var d = this.get(a);
                    var e = this.getColumnNames();
                    var g = {};
                    a = b = 0;
                    for (c = e.length; b < c; a = ++b) {
                        var Qa = e[a];
                        g[Qa] = d[a];
                    }
                    return g;
                };
                a.prototype.run = function (a) {
                    null != a && this.bind(a);
                    this.step();
                    return this.reset();
                };
                a.prototype.fc = function (a, b) {
                    var c;
                    null == b && (b = this.pb++);
                    a = aa(a);
                    this.Gb.push((c = ba(a)));
                    this.db.handleError(xa(this.hb, b, c, a.length - 1, 0));
                };
                a.prototype.ac = function (a, b) {
                    var c;
                    null == b && (b = this.pb++);
                    this.Gb.push((c = ba(a)));
                    this.db.handleError(T(this.hb, b, c, a.length, 0));
                };
                a.prototype.ec = function (a, b) {
                    null == b && (b = this.pb++);
                    this.db.handleError(
                        (a === (a | 0) ? rc : sc)(this.hb, b, a),
                    );
                };
                a.prototype.dc = function (a) {
                    null == a && (a = this.pb++);
                    T(this.hb, a, 0, 0, 0);
                };
                a.prototype.Ob = function (a, b) {
                    null == b && (b = this.pb++);
                    switch (typeof a) {
                        case 'string':
                            this.fc(a, b);
                            break;
                        case 'number':
                        case 'boolean':
                            this.ec(a + 0, b);
                            break;
                        case 'object':
                            if (null === a) this.dc(b);
                            else if (null != a.length) this.ac(a, b);
                            else
                                throw (
                                    'Wrong API use : tried to bind a value of an unknown type (' +
                                    a +
                                    ').'
                                );
                    }
                };
                a.prototype.cc = function (a) {
                    var b;
                    for (b in a) {
                        var c = a[b];
                        var d = tc(this.hb, b);
                        0 !== d && this.Ob(c, d);
                    }
                    return !0;
                };
                a.prototype.bc = function (a) {
                    var b, c;
                    var d = (b = 0);
                    for (c = a.length; b < c; d = ++b) {
                        var e = a[d];
                        this.Ob(e, d + 1);
                    }
                    return !0;
                };
                a.prototype.reset = function () {
                    this.freemem();
                    return uc(this.hb) === c.Ab && vc(this.hb) === c.Ab;
                };
                a.prototype.freemem = function () {
                    for (var a; (a = this.Gb.pop()); ) ca(a);
                    return null;
                };
                a.prototype.free = function () {
                    this.freemem();
                    var a = wc(this.hb) === c.Ab;
                    delete this.db.Eb[this.hb];
                    this.hb = ja;
                    return a;
                };
                return a;
            })();
            var e = (function () {
                function a(a, c) {
                    this.filename =
                        'dbfile_' + ((4294967295 * Math.random()) >>> 0);
                    if (null != a) {
                        var d = this.filename,
                            e = d ? n('/', d) : '/';
                        d = da(!0, !0);
                        e = ea(e, ((void 0 !== d ? d : 438) & 4095) | 32768, 0);
                        if (a) {
                            if ('string' === typeof a) {
                                for (
                                    var k = Array(a.length),
                                        m = 0,
                                        Qa = a.length;
                                    m < Qa;
                                    ++m
                                )
                                    k[m] = a.charCodeAt(m);
                                a = k;
                            }
                            fa(e, d | 146);
                            k = p(e, 'w');
                            ha(k, a, 0, a.length, 0, void 0);
                            ia(k);
                            fa(e, d);
                        }
                    }
                    this.handleError(g(this.filename, b));
                    this.db = q(b, 'i32');
                    xc(this.db);
                    null != c &&
                        (this.run('VACUUM'),
                        (a = r('/')),
                        (a = a.node),
                        (a = t(a, this.filename)),
                        u.Ib(a, c));
                    this.Eb = {};
                    this.qb = {};
                }
                a.prototype.run = function (a, c) {
                    if (!this.db) throw 'Database closed';
                    c
                        ? ((a = this.prepare(a, c)), a.step(), a.free())
                        : this.handleError(m(this.db, a, 0, 0, b));
                    return this;
                };
                a.prototype.exec = function (a) {
                    if (!this.db) throw 'Database closed';
                    var c = ka();
                    var e = la(a) + 1;
                    var g = h(e);
                    v(a, l, g, e);
                    a = g;
                    e = h(4);
                    for (g = []; q(a, 'i8') !== ja; ) {
                        ma(b);
                        ma(e);
                        this.handleError(x(this.db, a, -1, b, e));
                        var k = q(b, 'i32');
                        a = q(e, 'i32');
                        if (k !== ja) {
                            var m = new d(k, this);
                            for (k = null; m.step(); )
                                null === k &&
                                    ((k = {
                                        columns: m.getColumnNames(),
                                        values: [],
                                    }),
                                    g.push(k)),
                                    k.values.push(m.get());
                            m.free();
                        }
                    }
                    na(c);
                    return g;
                };
                a.prototype.each = function (a, b, c, d) {
                    'function' === typeof b && ((d = c), (c = b), (b = void 0));
                    for (a = this.prepare(a, b); a.step(); ) c(a.getAsObject());
                    a.free();
                    if ('function' === typeof d) return d();
                };
                a.prototype.prepare = function (a, c) {
                    ma(b);
                    this.handleError(y(this.db, a, -1, b, ja));
                    a = q(b, 'i32');
                    if (a === ja) throw 'Nothing to prepare';
                    var e = new d(a, this);
                    null != c && e.bind(c);
                    return (this.Eb[a] = e);
                };
                a.prototype['export'] = function () {
                    var a;
                    var c = this.Eb;
                    for (e in c) {
                        var d = c[e];
                        d.free();
                    }
                    d = this.qb;
                    for (e in d) (c = d[e]), (w[c - oa] = null);
                    this.qb = {};
                    this.handleError(k(this.db));
                    d = this.filename;
                    var e = (e = { encoding: 'binary' });
                    e.flags = e.flags || 'r';
                    e.encoding = e.encoding || 'binary';
                    if ('utf8' !== e.encoding && 'binary' !== e.encoding)
                        throw Error(
                            'Invalid encoding type "' + e.encoding + '"',
                        );
                    c = p(d, e.flags);
                    d = pa(d).size;
                    var m = new Uint8Array(d);
                    qa(c, m, 0, d, 0);
                    'utf8' === e.encoding
                        ? (a = ra(m, 0))
                        : 'binary' === e.encoding && (a = m);
                    ia(c);
                    this.handleError(g(this.filename, b));
                    this.db = q(b, 'i32');
                    return a;
                };
                a.prototype.close = function () {
                    var a;
                    var b = this.Eb;
                    for (a in b) {
                        var c = b[a];
                        c.free();
                    }
                    c = this.qb;
                    for (a in c) (b = c[a]), (w[b - oa] = null);
                    this.qb = {};
                    this.handleError(k(this.db));
                    sa('/' + this.filename);
                    return (this.db = null);
                };
                a.prototype.handleError = function (a) {
                    if (a === c.Ab) return null;
                    a = yc(this.db);
                    throw Error(a);
                };
                a.prototype.getRowsModified = function () {
                    return B(this.db);
                };
                a.prototype.create_function = function (a, b) {
                    a in this.qb &&
                        ((w[this.qb[a] - oa] = null), delete this.qb[a]);
                    var d = ta(function (a, c, d) {
                        var e, g;
                        var k = [];
                        for (
                            e = g = 0;
                            0 <= c ? g < c : g > c;
                            e = 0 <= c ? ++g : --g
                        ) {
                            var m = q(d + 4 * e, 'i32');
                            var y = Ac(m);
                            e = (function () {
                                switch (!1) {
                                    case 1 !== y:
                                        return Ab;
                                    case 2 !== y:
                                        return Ab;
                                    case 3 !== y:
                                        return Bc;
                                    case 4 !== y:
                                        return function (a) {
                                            var b, c;
                                            var d = Dc(a);
                                            var e = Ec(a);
                                            a = new Uint8Array(d);
                                            for (
                                                b = c = 0;
                                                0 <= d ? c < d : c > d;
                                                b = 0 <= d ? ++c : --c
                                            )
                                                a[b] = l[e + b];
                                            return a;
                                        };
                                    default:
                                        return function () {
                                            return null;
                                        };
                                }
                            })();
                            e = e(m);
                            k.push(e);
                        }
                        try {
                            var x = b.apply(null, k);
                        } catch (Cc) {
                            x = Cc;
                            Bb(a, x, -1);
                            return;
                        }
                        switch (typeof x) {
                            case 'boolean':
                                Fc(a, x ? 1 : 0);
                                break;
                            case 'number':
                                Gc(a, x);
                                break;
                            case 'string':
                                Hc(a, x, -1, -1);
                                break;
                            case 'object':
                                null === x
                                    ? Cb(a)
                                    : null != x.length
                                    ? ((c = ba(x)),
                                      Ic(a, c, x.length, -1),
                                      ca(c))
                                    : Bb(
                                          a,
                                          'Wrong API use : tried to return a value of an unknown type (' +
                                              x +
                                              ').',
                                          -1,
                                      );
                                break;
                            default:
                                Cb(a);
                        }
                    });
                    this.qb[a] = d;
                    this.handleError(
                        Jc(this.db, a, b.length, c.$b, 0, d, 0, 0, 0),
                    );
                    return this;
                };
                return a;
            })();
            var g = f.cwrap('sqlite3_open', 'number', ['string', 'number']);
            var k = f.cwrap('sqlite3_close_v2', 'number', ['number']);
            var m = f.cwrap('sqlite3_exec', 'number', [
                'number',
                'string',
                'number',
                'number',
                'number',
            ]);
            f.cwrap('sqlite3_free', '', ['number']);
            var B = f.cwrap('sqlite3_changes', 'number', ['number']);
            var y = f.cwrap('sqlite3_prepare_v2', 'number', [
                'number',
                'string',
                'number',
                'number',
                'number',
            ]);
            var x = f.cwrap('sqlite3_prepare_v2', 'number', [
                'number',
                'number',
                'number',
                'number',
                'number',
            ]);
            var xa = f.cwrap('sqlite3_bind_text', 'number', [
                'number',
                'number',
                'number',
                'number',
                'number',
            ]);
            var T = f.cwrap('sqlite3_bind_blob', 'number', [
                'number',
                'number',
                'number',
                'number',
                'number',
            ]);
            var sc = f.cwrap('sqlite3_bind_double', 'number', [
                'number',
                'number',
                'number',
            ]);
            var rc = f.cwrap('sqlite3_bind_int', 'number', [
                'number',
                'number',
                'number',
            ]);
            var tc = f.cwrap('sqlite3_bind_parameter_index', 'number', [
                'number',
                'string',
            ]);
            var kc = f.cwrap('sqlite3_step', 'number', ['number']);
            var yc = f.cwrap('sqlite3_errmsg', 'string', ['number']);
            var vb = f.cwrap('sqlite3_data_count', 'number', ['number']);
            var lc = f.cwrap('sqlite3_column_double', 'number', [
                'number',
                'number',
            ]);
            var mc = f.cwrap('sqlite3_column_text', 'string', [
                'number',
                'number',
            ]);
            var oc = f.cwrap('sqlite3_column_blob', 'number', [
                'number',
                'number',
            ]);
            var nc = f.cwrap('sqlite3_column_bytes', 'number', [
                'number',
                'number',
            ]);
            var pc = f.cwrap('sqlite3_column_type', 'number', [
                'number',
                'number',
            ]);
            var qc = f.cwrap('sqlite3_column_name', 'string', [
                'number',
                'number',
            ]);
            var vc = f.cwrap('sqlite3_reset', 'number', ['number']);
            var uc = f.cwrap('sqlite3_clear_bindings', 'number', ['number']);
            var wc = f.cwrap('sqlite3_finalize', 'number', ['number']);
            var Jc = f.cwrap(
                'sqlite3_create_function_v2',
                'number',
                'number string number number number number number number number'.split(
                    ' ',
                ),
            );
            var Ac = f.cwrap('sqlite3_value_type', 'number', ['number']);
            var Dc = f.cwrap('sqlite3_value_bytes', 'number', ['number']);
            var Bc = f.cwrap('sqlite3_value_text', 'string', ['number']);
            f.cwrap('sqlite3_value_int', 'number', ['number']);
            var Ec = f.cwrap('sqlite3_value_blob', 'number', ['number']);
            var Ab = f.cwrap('sqlite3_value_double', 'number', ['number']);
            var Gc = f.cwrap('sqlite3_result_double', '', ['number', 'number']);
            var Cb = f.cwrap('sqlite3_result_null', '', ['number']);
            var Hc = f.cwrap('sqlite3_result_text', '', [
                'number',
                'string',
                'number',
                'number',
            ]);
            var Ic = f.cwrap('sqlite3_result_blob', '', [
                'number',
                'number',
                'number',
                'number',
            ]);
            var Fc = f.cwrap('sqlite3_result_int', '', ['number', 'number']);
            f.cwrap('sqlite3_result_int64', '', ['number', 'number']);
            var Bb = f.cwrap('sqlite3_result_error', '', [
                'number',
                'string',
                'number',
            ]);
            var xc = f.cwrap('RegisterExtensionFunctions', 'number', [
                'number',
            ]);
            this.SQL = { Database: e };
            for (a in this.SQL) f[a] = this.SQL[a];
            var ja = 0;
            c.Ab = 0;
            c.Ae = 1;
            c.Te = 2;
            c.cf = 3;
            c.tc = 4;
            c.vc = 5;
            c.We = 6;
            c.NOMEM = 7;
            c.ff = 8;
            c.Ue = 9;
            c.Ve = 10;
            c.yc = 11;
            c.NOTFOUND = 12;
            c.Se = 13;
            c.wc = 14;
            c.df = 15;
            c.EMPTY = 16;
            c.gf = 17;
            c.hf = 18;
            c.xc = 19;
            c.Xe = 20;
            c.Ye = 21;
            c.Ze = 22;
            c.uc = 23;
            c.Re = 24;
            c.ef = 25;
            c.$e = 26;
            c.af = 27;
            c.jf = 28;
            c.Yb = 100;
            c.DONE = 101;
            c.Xb = 1;
            c.FLOAT = 2;
            c.Zb = 3;
            c.Wb = 4;
            c.bf = 5;
            c.$b = 1;
        }.bind(this);
        f.preRun = f.preRun || [];
        f.preRun.push(ua);
        var va = {},
            z;
        for (z in f) f.hasOwnProperty(z) && (va[z] = f[z]);
        var wa = './this.program',
            ya = !1,
            A = !1,
            C = !1,
            za = !1,
            Aa = !1;
        ya = 'object' === typeof window;
        A = 'function' === typeof importScripts;
        C =
            (za =
                'object' === typeof process &&
                'object' === typeof process.versions &&
                'string' === typeof process.versions.node) &&
            !ya &&
            !A;
        Aa = !ya && !C && !A;
        var D = '',
            Ba,
            Ca;
        if (C) {
            D = __dirname + '/';
            var Da, Ea;
            Ba = function (a, b) {
                var c = Fa(a);
                c ||
                    (Da || (Da = require('fs')),
                    Ea || (Ea = require('path')),
                    (a = Ea.normalize(a)),
                    (c = Da.readFileSync(a)));
                return b ? c : c.toString();
            };
            Ca = function (a) {
                a = Ba(a, !0);
                a.buffer || (a = new Uint8Array(a));
                assert(a.buffer);
                return a;
            };
            1 < process.argv.length &&
                (wa = process.argv[1].replace(/\\/g, '/'));
            process.argv.slice(2);
            'undefined' !== typeof module && (module.exports = f);
            process.on('unhandledRejection', E);
            f.inspect = function () {
                return '[Emscripten Module object]';
            };
        } else if (Aa)
            'undefined' != typeof read &&
                (Ba = function (a) {
                    var b = Fa(a);
                    return b ? Ga(b) : read(a);
                }),
                (Ca = function (a) {
                    var b;
                    if ((b = Fa(a))) return b;
                    if ('function' === typeof readbuffer)
                        return new Uint8Array(readbuffer(a));
                    b = read(a, 'binary');
                    assert('object' === typeof b);
                    return b;
                }),
                'undefined' !== typeof print &&
                    ('undefined' === typeof console && (console = {}),
                    (console.log = print),
                    (console.warn = console.error =
                        'undefined' !== typeof printErr ? printErr : print));
        else if (ya || A)
            A
                ? (D = self.location.href)
                : document.currentScript && (D = document.currentScript.src),
                (D =
                    0 !== D.indexOf('blob:')
                        ? D.substr(0, D.lastIndexOf('/') + 1)
                        : ''),
                (Ba = function (a) {
                    try {
                        var b = new XMLHttpRequest();
                        b.open('GET', a, !1);
                        b.send(null);
                        return b.responseText;
                    } catch (c) {
                        if ((a = Fa(a))) return Ga(a);
                        throw c;
                    }
                }),
                A &&
                    (Ca = function (a) {
                        try {
                            var b = new XMLHttpRequest();
                            b.open('GET', a, !1);
                            b.responseType = 'arraybuffer';
                            b.send(null);
                            return new Uint8Array(b.response);
                        } catch (c) {
                            if ((a = Fa(a))) return a;
                            throw c;
                        }
                    });
        var Ha = f.print || console.log.bind(console),
            F = f.printErr || console.warn.bind(console);
        for (z in va) va.hasOwnProperty(z) && (f[z] = va[z]);
        va = null;
        f.thisProgram && (wa = f.thisProgram);
        function Ia(a) {
            var b = G[Ja >> 2];
            a = (b + a + 15) & -16;
            a > Ka() && E();
            G[Ja >> 2] = a;
            return b;
        }
        var La = {
                'f64-rem': function (a, b) {
                    return a % b;
                },
                debugger: function () {},
            },
            oa = 1,
            w = Array(64);
        function ta(a) {
            for (var b = 0; 64 > b; b++) if (!w[b]) return (w[b] = a), oa + b;
            throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
        }
        var Ma;
        f.wasmBinary && (Ma = f.wasmBinary);
        'object' !== typeof WebAssembly && F('no native wasm support detected');
        function ma(a) {
            var b = 'i32';
            '*' === b.charAt(b.length - 1) && (b = 'i32');
            switch (b) {
                case 'i1':
                    l[a >> 0] = 0;
                    break;
                case 'i8':
                    l[a >> 0] = 0;
                    break;
                case 'i16':
                    Na[a >> 1] = 0;
                    break;
                case 'i32':
                    G[a >> 2] = 0;
                    break;
                case 'i64':
                    H = [
                        0,
                        ((I = 0),
                        1 <= +Oa(I)
                            ? 0 < I
                                ? (Pa(+Ra(I / 4294967296), 4294967295) | 0) >>>
                                  0
                                : ~~+Sa((I - +(~~I >>> 0)) / 4294967296) >>> 0
                            : 0),
                    ];
                    G[a >> 2] = H[0];
                    G[(a + 4) >> 2] = H[1];
                    break;
                case 'float':
                    Ta[a >> 2] = 0;
                    break;
                case 'double':
                    Ua[a >> 3] = 0;
                    break;
                default:
                    E('invalid type for setValue: ' + b);
            }
        }
        function q(a, b) {
            b = b || 'i8';
            '*' === b.charAt(b.length - 1) && (b = 'i32');
            switch (b) {
                case 'i1':
                    return l[a >> 0];
                case 'i8':
                    return l[a >> 0];
                case 'i16':
                    return Na[a >> 1];
                case 'i32':
                    return G[a >> 2];
                case 'i64':
                    return G[a >> 2];
                case 'float':
                    return Ta[a >> 2];
                case 'double':
                    return Ua[a >> 3];
                default:
                    E('invalid type for getValue: ' + b);
            }
            return null;
        }
        var J,
            Va = new WebAssembly.Table({
                initial: 2688,
                maximum: 2688,
                element: 'anyfunc',
            }),
            Wa = !1;
        function assert(a, b) {
            a || E('Assertion failed: ' + b);
        }
        function Xa(a) {
            var b = f['_' + a];
            assert(
                b,
                'Cannot call unknown function ' +
                    a +
                    ', make sure it is exported',
            );
            return b;
        }
        function Ya(a, b, c, d) {
            var e = {
                    string: function (a) {
                        var b = 0;
                        if (null !== a && void 0 !== a && 0 !== a) {
                            var c = (a.length << 2) + 1;
                            b = h(c);
                            v(a, K, b, c);
                        }
                        return b;
                    },
                    array: function (a) {
                        var b = h(a.length);
                        l.set(a, b);
                        return b;
                    },
                },
                g = Xa(a),
                k = [];
            a = 0;
            if (d)
                for (var m = 0; m < d.length; m++) {
                    var B = e[c[m]];
                    B
                        ? (0 === a && (a = ka()), (k[m] = B(d[m])))
                        : (k[m] = d[m]);
                }
            c = g.apply(null, k);
            c = (function (a) {
                return 'string' === b ? L(a) : 'boolean' === b ? !!a : a;
            })(c);
            0 !== a && na(a);
            return c;
        }
        var Za = 0,
            $a = 3;
        function ba(a) {
            var b = Za;
            if ('number' === typeof a) {
                var c = !0;
                var d = a;
            } else (c = !1), (d = a.length);
            b = b == $a ? e : [ab, h, Ia][b](Math.max(d, 1));
            if (c) {
                var e = b;
                assert(0 == (b & 3));
                for (a = b + (d & -4); e < a; e += 4) G[e >> 2] = 0;
                for (a = b + d; e < a; ) l[e++ >> 0] = 0;
                return b;
            }
            a.subarray || a.slice ? K.set(a, b) : K.set(new Uint8Array(a), b);
            return b;
        }
        var bb =
            'undefined' !== typeof TextDecoder
                ? new TextDecoder('utf8')
                : void 0;
        function ra(a, b, c) {
            var d = b + c;
            for (c = b; a[c] && !(c >= d); ) ++c;
            if (16 < c - b && a.subarray && bb)
                return bb.decode(a.subarray(b, c));
            for (d = ''; b < c; ) {
                var e = a[b++];
                if (e & 128) {
                    var g = a[b++] & 63;
                    if (192 == (e & 224))
                        d += String.fromCharCode(((e & 31) << 6) | g);
                    else {
                        var k = a[b++] & 63;
                        e =
                            224 == (e & 240)
                                ? ((e & 15) << 12) | (g << 6) | k
                                : ((e & 7) << 18) |
                                  (g << 12) |
                                  (k << 6) |
                                  (a[b++] & 63);
                        65536 > e
                            ? (d += String.fromCharCode(e))
                            : ((e -= 65536),
                              (d += String.fromCharCode(
                                  55296 | (e >> 10),
                                  56320 | (e & 1023),
                              )));
                    }
                } else d += String.fromCharCode(e);
            }
            return d;
        }
        function L(a) {
            return a ? ra(K, a, void 0) : '';
        }
        function v(a, b, c, d) {
            if (!(0 < d)) return 0;
            var e = c;
            d = c + d - 1;
            for (var g = 0; g < a.length; ++g) {
                var k = a.charCodeAt(g);
                if (55296 <= k && 57343 >= k) {
                    var m = a.charCodeAt(++g);
                    k = (65536 + ((k & 1023) << 10)) | (m & 1023);
                }
                if (127 >= k) {
                    if (c >= d) break;
                    b[c++] = k;
                } else {
                    if (2047 >= k) {
                        if (c + 1 >= d) break;
                        b[c++] = 192 | (k >> 6);
                    } else {
                        if (65535 >= k) {
                            if (c + 2 >= d) break;
                            b[c++] = 224 | (k >> 12);
                        } else {
                            if (c + 3 >= d) break;
                            b[c++] = 240 | (k >> 18);
                            b[c++] = 128 | ((k >> 12) & 63);
                        }
                        b[c++] = 128 | ((k >> 6) & 63);
                    }
                    b[c++] = 128 | (k & 63);
                }
            }
            b[c] = 0;
            return c - e;
        }
        function la(a) {
            for (var b = 0, c = 0; c < a.length; ++c) {
                var d = a.charCodeAt(c);
                55296 <= d &&
                    57343 >= d &&
                    (d =
                        (65536 + ((d & 1023) << 10)) |
                        (a.charCodeAt(++c) & 1023));
                127 >= d
                    ? ++b
                    : (b = 2047 >= d ? b + 2 : 65535 >= d ? b + 3 : b + 4);
            }
            return b;
        }
        'undefined' !== typeof TextDecoder && new TextDecoder('utf-16le');
        function cb(a) {
            0 < a % 65536 && (a += 65536 - (a % 65536));
            return a;
        }
        var buffer, l, K, Na, G, Ta, Ua;
        function db(a) {
            buffer = a;
            f.HEAP8 = l = new Int8Array(a);
            f.HEAP16 = Na = new Int16Array(a);
            f.HEAP32 = G = new Int32Array(a);
            f.HEAPU8 = K = new Uint8Array(a);
            f.HEAPU16 = new Uint16Array(a);
            f.HEAPU32 = new Uint32Array(a);
            f.HEAPF32 = Ta = new Float32Array(a);
            f.HEAPF64 = Ua = new Float64Array(a);
        }
        var Ja = 60128,
            eb = f.TOTAL_MEMORY || 16777216;
        f.wasmMemory
            ? (J = f.wasmMemory)
            : (J = new WebAssembly.Memory({ initial: eb / 65536 }));
        J && (buffer = J.buffer);
        eb = buffer.byteLength;
        db(buffer);
        G[Ja >> 2] = 5303216;
        function fb(a) {
            for (; 0 < a.length; ) {
                var b = a.shift();
                if ('function' == typeof b) b();
                else {
                    var c = b.ic;
                    'number' === typeof c
                        ? void 0 === b.Hb
                            ? f.dynCall_v(c)
                            : f.dynCall_vi(c, b.Hb)
                        : c(void 0 === b.Hb ? null : b.Hb);
                }
            }
        }
        var gb = [],
            hb = [],
            ib = [],
            jb = [],
            kb = !1;
        function lb() {
            var a = f.preRun.shift();
            gb.unshift(a);
        }
        var Oa = Math.abs,
            Sa = Math.ceil,
            Ra = Math.floor,
            Pa = Math.min,
            mb = 0,
            nb = null,
            ob = null;
        f.preloadedImages = {};
        f.preloadedAudios = {};
        function E(a) {
            if (f.onAbort) f.onAbort(a);
            Ha(a);
            F(a);
            Wa = !0;
            throw 'abort(' + a + '). Build with -s ASSERTIONS=1 for more info.';
        }
        var pb = 'data:application/octet-stream;base64,';
        function qb(a) {
            return String.prototype.startsWith
                ? a.startsWith(pb)
                : 0 === a.indexOf(pb);
        }
        var M =
        if (!qb(M)) {
            var rb = M;
            M = f.locateFile ? f.locateFile(rb, D) : D + rb;
        }
        function sb() {
            try {
                if (Ma) return new Uint8Array(Ma);
                var a = Fa(M);
                if (a) return a;
                if (Ca) return Ca(M);
                throw 'both async and sync fetching of the wasm failed';
            } catch (b) {
                E(b);
            }
        }
        function tb() {
            return Ma || (!ya && !A) || 'function' !== typeof fetch
                ? new Promise(function (a) {
                      a(sb());
                  })
                : fetch(M, { credentials: 'same-origin' })
                      .then(function (a) {
                          if (!a.ok)
                              throw (
                                  "failed to load wasm binary file at '" +
                                  M +
                                  "'"
                              );
                          return a.arrayBuffer();
                      })
                      .catch(function () {
                          return sb();
                      });
        }
        f.asm = function () {
            function a(a) {
                f.asm = a.exports;
                mb--;
                f.monitorRunDependencies && f.monitorRunDependencies(mb);
                0 == mb &&
                    (null !== nb && (clearInterval(nb), (nb = null)),
                    ob && ((a = ob), (ob = null), a()));
            }
            function b(b) {
                a(b.instance);
            }
            function c(a) {
                return tb()
                    .then(function (a) {
                        return WebAssembly.instantiate(a, d);
                    })
                    .then(a, function (a) {
                        F('failed to asynchronously prepare wasm: ' + a);
                        E(a);
                    });
            }
            var d = {
                env: ub,
                wasi_unstable: ub,
                global: { NaN: NaN, Infinity: Infinity },
                'global.Math': Math,
                asm2wasm: La,
            };
            mb++;
            f.monitorRunDependencies && f.monitorRunDependencies(mb);
            if (f.instantiateWasm)
                try {
                    return f.instantiateWasm(d, a);
                } catch (e) {
                    return (
                        F(
                            'Module.instantiateWasm callback failed with error: ' +
                                e,
                        ),
                        !1
                    );
                }
            (function () {
                if (
                    Ma ||
                    'function' !== typeof WebAssembly.instantiateStreaming ||
                    qb(M) ||
                    'function' !== typeof fetch
                )
                    return c(b);
                fetch(M, { credentials: 'same-origin' }).then(function (a) {
                    return WebAssembly.instantiateStreaming(a, d).then(
                        b,
                        function (a) {
                            F('wasm streaming compile failed: ' + a);
                            F('falling back to ArrayBuffer instantiation');
                            c(b);
                        },
                    );
                });
            })();
            return {};
        };
        var I, H;
        hb.push({
            ic: function () {
                wb();
            },
        });
        function xb(a) {
            return a.replace(/\b__Z[\w\d_]+/g, function (a) {
                return a === a ? a : a + ' [' + a + ']';
            });
        }
        var N = {};
        function yb(a) {
            if (yb.tb) {
                var b = G[a >> 2];
                var c = G[b >> 2];
            } else
                (yb.tb = !0),
                    (N.USER = N.LOGNAME = 'web_user'),
                    (N.PATH = '/'),
                    (N.PWD = '/'),
                    (N.HOME = '/home/web_user'),
                    (N.LANG =
                        (
                            ('object' === typeof navigator &&
                                navigator.languages &&
                                navigator.languages[0]) ||
                            'C'
                        ).replace('-', '_') + '.UTF-8'),
                    (N._ = wa),
                    (c = kb ? ab(1024) : Ia(1024)),
                    (b = kb ? ab(256) : Ia(256)),
                    (G[b >> 2] = c),
                    (G[a >> 2] = b);
            a = [];
            var d = 0,
                e;
            for (e in N)
                if ('string' === typeof N[e]) {
                    var g = e + '=' + N[e];
                    a.push(g);
                    d += g.length;
                }
            if (1024 < d)
                throw Error('Environment size exceeded TOTAL_ENV_SIZE!');
            for (e = 0; e < a.length; e++) {
                d = g = a[e];
                for (var k = c, m = 0; m < d.length; ++m)
                    l[k++ >> 0] = d.charCodeAt(m);
                l[k >> 0] = 0;
                G[(b + 4 * e) >> 2] = c;
                c += g.length + 1;
            }
            G[(b + 4 * a.length) >> 2] = 0;
        }
        function zb(a, b) {
            for (var c = 0, d = a.length - 1; 0 <= d; d--) {
                var e = a[d];
                '.' === e
                    ? a.splice(d, 1)
                    : '..' === e
                    ? (a.splice(d, 1), c++)
                    : c && (a.splice(d, 1), c--);
            }
            if (b) for (; c; c--) a.unshift('..');
            return a;
        }
        function Db(a) {
            var b = '/' === a.charAt(0),
                c = '/' === a.substr(-1);
            (a = zb(
                a.split('/').filter(function (a) {
                    return !!a;
                }),
                !b,
            ).join('/')) ||
                b ||
                (a = '.');
            a && c && (a += '/');
            return (b ? '/' : '') + a;
        }
        function Eb(a) {
            var b =
                /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
                    .exec(a)
                    .slice(1);
            a = b[0];
            b = b[1];
            if (!a && !b) return '.';
            b && (b = b.substr(0, b.length - 1));
            return a + b;
        }
        function Fb(a) {
            if ('/' === a) return '/';
            var b = a.lastIndexOf('/');
            return -1 === b ? a : a.substr(b + 1);
        }
        function Gb() {
            var a = Array.prototype.slice.call(arguments, 0);
            return Db(a.join('/'));
        }
        function n(a, b) {
            return Db(a + '/' + b);
        }
        function Hb(a) {
            f.___errno_location && (G[f.___errno_location() >> 2] = a);
        }
        function Ib() {
            for (
                var a = '', b = !1, c = arguments.length - 1;
                -1 <= c && !b;
                c--
            ) {
                b = 0 <= c ? arguments[c] : '/';
                if ('string' !== typeof b)
                    throw new TypeError(
                        'Arguments to path.resolve must be strings',
                    );
                if (!b) return '';
                a = b + '/' + a;
                b = '/' === b.charAt(0);
            }
            a = zb(
                a.split('/').filter(function (a) {
                    return !!a;
                }),
                !b,
            ).join('/');
            return (b ? '/' : '') + a || '.';
        }
        var Jb = [];
        function Kb(a, b) {
            Jb[a] = { input: [], output: [], xb: b };
            Lb(a, Mb);
        }
        var Mb = {
                open: function (a) {
                    var b = Jb[a.node.rdev];
                    if (!b) throw new O(43);
                    a.tty = b;
                    a.seekable = !1;
                },
                close: function (a) {
                    a.tty.xb.flush(a.tty);
                },
                flush: function (a) {
                    a.tty.xb.flush(a.tty);
                },
                read: function (a, b, c, d) {
                    if (!a.tty || !a.tty.xb.Ub) throw new O(60);
                    for (var e = 0, g = 0; g < d; g++) {
                        try {
                            var k = a.tty.xb.Ub(a.tty);
                        } catch (m) {
                            throw new O(29);
                        }
                        if (void 0 === k && 0 === e) throw new O(6);
                        if (null === k || void 0 === k) break;
                        e++;
                        b[c + g] = k;
                    }
                    e && (a.node.timestamp = Date.now());
                    return e;
                },
                write: function (a, b, c, d) {
                    if (!a.tty || !a.tty.xb.Lb) throw new O(60);
                    try {
                        for (var e = 0; e < d; e++)
                            a.tty.xb.Lb(a.tty, b[c + e]);
                    } catch (g) {
                        throw new O(29);
                    }
                    d && (a.node.timestamp = Date.now());
                    return e;
                },
            },
            Nb = {
                Ub: function (a) {
                    if (!a.input.length) {
                        var b = null;
                        if (C) {
                            var c = Buffer.tb
                                    ? Buffer.tb(256)
                                    : new Buffer(256),
                                d = 0;
                            try {
                                d = fs.readSync(
                                    process.stdin.fd,
                                    c,
                                    0,
                                    256,
                                    null,
                                );
                            } catch (e) {
                                if (-1 != e.toString().indexOf('EOF')) d = 0;
                                else throw e;
                            }
                            0 < d
                                ? (b = c.slice(0, d).toString('utf-8'))
                                : (b = null);
                        } else
                            'undefined' != typeof window &&
                            'function' == typeof window.prompt
                                ? ((b = window.prompt('Input: ')),
                                  null !== b && (b += '\n'))
                                : 'function' == typeof readline &&
                                  ((b = readline()), null !== b && (b += '\n'));
                        if (!b) return null;
                        a.input = aa(b, !0);
                    }
                    return a.input.shift();
                },
                Lb: function (a, b) {
                    null === b || 10 === b
                        ? (Ha(ra(a.output, 0)), (a.output = []))
                        : 0 != b && a.output.push(b);
                },
                flush: function (a) {
                    a.output &&
                        0 < a.output.length &&
                        (Ha(ra(a.output, 0)), (a.output = []));
                },
            },
            Ob = {
                Lb: function (a, b) {
                    null === b || 10 === b
                        ? (F(ra(a.output, 0)), (a.output = []))
                        : 0 != b && a.output.push(b);
                },
                flush: function (a) {
                    a.output &&
                        0 < a.output.length &&
                        (F(ra(a.output, 0)), (a.output = []));
                },
            },
            u = {
                ob: null,
                lb: function () {
                    return u.createNode(null, '/', 16895, 0);
                },
                createNode: function (a, b, c, d) {
                    if (24576 === (c & 61440) || 4096 === (c & 61440))
                        throw new O(63);
                    u.ob ||
                        (u.ob = {
                            dir: {
                                node: {
                                    nb: u.cb.nb,
                                    jb: u.cb.jb,
                                    lookup: u.cb.lookup,
                                    yb: u.cb.yb,
                                    rename: u.cb.rename,
                                    unlink: u.cb.unlink,
                                    rmdir: u.cb.rmdir,
                                    readdir: u.cb.readdir,
                                    symlink: u.cb.symlink,
                                },
                                stream: { rb: u.fb.rb },
                            },
                            file: {
                                node: { nb: u.cb.nb, jb: u.cb.jb },
                                stream: {
                                    rb: u.fb.rb,
                                    read: u.fb.read,
                                    write: u.fb.write,
                                    Nb: u.fb.Nb,
                                    Cb: u.fb.Cb,
                                    Db: u.fb.Db,
                                },
                            },
                            link: {
                                node: {
                                    nb: u.cb.nb,
                                    jb: u.cb.jb,
                                    readlink: u.cb.readlink,
                                },
                                stream: {},
                            },
                            Qb: {
                                node: { nb: u.cb.nb, jb: u.cb.jb },
                                stream: Pb,
                            },
                        });
                    c = Qb(a, b, c, d);
                    P(c.mode)
                        ? ((c.cb = u.ob.dir.node),
                          (c.fb = u.ob.dir.stream),
                          (c.eb = {}))
                        : 32768 === (c.mode & 61440)
                        ? ((c.cb = u.ob.file.node),
                          (c.fb = u.ob.file.stream),
                          (c.ib = 0),
                          (c.eb = null))
                        : 40960 === (c.mode & 61440)
                        ? ((c.cb = u.ob.link.node), (c.fb = u.ob.link.stream))
                        : 8192 === (c.mode & 61440) &&
                          ((c.cb = u.ob.Qb.node), (c.fb = u.ob.Qb.stream));
                    c.timestamp = Date.now();
                    a && (a.eb[b] = c);
                    return c;
                },
                kf: function (a) {
                    if (a.eb && a.eb.subarray) {
                        for (var b = [], c = 0; c < a.ib; ++c) b.push(a.eb[c]);
                        return b;
                    }
                    return a.eb;
                },
                lf: function (a) {
                    return a.eb
                        ? a.eb.subarray
                            ? a.eb.subarray(0, a.ib)
                            : new Uint8Array(a.eb)
                        : new Uint8Array();
                },
                Ib: function (a, b) {
                    var c = a.eb ? a.eb.length : 0;
                    c >= b ||
                        ((b = Math.max(b, (c * (1048576 > c ? 2 : 1.125)) | 0)),
                        0 != c && (b = Math.max(b, 256)),
                        (c = a.eb),
                        (a.eb = new Uint8Array(b)),
                        0 < a.ib && a.eb.set(c.subarray(0, a.ib), 0));
                },
                pc: function (a, b) {
                    if (a.ib != b)
                        if (0 == b) (a.eb = null), (a.ib = 0);
                        else {
                            if (!a.eb || a.eb.subarray) {
                                var c = a.eb;
                                a.eb = new Uint8Array(new ArrayBuffer(b));
                                c && a.eb.set(c.subarray(0, Math.min(b, a.ib)));
                            } else if ((a.eb || (a.eb = []), a.eb.length > b))
                                a.eb.length = b;
                            else for (; a.eb.length < b; ) a.eb.push(0);
                            a.ib = b;
                        }
                },
                cb: {
                    nb: function (a) {
                        var b = {};
                        b.dev = 8192 === (a.mode & 61440) ? a.id : 1;
                        b.ino = a.id;
                        b.mode = a.mode;
                        b.nlink = 1;
                        b.uid = 0;
                        b.gid = 0;
                        b.rdev = a.rdev;
                        P(a.mode)
                            ? (b.size = 4096)
                            : 32768 === (a.mode & 61440)
                            ? (b.size = a.ib)
                            : 40960 === (a.mode & 61440)
                            ? (b.size = a.link.length)
                            : (b.size = 0);
                        b.atime = new Date(a.timestamp);
                        b.mtime = new Date(a.timestamp);
                        b.ctime = new Date(a.timestamp);
                        b.sb = 4096;
                        b.blocks = Math.ceil(b.size / b.sb);
                        return b;
                    },
                    jb: function (a, b) {
                        void 0 !== b.mode && (a.mode = b.mode);
                        void 0 !== b.timestamp && (a.timestamp = b.timestamp);
                        void 0 !== b.size && u.pc(a, b.size);
                    },
                    lookup: function () {
                        throw Rb[44];
                    },
                    yb: function (a, b, c, d) {
                        return u.createNode(a, b, c, d);
                    },
                    rename: function (a, b, c) {
                        if (P(a.mode)) {
                            try {
                                var d = t(b, c);
                            } catch (g) {}
                            if (d) for (var e in d.eb) throw new O(55);
                        }
                        delete a.parent.eb[a.name];
                        a.name = c;
                        b.eb[c] = a;
                        a.parent = b;
                    },
                    unlink: function (a, b) {
                        delete a.eb[b];
                    },
                    rmdir: function (a, b) {
                        var c = t(a, b),
                            d;
                        for (d in c.eb) throw new O(55);
                        delete a.eb[b];
                    },
                    readdir: function (a) {
                        var b = ['.', '..'],
                            c;
                        for (c in a.eb) a.eb.hasOwnProperty(c) && b.push(c);
                        return b;
                    },
                    symlink: function (a, b, c) {
                        a = u.createNode(a, b, 41471, 0);
                        a.link = c;
                        return a;
                    },
                    readlink: function (a) {
                        if (40960 !== (a.mode & 61440)) throw new O(28);
                        return a.link;
                    },
                },
                fb: {
                    read: function (a, b, c, d, e) {
                        var g = a.node.eb;
                        if (e >= a.node.ib) return 0;
                        a = Math.min(a.node.ib - e, d);
                        if (8 < a && g.subarray) b.set(g.subarray(e, e + a), c);
                        else for (d = 0; d < a; d++) b[c + d] = g[e + d];
                        return a;
                    },
                    write: function (a, b, c, d, e, g) {
                        g = !1;
                        if (!d) return 0;
                        a = a.node;
                        a.timestamp = Date.now();
                        if (b.subarray && (!a.eb || a.eb.subarray)) {
                            if (g)
                                return (
                                    (a.eb = b.subarray(c, c + d)), (a.ib = d)
                                );
                            if (0 === a.ib && 0 === e)
                                return (
                                    (a.eb = new Uint8Array(
                                        b.subarray(c, c + d),
                                    )),
                                    (a.ib = d)
                                );
                            if (e + d <= a.ib)
                                return a.eb.set(b.subarray(c, c + d), e), d;
                        }
                        u.Ib(a, e + d);
                        if (a.eb.subarray && b.subarray)
                            a.eb.set(b.subarray(c, c + d), e);
                        else for (g = 0; g < d; g++) a.eb[e + g] = b[c + g];
                        a.ib = Math.max(a.ib, e + d);
                        return d;
                    },
                    rb: function (a, b, c) {
                        1 === c
                            ? (b += a.position)
                            : 2 === c &&
                              32768 === (a.node.mode & 61440) &&
                              (b += a.node.ib);
                        if (0 > b) throw new O(28);
                        return b;
                    },
                    Nb: function (a, b, c) {
                        u.Ib(a.node, b + c);
                        a.node.ib = Math.max(a.node.ib, b + c);
                    },
                    Cb: function (a, b, c, d, e, g, k) {
                        if (32768 !== (a.node.mode & 61440)) throw new O(43);
                        c = a.node.eb;
                        if (
                            k & 2 ||
                            (c.buffer !== b && c.buffer !== b.buffer)
                        ) {
                            if (0 < e || e + d < a.node.ib)
                                c.subarray
                                    ? (c = c.subarray(e, e + d))
                                    : (c = Array.prototype.slice.call(
                                          c,
                                          e,
                                          e + d,
                                      ));
                            a = !0;
                            e = b.buffer == l.buffer;
                            d = ab(d);
                            if (!d) throw new O(48);
                            (e ? l : b).set(c, d);
                        } else (a = !1), (d = c.byteOffset);
                        return { oc: d, Fb: a };
                    },
                    Db: function (a, b, c, d, e) {
                        if (32768 !== (a.node.mode & 61440)) throw new O(43);
                        if (e & 2) return 0;
                        u.fb.write(a, b, 0, d, c, !1);
                        return 0;
                    },
                },
            },
            Sb = {
                qe: 63,
                Qd: 44,
                Ee: 71,
                md: 27,
                od: 29,
                me: 60,
                zc: 1,
                Rd: 45,
                Ic: 8,
                Rc: 12,
                Fc: 6,
                Oe: 6,
                Vd: 48,
                Ac: 2,
                dd: 21,
                de: 105,
                Pc: 10,
                cd: 20,
                Pe: 75,
                Pd: 43,
                fe: 54,
                qd: 31,
                nd: 28,
                Kd: 41,
                Cd: 33,
                ke: 59,
                Le: 74,
                ed: 22,
                $d: 51,
                De: 70,
                ze: 69,
                Dd: 34,
                se: 64,
                $c: 18,
                we: 68,
                Wd: 49,
                jd: 24,
                Sc: 106,
                sd: 156,
                td: 107,
                ud: 108,
                Ad: 109,
                Me: 110,
                Nd: 111,
                rd: 112,
                Xc: 16,
                Sd: 46,
                Hc: 113,
                Lc: 114,
                Qe: 115,
                Ld: 104,
                Mc: 103,
                Nc: 102,
                Yc: 16,
                Oc: 101,
                be: 100,
                Od: 116,
                Ie: 117,
                ae: 118,
                Xd: 119,
                Yd: 120,
                ye: 121,
                Td: 47,
                Dc: 122,
                Fe: 123,
                Tc: 124,
                te: 65,
                Fd: 36,
                ad: 125,
                Kc: 9,
                le: 126,
                Jc: 127,
                xe: 128,
                vd: 129,
                wd: 130,
                zd: 131,
                yd: 132,
                xd: 133,
                ce: 52,
                ge: 55,
                Gd: 37,
                Bd: 32,
                ne: 138,
                re: 139,
                Wc: 15,
                Md: 42,
                Ec: 5,
                ve: 67,
                ie: 57,
                Zd: 50,
                Be: 140,
                Vc: 14,
                Bc: 3,
                Uc: 13,
                Jd: 40,
                Hd: 38,
                Je: 73,
                gd: 142,
                hd: 23,
                ld: 26,
                Gc: 7,
                Zc: 17,
                Ed: 35,
                ue: 66,
                Ce: 137,
                Cc: 4,
                Id: 39,
                pd: 30,
                ee: 53,
                Ke: 141,
                Ne: 136,
                bd: 19,
                Ge: 72,
                je: 138,
                Ud: 148,
                kd: 25,
                oe: 61,
                Qc: 11,
                he: 56,
                pe: 62,
                He: 135,
            },
            Q = {
                Bb: !1,
                rc: function () {
                    Q.Bb = !!process.platform.match(/^win/);
                    var a = process.binding('constants');
                    a.fs && (a = a.fs);
                    Q.Rb = {
                        1024: a.O_APPEND,
                        64: a.O_CREAT,
                        128: a.O_EXCL,
                        0: a.O_RDONLY,
                        2: a.O_RDWR,
                        4096: a.O_SYNC,
                        512: a.O_TRUNC,
                        1: a.O_WRONLY,
                    };
                },
                Pb: function (a) {
                    return Buffer.alloc ? Buffer.from(a) : new Buffer(a);
                },
                kb: function (a) {
                    a = a.code;
                    assert(a in Sb);
                    return Sb[a];
                },
                lb: function (a) {
                    assert(za);
                    return Q.createNode(null, '/', Q.Tb(a.Kb.root), 0);
                },
                createNode: function (a, b, c) {
                    if (!P(c) && 32768 !== (c & 61440) && 40960 !== (c & 61440))
                        throw new O(28);
                    a = Qb(a, b, c);
                    a.cb = Q.cb;
                    a.fb = Q.fb;
                    return a;
                },
                Tb: function (a) {
                    try {
                        var b = fs.lstatSync(a);
                        Q.Bb && (b.mode = b.mode | ((b.mode & 292) >> 2));
                    } catch (c) {
                        if (!c.code) throw c;
                        throw new O(Q.kb(c));
                    }
                    return b.mode;
                },
                mb: function (a) {
                    for (var b = []; a.parent !== a; )
                        b.push(a.name), (a = a.parent);
                    b.push(a.lb.Kb.root);
                    b.reverse();
                    return Gb.apply(null, b);
                },
                hc: function (a) {
                    a &= -2656257;
                    var b = 0,
                        c;
                    for (c in Q.Rb) a & c && ((b |= Q.Rb[c]), (a ^= c));
                    if (a) throw new O(28);
                    return b;
                },
                cb: {
                    nb: function (a) {
                        a = Q.mb(a);
                        try {
                            var b = fs.lstatSync(a);
                        } catch (c) {
                            if (!c.code) throw c;
                            throw new O(Q.kb(c));
                        }
                        Q.Bb && !b.sb && (b.sb = 4096);
                        Q.Bb &&
                            !b.blocks &&
                            (b.blocks = ((b.size + b.sb - 1) / b.sb) | 0);
                        return {
                            dev: b.dev,
                            ino: b.ino,
                            mode: b.mode,
                            nlink: b.nlink,
                            uid: b.uid,
                            gid: b.gid,
                            rdev: b.rdev,
                            size: b.size,
                            atime: b.atime,
                            mtime: b.mtime,
                            ctime: b.ctime,
                            sb: b.sb,
                            blocks: b.blocks,
                        };
                    },
                    jb: function (a, b) {
                        var c = Q.mb(a);
                        try {
                            void 0 !== b.mode &&
                                (fs.chmodSync(c, b.mode), (a.mode = b.mode)),
                                void 0 !== b.size && fs.truncateSync(c, b.size);
                        } catch (d) {
                            if (!d.code) throw d;
                            throw new O(Q.kb(d));
                        }
                    },
                    lookup: function (a, b) {
                        var c = n(Q.mb(a), b);
                        c = Q.Tb(c);
                        return Q.createNode(a, b, c);
                    },
                    yb: function (a, b, c, d) {
                        a = Q.createNode(a, b, c, d);
                        b = Q.mb(a);
                        try {
                            P(a.mode)
                                ? fs.mkdirSync(b, a.mode)
                                : fs.writeFileSync(b, '', { mode: a.mode });
                        } catch (e) {
                            if (!e.code) throw e;
                            throw new O(Q.kb(e));
                        }
                        return a;
                    },
                    rename: function (a, b, c) {
                        a = Q.mb(a);
                        b = n(Q.mb(b), c);
                        try {
                            fs.renameSync(a, b);
                        } catch (d) {
                            if (!d.code) throw d;
                            throw new O(Q.kb(d));
                        }
                    },
                    unlink: function (a, b) {
                        a = n(Q.mb(a), b);
                        try {
                            fs.unlinkSync(a);
                        } catch (c) {
                            if (!c.code) throw c;
                            throw new O(Q.kb(c));
                        }
                    },
                    rmdir: function (a, b) {
                        a = n(Q.mb(a), b);
                        try {
                            fs.rmdirSync(a);
                        } catch (c) {
                            if (!c.code) throw c;
                            throw new O(Q.kb(c));
                        }
                    },
                    readdir: function (a) {
                        a = Q.mb(a);
                        try {
                            return fs.readdirSync(a);
                        } catch (b) {
                            if (!b.code) throw b;
                            throw new O(Q.kb(b));
                        }
                    },
                    symlink: function (a, b, c) {
                        a = n(Q.mb(a), b);
                        try {
                            fs.symlinkSync(c, a);
                        } catch (d) {
                            if (!d.code) throw d;
                            throw new O(Q.kb(d));
                        }
                    },
                    readlink: function (a) {
                        var b = Q.mb(a);
                        try {
                            return (
                                (b = fs.readlinkSync(b)),
                                (b = Tb.relative(Tb.resolve(a.lb.Kb.root), b))
                            );
                        } catch (c) {
                            if (!c.code) throw c;
                            throw new O(Q.kb(c));
                        }
                    },
                },
                fb: {
                    open: function (a) {
                        var b = Q.mb(a.node);
                        try {
                            32768 === (a.node.mode & 61440) &&
                                (a.zb = fs.openSync(b, Q.hc(a.flags)));
                        } catch (c) {
                            if (!c.code) throw c;
                            throw new O(Q.kb(c));
                        }
                    },
                    close: function (a) {
                        try {
                            32768 === (a.node.mode & 61440) &&
                                a.zb &&
                                fs.closeSync(a.zb);
                        } catch (b) {
                            if (!b.code) throw b;
                            throw new O(Q.kb(b));
                        }
                    },
                    read: function (a, b, c, d, e) {
                        if (0 === d) return 0;
                        try {
                            return fs.readSync(a.zb, Q.Pb(b.buffer), c, d, e);
                        } catch (g) {
                            throw new O(Q.kb(g));
                        }
                    },
                    write: function (a, b, c, d, e) {
                        try {
                            return fs.writeSync(a.zb, Q.Pb(b.buffer), c, d, e);
                        } catch (g) {
                            throw new O(Q.kb(g));
                        }
                    },
                    rb: function (a, b, c) {
                        if (1 === c) b += a.position;
                        else if (2 === c && 32768 === (a.node.mode & 61440))
                            try {
                                b += fs.fstatSync(a.zb).size;
                            } catch (d) {
                                throw new O(Q.kb(d));
                            }
                        if (0 > b) throw new O(28);
                        return b;
                    },
                },
            },
            Ub = null,
            Vb = {},
            R = [],
            Wb = 1,
            S = null,
            Xb = !0,
            U = {},
            O = null,
            Rb = {};
        function r(a, b) {
            a = Ib('/', a);
            b = b || {};
            if (!a) return { path: '', node: null };
            var c = { Sb: !0, Mb: 0 },
                d;
            for (d in c) void 0 === b[d] && (b[d] = c[d]);
            if (8 < b.Mb) throw new O(32);
            a = zb(
                a.split('/').filter(function (a) {
                    return !!a;
                }),
                !1,
            );
            var e = Ub;
            c = '/';
            for (d = 0; d < a.length; d++) {
                var g = d === a.length - 1;
                if (g && b.parent) break;
                e = t(e, a[d]);
                c = n(c, a[d]);
                e.vb && (!g || (g && b.Sb)) && (e = e.vb.root);
                if (!g || b.ub)
                    for (g = 0; 40960 === (e.mode & 61440); )
                        if (
                            ((e = Yb(c)),
                            (c = Ib(Eb(c), e)),
                            (e = r(c, { Mb: b.Mb }).node),
                            40 < g++)
                        )
                            throw new O(32);
            }
            return { path: c, node: e };
        }
        function Zb(a) {
            for (var b; ; ) {
                if (a === a.parent)
                    return (
                        (a = a.lb.Vb),
                        b ? ('/' !== a[a.length - 1] ? a + '/' + b : a + b) : a
                    );
                b = b ? a.name + '/' + b : a.name;
                a = a.parent;
            }
        }
        function $b(a, b) {
            for (var c = 0, d = 0; d < b.length; d++)
                c = ((c << 5) - c + b.charCodeAt(d)) | 0;
            return ((a + c) >>> 0) % S.length;
        }
        function ac(a) {
            var b = $b(a.parent.id, a.name);
            a.wb = S[b];
            S[b] = a;
        }
        function bc(a) {
            var b = $b(a.parent.id, a.name);
            if (S[b] === a) S[b] = a.wb;
            else
                for (b = S[b]; b; ) {
                    if (b.wb === a) {
                        b.wb = a.wb;
                        break;
                    }
                    b = b.wb;
                }
        }
        function t(a, b) {
            var c;
            if ((c = (c = cc(a, 'x')) ? c : a.cb.lookup ? 0 : 2))
                throw new O(c, a);
            for (c = S[$b(a.id, b)]; c; c = c.wb) {
                var d = c.name;
                if (c.parent.id === a.id && d === b) return c;
            }
            return a.cb.lookup(a, b);
        }
        function Qb(a, b, c, d) {
            dc ||
                ((dc = function (a, b, c, d) {
                    a || (a = this);
                    this.parent = a;
                    this.lb = a.lb;
                    this.vb = null;
                    this.id = Wb++;
                    this.name = b;
                    this.mode = c;
                    this.cb = {};
                    this.fb = {};
                    this.rdev = d;
                }),
                (dc.prototype = {}),
                Object.defineProperties(dc.prototype, {
                    read: {
                        get: function () {
                            return 365 === (this.mode & 365);
                        },
                        set: function (a) {
                            a ? (this.mode |= 365) : (this.mode &= -366);
                        },
                    },
                    write: {
                        get: function () {
                            return 146 === (this.mode & 146);
                        },
                        set: function (a) {
                            a ? (this.mode |= 146) : (this.mode &= -147);
                        },
                    },
                }));
            a = new dc(a, b, c, d);
            ac(a);
            return a;
        }
        function P(a) {
            return 16384 === (a & 61440);
        }
        var ec = {
            r: 0,
            rs: 1052672,
            'r+': 2,
            w: 577,
            wx: 705,
            xw: 705,
            'w+': 578,
            'wx+': 706,
            'xw+': 706,
            a: 1089,
            ax: 1217,
            xa: 1217,
            'a+': 1090,
            'ax+': 1218,
            'xa+': 1218,
        };
        function fc(a) {
            var b = ['r', 'w', 'rw'][a & 3];
            a & 512 && (b += 'w');
            return b;
        }
        function cc(a, b) {
            if (Xb) return 0;
            if (-1 === b.indexOf('r') || a.mode & 292) {
                if (
                    (-1 !== b.indexOf('w') && !(a.mode & 146)) ||
                    (-1 !== b.indexOf('x') && !(a.mode & 73))
                )
                    return 2;
            } else return 2;
            return 0;
        }
        function hc(a, b) {
            try {
                return t(a, b), 20;
            } catch (c) {}
            return cc(a, 'wx');
        }
        function ic(a, b, c) {
            try {
                var d = t(a, b);
            } catch (e) {
                return e.gb;
            }
            if ((a = cc(a, 'wx'))) return a;
            if (c) {
                if (!P(d.mode)) return 54;
                if (d === d.parent || '/' === Zb(d)) return 10;
            } else if (P(d.mode)) return 31;
            return 0;
        }
        function jc(a) {
            var b = 4096;
            for (a = a || 0; a <= b; a++) if (!R[a]) return a;
            throw new O(33);
        }
        function zc(a, b) {
            Kc ||
                ((Kc = function () {}),
                (Kc.prototype = {}),
                Object.defineProperties(Kc.prototype, {
                    object: {
                        get: function () {
                            return this.node;
                        },
                        set: function (a) {
                            this.node = a;
                        },
                    },
                }));
            var c = new Kc(),
                d;
            for (d in a) c[d] = a[d];
            a = c;
            b = jc(b);
            a.fd = b;
            return (R[b] = a);
        }
        var Pb = {
            open: function (a) {
                a.fb = Vb[a.node.rdev].fb;
                a.fb.open && a.fb.open(a);
            },
            rb: function () {
                throw new O(70);
            },
        };
        function Lb(a, b) {
            Vb[a] = { fb: b };
        }
        function Lc(a, b) {
            var c = '/' === b,
                d = !b;
            if (c && Ub) throw new O(10);
            if (!c && !d) {
                var e = r(b, { Sb: !1 });
                b = e.path;
                e = e.node;
                if (e.vb) throw new O(10);
                if (!P(e.mode)) throw new O(54);
            }
            b = { type: a, Kb: {}, Vb: b, nc: [] };
            a = a.lb(b);
            a.lb = b;
            b.root = a;
            c ? (Ub = a) : e && ((e.vb = b), e.lb && e.lb.nc.push(b));
        }
        function ea(a, b, c) {
            var d = r(a, { parent: !0 }).node;
            a = Fb(a);
            if (!a || '.' === a || '..' === a) throw new O(28);
            var e = hc(d, a);
            if (e) throw new O(e);
            if (!d.cb.yb) throw new O(63);
            return d.cb.yb(d, a, b, c);
        }
        function V(a, b) {
            ea(a, ((void 0 !== b ? b : 511) & 1023) | 16384, 0);
        }
        function Mc(a, b, c) {
            'undefined' === typeof c && ((c = b), (b = 438));
            ea(a, b | 8192, c);
        }
        function Nc(a, b) {
            if (!Ib(a)) throw new O(44);
            var c = r(b, { parent: !0 }).node;
            if (!c) throw new O(44);
            b = Fb(b);
            var d = hc(c, b);
            if (d) throw new O(d);
            if (!c.cb.symlink) throw new O(63);
            c.cb.symlink(c, b, a);
        }
        function sa(a) {
            var b = r(a, { parent: !0 }).node,
                c = Fb(a),
                d = t(b, c),
                e = ic(b, c, !1);
            if (e) throw new O(e);
            if (!b.cb.unlink) throw new O(63);
            if (d.vb) throw new O(10);
            try {
                U.willDeletePath && U.willDeletePath(a);
            } catch (g) {
                console.log(
                    "FS.trackingDelegate['willDeletePath']('" +
                        a +
                        "') threw an exception: " +
                        g.message,
                );
            }
            b.cb.unlink(b, c);
            bc(d);
            try {
                if (U.onDeletePath) U.onDeletePath(a);
            } catch (g) {
                console.log(
                    "FS.trackingDelegate['onDeletePath']('" +
                        a +
                        "') threw an exception: " +
                        g.message,
                );
            }
        }
        function Yb(a) {
            a = r(a).node;
            if (!a) throw new O(44);
            if (!a.cb.readlink) throw new O(28);
            return Ib(Zb(a.parent), a.cb.readlink(a));
        }
        function pa(a, b) {
            a = r(a, { ub: !b }).node;
            if (!a) throw new O(44);
            if (!a.cb.nb) throw new O(63);
            return a.cb.nb(a);
        }
        function Oc(a) {
            return pa(a, !0);
        }
        function fa(a, b) {
            var c;
            'string' === typeof a ? (c = r(a, { ub: !0 }).node) : (c = a);
            if (!c.cb.jb) throw new O(63);
            c.cb.jb(c, {
                mode: (b & 4095) | (c.mode & -4096),
                timestamp: Date.now(),
            });
        }
        function Pc(a) {
            var b;
            'string' === typeof a ? (b = r(a, { ub: !0 }).node) : (b = a);
            if (!b.cb.jb) throw new O(63);
            b.cb.jb(b, { timestamp: Date.now() });
        }
        function Qc(a, b) {
            if (0 > b) throw new O(28);
            var c;
            'string' === typeof a ? (c = r(a, { ub: !0 }).node) : (c = a);
            if (!c.cb.jb) throw new O(63);
            if (P(c.mode)) throw new O(31);
            if (32768 !== (c.mode & 61440)) throw new O(28);
            if ((a = cc(c, 'w'))) throw new O(a);
            c.cb.jb(c, { size: b, timestamp: Date.now() });
        }
        function p(a, b, c, d) {
            if ('' === a) throw new O(44);
            if ('string' === typeof b) {
                var e = ec[b];
                if ('undefined' === typeof e)
                    throw Error('Unknown file open mode: ' + b);
                b = e;
            }
            c =
                b & 64
                    ? (('undefined' === typeof c ? 438 : c) & 4095) | 32768
                    : 0;
            if ('object' === typeof a) var g = a;
            else {
                a = Db(a);
                try {
                    g = r(a, { ub: !(b & 131072) }).node;
                } catch (k) {}
            }
            e = !1;
            if (b & 64)
                if (g) {
                    if (b & 128) throw new O(20);
                } else (g = ea(a, c, 0)), (e = !0);
            if (!g) throw new O(44);
            8192 === (g.mode & 61440) && (b &= -513);
            if (b & 65536 && !P(g.mode)) throw new O(54);
            if (
                !e &&
                (c = g
                    ? 40960 === (g.mode & 61440)
                        ? 32
                        : P(g.mode) && ('r' !== fc(b) || b & 512)
                        ? 31
                        : cc(g, fc(b))
                    : 44)
            )
                throw new O(c);
            b & 512 && Qc(g, 0);
            b &= -641;
            d = zc(
                {
                    node: g,
                    path: Zb(g),
                    flags: b,
                    seekable: !0,
                    position: 0,
                    fb: g.fb,
                    sc: [],
                    error: !1,
                },
                d,
            );
            d.fb.open && d.fb.open(d);
            !f.logReadFiles ||
                b & 1 ||
                (Rc || (Rc = {}),
                a in Rc ||
                    ((Rc[a] = 1),
                    console.log(
                        'FS.trackingDelegate error on read file: ' + a,
                    )));
            try {
                U.onOpenFile &&
                    ((g = 0),
                    1 !== (b & 2097155) && (g |= 1),
                    0 !== (b & 2097155) && (g |= 2),
                    U.onOpenFile(a, g));
            } catch (k) {
                console.log(
                    "FS.trackingDelegate['onOpenFile']('" +
                        a +
                        "', flags) threw an exception: " +
                        k.message,
                );
            }
            return d;
        }
        function ia(a) {
            if (null === a.fd) throw new O(8);
            a.Jb && (a.Jb = null);
            try {
                a.fb.close && a.fb.close(a);
            } catch (b) {
                throw b;
            } finally {
                R[a.fd] = null;
            }
            a.fd = null;
        }
        function Sc(a, b, c) {
            if (null === a.fd) throw new O(8);
            if (!a.seekable || !a.fb.rb) throw new O(70);
            if (0 != c && 1 != c && 2 != c) throw new O(28);
            a.position = a.fb.rb(a, b, c);
            a.sc = [];
        }
        function qa(a, b, c, d, e) {
            if (0 > d || 0 > e) throw new O(28);
            if (null === a.fd) throw new O(8);
            if (1 === (a.flags & 2097155)) throw new O(8);
            if (P(a.node.mode)) throw new O(31);
            if (!a.fb.read) throw new O(28);
            var g = 'undefined' !== typeof e;
            if (!g) e = a.position;
            else if (!a.seekable) throw new O(70);
            b = a.fb.read(a, b, c, d, e);
            g || (a.position += b);
            return b;
        }
        function ha(a, b, c, d, e, g) {
            if (0 > d || 0 > e) throw new O(28);
            if (null === a.fd) throw new O(8);
            if (0 === (a.flags & 2097155)) throw new O(8);
            if (P(a.node.mode)) throw new O(31);
            if (!a.fb.write) throw new O(28);
            a.flags & 1024 && Sc(a, 0, 2);
            var k = 'undefined' !== typeof e;
            if (!k) e = a.position;
            else if (!a.seekable) throw new O(70);
            b = a.fb.write(a, b, c, d, e, g);
            k || (a.position += b);
            try {
                if (a.path && U.onWriteToFile) U.onWriteToFile(a.path);
            } catch (m) {
                console.log(
                    "FS.trackingDelegate['onWriteToFile']('" +
                        a.path +
                        "') threw an exception: " +
                        m.message,
                );
            }
            return b;
        }
        function Tc() {
            O ||
                ((O = function (a, b) {
                    this.node = b;
                    this.qc = function (a) {
                        this.gb = a;
                    };
                    this.qc(a);
                    this.message = 'FS error';
                }),
                (O.prototype = Error()),
                (O.prototype.constructor = O),
                [44].forEach(function (a) {
                    Rb[a] = new O(a);
                    Rb[a].stack = '<generic error, no stack>';
                }));
        }
        var Uc;
        function da(a, b) {
            var c = 0;
            a && (c |= 365);
            b && (c |= 146);
            return c;
        }
        function Vc(a, b, c) {
            a = n('/dev', a);
            var d = da(!!b, !!c);
            Wc || (Wc = 64);
            var e = (Wc++ << 8) | 0;
            Lb(e, {
                open: function (a) {
                    a.seekable = !1;
                },
                close: function () {
                    c && c.buffer && c.buffer.length && c(10);
                },
                read: function (a, c, d, e) {
                    for (var g = 0, k = 0; k < e; k++) {
                        try {
                            var m = b();
                        } catch (T) {
                            throw new O(29);
                        }
                        if (void 0 === m && 0 === g) throw new O(6);
                        if (null === m || void 0 === m) break;
                        g++;
                        c[d + k] = m;
                    }
                    g && (a.node.timestamp = Date.now());
                    return g;
                },
                write: function (a, b, d, e) {
                    for (var g = 0; g < e; g++)
                        try {
                            c(b[d + g]);
                        } catch (x) {
                            throw new O(29);
                        }
                    e && (a.node.timestamp = Date.now());
                    return g;
                },
            });
            Mc(a, d, e);
        }
        var Wc,
            W = {},
            dc,
            Kc,
            Rc,
            Xc = {};
        function Yc(a, b, c) {
            try {
                var d = a(b);
            } catch (e) {
                if (e && e.node && Db(b) !== Db(Zb(e.node))) return -54;
                throw e;
            }
            G[c >> 2] = d.dev;
            G[(c + 4) >> 2] = 0;
            G[(c + 8) >> 2] = d.ino;
            G[(c + 12) >> 2] = d.mode;
            G[(c + 16) >> 2] = d.nlink;
            G[(c + 20) >> 2] = d.uid;
            G[(c + 24) >> 2] = d.gid;
            G[(c + 28) >> 2] = d.rdev;
            G[(c + 32) >> 2] = 0;
            H = [
                d.size >>> 0,
                ((I = d.size),
                1 <= +Oa(I)
                    ? 0 < I
                        ? (Pa(+Ra(I / 4294967296), 4294967295) | 0) >>> 0
                        : ~~+Sa((I - +(~~I >>> 0)) / 4294967296) >>> 0
                    : 0),
            ];
            G[(c + 40) >> 2] = H[0];
            G[(c + 44) >> 2] = H[1];
            G[(c + 48) >> 2] = 4096;
            G[(c + 52) >> 2] = d.blocks;
            G[(c + 56) >> 2] = (d.atime.getTime() / 1e3) | 0;
            G[(c + 60) >> 2] = 0;
            G[(c + 64) >> 2] = (d.mtime.getTime() / 1e3) | 0;
            G[(c + 68) >> 2] = 0;
            G[(c + 72) >> 2] = (d.ctime.getTime() / 1e3) | 0;
            G[(c + 76) >> 2] = 0;
            H = [
                d.ino >>> 0,
                ((I = d.ino),
                1 <= +Oa(I)
                    ? 0 < I
                        ? (Pa(+Ra(I / 4294967296), 4294967295) | 0) >>> 0
                        : ~~+Sa((I - +(~~I >>> 0)) / 4294967296) >>> 0
                    : 0),
            ];
            G[(c + 80) >> 2] = H[0];
            G[(c + 84) >> 2] = H[1];
            return 0;
        }
        var X = 0;
        function Y() {
            X += 4;
            return G[(X - 4) >> 2];
        }
        function Z() {
            return L(Y());
        }
        function Zc(a) {
            a || (a = Y());
            a = R[a];
            if (!a) throw new O(8);
            return a;
        }
        function $c(a) {
            try {
                var b = Zc(a);
                ia(b);
                return 0;
            } catch (c) {
                return (
                    ('undefined' !== typeof W && c instanceof O) || E(c), c.gb
                );
            }
        }
        function Ka() {
            return l.length;
        }
        function ad(a) {
            if (0 === a) return 0;
            a = L(a);
            if (!N.hasOwnProperty(a)) return 0;
            ad.tb && ca(ad.tb);
            a = N[a];
            var b = la(a) + 1,
                c = ab(b);
            c && v(a, l, c, b);
            ad.tb = c;
            return ad.tb;
        }
        v('GMT', K, 60224, 4);
        function bd() {
            function a(a) {
                return (a = a.toTimeString().match(/\(([A-Za-z ]+)\)$/))
                    ? a[1]
                    : 'GMT';
            }
            if (!cd) {
                cd = !0;
                G[dd() >> 2] = 60 * new Date().getTimezoneOffset();
                var b = new Date().getFullYear(),
                    c = new Date(b, 0, 1);
                b = new Date(b, 6, 1);
                G[ed() >> 2] = Number(
                    c.getTimezoneOffset() != b.getTimezoneOffset(),
                );
                var d = a(c),
                    e = a(b);
                d = ba(aa(d));
                e = ba(aa(e));
                b.getTimezoneOffset() < c.getTimezoneOffset()
                    ? ((G[fd() >> 2] = d), (G[(fd() + 4) >> 2] = e))
                    : ((G[fd() >> 2] = e), (G[(fd() + 4) >> 2] = d));
            }
        }
        var cd;
        function gd(a) {
            a /= 1e3;
            if ((ya || A) && self.performance && self.performance.now)
                for (
                    var b = self.performance.now();
                    self.performance.now() - b < a;

                );
            else for (b = Date.now(); Date.now() - b < a; );
            return 0;
        }
        f._usleep = gd;
        Tc();
        S = Array(4096);
        Lc(u, '/');
        V('/tmp');
        V('/home');
        V('/home/web_user');
        (function () {
            V('/dev');
            Lb(259, {
                read: function () {
                    return 0;
                },
                write: function (a, b, c, k) {
                    return k;
                },
            });
            Mc('/dev/null', 259);
            Kb(1280, Nb);
            Kb(1536, Ob);
            Mc('/dev/tty', 1280);
            Mc('/dev/tty1', 1536);
            if (
                'object' === typeof crypto &&
                'function' === typeof crypto.getRandomValues
            ) {
                var a = new Uint8Array(1);
                var b = function () {
                    crypto.getRandomValues(a);
                    return a[0];
                };
            } else if (C)
                try {
                    var c = require('crypto');
                    b = function () {
                        return c.randomBytes(1)[0];
                    };
                } catch (d) {}
            b ||
                (b = function () {
                    E('random_device');
                });
            Vc('random', b);
            Vc('urandom', b);
            V('/dev/shm');
            V('/dev/shm/tmp');
        })();
        V('/proc');
        V('/proc/self');
        V('/proc/self/fd');
        Lc(
            {
                lb: function () {
                    var a = Qb('/proc/self', 'fd', 16895, 73);
                    a.cb = {
                        lookup: function (a, c) {
                            var b = R[+c];
                            if (!b) throw new O(8);
                            a = {
                                parent: null,
                                lb: { Vb: 'fake' },
                                cb: {
                                    readlink: function () {
                                        return b.path;
                                    },
                                },
                            };
                            return (a.parent = a);
                        },
                    };
                    return a;
                },
            },
            '/proc/self/fd',
        );
        if (za) {
            var fs = require('fs'),
                Tb = require('path');
            Q.rc();
        }
        var hd = !1;
        function aa(a, b) {
            var c = Array(la(a) + 1);
            a = v(a, c, 0, c.length);
            b && (c.length = a);
            return c;
        }
        function Ga(a) {
            for (var b = [], c = 0; c < a.length; c++) {
                var d = a[c];
                255 < d &&
                    (hd &&
                        assert(
                            !1,
                            'Character code ' +
                                d +
                                ' (' +
                                String.fromCharCode(d) +
                                ')  at offset ' +
                                c +
                                ' not in 0x00-0xFF.',
                        ),
                    (d &= 255));
                b.push(String.fromCharCode(d));
            }
            return b.join('');
        }
        var id =
            'function' === typeof atob
                ? atob
                : function (a) {
                      var b = '',
                          c = 0;
                      a = a.replace(/[^A-Za-z0-9\+\/=]/g, '');
                      do {
                          var d =
                              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.indexOf(
                                  a.charAt(c++),
                              );
                          var e =
                              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.indexOf(
                                  a.charAt(c++),
                              );
                          var g =
                              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.indexOf(
                                  a.charAt(c++),
                              );
                          var k =
                              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.indexOf(
                                  a.charAt(c++),
                              );
                          d = (d << 2) | (e >> 4);
                          e = ((e & 15) << 4) | (g >> 2);
                          var m = ((g & 3) << 6) | k;
                          b += String.fromCharCode(d);
                          64 !== g && (b += String.fromCharCode(e));
                          64 !== k && (b += String.fromCharCode(m));
                      } while (c < a.length);
                      return b;
                  };
        function Fa(a) {
            if (qb(a)) {
                a = a.slice(pb.length);
                if ('boolean' === typeof C && C) {
                    try {
                        var b = Buffer.from(a, 'base64');
                    } catch (g) {
                        b = new Buffer(a, 'base64');
                    }
                    var c = new Uint8Array(
                        b.buffer,
                        b.byteOffset,
                        b.byteLength,
                    );
                } else
                    try {
                        var d = id(a),
                            e = new Uint8Array(d.length);
                        for (b = 0; b < d.length; ++b) e[b] = d.charCodeAt(b);
                        c = e;
                    } catch (g) {
                        throw Error(
                            'Converting base64 string to bytes failed.',
                        );
                    }
                return c;
            }
        }
        var ub = {
                l: function (a, b, c, d) {
                    E(
                        'Assertion failed: ' +
                            L(a) +
                            ', at: ' +
                            [
                                b ? L(b) : 'unknown filename',
                                c,
                                d ? L(d) : 'unknown function',
                            ],
                    );
                },
                ea: yb,
                da: function (a, b) {
                    X = b;
                    try {
                        var c = Z();
                        sa(c);
                        return 0;
                    } catch (d) {
                        return (
                            ('undefined' !== typeof W && d instanceof O) ||
                                E(d),
                            -d.gb
                        );
                    }
                },
                ca: function (a, b) {
                    X = b;
                    try {
                        var c = Zc();
                        return c.fb && c.fb.fsync ? -c.fb.fsync(c) : 0;
                    } catch (d) {
                        return (
                            ('undefined' !== typeof W && d instanceof O) ||
                                E(d),
                            -d.gb
                        );
                    }
                },
                ba: function (a, b) {
                    X = b;
                    try {
                        var c = Zc(),
                            d = Y(),
                            e = Y(),
                            g = Y(),
                            k = Y();
                        a = 4294967296 * d + (e >>> 0);
                        if (-9007199254740992 >= a || 9007199254740992 <= a)
                            return -61;
                        Sc(c, a, k);
                        H = [
                            c.position >>> 0,
                            ((I = c.position),
                            1 <= +Oa(I)
                                ? 0 < I
                                    ? (Pa(+Ra(I / 4294967296), 4294967295) |
                                          0) >>>
                                      0
                                    : ~~+Sa((I - +(~~I >>> 0)) / 4294967296) >>>
                                      0
                                : 0),
                        ];
                        G[g >> 2] = H[0];
                        G[(g + 4) >> 2] = H[1];
                        c.Jb && 0 === a && 0 === k && (c.Jb = null);
                        return 0;
                    } catch (m) {
                        return (
                            ('undefined' !== typeof W && m instanceof O) ||
                                E(m),
                            -m.gb
                        );
                    }
                },
                aa: function (a, b) {
                    X = b;
                    try {
                        var c = Z(),
                            d = Y();
                        fa(c, d);
                        return 0;
                    } catch (e) {
                        return (
                            ('undefined' !== typeof W && e instanceof O) ||
                                E(e),
                            -e.gb
                        );
                    }
                },
                $: function (a, b) {
                    X = b;
                    try {
                        var c = Y(),
                            d = Y();
                        if (0 === d) return -28;
                        if (d < la('/') + 1) return -68;
                        v('/', K, c, d);
                        return c;
                    } catch (e) {
                        return (
                            ('undefined' !== typeof W && e instanceof O) ||
                                E(e),
                            -e.gb
                        );
                    }
                },
                _: function (a, b) {
                    X = b;
                    try {
                        var c = Y(),
                            d = Y(),
                            e = Y(),
                            g = Y(),
                            k = Y();
                        a: {
                            var m = Y();
                            m <<= 12;
                            a = !1;
                            if (0 !== (g & 16) && 0 !== c % 16384) var B = -28;
                            else {
                                if (0 !== (g & 32)) {
                                    var y = jd(16384, d);
                                    if (!y) {
                                        B = -48;
                                        break a;
                                    }
                                    kd(y, 0, d);
                                    a = !0;
                                } else {
                                    var x = R[k];
                                    if (!x) {
                                        B = -8;
                                        break a;
                                    }
                                    b = K;
                                    if (
                                        0 !== (e & 2) &&
                                        0 === (g & 2) &&
                                        2 !== (x.flags & 2097155)
                                    )
                                        throw new O(2);
                                    if (1 === (x.flags & 2097155))
                                        throw new O(2);
                                    if (!x.fb.Cb) throw new O(43);
                                    var xa = x.fb.Cb(x, b, c, d, m, e, g);
                                    y = xa.oc;
                                    a = xa.Fb;
                                }
                                Xc[y] = {
                                    mc: y,
                                    lc: d,
                                    Fb: a,
                                    fd: k,
                                    flags: g,
                                };
                                B = y;
                            }
                        }
                        return B;
                    } catch (T) {
                        return (
                            ('undefined' !== typeof W && T instanceof O) ||
                                E(T),
                            -T.gb
                        );
                    }
                },
                Z: function (a, b) {
                    X = b;
                    try {
                        var c = Y();
                        Y();
                        var d = Y();
                        Y();
                        var e = R[c];
                        if (!e) throw new O(8);
                        if (0 === (e.flags & 2097155)) throw new O(28);
                        Qc(e.node, d);
                        return 0;
                    } catch (g) {
                        return (
                            ('undefined' !== typeof W && g instanceof O) ||
                                E(g),
                            -g.gb
                        );
                    }
                },
                s: function (a, b) {
                    X = b;
                    try {
                        var c = Z(),
                            d = Y();
                        return Yc(pa, c, d);
                    } catch (e) {
                        return (
                            ('undefined' !== typeof W && e instanceof O) ||
                                E(e),
                            -e.gb
                        );
                    }
                },
                Y: function (a, b) {
                    X = b;
                    try {
                        var c = Z(),
                            d = Y();
                        return Yc(Oc, c, d);
                    } catch (e) {
                        return (
                            ('undefined' !== typeof W && e instanceof O) ||
                                E(e),
                            -e.gb
                        );
                    }
                },
                X: function (a, b) {
                    X = b;
                    try {
                        var c = Zc(),
                            d = Y();
                        return Yc(pa, c.path, d);
                    } catch (e) {
                        return (
                            ('undefined' !== typeof W && e instanceof O) ||
                                E(e),
                            -e.gb
                        );
                    }
                },
                W: function (a, b) {
                    X = b;
                    return 42;
                },
                V: function (a, b) {
                    X = b;
                    return 0;
                },
                U: function (a, b) {
                    X = b;
                    try {
                        var c = Y();
                        Y();
                        Y();
                        var d = R[c];
                        if (!d) throw new O(8);
                        Pc(d.node);
                        return 0;
                    } catch (e) {
                        return (
                            ('undefined' !== typeof W && e instanceof O) ||
                                E(e),
                            -e.gb
                        );
                    }
                },
                T: function (a, b) {
                    X = b;
                    try {
                        var c = Z();
                        Y();
                        Y();
                        Pc(c);
                        return 0;
                    } catch (d) {
                        return (
                            ('undefined' !== typeof W && d instanceof O) ||
                                E(d),
                            -d.gb
                        );
                    }
                },
                n: function (a, b) {
                    X = b;
                    try {
                        var c = Zc();
                        switch (Y()) {
                            case 0:
                                var d = Y();
                                return 0 > d
                                    ? -28
                                    : p(c.path, c.flags, 0, d).fd;
                            case 1:
                            case 2:
                                return 0;
                            case 3:
                                return c.flags;
                            case 4:
                                return (d = Y()), (c.flags |= d), 0;
                            case 12:
                                return (d = Y()), (Na[(d + 0) >> 1] = 2), 0;
                            case 13:
                            case 14:
                                return 0;
                            case 16:
                            case 8:
                                return -28;
                            case 9:
                                return Hb(28), -1;
                            default:
                                return -28;
                        }
                    } catch (e) {
                        return (
                            ('undefined' !== typeof W && e instanceof O) ||
                                E(e),
                            -e.gb
                        );
                    }
                },
                S: function (a, b) {
                    X = b;
                    try {
                        var c = Zc(),
                            d = Y(),
                            e = Y();
                        return qa(c, l, d, e);
                    } catch (g) {
                        return (
                            ('undefined' !== typeof W && g instanceof O) ||
                                E(g),
                            -g.gb
                        );
                    }
                },
                R: function (a, b) {
                    X = b;
                    try {
                        var c = Z();
                        var d = Y();
                        if (d & -8) var e = -28;
                        else {
                            var g;
                            (g = r(c, { ub: !0 }).node)
                                ? ((a = ''),
                                  d & 4 && (a += 'r'),
                                  d & 2 && (a += 'w'),
                                  d & 1 && (a += 'x'),
                                  (e = a && cc(g, a) ? -2 : 0))
                                : (e = -44);
                        }
                        return e;
                    } catch (k) {
                        return (
                            ('undefined' !== typeof W && k instanceof O) ||
                                E(k),
                            -k.gb
                        );
                    }
                },
                Q: function (a, b) {
                    X = b;
                    try {
                        var c = Z(),
                            d = Y();
                        a = c;
                        a = Db(a);
                        '/' === a[a.length - 1] &&
                            (a = a.substr(0, a.length - 1));
                        V(a, d);
                        return 0;
                    } catch (e) {
                        return (
                            ('undefined' !== typeof W && e instanceof O) ||
                                E(e),
                            -e.gb
                        );
                    }
                },
                P: function (a, b) {
                    X = b;
                    try {
                        var c = Zc(),
                            d = Y(),
                            e = Y();
                        return ha(c, l, d, e);
                    } catch (g) {
                        return (
                            ('undefined' !== typeof W && g instanceof O) ||
                                E(g),
                            -g.gb
                        );
                    }
                },
                O: function (a, b) {
                    X = b;
                    try {
                        var c = Z(),
                            d = r(c, { parent: !0 }).node,
                            e = Fb(c),
                            g = t(d, e),
                            k = ic(d, e, !0);
                        if (k) throw new O(k);
                        if (!d.cb.rmdir) throw new O(63);
                        if (g.vb) throw new O(10);
                        try {
                            U.willDeletePath && U.willDeletePath(c);
                        } catch (m) {
                            console.log(
                                "FS.trackingDelegate['willDeletePath']('" +
                                    c +
                                    "') threw an exception: " +
                                    m.message,
                            );
                        }
                        d.cb.rmdir(d, e);
                        bc(g);
                        try {
                            if (U.onDeletePath) U.onDeletePath(c);
                        } catch (m) {
                            console.log(
                                "FS.trackingDelegate['onDeletePath']('" +
                                    c +
                                    "') threw an exception: " +
                                    m.message,
                            );
                        }
                        return 0;
                    } catch (m) {
                        return (
                            ('undefined' !== typeof W && m instanceof O) ||
                                E(m),
                            -m.gb
                        );
                    }
                },
                N: function (a, b) {
                    X = b;
                    try {
                        var c = Z(),
                            d = Y(),
                            e = Y();
                        return p(c, d, e).fd;
                    } catch (g) {
                        return (
                            ('undefined' !== typeof W && g instanceof O) ||
                                E(g),
                            -g.gb
                        );
                    }
                },
                M: function (a, b) {
                    X = b;
                    try {
                        var c = Z(),
                            d = Y();
                        var e = Y();
                        if (0 >= e) var g = -28;
                        else {
                            var k = Yb(c),
                                m = Math.min(e, la(k)),
                                B = l[d + m];
                            v(k, K, d, e + 1);
                            l[d + m] = B;
                            g = m;
                        }
                        return g;
                    } catch (y) {
                        return (
                            ('undefined' !== typeof W && y instanceof O) ||
                                E(y),
                            -y.gb
                        );
                    }
                },
                L: function (a, b) {
                    X = b;
                    try {
                        var c = Y(),
                            d = Y();
                        if (-1 === c || 0 === d) var e = -28;
                        else {
                            var g = Xc[c];
                            if (g && d === g.lc) {
                                var k = R[g.fd],
                                    m = g.flags,
                                    B = new Uint8Array(K.subarray(c, c + d));
                                k && k.fb.Db && k.fb.Db(k, B, 0, d, m);
                                Xc[c] = null;
                                g.Fb && ca(g.mc);
                            }
                            e = 0;
                        }
                        return e;
                    } catch (y) {
                        return (
                            ('undefined' !== typeof W && y instanceof O) ||
                                E(y),
                            -y.gb
                        );
                    }
                },
                K: function (a, b) {
                    X = b;
                    try {
                        var c = Y(),
                            d = Y(),
                            e = R[c];
                        if (!e) throw new O(8);
                        fa(e.node, d);
                        return 0;
                    } catch (g) {
                        return (
                            ('undefined' !== typeof W && g instanceof O) ||
                                E(g),
                            -g.gb
                        );
                    }
                },
                r: function () {
                    return $c.apply(null, arguments);
                },
                __memory_base: 1024,
                __table_base: 0,
                J: Ka,
                I: function (a, b, c) {
                    K.set(K.subarray(b, b + c), a);
                },
                H: function (a) {
                    if (2147418112 < a) return !1;
                    for (var b = Math.max(Ka(), 16777216); b < a; )
                        536870912 >= b
                            ? (b = cb(2 * b))
                            : (b = Math.min(
                                  cb((3 * b + 2147483648) / 4),
                                  2147418112,
                              ));
                    a: {
                        try {
                            J.grow((b - buffer.byteLength + 65535) >> 16);
                            db(J.buffer);
                            var c = 1;
                            break a;
                        } catch (d) {}
                        c = void 0;
                    }
                    return c ? !0 : !1;
                },
                q: ad,
                p: function (a) {
                    var b = Date.now();
                    G[a >> 2] = (b / 1e3) | 0;
                    G[(a + 4) >> 2] = ((b % 1e3) * 1e3) | 0;
                    return 0;
                },
                G: function (a) {
                    return Math.log(a) / Math.LN10;
                },
                o: function () {
                    E('trap!');
                },
                F: function (a) {
                    bd();
                    a = new Date(1e3 * G[a >> 2]);
                    G[15044] = a.getSeconds();
                    G[15045] = a.getMinutes();
                    G[15046] = a.getHours();
                    G[15047] = a.getDate();
                    G[15048] = a.getMonth();
                    G[15049] = a.getFullYear() - 1900;
                    G[15050] = a.getDay();
                    var b = new Date(a.getFullYear(), 0, 1);
                    G[15051] = ((a.getTime() - b.getTime()) / 864e5) | 0;
                    G[15053] = -(60 * a.getTimezoneOffset());
                    var c = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
                    b = b.getTimezoneOffset();
                    a = (c != b && a.getTimezoneOffset() == Math.min(b, c)) | 0;
                    G[15052] = a;
                    a = G[(fd() + (a ? 4 : 0)) >> 2];
                    G[15054] = a;
                    return 60176;
                },
                E: function (a, b) {
                    if (0 === a) return Hb(28), -1;
                    var c = G[a >> 2];
                    a = G[(a + 4) >> 2];
                    if (0 > a || 999999999 < a || 0 > c) return Hb(28), -1;
                    0 !== b && ((G[b >> 2] = 0), (G[(b + 4) >> 2] = 0));
                    return gd(1e6 * c + a / 1e3);
                },
                D: function (a) {
                    switch (a) {
                        case 30:
                            return 16384;
                        case 85:
                            return 131068;
                        case 132:
                        case 133:
                        case 12:
                        case 137:
                        case 138:
                        case 15:
                        case 235:
                        case 16:
                        case 17:
                        case 18:
                        case 19:
                        case 20:
                        case 149:
                        case 13:
                        case 10:
                        case 236:
                        case 153:
                        case 9:
                        case 21:
                        case 22:
                        case 159:
                        case 154:
                        case 14:
                        case 77:
                        case 78:
                        case 139:
                        case 80:
                        case 81:
                        case 82:
                        case 68:
                        case 67:
                        case 164:
                        case 11:
                        case 29:
                        case 47:
                        case 48:
                        case 95:
                        case 52:
                        case 51:
                        case 46:
                            return 200809;
                        case 79:
                            return 0;
                        case 27:
                        case 246:
                        case 127:
                        case 128:
                        case 23:
                        case 24:
                        case 160:
                        case 161:
                        case 181:
                        case 182:
                        case 242:
                        case 183:
                        case 184:
                        case 243:
                        case 244:
                        case 245:
                        case 165:
                        case 178:
                        case 179:
                        case 49:
                        case 50:
                        case 168:
                        case 169:
                        case 175:
                        case 170:
                        case 171:
                        case 172:
                        case 97:
                        case 76:
                        case 32:
                        case 173:
                        case 35:
                            return -1;
                        case 176:
                        case 177:
                        case 7:
                        case 155:
                        case 8:
                        case 157:
                        case 125:
                        case 126:
                        case 92:
                        case 93:
                        case 129:
                        case 130:
                        case 131:
                        case 94:
                        case 91:
                            return 1;
                        case 74:
                        case 60:
                        case 69:
                        case 70:
                        case 4:
                            return 1024;
                        case 31:
                        case 42:
                        case 72:
                            return 32;
                        case 87:
                        case 26:
                        case 33:
                            return 2147483647;
                        case 34:
                        case 1:
                            return 47839;
                        case 38:
                        case 36:
                            return 99;
                        case 43:
                        case 37:
                            return 2048;
                        case 0:
                            return 2097152;
                        case 3:
                            return 65536;
                        case 28:
                            return 32768;
                        case 44:
                            return 32767;
                        case 75:
                            return 16384;
                        case 39:
                            return 1e3;
                        case 89:
                            return 700;
                        case 71:
                            return 256;
                        case 40:
                            return 255;
                        case 2:
                            return 100;
                        case 180:
                            return 64;
                        case 25:
                            return 20;
                        case 5:
                            return 16;
                        case 6:
                            return 6;
                        case 73:
                            return 4;
                        case 84:
                            return 'object' === typeof navigator
                                ? navigator.hardwareConcurrency || 1
                                : 1;
                    }
                    Hb(28);
                    return -1;
                },
                C: function (a) {
                    var b = (Date.now() / 1e3) | 0;
                    a && (G[a >> 2] = b);
                    return b;
                },
                B: function (a, b) {
                    if (b) {
                        var c = 1e3 * G[(b + 8) >> 2];
                        c += G[(b + 12) >> 2] / 1e3;
                    } else c = Date.now();
                    a = L(a);
                    try {
                        b = c;
                        var d = r(a, { ub: !0 }).node;
                        d.cb.jb(d, { timestamp: Math.max(b, c) });
                        return 0;
                    } catch (e) {
                        a = e;
                        if (!(a instanceof O)) {
                            a += ' : ';
                            a: {
                                d = Error();
                                if (!d.stack) {
                                    try {
                                        throw Error(0);
                                    } catch (g) {
                                        d = g;
                                    }
                                    if (!d.stack) {
                                        d = '(no stack trace available)';
                                        break a;
                                    }
                                }
                                d = d.stack.toString();
                            }
                            f.extraStackTrace &&
                                (d += '\n' + f.extraStackTrace());
                            d = xb(d);
                            throw a + d;
                        }
                        Hb(a.gb);
                        return -1;
                    }
                },
                m: E,
                k: function (a) {
                    return w[a]();
                },
                h: function (a, b) {
                    return w[a](b);
                },
                g: function (a, b, c) {
                    return w[a](b, c);
                },
                f: function (a, b, c, d) {
                    return w[a](b, c, d);
                },
                e: function (a, b, c, d, e) {
                    return w[a](b, c, d, e);
                },
                d: function (a, b, c, d, e, g) {
                    return w[a](b, c, d, e, g);
                },
                c: function (a, b, c, d, e, g, k) {
                    return w[a](b, c, d, e, g, k);
                },
                A: function (a, b, c, d, e, g, k) {
                    return w[a](b, c, d, e, g, k);
                },
                z: function (a, b, c, d, e) {
                    return w[a](b, c, d, e);
                },
                y: function (a, b, c) {
                    return w[a](b, c);
                },
                x: function (a, b, c, d) {
                    return w[a](b, c, d);
                },
                w: function (a, b, c, d, e) {
                    return w[a](b, c, d, e);
                },
                b: function (a, b) {
                    w[a](b);
                },
                a: function (a, b, c) {
                    w[a](b, c);
                },
                j: function (a, b, c, d) {
                    w[a](b, c, d);
                },
                i: function (a, b, c, d, e) {
                    w[a](b, c, d, e);
                },
                v: function (a, b, c, d, e, g) {
                    w[a](b, c, d, e, g);
                },
                u: function (a, b, c, d) {
                    w[a](b, c, d);
                },
                t: function (a, b, c, d) {
                    w[a](b, c, d);
                },
                memory: J,
                table: Va,
            },
            ld = f.asm({}, ub, buffer);
        f.asm = ld;
        f._RegisterExtensionFunctions = function () {
            return f.asm.fa.apply(null, arguments);
        };
        var wb = (f.___emscripten_environ_constructor = function () {
            return f.asm.ga.apply(null, arguments);
        });
        f.___errno_location = function () {
            return f.asm.ha.apply(null, arguments);
        };
        var ed = (f.__get_daylight = function () {
                return f.asm.ia.apply(null, arguments);
            }),
            dd = (f.__get_timezone = function () {
                return f.asm.ja.apply(null, arguments);
            }),
            fd = (f.__get_tzname = function () {
                return f.asm.ka.apply(null, arguments);
            }),
            ca = (f._free = function () {
                return f.asm.la.apply(null, arguments);
            }),
            ab = (f._malloc = function () {
                return f.asm.ma.apply(null, arguments);
            }),
            jd = (f._memalign = function () {
                return f.asm.na.apply(null, arguments);
            }),
            kd = (f._memset = function () {
                return f.asm.oa.apply(null, arguments);
            });
        f._sqlite3_bind_blob = function () {
            return f.asm.pa.apply(null, arguments);
        };
        f._sqlite3_bind_double = function () {
            return f.asm.qa.apply(null, arguments);
        };
        f._sqlite3_bind_int = function () {
            return f.asm.ra.apply(null, arguments);
        };
        f._sqlite3_bind_parameter_index = function () {
            return f.asm.sa.apply(null, arguments);
        };
        f._sqlite3_bind_text = function () {
            return f.asm.ta.apply(null, arguments);
        };
        f._sqlite3_changes = function () {
            return f.asm.ua.apply(null, arguments);
        };
        f._sqlite3_clear_bindings = function () {
            return f.asm.va.apply(null, arguments);
        };
        f._sqlite3_close_v2 = function () {
            return f.asm.wa.apply(null, arguments);
        };
        f._sqlite3_column_blob = function () {
            return f.asm.xa.apply(null, arguments);
        };
        f._sqlite3_column_bytes = function () {
            return f.asm.ya.apply(null, arguments);
        };
        f._sqlite3_column_double = function () {
            return f.asm.za.apply(null, arguments);
        };
        f._sqlite3_column_name = function () {
            return f.asm.Aa.apply(null, arguments);
        };
        f._sqlite3_column_text = function () {
            return f.asm.Ba.apply(null, arguments);
        };
        f._sqlite3_column_type = function () {
            return f.asm.Ca.apply(null, arguments);
        };
        f._sqlite3_create_function_v2 = function () {
            return f.asm.Da.apply(null, arguments);
        };
        f._sqlite3_data_count = function () {
            return f.asm.Ea.apply(null, arguments);
        };
        f._sqlite3_errmsg = function () {
            return f.asm.Fa.apply(null, arguments);
        };
        f._sqlite3_exec = function () {
            return f.asm.Ga.apply(null, arguments);
        };
        f._sqlite3_finalize = function () {
            return f.asm.Ha.apply(null, arguments);
        };
        f._sqlite3_free = function () {
            return f.asm.Ia.apply(null, arguments);
        };
        f._sqlite3_open = function () {
            return f.asm.Ja.apply(null, arguments);
        };
        f._sqlite3_prepare_v2 = function () {
            return f.asm.Ka.apply(null, arguments);
        };
        f._sqlite3_reset = function () {
            return f.asm.La.apply(null, arguments);
        };
        f._sqlite3_result_blob = function () {
            return f.asm.Ma.apply(null, arguments);
        };
        f._sqlite3_result_double = function () {
            return f.asm.Na.apply(null, arguments);
        };
        f._sqlite3_result_error = function () {
            return f.asm.Oa.apply(null, arguments);
        };
        f._sqlite3_result_int = function () {
            return f.asm.Pa.apply(null, arguments);
        };
        f._sqlite3_result_int64 = function () {
            return f.asm.Qa.apply(null, arguments);
        };
        f._sqlite3_result_null = function () {
            return f.asm.Ra.apply(null, arguments);
        };
        f._sqlite3_result_text = function () {
            return f.asm.Sa.apply(null, arguments);
        };
        f._sqlite3_step = function () {
            return f.asm.Ta.apply(null, arguments);
        };
        f._sqlite3_value_blob = function () {
            return f.asm.Ua.apply(null, arguments);
        };
        f._sqlite3_value_bytes = function () {
            return f.asm.Va.apply(null, arguments);
        };
        f._sqlite3_value_double = function () {
            return f.asm.Wa.apply(null, arguments);
        };
        f._sqlite3_value_int = function () {
            return f.asm.Xa.apply(null, arguments);
        };
        f._sqlite3_value_text = function () {
            return f.asm.Ya.apply(null, arguments);
        };
        f._sqlite3_value_type = function () {
            return f.asm.Za.apply(null, arguments);
        };
        var h = (f.stackAlloc = function () {
                return f.asm.$a.apply(null, arguments);
            }),
            na = (f.stackRestore = function () {
                return f.asm.ab.apply(null, arguments);
            }),
            ka = (f.stackSave = function () {
                return f.asm.bb.apply(null, arguments);
            });
        f.dynCall_vi = function () {
            return f.asm._a.apply(null, arguments);
        };
        f.asm = ld;
        f.cwrap = function (a, b, c, d) {
            c = c || [];
            var e = c.every(function (a) {
                return 'number' === a;
            });
            return 'string' !== b && e && !d
                ? Xa(a)
                : function () {
                      return Ya(a, b, c, arguments);
                  };
        };
        f.stackSave = ka;
        f.stackRestore = na;
        f.stackAlloc = h;
        var md;
        ob = function nd() {
            md || od();
            md || (ob = nd);
        };
        function od() {
            function a() {
                if (!md && ((md = !0), !Wa)) {
                    kb = !0;
                    f.noFSInit ||
                        Uc ||
                        ((Uc = !0),
                        Tc(),
                        (f.stdin = f.stdin),
                        (f.stdout = f.stdout),
                        (f.stderr = f.stderr),
                        f.stdin
                            ? Vc('stdin', f.stdin)
                            : Nc('/dev/tty', '/dev/stdin'),
                        f.stdout
                            ? Vc('stdout', null, f.stdout)
                            : Nc('/dev/tty', '/dev/stdout'),
                        f.stderr
                            ? Vc('stderr', null, f.stderr)
                            : Nc('/dev/tty1', '/dev/stderr'),
                        p('/dev/stdin', 'r'),
                        p('/dev/stdout', 'w'),
                        p('/dev/stderr', 'w'));
                    fb(hb);
                    Xb = !1;
                    fb(ib);
                    if (f.onRuntimeInitialized) f.onRuntimeInitialized();
                    if (f.postRun)
                        for (
                            'function' == typeof f.postRun &&
                            (f.postRun = [f.postRun]);
                            f.postRun.length;

                        ) {
                            var a = f.postRun.shift();
                            jb.unshift(a);
                        }
                    fb(jb);
                }
            }
            if (!(0 < mb)) {
                if (f.preRun)
                    for (
                        'function' == typeof f.preRun &&
                        (f.preRun = [f.preRun]);
                        f.preRun.length;

                    )
                        lb();
                fb(gb);
                0 < mb ||
                    (f.setStatus
                        ? (f.setStatus('Running...'),
                          setTimeout(function () {
                              setTimeout(function () {
                                  f.setStatus('');
                              }, 1);
                              a();
                          }, 1))
                        : a());
            }
        }
        f.run = od;
        if (f.preInit)
            for (
                'function' == typeof f.preInit && (f.preInit = [f.preInit]);
                0 < f.preInit.length;

            )
                f.preInit.pop()();
        od();

        // The shell-pre.js and emcc-generated code goes above
        return Module;
    }); // The end of the promise being returned

    return initSqlJsPromise;
}; // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = initSqlJs;
    // This will allow the module to be used in ES6 or CommonJS
    module.exports.default = initSqlJs;
} else if (typeof define === 'function' && define['amd']) {
    define([], function () {
        return initSqlJs;
    });
} else if (typeof exports === 'object') {
    exports['Module'] = initSqlJs;
}