#include <stdio.h>
#include <fstream>
#include <iostream>
#include <string>
#include <cmath>
#include <vector>
#include <functional>

using namespace std;

double eq = 0.01; // cm to m
double beta = 0.25;
double t = 0;
double m = 100;
double c = 0;
double k = 0;
double tTotal = 5;
double dtTotal = 0.01;
double dis1 = 0;
double vel1 = 0;
double acc1 = 0;
double dis2 = 0;
double vel2 = 0;
double acc2 = 0;
double maxA = 0;
double maxV = 0;
double maxD = 0;
vector<double> acc0;
vector<double> f;
vector<double> accMax;
vector<double> velMax;
vector<double> disMax;
vector<double> period;
