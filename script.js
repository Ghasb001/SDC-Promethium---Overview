import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 10000,
      timeUnit: '1s', // rate iterations per second (rate / timeUnit)
      duration: '120s',
      preAllocatedVUs: 100, // how large the initial pool of VUs would be
      maxVUs: 1000, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};

export default function () {

  let randomItem = () => {
    return Math.floor(Math.random() * (1000011 - 1 + 1)) + 1;
  }

  http.get(`http://localhost:1128/products/${randomItem()}`);
  http.get(`http://localhost:1128/products/${randomItem()}/styles`);
  http.get(`http://localhost:1128/products/${randomItem()}/related`);

  sleep(1);
}
