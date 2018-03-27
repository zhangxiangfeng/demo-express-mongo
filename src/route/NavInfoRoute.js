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
//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>
const NavInfoService = require('../service/NavInfoService');
const NavInfo = require('../model/NavInfo');
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>

var NavInfoRoute = {
    //首页处理
    index: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        var page = parseInt(req.query.p) || 1;
        return NavInfoService.list(new NavInfo(), rid, page);
    }
};

module.exports = NavInfoRoute;