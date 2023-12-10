'use client';
import React, { useState, useCallback } from 'react';
import { Table, TableBody, TableContainer, Paper, Card, Button, CardActions } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';

import RowItem from './RowItem';
import { all } from 'axios';
import { isIncorrectAmounts, isMissingValue } from 'src/utils/missing-value';

export default function CustomTable({ vendors, chartOfAccounts, unapprovedTransactions }) {
  const [transactions, setTransactions] = useState(() =>
    unapprovedTransactions.map((transaction) => ({
      ...transaction,
      checked: false,
    }))
  );
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckboxToggle = useCallback((transactionId) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId ? { ...transaction, checked: !transaction.checked } : transaction
      )
    );
  }, []);

  const handleAllocationAmountChange = useCallback((transactionId, allocationId, newAmount) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              allocations: transaction.allocations.map((allocation) =>
                allocation.id === allocationId ? { ...allocation, amount: newAmount } : allocation
              ),
            }
          : transaction
      )
    );
  }, []);

  const handleAddSplit = useCallback((transactionId, newAllocationId) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              allocations: [
                ...transaction.allocations.map((allocation) => ({
                  ...allocation,
                  amount: 0,
                })),
                { id: newAllocationId, amount: 0, glAccount: null, note: '', vendor: null, assets: [] },
              ],
            }
          : transaction
      )
    );
  }, []);

  const handleDeleteSplit = useCallback((transactionId, allocationId) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) => {
        if (transaction.id === transactionId) {
          const newAllocations = transaction.allocations.filter((allocation) => allocation.id !== allocationId);

          if (newAllocations.length === 1) {
            newAllocations[0].amount = transaction.amount;
          } else {
            newAllocations.forEach((allocation) => (allocation.amount = 0));
          }

          return {
            ...transaction,
            allocations: newAllocations,
          };
        }
        return transaction;
      })
    );
  }, []);

  const handleGlAccountChange = useCallback((transactionId, allocationId, newGlAccount) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              allocations: transaction.allocations.map((allocation) =>
                allocation.id === allocationId ? { ...allocation, glAccount: newGlAccount } : allocation
              ),
            }
          : transaction
      )
    );
  }, []);

  const handleAssetsChange = useCallback((transactionId, allocationId, newAssetsArray) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              allocations: transaction.allocations.map((allocation) =>
                allocation.id === allocationId ? { ...allocation, assets: newAssetsArray } : allocation
              ),
            }
          : transaction
      )
    );
  }, []);

  const handleVendorChange = useCallback((transactionId, allocationId, newVendor) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              allocations: transaction.allocations.map((allocation) =>
                allocation.id === allocationId ? { ...allocation, vendor: newVendor } : allocation
              ),
            }
          : transaction
      )
    );
  }, []);

  const handleNoteChange = useCallback((transactionId, allocationId, newNote) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              allocations: transaction.allocations.map((allocation) =>
                allocation.id === allocationId ? { ...allocation, note: newNote } : allocation
              ),
            }
          : transaction
      )
    );
  }, []);

  const handleReceiptChange = useCallback((transactionId, newReceipt) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              receipt: newReceipt,
            }
          : transaction
      )
    );
  }, []);

  function setTransactionSubmitted(transactionId) {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) => (transaction.id === transactionId ? { ...transaction, isSubmitted: true } : transaction))
    );
  }

  const haveSelected = transactions.some((transaction) => transaction.checked);

  const handleApproveTransactions = () => {
    transactions.forEach((transaction) => {
      if (transaction.checked) {
        setTransactionSubmitted(transaction.id);
        transaction.allocations.forEach((allocation) => {
          let allocationValid = true;
          let missingFields = [];

          if (isMissingValue(allocation.assets)) {
            allocationValid = false;
            missingFields.push('assets');
          }
          if (isMissingValue(allocation.glAccount)) {
            allocationValid = false;
            missingFields.push('glAccount');
          }
          if (isMissingValue(allocation.vendor)) {
            allocationValid = false;
            missingFields.push('vendor');
          }
          if (isIncorrectAmounts(transaction)) {
            allocationValid = false;
            missingFields.push('allocation');
          }

          if (!allocationValid) {
            console.log(`Allocation ID ${allocation.id} in transaction ID ${transaction.id} is missing: ${missingFields.join(', ')}`);
          }
        });
      }
    });
  };

  return (
    <Card sx={{ borderRadius: '10px' }}>
      <TableContainer component={Paper} sx={{ maxHeight: '72vh', borderRadius: '0px' }}>
        <Table aria-label="customized table">
          <TableBody>
            {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
              <React.Fragment key={item.id}>
                <RowItem
                  item={item}
                  index={index}
                  vendors={vendors}
                  chartOfAccounts={chartOfAccounts}
                  handleAllocationAmountChange={handleAllocationAmountChange}
                  handleAddSplit={handleAddSplit}
                  handleDeleteSplit={handleDeleteSplit}
                  handleGlAccountChange={handleGlAccountChange}
                  handleReceiptChange={handleReceiptChange}
                  handleNoteChange={handleNoteChange}
                  handleVendorChange={handleVendorChange}
                  handleAssetsChange={handleAssetsChange}
                  handleCheckboxToggle={handleCheckboxToggle}
                />
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CardActions>
        <Button
          variant="outlined"
          style={{ marginLeft: '16px', width: '120px' }}
          disabled={!haveSelected}
          onClick={handleApproveTransactions}
        >
          Approve
        </Button>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardActions>
    </Card>
  );
}
