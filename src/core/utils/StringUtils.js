/**
 *
 * 字符串处理工具
 * @author simon
 * @create 2018-03-21 下午2:04
 **/

"use strict";
const local = "[StringUtils]";
var logger;


//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const Constant = require("./Constant");
var LOGGER = require("../../Setting").Log4js;
//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/**
 * 格式化字符串,使用占位符
 * */
String.prototype.format = function () {
    if (this.isNull()) return this;
    for (var s = this, i = 0; i < arguments.length; i++)
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return s;
};

/**
 * 判断字符串是否为空
 * */
String.prototype.isNull = function () {
    return this === "" || this === undefined || this == null;
};

var StringUtils = {

    /**
     *
     * 这里配合前端服务器设置nginx代理远程ip
     * proxy_set_header X-Real-IP $remote_addr;
     * proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     * */
    getClientIp: function (req) {
        return req.headers["X-Forwarded-For"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    },
    /**
     *
     *发送数据到前端
     * @param res  响应对象
     * @param data 发送的数据
     * @param contentType 类型
     * */
    send: function (rid, res, data, contentType) {
        data = JSON.stringify(data);

        logger = LOGGER.getLogger(rid + " " + local);

        logger.trace("response body: {0}".format(data));
        logger.trace("Access End >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

        contentType = Constant.ContentType.ApplicationJson || contentType;

        res.type(contentType).send(data);
    }
};
module.exports = StringUtils;