'use client';
import React, { useState, useCallback } from 'react';
import { Table, TableBody, TableContainer, Paper } from '@mui/material';

import RowItem from './RowItem';

export default function CustomTable({ vendors, chartOfAccounts, unapprovedTransactions }) {
  const [transactions, setTransactions] = useState(unapprovedTransactions);

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
                { id: newAllocationId, amount: 0, glAccount: '' },
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


 

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableBody>
          {transactions.map((item, index) => (
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
              />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
