function nth_smallest(arr1, minL, maxL, arr2, minR, maxR) {
	console.log(`minL: ${minL}, maxL: ${maxL}`);
	console.log(`minR: ${minR}, maxR: ${maxR}`);
	if (maxL - minL == 0) {
		if (arr1[minL] < arr2[minR]) {
			return arr1[minL];
		} else {
			return arr2[minR];
		}
	}
	let left = minL + Math.floor((maxL - minL) / 2);
	let right = minR + Math.floor((maxR - minR) / 2);
	console.log(`left: ${left}, ${arr1[left]}`);
	console.log(`right: ${right}, ${arr2[right]}`);
	if (arr1[left] > arr2[right]) {
		return nth_smallest(arr1, minL, left, arr2, right + 1, maxR);
	} else if (arr1[left] < arr2[right]) {
		return nth_smallest(arr1, left + 1, maxL, arr2, minR, right);
	} else {
		return arr1[left];
	}
}

function hoist(arr1, arr2) {
	return nth_smallest(arr1, 0, arr1.length - 1, arr2, 0, arr2.length - 1);
}
let arr1 = [1];
let arr2 = [2];
console.log(hoist(arr1, arr2));
arr1 = [1, 3];
arr2 = [2, 4];
console.log(hoist(arr1, arr2));
arr1 = [1, 3, 5, 7];
arr2 = [2, 4, 6, 8];
console.log(hoist(arr1, arr2));
arr1 = [1, 4, 7, 9];
arr2 = [2, 3, 5, 6];
console.log(hoist(arr1, arr2));
arr1 = [1, 6, 7, 9];
arr2 = [2, 3, 4, 5];
console.log(hoist(arr1, arr2));
arr1 = [5, 6, 7, 8];
arr2 = [1, 2, 3, 4];
console.log(hoist(arr1, arr2));
arr1 = [3, 6, 7, 8];
arr2 = [1, 2, 4, 5];
console.log(hoist(arr1, arr2));
arr1 = [4, 6, 7, 8];
arr2 = [1, 2, 3, 5];
console.log(hoist(arr1, arr2));
