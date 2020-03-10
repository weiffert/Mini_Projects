/******************************************************************************

                            Online C Compiler.
                Code, Compile, Run and Debug C program online.
Write your code in this editor and press "Run" button to compile and execute it.

*******************************************************************************/

#include <stdio.h>
#include <math.h>

int bit(int A) {
    return (int) ceil(log(A+1) / log(2));
}

int divide(int A, int B) {
    int ans = 0;
    int oldA = A;
    while (A >= B) {
        int a = bit(A);
        int b = bit(B);
        printf("a: %d, b: %d\t", a, b);
        if (A >= B << (a-b)) {
            A = A - (B << (a-b));
            ans = ans | (1 << (a-b));
        } else {
            A = A - (B << (a-b-1));
            ans = ans | (1 << (a-b-1));
        }
    }
    printf("\n%d / %d = Q: %d, R: %d\n", oldA, B, ans, A);
    printf("%d / %d = Q: %d, R: %d\n", oldA, B, oldA / B, oldA % B);
    return ans;
}

int main()
{
    divide(16, 3);
    divide(27, 3);
    divide(51, 5);
    divide(17, 6);
}
