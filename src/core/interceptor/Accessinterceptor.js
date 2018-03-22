/**
 * 权限访问拦截
 * @author simon
 * @create 2018-03-21 下午7:05
 **/

"use strict";

var local = "[Accessinterceptor]";
var Logger = require("../../Setting").Log4js;
var StringUtils = require("../utils/StringUtils");
const extend = require('extend');

require("../utils/StringUtils");

module.exports = function (app, rid, req, res, next) {
    //当前请求,分配uuid
    var logger = Logger.getLogger(rid + " " + local);


    logger.trace("Access Into >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    var method = req.method;
    var url = req.originalUrl;
    logger.trace("current access uri: <{0}> {1}".format(method, url));


    var req_body = JSON.stringify(req.body);
    if (!req_body.hasOwnProperty()) {
        logger.trace("current query body:");
    } else {
        logger.trace("current query body: {0}".format(req_body));
    }


    var req_cookies = JSON.stringify(req.cookies);
    logger.trace("current access cookies: {0}".format(req_cookies.toString()));

    var req_headers = JSON.stringify(req.headers);
    logger.trace("current access headers: {0}".format(req_headers.toString()));

    // res.cookie('Access-Token', rid, {maxAge: 10 * 1000, path: '/', httpOnly: true, secure: false});
    //
    // var test = {
    //     name: "simon",
    //     age: 18
    // };
    //
    // var headers = {};
    // // headers["Content-Type"] = "application/json";
    // headers["Content-Length"] = test.length;
    // headers["Rid"] = rid;
    //
    // // 自定义的headers+原headers
    // headers = extend({}, headers, res.headers);
    //
    // // res.writeHead(502,"Bad Gateway",res.headers);  // 支付定义code 信息,必须是英文!!
    // // res.writeHead(200, headers);
    //
    // // res.write(JSON.stringify(test), "utf8");
    //
    // res.type("application/json").status(200).send(JSON.stringify(test));
    //
    // res.end();
    next();
};



