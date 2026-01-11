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
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #2E5090 0%, #5a7bb8 100%)',
                color: 'white',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Ventas del Día
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {formatCurrency(stats?.totalSalesToday || 0)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AttachMoney sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* New Clients Today */}
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                color: 'white',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Clientes Nuevos
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {stats?.newClientsToday || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <People sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Cash Register Status */}
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: stats?.cashRegisterStatus.isOpen 
                  ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
                  : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                color: 'white',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Estado de Caja
                    </Typography>
                    <Chip
                      label={stats?.cashRegisterStatus.isOpen ? 'Abierta' : 'Cerrada'}
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        fontWeight: 600,
                        mb: 1
                      }}
                      size="small"
                    />
                    <Typography variant="h6" fontWeight={600}>
                      {formatCurrency(stats?.cashRegisterStatus.currentBalance || 0)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccountBalance sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Low Stock Alerts */}
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                color: 'white',
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Alertas de Stock
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {stats?.lowStockAlerts.length || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Warning sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Products */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Restaurant color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Productos Más Vendidos
                  </Typography>
                </Box>
                {stats?.topProducts.length ? (
                  <List sx={{ pt: 0 }}>
                    {stats.topProducts.map((product, index) => (
                      <ListItem 
                        key={index} 
                        divider
                        sx={{
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                          },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <ListItemIcon>
                          <Box
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'white',
                              borderRadius: '50%',
                              width: 40,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 600,
                            }}
                          >
                            {index + 1}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight={500}>
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
                    <Restaurant sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
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
            <Card sx={{ height: '100%', boxShadow: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Warning color="warning" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h6" fontWeight={600}>
                    Alertas de Stock Bajo
                  </Typography>
                </Box>
                {stats?.lowStockAlerts.length ? (
                  <List sx={{ pt: 0 }}>
                    {stats.lowStockAlerts.map((alert, index) => (
                      <ListItem 
                        key={index} 
                        divider
                        sx={{
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            borderRadius: 1,
                          },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <ListItemIcon>
                          <Warning color="warning" sx={{ fontSize: 28 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight={500}>
                              {alert.name}
                            </Typography>
                          }
                          secondary={
                            <Box display="flex" gap={2} mt={0.5}>
                              <Chip
                                label={`Stock: ${alert.currentStock}`}
                                color="error"
                                size="small"
                                variant="outlined"
                              />
                              <Typography variant="body2" color="text.secondary">
                                Mínimo: {alert.minStock}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Warning sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
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


