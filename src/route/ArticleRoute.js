/**
 * 用户控制器
 * @author simon
 * @create 2018-03-22 下午3:52
 **/

"use strict";

var logger;
const local = "[ArticleRoute]";

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend self >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var LOGGER = require("../Setting").Log4js;
var User = require('../model/User');
//<<<<<<<<<<<<<<<<<<<<<<<<depend self >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<     model >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const Article = require('../model/Article');

//<<<<<<<<<<<<<<<<<<<<<<<<     model >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var ArticleRoute = {

    /**
     * 发布页面
     * */
    publish: function (req, res, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }

        res.render('post', {
            title: '发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    },
    /**
     * 发布行为
     * */
    publishAction: function (req, res, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }

        //当前SESSION里面的用户信息
        var currentUser = req.session.user;
        //判断一下内容不能为空
        if (req.body.title === '' || req.body.post === '') {
            req.flash('error', '内容不能为空');
            return res.redirect('/post');
        }

        //添加一下标签信息
        var tags = [req.body.tag1, req.body.tag2, req.body.tag3];
        var post = new Article(currentUser.name, req.body.title, tags, req.body.post);
        post.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功');
            res.redirect('/');
        });
    },
    /**
     * 文章详情页面
     * */
    detail: function (req, res, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        Article.getOne(req.params.name, req.params.minute, req.params.title, function (err, post) {
            if (err) {
                req.flash('error', '找不到当前文章');
                return res.redirect('/');
            }
            res.render('article', {
                title: req.params.title,
                user: req.session.user,
                post: post,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    },
    /**
     * 发布行为
     * */
    editAction: function (req, res, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }

        Article.update(req.params.name, req.params.minute, req.params.title,
            req.body.post, function (err) {
                //encodeURI是防止有中文的情况下，对中文的字符进行转义
                var url = encodeURI('/u/' + req.params.name + '/' + req.params.minute + '/' + req.params.title);
                if (err) {
                    req.flash('error', err);
                    return res.redirect(url);
                }
                req.flash('success', '编辑成功');
                return res.redirect(url);
            });
    },
    /**
     * 删除行为
     * */
    delAction: function (req, res, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }

        Article.remove(req.params.name, req.params.minute, req.params.title, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '修改成功');
            res.redirect('/');
        });
    },
    /**
     * 编辑文章页面
     * */
    edit: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }

        //获取到当前的用户
        var currentUser = req.session.user;
        Article.edit(currentUser.name, req.params.minute, req.params.title, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            res.render('edit', {
                title: '编辑文章',
                user: req.session.user,
                post: post,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        })
    },
    /**
     * 文章存档页面
     * */
    archive: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        Article.getArchive(function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('archive', {
                title: '存档',
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    },
    /**
     * 文章标签页面
     * */
    tag: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        Article.getTags(function (err, posts) {
            if (err) {
                req.flash('error', err);
                res.redirect('/');
            }
            res.render('tags', {
                title: '标签',
                posts: posts,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    },
    /**
     * 根据标签搜文章
     * */
    searchArticleByTag: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        Article.getTag(req.params.tag, function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('tag', {
                title: 'TAG:' + req.params.tag,
                user: req.session.user,
                posts: posts,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    },
    /**
     * 根据标签搜文章
     * */
    searchArticleByTitle: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        Article.search(req.query.keyword, function (err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('search', {
                title: 'SEARCH :' + req.query.keyword,
                user: req.session.user,
                posts: posts,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            })
        });
    },
    /**
     * 点击用户名,查询用户发布的所有文章
     * */
    findAllbyUser: function (req, res, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        var page = parseInt(req.query.p) || 1;
        //检查用户是否存在
        User.get(req.params.name, function (err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/');
            }
            //查询并返回该用户第 page 页的 10 篇文章
            Article.getTen(user.name, page, function (err, posts, total) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                res.render('user', {
                    title: user.name,
                    posts: posts,
                    page: page,
                    isFirstPage: (page - 1) === 0,
                    isLastPage: ((page - 1) * 10 + posts.length) === total,
                    user: req.session.user,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
        });
    }
};

module.exports = ArticleRoute;

