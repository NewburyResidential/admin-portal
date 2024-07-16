import React, { useState, useRef } from 'react';
import Iconify from 'src/components/iconify';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { pandaLinkToDocument } from 'src/utils/services/pandadoc/link-to-document';
import { pandaLinkToIframe } from 'src/utils/services/pandadoc/link-to-iframe';

import DocumentCard from '../DocumentCard';

export default function OtherDocuments({ employee, editDialog, setEditDialog, employeePk, fileInputRef }) {

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setEditDialog({ open: true, documentData: {file: event.target.files[0], employeePk: employeePk }});
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 6, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 0, mt: 0, mr: 1 }}>
        Other Documents
      </Typography>
      <IconButton onClick={handleButtonClick} sx={{ p: 0, ml: 1, fontSize: '2rem' }}>
        <Iconify icon="gala:add" width={28} />
      </IconButton>
      <input
        type="file"
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
      />
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
