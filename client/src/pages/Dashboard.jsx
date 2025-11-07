import React from 'react'
import { Typography, Grid, Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'
import api from '../api'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function Dashboard(){
  const { t } = useTranslation()
  const [statusCounts, setStatusCounts] = React.useState({ active: 0, overdue: 0, completed: 0 })
  const [upcoming, setUpcoming] = React.useState([])

  React.useEffect(()=>{
    ;(async ()=>{
      try {
        const c = await api.get('/contracts?limit=500')
        const counts = { active:0, overdue:0, completed:0 }
        c.data.forEach(x=>{ counts[x.status] = (counts[x.status]||0)+1 })
        setStatusCounts(counts)
        const p = await api.get('/payments/due')
        setUpcoming(p.data || [])
      } catch(e){}
    })()
  }, [])

  const data = {
    labels: ['Active', 'Overdue', 'Completed'],
    datasets: [{ label: 'Contracts', data: [statusCounts.active, statusCounts.overdue, statusCounts.completed] }]
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h5">{t('dashboard.welcome')}</Typography></Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p:2 }}><Typography sx={{ mb:1 }}>{t('dashboard.contracts')}</Typography><Bar data={data} /></Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p:2 }}>
          <Typography sx={{ mb:1 }}>{t('dashboard.payments')}</Typography>
          <ul>{upcoming.slice(0,5).map(p=>(<li key={p._id}>{p.contract?.title || p.contractId} — {p.amount} on {new Date(p.dueDate).toLocaleDateString()}</li>))}</ul>
        </Paper>
      </Grid>
    </Grid>
  )
}
