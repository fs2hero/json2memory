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

    console.log('presentPath ', presentPath);
    if (fs.existsSync(originPath)) {
        realPath = originPath;
    } else if (fs.existsSync(presentPath)) {
        realPath = presentPath;
    } else {
        logger.error('not found jsonLoader config file');
        return;
    }

    var conf = require(realPath);
    for (var i in conf) {
        var cnf = conf[i];
        this._load(cnf);
    }
};

var proto = Component.prototype;

proto._load = function (cnf) {
    var self = this;
    var app = self.app;

    var jsonPaths = path.join(app.getBase(), cnf.dir);
    fs.readdirSync(jsonPaths).forEach(function (file) {
        if (!/.json$/.test(file)) {
            return;
        }
        
        var jsonPath = path.join(jsonPaths, file);
        var fileName = path.basename(jsonPath, '.json');

        if(!cnf.id) {
            cnf.id = 'default';
        }

        if(!self.jsonFile[cnf.id]) {
            self.jsonFile[cnf.id] = {};
        }

        var jsonFile = self.jsonFile[cnf.id];
        jsonFile[fileName] = require(jsonPath);

        if (!!jsonPath && !!cnf.reload) {
            fs.watch(jsonPath, function (event, fn) {
                if (event === 'change') {
                    try {
                        delete require.cache[require.resolve(jsonPath)];
                        jsonFile[fileName] = require(jsonPath);
                    }
                    catch (err) {
                        logger.info('jsonLoader reload err ', ' filename ', fn);
                    }
                }
            });
        }
    });
}

proto.getData = function (id,fileName) {
    if(!id) {
        id = 'default';
    }

    if(!this.jsonFile[id]) {
        return null;
    }

    return this.jsonFile[id][fileName];
};

proto.getDataById = function (id,fileName, key) {
    if(!id) {
        id = 'default';
    }

    if(!this.jsonFile[id]) {
        return null;
    }

    return this.jsonFile[id][fileName][key];
};

proto.keys = function (id) {
    if(!id) {
        id = 'default';
    }

    if(!this.jsonFile[id]) {
        return [];
    }

    return Object.keys(this.jsonFile[id]);
}

proto.getAll = function (id) {
    if(!id) {
        id = 'default';
    }

    if(!this.jsonFile[id]) {
        return null;
    }

    return this.jsonFile[id];
}

var instance = null;

module.exports = function (app, opts) {
    // singleton
    if (instance) {
        return instance;
    }

    instance = new Component(app, opts);
    app.set('jsonLoader', instance);
    return instance;
};