import React from 'react'

import { ConfirmContext } from '../contexts/ConfirmContext'

const useConfirm = () => {
  const { setConfirm } = React.useContext(ConfirmContext)

  return setConfirm
}

export default useConfirm