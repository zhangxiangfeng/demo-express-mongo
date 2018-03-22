/**
 * 用户模型操作
 * @author simon
 * @create 2018-03-21 下午1:42
 **/

// sept 1.得到db连接
var mongo = require('../core/config/Db');
var validate = require('../core/valid/AssertionConcern');
require('../core/exception/ApiException');

// sept 2.user的构造函数
function User(user) {
    this.username = user.username;
    this.nickname = user.nickname;
    this.name = user.name;
    this.email = user.email;
}

// sept 3.对外暴露user
module.exports = User;


// sept 4.原型链新增save方法,对当前用户进行保存->db
User.prototype.save = function (callback) {
    // 1.接收一下表单的数据，要保存的user对象
    var user = {
        username: this.username,
        nickname: this.nickname,
        password: this.password,
        email: this.email
    };

    // 2.使用open方法打开数据库
    mongo.open(function (err, db) {
        if (err) {
            //如果发生了错误
            return callback(err);
        }
        //读取users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongo.close();
                return callback(err);
            }
            //将用户的信息存放到users集合当中去
            collection.insert(user, {safe: true}, function (err, user) {
                mongo.close();
                if (err) {
                    return callback(err);
                }
                return callback(user[0]);//返回注册成功的用户名.
            })
        })
    })
};
//根据名称获取用户信息的get方法,登录
User.get = function (name, callback) {
    //1.打开数据库
    mongo.open(function (err, db) {
        //发生错误的时候
        if (err) {
            return callback(err);
        }
        //2.还是读取users集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongo.close();
                return callback(err);
            }
            //查询用户名
            collection.findOne({name: name}, function (err, user) {
                if (err) {
                    return callback(err);
                }
                callback(null, user);//成功返回查询的用户信息.
            })
        })
    })
}