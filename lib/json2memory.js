/**
 * Created by wuqingkai on 17/5/23.
 */
var pomelo = require('pomelo');
var path = require('path');
var fs = require('fs');
var logger = require('pomelo-logger').getLogger("pomelo");

var config = "config/json2memory/config";

var Json2memory = function() {
    this.jsonFile = {};
    var self = this;
    var jsonDir = require(path.join(pomelo.app.getBase(), config))[pomelo.app.get('env')];
    var jsonPaths = path.join(pomelo.app.getBase(), jsonDir);
    fs.readdirSync(jsonPaths).forEach(function(file) {
        if (!/.json$/.test(file)) {
            return;
        }
        var jsonPath = path.join(jsonPaths, file);
        var fileName = path.basename(jsonPath, '.json');
        self.jsonFile[fileName] = require(jsonPath);
    });
};

module.exports = new Json2memory();
var pro = Json2memory.prototype;

pro.getData = function(fileName) {
    return this.jsonFile[fileName];
};

pro.getDataById = function(fileName, id) {
    return this.jsonFile[fileName][id];
};