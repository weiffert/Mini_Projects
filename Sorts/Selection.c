void selectionSort(int len, int *arr) {
  for(int i = 0; i < len; i++) {
    int min;
    for(int j = i; j < len; j++) {
      if(arr[i] < arr[min])
        min = i;
    }
    int temp = arr[min];
    arr[min] = arr[i];
    arr[i] = temp;
  }
}

int main() {
  
}