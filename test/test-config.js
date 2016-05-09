var assert = require('chai').assert;



describe('Testing Config module', function () {

  // reset environment
  process.env.CONF_EXT_DIR = './test/config';
  delete process.env.NODE_ENV;
  delete process.env.CONF_EXT_NAME;

  var config = require('../index');

  describe('general', function () {
    it('simple config loading test', function (){
      process.env.CONF_EXT_DIR = './test/config/test-01';
      config.reload();
      var expected = {
        "conf": "Test - 01"
      };
      assert.deepEqual(config.config, expected);
    });
    it('reserve keyword test', function () {
      process.env.CONF_EXT_DIR = './test/config/test-02';
      config.reload();
      var expected = {};
      assert.deepEqual(config.config, expected);
    });
  });

  describe('advanced', function () {
    it('test extensive', function () {
      process.env.CONF_EXT_DIR = './test/config/test-03';
      config.reload();
      var expected = {
        "key": "hey",
        "obj": {
          "num": 0,
          "path": "nooooo!",
          "ext_02": "extension 02"
        },
        "ext_01": {
          "ext_01": "reserved"
        }
      };
      assert.deepEqual(config.config, expected);
    });

    it('test locator', function () {
      process.env.CONF_EXT_DIR = './test/config/test-04';
      config.reload();
      var expected = {
        "key": "hey",
        "obj": {
          "num": 0,
          "path": "nooooo!"
        }
      };
      assert.deepEqual(config.config, expected);
      assert.deepEqual(config.get('obj.path'), 'nooooo!');
    });
  });

});