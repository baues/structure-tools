#define _USE_MATH_DEFINES
#include <stdio.h>
#include <fstream>
#include <iostream>
#include <string>
#include <cmath>
#include <vector>

using namespace std;

double eq = 0.01; // cm to m
double beta = 0.25;
double t = 0;
double m = 100;
double c = 0;
double k = 0;
double t_total = 5;
double dt_total = 0.01;
double dis1 = 0;
double vel1 = 0;
double acc1 = 0;
double dis2 = 0;
double vel2 = 0;
double acc2 = 0;
double max_acc = 0;
double max_vel = 0;
double max_dis = 0;
vector<double> acc0;
vector<double> f;
vector<double> max_acc_vector;
vector<double> max_vel_vector;
vector<double> max_dis_vector;
vector<double> period;
