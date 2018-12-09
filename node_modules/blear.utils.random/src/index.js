'use strict';

var access = require('blear.utils.access');
var number = require('blear.utils.number');
var string = require('blear.utils.string');
var typeis = require('blear.utils.typeis');

var regExist = /[aA0]/g;
var dictionaryMap = {
    a: 'abcdefghijklmnopqrstuvwxyz',
    A: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    0: '0123456789'
};
var lastTimestamp = 0;
var safeNo = 0;

var STRING_LENGTH = exports.STRING_LENGTH = 6;


/**
 * 随机数字
 * @param [min=0] {Number} 最小值，默认0
 * @param [max=0] {Number} 最大值，默认0
 * @returns {Number}
 *
 * @example
 * random.number(1, 3);
 * // => 1 or 2 or 3
 */
exports.number = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};


/**
 * 随机字符串
 * @param [length=6] {Number} 随机字符串长度
 * @param [dictionary='aA0'] {String} 字典
 *
 * @example
 * // 字典对应关系
 * // a => a-z
 * // A => A-Z
 * // 0 => 0-9
 * // 其他字符
 * random.string(6, 'a');
 * // => abcdef
 * random.string(6, '!@#$%^&*()_+');
 * // => @*)&(^
 */
exports.string = function (length, dictionary) {
    var ret = '';
    var pool = '';
    var max;
    var args = access.args(arguments);

    // random.string('^&')
    if (args.length === 1 && typeis.String(args[0])) {
        dictionary = args[0];
        length = STRING_LENGTH;
    }

    length = Math.max(number.parseInt(length, STRING_LENGTH), 0);
    dictionary = String(dictionary || 'a');

    if (dictionary.indexOf('a') > -1) {
        pool += dictionaryMap.a;
    }

    if (dictionary.indexOf('A') > -1) {
        pool += dictionaryMap.A;
    }

    if (dictionary.indexOf('0') > -1) {
        pool += dictionaryMap[0];
    }

    pool += dictionary.replace(regExist, '');
    max = pool.length - 1;

    while (length--) {
        ret += pool[exports.number(0, max)];
    }

    return ret;
};


/**
 * 随机16进制颜色值
 * @returns {string}
 *
 * @example
 * random.hexColor()
 * => '#ff00ff'
 */
exports.hexColor = function () {
    return '#' + Math.random().toString(16).slice(-6);
};


/**
 * 左填充 0
 * @param str
 * @param [maxLength]
 * @returns {String}
 */
var padStartWithZero = function (str, maxLength) {
    maxLength = maxLength || 2;
    return string.padStart(str, maxLength, '0');
};


/**
 * 最短 16 位长度的随机不重复字符串
 * @param [timeStamp=false] 是否时间戳形式
 * @param [maxLength=21] 最大长度，不能小于 21
 * @returns {String}
 */
exports.guid = function (timeStamp, maxLength) {
    var a = [];
    var d = new Date();
    var ret = '';
    var now = d.getTime();
    var args = access.args(arguments);
    var suffix = '';
    // 安全后缀长度，按 1 毫秒运算 900 万次 JS 代码来进行估算
    // 那么，安全后缀的长度为 4
    // 时间模式长度为 14，日期模式长度为 17，
    // 取最长 17 + 4 = 21
    var minLength = 21;

    switch (args.length) {
        case 0:
            timeStamp = false;
            maxLength = 0;
            break;

        case 1:
            // guid(timeStamp);
            if (typeis.Boolean(args[0])) {
                maxLength = 0;
            }
            // guid(maxLength);
            else {
                timeStamp = false;
                maxLength = args[0];
            }
            break;
    }

    maxLength = Math.max(maxLength, minLength);

    if (now !== lastTimestamp) {
        lastTimestamp = now;
        safeNo = 0;
    }

    if (timeStamp) {
        ret = String(now);
        suffix = number.to62(safeNo);
        ret += padStartWithZero(suffix, maxLength - ret.length);
    } else {
        // 4
        var Y = padStartWithZero(d.getFullYear(), 4);
        // 2
        var M = padStartWithZero(d.getMonth() + 1, 2);
        // 2
        var D = padStartWithZero(d.getDate());
        // 2
        var H = padStartWithZero(d.getHours());
        // 2
        var I = padStartWithZero(d.getMinutes());
        // 2
        var S = padStartWithZero(d.getSeconds());
        // 3
        var C = padStartWithZero(d.getMilliseconds(), 3, '0');
        //// 9
        //var N = padStartWithZero(process.hrtime()[1], 9, '0');

        a.push(Y);
        a.push(M);
        a.push(D);
        a.push(H);
        a.push(I);
        a.push(S);
        a.push(C);

        ret = a.join('');
        suffix = number.to62(safeNo);
        ret += padStartWithZero(suffix, maxLength - ret.length);
    }

    safeNo++;
    return ret;
};