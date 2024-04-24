'use client';
import { useState } from 'react';
import Papa from 'papaparse';

import Box from '@mui/system/Box';
import { LoadingScreen } from 'src/components/loading-screen';
import UploadMultiFiles from 'src/components/upload-files/UploadMultiFiles';

const Upload = ({ setGroupedInvoices, setCurrentStep }) => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file) => {
    setLoading(true);
    Papa.parse(file, {
      header: true,
      transform: (value, column) => {
        if (column === 'SKU') {
          return value.replace(/^0+/, '');
        }
        return value;
      },
      complete: (results) => {
        const grouped = results.data.reduce((acc, curr) => {
          const invoiceNum = curr['Invoice#'];
          if (!acc[invoiceNum]) {
            if (invoiceNum === '' || invoiceNum === null || invoiceNum === undefined) return acc;
            acc[invoiceNum] = {
              lineItems: [],
              totalInvoice: curr['Total Invoice'],
              jobName: curr['PO#'],
              buyerName: curr['Buyer Name'],
              store: curr['Store'],
            };
          }

          //add ignore promotional

          if (curr['Total Invoice'] !== '' && curr['Total Invoice'] !== null && curr['Total Invoice'] !== ' ') {
            acc[invoiceNum].totalInvoice = curr['Total Invoice'];
          }
          if (curr['Tax'] !== '' && curr['Total Invoice'] !== null && curr['Total Invoice'] !== ' ') {
            acc[invoiceNum].tax = curr['Tax'];
            return acc;
          } else if (curr['SkuDesc'] === 'DELIVERY') {
            acc[invoiceNum].tax = curr['Ex Price'];
            return acc;
          } else if (curr['SKU'] === null || curr['SKU'] === '' || curr['SKU'] === ' ' || curr['SkuDesc'] === 'PROMOTIONAL DISCOUNT APPL') {
            return acc;
          } else {
            acc[invoiceNum].lineItems.push({
              sku: curr['SKU'],
              skuDescription: curr['SkuDesc'],
              cost: curr['Price'],
              totalCost: curr['Ex Price'],
              qty: curr['Quantity'],
            });
          }
          return acc;
        }, {});
        setGroupedInvoices(grouped);
        setCurrentStep(1);
        setLoading(false);
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <LoadingScreen />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8, mx: 6 }}>
      <UploadMultiFiles
        onChange={handleFileUpload}
        accept={{
          'text/csv': ['.csv'],
          'application/vnd.ms-excel': ['.xls'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        }}
      />
    </Box>
  );
};

export default Upload;
