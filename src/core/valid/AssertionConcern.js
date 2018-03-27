/**
 * 检查参数是否完整
 * @author simon
 * @create 2018-03-21 下午1:48
 **/

require("../utils/StringUtils");
var ErrorCode = require("../valid/ErrorCode");
var ApiException = require("../exception/ApiException");

function Validate() {
}

Validate.prototype.checkParam1 = function (expression, code, msg) {
    if (!code || !msg) {
        throw new ApiException(ErrorCode.HttpCode.Error400.code, ErrorCode.HttpCode.Error400.msg, "参数为空");
    }
    if (expression == null || expression === undefined) {
        throw new ApiException(code, msg, "参数为空或格式不对");
    }
};

Validate.prototype.checkParam2 = function (expression, httpCode) {
    if (!(httpCode.hasOwnProperty("code") && httpCode.hasOwnProperty("msg"))) {
        throw new ApiException(ErrorCode.HttpCode.Error400.code, ErrorCode.HttpCode.Error400.msg, "参数为空");
    }
    if (expression == null || expression === undefined) {
        throw new ApiException(httpCode.code, httpCode.msg, "参数为空或格式不对");
    }
};

Validate.prototype.checkParam3 = function (expression) {
    this.checkParam2(expression, ErrorCode.HttpCode.Error400);
};

// 测试
// var v = new Validate();
// v.checkParam2(true, ErrorCode.HttpCode.Error400);

module.exports = new Validate();