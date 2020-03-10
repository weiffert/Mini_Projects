let a = 2, b = 0, c = 19;
let d = 3, e = 14, f = 6;
let sum = 0;
let count = 0;

for(let i = 0; i < 26; i++) {
    let ta = (a + i) % 26;
    for(let j = 0; j < 26; j++) {
        let tb = (b + j) % 26;
        for (let k = 0; k < 26; k++) {
            sum++;
            let tc = (c + k) % 26;
            if (ta == d && tb == e && tc == f) {
                count++;
            }
        }
    }
}

console.log(count)
console.log(sum)