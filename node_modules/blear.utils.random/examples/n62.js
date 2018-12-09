/**
 * 文件描述
 * @author ydr.me
 * @create 2018-06-05 15:50
 * @update 2018-06-05 15:50
 */


'use strict';

var number = require('blear.utils.number');
var startTime = Date.now();
var times = 0;

// while (Date.now() === startTime) {
//     times++;
// }
//
// console.log('1 毫秒运算 %d 次', times);

times = 9990000;
console.log(number.to62(times));


