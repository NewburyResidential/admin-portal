'use client';

import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import FilterBar from './FilterBar';
import Table from './TransactionTable';
import TransactionReportTable from './TransactionReport/Table';

export default function View() {
  const [transactions, setTransactions] = useState([]);
  const [viewMode, setViewMode] = useState('transactions');

  const calculateTotalAmount = () => {
    return transactions.reduce((total, item) => {
      return total + Number(item.amount);
    }, 0);
  };

  const totalAmount = calculateTotalAmount(transactions);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewChange}
        aria-label="view mode"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="transactions" aria-label="bank transactions">
          Bank Transactions
        </ToggleButton>
        <ToggleButton value="reconciliation" aria-label="statement reconciliation">
          Statement Reconciliation
        </ToggleButton>
      </ToggleButtonGroup>

      {viewMode !== 'transactions' ? (
        <>
          <FilterBar totalAmount={totalAmount} setTransactions={setTransactions} transactions={transactions} />
          <Table transactions={transactions} />
        </>
      ) : (
        <TransactionReportTable />
      )}
    </>
  );
}
