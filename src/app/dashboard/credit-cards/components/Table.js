'use client';
import React, { useState, useCallback } from 'react';
import { Table, TableBody, TableContainer, Paper, Card, Button, CardActions } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';

import RowItem from './RowItem';
import { isIncorrectAmounts, isMissingValue } from 'src/utils/expense-calculations/missing-value';
import updateTransactions from 'src/utils/services/CCExpenses/updateTransactions';
import { AnimatePresence, m } from 'framer-motion';
import { recalculateUnitDistribution } from 'src/utils/expense-calculations/recalculate-unit-distribution';

export default function CustomTable({ vendors, chartOfAccounts, unapprovedTransactions }) {
  const [transactions, setTransactions] = useState(() =>
    unapprovedTransactions.map((transaction) => ({
      ...transaction,
      checked: false,
    }))
  );
  const [useLayoutAnimation, setUseLayoutAnimation] = useState(false);
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

  const handleAddSplit = useCallback((transactionId, newAllocationId, isAmountCalculation = true) => {
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

  const handleAssetsChange = useCallback((transactionId, allocationId, newAsset) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              allocations: transaction.allocations.map((allocation) =>
                allocation.id === allocationId ? { ...allocation, asset: newAsset } : allocation
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

  const handleApproveTransactions = async () => {
    let validTransactions = [];
    transactions.forEach((transaction) => {
      if (transaction.checked) {
        let transactionValid = true;
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
            transactionValid = false;
          }
        });
        if (transactionValid) {
          validTransactions.push({ ...transaction, status: 'Unapproved' }); //Change back to Unapprove
        }
      }
    });
    if (validTransactions.length > 0) {
      try {
        const response = await updateTransactions(validTransactions);
        if (response.ids.length > 0) {
          const updatedTransactionIds = response.ids;
          setTransactions((prevTransactions) => prevTransactions.filter((transaction) => !updatedTransactionIds.includes(transaction.id)));
        }
      } catch (error) {
        console.error('Error Updating Transactions: ', error);
      }
    }
  };

  return (
    <Card sx={{ borderRadius: '10px' }}>
      <TableContainer component={Paper} sx={{ maxHeight: '72vh', height: '72vh', borderRadius: '0px', overflowX: 'hidden' }}>
        <Table aria-label="customized table">
          <AnimatePresence>
            {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
              <TableBody
                component={m.tbody}
                key={item.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.12,
                  },
                }}
                exit={{
                  x: [0, 700],
                  opacity: 0,
                  transition: { duration: 0.4 },
                }}
                //layout={true}
                //- maybe this won't suck one day
              >
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
              </TableBody>
            ))}
          </AnimatePresence>
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
