/**
 *
 * 字符串处理工具
 * @author simon
 * @create 2018-03-21 下午2:04
 **/

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