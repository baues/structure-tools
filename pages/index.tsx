import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Line } from 'react-chartjs-2';
import { spectrum } from 'tools/spectrum';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    acc: {
      maxHeight: 300,
      overflow: "auto",
    },
  }),
);

const baseData = {
  datasets: [
    {
      label: '# of Votes',
      data: [],
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
    },
  ],
};

const options = {
  scales: {
    xAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

export default function Index() {
  const classes = useStyles();
  const [h, setH] = useState(0.03);
  const [f, setF] = useState(100);
  const [acc, setAcc] = useState<number[]>([]);
  const [data, setData] = useState(baseData);

  const fileInput = useRef(null);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    const objectURL = URL.createObjectURL(file);
    let dataList: any[] = [];
    d3.csv(objectURL, async (row) => {
      dataList = dataList.concat(...Object.values(row).map(v => Number(v)));
    }).then(() => {
      console.log("data", dataList);
      if (dataList.some(isNaN)) {
        window.alert("数字のみのデータをインプットしてください")
      } else {
        setAcc(dataList);
      }
    });
  }

  const handleSubmit = () => {
    console.log(h, f, acc);
    const [period, accMax, velMax, disMax] = spectrum(acc, h, 1 / f);
    console.log(period, accMax);
  };

  useEffect(() => {
    setData({
      datasets: [
        {
          label: '# of Votes',
          data: acc,
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
        },
      ],
    });
  }, [acc]);

  return (
    <>
      <Container maxWidth="md">
        <form onSubmit={handleSubmit} className={classes.root} autoComplete="off">
          <TextField id="damping-ratio" label="減衰定数" type="number" required value={h} onChange={(e) => setH(Number(e.target.value))} />
          <TextField id="sampling-freq" label="サンプル振動数" type="number" required value={f} onChange={(e) => setF(Number(e.target.value))} />
          <Button
            variant="outlined"
            component="label"
            onClick={e => fileInput.current && fileInput.current.click()}
          >
            加速度データをアップロード
            <input
              type="file"
              accept=".csv"
              hidden
              required
              onChange={handleFileInput}
            />
          </Button>
          <Button type="submit" variant="contained">計算</Button>
        </form>
        <Typography>入力加速度</Typography>
        <Paper className={classes.acc}>
          {acc.map((v, i) => {
            return <div key={i}>{i + 1}: {v}</div>;
          })}
        </Paper>
        {acc.length > 0 && <Line type="line" data={data} options={options} />}
      </Container>
    </>
  );
}
