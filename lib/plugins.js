var protoclass = require("protoclass");


function Plugins () {
  this._priorities   = {};
  this._plugins      = [];
}

module.exports = protoclass(Plugins, {

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
    this._plugins = this._plugins.concat(Array.prototype.slice.call(arguments, 0)).map(function(plugin) {
      if (!plugin.getOptions) {
        plugin.getOptions = function () { return true; };
      }
      return plugin
    }).sort(function (a, b) {
      return p[a.priority] > p[b.priority] ? -1 : 1;
    });
  },

  /**
   */

  plugin: function (target, proto) {

    if (!proto) {
      proto = target.constructor.prototype;
      if (proto === Object.prototype) {
        proto = target;
      }
    }

    var c = proto, d, dec, ops, used = {};

    while(c) {

      for (var i = this._plugins.length; i--;) {
        m = this._plugins[i];

        if (used[i] && m.multi !== true) continue;

        if ((ops = m.getOptions(c)) != null) {
           m.plugin(target, ops);
          used[i] = true;
        } else if (m.inherit === false) {
          used[i] = true;
        }
      }

      c = c.constructor.__super__;
    }
  }
});
