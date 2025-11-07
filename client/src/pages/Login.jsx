import React from 'react'
import { TextField, Button, Paper, Typography, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import api from '../api'
import { useDispatch } from 'react-redux'
import { setAuth } from '../store'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const { t } = useTranslation()
  const [email, setEmail] = React.useState('admin@example.com')
  const [password, setPassword] = React.useState('password')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const nav = useNavigate()
  const dispatch = useDispatch()
  const submit = async (e)=>{
    e.preventDefault(); setLoading(true); setError('')
    try {
      const res = await api.post('/auth/login', { email, password })
      dispatch(setAuth({ user: res.data.user, token: res.data.token, role: res.data.user.role }))
      nav('/')
    } catch(err){ setError(err?.response?.data?.error || 'Login failed') } finally { setLoading(false) }
  }
  return (
    <Paper sx={{ p:3, maxWidth: 420, mx:'auto' }} component="form" onSubmit={submit}>
      <Typography variant="h5" sx={{ mb:2 }}>{t('app.login')}</Typography>
      <Stack spacing={2}>
        <TextField label={t('app.email')} value={email} onChange={e=>setEmail(e.target.value)} fullWidth />
        <TextField label={t('app.password')} type="password" value={password} onChange={e=>setPassword(e.target.value)} fullWidth />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" disabled={loading}>{loading? '...' : t('app.login')}</Button>
      </Stack>
    </Paper>
  )
}
