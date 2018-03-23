/**
 * 用户控制器
 * @author simon
 * @create 2018-03-22 下午3:52
 **/

"use strict";

var logger;
const local = "[UserRoute]";

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var crypto = require('crypto');
//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var LOGGER = require("../Setting").Log4js;
//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>
const User = require('../model/User');
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>


var UserRoute = {
    reg: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        //判断是否已经登录
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');//返回之前的页面
        }

        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    },
    regAction: function (req, res, next, rid) {
        //数据接收req.body
        //console.log(req.body);
        //用户名
        var name = req.body.name;
        //密码
        var password = req.body.password;
        //确认密码
        var password_re = req.body['password-repeat'];
        //邮箱
        var email = req.body.email;
        //补充一下，如果未填写的情况下，提示用户
        if (name === '' || password === '' || password_re === '' || email === '') {
            req.flash('error', '请正确填写信息');
            return res.redirect('/reg');
        }
        //1.首先检查一下两次密码是否一样
        if (password_re !== password) {
            //先保存一下当前的错误信息
            req.flash('error', '用户两次输入的密码不一样');
            return res.redirect('/reg');
        }
        //2.对密码进行加密处理
        var md5 = crypto.createHash('md5');
        password = md5.update(req.body.password).digest('hex');
        //console.log(password);

        //3.可以开始实例化User对象了
        var newUser = new User({
            name: name,
            password: password,
            email: email
        });
        //4.检查用户名是否存在
        User.get(newUser.name, function (err, user) {
            //如果发生了错误,跳转回首页
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            //如果存在重复的用户名
            if (user) {
                req.flash('error', '用户名已经存在');
                return res.redirect('/reg');
            }
            //正确情况下
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                }
                //用户信息存入session
                req.session.user = newUser;
                //console.log(req.session.user);
                req.flash('success', '注册成功');
                res.redirect('/');
            })
        });
    },
    login: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        //判断是否已经登录
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');//返回之前的页面
        }

        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    },
    loginAction: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        //判断是否已经登录
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');//返回之前的页面
        }

        //1.检查下用户名有没有
        //2.检查下密码对不对
        //3.存储到session中用户的登录信息
        //4.跳转到首页
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('hex');

        User.get(req.body.name, function (err, user) {
            if (!user) {
                //说明用户名不存在
                req.flash('error', '用户名不存在');
                return res.redirect('/login');
            }
            //检查两次密码是否一样
            if (user.password !== password) {
                req.flash('error', '密码错误');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登录成功');
            res.redirect("/");
        })
    },
    logoutAction: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        //1.清除session
        //2.给用户提示
        //3.跳转到首页
        req.session.user = null;
        req.flash('success', '成功退出');
        res.redirect('/');
    }
};
module.exports = UserRoute;

