import React from 'react'

import { ToastContext } from '../contexts/ToastContext'

const useToast = () => {

  const { setToast } = React.useContext(ToastContext)

  return setToast
}

export default useToast