import { spectrum } from 'tools/spectrum';

self.onmessage = (event) => {
  if (event.data) {
    const results = spectrum(event.data);
    self.postMessage(results);
  } else {
    self.postMessage(undefined);
  }
};
