'use client';
import { useState } from 'react';
import FilterBar from './FilterBar';
import Table from './TransactionTable';

export default function View() {

  const [transactions, setTransactions] = useState([]);

  const calculateTotalAmount = (transactions) => {
    return transactions.reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);
  };
  const totalAmount = calculateTotalAmount(transactions);

  return (
    <>
      <FilterBar totalAmount={totalAmount} setTransactions={setTransactions} transactions={transactions} />
      <Table transactions={transactions} />
    </>
  );
}
