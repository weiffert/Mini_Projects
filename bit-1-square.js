function bitSquare(matrix) {
    let cpy = matrix;
    let max = 0;
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            if(matrix[i][j] != 0) {
                let top = 0, left = 0, corner = 0;
                if(i > 0) {
                    top = matrix[i-1][j];
                }
                if(j > 0) {
                    left = matrix[i][j-1];
                }
                if(i > 0 && j > 0) {
                    corner = matrix[i-1][j-1];
                }
                let min = 0;
                if (top <= left && top <= corner) {
                    min = top;
                }
                else if (left <= top && left <= corner) {
                    min = left;
                }
                else {
                    min = corner;
                } 
                cpy[i][j] = min + 1;
                if(max < min + 1)
                    max = min + 1;
            }
        }
    }
    console.log(cpy)
    return max;
}

bitSquare([
    [0,1,1,1,1,0],
    [1,1,1,1,1,1],
    [1,1,0,1,1,1],
    [0,1,1,1,1,1],
    [1,1,1,1,1,1],
])