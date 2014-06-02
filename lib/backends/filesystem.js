var fs = require('fs');
var Tail = require('tail').Tail;

module.exports = function(options) {
  var basepath = options.basepath || ".";
  if (basepath == "/") basepath = "";

  return {
    get: function(path, options, fn) {
      path = basepath + path;
      fs.stat(path, function(err, data) {
        if (err) return fn(err);

        if (data.isDirectory()) {
          fs.readdir(path, fn);
        } else {
          if(options.stats !== undefined) {
            fn(null, data);
          } else {
            fs.readFile(path, fn);
          }
        }

      });
    },

    follow: function(path, options, res) {
      path = basepath + path;
      var tail = new Tail(path);

      tail.on("line", function(data) {
        res.write(data + "\n");
      });

      return tail.unwatch;
    },

    create: function(path, stream, options, fn) {
      var flags = options.flags || 'w';
      var mode = options.mode;
      path = basepath + path;

      if(options.directory === true) {
        return fs.mkdir(path, mode, fn);
      }

      target = fs.createWriteStream(path, {flags:flags, mode:mode});
      stream.pipe(target)
        .on('error', fn)
        .on('close', fn);
    },

    update: function(path, stream, options, fn) {
      this.create(path, stream, {flags: 'a'}, fn);
    },

    touch: function(path, options, fn) {
      var now = new Date();
      fs.utimes(basepath + path, now, now, fn);
    },

    remove: function(path, options, fn) {
      path = basepath + path;
      fs.unlink(path, fn);
    }
  };
};
