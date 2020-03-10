function matrix(dim) {
	let length = dim.length - 1;
	let m = [];
	for (let i = 0; i < length; i++) {
		m.push([]);
		for (let j = 0; j < length; j++) {
			m[i].push(null);
		}
	}
	for (let k = 0; k < length; k++) {
		for (let i = 0, j = k; j < length; i++, j++) {
			if (i == j) {
				m[i][j] = 0;
			} else {
				let tmp = null;
				for (let t = 0; t < k; t++) {
					tmp =
						m[i][i + t] +
						m[i + t + 1][j] +
						dim[i] * dim[i + t + 1] * dim[j + 1];
					if (tmp < m[i][j] || m[i][j] == null) {
						m[i][j] = tmp;
					}
				}
			}
		}
	}
	for (let i = 0; i < length; i++) {
		let str = '';
		for (let j = 0; j < length; j++) {
			str += `${m[i][j]} `;
		}
		console.log(str);
	}
	return m;
}

//matrix([30, 35, 15, 5, 10, 20, 25]);
matrix([8,3,2,19,18,7])
