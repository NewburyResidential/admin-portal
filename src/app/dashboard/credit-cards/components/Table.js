'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import LoadingButton from '@mui/lab/LoadingButton';

import TablePagination from '@mui/material/TablePagination';

import RowItem from './RowItem';
import { isIncorrectAmounts, isMissingValue } from 'src/utils/expense-calculations/missing-value';
import updateTransactions from 'src/utils/services/CCExpenses/updateTransactions';

import { useTheme } from '@mui/material/styles';

export default function CustomTable({ vendors, chartOfAccounts, unapprovedTransactions }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const [transactions, setTransactions] = useState(() =>
    unapprovedTransactions.map((transaction) => ({
      ...transaction,
      checked: false,
    }))
  );

  const haveSelected = transactions.some((transaction) => transaction.checked);
  const selectedTransactions = transactions.reduce((count, transaction) => {
    return transaction.checked ? count + 1 : count;
  }, 0);

  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
            newAllocations.forEach((allocation) => {
              allocation.amount = 0;
            });
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

  const handleVendorChange = useCallback((transactionId, newVendor) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              vendor: newVendor,
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

  const handleReceiptChange = useCallback((transactionId, fileUrl, tempPdfUrl) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === transactionId
          ? {
              ...transaction,
              receipt: fileUrl,
              tempPdfReceipt: tempPdfUrl,
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

  const handleApproveTransactions = async () => {
    const validTransactions = [];
    transactions.forEach((transaction) => {
      if (transaction.checked) {
        let transactionValid = true;
        const errors = [];
        setTransactionSubmitted(transaction.id);

        const isVendorRequired = transaction.allocations.some(
          (allocation) => allocation.asset && allocation.asset.accountingSoftware === 'entrata'
        );

        if (isVendorRequired && isMissingValue(transaction.vendor)) {
          transactionValid = false;
          errors.push(`Item ID: ${transaction.id} is missing vendor`);
        }

        if (isIncorrectAmounts(transaction)) {
          transactionValid = false;
          errors.push(`Item ID: ${transaction.id} has incorrect allocations`);
        }

        transaction.allocations.forEach((allocation) => {
          const missingFields = [];
          if (isMissingValue(allocation.asset)) missingFields.push('assets');
          if (isMissingValue(allocation.glAccount)) missingFields.push('glAccount');

          if (missingFields.length > 0) {
            errors.push(`Allocation ID ${allocation.id} is missing: ${missingFields.join(', ')}`);
            transactionValid = false;
          }
        });
        if (transactionValid) {
          validTransactions.push({ ...transaction, status: 'reviewed' });
        } else {
          console.log(errors.join('\n'));
        }
      }
    });
    if (validTransactions.length > 0) {
      setLoading(true);
      try {
        const response = await updateTransactions(validTransactions);
        if (response.ids.length > 0) {
          const updatedTransactionIds = response.ids;
          setTransactions((prevTransactions) => prevTransactions.filter((transaction) => !updatedTransactionIds.includes(transaction.id)));
        }
      } catch (error) {
        setLoading(false);
        console.error('Error Updating Transactions: ', error);
      }
    }
    setLoading(false);
  };

  return (
    <Card sx={{ borderRadius: '10px' }}>
      <CardActions sx={{ backgroundColor: isLight ? 'primary.darker' : theme.palette.common.black }}>
        <LoadingButton
          variant="contained"
          style={{ marginLeft: '16px', width: '140px' }}
          disabled={!haveSelected}
          onClick={handleApproveTransactions}
          color="primary"
          loading={loading}
        >
          Approve {selectedTransactions > 0 && `(${selectedTransactions})`}
        </LoadingButton>
        <TablePagination
          sx={{ color: 'white' }}
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardActions>
      <TableContainer component={Paper} sx={{ borderRadius: '0px', overflowX: 'hidden' }}>
        <Box sx={{ height: '100%', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
            <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column' }}>
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
            </Box>
          ))}
        </Box>
      </TableContainer>
    </Card>
  );
}
