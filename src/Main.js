/**
 * 启动入口
 * @author simon
 * @create 2018-03-21 下午6:51
 **/

"use strict";
var local = "Main";

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var process = require('process');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
//引入flash插件
var flash = require('connect-flash');
//引入会话插件
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//引入数据库配置文件
var settings = require('./Setting');
var routes = require('./Route');
var LOGGER = require("./Setting").Log4js;
//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>

var ee = new EventEmitter();
//给EventEmitter设置最大监听,link http://www.bkjia.com/Javascript/774972.html
ee.setMaxListeners(10);
settings = settings.database;

var logger = LOGGER.getLogger(local);

var app = express();
var port = (function () {
    if (typeof (process.argv[2]) !== 'undefined') { // 如果输入了端口号，则提取出来
        if (isNaN(process.argv[2])) { // 如果端口号不为数字，提示格式错误
            throw 'Please write a correct port number.'
        } else { // 如果端口号输入正确，将其应用到端口
            return process.argv[2]
        }
    } else { // 如果未输入端口号，则使用下面定义的默认端口
        return 3000
    }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//改一下，改成ejs模板引擎
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../data/files', 'favicon.ico')));

//这里支持自定义数据格式 @link https://segmentfault.com/a/1190000007769095
app.use(morgan('default'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../data/files')));
//使用flash插件
app.use(flash());
//使用session会话
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,
    cookies: {maxAge: 1000 * 60 * 60 * 24 * 30},
    store: new MongoStore({
        url: 'mongodb://localhost/local'
    }),
    resave: false,
    saveUninitialized: true
}));

//将app这个应用传入到routes函数里面进行路由处理.
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found 找不到');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//让整个应用启动起来
try {
    app.listen(port, function () {
        logger.info('the application startup,listen:' + port);
    });
    module.exports = app;
} catch (e) {
    console.log("simon" + e.message);
}

