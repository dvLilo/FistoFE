import { Controller } from 'react-hook-form'
import { Autocomplete as MuiAutocomplete } from '@mui/material'

const AutoComplete = ({ name, control, onChange: onValueChange, ...autocomplete }) => {

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value, onChange: setValue } = field

        return (
          <MuiAutocomplete
            {...autocomplete}
            value={value}
            onChange={(e, value) => {
              if (onValueChange) return setValue(onValueChange(e, value))

              setValue(value)
            }}
          />
        )
      }}
    />
  )
}

export default AutoComplete
