'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'

export default function PolipizzaLogo({ size = 120 }: { size?: number }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        border: '2px solid #e0e0e0',
        borderRadius: '50%',
        backgroundColor: '#fafafa',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: '#424242',
        }}
      >
        s1
      </Typography>
    </Box>
  )
}
