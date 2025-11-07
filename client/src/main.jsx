import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, AppBar, Toolbar, Typography, Container, MenuItem, Select } from '@mui/material'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import rtlPlugin from 'stylis-plugin-rtl'
import i18n from './i18n'
import { useTranslation } from 'react-i18next'
import store from './store'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

const styleCache = (dir) => createCache({ key: dir==='rtl'?'muirtl':'mui', stylisPlugins: dir==='rtl'?[rtlPlugin]:[] })

function Shell(){
  const { t } = useTranslation()
  const [lng, setLng] = React.useState(i18n.language || 'en')
  React.useEffect(()=>{ document.documentElement.dir = lng==='ar' ? 'rtl' : 'ltr'; i18n.changeLanguage(lng) },[lng])
  return (
    <CacheProvider value={styleCache(lng==='ar'?'rtl':'ltr')}>
      <CssBaseline />
      <AppBar position="static"><Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>{t('app.title')}</Typography>
        <Select size="small" value={lng} onChange={(e)=>setLng(e.target.value)} sx={{ color: 'white' }}>
          <MenuItem value="en">{t('app.english')}</MenuItem>
          <MenuItem value="ar">{t('app.arabic')}</MenuItem>
        </Select>
      </Toolbar></AppBar>
      <Container sx={{ my: 3 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </CacheProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
