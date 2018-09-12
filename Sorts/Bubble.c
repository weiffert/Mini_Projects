void bubbleSort(int len, int *arr) {
	for(int i = 0; i < len; i++) {
		for(int j = i; j < len; j++) {
			if(arr[i] > arr[j]) {
				int temp = arr[i];
				arr[i] = arr[j];
				arr[j] = temp;
			}
		}
	}
}

int main() {

}
