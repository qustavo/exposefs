var filesystem = require('../lib/backends/filesystem')({
  basepath: '/',
});
var assert = require('assert');

describe('filesystem backend', function() {
  describe('get method', function() {
    it('should return file and contents', function() {
      var file = filesystem.get('test/data/testFile.txt', {}, function(err, contents) {
        assert.equal('Hola Mundo!\n', contents.toString());
      });
    });
    it('should throw error if file not found', function() {
      var file = filesystem.get('test/data/testFileNonExisting.txt', {}, function(err, contents) {
        assert.equal('34', err.errno);
        assert.equal('ENOENT', err.code);
        assert.equal('test/data/testFileNonExisting.txt', err.path);
      });
    });
    it('should list files if path is folder', function() {
      var file = filesystem.get('test/data/', {}, function(err, contents) {
        var expected = [
          'testFile.txt'
        ];
        assert.equal(expected[0], contents[0]);
      });
    });
  });
});

