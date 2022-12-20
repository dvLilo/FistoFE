import React from 'react'

import { Controller } from 'react-hook-form'
import { TextField } from '@mui/material'
import { NumericFormat } from 'react-number-format'

const Numberfield = ({ name, control, onValueChange, ...numberfield }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value = null, onChange: setValue } = field

        return (
          <NumericFormat
            {...numberfield}
            customInput={TextField}
            value={value}
            onValueChange={(data) => {
              if (!data.value) return setValue(null)

              if (onValueChange) return setValue(onValueChange(data))

              setValue(Number(data.value))
            }}
          />
        )
      }}
    />
  )
}

export default Numberfield
