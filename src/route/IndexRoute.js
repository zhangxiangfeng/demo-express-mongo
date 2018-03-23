/**
 * 用户控制器
 * @author simon
 * @create 2018-03-22 下午3:52
 **/

"use strict";

var logger;
const local = "[IndexRoute]";

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend self >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var LOGGER = require("../Setting").Log4js;

//<<<<<<<<<<<<<<<<<<<<<<<<depend self >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<     model >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const Article = require('../model/Article');

//<<<<<<<<<<<<<<<<<<<<<<<<     model >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var IndexRoute = {

    //首页处理
    index: function (req, res, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        var page = parseInt(req.query.p) || 1;
        Article.getTen(null, page, function (err, posts, total) {
            if (err) {
                posts = [];
            }
            res.render('index', {
                title: '首页',
                user: req.session.user,
                page: page,
                posts: posts,
                isFirstPage: (page - 1) === 0,
                isLastPage: (page - 1) * 10 + posts.length === total,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    }
};

module.exports = IndexRoute;

