import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { createStore } from 'redux'

import reducers from './reducers'

import axios from 'axios'

import App from './App'

import './index.scss'

axios.defaults.withCredentials = true
// axios.defaults.baseURL = 'https://backend.fisto.ml/public'
// axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.baseURL = 'http://10.10.12.219:8000'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (401 === error.request.status) {
      if (window.location.pathname === '/')
        return Promise.reject(error)

      window.localStorage.removeItem("token")
      window.localStorage.removeItem("user")

      window.location.href = '/'
      return Promise.reject(error)
    }

    if (403 === error.request.status) {
      window.location.href = '/403'
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

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
)
