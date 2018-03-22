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
const IndexRoute = require('./route/IndexRoute');
const UserRoute = require('./route/UserRoute');

//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>
//登录和注册需要的User类
var User = require('./model/User');
//发表需要的Article类
var Article = require('./model/Article');
//引入留言需要的Comment类
var Comment = require('./model/Comment');
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>


//插件的配置信息
var storage = multer.diskStorage({
    //这个是上传图片的地址.
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    //上传到服务器上图片的名字.
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({storage: storage, size: 10225});

//一个权限的问题？
//1.用户未登录的情况下，是无法访问/post ,/logout的
//2.用户在登录的情况下，是无法访问/login,/reg 的
//那么，如果才能完成这个权限的问题呢？

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录!');
        res.redirect('/login');
    }
    next();
}

//如果登录了，是无法访问登录和注册页面的
function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录!');
        res.redirect('back');//返回之前的页面
    }
    next();
}


module.exports = function (app) {

    //这里匹配全局访问,加入访问控制拦截器
    app.all('*', function (req, res, next) {
        //当前请求,分配uuid
        rid = uuidV4();
        logger = LOGGER.getLogger(rid + " " + local);
        Accessinterceptor(app, rid, req, res, next);
    });

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<路由到首页路由>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    app.all("/", function (req, res, next) {
        IndexRoute.index(req, res, rid);
    });
    //<<<<<<<<<<<<<<<<<<<<<<<<<<<路由到首页路由>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<路由到用户路由>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<路由到用户路由>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //发表
    app.get('/post', checkLogin);
    app.get('/post', function (req, res) {
        res.render('post', {
            title: '发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    })
    //发表行为
    app.post('/post', checkLogin);
    app.post('/post', function (req, res) {
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
        })
    })
    //上传
    app.get('/upload', checkLogin);
    app.get('/upload', function (req, res) {
        res.render('upload', {
            title: '文件上传',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });
    //上传行为
    app.post('/upload', checkLogin);
    app.post('/upload', upload.array('field1', 5), function (req, res) {
        req.flash('success', '文件保存成功');
        res.redirect('/upload');
    });
    //退出
    app.get('/logout', function (req, res) {
        //1.清除session
        //2.给用户提示
        //3.跳转到首页
        req.session.user = null;
        req.flash('success', '成功退出');
        res.redirect('/');
    });
    //点击用户名，可以看到用户发布的所有文章
    app.get('/u/:name', function (req, res) {
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
    });
    //文章详情页面
    app.get('/u/:name/:minute/:title', function (req, res) {
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
    });
    //文章的留言发布
    app.post('/comment/:name/:minute/:title', function (req, res) {
        var date = new Date();
        var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        var comment = {
            name: req.body.name,
            time: time,
            content: req.body.content
        };
        var newCommnet = new Comment(req.params.name, req.params.minute, req.params.title, comment);
        newCommnet.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '发布成功');
            res.redirect('back');

        })
    });
    //文章编辑
    app.get('/edit/:name/:minute/:title', checkLogin);
    app.get('/edit/:name/:minute/:title', function (req, res) {
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
    });
    //文章编辑行为
    app.post('/edit/:name/:minute/:title', checkLogin);
    app.post('/edit/:name/:minute/:title', function (req, res) {
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
            })
    });
    //文章删除行为
    app.get('/remove/:name/:minute/:title', checkLogin);
    app.get('/remove/:name/:minute/:title', function (req, res) {
        Article.remove(req.params.name, req.params.minute, req.params.title, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '修改成功');
            res.redirect('/');
        })
    });
    //文章存档
    app.get('/archive', function (req, res) {
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
    });
    //文章标签页
    app.get('/tags', function (req, res) {
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
        })
    });
    //标签对应的文章集合
    app.get('/tags/:tag', function (req, res) {
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
        })
    });
    //搜索
    app.get('/search', function (req, res) {
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
        })
    })
};