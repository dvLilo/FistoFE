import React from 'react'

import ReactDOM from 'react-dom'

import * as Mui from '@mui/material'

const useThemeDetector = () => {
  const getMatchMedia = () => window.matchMedia("(prefers-color-scheme: dark)")

  const [isDarkTheme, setIsDarkTheme] = React.useState(getMatchMedia().matches)

  const mqListener = (e) => {
    setIsDarkTheme(e.matches)
  }

  React.useEffect(() => {
    const mq = getMatchMedia()
    mq.addListener(mqListener)

    return () => mq.removeListener(mqListener)
  }, [])

  return isDarkTheme
}

const Sandbox = () => {

  const isDarkTheme = useThemeDetector()

  return ReactDOM.createPortal (
    <React.Fragment>
      <Mui.Box sx={{
        backgroundColor: '#eee',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 5
      }}>
        <Mui.Typography variant="h1">Current Theme: { isDarkTheme ? "Dark" : "Light" }</Mui.Typography>
        

        {/* <Mui.Typography variant="h1" title="h1">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="h2" title="h2">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="h3" title="h3">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="h4" title="h4">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="h5" title="h5">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="h6" title="h6">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="subtitle1" title="subtitle1">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="subtitle2" title="subtitle2">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="body1" title="body1">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="body2" title="body2">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="button" title="button">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="caption" title="caption">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="overline" title="overline">Fisto cutie.</Mui.Typography>
        <Mui.Divider  variant="middle" flexItem />
        <Mui.Typography variant="heading" title="heading">Fisto cutie.</Mui.Typography>
        <Mui.Typography variant="permission" title="permission">Fisto cutie.</Mui.Typography> */}

      </Mui.Box>
    </React.Fragment>,
    document.getElementById("sandbox")
  )
}

export default Sandbox
