var merge = require('merge');
var fs = require('fs');
var path = require('path');
var join = path.join;
var dirname = path.dirname;
var pathSetting = require('./lib/path-setting');

var RESERVED_KEYWORD_EXTENDS = '__extends';
var RESERVED_KEYWORD_EXCLUDES = '__excludes';
var RESERVED_KEYWORD_NAME = '__name';


var inst = new Config();

function Config () {
  init.call(this);
};

Config.prototype.reload = function (){
  init.call(this);
};

Config.prototype.get = function (path) {
  var locatorArr = path.split('.');
  var tar = this.config;
  locatorArr.forEach(function (locator) {
    tar = tar[locator];
  });
  return tar;
};

module.exports = inst;

function init(){
  var configPath = pathSetting.buildConfigPath(process.env.NODE_ENV, process.env.CONF_EXT_DIR, process.env.CONF_EXT_NAME);
  var basePath = dirname(configPath);
  this.config = load(configPath, basePath);
  this.path = configPath;
}


function cleanUpConfigObject(configObj, needReserveName) {
  var keys = Object.keys(configObj);
  if (keys.indexOf(RESERVED_KEYWORD_EXTENDS) >= 0) {
    delete configObj[RESERVED_KEYWORD_EXTENDS];
  }
  if (keys.indexOf(RESERVED_KEYWORD_EXCLUDES) >= 0) {
    delete configObj[RESERVED_KEYWORD_EXCLUDES];
  }
  if (!needReserveName) {
    if (keys.indexOf(RESERVED_KEYWORD_NAME) >= 0) {
      delete configObj[RESERVED_KEYWORD_NAME];
    }
  }
  return configObj;
}

function validateConfigFormat(configObj) {
  var keys = Object.keys(configObj);
  if (keys.indexOf(RESERVED_KEYWORD_EXCLUDES) >= 0 && !(configObj[RESERVED_KEYWORD_EXCLUDES] instanceof Array)) {
    throw Error('Format error! ' + RESERVED_KEYWORD_EXCLUDES + ' must be an Array');
  }
  if (keys.indexOf(RESERVED_KEYWORD_NAME) >= 0 && typeof configObj[RESERVED_KEYWORD_NAME] !== 'string') {
    throw Error('Format error! ' + RESERVED_KEYWORD_NAME + ' must be a string');
  }
  if (keys.indexOf(RESERVED_KEYWORD_EXTENDS) >= 0 && !(configObj[RESERVED_KEYWORD_EXTENDS] instanceof Array)) {
    throw Error('Format error! ' + RESERVED_KEYWORD_EXTENDS + ' must be an Array');
  }
  return true;
}

function excludesHandler(excludes, extendDict) {
  excludes.forEach(function (item) {
    if (extendDict[item]) {
      delete extendDict[item];
    }
  });
  return extendDict;
}

function load(config, basePath, innerCall) {
  var configObj = typeof config === 'string' ? require(config) : config;
  validateConfigFormat(configObj);
  var keys = Object.keys(configObj);
  var hasExtends = keys.indexOf(RESERVED_KEYWORD_EXTENDS) >= 0;
  var hasExcludes = keys.indexOf(RESERVED_KEYWORD_EXCLUDES) >= 0;
  var extendDict = {};
  var extendKeys = [];
  var excludes = [];
  var seed = {};
  // preset extends
  if (hasExtends) {
    var extendModules = configObj[RESERVED_KEYWORD_EXTENDS];
    extendModules.forEach(function (item, index) {
      extendDict[item] = { order: index, ref: {} };
    });
  }
  // handle excludes
  if (hasExcludes) {
    excludes = configObj[RESERVED_KEYWORD_EXCLUDES];
    extendDict = excludesHandler(excludes, extendDict);
  }
  // load extends
  if (hasExtends) {
    extendKeys = Object.keys(extendDict);
    extendKeys.forEach(function (path) {
      var p = join(basePath, path);
      var obj = merge.recursive(true, extendDict[path], {
        ref: load(p, dirname(p), true),
      });
      var name = obj.ref[RESERVED_KEYWORD_NAME] || path;
      delete extendDict[path];
      extendDict[name] = obj;
    });
    extendKeys = Object.keys(extendDict);
  }
  // handle excludes
  if (hasExcludes){
    excludes = configObj[RESERVED_KEYWORD_EXCLUDES];
    extendDict = excludesHandler(excludes, extendDict);
    extendKeys = Object.keys(extendDict);
  }
  // handle extends
  if (hasExtends) {
    var extendArray = [];
    extendKeys.forEach(function (key) {
      var extendDictObj = extendDict[key];
      extendArray[extendDictObj.order] = extendDictObj.ref;
    });
    extendArray.forEach(function (ref, order) {
      seed = merge.recursive(true, seed, ref);
    });
    cleanUpConfigObject(seed);
  }
  configObj = cleanUpConfigObject(configObj, innerCall);
  return merge.recursive(true, seed, configObj);
}