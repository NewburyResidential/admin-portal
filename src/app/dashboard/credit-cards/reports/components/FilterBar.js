'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import DropDownAssets from './DropDownAssets';
import TextFieldPostDate from './TextFieldPostDate';
import getTransactions from 'src/utils/services/CCExpenses/getTransactions';

export default function FilterBar({ setTransactions, totalAmount, transactions }) {
  const [asset, setAsset] = useState(null);
  const [postDate, setPostDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    setLoading(true);
    let [month, year] = postDate.split('/');
    month = month.padStart(2, '0');
    const formattedPostDate = `${month}/${year}`;
    const response = await getTransactions(formattedPostDate);
    let newTransactionsArray = [];

    if (response) {
      newTransactionsArray = response
        .filter((transaction) => transaction.status === 'approved')
        .map((transaction) => {
          return transaction.allocations
            .filter((allocation) => {
              return asset ? allocation.asset.id === asset.id : true;
            })
            .map((allocation) => {
              return {
                billedPropertyName: allocation.asset ? allocation.asset.label : '',
                billedPropertyId: allocation.asset ? allocation.asset.id : '',
                postDate: transaction.postedDate,
                AccountingType: allocation.asset ? allocation.asset.accountingSoftware : '',
                transactionId: transaction.id,
                note: allocation.note,
                purchasedBy: transaction.accountName,
                merchant: transaction.merchant,
                name: transaction.name,
                receipt: transaction.receipt || '',
                gl: allocation.glAccount ? allocation.glAccount.accountName : '',
                amount: allocation.amount,
              };
            });
        })
        .flat();
    }
    console.log(newTransactionsArray);
    setTransactions(newTransactionsArray);
    setLoading(false);
  };
  const exportToExcel = () => {
    const assets = asset ? asset.label : 'All Properties';
    const date = postDate.replace('/', '.');
    const data = transactions.map((transaction) => ({
      'Billed Property Name': transaction.billedPropertyName,
      'Billed Property ID': transaction.billedPropertyId,
      'Post Date': transaction.postDate,
      'Accounting Type': transaction.AccountingType,
      'Transaction ID': transaction.transactionId,
      Note: transaction.note,
      'Purchased By': transaction.purchasedBy,
      Merchant: transaction.merchant,
      Name: transaction.name,
      Receipt: transaction.receipt,
      'GL Account': transaction.gl,
      Amount: transaction.amount,
    }));

    data.push({
      'Billed Property Name': '',
      'Billed Property ID': '',
      'Post Date': '',
      'Accounting Type': '',
      'Transaction ID': '',
      Note: '',
      'Purchased By': '',
      Merchant: '',
      Name: '',
      Receipt: '',
      'GL Account': '',
      Amount: totalAmount.toFixed(2),
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    XLSX.writeFile(workbook, `CC - ${date} ${assets}.xlsx`);
  };

  const handleExport = () => {
    exportToExcel();
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextFieldPostDate postDate={postDate} setPostDate={setPostDate} />
        <DropDownAssets setAsset={setAsset} asset={asset} />
        <LoadingButton loading={loading} onClick={handleFilter} sx={{ width: '100px', height: '36px' }} variant="contained" color="primary">
          Filter
        </LoadingButton>
        <Button onClick={handleExport} sx={{ width: '100px', height: '36px', ml: -1 }} variant="outlined" color="primary">
          Export
        </Button>
      </Box>

      <Card sx={{ p: 2, width: '200px' }}>
        <Typography variant="body1" component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
          Total: ${totalAmount.toFixed(2)}
        </Typography>
      </Card>
    </Box>
  );
}
