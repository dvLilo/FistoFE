import React from 'react'

import { FistoContext } from '../contexts/FistoContext'

const useConfirm = () => {
  const { confirm } = React.useContext(FistoContext)

  return confirm
}

export default useConfirm