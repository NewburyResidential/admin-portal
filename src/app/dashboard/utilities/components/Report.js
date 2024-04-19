'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import ReportBillBack from './ReportBillBack';

import EditUtilityBill from './EditUtilityBillDialog';
import UtilitySeach from './UtilitySeach';
import UtilitiesTable from './UtilitiesTable';
import UploadUtilityBills from './UploadUtilityBills/UploadUtilityBills';
import { format } from 'date-fns';

export default function Report({ leases }) {
  const [utilityBills, setUtilityBills] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedUtility, setSelectedUtility] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MM/yyyy'));
  const [filterStatus, setFilterStatus] = useState('unapproved');

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
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <UtilitiesTable
        selectedUtility={selectedUtility}
        selectedProperty={selectedProperty}
        utilityBills={utilityBills}
        setUtilityBills={setUtilityBills}
        setEditDialog={setEditDialog}
        selectedMonth={selectedMonth}
        filterStatus={filterStatus}
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
