import http from 'k6/http';
import { check } from 'k6';

const vus = parseInt(__ENV.STRESS_VUS || '200', 10);
const duration = __ENV.STRESS_DURATION || '2m';

export const options = {
  vus: vus,
  duration: duration,
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    'http_req_failed': ['rate<0.05'],
  },
};

export default function () {
  const url = 'http://localhost:3000/checkout/crypto';
  const payload = JSON.stringify({
    orderId: `order-${Math.floor(Math.random() * 100000)}`,
    amount: 250.0,
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
  });
}
