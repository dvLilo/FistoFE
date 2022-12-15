import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { ADD_PO, UPDATE_PO } from '../../actions'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'

import {
  Box,
  // Paper,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Chip,
  // Stack,
  // IconButton,
  // Divider,
  // InputAdornment,
  // TableContainer,
  // Table,
  // TableHead,
  // TableBody,
  // TableRow,
  // TableCell
} from '@mui/material'

import {
  Add,
  Edit
} from '@mui/icons-material'

import NumberFormat from 'react-number-format'

const TransactionAttachment = () => {

  const dispatch = useDispatch()

  const {
    // watch,
    reset,
    // register,
    control,
    setValue,
    handleSubmit,
    // formState: { errors }
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
    defaultValues: {
      no: "",
      amount: "",
      rr: []
    }
  })

  const po = useSelector((state) => state.po)

  // eslint-disable-next-line
  const [update, setUpdate] = useState({
    status: false,
    index: null,
    data: null
  })

  const updateAttachmentHandler = (index, data) => {
    setUpdate({
      status: true,
      index, data
    })
  }

  const submitTransactionHandler = (data) => {
    // console.log(data)

    if (!update.status) dispatch(ADD_PO(data))
    else dispatch(UPDATE_PO(update.index, data))

    setUpdate((currentValue) => ({
      ...currentValue,
      status: false
    }))
    reset()
  }

  useEffect(() => {
    if (update.status) {
      setValue("no", update.data.no)
      setValue("amount", update.data.amount)
      setValue("rr", update.data.rr)
    }

    // eslint-disable-next-line
  }, [update])


  return (
    <>
      <Typography variant="heading" sx={{ display: 'block', marginBottom: 3 }}>Attachment</Typography>

      <Box className="FstoBoxForm-attachment" component="form" onSubmit={handleSubmit(submitTransactionHandler)}>
        <Controller
          name="no"
          control={control}
          render={({ field }) => {
            const { value = null, onChange } = field

            return (
              <NumberFormat
                customInput={TextField}
                className="FstoTextfieldForm-attachment"
                label="PO Number"
                variant="outlined"
                size="small"
                prefix="PO#"
                value={value}
                onValueChange={(data) => {
                  if (!data.value) return onChange(null);

                  onChange(data.formattedValue);
                }}
                fullWidth
              />
            )
          }}
        />

        <Controller
          name="amount"
          control={control}
          render={({ field }) => {
            const { value = null, onChange } = field

            return (
              <NumberFormat
                customInput={TextField}
                className="FstoTextfieldForm-attachment"
                label="PO Amount"
                variant="outlined"
                size="small"
                prefix="₱"
                value={value}
                onValueChange={(data) => {
                  if (!data.value) return onChange(null);

                  onChange(Number(data.value));
                }}
                fullWidth
                thousandSeparator
              />
            )
          }}
        />

        <Controller
          name="rr"
          control={control}
          render={({ field }) => {
            const { value = null, onChange } = field

            return (
              <Autocomplete
                className="FstoSelectForm-attachment"
                size="small"
                value={value}
                options={[]}
                limitTags={3}
                renderInput={
                  (props) => <TextField {...props} label="RR Number" variant="outlined" InputLabelProps={{ className: "FstoLabelForm-attachment" }} />
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      className="FstoChipForm-attachment"
                      label={option}
                      variant="outlined"
                      size="small"
                    />
                  ))
                }
                onChange={(_, value) => onChange(value)}
                freeSolo
                multiple
                fullWidth
                disablePortal
                disableClearable
              />
            )
          }}
        />

        <Button
          className="FstoButtonForm-attachment"
          variant="contained"
          type="submit"
          color="secondary"
          size="large"
          startIcon={update.status ? <Edit /> : <Add />}
          disableElevation
        >
          Add
        </Button>
      </Box>

      {
        po.map((item, index) => {
          return (
            <span key={index} onClick={() => updateAttachmentHandler(index, item)}>{item.no}</span>
          )
        })
      }
    </>
  )
}

const schema = yup.object().shape({
  no: yup.string().typeError("PO number is invalid.").required().label("PO number"),
  amount: yup.number().typeError("PO amount is invalid.").required("PO amount is required.").label("PO amount"),
  rr: yup.array().label("RR number"),
}).required()

export default TransactionAttachment