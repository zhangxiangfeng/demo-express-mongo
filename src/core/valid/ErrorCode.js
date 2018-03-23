/**
 * 错误代码列表
 * @author simon
 * @create 2018-03-21 下午1:57
 **/

ErrorCode = {};

ErrorCode.HttpCode = {
    Error400: {
        code: 400,
        msg: "[Bad Request] - 请求参数不合法"
    },
    Error401: {
        code: 401,
        msg: "[Unauthorized] - 当前请求未通过授权"
    },
    Error403: {
        code: 403,
        msg: "[Forbidden] - 服务器拒绝执行该请求"
    },
    Error404: {
        code: 404,
        msg: "[Not Found] - 资源未找到"
    },
    Error500: {
        code: 500,
        msg: "[Http Server Error] - 由于服务端业务处理错误.导致无法完成本次请求"
    },
    Error503: {
        code: 503,
        msg: "[Overload] - 由于临时的服务器维护或者过载, 服务器当前无法处理请求"
    }
};

module.exports = ErrorCode;