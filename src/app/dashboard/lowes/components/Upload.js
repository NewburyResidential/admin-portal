'use client';

import { useState } from 'react';
import Papa from 'papaparse';

import Box from '@mui/material/Box';
import { LoadingScreen } from 'src/components/loading-screen';
import UploadMultiFiles from 'src/components/upload-files/UploadMultiFiles';
import parseCurrency from './utils/parse-currency';

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
              store: curr.Store,
            };
          }

          //add ignore promotional
          let paymentsApplied;

          if (curr['Total Invoice'] !== '' && curr['Total Invoice'] !== null && curr['Total Invoice'] !== ' ') {
            const totalInvoice = parseCurrency(curr['Total Invoice']);
            paymentsApplied = parseCurrency(curr['Payments Applied']);
            const updatedTotalInvoice = totalInvoice.plus(paymentsApplied);
            acc[invoiceNum].totalInvoice = updatedTotalInvoice.toString();
          }
          if (curr.Tax !== '' && curr['Total Invoice'] !== null && curr['Total Invoice'] !== ' ') {
            const tax = parseCurrency(curr.Tax);
            const updatedTax = tax.plus(paymentsApplied);
            acc[invoiceNum].tax = updatedTax.toString();
            return acc;
          }
          if (
            curr.SkuDesc === 'DELIVERY FEE' ||
            curr.SkuDesc === '3-7DAY GROUND SHPCHRG 301' ||
            curr.SkuDesc === '3-7DAY GROUND SHIPCHRG 31'
          ) {
            acc[invoiceNum].shipping = curr['Ex Price'];
            return acc;
          }
          if (curr.SKU === null || curr.SKU === '' || curr.SKU === ' ' || curr.SkuDesc === 'PROMOTIONAL DISCOUNT APPL') {
            return acc;
          }
          acc[invoiceNum].lineItems.push({
            sku: curr.SKU,
            skuDescription: curr.SkuDesc,
            cost: curr.Price,
            totalCost: curr['Ex Price'],
            qty: curr.Quantity,
          });

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
