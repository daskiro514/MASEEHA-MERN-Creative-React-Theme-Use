import axios from 'axios';
import store from '../store';
import { LOGOUT } from '../actions/types';
import { apiUrl } from "../views/maseeha/config"

const api = axios.create({
  baseURL: apiUrl + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 401) {
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(err);
  }
);

export default api;
