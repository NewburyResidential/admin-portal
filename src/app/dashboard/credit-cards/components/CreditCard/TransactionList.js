'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useMemo, useEffect } from 'react';

// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';

import { useTable, getComparator, emptyRows, TableNoData, TableEmptyRows, TablePaginationCustom } from 'src/components/table';
//
//import UserTableRow from './UserRow';
import TransactionFilter from './TransactionFilter';
import ResetTransactionFilter from './ResetTransactionFilter';
import { fConvertFromEuropeDate } from 'src/utils/format-time';
import RowItem from '../rowItems/RowItem';
import { useSettingsContext } from 'src/components/display-settings';
import CreditCardSettingsDialog from '../accountSettings/SettingsDialog';
import { isSuggestedReceipt } from '../utils/isSuggestedReceipt';

//import UserTableToolbar from '../user-table-toolbar';
//import UserTableFiltersResult from '../user-table-filters-result';

// ----------------------------------------------------------------------

// const TABLE_HEAD = [
//   { id: 'employee', label: 'Employee' },
//   { id: 'date', label: 'Date' },
//   { id: 'amount', label: 'Amount' },
//   { id: 'property', label: 'Property', width: 180, align: 'center' },
//   { id: 'employeeStatus', label: 'Employment', width: 180, align: 'center' },
//   // { id: '', width: 88 },
// ];

const defaultFilters = {
  vendorOptions: '',
  status: 'all',
  employeeOptions: [],
  amountOptions: { from: '', to: '' },
  dateOptions: { from: null, to: null },
  exactAmount: '',
  exactDate: null,
};

// ----------------------------------------------------------------------

export default function TransactionList({
  employees,
  unapprovedTransactions,
  creditCardAccountsWithEmployees,
  user,
  creditCardAccounts,
  chartOfAccounts,
  vendorData,
  suggestedReceipts,
}) {
  console.log('user', user);
  const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'personal', label: 'Personal' },
    ...(user?.roles?.includes('admin') ? [{ value: 'categorized', label: 'Need Approval' }] : []),
  ];

  const settings = useSettingsContext();
  const { editMode } = settings;

  function matchReceipts(transaction, receipts) {
    return receipts.reduce((acc, receipt) => {
      const receiptData = isSuggestedReceipt(transaction, receipt);
      if (receiptData) {
        acc.push(receiptData);
      }
      return acc;
    }, []);
  }

  // Memoize the transaction processing logic
  const processedTransactions = useMemo(() => {
    return unapprovedTransactions.map((transaction) => {
      const receipts = matchReceipts(transaction, suggestedReceipts);
      const bestMatch =
        receipts.length > 0
          ? receipts.reduce((best, current) => ((current.scoreTotal || current.score) > (best.scoreTotal || best.score) ? current : best))
          : null;

      return {
        ...transaction,
        bestMatchReceipt: bestMatch,
        bestMatchScore: bestMatch ? bestMatch.scoreTotal || bestMatch.score : 0,
        suggestedReceipts: receipts,
        owner: creditCardAccountsWithEmployees.find((account) => account.pk === transaction.accountName)?.owner || null,
        reviewers: creditCardAccountsWithEmployees.find((account) => account.pk === transaction.accountName)?.reviewers || [],
      };
    });
  }, [unapprovedTransactions, suggestedReceipts, creditCardAccountsWithEmployees]);

  // Memoize unique owners
  const uniqueOwners = useMemo(() => {
    const ownerSet = new Set(processedTransactions.map((transaction) => transaction.owner).filter(Boolean));
    return Array.from(ownerSet);
  }, [processedTransactions]);

  // Memoize filtered authorized employees
  const authorizedEmployeesAndAvailable = useMemo(() => {
    return employees.filter(
      (employee) =>
        (user.roles.includes('admin') && uniqueOwners.includes(employee.pk)) ||
        (employee.creditCardAccountsToReview?.includes(user.pk) && uniqueOwners.includes(employee.pk))
    );
  }, [employees, user.roles, user.pk, uniqueOwners]);

  // Update displayed transactions with processed data
  useEffect(() => {
    setDisplayedTransactions(processedTransactions);
  }, [processedTransactions]);

  //TODO: Check for aggresive page caching
  const table = useTable({
    defaultRowsPerPage: 50,
    rowsPerPageOptions: [10, 25, 50],
  });

  const [displayedTransactions, setDisplayedTransactions] = useState(unapprovedTransactions);
  const [filters, setFilters] = useState(defaultFilters);
  const [vendors, setVendors] = useState(vendorData);

  const dataFiltered = applyFilter({
    inputData: displayedTransactions,
    comparator: getComparator(table.order, table.orderBy),
    dataFilters: filters,
  });

  const dataInPage = dataFiltered.slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage);

  const { status: defaultStatus, ...defaultFiltersLessStatus } = defaultFilters;
  const { status: currentStatus, ...filtersLessStatus } = filters;
  const canReset = !isEqual(defaultFiltersLessStatus, filtersLessStatus);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleRemoveTransaction = (transactionId) => {
    setDisplayedTransactions((prevState) => prevState.filter((t) => t.sk !== transactionId));
  };

  // ----------------------------------------------------------------------

  function applyFilter({ inputData, comparator, dataFilters }) {
    const { vendorOptions, employeeOptions, dateOptions, amountOptions, exactDate, exactAmount, status } = dataFilters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    // Sort by transaction date (oldest to newest)
    stabilizedThis.sort((a, b) => {
      const dateA = new Date(fConvertFromEuropeDate(a[0].transactionDate));
      const dateB = new Date(fConvertFromEuropeDate(b[0].transactionDate));
      return dateA - dateB;
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (vendorOptions) {
      inputData = inputData.filter(
        (transaction) =>
          transaction.name?.toLowerCase().includes(vendorOptions.toLowerCase()) ||
          transaction.merchant?.toLowerCase().includes(vendorOptions.toLowerCase())
      );
    }

    if (dateOptions?.from) {
      inputData = inputData.filter(
        (transaction) => new Date(fConvertFromEuropeDate(transaction.transactionDate)).getTime() >= new Date(dateOptions.from).getTime()
      );
    }

    if (dateOptions?.to) {
      inputData = inputData.filter(
        (transaction) => new Date(fConvertFromEuropeDate(transaction.transactionDate)).getTime() <= new Date(dateOptions.to).getTime()
      );
    }

    if (exactDate) {
      inputData = inputData.filter((transaction) => fConvertFromEuropeDate(transaction.transactionDate) === exactDate);
    }

    if (employeeOptions?.length > 0) {
      inputData = inputData.filter((transaction) => employeeOptions.includes(transaction.owner));
    }

    if (amountOptions?.from) {
      inputData = inputData.filter((transaction) => transaction.amount >= amountOptions.from);
    }

    if (amountOptions?.to) {
      inputData = inputData.filter((transaction) => transaction.amount <= amountOptions.to);
    }

    if (exactAmount) {
      inputData = inputData.filter((transaction) => transaction.amount.toString().includes(exactAmount));
    }

    if (status === 'all') {
      if (user.roles.includes('admin')) {
        return inputData;
      }
      return inputData.filter((transaction) => transaction?.reviewers?.includes(user.pk));
    }
    if (status === 'personal') {
      inputData = inputData.filter((transaction) => transaction.owner === user.pk);
    } else if (status === 'categorized') {
      inputData = inputData.filter((transaction) => transaction.status === 'categorized' && user.roles.includes('admin'));
    }

    return inputData;
  }

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const denseHeight = 72;

  return (
    <>
      <CreditCardSettingsDialog employees={employees} creditCardAccounts={creditCardAccounts} open={editMode} />
      <Container maxWidth="xl">
        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={(tab.value === filters.status && 'filled') || 'soft'}
                    color={(tab.value === 'personal' && 'info') || (tab.value === 'categorized' && 'warning') || 'default'}
                  >
                    {tab.value === 'all' &&
                      (user.roles.includes('admin')
                        ? displayedTransactions.length
                        : displayedTransactions.filter((transaction) => transaction?.reviewers?.includes(user.pk))?.length)}
                    {tab.value === 'personal' && displayedTransactions.filter((transaction) => transaction.owner === user.pk).length}
                    {tab.value === 'categorized' &&
                      displayedTransactions.filter((transaction) => transaction.status === 'categorized' && user.roles.includes('admin'))
                        .length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <TransactionFilter filters={filters} onFilters={handleFilters} employees={authorizedEmployeesAndAvailable} user={user} />

          {canReset && (
            <ResetTransactionFilter
              employees={employees}
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset', height: '60vh' }}>
            <Scrollbar sx={{ maxHeight: '60vh' }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableBody>
                  {dataInPage.map((transaction, index) => (
                    <RowItem
                      key={transaction.id}
                      transaction={transaction}
                      transactionIndex={table.page * table.rowsPerPage + index}
                      vendors={vendors}
                      setVendors={setVendors}
                      chartOfAccounts={chartOfAccounts}
                      recentReceipts={suggestedReceipts}
                      user={user}
                      handleRemoveTransaction={handleRemoveTransaction}
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(table.page, table.rowsPerPage, displayedTransactions.length)} />

                  <TableNoData notFound={notFound} title="No Transactions" />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={false}
            onChangeDense={false}
          />
        </Card>
      </Container>
    </>
  );
}
