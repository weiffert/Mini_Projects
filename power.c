#include <stdio.h>

int times = 0;

long power(int base, int exponent)
{
    long result = 1;
    printf("%d: %d\n", ++times, exponent);
    if (exponent == 0) {
        return 1;
    } else if (exponent % 2 == 0)
    {
        // a^n = a^(n/2) * a^(n/2)
        result = power(base, exponent / 2);
        result = result * result;
    } else {
        // a^n = a^(Floor(n/2)) * a^(Floor(n/2)) * a
        result = power(base, exponent / 2);
        result = result * result * base;
    }
    return result;
}

int main() {
    int base, exp;
    scanf("%d%d", &base, &exp);
    printf("%ld\n", power(base, exp));
    return 0;
}