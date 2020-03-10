function edit(str1, str2) {
    let m = str1.length;
    let n = str2.length;
    let C = new Array(m + 1);
    for(let i = 0; i < C.length; i++) {
        C[i] = new Array(n+1)
    }
    
    for(let i = 0; i <= m; i++) {
        for(let j = 0; j <= n; j++) {
            if (i == 0) {
                C[i][j] = j;
            } else if (j==0) {
                C[i][j] = i;
            } else if (str1[i - 1] == str2[j - 1]) {
                C[i][j] = C[i-1][j-1]
            } else {
                C[i][j] = 1 + min(C[i][j-1], C[i-1][j], C[i-1][j-1])
            }

            for (let a = 0; a < C.length; a++) {
                for(let b =0; b < C.length; b++) {
                    
                }
            }
        }
    }

    for(let i = m; i>0; i--) {
        for(let j =n; j>0;j--) {
            switch(minIndex(C[i][j-1], C[i-1][j], C[i-1][j-1])) {
                case 0:
                    console.log("Insert")
                    break;
                case 1:
                    console.log("Delete")
                    break;
                case 2:
                    console.log("Substitute")
                    break;
                default:
                    console.log("unkown")
            }
        }
    }

    return C[m][n]
}

function min(a, b, c) {
    if( a <= b && a <= c) {
        return a;
    }
    if ( b <= a && b <= c) {
        return b;
    }
    return c;
}

function minIndex(a, b, c) {
    if( a <= b && a <= c) {
        return 0;
    }
    if ( b <= a && b <= c) {
        return 1;
    }
    return 2;
}

edit("sun", "sin")