'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ReportBillBack from './ReportBillBack';

import IconButton from '@mui/material/IconButton';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

export default function Report({ leases, utilityBills }) {
  console.log(leases);
  console.log(utilityBills);

  // Function to calculate the sum of a particular column
  const sumColumn = (columnName) => {
    return utilityBills.reduce((sum, bill) => sum + (bill[columnName] || 0), 0);
  };

  // Calculate sums for each column
  const totalElectricAmount = sumColumn('electricAmount');
  const totalWaterAmount = sumColumn('waterAmount');
  const totalMiscellaneousAmount = sumColumn('miscellaneousAmount');
  const totalAmount = sumColumn('totalAmount');

  return (
    <div>
      <h2>Utility Bills Report</h2>
      <TableContainer component={Paper}>
        <Table aria-label="utility bills table">
          <TableHead>
            <TableRow>
              <TableCell>Account Number</TableCell>
              <TableCell>Building</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Start Service</TableCell>
              <TableCell>End Service</TableCell>
              <TableCell>Electric</TableCell>
              <TableCell>Water</TableCell>
              <TableCell>Gas</TableCell>
              <TableCell>Misc</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>View</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {utilityBills.map((row) => (
              <TableRow key={row.accountNumber}>
                <TableCell component="th" scope="row">
                  {row.accountNumber}
                </TableCell>
                <TableCell>{row.building}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.startService}</TableCell>
                <TableCell>{row.endService}</TableCell>
                <TableCell>{row.electricAmount}</TableCell>
                <TableCell>{row.waterAmount}</TableCell>
                <TableCell>{row.miscellaneousAmount}</TableCell>
                <TableCell />
                <TableCell>{row.totalAmount}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit">
                    <ImageSearchIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton aria-label="edit">
                    <ModeEditOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* Final row for total sums */}
            <TableRow>
              <TableCell colSpan={3} align="right">
                Total
              </TableCell>
              <TableCell />
              <TableCell />

              <TableCell>{totalElectricAmount.toFixed(2)}</TableCell>
              <TableCell>{totalWaterAmount.toFixed(2)}</TableCell>
              <TableCell>{totalMiscellaneousAmount.toFixed(2)}</TableCell>
              <TableCell>{totalAmount.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <ReportBillBack leases={leases} utilityBills={utilityBills} />
    </div>
  );
}
