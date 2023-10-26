import React from 'react'

import { ConfirmContext } from '../contexts/ConfirmContext'

const useConfirmation = () => {
  const { confirm: confirmation } = React.useContext(ConfirmContext)

  return confirmation
}

export default useConfirmation