var protoclass = require("protoclass");


function Mixer () {
  this._priorities   = {};
  this._mixins       = [];
}

module.exports = protoclass(Mixer, {

  /**
   */

  priority: function (name, value) {
    this._priorities[name] = value;
    return this;
  },

  /**
   */

  use: function () {
    var p = this._priorities;
    this._mixins = this._mixins.concat(Array.prototype.slice.call(arguments, 0)).sort(function (a, b) {
      return p[a.priority] > p[b.priority] ? -1 : 1;
    });
  },

  /**
   */

  mixin: function (target, proto) {

    if (!proto) {
      proto = target.constructor.prototype;
      if (proto === Object.prototype) {
        proto = target;
      }
    }

    var c = proto, d, dec, ops, used = {};

    while(c) {

      for (var i = this._mixins.length; i--;) {
        m = this._mixins[i];

        if (used[i] && m.multi !== true) continue;

        if ((ops = m.getOptions(c)) != null) {
           m.mixin(target, ops);
          used[i] = true;
        } else if (m.inherit === false) {
          used[i] = true;
        }
      }

      c = c.constructor.__super__;
    }
  }
});
