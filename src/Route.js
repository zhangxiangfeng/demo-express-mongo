/**
 * 路由器
 * @author simon
 * @create 2018-03-21 下午6:50
 **/

"use strict";

//全局变量
var logger;
var local = "[Route]";
var rid;
var remoteIp;

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//需要引入一个加密的模块
var crypto = require('crypto');
//引入multer插件
var multer = require('multer');
//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//引入日志记录插件
var LOGGER = require("./Setting").Log4js;
var uuidV4 = require('node-uuid');
var Accessinterceptor = require('./core/interceptor/Accessinterceptor');
const ErrorCode = require("./core/valid/ErrorCode");
const ApiException = require("./core/exception/ApiException");
const Constant = require("./core/utils/Constant");
const StringUtils = require("./core/utils/StringUtils");

const IndexRoute = require('./route/IndexRoute');
const UserRoute = require('./route/UserRoute');
const ArticleRoute = require('./route/ArticleRoute');
const UploadRoute = require('./route/UploadRoute');
const CommentRoute = require('./route/CommentRoute');

//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//插件的配置信息
var storage = multer.diskStorage({
    //这个是上传图片的地址.
    destination: function (req, file, cb) {
        cb(null, 'data/files/upload')
    },
    //上传到服务器上图片的名字.
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
//上传使用
var upload = multer({storage: storage, size: 10225});

module.exports = function (app) {

    //这里匹配全局访问,加入访问控制拦截器
    app.all('*', function (req, res, next) {
        //当前请求,分配uuid
        rid = uuidV4();
        remoteIp = StringUtils.getClientIp(req);

        rid = rid + " " + remoteIp;

        logger = LOGGER.getLogger(rid + " " + local);
        Accessinterceptor(app, rid, req, res, next);
    });

    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓路由到首页路由↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    app.all("/", function (req, res, next) {
        IndexRoute.index(req, res, rid);
    });
    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑路由到首页路由↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓路由到用户路由↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

    //注册页面
    app.get('/user/reg', function (req, res, next) {
        UserRoute.reg(req, res, next, rid);
    });

    //注册行为
    app.post('/user/reg', function (req, res, next) {
        UserRoute.regAction(req, res, next, rid);
    });

    //登录页面
    app.get('/user/login', function (req, res, next) {
        UserRoute.login(req, res, next, rid);
    });

    //登录行为
    app.post('/user/login', function (req, res, next) {
        UserRoute.loginAction(req, res, next, rid);
    });

    //退出行为
    app.get('/user/logout', function (req, res, next) {
        UserRoute.logoutAction(req, res, next, rid);
    });

    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑路由到用户路由↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓路由到文章路由↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    //发布页面
    app.get('/article/post', function (req, res, next) {
        ArticleRoute.publish(req, res, next, rid);
    });

    //发布行为
    app.post('/article/post', function (req, res, next) {
        ArticleRoute.publishAction(req, res, next, rid);
    });

    //文章详情页面
    app.get('/u/:name/:minute/:title', function (req, res, next) {
        ArticleRoute.detail(req, res, next, rid);
    });

    //文章编辑行为
    app.post('/edit/:name/:minute/:title', function (req, res, next) {
        ArticleRoute.editAction(req, res, next, rid);
    });

    //文章删除行为
    app.get('/remove/:name/:minute/:title', function (req, res, next) {
        ArticleRoute.delAction(req, res, next, rid);
    });

    //文章的留言发布
    app.post('/comment/:name/:minute/:title', function (req, res, next) {
        CommentRoute.commentPublishAction(req, res, next, rid);
    });

    //点击用户名,查询用户发布的所有文章
    app.get('/u/:name', function (req, res, next) {
        ArticleRoute.findAllbyUser(req, res, next, rid);
    });

    //编辑文章页面
    app.get('/edit/:name/:minute/:title', function (req, res, next) {
        ArticleRoute.edit(req, res, next, rid);
    });

    //文章存档页面
    app.get('/article/archive', function (req, res, next) {
        ArticleRoute.archive(req, res, next, rid);
    });

    //文章标签页
    app.get('/article/tags', function (req, res, next) {
        ArticleRoute.tag(req, res, next, rid);
    });

    //根据标签搜文章
    app.get('/article/tags/:tag', function (req, res, next) {
        ArticleRoute.searchArticleByTag(req, res, next, rid);
    });

    //根据名称搜文章
    app.get('/article/search', function (req, res, next) {
        ArticleRoute.searchArticleByTitle(req, res, next, rid);
    });

    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑路由到文章路由↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓路由到上传路由↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

    //上传页面
    app.get('/file/upload', function (req, res, next) {
        UploadRoute.upload(req, res, next);
    });

    //上传行为
    app.post('/file/upload', upload.array('fileName', 5), function (req, res, next) {
        UploadRoute.uploadAction(req, res, next);
    });

    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑路由到上传路由↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    //测试行为
    app.get('/test', function (req, res, next) {
        var test = {
            name: "simon",
            age: 18
        };

        //使用工具返回-为了打印响应对象内容
        StringUtils.send(rid, res, test);
    });

    //其它判断为404
    app.all('*', function (req, res, next) {
        logger.trace("路由进入404");
        res.type(Constant.ContentType.ApplicationJson).status(ErrorCode.HttpCode.Error404.code).send(JSON.stringify(ErrorCode.HttpCode.Error404));
    });
};