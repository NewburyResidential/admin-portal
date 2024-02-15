import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { copyS3Object } from 'src/utils/services/cc-expenses/uploadS3Image';
import { parse, compareAsc } from 'date-fns';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ReceiptTable({ setOpen, setLoading, id, recentReceipts, transactionIndex }) {
  const [filter, setFilter] = useState('');
  const { setValue } = useFormContext();

  const modifiedByOptions = [...new Set(recentReceipts.map((receipt) => receipt.modifiedBy))];

  const sortedReceipts = recentReceipts.sort((a, b) => {
    const dateA = parse(a.modifiedOn, 'MM/dd/yyyy', new Date());
    const dateB = parse(b.modifiedOn, 'MM/dd/yyyy', new Date());
    return compareAsc(dateB, dateA);
  });

  const filteredReceipts = filter ? sortedReceipts.filter((receipt) => receipt.modifiedBy === filter) : sortedReceipts;

  const handleViewReceipt = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };
  const handleChooseReceipt = async (objectKey, fileName) => {
    setLoading(true);
    setOpen(false);

    try {
      const response = await copyS3Object('admin-portal-suggested-receipts', 'admin-portal-receipts', objectKey, id, fileName);
      if (response) {
        setValue(`transactions[${transactionIndex}].receipt`, response.fileUrl);
        setValue(`transactions[${transactionIndex}].tempPdfReceipt`, response.tempPdfUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Autocomplete
        disablePortal
        id="employee-filter"
        options={modifiedByOptions}
        sx={{ width: 300, marginBottom: 2, mt: 3 }}
        renderInput={(params) => <TextField {...params} label="Filter By Employee" />}
        value={filter}
        onChange={(event, newValue) => {
          setFilter(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          if (!newInputValue) {
            setFilter('');
          }
        }}
      />
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ width: '36%' }}>
                File Name
              </TableCell>
              <TableCell align="center" style={{ width: '16%' }}>
                Uploaded By
              </TableCell>
              <TableCell align="center" style={{ width: '16%' }}>
                Date Uploaded
              </TableCell>
              <TableCell align="center" style={{ width: '16%' }}>
                Recognizer Amount
              </TableCell>
              <TableCell align="center" style={{ width: '16%', whiteSpace: 'nowrap' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReceipts.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="left">{row.fileName}</TableCell>
                <TableCell align="center">{row.modifiedBy}</TableCell>
                <TableCell align="center">{row.modifiedOn}</TableCell>
                <TableCell align="center">{row.total ? `$${row.total}` : ''}</TableCell>
                <TableCell align="right">
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const encodedObjectKey = encodeURIComponent(row.objectKey);
                        handleViewReceipt(`https://admin-portal-suggested-receipts.s3.amazonaws.com/${encodedObjectKey}`);
                      }}
                      sx={{ marginRight: '16px', width: '100px' }}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleChooseReceipt(row.objectKey, row.fileName);
                      }}
                      sx={{ width: '100px' }}
                    >
                      Choose
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
