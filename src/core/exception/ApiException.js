/**
 * 自定义Api异常类
 * @author simon
 * @create 2018-03-21 下午2:26
 **/

"use strict";


function ApiException(code, msg, reason) {
    this.name = "ApiException";
    this.code = code || 500;
    this.msg = msg || "Default Message";
    this.reason = reason || "Default Reason";
    this.stack = (new Error()).stack;
}

function ApiException(httpCode) {
    this.name = "ApiException";
    this.code = httpCode.code || 500;
    this.msg = httpCode.msg || "Default Message";
    this.reason = httpCode.reason || "Default Reason";
    this.stack = (new Error()).stack;
}

ApiException.prototype = Object.create(Error.prototype);
ApiException.prototype.constructor = ApiException;

// 测试
// try {
//     throw new ApiException(400,"1111","22222");
// } catch (e) {
//     console.log(e.name);     // ApiException
//     console.log(e.msg);      // 1111
//     console.log(e.reason);   // 22222
//     console.log(e.stack);    // 错误堆栈
// }

module.exports = ApiException;