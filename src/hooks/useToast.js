import React from 'react'

import { FistoContext } from '../contexts/FistoContext'

const useToast = () => {

  const { toast } = React.useContext(FistoContext)

  return toast
}

export default useToast