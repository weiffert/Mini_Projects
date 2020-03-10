function minmax(arr, left, right) {
	console.log(`left: ${left}, right: ${right}`);
	if (right - left + 1 == 2) {
		if (arr[left] < arr[right]) {
			return { min: arr[left], max: arr[right] };
		}
		return { min: arr[right], max: arr[left] };
	}
	let res1 = minmax(arr, left, left + Math.ceil((right - left) / 2));
	let res2 = minmax(arr, left + Math.floor((right - left) / 2), right);
	return {
		min: res1.min < res2.min ? res1.min : res2.min,
		max: res1.max > res2.max ? res1.max : res2.max,
	};
}
