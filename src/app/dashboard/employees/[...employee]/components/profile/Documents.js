import { useState, useRef } from 'react';
import Iconify from 'src/components/iconify';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';

import DocumentCard from './DocumentCard';
import EditFileDialog from 'src/app/dashboard/employees/[...employee]/components/profile/editFile/Dialog';

const handleFileChange = (event) => {
  if (event.target.files.length > 0) {
    setEditDialog({ open: true, documentData: { file: event.target.files[0], employeePk: employee.pk } });
  }
};

const handleButtonClick = () => {
  fileInputRef.current.click();
};

export default function Documents({ employee, user }) {
  const [editDialog, setEditDialog] = useState({ open: false });
  const fileInputRef = useRef(null);

  return (
    <>
      <EditFileDialog
        open={editDialog.open}
        documentData={editDialog.documentData}
        userName={user.name}
        handleClose={() => {
          setEditDialog({ ...editDialog, open: false });
          fileInputRef.current.value = '';
        }}
      />
      <Typography variant="h6" mb={2} mt={6}>
        Required Forms
      </Typography>
      <Grid container spacing={3}>
        {employee.requiredDocuments.map((document) => (
          <Grid item xs={6}>
            <DocumentCard document={document} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 6, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 0, mt: 0, mr: 1 }}>
          Other Documents
        </Typography>
        <IconButton onClick={handleButtonClick} sx={{ p: 0, ml: 1, fontSize: '2rem' }}>
          <Iconify icon="gala:add" width={28} />
        </IconButton>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
      </Box>
      <Grid container spacing={3}>
        {employee.otherDocuments.map((document) => (
          <Grid item xs={6}>
            <DocumentCard document={document} setEditDialog={setEditDialog} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
