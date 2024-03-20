// refactor
// make sure all data is coming in and leaving the same
// add total amounts header before approved and after approved
// filter approved

import {
  TableContainer,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  Button,
  Card,
} from '@mui/material';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import Big from 'big.js';
import getSignedS3Url from 'src/utils/services/aws/getSignedS3Url';
import updateUtilityBill from 'src/utils/services/utility-bills/updateUtilityBill';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { LoadingButton } from '@mui/lab';
import getUtilityBills from 'src/utils/services/utility-bills/getUtilityBills';
import enterReviewedBillsIntoEntrata from 'src/utils/services/utility-bills/enterReviewedBillsIntoEntrata';

export default function UtilitiesTable({
  utilityBills,
  setUtilityBills,
  setEditDialog,
  selectedProperty,
  selectedUtility,
  selectedMonth,
  filterStatus,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [billPending, setBillPending] = useState(false);
  const [syncPending, setSyncPending] = useState(false);

  const handleSync = async () => {
    setSyncPending(true);
    const response = await enterReviewedBillsIntoEntrata();
    console.log(response);
    setSyncPending(false);
  };

  const handleSubmit = async () => {
    setBillPending(true);
    for (const index of selectedRows) {
      const data = {
        ...rows[index],
        status: 'reviewed',
      };
      console.log(data);

      try {
        const response = await updateUtilityBill(data);
        if (!response) {
          console.error('Update failed for:', data);
        }
      } catch (error) {
        console.error('Error updating utility bill:', data, error);
      }
    }
    const newData = await getUtilityBills(selectedMonth, `${selectedProperty?.id}#${selectedUtility?.id}#`);
    setUtilityBills(newData);
    setSelectedRows([]);
    setBillPending(false);
  };

  let totalElectric = new Big(0);
  let totalWater = new Big(0);
  let totalGas = new Big(0);
  let totalMiscellaneous = new Big(0);
  let totalTax = new Big(0);
  let totalUnapprovedAmount = new Big(0);
  let totalAmount = new Big(0);

  //console.log(totalUnapprovedAmount.toString());

  // const totalAmount = totalElectric.plus(totalWater).plus(totalMiscellaneous).plus(totalGas).plus(totalTax);

  const openReceipt = async (objectKey) => {
    const url = await getSignedS3Url('admin-portal-utility-bills', objectKey);
    if (url) window.open(url, '_blank');
    else {
      console.error('Error generating pre-signed URL');
    }
  };

  const rows = utilityBills
    .filter((bill) => {
      return bill.status === filterStatus || filterStatus === 'all';
    })
    .map((bill, index) => {
      const electric = new Big(bill.electricAmount || 0);
      const water = new Big(bill.waterAmount || 0);
      const gas = new Big(bill.gasAmount || 0);
      const miscellaneous = new Big(bill.miscellaneousAmount || 0);
      const tax = new Big(bill.taxAmount || 0);
      const totalAmount = new Big(bill.totalAmount || 0);
      const individualTotal = electric.plus(water).plus(gas).plus(miscellaneous).plus(tax);
      let equalsTotal;

      const isNonZeroNumber = !isNaN(Number(bill?.scrapedAmount)) && Number(bill?.scrapedAmount) !== 0;

      if (isNonZeroNumber) {
        const scrapedTotal = new Big(bill?.scrapedAmount || 0);
        equalsTotal = individualTotal.eq(scrapedTotal) && individualTotal.eq(totalAmount);
      } else {
        equalsTotal = individualTotal.eq(totalAmount);
      }

      return {
        ...bill,
        id: index,
        equalsTotal,
        status: bill.status,
        electricAmount: electric.toNumber(),
        waterAmount: water.toNumber(),
        gasAmount: gas.toNumber(),
        miscellaneousAmount: miscellaneous.toNumber(),
        taxAmount: tax.toNumber(),
        totalAmount: totalAmount.toNumber(),
        type: bill?.type || 'common',
      };
    });

  rows.forEach((bill) => {
    totalElectric = totalElectric.plus(bill.electricAmount || 0);
    totalWater = totalWater.plus(bill.waterAmount || 0);
    totalGas = totalGas.plus(bill.gasAmount || 0);
    totalMiscellaneous = totalMiscellaneous.plus(bill.miscellaneousAmount || 0);
    totalTax = totalTax.plus(bill.taxAmount || 0);
    totalAmount = totalAmount.plus(bill.totalAmount || 0);
    totalUnapprovedAmount = totalUnapprovedAmount.plus(bill.status === 'unapproved' ? bill.totalAmount || 0 : 0);
  });

  const TotalHeader = ({ title, total }) => (
    <Box display="flex" flexDirection="column" alignItems="center">
      <span style={{ marginBottom: '-0em', lineHeight: '1.9em' }}>{title}</span>
      <span style={{ fontSize: 'smaller', color: 'gray', lineHeight: '1.6em' }}>{`$${total.toString()}`}</span>
    </Box>
  );

  const columns = [
    { field: 'invoiceNumber', headerName: 'Invoice Number', flex: 1.2 },
    { field: 'building', headerName: 'Building', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <span>{params.row.type === 'apartment' ? `${params.value}` : 'Common'}</span>;
      },
    },
    { field: 'startService', headerName: 'Start Service', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'endService', headerName: 'End Service', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'electricAmount',
      headerName: 'Electric',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderHeader: () => <TotalHeader title="Electric" total={totalElectric} />,
      renderCell: (params) => {
        return <span>{params.value !== 0 ? `$${params.value}` : ''}</span>;
      },
    },
    {
      field: 'waterAmount',
      headerName: 'Water',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderHeader: () => <TotalHeader title="Water" total={totalWater} />,
      renderCell: (params) => {
        return <span>{params.value !== 0 ? `$${params.value}` : ''}</span>;
      },
    },
    {
      field: 'gasAmount',
      headerName: 'Gas',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderHeader: () => <TotalHeader title="Gas" total={totalGas} />,
      renderCell: (params) => {
        return <span>{params.value !== 0 ? `$${params.value}` : ''}</span>;
      },
    },
    {
      field: 'miscellaneousAmount',
      headerName: 'Misc',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderHeader: () => <TotalHeader title="Misc" total={totalMiscellaneous} />,
      renderCell: (params) => {
        return <span>{params.value !== 0 ? `$${params.value}` : ''}</span>;
      },
    },
    {
      field: 'taxAmount',
      headerName: 'tax',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderHeader: () => <TotalHeader title="Tax" total={totalTax} />,
      renderCell: (params) => {
        return <span>{params.value !== 0 ? `$${params.value}` : ''}</span>;
      },
    },
    {
      field: 'totalAmount',
      headerName: 'Total',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderHeader: () => <TotalHeader title="Total" total={totalAmount} />,
      renderCell: (params) => {
        return <span>${params.value}</span>;
      },
    },
    {
      field: 'objectKey',
      headerName: 'View Bill',
      sortable: false,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (params.value)
          return (
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                openReceipt(params.row.objectKey);
              }}
              aria-label="view"
            >
              <ImageSearchIcon />
            </IconButton>
          );
      },
    },
    {
      field: 'status',
      headerName: 'Edit Bill',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return params.row.status === 'unapproved' ? (
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              setEditDialog({ open: true, utilityBill: params.row });
            }}
            aria-label="edit"
          >
            <ModeEditOutlineIcon />
          </IconButton>
        ) : (
          <IconButton aria-label="nothing">
            <CheckCircleOutlineIcon />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Card sx={{ height: 700, width: '100%', pb: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        columnHeaderHeight={68}
        onRowSelectionModelChange={(newSelectionModel) => {
          setSelectedRows(newSelectionModel);
        }}
        rowSelectionModel={selectedRows}
        getRowClassName={(params) =>
          params.row.status === 'reviewed' || params.row.status === 'approved'
            ? 'highlightSubmitted'
            : params.row.equalsTotal
              ? ''
              : 'highlightError'
        }
        isRowSelectable={(params) => {
          return params.row.status === 'unapproved';
        }}
        sx={{
          '.highlightError': {
            bgcolor: '#FFCCCC',
          },
          '.highlightSubmitted': {
            bgcolor: '#E8F5E9',
            color: 'grey',
          },
        }}
      />
      <Box sx={{ backgroundColor: 'white', width: '180px', height: '50px', position: 'absolute', marginTop: '-36px' }}></Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '-36px', ml: 3 }}>
        <LoadingButton variant="contained" color="primary" onClick={handleSubmit} loading={billPending} disabled={!selectedRows.length}>
          {selectedRows.length ? `Submit Bills (${selectedRows.length})` : 'Submit Bills'}
        </LoadingButton>
        <LoadingButton variant="outlined" color="inherit" onClick={handleSync} loading={syncPending}>
          Sync Entrata
        </LoadingButton>
      </Box>
    </Card>
  );
}
