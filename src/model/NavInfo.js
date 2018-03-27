/**
 *
 * @link http://nav.openread.cn/
 * 网站导航模板模型操作
 * @author simon
 * @create 2018-03-21 下午1:42
 **/

"use strict";
var local = "[NavInfo]";

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//引入mmongodb
var mongo = require('../core/config/Db');
//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

var validate = require('../core/valid/AssertionConcern');
require("../core/utils/StringUtils");
require('../core/exception/ApiException');
var errorCode = require("../core/valid/ErrorCode");
//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// sept 2.NavInfo的构造函数

function NavInfo(user) {
    if (user == null || user === undefined) {
        return this;
    }
    this.imgUrl = user.imgUrl;
    this.name = user.name;
    this.date = user.date;
    this.link = user.link;
}

// sept 3.对外暴露user
module.exports = NavInfo;


// sept 4.原型链新增save方法,对当前用户进行保存->db
NavInfo.prototype.save = function (callback) {
    //参数校验
    validate.checkParam3(this.imgUrl.isNull());
    validate.checkParam3(this.name.isNull());
    validate.checkParam3(this.date.isNull());
    validate.checkParam3(this.link.isNull());

    // 1.接收一下表单的数据，要保存的user对象
    var navInfo = {
        imgUrl: this.imgUrl,
        name: this.name,
        date: this.date,
        link: this.link
    };

    // 2.使用open方法打开数据库
    mongo.open(function (err, db) {
        if (err) {
            //如果发生了错误
            return callback(err);
        }
        //读取users集合
        db.collection('navInfos', function (err, collection) {
            if (err) {
                mongo.close();
                return callback(err);
            }
            //将用户的信息存放到users集合当中去
            collection.insert(navInfo, {safe: true}, function (err, info) {
                mongo.close();
                if (err) {
                    return callback(err);
                }
                return callback(info);//返回注册成功的用户名.
            })
        })
    })
};
NavInfo.prototype.list = function (page, callback) {
    mongo.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('navInfos', function (err, collection) {
            if (err) {
                mongo.close();
                return callback(err);
            }

            //查询条件对象
            var query = {};
            if (page.isNull()) {
                page = 1;
            }
            //查询
            collection.count(query, function (err, total) {
                //total是查询的文章总数量
                collection.find(query, {
                    //根据当前的页数算出每页开始的位置pageStart
                    skip: (page - 1) * 1000,
                    //pageSize 理解为步长
                    limit: 1000
                }).toArray(function (err, docs) {
                    mongo.close();
                    if (err) {
                        return callback(err);
                    }
                    callback(null, docs, total);
                })
            })
        })
    })
};