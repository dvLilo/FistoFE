import React from 'react'
import CryptoJS from 'crypto-js'

import { Navigate } from 'react-router-dom'

import Layouts from './Layouts'

import AccessDenied from '../exceptions/AccessDenied'

export const ProtectedRoute = ({ permission }) => {
  const authenticated = window.localStorage.getItem('token')

  if (!authenticated) return <Navigate to="/" />
  if (!!authenticated) {
    const encryptedUser = window.localStorage.getItem('user')
    const decryptedUser = CryptoJS.AES.decrypt(encryptedUser, process.env.REACT_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8)

    var user = JSON.parse(decryptedUser)
  }

  return (
    permission !== undefined
      ? user.permissions.includes(permission)
        ? <Layouts />
        : <AccessDenied />
      : <Layouts />
  )
}