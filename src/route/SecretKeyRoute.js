/**
 * 加解密
 * @author simon
 * @create 2018-06-05 上午11:12
 **/

"use strict";

let logger;
const local = "[SecretKeyRoute]";
//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// https://github.com/travist/jsencrypt,利用openssl,ｇｅｎ出来私钥和公钥
let JSEncrypt = require("jsencrypt").default;

//<<<<<<<<<<<<<<<<<<<<<<<<depend 3rd >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<depend self >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
let LOGGER = require("../Setting").Log4js;

const StringUtils = require("../core/utils/StringUtils");
const Constant = require("../core/utils/Constant");
const ErrorCode = require("../core/valid/ErrorCode");

//<<<<<<<<<<<<<<<<<<<<<<<<depend self >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<     model >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//<<<<<<<<<<<<<<<<<<<<<<<<     model >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

let SecretKeyRoute = {

    /**
     * 加密处理
     * */
    encode: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        let origin = req.body.origin;
        let pubKey = req.body.pubKey;

        if (!origin || origin === '') {
            StringUtils.errorSend(rid, ErrorCode.HttpCode.Error400.code, res, ErrorCode.HttpCode.Error400);
        }

        if (!pubKey || pubKey === '') {
            StringUtils.errorSend(rid, ErrorCode.HttpCode.Error400.code, res, ErrorCode.HttpCode.Error400);
        }

        let encrypt = new JSEncrypt();
        encrypt.setPublicKey(pubKey);
        let encrypted = encrypt.encrypt(origin);

        let data = {
            "result": encrypted
        };
        StringUtils.send(rid, res, data, Constant.ContentType.ApplicationJson);
    },
    /**
     * 解密处理
     * */
    decode: function (req, res, next, rid) {
        logger = LOGGER.getLogger(rid + " " + local);

        let prikey = req.body.priKey;
        let encrypt = req.body.encrypt;

        let decrypt = new JSEncrypt();
        decrypt.setPrivateKey(prikey);
        let unencrypt = decrypt.decrypt(encrypt);

        let data = {
            "result": unencrypt
        };

        StringUtils.send(rid, res, data, Constant.ContentType.ApplicationJson);
    }
};

module.exports = SecretKeyRoute;

