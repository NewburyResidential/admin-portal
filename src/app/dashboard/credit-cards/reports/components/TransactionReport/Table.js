'use client';

import { useState } from 'react';
import Big from 'big.js';
import getBankTransactionsByMonth from 'src/utils/services/cc-expenses/getBankTransactionsByMonth';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

export default function TransactionReportTable() {
  const [date, setDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [orderBy, setOrderBy] = useState('accountName');
  const [order, setOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accountNameFilter, setAccountNameFilter] = useState('');

  const handleSearch = async () => {
    const result = await getBankTransactionsByMonth({ pk: date });
    setTransactions(result);
    console.log(result);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateTotal = (transactionList) => {
    return transactionList.reduce((sum, tx) => {
      try {
        return sum.plus(new Big(tx.amount || 0));
      } catch (error) {
        return sum;
      }
    }, new Big(0));
  };

  const sortedAndFilteredTransactions = transactions
    .filter((tx) => {
      const matchesStatus = statusFilter === 'all' ? true : tx.status === statusFilter;
      const matchesAccountName = accountNameFilter === '' ? true : tx.accountName.toLowerCase().includes(accountNameFilter.toLowerCase());
      return matchesStatus && matchesAccountName;
    })
    .sort((a, b) => {
      const isAsc = order === 'asc';
      if (orderBy === 'accountName') {
        return isAsc ? a.accountName.localeCompare(b.accountName) : b.accountName.localeCompare(a.accountName);
      }
      return 0;
    });

  const total = calculateTotal(sortedAndFilteredTransactions);

  return (
    <div className="p-8">
      <div className="flex items-center mb-12">
        <TextField
          label="Month/Year"
          placeholder="MM/YYYY"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="small"
          sx={{ mr: 3 }}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ height: '40px', mr: 3 }}>
          Search
        </Button>
        <FormControl size="small" sx={{ mr: 3 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select value={statusFilter} label="Status Filter" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Filter by Account Name"
          placeholder="Enter account name"
          value={accountNameFilter}
          onChange={(e) => setAccountNameFilter(e.target.value)}
          size="small"
          sx={{ mr: 3 }}
        />
        <Card sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="subtitle2">Total Amount</Typography>
            <Typography variant="h5">${total.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </div>

      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'accountName'}
                  direction={orderBy === 'accountName' ? order : 'asc'}
                  onClick={() => handleSort('accountName')}
                >
                  Account Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Posted Date</TableCell>
              <TableCell>Merchant</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredTransactions.map((transaction) => (
              <TableRow key={transaction.sk} hover>
                <TableCell>{transaction.accountName}</TableCell>
                <TableCell>{new Date(transaction.postedDate).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.name || transaction.merchant}</TableCell>
                <TableCell>
                  <Chip label={transaction.status} color={getStatusColor(transaction.status)} />
                </TableCell>
                <TableCell>${new Big(transaction.amount || 0).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
