var jsonLoader = require('../lib/components/json2memory');
var fs = require('fs');

var app = {
    setting:{
        'env':'development'
    },
    get:function(arg) {
        return this.setting[arg];
    },
    set:function(key,value) {
        this.setting[key] = value;
    },
    getBase:function(){
        return 'E:/Archive/pomelo/pomelo-config-loader/';
    }
}

var loader =new jsonLoader(app,{});

console.log(loader.keys());

var l = app.get('jsonLoader');
// console.log(l.getAll());

// setInterval(() => {
//     console.log('apiServer ',l.getData('apiServer'));
// },10000)


var testFile = 'E:/Archive/pomelo/pomelo-config-loader/test/room.json'
fs.watch(testFile, function (event, fn) {
    if (event === 'change') {
        console.log(' test file change  ',fn);
        
        try{
            delete require.cache[require.resolve(testFile)];
            console.log(require(testFile));
        }
        catch(err) {
            console.error('jsonLoader reload err ',err,' filename ',fn);
        }
    }
});