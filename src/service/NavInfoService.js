/**
 *
 * @author simon
 * @create 2018-03-27 上午10:01
 **/

"use strict";

//全局变量
var logger;
var local = "[NavInfoService]";


//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var LOGGER = require("../Setting").Log4js;
require("../core/utils/StringUtils");
require('../model/NavInfo');
//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>


var navInfoService = {
    list: function (navInfo, rid, page) {
        logger = LOGGER.getLogger(rid + " " + local);

        logger.trace("navInfo.list(navInfo:{0},rid)".format(navInfo.toString()));

        //sept 1.查询列表
        navInfo.list(page, function (err, navInfos, total) {
            return {
                navInfos: navInfos,
                total: total
            };
        });
    }
};

module.exports = navInfoService;