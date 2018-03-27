/**
 *
 * @author simon
 * @create 2018-03-27 上午10:25
 **/

"use strict";

//全局变量
var logger;
var local = "[NavInfoRoute]";

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var LOGGER = require("../Setting").Log4js;
const StringUtils = require("../core/utils/StringUtils");
//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>
const NavInfoService = require('../service/NavInfoService');
const NavInfo = require('../model/NavInfo');
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>

let NavInfoRoute = {
    //首页处理
    index: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        let page = parseInt(req.query.p) || 1;
        return NavInfoService.list(new NavInfo(), rid, page);
    },
    //存储
    save: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);
        let navInfo = new NavInfo(req.body);
        var result = NavInfoService.save(navInfo, rid);

        StringUtils.send(rid, res, result || {
            msg: "Ok",
            code: 200
        });
    }
};

module.exports = NavInfoRoute;