var assert = require('chai').assert;
var pathSetting = require('../lib/path-setting');

var cwd = process.cwd();

describe('Path Setting', function() {
  describe('default path', function(){
    it('should return the default path', function () {
      var expected = cwd + '/config/config.json';
      assert.equal(pathSetting.buildConfigPath(), expected);
    });
  });
  describe('environment parameter test', function(){
    it('should return the path base on environment setting - NODE_ENV', function () {
      var expected = cwd + '/config/config.test.json';
      assert.equal(pathSetting.buildConfigPath('test'), expected);
    });
    
    it('should return the path base on environment setting - NODE_ENV + CONF_EXT_DIR', function () {
      var expected = '/etc/myapp/config/config.test.json';
      assert.equal(pathSetting.buildConfigPath('test', '/etc/myapp/config'), expected);
    });

    it('should return the path base on environment setting - NODE_ENV + CONF_EXT_DIR + CONF_EXT_NAME', function () {
      var expected = '/etc/myapp/config/customize.other.json';
      assert.equal(pathSetting.buildConfigPath('other', '/etc/myapp/config', 'customize'), expected);
    });

    it('should return the path base on environment setting - NODE_ENV + CONF_EXT_DIR + CONF_EXT_NAME - relative path', function () {
      var expected = cwd + '/base/conf2/customize.other.json';
      assert.equal(pathSetting.buildConfigPath('other', './base/conf/../conf2', 'customize'), expected);
    });
  });
});