import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import { Provider } from 'react-redux';

import { createStore } from 'redux';
import reducers from './reducers';

import axios from 'axios';

import './index.scss';

axios.defaults.withCredentials = true;
// axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.baseURL = 'http://10.10.12.219:8000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('fsto')
);
