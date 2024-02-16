'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import EditUtilityBill from './EditUtilityBillDialog';

export default function ReportBillBack({ leases, utilityBills }) {
  const billBacks = calculateOverlaps(leases, utilityBills);

  return (
    <div>
    
      <h2>Bill Backs Report</h2>
      <TableContainer component={Paper}>
        <Table aria-label="bill backs table">
          <TableHead>
            <TableRow>
              <TableCell>Account Number</TableCell>
              <TableCell>Building</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Owed Amount</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {billBacks.map((bill, index) => (
              <TableRow key={index}>
                <TableCell>{bill.accountNumber}</TableCell>
                <TableCell>{bill.building}</TableCell>
                <TableCell>{bill.unit}</TableCell>
                <TableCell>{bill.nameFull}</TableCell>
                <TableCell align="right">{bill.owedAmount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}


function calculateOverlaps(leases, utilityBills) {
  const overlaps = [];

  utilityBills.forEach((bill) => {
    if (!bill.startService || !bill.endService || !bill.unit || !bill.building) {
      return;
    }

    const billStart = new Date(bill.startService);
    const billEnd = new Date(bill.endService);
    const billBuilding = bill.building;

    const buildingLeases = leases[billBuilding];
    if (buildingLeases && typeof buildingLeases === 'object') {
      Object.entries(buildingLeases).forEach(([unit, leaseArray]) => {
        leaseArray.forEach((lease) => {
          const moveIn = new Date(lease.moveInDate);
          const moveOut = lease.moveOutDate ? new Date(lease.moveOutDate) : new Date();

          if (bill.unit === unit && billStart < moveOut && billEnd > moveIn) {
            const overlapStart = billStart < moveIn ? moveIn : billStart;
            const overlapEnd = billEnd > moveOut ? moveOut : billEnd;
            const totalDays = (billEnd - billStart) / (1000 * 60 * 60 * 24);
            const overlapDays = (overlapEnd - overlapStart) / (1000 * 60 * 60 * 24);
            const proportion = overlapDays / totalDays;

            overlaps.push({
              accountNumber: bill.accountNumber,
              building: billBuilding,
              unit,
              nameFull: lease.nameFull,
              owedAmount: bill.totalAmount * proportion,
            });
          }
        });
      });
    }
  });

  return overlaps;
}
