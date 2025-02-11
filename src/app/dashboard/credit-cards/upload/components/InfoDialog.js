import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function InfoDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
    >
      <DialogTitle>
        Help Center
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Iconify icon="mdi:close" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="h6" gutterBottom>
          How to Upload Receipts
        </Typography>
        
        <Typography paragraph>
          Receipts should be entered immediately after a purchase anytime a credit card is used. Scan the receipt, invoice or bill to the best of your ability. Fill out the form and submit!
        </Typography>

        <Typography paragraph sx={{ fontStyle: 'italic' }}>
          *Enter the purchase date shown on the receipt. The amount should include the full total (tax, tip, and any additional fees).
        </Typography>

        <Typography variant="h6" gutterBottom>
          Step by Step Guide
        </Typography>

        <Typography component="div" sx={{ mb: 2 }}>
          <ol>
            <li>Take a clear scan of your receipt. You can include multiple snippets if needed.</li>
            <li>Crop the image so the entire receipt is visible</li>
            <li>Our AI tool will try to extract the merchant, date of purchase and charged amount.</li>
            <li>Verify these amounts match your current receipt and make any necessary adjustments.</li>
            <li>Add any relevant notes about the purchase</li>
            <li>Select which property to bill (you can split charges between multiple properties if needed)</li>
            <li>Submit your receipt for processing</li>
          </ol>
        </Typography>

        <Typography variant="h6" gutterBottom>
          FAQ
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          When should I split a transaction?
        </Typography>
        <Typography paragraph>
          Split transactions when a purchase or service applies to multiple properties. Common scenarios include:
        </Typography>
        <Typography component="div" sx={{ pl: 2, mb: 2 }}>
          <ul>
            <li>Bulk supply orders serving multiple locations</li>
            <li>Service calls covering multiple properties</li>
            <li>Shared equipment purchases</li>
            <li>Flight/Hotel/Car expenses for multi-property trips</li>
          </ul>
        </Typography>
        <Typography paragraph>
          You can split costs by exact amount, percentage, or per unit basis.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          How do I handle travel expenses?
        </Typography>
        <Typography paragraph>
          Travel expenses should be allocated to the property you are in process of traveling to. For multi-property trips, divide costs proportionally. For example, if visiting two properties during one trip, split shared travel expenses (flights, car rental, etc.) equally between those properties. Use your best judgement. For instance, if you have lodgeing for each property, a split is not needed.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          What if I used another team member&apos;s card?
        </Typography>
        <Typography paragraph>
          If you used another team member&apos;s Newbury card for a purchase, make sure to select the correct card from the dropdown menu when submitting the receipt.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
            What if I made a personal purchase with my company card?
          </Typography>
        <Typography paragraph>
          {`Select "Personal" under Locations and immediately reach out to your manager.`}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
} 