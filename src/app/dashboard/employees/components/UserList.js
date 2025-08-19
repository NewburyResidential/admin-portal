'use client';

//TODO Move no data to credit card app
import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { useRouter } from 'src/routes/hooks';
// _mock
// hooks
// components
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';

import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
//
import UserTableRow from './UserRow';
import EmployeeFilter from './EmployeeFilter';
import ResetEmployeeFilter from './ResetEmployeeFilter';
import { roleOptions } from 'src/layouts/dashboard/roleOptions';
//import UserTableToolbar from '../user-table-toolbar';
//import UserTableFiltersResult from '../user-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: '#AUTHORIZED', label: 'Authorized' },
  { value: '#ONBOARDING', label: 'Onboarding' },
  { value: '#UNAUTHORIZED', label: 'Unauthorized' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  // { id: 'primaryEmail', label: 'Email', width: 180 },

  { id: 'phoneNumber', label: 'Phone Number', width: 180, align: 'center' },

  //{ id: 'hireDate', label: 'Hire Date', width: 180 },
  { id: 'employeeStatus', label: 'Employment', width: 180, align: 'center' },
  // { id: '', width: 88 },
];

const defaultFilters = {
  name: '',
  role: [],
  status: '#AUTHORIZED',
};

// ----------------------------------------------------------------------

export default function UserList({ employees }) {
  const table = useTable({ defaultRowsPerPage: 50 });

  const router = useRouter();

  const tableData = employees;

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    dataFilters: filters,
  });

  //const dataInPage = dataFiltered.slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage);

  const denseHeight = 72;

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

  // ----------------------------------------------------------------------

  function applyFilter({ inputData, comparator, dataFilters }) {
    const { name, status, role } = dataFilters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
      inputData = inputData.filter((user) => {
        const userName = user.fullName;
        return userName.toLowerCase().indexOf(name.toLowerCase()) !== -1;
      });
    }

    if (status !== 'all') {
      inputData = inputData.filter((user) => user.status === status);
    }

    if (role.length) {
      inputData = inputData.filter((user) => user.roles.some((userRole) => role.includes(userRole)));
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

  return (
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
                  color={
                    (tab.value === '#AUTHORIZED' && 'success') ||
                    (tab.value === 'pending' && 'warning') ||
                    (tab.value === '#UNAUTHORIZED' && 'error') ||
                    (tab.value === '#ONBOARDING' && 'warning') ||
                    'default'
                  }
                >
                  {tab.value === 'all' && employees.length}
                  {tab.value === '#AUTHORIZED' && employees.filter((user) => user.status === '#AUTHORIZED').length}
                  {tab.value === '#UNAUTHORIZED' && employees.filter((user) => user.status === '#UNAUTHORIZED').length}
                  {tab.value === '#ONBOARDING' && employees.filter((user) => user.status === '#ONBOARDING').length}
                </Label>
              }
            />
          ))}
        </Tabs>

        <EmployeeFilter
          filters={filters}
          onFilters={handleFilters}
          //
          roleOptions={roleOptions}
        />

        {canReset && (
          <ResetEmployeeFilter
            filters={filters}
            onFilters={handleFilters}
            onResetFilters={handleResetFilters}
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered.slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage).map((row) => (
                  <UserTableRow
                    key={row.pk}
                    row={row}
                    onSelectRow={() => {
                      if (row.pk) {
                        if (row.status === '#ONBOARDING') {
                          router.push(row.pk);
                        } else {
                          router.push(`${row.fullName.replace(/ /g, '_').toLowerCase()}-${row.pk}`);
                        }
                      }
                    }}
                  />
                ))}

                <TableEmptyRows height={denseHeight} emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)} />

                <TableNoData notFound={notFound} />
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
          rowsPerPageOptions={[25, 50, 75]}
        />
      </Card>
    </Container>
  );
}
