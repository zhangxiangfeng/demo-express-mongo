/**
 * 上传路由
 * @author simon
 * @create 2018-03-23 上午11:08
 **/

"use strict";

//全局变量
var logger;
const local = "[UploadRoute]";

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//引入multer插件
var multer = require('multer');
//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var LOGGER = require("../Setting").Log4js;

//插件的配置信息
var storage = multer.diskStorage({
    //这个是上传图片的地址.
    destination: function (req, file, cb) {
        cb(null, "data/files/upload")
    },
    //上传到服务器上图片的名字.
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({storage: storage, size: 10225});
//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>

var UploadRoute = {
    //上传页面
    upload: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }

        res.render('upload', {
            title: '文件上传',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    },
    //上传行为
    uploadAction: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }

        req.flash('success', '文件保存成功');
        res.redirect('/file/upload');
    }
};

module.exports = UploadRoute;