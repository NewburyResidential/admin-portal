import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SeoIllustration from 'src/assets/illustrations/seo-illustration';
import Button from '@mui/material/Button';

import { useRouter } from 'next/navigation';

export default function RequestAccessView({ type }) {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', p: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Access Requested
          </Typography>
          <Typography variant="body1" align="center" gutterBottom sx={{ mt: 3 }}>
            Access was requested successfully. You will be notified by email once your request has been approved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 8,
              width: '100%',
              height: '200px',
            }}
          >
            <SeoIllustration />
          </Box>
          {type === 'application' && (
            <Button
              sx={{ height: '44px', mt: 6 }}
              variant="contained"
              type="submit"
              fullWidth
              onClick={() => {
                router.push('/dashboard/');
              }}
            >
              Go Home
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
