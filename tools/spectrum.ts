const EQ = 0.01; // cm to m
const BETA = 1 / 4;
const M = 100;
const T_TOTAL = 3;

export function spectrum(acceleration: number[], h: number, dt = 0.02, dtPrecision = 0.1) {
  const acc0 = acceleration.map(a => EQ * a);
  const f = acc0.map(a => -M * a);
  let accMax: number[] = [];
  let velMax: number[] = [];
  let disMax: number[] = [];
  let period: number[] = [];

  for (let i = 1; i <= T_TOTAL / dtPrecision; i++) {
    let dis1 = 0;
    let vel1 = 0;
    let acc1 = 0;
    let acc: number[] = [];
    let vel: number[] = [];
    let dis: number[] = [];
    const t = dtPrecision * i;
    const k = 4 * Math.PI ** 2 * M / t ** 2;
    const c = 2 * h * Math.sqrt(k * M);

    for (let j = 0; j < acc0.length; j++) {
      const acc2 = (f[j] - c * (vel1 + 0.5 * dt * acc1) - k * (dis1 + dt * vel1 + (0.5 - BETA) * dt * dt * acc1)) / (M + c * 0.5 * dt + k * BETA * dt * dt);
      const vel2 = vel1 + 0.5 * dt * (acc1 + acc2);
      const dis2 = dis1 + dt * vel1 + (0.5 - BETA) * dt * dt * acc1 + BETA * dt * dt * acc2;

      acc = acc.concat(acc2 + acc0[j]);
      vel = vel.concat(vel2);
      dis = dis.concat(dis2);

      acc1 = acc2;
      vel1 = vel2;
      dis1 = dis2;
    }

    period = period.concat(t);
    accMax = accMax.concat(Math.max(...acc.map(a => Math.abs(a))));
    velMax = velMax.concat(Math.max(...vel.map(v => Math.abs(v))));
    disMax = disMax.concat(Math.max(...dis.map(d => Math.abs(d))));
  }

  return [period, accMax, velMax, disMax];
}
