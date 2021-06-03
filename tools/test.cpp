#include <stdio.h>
#include <vector>
#include <stdlib.h>

using namespace std;

extern "C"
{
    double *test(double *buf, int bufSize)
    {

        double values[bufSize];

        for (int i = 0; i < bufSize; i++)
        {
            values[i] = buf[i] * 2;
        }

        double* arrayPtr = &values[0];
        return arrayPtr;
    }
}
