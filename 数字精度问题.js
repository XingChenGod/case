// 判断是否为 整数
function isInteger(num) {
    return Math.floor(num) === num;
}

// 转为整数处理
function toInteger(floatNum) {
    const ret = {times: 1, num: 0};
    const isNegative = floatNum < 0;
    if (isInteger(floatNum)) {
        ret.num = floatNum;
        return ret;
    }
    const strfi = floatNum + '';
    const dotPos = strfi.indexOf(strfi);
    const len = strfi.substr(dotPos + 1).length;
    const times = Math.pow(10, len);
    let intNum = parseInt(Math.abs(floatNum), 10);
    ret.times = times;
    if (isNegative) {
        intNum = -intNum;
    }
    ret.num = intNum;
    return ret;
}

/*
* @param a {number} 运算数1
* @param b {number} 运算数2
* @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
* @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
*/
function operation(a, b, digits, op) {
    const o1 = toInteger(a),
          o2 = toInteger(b),
          n1 = o1.num,
          n2 = o2.num,
          t1 = o1.times,
          t2 = o2.times,
          max = t1 > t2 ? t1 : t2;
    let result = null;
    switch (op) {
        case 'add':
            if (t1 === t2) { // 两数小数位相等
                result = n1 + n2;
            } else if (t1 > t2) { // o1 小数位大于 o2
                result = n1 + n2 * (t1 / t2);
            } else { // o1 小数位小于 o2
                result = n1 * (t2 / t1) + n2;
            }
            return result / max;
        case 'subtract':
            if (t1 === t2) {
                result = n1 - n2;
            } else if (t1 > t2) {
                result = n1 - n2 * (t1 / t2);
            } else {
                result = n1 * (t2 / t1) - n2;
            }
            return result / max;
        case 'multiply':
            result = (n1 * n2) / (t1 * t2);
            return result;
        case 'divide':
            result = (n1 / n2) * (t2 / t1);
            return result;
    }
}

function add(a, b, digits) {
    return operation(a, b, digits, 'add');
}

function subtract(a, b, digits) {
    return operation(a, b, digits, 'subtract');
}

function multiply(a, b, digits) {
    return operation(a, b, digits, 'multiply');
}

function divide(a, b, digits) {
    return operation(a, b, digits, 'divide');
}


// toFixed修复
function toFixed(num, s) {
    const times = Math.pow(10, s);
    let des = num * times + 0.5;
    des = parseInt(des, 10) / times;
    return des + '';
}
