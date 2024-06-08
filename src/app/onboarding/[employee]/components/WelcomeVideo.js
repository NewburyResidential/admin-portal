import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

export default function WelcomeVideo() {
  return (
    <Card sx={{ maxWidth: '100%', height: '500px', mt: 4, overflow: 'hidden' }}>
      <Box sx={{ width: '100%', height: '100%' }}>
        <video
          src="https://newbury-intranet.s3.amazonaws.com/alabama-covervideo.mp4"
          title="Welcome Video"
          controls
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    </Card>
  );
}
