'use client';

import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import FilterBar from './FilterBar';
import Table from './TransactionTable';
import TransactionReportTable from './TransactionReport/Table';

export default function View({ newburyAssets }) {
  const [transactions, setTransactions] = useState([]);
  const [viewMode, setViewMode] = useState('transactions');

  const calculateTotalAmount = () => {
    return transactions.reduce((total, item) => {
      return total + Number(item.amount);
    }, 0);
  };

  const calculatePositiveOnlyTotal = () => {
    return transactions.reduce((total, item) => {
      // Only add to total if amount is positive
      return total + (Number(item.amount) > 0 ? Number(item.amount) : 0);
    }, 0);
  };

  const totalAmount = calculateTotalAmount();
  const positiveOnlyTotal = calculatePositiveOnlyTotal();

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <>
      <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange} aria-label="view mode" sx={{ mb: 2 }}>
        <ToggleButton value="transactions" aria-label="bank transactions">
          Bank Transactions
        </ToggleButton>
        <ToggleButton value="reconciliation" aria-label="statement reconciliation">
          Statement Reconciliation
        </ToggleButton>
      </ToggleButtonGroup>

      {viewMode !== 'transactions' ? (
        <>
          <FilterBar
            totalAmount={totalAmount}
            positiveOnlyTotal={positiveOnlyTotal}
            setTransactions={setTransactions}
            transactions={transactions}
            newburyAssets={newburyAssets}
          />
          <Table transactions={transactions} />
        </>
      ) : (
        <TransactionReportTable />
      )}
    </>
  );
}
