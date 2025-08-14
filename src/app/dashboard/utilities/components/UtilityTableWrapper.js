'use client';

import { useState } from 'react';
import UtilityTable from './UtilityTable';
import getUtilityBillsByMonth from 'src/utils/services/utilities/get-utility-bills-by-month';
import UploadMultipleFiles from 'src/components/upload-files/UploadMultipleFiles';
import UploadDialog from './UploadDialog';
import ReportBillBack from './ReportBillBack';

export default function UtilityTableWrapper({ utilities, newburyAssets }) {
  const [utilityBills, setUtilityBills] = useState([]);
  const [leases, setLeases] = useState([]);
  const [files, setFiles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({
    period: '',
    propertyId: '',
    utilityId: '',
    status: 'all',
  });

  const refreshData = async () => {
    if (filters?.period && filters?.propertyId && filters?.utilityId) {
      const freshData = await getUtilityBillsByMonth(filters);
      setUtilityBills(freshData);
    }
  };

  const handleUpload = (uploadedFiles) => {
    setOpenDialog(true);
  };
  

  return (
    <>
      <UploadDialog newburyAssets={newburyAssets} files={files} setFiles={setFiles} setOpenDialog={setOpenDialog} openDialog={openDialog} />
      <UploadMultipleFiles
        accept={{
          'application/pdf': ['.pdf'],
        }}
        onUpload={handleUpload}
        files={files}
        setFiles={setFiles}
      />
      <br />
      <UtilityTable
        utilityBills={utilityBills}
        setUtilityBills={setUtilityBills}
        utilities={utilities}
        onRefresh={refreshData}
        setLeases={setLeases}
        setFilters={setFilters}
        filters={filters}
        newburyAssets={newburyAssets}
      />
      <ReportBillBack leases={leases} utilityBills={utilityBills} refreshData={refreshData} />
    </>
  );
}
