'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material'
import {
  TrendingUp,
  People,
  AccountBalance,
  Restaurant,
  Warning,
  AttachMoney,
} from '@mui/icons-material'
import { useAuth } from '@/contexts/AuthContext'
import AppLayout from '@/components/Layout/AppLayout'
import { DashboardStats } from '@/types'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('Error al cargar las estadísticas')
      }
    } catch (error) {
      setError('Error al cargar las estadísticas')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={fetchStats}>
            Reintentar
          </Button>
        }>
          {error}
        </Alert>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Box>
        <Box mb={4}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            ¡Bienvenido, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Resumen del día - {new Date().toLocaleDateString('es-PY', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Total Sales Today */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Ventas del Día
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="primary">
                      {formatCurrency(stats?.totalSalesToday || 0)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'primary.light',
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.1,
                    }}
                  >
                    <AttachMoney sx={{ fontSize: 32, color: 'primary.main' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* New Clients Today */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Clientes Nuevos
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {stats?.newClientsToday || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'action.hover',
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <People sx={{ fontSize: 32, color: 'text.secondary' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Cash Register Status */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Estado de Caja
                    </Typography>
                    <Chip
                      label={stats?.cashRegisterStatus.isOpen ? 'Abierta' : 'Cerrada'}
                      color={stats?.cashRegisterStatus.isOpen ? 'success' : 'error'}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      {formatCurrency(stats?.cashRegisterStatus.currentBalance || 0)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'action.hover',
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccountBalance sx={{ fontSize: 32, color: 'text.secondary' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Low Stock Alerts */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Alertas de Stock
                    </Typography>
                    <Typography variant="h5" fontWeight={600} color="warning.main">
                      {stats?.lowStockAlerts.length || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'action.hover',
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Warning sx={{ fontSize: 32, color: 'warning.main' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Products */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Productos Más Vendidos
                </Typography>
                {stats?.topProducts.length ? (
                  <List sx={{ pt: 0 }}>
                    {stats.topProducts.map((product, index) => (
                      <ListItem 
                        key={index} 
                        divider
                        sx={{
                          py: 1.5,
                          px: 0,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            {index + 1}.
                          </Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1">
                              {product.name}
                            </Typography>
                          }
                          secondary={
                            <Box display="flex" gap={2} mt={0.5}>
                              <Typography variant="body2" color="text.secondary">
                                {product.quantity} unidades
                              </Typography>
                              <Typography variant="body2" color="primary.main" fontWeight={600}>
                                {formatCurrency(product.revenue)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary">
                      No hay ventas registradas hoy
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Low Stock Alerts */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Alertas de Stock Bajo
                </Typography>
                {stats?.lowStockAlerts.length ? (
                  <List sx={{ pt: 0 }}>
                    {stats.lowStockAlerts.map((alert, index) => (
                      <ListItem 
                        key={index} 
                        divider
                        sx={{
                          py: 1.5,
                          px: 0,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Warning color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1">
                              {alert.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                              Stock actual: {alert.currentStock} (Mínimo: {alert.minStock})
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary">
                      Todos los productos tienen stock suficiente
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  )
}


