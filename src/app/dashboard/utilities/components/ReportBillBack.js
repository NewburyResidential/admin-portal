'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Card } from '@mui/material';
import EditUtilityBill from './EditUtilityBillDialog';
import { differenceInCalendarDays, isBefore, isAfter, isSameDay, parseISO, parse } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';
import enterBillBackChargesIntoEntrata from 'src/utils/services/utility-bills/enterBillbackChargesIntoEntrata';
import Big from 'big.js';
import getUtilityBills from 'src/utils/services/utility-bills/getUtilityBills';

export default function ReportBillBack({ leases, utilityBills, pk, sk, setUtilityBills }) {
  const billBacks = calculateOverlaps(leases, utilityBills);
  const [selectedRows, setSelectedRows] = useState([]);
  const [billbackPending, setBillbackPending] = useState(false);

  const handleSubmit = async () => {
    setBillbackPending(true);
    const billbacksData = selectedRows.map((index) => billBacks[index]);
    try {
      const response = await enterBillBackChargesIntoEntrata(billbacksData);
      console.log(response);
      if (!response) {
        console.error('Error with chargeback:', billbacksData);
      }
    } catch (error) {
      console.error('Error with chargeback:', billbacksData, error);
    }

    const newData = await getUtilityBills(pk, sk);
    setUtilityBills(newData);
    setSelectedRows([]);
    setBillbackPending(false);
  };

  const columns = [
    { field: 'nameFull', headerName: 'Name', flex: 1, headerAlign: 'center', align: 'left' },
    { field: 'building', headerName: 'Building', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'unit', headerName: 'Unit', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'leaseDates', headerName: 'Lease Dates', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'billDates', headerName: 'Bill Dates', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'daysProratedText', headerName: 'Days Prorated', type: 'number', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'originalAmount',
      headerName: 'Original Amount',
      type: 'number',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: ({ value }) => value,
    },
    {
      field: 'proratedAmount',
      headerName: 'Prorated Amount',
      type: 'number',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: ({ value }) => value,
    },
  ];

  const rows = billBacks.map((bill, index) => ({
    id: index,
    ...bill,
  }));

  return (
    <Card sx={{ mt: 5, height: 400, width: '100%', pb: 2 }}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box sx={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRows(newSelectionModel);
            }}
            rowSelectionModel={selectedRows}
            isRowSelectable={(params) => {
              return !params.row.billedback;
            }}
            getRowClassName={(params) => params.row.billedback && 'highlightSubmitted'}
            sx={{
              '.highlightSubmitted': {
                bgcolor: '#E8F5E9',
                color: 'grey',
              },
            }}
          />
        </Box>
      </Box>
      <Box sx={{ backgroundColor: 'white', width: '180px', height: '50px', position: 'absolute', marginTop: '-36px' }}></Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '-36px', ml: 3 }}>
        <LoadingButton variant="contained" color="primary" onClick={handleSubmit} loading={billbackPending} disabled={!selectedRows.length}>
          {selectedRows.length ? `Submit Billbacks (${selectedRows.length})` : 'Submit Billbacks'}
        </LoadingButton>
      </Box>
    </Card>
  );
}

function calculateOverlaps(leases, utilityBills) {
  const overlaps = [];
  utilityBills.forEach((bill) => {
    if (!bill.startService || !bill.endService || !bill.unit || !bill.building) {
      return;
    }

    // Adjusted for 'mm/dd/yyyy' format
    const billStart = parse(bill.startService, 'MM/dd/yyyy', new Date());
    const billEnd = parse(bill.endService, 'MM/dd/yyyy', new Date());
    const billBuilding = bill.building;

    const buildingLeases = leases[billBuilding];
    if (buildingLeases && typeof buildingLeases === 'object') {
      Object.entries(buildingLeases).forEach(([unit, leaseArray]) => {
        leaseArray.forEach((lease) => {
          const moveIn = parse(lease.moveInDate, 'MM/dd/yyyy', new Date());
          const moveOut = lease.moveOutDate ? parse(lease.moveOutDate, 'MM/dd/yyyy', new Date()) : new Date();

          if (
            bill.unit === unit &&
            (isBefore(billStart, moveOut) || billStart.getTime() === moveOut.getTime()) &&
            (isAfter(billEnd, moveIn) || billEnd.getTime() === moveIn.getTime())
          ) {
            const leaseMoveIn = lease.moveInDate;
            const leaseMoveOut = lease.moveOutDate ? lease.moveOutDate : 'Current';

            const overlapStart = isBefore(billStart, moveIn) ? moveIn : billStart;
            const overlapEnd = isAfter(billEnd, moveOut) ? moveOut : billEnd;

            const overlapDays = differenceInCalendarDays(overlapEnd, overlapStart) + 1;
            const totalBillDays = differenceInCalendarDays(billEnd, billStart) + 1;
            const bigOverlapDays = new Big(overlapDays);
            const bigTotalBillDays = new Big(totalBillDays);
            const bigProportion = bigOverlapDays.div(bigTotalBillDays);
            const totalAmount = new Big(bill.totalAmount);

            const daysProrated = overlapDays === totalBillDays ? 'All' : overlapDays;
            const parts = bill.sk.split('#');
            const utilityVendor = parts[1];
            const type = utilityVendor === 'bwl' ? 'electric' : utilityVendor === 'consumers' ? 'gas' : null;

            overlaps.push({
              invoiceNumber: bill.invoiceNumber,
              building: billBuilding,
              unit,
              nameFull: lease.nameFull,
              originalAmount: bill.totalAmount,
              daysProrated: overlapDays,
              daysProratedText: daysProrated,
              proratedAmount: bigProportion.times(totalAmount).round(2).toString(),
              leaseDates: `${leaseMoveIn} - ${leaseMoveOut}`,
              billDates: `${bill.startService} - ${bill.endService}`,
              leaseId: lease.leaseId,
              objectKey: bill.objectKey,
              type: type,
              description: `${utilityVendor} Billback: ${bill.startService} - ${bill.endService} Copy URL to view bill: https://admin-portal-utility-bills.s3.amazonaws.com/${bill.objectKey}`,
              pk: bill.pk,
              sk: bill.sk,
              billedback: bill?.billedback || null,
            });
          }
        });
      });
    }
  });
  console.log(overlaps);
  return overlaps;
}
