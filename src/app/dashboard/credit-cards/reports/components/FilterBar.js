'use client';

import { useState } from 'react';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import DropDownAssets from './DropDownAssets';
import TextFieldPostDate from './TextFieldPostDate';
import getTransactions from 'src/utils/services/cc-expenses/getTransactions';
import { uploadPreEntrataTransactions } from 'src/utils/services/cc-expenses/uploadPreEntrataTransactions';

export default function FilterBar({ setTransactions, totalAmount, transactions }) {
  const [assets, setAssets] = useState(null);
  const [postDate, setPostDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    setLoading(true);
    const splitDate = postDate.split('/');
    const month = splitDate[0].padStart(2, '0');
    const year = splitDate[1];
    const formattedPostDate = `${month}/${year}`;
    const response = await getTransactions(formattedPostDate);
    let newTransactionsArray = [];

    if (response) {
      newTransactionsArray = response
        .filter((transaction) => transaction.status === 'approved')
        .map((transaction) => {
          return transaction.allocations
            .filter((allocation) => {
              return assets && Array.isArray(assets) && assets.length > 0 ? assets.some((asset) => asset.waveARId === allocation.asset.waveARId) : true;
            })

            .map((allocation) => {
              console.log(allocation);
              console.log(transaction);
              console.log('------------------------');
              return {
                billedPropertyName: allocation.asset ? allocation.asset.label : '',
                billedPropertyId: allocation.asset ? allocation.asset.id : '',
                postDate: transaction.postedDate,
                accountingType: allocation.asset ? allocation.asset.accountingSoftware : '',
                transactionId: transaction.sk,
                note: allocation.note,
                purchasedBy: transaction.accountName,
                approvedBy: transaction.approvedBy,
                merchant: transaction.merchant,
                name: transaction.name,
                tempPdfReceipt: transaction.tempPdfReceipt || '',
                receipt: transaction.receipt || '',
                gl: allocation.glAccount ? allocation.glAccount.accountName : '',
                amount: allocation.amount,
                glAccountId: allocation.glAccount ? allocation.glAccount.accountId : '',
                apPayeeId: transaction.vendor ? transaction.vendor.vendorId : '',
                apPayeeLocationId: transaction.vendor ? transaction.vendor.id : '',
                id: transaction.sk,
                billingCycle: transaction.billingCycle,
                preEntrataEntered: transaction.preEntrataEntered || false,
              };
            });
        })
        .flat();
    }

    setTransactions(newTransactionsArray);
    setLoading(false);
  };

  const exportToExcel = () => {
    const assetLabels = assets && Array.isArray(assets) && assets.length > 0 ? assets.map((asset) => asset.label) : ['All Properties'];
    const date = postDate.replace('/', '.');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    worksheet.columns = [
      { header: 'Billed Property Name', key: 'billedPropertyName', width: 18 },
      { header: 'Billed Property ID', key: 'billedPropertyId', width: 10 },
      { header: 'Post Date', key: 'postDate', width: 15 },
      { header: 'Accounting Type', key: 'accountingType', width: 10 },
      { header: 'Transaction ID', key: 'transactionId', width: 10 },
      { header: 'Note', key: 'note', width: 20 },
      { header: 'Purchased By', key: 'purchasedBy', width: 20 },
      { header: 'Merchant', key: 'merchant', width: 20 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Receipt', key: 'receipt', width: 20 },
      { header: 'GL Account', key: 'gl', width: 20 },
      { header: 'Amount', key: 'amount', width: 10, style: { numFmt: '"$"#,##0.00_);("$"#,##0.00)' } },
    ];

    transactions.forEach((transaction) => {
      worksheet.addRow(transaction);
    });

    const totalRow = worksheet.addRow({
      billedPropertyName: '',
      billedPropertyId: '',
      postDate: '',
      AccountingType: '',
      transactionId: '',
      note: '',
      purchasedBy: '',
      merchant: '',
      name: '',
      receipt: '',
      gl: '',
      amount: totalAmount.toFixed(2),
    });

    totalRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { bold: true };
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), `CC - ${date} ${assetLabels.join('_')}.xlsx`);
    });
  };

  const handleExport = () => {
    exportToExcel();
  };

  const enterPreEntrata = async () => {
    console.log('Enter Pre Entrata');

    //console.log(transactions);
    for (let i = 0; i < transactions.length; i++) {
      try {
        const transaction = transactions[i];
        console.log('--------------------------------');
        console.log('Transaction:', transaction);
        if (!transaction.preEntrataEntered && transaction.accountingType === 'pre-entrata' && assets.length < 2) {
          console.log('Entering...');
          const assetId = assets[0].accountId;
          const response = await uploadPreEntrataTransactions(transaction, assetId);
          console.log('response', response);
          console.log('Entrata:', response?.response?.result?.apBatch?.apHeaders?.apHeader[0]?.message);
        } else {
          console.log('Transaction already entered');
        }
      } catch (error) {
        console.log('Error entering Pre Entrata:', error);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextFieldPostDate postDate={postDate} setPostDate={setPostDate} />
        <DropDownAssets setAssets={setAssets} assets={assets} />
        <LoadingButton loading={loading} onClick={handleFilter} sx={{ width: '100px', height: '36px' }} variant="contained" color="primary">
          Filter
        </LoadingButton>
        <Button onClick={handleExport} sx={{ width: '100px', height: '36px', ml: -1 }} variant="outlined" color="primary">
          Export
        </Button>
        <Button onClick={enterPreEntrata} sx={{ width: '100px', height: '36px', ml: -1 }} variant="outlined" color="primary">
          Create
        </Button>
      </Box>

      <Card sx={{ p: 2, width: '200px' }}>
        <Typography variant="body1" component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
          Total: ${Number(totalAmount.toFixed(2)).toLocaleString()}
        </Typography>
      </Card>
    </Box>
  );
}
