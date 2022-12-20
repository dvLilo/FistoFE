import { Controller } from 'react-hook-form'
import { FormControlLabel, Radio as MuiRadio } from '@mui/material'

const RadioField = (props) => {
  const { name, control, label, onChange: onValueChange, ...radio } = props

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { ref, value, onChange: setValue } = field

        return (
          <FormControlLabel
            label={label}
            inputRef={ref}
            onChange={(e) => {
              if (onValueChange) return setValue(onValueChange(e))

              setValue(e)
            }}
            control={<MuiRadio {...radio} />}
            checked={radio.value === value}
            disableTypography
          />
        )
      }}
    />
  )
}

export default RadioField