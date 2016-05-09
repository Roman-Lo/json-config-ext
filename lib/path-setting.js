var path = require('path');

var DEFAULT_ENV = '~default-json-config-ext~';
var DEFAULT_CONFIG_DIR = './config'; // use path.join to support both absolute and relative path
var DEFAULT_CONFIG_NAME = 'config';
var CONFIG_EXT = '.json';

exports.buildConfigPath = function (env, dir, name) {
  var currentEnv = env || DEFAULT_ENV;
  var dir = dir || DEFAULT_CONFIG_DIR;
  var currentConfigName = name || DEFAULT_CONFIG_NAME;
  var currentConfigDir = dir[0] === '.' ? path.join(process.cwd(), dir) : dir;
  return currentConfigDir + '/' + currentConfigName + (currentEnv === DEFAULT_ENV ? '' : '.' + currentEnv) + CONFIG_EXT;
};