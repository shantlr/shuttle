import pkg from '../../package.json';

export const BASE_URL = pkg.homepage;

let API_URL;

if (process.env.NODE_ENV === 'development') {
  API_URL = 'ws://localhost:8021';
} else {
  const protocol = window.location.protocol === 'http:' ? 'ws:' : 'wss:';
  API_URL = `${protocol}//${window.location.host}`;
}

export { API_URL };
