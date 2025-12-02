#include <stdio.h>

int partition(int arr[20], int st, int end) {
    int temp;
    int pivot = arr[st];  // Pivot is the first element in the range
    int i = st - 1;  // Index for the smaller element
    
    for (int j = st; j < end; j++) {
        if (arr[j] <= pivot) {
            i++;
            // Swap arr[i] and arr[j]
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    // Swap the pivot element with the element at i + 1
    temp = arr[i + 1];
    arr[i + 1] = arr[st];
    arr[st] = temp;

    return i + 1;  // Return the index of the pivot after partitioning
}

void Quicksort(int arr[20], int st, int end) {
    if (st < end) {
        int loc = partition(arr, st, end);  // Partition index
        Quicksort(arr, st, loc - 1);  // Recursively sort the left subarray
        Quicksort(arr, loc + 1, end);  // Recursively sort the right subarray
    }
}

int main() {
    int arr[20], n;
    printf("Enter the size of the array: ");
    scanf("%d", &n);
    
    printf("Enter the elements of the array: ");
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    // Call Quicksort to sort the entire array
    Quicksort(arr, 0, n - 1);
    
    // Print the sorted array
    printf("Sorted array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    return 0;
}
