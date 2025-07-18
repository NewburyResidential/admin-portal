'use client';

/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */

import { useState } from 'react';
import Big from 'big.js';
import { differenceInCalendarDays, isBefore, isAfter, parse } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import LoadingButton from '@mui/lab/LoadingButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import enterUtilityBillbacks from 'src/utils/services/utilities/enter-utility-billbacks';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
// import { apartmentFormatRegex } from './apartmentFormatRegex'; // Removed unused import

//import getUtilityBills from 'src/utils/services/utility-bills/getUtilityBills';
//import enterBillBackChargesIntoEntrata from 'src/utils/services/utility-bills/enterBillbackChargesIntoEntrata';

// Define the mapping from normalized building identifier to building letter

export default function ReportBillBack({ leases, utilityBills, refreshData }) {
  const { showResponseSnackbar } = useSnackbar();

  // console.log('leases', leases)
  console.log('utilityBills', utilityBills);
  const billBacks = calculateOverlaps(leases, utilityBills);
  const [selectedRows, setSelectedRows] = useState([]);
  const [billbackPending, setBillbackPending] = useState(false);

  const handleSelectRow = (index) => {
    setSelectedRows((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(billBacks.map((_, idx) => idx));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSubmit = async () => {
    setBillbackPending(true);
    const billbacksData = selectedRows.map((index) => billBacks[index]);
    try {
      const response = await enterUtilityBillbacks(billbacksData);
      showResponseSnackbar(response);
      await refreshData();
    } catch (error) {
      // handle error
    }
    setSelectedRows([]);
    setBillbackPending(false);
  };

  return (
    <Card sx={{ mt: 5, width: '100%', pb: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < billBacks.length}
                  checked={billBacks.length > 0 && selectedRows.length === billBacks.length}
                  onChange={handleSelectAll}
                  inputProps={{ 'aria-label': 'select all billbacks' }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Building</TableCell>
              <TableCell align="center">Unit</TableCell>
              <TableCell align="center">Lease Dates</TableCell>
              <TableCell align="center">Bill Dates</TableCell>
              <TableCell align="center">Days Prorated</TableCell>
              <TableCell align="center">Original Amount</TableCell>
              <TableCell align="center">Prorated Amount</TableCell>
              <TableCell align="center">View Bill</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billBacks.map((row, idx) => (
              <TableRow
                key={idx}
                selected={selectedRows.includes(idx)}
                sx={
                  row.billedback
                    ? {
                        bgcolor: '#E8F5E9',
                        color: 'grey',
                      }
                    : {}
                }
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedRows.includes(idx)} onChange={() => handleSelectRow(idx)} />
                </TableCell>
                <TableCell>{row.nameFull}</TableCell>
                <TableCell align="center">{row.building}</TableCell>
                <TableCell align="center">{row.unit}</TableCell>
                <TableCell align="center">{row.leaseDates}</TableCell>
                <TableCell align="center">{row.billDates}</TableCell>
                <TableCell align="center">{row.daysProratedText}</TableCell>
                <TableCell align="center">{row.originalAmount}</TableCell>
                <TableCell align="center">{row.proratedAmount}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" color="primary" component={Link} href={getS3Url(row.sourceFile?.key)} target="_blank">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Remove the following line: */}
      {/* <Box sx={{ backgroundColor: 'white', width: '180px', height: '50px', position: 'absolute', marginTop: '-36px' }} /> */}
      {/* Move the button below the table, with spacing */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px', mt: 2, ml: 3 }}>
        <LoadingButton variant="contained" color="primary" onClick={handleSubmit} loading={billbackPending} disabled={!selectedRows.length}>
          {selectedRows.length ? `Submit Billbacks (${selectedRows.length})` : 'Submit Billbacks'}
        </LoadingButton>
      </Box>
    </Card>
  );
}

function calculateOverlaps(leases, utilityBills) {
  console.log('leases', leases);
  const overlaps = [];
  utilityBills.forEach((bill) => {
    if (!bill.startService || !bill.endService || !bill.apartment || bill.apartment === 'common') {
      return;
    }

    const billStart = parse(bill.startService, 'MM/dd/yyyy', new Date());
    const billEnd = parse(bill.endService, 'MM/dd/yyyy', new Date());

    const { billBuilding = null, billUnit = null } = extractBuildingAndUnit(bill.apartment, bill.utilityVendor) || {};
    console.log('billbuilding', billBuilding);
    console.log('billunit', billUnit);

    const buildingLeases = leases[billBuilding];
    if (buildingLeases && typeof buildingLeases === 'object') {
      console.log('buildingLeases', buildingLeases);
      Object.entries(buildingLeases).forEach(([unit, leaseArray]) => {
        leaseArray.forEach((lease) => {
          if (billUnit?.toString() !== unit?.toString()) {
            return;
          }

          const moveIn = parse(lease.moveInDate, 'MM/dd/yyyy', new Date());
          const moveOut = lease.moveOutDate ? parse(lease.moveOutDate, 'MM/dd/yyyy', new Date()) : new Date();
          if (
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

            overlaps.push({
              invoiceNumber: bill.invoiceNumber,
              apartment: bill.apartment,
              building: billBuilding,
              unit: billUnit,
              nameFull: lease.nameFull,
              originalAmount: bill.totalAmount,
              daysProrated: overlapDays,
              daysProratedText: daysProrated,
              proratedAmount: bigProportion.times(totalAmount).round(2).toString(),
              leaseDates: `${leaseMoveIn} - ${leaseMoveOut}`,
              billDates: `${bill.startService} - ${bill.endService}`,
              leaseId: lease.leaseId,
              sourceFile: bill.sourceFile,
              utilityVendor: bill.utilityVendor,
              description: `${bill.utilityVendor} Billback: ${bill.startService} - ${bill.endService} Copy URL to view bill: ${getS3Url(bill.sourceFile?.key)}`,
              pk: bill.pk,
              sk: bill.sk,
              waterSewerAmount: bill.waterSewerAmount,
              electricAmount: bill.electricAmount,
              gasAmount: bill.gasAmount,
              billedback: bill?.billedback || null,
            });
          }
        });
      });
    }
  });

  return overlaps;
}

function extractBuildingAndUnit(apartmentString, utilityVendor) {
  console.log('billvendor', utilityVendor);
  const buildingMapping2001 = {
    '123 evie': 'A',
    '141 evie': 'B',
    '131 donetta': 'C',
    '165 donetta': 'D',
    '152 elliott': 'F',
    '220 hedges': 'G',
    '215 hedges': 'J',
    '186 hedges': 'H',
    '179 hedges': 'K',
  };
  const buildingMapping2004 = {
    '1-8': '1',
    '9-16': '2',
    '17-24': '3',
    '25-32': '4',
    '33-40': '5',
    '42-49': '7',
    '50-57': '8',
    '58-65': '9',
  };
  // const buildingMapping2003 = { // Removed unused variable
  //   '100-199': '1',
  //   '200-299': '2',
  //   '300-399': '3',
  //   '400-499': '4',
  //   '500-599': '5',
  //   '600-699': '6',
  //   '700-799': '7',
  //   '800-899': '8',
  //   '900-999': '9',
  // };

  if (utilityVendor === 'cemc') {
    const match = apartmentString.match(/(\d+\s+[A-Z\s]+)\s+LN\s+APT\s+(\d+)/i);
    if (match) {
      const buildingIdentifier = match[1].toLowerCase().trim();
      const building = buildingMapping2001[buildingIdentifier];
      const unit = match[2].trim();

      return {
        billBuilding: building || null,
        billUnit: unit || null,
      };
    }
  } else if (utilityVendor === 'brightridge') {
    const apartmentNumber = parseInt(apartmentString, 10);

    if (!Number.isNaN(apartmentNumber) && apartmentNumber >= 1 && apartmentNumber <= 65) {
      // Find which building range this apartment number falls into
      const buildingEntry = Object.entries(buildingMapping2004).find(([range]) => {
        const [start, end] = range.split('-').map((num) => parseInt(num, 10));
        return apartmentNumber >= start && apartmentNumber <= end;
      });

      if (buildingEntry) {
        return {
          billBuilding: buildingEntry[1], // The building letter
          billUnit: apartmentString.toString(), // Ensure the unit is a string
        };
      }
    }
  } else if (utilityVendor === 'mte') {
    const match = apartmentString.match(/^(\d{3})$/);
    if (match) {
      const fullNumber = match[1];
      const buildingNumber = fullNumber[0]; // First digit for building

      return {
        billBuilding: buildingNumber.toString(),
        billUnit: fullNumber, // Keep the full 3-digit number as the unit
      };
    }
  } else if (utilityVendor === 'townofashlandcitytnwater') {
    const match = apartmentString.match(/(\d+\s+[A-Za-z\s]+)\s+Ln\s+#\s+(\d+)/i);
    if (match) {
      const buildingIdentifier = match[1].toLowerCase().trim();
      const building = buildingMapping2001[buildingIdentifier];
      const unit = match[2].trim();

      return {
        billBuilding: building || null,
        billUnit: unit || null,
      };
    }
  } else if (utilityVendor === 'bwl') {
    const regex = /^(\d+)\sAPT\s(\d+)$/i;
    const match = apartmentString.match(regex);
    if (match) {
      const buildingNumber = match[1];
      const apartmentNumber = match[2];

      return {
        billBuilding: buildingNumber || null,
        billUnit: apartmentNumber || null,
      };
    }
  } else if (utilityVendor === 'cpws') {
    const regex = /^(\d{1,3})-(\d{1,3})$/;
    const match = apartmentString.match(regex);
    if (match) {
      const [, building, unit] = match;
      return {
        billBuilding: building || null,
        billUnit: unit || null,
      };
    }
  } else if (utilityVendor === 'entergy') {
    const match = apartmentString.match(/^([A-Z])(\d+)$/i);
    if (match) {
      const [, buildingLetter, unitNumber] = match;
      const formattedUnitNumber = parseInt(unitNumber, 10) < 10 ? `0${unitNumber}` : unitNumber;

      return {
        billBuilding: buildingLetter.toUpperCase() || null,
        billUnit: `${buildingLetter.toUpperCase()}${formattedUnitNumber}` || null,
      };
    }
  }

  return { billBuilding: null, billUnit: null };
}

// Function to construct the S3 URL
function getS3Url(key) {
  return `https://admin-portal-utility-bills-ai-analyzer.s3.us-east-1.amazonaws.com/${key}`;
}
