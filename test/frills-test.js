var frills = require(".."),
expect     = require("expect.js"),
protoclass = require("protoclass");

describe("frills#", function () {

  it("can create a new frills plugin", function () {
    frills();
  });

  it("can register a plugin", function () {
    var d = frills();
    d.use({
      getOptions: function (data) {
      },
      plugin: function (target, options) {
      }
    })
  });

  it("can prioritize plugins", function () {
    var d = frills();
    d.priority("a", 1).priority("b", 2);

    var a, b, c;

    d.use(b = { prority: "b" });
    d.use(a = { prority: "a" });
    d.use(c = { prority: "c" });

    expect(d._plugins[0]).to.be(c);
    expect(d._plugins[1]).to.be(b);
    expect(d._plugins[2]).to.be(a);
  })

  it("can plugin an object", function () {
    var d = frills();
    d.use({
      getOptions: function (target) {
        return target.events;
      },
      plugin: function (target, options) {
        target.found = options;
      }
    });

    var a = { events: 1 };
    expect(Object.__plugins).to.be(undefined);
    d.plugin(a);
    expect(Object.__plugins).to.be(undefined);
    expect(a.found).to.be(1);
  });

  it("plugins from a class prototype", function () {
    var clazz = function () {
    };

    clazz.prototype.events = 1

    var d = frills();
    d.use({
      getOptions: function (target) {
        return target.events;
      },
      plugin: function (target, options) {
        target.found = options;
      }
    });

    var a = new clazz();

    d.plugin(a);

    expect(a.found).to.be(1);
  });

  xit("doesn't plugin if a property is not a prototype of the class", function () {
    var clazz = function () {
      this.events = 1;
    };

    var d = frills();
    d.use({
      getOptions: function (target) {
        return target.events;
      },
      plugin: function (target, options) {
        target.found = options;
      }
    });

    var a = new clazz(1);

    d.plugin(a);

    expect(a.found).to.be(undefined);
  });

  it("doesn't attach a plugin multiple times if multi is false", function () {
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
      plugin: function (target, options) {
        i++;
      }
    });

    var c1 = new c();

    d.plugin(c1);

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
      plugin: function (target, options) {
        i++;
      }
    });

    var c1 = new c();

    d.plugin(c1);

    expect(i).to.be(0);

  });

  it("attaches a plugin multiple times if multi is true", function () {
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
      plugin: function (target, options) {
        i++;
      }
    });

    var c1 = new c();

    d.plugin(c1);

    expect(i).to.be(2);

  });


});
