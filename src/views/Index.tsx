import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Line } from 'react-chartjs-2';
import { spectrum } from 'tools/spectrum';
import LinkIconButton from 'src/components/LinkIconButton';

const DT_PRECISION = 0.05;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(2),
      },
    },
    form: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      height: 200,
      overflow: 'auto',
      padding: theme.spacing(1),
    },
    fab: {
      position: 'fixed',
      right: theme.spacing(2),
      bottom: theme.spacing(2),
    },
  }),
);

const createData = (label = '', data = [], labels = []) => {
  return {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: '#DC2626',
        borderColor: '#f77c7c',
      },
    ],
  };
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
  const [h, setH] = useState(0.05);
  const [f, setF] = useState(50);
  const [input, setInput] = useState<number[]>([]);
  const [period, setPeriod] = useState<number[]>([]);
  const [acc, setAcc] = useState<number[]>([]);
  const [vel, setVel] = useState<number[]>([]);
  const [dis, setDis] = useState<number[]>([]);
  const [inputData, setInputData] = useState(createData('Input Acceleration'));
  const [accData, setAccData] = useState(createData('Response Acceleration'));
  const [velData, setVelData] = useState(createData('Response Velocity'));
  const [disData, setDisData] = useState(createData('Response Displacement'));
  const [open, setOpen] = React.useState(false);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const fileInput = useRef(null);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    const objectURL = URL.createObjectURL(file);
    let dataList: any[] = [];
    d3.csv(objectURL, async (row) => {
      dataList = dataList.concat(...Object.values(row).map((v) => Number(v)));
    }).then(() => {
      if (dataList.some(isNaN)) {
        window.alert('数字のみのデータをインプットしてください');
      } else {
        setInput(dataList);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [period, accMax, velMax, disMax] = spectrum(input, h, 1 / f, DT_PRECISION);
    setPeriod(period.map((p) => Number(p.toFixed(1))));
    setAcc(accMax);
    setVel(velMax);
    setDis(disMax);
    setOpen(true);
  };

  useEffect(() => {
    setInputData(
      createData(
        'Input Acceleration',
        input,
        input.map((_, i) => (i / f).toFixed(1)),
      ),
    );
  }, [input, f]);

  useEffect(() => {
    setAccData(createData('Response Acceleration', acc, period));
  }, [acc, period]);

  useEffect(() => {
    setVelData(createData('Response Velocity', vel, period));
  }, [vel, period]);

  useEffect(() => {
    setDisData(createData('Response Displacement', dis, period));
  }, [dis, period]);

  return (
    <Container maxWidth="md" className={classes.root}>
      <form className={classes.form} autoComplete="off">
        <TextField id="damping-ratio" label="減衰定数" type="number" required value={h} onChange={(e) => setH(Number(e.target.value))} />
        <TextField id="sampling-freq" label="サンプル振動数" type="number" required value={f} onChange={(e) => setF(Number(e.target.value))} />
        <Button variant="outlined" component="label" onClick={(e) => fileInput.current && fileInput.current.click()}>
          加速度データ(CSV)をアップロード
          <input type="file" accept=".csv" hidden required onChange={handleFileInput} />
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          計算
        </Button>
      </form>
      <Button variant="outlined">
        <Link href="/Sample.csv">サンプルデータダウンロード</Link>
      </Button>
      <Typography>入力加速度</Typography>
      <Paper className={classes.input}>
        {input.map((v, i) => {
          return (
            <div key={i}>
              {i + 1}: {v}
            </div>
          );
        })}
      </Paper>
      {input.length > 0 && <Line id="input" type="line" data={inputData} options={options} />}
      {acc.length > 0 && <Line id="acc" type="line" data={accData} options={options} />}
      {vel.length > 0 && <Line id="vel" type="line" data={velData} options={options} />}
      {dis.length > 0 && <Line id="dis" type="line" data={disData} options={options} />}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="計算終了"
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Link className={classes.fab} href="https://github.com/baues/structure-tools" target="_blank" rel="noopener noreferrer">
        <Fab aria-label="edit">
          <EditIcon />
        </Fab>
      </Link>
    </Container>
  );
}
