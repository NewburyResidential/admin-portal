'use client';

import { useState } from 'react';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';

function descendingComparator(a, b, orderBy) {
  if (orderBy === 'postDate') {
    const dateA = new Date(a[orderBy]);
    const dateB = new Date(b[orderBy]);
    return dateB - dateA;
  } 

  if (typeof a[orderBy] === 'string') {
    return b[orderBy].toLowerCase().localeCompare(a[orderBy].toLowerCase());
  }

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function TransactionTable({ transactions }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Amount');

  const handleRequestSort = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const columnHeaders = [
    { id: 'transactionId', label: 'Transaction ID' },
    { id: 'postDate', label: 'Posted Date' },
    { id: 'billedPropertyName', label: 'Location' },
    { id: 'purchasedBy', label: 'Purchased By' },
    { id: 'name', label: 'Description' },
    { id: 'amount', label: 'Amount' },
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columnHeaders.map((headCell) => (
              <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={handleRequestSort(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(transactions, getComparator(order, orderBy)).map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.transactionId}</TableCell>
              <TableCell>{row.postDate}</TableCell>
              <TableCell>{row.billedPropertyName}</TableCell>
              <TableCell>{row.purchasedBy}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
