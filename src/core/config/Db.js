/**
 * 配置数据库连接
 * @author simon
 * @create 2018-03-21 下午1:36
 **/
"use strict";

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//引入连接数据库的mongodb模块
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend self >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//引入数据库的配置文件
var settings = require('../../Setting');

//<<<<<<<<<<<<<<<<<<<<<<<<depend self >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//创建数据库连接对象
module.exports = new Db(
    settings.database.db,
    new Server(settings.database.host, settings.database.port), {
        safe: true
    }
)
