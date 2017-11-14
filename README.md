# json2memory
a plugin for pomelo to load json file

### 作用分析
* 游戏研发当中,程序要提供配置接口给数值策划,让数值策划根据自己的计算填出理想的数值.
* 在数值填好excel数据后,一般会用倒表工具导出到json文件,再由程序启动的时候读取json文件到内存.称之为静态数据.
* 开发项目都会需要静态数据,那导入json文件到内存的工作便可以造一个轮子.
* 该插件基于pomelo,将json文件夹下的所有json文件中的数据读取到内存,以供程序使用.

### 使用方法
* 进入pomelo项目的game-server下,运行npm命令下载插件
```
npm install json2memory --save
```
* 在config下增加json2memory目录,在json2memory目录下增加config.json
```
{
  "development": "/app/data/json",    // 指向存放json文件的文件夹
  "production": "/app/data/json"      // 指向存放json文件的文件夹
}
```
* 获取静态数据的方法有两种
1. 获取某个文件的所有数据
```
require('json2memory').getData('jsonName'); // 'jsonName'为某个json文件的文件名
```
2. 根据id获取某个文件下id对应的数据(对象数据直接获取id对应数据,数组数据则将id作为下标获取数据)
```
require('json2memory').getDataById('jsonName', 'id'); // id为json数据下的某个key
```

### 注意
该插件并未设置数据只读,使用数据的时候切莫随意更改数据内容,否则静态数据的内容就有可能变成更改后的样子.

