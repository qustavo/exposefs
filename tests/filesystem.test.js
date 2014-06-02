var mocha = require('mocha'),
    assert = require('assert');

var request = require('supertest'),
    __fs = require('fs');
    Fs = require('fake-fs');

var express = require('express'),
    app = express(),
    exposefs = require('../index');
app.use('/', exposefs( {backend: 'filesystem', basepath: '/'} ));


var fs = null;
describe('Filesystem', function() {
  beforeEach(function() {
    fs = new Fs();
    fs.patch();
  });

  afterEach(function() {
    fs.unpatch();
  });

  describe('GET', function() {
    context('/directory', function() {
      it("returns the content of directory", function(done) {
        var content = ['foo', 'bar'];
        content.forEach(function(f) {
          fs.dir("/" + f);
        });

        request(app).get('/').expect(200, JSON.stringify(content), done);
      });
    });

    context("/file", function() {
      beforeEach(function() {
        this.content = 'content of file';
        fs.file('/file', this.content);
      });

      it("returns the content of file", function(done) {
        request(app).get('/file').expect(200, this.content, done);
      });

      context("?stats", function() {
        it("returns the stat of a file", function(done) {
          request(app).get('/file?stats')
            .expect(200, function() {
              JSON.stringify(fs.statSync('/file'));
              done();
            });
        });
      });
    });
  });

  describe("POST", function() {
    context('/directory/', function() {
      it("creates a directory", function(done) {
        request(app).post('/directory/')
          .expect(201)
          .end(function() {
            assert(fs.statSync('/directory').isDirectory());
            done();
          });
      });
    });

    context("/file", function(done) {
      // as we use createWriteStream and it's not provided by
      // fake-fs, we need to create a real file
      beforeEach(function() {
        fs.unpatch();
      });

      it("creates a file", function(done) {
        var file = '/tmp/.exposefs_tmp_file';
        var data = 'deleteme';

        request(app).post(file).send(data)
          .expect(201, function() {
            assert.equal(__fs.readFileSync(file), data);
            __fs.unlink(file);
            done();
          });
      });
    });
  });

});
