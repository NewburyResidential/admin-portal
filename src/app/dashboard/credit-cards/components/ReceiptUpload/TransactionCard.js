import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { format } from 'date-fns';

export default function TransactionCard({ transaction }) {

  function titleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const formattedDate = format(date, 'MM/dd/yyyy');
    return formattedDate;
  }

  return (
    <Card sx={{ boxShadow: 4, borderRadius: '6px', mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '8px',
          }}
        >
          <Typography variant="body1" color="black">
            {transaction.merchant ? transaction.merchant : '*Not Provided*'}
          </Typography>
          <Typography variant="body1" color="black" >
            {titleCase(transaction.name)}
          </Typography>
          <Typography variant="body1" color="black">
            {transaction.accountName}
          </Typography>
          <Typography variant="body1" color="black">
            {formatDate(transaction.transactionDate)}
          </Typography>
          <Typography variant="body1" color="black">
            ${transaction.amount}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
