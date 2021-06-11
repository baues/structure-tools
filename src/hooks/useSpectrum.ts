import { useState, useCallback, useEffect, useMemo } from 'react';
import { SpectrumArgs } from 'tools/spectrum';
import { useWebWorker } from './useWebWorker';

interface SpectrumUtils {
  calc: (spectrumArgs: SpectrumArgs) => void;
  calculating: boolean;
  results: number[][];
}

export function useSpectrum(): SpectrumUtils {
  const [calculating, setCalculating] = useState<boolean>(false);
  const [results, setResults] = useState<number[][]>([]);

  const spectrumsWorker = useMemo(() => new Worker(new URL('../worker/spectrum.worker.js', import.meta.url)), []);
  const { response: resSpectrum, exec: execSpectrum } = useWebWorker<SpectrumArgs, number[][]>(spectrumsWorker);

  const calc = useCallback(async (spectrumArgs: SpectrumArgs) => {
    setCalculating(true);
    await execSpectrum(spectrumArgs);
  }, [execSpectrum]);

  useEffect(() => {
    if (resSpectrum && resSpectrum[0] && resSpectrum[0].length > 0) {
      setResults(resSpectrum);

      setCalculating(false);
    }

    return () => setCalculating(false);
  }, [resSpectrum]);

  return { calc, calculating, results };
}
