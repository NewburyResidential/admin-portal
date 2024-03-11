'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Container } from '@mui/material';
import ReportBillBack from './ReportBillBack';

import IconButton from '@mui/material/IconButton';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import EditUtilityBill from './EditUtilityBillDialog';
import Big from 'big.js';
import UtilitySeach from './UtilitySeach';
import UtilitiesTable from './UtilitiesTable';
import UploadMultiFiles from 'src/components/upload-files/UploadMultiFiles';
import UploadUtilityBills from './UploadUtilityBills/UploadUtilityBills';
import { format } from 'date-fns';

export default function Report({ leases }) {
  const [utilityBills, setUtilityBills] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedUtility, setSelectedUtility] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MM/yyyy'));

  const [editDialog, setEditDialog] = useState({ open: false, utilityBill: {} });

  return (
    <div>
      {editDialog.open && (
        <EditUtilityBill
          editDialog={editDialog}
          setEditDialog={setEditDialog}
          setUtilityBills={setUtilityBills}
          pk={selectedMonth}
          sk={`${selectedProperty?.id}#${selectedUtility?.id}#`}
        />
      )}
      <UtilitySeach
        setUtilityBills={setUtilityBills}
        setSelectedUtility={setSelectedUtility}
        selectedUtility={selectedUtility}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <UtilitiesTable
        selectedUtility={selectedUtility}
        selectedProperty={selectedProperty}
        utilityBills={utilityBills}
        setUtilityBills={setUtilityBills}
        setEditDialog={setEditDialog}
        selectedMonth={selectedMonth}
      />

      <ReportBillBack
        leases={leases}
        utilityBills={utilityBills}
        setUtilityBills={setUtilityBills}
        pk={selectedMonth}
        sk={`${selectedProperty?.id}#${selectedUtility?.id}#`}
      />

      <Box mt={5} />
      <UploadUtilityBills />
    </div>
  );
}
