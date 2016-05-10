# json-config-ext

[![Build Status](https://travis-ci.org/Roman-Lo/json-config-ext.svg?branch=master)](https://travis-ci.org/Roman-Lo/json-config-ext)
[![NPM version](https://img.shields.io/npm/v/json-config-ext.svg)](https://www.npmjs.com/package/json-config-ext)
[![Coverage Status](https://coveralls.io/repos/github/Roman-Lo/json-config-ext/badge.svg?branch=master)](https://coveralls.io/github/Roman-Lo/json-config-ext?branch=master)

By [Roman Lo](https://github.com/Roman-Lo)

An extensible json configuration plugin for nodejs.

## Installation

`json-config-ext` is available on NPM. You can install `json-config-ext` simply by enter the following command:

```bash
npm install --save json-config-ext
```

## Usage

```js
// load from file `${process.env.cwd()}/config/config.json`
var config = require('json-config-ext').config;
```

## Advanced Topic

### Environment Configuration

As default, `json-config-ext` will try to get the `config/config.json` under the `process.cwd()` directory. But you can set/modify the following environment parameters to tell this plugin to load the specific configurations.

#### `process.env.NODE_ENV`

The node environment stands for the suffix of the configuration file.

For example, when `process.env.NODE_ENV` is set to `prod`, plugin will try to load `config.prod.json` under the default configuration directory.

#### `process.env.CONF_EXT_DIR`

`CONF_EXT_DIR` indicates the configuration directory location. It supports both absolute path or relative path. Find out more in the following samples:

1. Absolute path sample

    As:
    ```js
    process.env.CONF_EXT_DIR = '/etc/yourapp/config';
    ```

    Then:
    ```js
    // load from file `/etc/yourapp/config/config.json`
    require('json-config-ext').config;
    ```

1. Relative path sample

    As:
    ```js
    process.env.CONF_EXT_DIR = './myconfig';
    ```

    Then:
    ```js
    // load from file `${process.env.cwd()}/myconfig/config.json`
    require('json-config-ext').config;
    ```

#### `process.env.CONF_EXT_NAME`

`CONF_EXT_NAME` indicates the configuration file name. By the default, the configuration file name is `config`, and the plugin will load `config.${NODE_ENV}.json`. By changing the `CONF_EXT_NAME`, you can load different configuration files. Here is an example:

```js
// set the configuration file name to `myconf`
process.env.CONF_EXT_NAME = 'myconf';

// load from file `${process.env.cwd()}/config/myconf.json`
var config = require('json-config-ext').config;
```

### Extensive JSON

Calling the Json extensively, this means Json can be extended/inherited between each others. This is also the main spotlight feature of this plugin.

Here, I introduce three reserved keywords within the root level of the json file:


1. `__name`

    The `__name` keyword is use to declare the name of the json file/object, which can be use in the `__extends` array.

1. `__extends`

    The `__extends` array tells the plugin to load and merge the specific json files in a preset order(order by the index ascendingly).

    You can put


3. `__excludes`

    The `__excludes` array tells the plugin not to load the specific json files, through out the whole loading process.

    _NOTICE: I didn't implements this feature yet._

No words could more straight than seeing the code to know how to extends your json files. Let go to the [`advanced-usage`](https://github.com/Roman-Lo/json-config-ext/tree/master/examples/advanced-usage) example and take a look at this awesome feature!


## Contributions

Contributions are super welcome here! If you have any good idea about this project, please feel free to let me know.

You can contact me by this e-mail: [romam.nare@gmail.com](mailto:romam.nare@gmail.com)

Or just leave a message on the issue page :)




