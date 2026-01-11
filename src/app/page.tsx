'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material'
import {
  TrendingUp,
  People,
  AccountBalance,
  Restaurant,
  Warning,
  AttachMoney,
  ShoppingCart,
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
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString('es-PY', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Ventas del Día
                </Typography>
                <Typography variant="h4" fontWeight={600} color="primary">
                  {formatCurrency(stats?.totalSalesToday || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Clientes Nuevos
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {stats?.newClientsToday || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Estado de Caja
                  </Typography>
                  <Chip
                    label={stats?.cashRegisterStatus.isOpen ? 'Abierta' : 'Cerrada'}
                    color={stats?.cashRegisterStatus.isOpen ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="h4" fontWeight={600}>
                  {formatCurrency(stats?.cashRegisterStatus.currentBalance || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Alertas de Stock
                </Typography>
                <Typography variant="h4" fontWeight={600} color={stats?.lowStockAlerts.length ? 'warning.main' : 'text.primary'}>
                  {stats?.lowStockAlerts.length || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Top Products */}
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Productos Más Vendidos
                </Typography>
                {stats?.topProducts.length ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Producto</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.topProducts.map((product, index) => (
                          <TableRow key={index} hover>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" color="text.secondary">
                                  {index + 1}.
                                </Typography>
                                <Typography variant="body2">
                                  {product.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {product.quantity}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(product.revenue)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Alertas de Stock
                </Typography>
                {stats?.lowStockAlerts.length ? (
                  <Box>
                    {stats.lowStockAlerts.map((alert, index) => (
                      <Box key={index} mb={index < stats.lowStockAlerts.length - 1 ? 2 : 0}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                          <Typography variant="body2" fontWeight={500}>
                            {alert.name}
                          </Typography>
                          <Chip
                            label={`${alert.currentStock}`}
                            color="error"
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Mínimo: {alert.minStock}
                        </Typography>
                        {index < stats.lowStockAlerts.length - 1 && (
                          <Divider sx={{ mt: 2 }} />
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography color="text.secondary" variant="body2">
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
