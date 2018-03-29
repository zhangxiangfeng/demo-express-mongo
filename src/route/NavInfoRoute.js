/**
 *
 * @author simon
 * @create 2018-03-27 上午10:25
 **/

"use strict";

//全局变量
let logger;
let local = "[NavInfoRoute]";

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
let LOGGER = require("../Setting").Log4js;
const StringUtils = require("../core/utils/StringUtils");
//<<<<<<<<<<<<<<<<<<<<<<<<depend self>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>
const NavInfo = require('../model/NavInfo');
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<model>>>>>>>>>>>>>>>>>>>>>>>>>

let NavInfoRoute = {
    //首页处理
    index: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        let page = parseInt(req.query.p) || 1;
        // var result = NavInfoService.list(new NavInfo(), rid, page);

        logger.trace("NavInfoRoute.index");

        //sept 1.查询列表
        NavInfo.list(page, function (err, navInfos, total) {
            let result = {
                navInfos: navInfos,
                total: total
            };
            StringUtils.send(rid, res, result);
        });
    },
    //存储
    save: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);
        let navInfo = new NavInfo(req.body);

        //sept 1.保存
        navInfo.save(function (navInfo) {
            StringUtils.send(rid, res, navInfo);
        });
    }
};

module.exports = NavInfoRoute;