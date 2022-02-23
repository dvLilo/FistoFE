import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import { Provider } from 'react-redux';

import { createStore } from 'redux';
import reducers from './reducers';

import { ThemeProvider, createTheme } from '@mui/material';

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

const theme = createTheme({
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 12,
    heading: {
      margin: 0,
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "1.35em",
      fontWeight: 700
    },
    permission: {
      margin: 0,
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "0.95em",
      fontWeight: 500
    }
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.65em',
          transform: 'translate(14px, 10px) scale(1)'
        },
        shrink: {
          transform: 'translate(18px, -6px) scale(0.85)'
        }
      }
    }
  },
  palette: {
    mode: "light"
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('fsto')
);
