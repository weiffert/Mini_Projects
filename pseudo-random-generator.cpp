int getNum(char x, char y)
{
    int num = x;
    num << 8;
    num += y;
    return num;
}
void parseNum(int num, char *x) {
    for (int i = 0; i < 4; i++) {
        x[3 - i] = (num >> 8 * i) & 0xFF;
    }
}
char * oneWayFunction(char *x, int length)
{
    for (int i = 0; i < length; i += 4)
    {
        // divide x into k groups of 2n bits.
        // divide 2n bits into n bits.
        int num1 = getNum(x[i], x[i+1]);
        int num2 = getNum(x[i+2], x[i+3]);
        // multiply numbers.
        num1 *= num2;
        // concatenate (zero pad too)
        parseNum(num1, x + i);
    }
    return x;
}
char crossProduct(char *n, char *r, int length)
{
    char res = 0;
    for (int i = 0; i < length; i++) {
        char one = n[i];
        char two = r[i];
        for (int bit = 0; bit < 8; i++) {
            char b1 = (one >> bit) & 1;
            char b2 = (two >> bit) & 1;
            res = res ^ (b1 & b2);
        }
    }
    return res;
}

class PRG
{
private:
    char *n;
    char *r;
    int length;

public:
    PRG::PRG(char *x, char *y, int l)
    {
        n = x;
        r = y;
        length = l;
    }
    PRG::~PRG()
    {
    }

    char getBit()
    {
        char ret = crossProduct(n, r, length);
        r = oneWayFunction(r, length);
        return ret;
    }
};