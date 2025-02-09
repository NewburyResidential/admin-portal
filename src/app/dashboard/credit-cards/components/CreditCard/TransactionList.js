'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Box, LinearProgress, TableRow, TableCell } from '@mui/material';
import Big from 'big.js';

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
import { LoadingScreen } from 'src/components/loading-screen';

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
  const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'personal', label: 'Personal' },
    ...(user?.roles?.includes('admin') ? [{ value: 'categorized', label: 'Need Approval' }] : []),
  ];

  const settings = useSettingsContext();
  const { editMode } = settings;

  const [isMounted, setIsMounted] = useState(false);

  // Memoize the transaction processing logic
  const processedTransactions = useMemo(() => {
    const filteredTransactions = user.roles.includes('admin')
      ? unapprovedTransactions
      : unapprovedTransactions.filter((transaction) => transaction.status === 'unapproved');

    return filteredTransactions.map((transaction) => {
      return {
        ...transaction,
        owner:
          creditCardAccountsWithEmployees.find((account) => account.pk === transaction.accountName?.replace(/\d+/g, '').trim())?.owner ||
          null,
        reviewers:
          creditCardAccountsWithEmployees.find((account) => account.pk === transaction.accountName?.replace(/\d+/g, '').trim())
            ?.reviewers || [],
      };
    });
  }, [unapprovedTransactions, creditCardAccountsWithEmployees, user.roles]);

  const authorizedEmployeesAndAvailable = useMemo(() => {
    const ownerSet = new Set(
      processedTransactions
        .filter((transaction) => user.roles.includes('admin') || transaction.reviewers?.includes(user.pk))
        .map((transaction) => transaction.owner)
        .filter(Boolean)
    );
    const uniqueOwners = Array.from(ownerSet);
    return employees.filter((employee) => uniqueOwners.includes(employee.pk));
  }, [processedTransactions, user.roles, user.pk, employees]);

  // Update displayed transactions with processed data
  useEffect(() => {
    setDisplayedTransactions(processedTransactions);
    setIsMounted(true);
  }, [processedTransactions]);

  //TODO: Check for aggresive page caching
  const table = useTable({
    defaultRowsPerPage: 25,
    rowsPerPageOptions: [10, 25, 50],
  });

  const [displayedTransactions, setDisplayedTransactions] = useState(unapprovedTransactions);
  const [filters, setFilters] = useState(defaultFilters);
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [isFiltering, setIsFiltering] = useState(false);
  const filterTimeoutRef = useRef(null);
  const [vendors, setVendors] = useState(vendorData);

  const getCategoryData = useCallback((status) => {
    switch (status) {
      case 'all':
        return user.roles.includes('admin')
          ? displayedTransactions
          : displayedTransactions.filter((transaction) => transaction?.reviewers?.includes(user.pk));
      case 'personal':
        return displayedTransactions.filter((transaction) => transaction.owner === user.pk);
      case 'categorized':
        return displayedTransactions.filter((transaction) => transaction.status === 'categorized' && user.roles.includes('admin'));
      default:
        return [];
    }
  }, [displayedTransactions, user.roles, user.pk]);

  const dataFiltered = applyFilter({
    inputData: getCategoryData(filters.status), // Filter from the correct category data first
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
      // Clear any existing timeout
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }

      // Immediately update the filter input value and show loading
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
      setIsFiltering(true);

      // Set timeout duration based on input type and method
      const typedInputs = ['vendorOptions', 'amountOptions', 'exactAmount', 'exactDate', 'dateOptions'];
      const timeoutDuration = typedInputs.includes(name) && value !== null ? 1500 : 500;

      // Wait for specified duration before applying the filter
      filterTimeoutRef.current = setTimeout(() => {
        setActiveFilters((prev) => ({
          ...prev,
          [name]: value,
        }));
        setIsFiltering(false);
        table.onResetPage();
      }, timeoutDuration);
    },
    [table]
  );

  const handleRemoveTransaction = useCallback((transactionId) => {
    setDisplayedTransactions((prevState) => prevState.filter((t) => t.sk !== transactionId));
  }, []);

  // ----------------------------------------------------------------------

  function applyFilter({ inputData, comparator, dataFilters }) {
    const { vendorOptions, employeeOptions, dateOptions, amountOptions, exactDate, exactAmount, status } = dataFilters;

    let filteredData = [...inputData];

    // Filter by status
    if (status === 'personal') {
      filteredData = filteredData.filter((item) => item.owner === user.pk);
    } else if (status === 'categorized') {
      filteredData = filteredData.filter((item) => item.status === 'categorized');
    }

    // Filter by employee
    if (employeeOptions?.length) {
      filteredData = filteredData.filter((item) => employeeOptions.includes(item.owner));
    }

    // Filter by vendor
    if (vendorOptions) {
      filteredData = filteredData.filter((item) => item.merchant?.toLowerCase().includes(vendorOptions.toLowerCase()));
    }

    // Filter by amount
    if (exactAmount) {
      // Handle exact amount filter
      filteredData = filteredData.filter((item) => {
        try {
          const itemAmount = new Big(item.amount);
          const targetAmount = new Big(exactAmount);
          return itemAmount.minus(targetAmount).abs().lt(0.01);
        } catch (err) {
          return false; // Handle invalid number formats
        }
      });
    } else if (amountOptions?.from || amountOptions?.to) {
      // Handle amount range filter
      filteredData = filteredData.filter((item) => {
        try {
          const amount = new Big(item.amount);
          if (amountOptions.from && amountOptions.to) {
            return amount.gte(new Big(amountOptions.from)) && amount.lte(new Big(amountOptions.to));
          }
          if (amountOptions.from) {
            return amount.gte(new Big(amountOptions.from));
          }
          if (amountOptions.to) {
            return amount.lte(new Big(amountOptions.to));
          }
          return true;
        } catch (err) {
          return false; // Handle invalid number formats
        }
      });
    }

    // Filter by date
    if (exactDate) {
      // Handle exact date filter
      filteredData = filteredData.filter((item) => {
        const itemDate = fConvertFromEuropeDate(item.transactionDate);
        return itemDate === exactDate;
      });
    } else if (dateOptions?.from || dateOptions?.to) {
      // Handle date range filter
      filteredData = filteredData.filter((item) => {
        console.log(item);
        const itemDate = fConvertFromEuropeDate(item.transactionDate);
        if (dateOptions.from && dateOptions.to) {
          return itemDate >= dateOptions.from && itemDate <= dateOptions.to;
        }
        if (dateOptions.from) {
          return itemDate >= dateOptions.from;
        }
        if (dateOptions.to) {
          return itemDate <= dateOptions.to;
        }
        return true;
      });
    }

    // Apply sorting
    const stabilizedThis = filteredData.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
  }

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setIsFiltering(true);
    setTimeout(() => {
      setFilters(defaultFilters);
      setIsFiltering(false);
    }, 500);
  }, []);

  const denseHeight = 72;

  if (!isMounted) {
    return (
      <Container maxWidth="xl">
        <Card>
          <Box
            sx={{
              height: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 360 }}>
              <LinearProgress color="inherit" />
            </Box>
          </Box>
        </Card>
      </Container>
    );
  }

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
                    {getCategoryData(tab.value).length}
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

          {/* can you just add a list of the filtered transactions here? */}
          {/* {dataInPage.map((transaction) => (
            <div key={transaction.sk}>{transaction.sk}</div>
          ))} */}

          <TableContainer sx={{ position: 'relative', overflow: 'unset', height: '60vh' }}>
            <Scrollbar sx={{ maxHeight: '60vh' }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableBody>
                  {isFiltering ? (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ height: '400px', border: 'none' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                          }}
                        >
                          <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    dataInPage.map((transaction, index) => (
                      <RowItem
                        key={transaction.sk}
                        transaction={transaction}
                        transactionIndex={table.page * table.rowsPerPage + index}
                        vendors={vendors}
                        setVendors={setVendors}
                        chartOfAccounts={chartOfAccounts}
                        recentReceipts={suggestedReceipts}
                        user={user}
                        handleRemoveTransaction={handleRemoveTransaction}
                      />
                    ))
                  )}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(table.page, table.rowsPerPage, displayedTransactions.length)} />

                  {!isFiltering && <TableNoData notFound={notFound} title="No Transactions" />}
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
