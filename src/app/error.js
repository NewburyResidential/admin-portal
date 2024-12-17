'use client';

import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Error() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ maxWidth: 500, padding: 3, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            An Unexpected Error Occurred
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The error has been recorded and we will work to resolve this. If you need urgent access, 
            please reach out to Mike Axiotakis.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => router.push('/')}
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
