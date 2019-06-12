arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function randomArr(arr) {
    let newArr = arr.map(item => ({'val': item, 'ram': Math.random()}))
    newArr.sort((a, b) => a.ram - b.ram);
    arr.splice(0, arr.length, ...newArr.map(i => i.val));
    return arr;
}

console.log(randomArr(arr));


