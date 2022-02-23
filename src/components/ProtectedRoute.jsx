import React from 'react'

import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const authenticated = window.localStorage.getItem('token')

  return (
    authenticated
    ? <Outlet />
    : <Navigate to="/" />
  )
}