/**
 * 配置文件
 * @author simon
 * @create 2018-03-21 下午1:36
 **/

"use strict";

// sept 1.依赖log4js
var LOG4JS = require("log4js");

var Setting = {};

Setting.database = {
    //加密的参数
    cookieSecret: 'lzy',
    //数据库的名称
    db: 'local',
    //主机名
    host: 'localhost',
    //端口号
    port: 27018
};

Setting.logConfig = {
    appenders: [
        {                                       // 需要控制台打印
            type: "console"
        },
        {                                       // normal_log 记录器
            type: "dateFile",                   // 日志文件类型，可以使用日期作为文件名的占位符
            filename: "data/logs",
            pattern: "-platform-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: "platform"
        }
    ],
    levels: {                                   // 设置日志级别，低于该级别的将不会被打印到控制台
        platform: "trace"
    }
};

LOG4JS.configure(Setting.logConfig);
Setting.Log4js = LOG4JS;
// 这里不在统一定制化,在路由入口出,初始化uuid即可
// Setting.LOG4JS = LOG4JS.getLogger("normal");

//暴露Setting,给外面使用
module.exports = Setting;