/**
 *
 * 字符串处理工具
 * @author simon
 * @create 2018-03-21 下午2:04
 **/

"use strict";
const local = "[StringUtils]";
var logger;

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const extend = require('extend');
//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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

Object.prototype.toString = function () {
    return JSON.stringify(this);
};

var StringUtils = {

    /**
     *
     * X-Real-IP: 101.227.104.62
     * X-Scheme: http
     * X-Forwarded-For: 101.227.104.62
     * 这里配合前端服务器设置nginx代理远程ip
     * proxy_set_header X-Real-IP $remote_addr;
     * proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     * */
    getClientIp: function (req) {
        return req.headers["x-real-ip"] ||
            req.headers["x-forwarded-for"];
    },
    /**
     *
     *发送数据到前端
     * @param res  响应对象
     * @param data 发送的数据对象
     * @param contentType 类型
     * */
    send: function (rid, res, data, contentType) {
        // data = JSON.stringify(data);

        logger = LOGGER.getLogger(rid + " " + local);

        let dataStr = JSON.stringify(data);

        contentType = contentType || Constant.ContentType.ApplicationJson;


        //从f0099719-9d9f-4c8a-9bb1-ade29c512c4d ::1 截取rid
        let realRid = rid.substr(0, rid.indexOf(" "));

        res.header("Rid", realRid);
        res.header("Content-Length", dataStr.length);
        res.header("Content-Type", "application/json;charset=utf-8");


        logger.trace("response body: {0}".format(dataStr));
        logger.trace("Access End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

        res.type(contentType).status(200).json(data);
    },
    /**
     *
     *发送数据到前端
     * @param res  响应对象
     * @param data 发送的数据对象
     * @param contentType 类型
     * */
    errorSend: function (rid, code, res, data, contentType) {
        // data = JSON.stringify(data);

        logger = LOGGER.getLogger(rid + " " + local);

        let dataStr = JSON.stringify(data);

        contentType = contentType || Constant.ContentType.ApplicationJson;

        //从f0099719-9d9f-4c8a-9bb1-ade29c512c4d ::1 截取rid
        let realRid = rid.substr(0, rid.indexOf(" "));

        res.header("Rid", realRid);
        res.header("Content-Length", dataStr.length);
        res.header("Content-Type", "application/json;charset=utf-8");

        logger.trace("response body: {0}".format(dataStr));
        logger.trace("Access End <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

        res.type(contentType).status(code).json(data);
    }
};
module.exports = StringUtils;