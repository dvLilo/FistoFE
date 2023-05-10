import React from 'react'
import ReactDOM from 'react-dom'

import axios from 'axios'

import { Provider } from 'react-redux'
import { createStore } from 'redux'

import reducers from './reducers'

import App from './App'

import './index.scss'

axios.defaults.withCredentials = true
// axios.defaults.baseURL = 'http://127.0.0.1:8000'
axios.defaults.baseURL = 'http://10.10.10.8:8000'
// axios.defaults.baseURL = 'http://10.10.2.76:8000' // Server IP
// axios.defaults.baseURL = 'http://10.10.13.15:8000' // Backend IP
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
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
