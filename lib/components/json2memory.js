/**
 * Created by wuqingkai on 17/5/23.
 */
var path = require('path');
var fs = require('fs');
var logger = require('pomelo-logger').getLogger("pomelo");

var config = "/config/jsonLoader.json";
var configDir = "/config"

var Component = function (app) {
    this.jsonFile = {};
    var self = this;
    self.app = app;

    var env = app.get('env');
    var originPath = path.join(app.getBase(), config);
    var presentPath = path.join(app.getBase(), configDir, env, path.basename(config));
    var realPath;
    if (fs.existsSync(originPath)) {
        realPath = originPath;
    } else if (fs.existsSync(presentPath)) {
        realPath = presentPath;
    } else {
        logger.error('not found jsonLoader config file');
        return;
    }

    var cnf = require(realPath);
    var jsonPaths = path.join(app.getBase(), cnf.dir);
    fs.readdirSync(jsonPaths).forEach(function (file) {
        if (!/.json$/.test(file)) {
            return;
        }
        var jsonPath = path.join(jsonPaths, file);
        var fileName = path.basename(jsonPath, '.json');
        self.jsonFile[fileName] = require(jsonPath);

        if (!!jsonPath && !!cnf.reload) {
            fs.watch(jsonPath, function (event, fn) {
                if (event === 'change') {
                    try{
                        delete require.cache[require.resolve(jsonPath)];
                        self.jsonFile[fileName] = require(jsonPath);
                    }
                    catch(err) {
                        logger.info('jsonLoader reload err ',' filename ',fn);
                    }
                }
            });
        }
    });
};

var proto = Component.prototype;

proto.getData = function (fileName) {
    return this.jsonFile[fileName];
};

proto.getDataById = function (fileName, id) {
    return this.jsonFile[fileName][id];
};

proto.keys = function() {
    return Object.keys(this.jsonFile);
}

proto.getAll = function() {
    return this.jsonFile;
}

var instance = null;

module.exports = function(app, opts) {
  // singleton
  if(instance) {
    return instance;
  }

  instance = new Component(app, opts);
  app.set('jsonLoader', instance);
  return instance;
};