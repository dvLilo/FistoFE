import moment from 'moment'

import { Controller } from 'react-hook-form'
import { DatePicker as MuiDatePicker } from '@mui/lab'

const DatePicker = ({ name, control, onChange: onValueChange, ...datepicker }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value = null, onChange: setValue } = field

        return (
          <MuiDatePicker
            {...datepicker}
            value={value}
            onChange={(value) => {
              if (!moment(value).isValid()) return

              if (onValueChange) return setValue(onValueChange(value))

              setValue(moment(value).format())
            }}
          />
        )
      }}
    />
  )
}

export default DatePicker
