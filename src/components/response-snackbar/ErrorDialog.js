import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';


export default function ErrorDialog({ open, onClose, error }) {
//TODO Create Envioremtent for dev errors vs client errors (avoid security breach)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle sx={(theme) => ({ borderTop: `6px solid ${theme.palette.error.main}` })}>
        {error?.message}
      </DialogTitle>
      

      <DialogContent>
      {error?.summary && <Typography variant="h6" color='error.dark' mb={3}>{error.summary}</Typography>}

        <Box 
      sx={{
        maxHeight: '60vh', 
        overflowY: 'auto'
      }}
    >
      <Typography
        component="pre"
        sx={{
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          color: '#fff',
          backgroundColor: '#000',
          padding: '8px',
          borderRadius: '4px',
          overflowX: 'auto',
        }}
      >
        {error?.stack}
      </Typography>
    </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
