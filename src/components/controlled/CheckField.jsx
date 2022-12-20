import { Controller } from 'react-hook-form'
import { FormControlLabel, Checkbox as MuiCheckbox } from '@mui/material'

const CheckField = (props) => {
  const { name, control, label, onChange: onValueChange, ...checkbox } = props

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
            control={<MuiCheckbox {...checkbox} />}
            checked={checkbox.value === value}
            disableTypography
          />
        )
      }}
    />
  )
}

export default CheckField