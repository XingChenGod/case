Object.prototype[Symbol.iterator] = function () {
    const self = this;
    let index = 0;
    const keys = Object.getOwnPropertyNames(self);
    return {
        next() {
            if (index <= keys.length) {
                return {
                    value: self[keys[index++]],
                    done: false
                }
            } else {
                return {
                    value: undefined,
                    done: true
                }
            }
        }
    };
};


const obj = {
    a: 1,
    b: 2,
    c: 3
};

for (let val of obj) {
    console.log(val);
}
