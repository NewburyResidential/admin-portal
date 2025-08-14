'use client';

import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Scrollbar from 'src/components/scrollbar';
import { useTable, getComparator, TableNoData, TableHeadCustom, TablePaginationCustom } from 'src/components/table';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress from '@mui/material/LinearProgress';
import { deleteUtilityItem } from 'src/utils/services/utilities/delete-utility-item';
import { updateUtilityItem } from 'src/utils/services/utilities/update-utility-item';

import UtilityRow from './UtilityRow';
import UtilityFilter from './UtilityFilter';
import { getEntrataUtilityPayload } from './getEntrataUtilityPayload';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import { enterUtilityPayload } from 'src/utils/services/utilities/enter-utility-payload';
import getUtilityBillsByMonth from 'src/utils/services/utilities/get-utility-bills-by-month';

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Invoice #', width: 120 },
  { id: 'propertyId', label: 'ID', width: 100 },
  { id: 'apartment', label: 'Apartment', width: 100 },
  { id: 'electricAmount', label: 'Electric', width: 100, align: 'right' },
  { id: 'waterSewerAmount', label: 'Water/Sewer', width: 100, align: 'right' },
  { id: 'gasAmount', label: 'Gas', width: 100, align: 'right' },
  { id: 'miscAmount', label: 'Misc', width: 100, align: 'right' },
  { id: 'taxAmount', label: 'Tax', width: 100, align: 'right' },
  { id: 'totalAmount', label: 'Total', width: 100, align: 'right' },
  { id: 'status', label: 'Status', width: 100, align: 'center' },
  { id: 'options', label: 'Options', width: 100, align: 'right' },
];

const defaultFilters = {
  propertyId: '',
  utilityId: '',
  status: 'all',
  period: '',
};

export default function UtilityTable({ utilityBills, newburyAssets, utilities, onRefresh, setLeases, setUtilityBills, setFilters, filters }) {
  const table = useTable({ defaultRowsPerPage: 25 });
  const [selected, setSelected] = useState([]);
  const { showResponseSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSearch = async (searchParams) => {
    console.log('searchParams', searchParams);
    try {
      const filtered = await getUtilityBillsByMonth(searchParams);
      setUtilityBills(filtered);
      setFilters({
        ...defaultFilters,
        propertyId: searchParams.propertyId,
        utilityId: searchParams.utilityId,
        period: searchParams.period,
        status: searchParams.status ?? filters.status,
      });
    } catch (error) {
      console.error('Error fetching bills:', error);
      setUtilityBills([]);
    }
  };

  // Group the data by paymentId
  const groupedData = useMemo(() => {
    const groups = {};
    utilityBills.forEach((bill) => {
      const groupId = bill.paymentId || bill.sk;
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(bill);
    });
    return groups;
  }, [utilityBills]);

  const dataFiltered = applyFilter({
    inputData: groupedData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  // Convert filtered data to array for pagination
  const paginatedData = useMemo(() => {
    const groupArray = Object.entries(dataFiltered);
    const start = table.page * table.rowsPerPage;
    const end = start + table.rowsPerPage;

    const slicedData = groupArray.slice(start, end);
    return slicedData;
  }, [dataFiltered, table.page, table.rowsPerPage]);

  // Modify handleSelectAll to only work with filtered data
  const handleSelectAll = (checked) => {
    if (checked) {
      const newSelected = Object.keys(dataFiltered);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  // Modify handleSelectOne to only work if item is in filtered data
  const handleSelectOne = (groupId) => {
    // Check if the group exists in filtered data
    if (!dataFiltered[groupId]) {
      return;
    }

    const selectedIndex = selected.indexOf(groupId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, groupId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleSubmitSelected = async () => {
    setIsSubmitting(true);
    setProgress(0);

    try {
      const selectedItems = selected.reduce((acc, groupId) => {
        if (dataFiltered[groupId]) {
          acc.push(...dataFiltered[groupId]);
        }
        return acc;
      }, []);

      const itemsWithAccountId = selectedItems.map((item) => ({
        ...item,
        accountId: getAccountIdFromPropertyId(newburyAssets, item.propertyId),
      }));

      const groupedByPayment = itemsWithAccountId.reduce((acc, item) => {
        const key = item.paymentId || item.sk;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});

      // Wait for all payloads to be generated
      const payloads = await Promise.all(Object.values(groupedByPayment).map((group) => getEntrataUtilityPayload(group, utilities)));

      const validPayloads = payloads.filter((payload) => payload !== null);

      console.log('validPayloads', validPayloads);
      

      const totalSteps = validPayloads.length;
      let completedSteps = 0;
      const responses = [];

      // Submit each payload and update statuses
      for (const [index, payload] of validPayloads.entries()) {
        try {
          const response = await enterUtilityPayload({
            payload,
            successTitle: 'Utility Invoice Posted',
            errorTitle: 'Error Posting Utility Invoice',
          });
          responses.push(response);

          // Get the group of items for this payload
          const groupKey = Object.keys(groupedByPayment)[index];
          const itemsToUpdate = groupedByPayment[groupKey];

          // Update status for all items in the group
          const newStatus = response.severity === 'success' ? 'approved' : 'error';
          console.log('newStatus', newStatus);
          console.log('itemsToUpdate', itemsToUpdate);

          for (const item of itemsToUpdate) {
            const updateResponse = await updateUtilityItem(item.pk, item.sk, { status: newStatus });
            responses.push(updateResponse);
            console.log('response', updateResponse);
          }

          completedSteps++;
          setProgress((completedSteps / totalSteps) * 100);
        } catch (error) {
          console.error('Error processing payload:', error);
          // Still increment progress even if there's an error
          completedSteps++;
          setProgress((completedSteps / totalSteps) * 100);
        }
      }

      showResponseSnackbar(responses);

      // Refresh with current search parameters
      await handleSearch({
        propertyId: filters.propertyId,
        utilityId: filters.utilityId,
        period: filters.period,
        status: filters.status,
      });

      // Clear selected items after successful submission
      setSelected([]);
    } catch (error) {
      const errorResponse = snackbarCatchErrorResponse(error, 'Error Posting Transactions');
      showResponseSnackbar(errorResponse);
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  const handleDelete = async (pk, sk) => {
    try {
      const response = await deleteUtilityItem(pk, sk);
      showResponseSnackbar(response);
      if (response.severity === 'success') {
        await onRefresh();
      }
    } catch (error) {
      const errorResponse = snackbarCatchErrorResponse(error, 'Error Deleting Item');
      showResponseSnackbar(errorResponse);
    }
  };

  const handleEdit = async (pk, sk, values) => {
    try {
      const response = await updateUtilityItem(pk, sk, values);
      showResponseSnackbar(response);
      if (response.severity === 'success') {
        await onRefresh();
        console.log('response', response);
      }
    } catch (error) {
      const errorResponse = snackbarCatchErrorResponse(error, 'Error Updating Item');
      showResponseSnackbar(errorResponse);
    }
  };

  return (
    <>
      <Card>
        <UtilityFilter newburyAssets={newburyAssets} onSearch={handleSearch} setLeases={setLeases} />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size="medium" sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                onSort={table.onSort}
                rowCount={Object.keys(dataFiltered).length}
                numSelected={selected.length}
                onSelectAllRows={handleSelectAll}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < Object.keys(dataFiltered).length}
                    checked={Object.keys(dataFiltered).length > 0 && selected.length === Object.keys(dataFiltered).length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
              </TableHeadCustom>

              <TableBody>
                {paginatedData.map(([groupId, bills]) => {
                  return (
                    <UtilityRow
                      key={groupId}
                      groupId={groupId}
                      bills={bills}
                      selected={selected.includes(groupId)}
                      onSelectRow={() => handleSelectOne(groupId)}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  );
                })}

                <TableNoData notFound={!Object.keys(dataFiltered).length} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={Object.keys(dataFiltered).length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {/* Bottom Submit Card */}
      <Card sx={{ mt: 2, p: 2 }}>
        <Stack direction="row" justifyContent="flex-end">
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            color="primary"
            onClick={handleSubmitSelected}
            disabled={selected.length === 0}
          >
            Submit Selected {selected.length > 0 && `(${selected.length})`}
          </LoadingButton>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          aria-label="Processing invoices"
          sx={{
            visibility: isSubmitting ? 'visible' : 'hidden',
            mt: 1,
          }}
        />
      </Card>
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { status } = filters;

  if (!inputData || Object.keys(inputData).length === 0) {
    return {};
  }

  const filteredData = {};
  Object.entries(inputData).forEach(([groupId, bills]) => {
    if (!Array.isArray(bills)) return;

    let shouldInclude = true;

    if (status && status !== 'all') {
      if (status === 'unapproved') {
        shouldInclude = bills.some((bill) => bill?.status === 'unapproved' || bill?.status === 'error' || !bill?.status);
      } else {
        shouldInclude = bills.some((bill) => bill?.status === status || !bill?.status);
      }
    }

    if (shouldInclude) {
      filteredData[groupId] = bills;
    }
  });

  return filteredData;
}

function getAccountIdFromPropertyId(newburyAssets, propertyId) {
  const asset = newburyAssets.find((a) => a.pk === propertyId);
  return asset ? asset.accountId : null;
}
