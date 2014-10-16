var frills = require(".."),
expect     = require("expect.js"),
protoclass = require("protoclass");

describe("frills#", function () {

  it("can create a new frills mixin", function () {
    frills();
  });

  it("can register a mixin", function () {
    var d = frills();
    d.use({
      getOptions: function (data) {
      },
      mixin: function (target, options) {
      }
    })
  });

  it("can prioritize mixins", function () {
    var d = frills();
    d.priority("a", 1).priority("b", 2);

    var a, b, c;

    d.use(b = { prority: "b" });
    d.use(a = { prority: "a" });
    d.use(c = { prority: "c" });

    expect(d._mixins[0]).to.be(c);
    expect(d._mixins[1]).to.be(b);
    expect(d._mixins[2]).to.be(a);
  })

  it("can mixin an object", function () {
    var d = frills();
    d.use({
      getOptions: function (target) {
        return target.events;
      },
      mixin: function (target, options) {
        target.found = options;
      }
    });

    var a = { events: 1 };
    expect(Object.__mixins).to.be(undefined);
    d.mixin(a);
    expect(Object.__mixins).to.be(undefined);
    expect(a.found).to.be(1);
  });

  it("mixins from a class prototype", function () {
    var clazz = function () {
    };

    clazz.prototype.events = 1

    var d = frills();
    d.use({
      getOptions: function (target) {
        return target.events;
      },
      mixin: function (target, options) {
        target.found = options;
      }
    });

    var a = new clazz();

    d.mixin(a);

    expect(a.found).to.be(1);
  });

  xit("doesn't mixin if a property is not a prototype of the class", function () {
    var clazz = function () {
      this.events = 1;
    };

    var d = frills();
    d.use({
      getOptions: function (target) {
        return target.events;
      },
      mixin: function (target, options) {
        target.found = options;
      }
    });

    var a = new clazz(1);

    d.mixin(a);

    expect(a.found).to.be(undefined);
  });

  it("doesn't attach a mixin multiple times if multi is false", function () {
    var p = function() {

    };

    protoclass(p);

    var c = p.extend({});

    var d = frills();
    var i = 0;
    d.use({
      getOptions: function (target) {
        return true;
      },
      mixin: function (target, options) {
        i++;
      }
    });

    var c1 = new c();

    d.mixin(c1);

    expect(i).to.be(1);

  });

  it("can stop inheritance", function () {
    var p = function() {

    };

    protoclass(p);

    var c = p.extend({
      subChild: true
    });

    var d = frills();
    var i = 0;
    d.use({
      inherit: false,
      getOptions: function (target) {
        if (target.subChild) return void 0;
        return true;
      },
      mixin: function (target, options) {
        i++;
      }
    });

    var c1 = new c();

    d.mixin(c1);

    expect(i).to.be(0);

  });

  it("attaches a mixin multiple times if multi is true", function () {
    var p = function() {

    };

    protoclass(p, {
      part: true
    });

    var c = p.extend({});

    var d = frills();
    var i = 0;
    d.use({
      multi: true,
      getOptions: function (target) {
        return target.part;
      },
      mixin: function (target, options) {
        i++;
      }
    });

    var c1 = new c();

    d.mixin(c1);

    expect(i).to.be(2);

  });


});
