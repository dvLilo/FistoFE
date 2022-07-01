import React from 'react'

import { useSelector } from 'react-redux'

import {
  createTheme,
  useMediaQuery
} from '@mui/material'



const colorScheme = useSelector(state => state.color)
const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

const CustomTheme = React.useMemo(() => createTheme({
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 12,
    heading: {
      margin: 0,
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "1.35em",
      fontWeight: 700
    },
    permission: {
      margin: 0,
      fontFamily: "'Open Sans', sans-serif",
      fontSize: "0.95em",
      fontWeight: 500
    }
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.75em',
          transform: 'translate(14px, 10px) scale(1)'
        },
        shrink: {
          transform: 'translate(18px, -6px) scale(0.85)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize'
        }
      }
    }
  },
  palette: {
    mode: colorScheme === "system" ? (prefersDarkMode ? "dark" : "light") : colorScheme,
    ...(
      (colorScheme === "dark" || (colorScheme === "system" && prefersDarkMode))
      && {
        background: {
          default: "#181818"
        }
      }
    )
  },
  zIndex: {
    modal: 1400,
    snackbar: 1300
  }
}), [colorScheme, prefersDarkMode]);

export default CustomTheme