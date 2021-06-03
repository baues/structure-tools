#include "spectrum.h"

vector<double> readFile(string motionDir)
{
    ifstream inputData;
    inputData.open(motionDir);

    vector<double> data;
    double col1;

    if (inputData.fail())
    {
        cerr << "Error in opening the input file" << endl;
        return data;
    }
    else
    {
        while (!inputData.eof())
        {
            inputData >> col1;
            data.push_back(col1);
        }
        inputData.close();

        return data;
    }
}

double h = 0.05;
double dt = 0.02;

vector<vector<double> > spectrum()
{
    vector<double> acceleration = readFile("test.txt");

    for (int i = 0; i < acceleration.size(); i++)
    {
        double a0 = acceleration[i] * eq;
        acc0.push_back(a0);
        f.push_back(-m * a0);
    }

    for (int i = 1; i <= tTotal / dtTotal; i++)
    {
        acc1 = 0;
        vel1 = 0;
        dis1 = 0;
        maxA = 0;
        maxV = 0;
        maxD = 0;
        vector<double> acc;
        vector<double> vel;
        vector<double> dis;
        t = 0.01 * i;
        k = 4 * pow(M_PI, 2) * m / pow(t, 2);
        c = 2 * h * sqrt(k * m);

        for (int j = 0; j < acc0.size(); j++)
        {
            acc2 = (f[j] - c * (vel1 + 0.5 * dt * acc1) - k * (dis1 + dt * vel1 + (0.5 - beta) * dt * dt * acc1)) / (m + c * 0.5 * dt + k * beta * dt * dt);
            vel2 = vel1 + 0.5 * dt * (acc1 + acc2);
            dis2 = dis1 + dt * vel1 + (0.5 - beta) * dt * dt * acc1 + beta * dt * dt * acc2;

            acc.push_back(acc2 + acc0[j]);
            vel.push_back(vel2);
            dis.push_back(dis2);

            acc1 = acc2;
            vel1 = vel2;
            dis1 = dis2;
        }

        for (int j = 0; j < acc.size(); j++)
        {
            maxA = max(maxA, abs(acc[j]));
            maxV = max(maxV, abs(vel[j]));
            maxD = max(maxD, abs(dis[j]));
        }

        period.push_back(t);
        accMax.push_back(maxA);
        velMax.push_back(maxV);
        disMax.push_back(maxD);
    }

    vector<vector<double> > returnParams;
    returnParams.push_back(period);
    returnParams.push_back(accMax);
    returnParams.push_back(velMax);
    returnParams.push_back(disMax);
    return returnParams;
}

int main(int argc, char **argv)
{
    vector<vector<double> > result = spectrum();
    for (int i = 0; i < result[0].size(); i++)
    {
        printf("%f %f\n", result[0][i], result[1][i]);
    }

    return 0;
}
