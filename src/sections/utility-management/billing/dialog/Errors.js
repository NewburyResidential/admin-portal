import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

export default function Errors({ errorFiles }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        textAlign: 'left',
        borderStyle: 'dashed',
        borderColor: 'error.main',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      <Box sx={{ my: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="subtitle2" noWrap>
          Error Processing Files:
        </Typography>
        {errorFiles?.map((fileName, index, arr) => (
          <Box key={index} component="span" sx={{ typography: 'body2', ml: 1 }}>
            {fileName}
            {index < arr.length - 1 ? ',' : ''}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
