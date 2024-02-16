'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ReportBillBack from './ReportBillBack';

import IconButton from '@mui/material/IconButton';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import EditUtilityBill from './EditUtilityBillDialog';
import Big from 'big.js';

export default function Report({ leases, utilityBills }) {
  //console.log(leases);
  // console.log(utilityBills);

  const [editDialog, setEditDialog] = useState({ open: false, utilityBill: {} });

  let totalElectric = new Big(0);
  let totalWater = new Big(0);
  let totalGas = new Big(0);
  let totalMiscellaneous = new Big(0);

  utilityBills.forEach((bill) => {
    totalElectric = totalElectric.plus(bill.electricAmount || 0);
    totalWater = totalWater.plus(bill.waterAmount || 0);
    totalGas = totalGas.plus(bill.gasAmount || 0);
    totalMiscellaneous = totalMiscellaneous.plus(bill.miscellaneousAmount || 0);
  });

  const totalAmount = totalElectric.plus(totalWater).plus(totalMiscellaneous).plus(totalGas);

  return (
    <div>
      {editDialog.open && <EditUtilityBill editDialog={editDialog} setEditDialog={setEditDialog} />}
      <h2>Utility Bills Report</h2>
      <TableContainer component={Paper}>
        <Table aria-label="utility bills table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Account Number</TableCell>
              <TableCell align="center">Building</TableCell>
              <TableCell align="center">Unit</TableCell>
              <TableCell align="center">Start Service</TableCell>
              <TableCell align="center">End Service</TableCell>
              <TableCell align="center">
                <div>Electric</div>
                <div>${totalElectric.toString()}</div>
              </TableCell>
              <TableCell align="center">
                <div>Water</div>
                <div>${totalWater.toString()}</div>
              </TableCell>
              <TableCell align="center">
                <div>Gas</div>
                <div>${totalGas.toString()}</div>
              </TableCell>
              <TableCell align="center">
                <div>Miscellaneous</div>
                <div>${totalMiscellaneous.toString()}</div>
              </TableCell>
              <TableCell align="center">
                <div>Total</div>
                <div>${totalAmount.toString()}</div>
              </TableCell>
              <TableCell align="center">View</TableCell>
              <TableCell align="center">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {utilityBills.map((bill) => {
              const electricAmount = new Big(bill?.electricAmount || 0);
              const waterAmount = new Big(bill?.waterAmount || 0);
              const gasAmount = new Big(bill?.gasAmount || 0);
              const miscellaneousAmount = new Big(bill?.miscellaneousAmount || 0);

              const sum = electricAmount.plus(waterAmount).plus(miscellaneousAmount).plus(gasAmount);

              const isEqualToTotal = sum.eq(new Big(bill.totalAmount));
              return (
                <TableRow sx={{ backgroundColor: !isEqualToTotal && '#FFCCCC' }} key={bill.accountNumber}>
                  <TableCell align="center" component="th" scope="bill">
                    {bill.accountNumber}
                  </TableCell>
                  <TableCell align="center">{bill.building}</TableCell>
                  <TableCell align="center">{bill.unit}</TableCell>
                  <TableCell align="center">{bill.startService}</TableCell>
                  <TableCell align="center">{bill.endService}</TableCell>
                  <TableCell align="center">{electricAmount.eq(0) ? '' : `$${electricAmount.toString()}`}</TableCell>
                  <TableCell align="center">{waterAmount.eq(0) ? '' : `$${waterAmount.toString()}`}</TableCell>
                  <TableCell align="center">{gasAmount.eq(0) ? '' : `$${gasAmount.toString()}`}</TableCell>
                  <TableCell align="center">{miscellaneousAmount.eq(0) ? '' : `$${miscellaneousAmount.toString()}`}</TableCell>
                  <TableCell align="center">${bill.totalAmount}</TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="edit">
                      <ImageSearchIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        setEditDialog({ open: true, utilityBill: bill });
                      }}
                    >
                      <ModeEditOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ReportBillBack leases={leases} utilityBills={utilityBills} />
    </div>
  );
}
