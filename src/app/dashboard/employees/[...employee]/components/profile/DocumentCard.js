import { useState, useRef } from 'react';
// @mui
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

// components
import Iconify from 'src/components/iconify';
import FileThumbnail from 'src/components/file-thumbnail';
import { Chip, CircularProgress } from '@mui/material';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { deleteDocument, updateDocument } from 'src/utils/services/employees/updateDocument';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import { s3GetSignedUrl } from 'src/utils/services/sdk-config/aws/S3';
import { getTodaysDate } from 'src/utils/format-time';

const DocumentCard = ({ document, setEditDialog }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const { showResponseSnackbar } = useSnackbar();

  const documentIsComplete = document.status === '#COMPLETE';
  const documentIsRequired = document.required;
  const popover = usePopover();

  const handleEditOtherDocument = () => {
    setEditDialog({ open: true, documentData: document });
  };

  const handleUploadRequiredDocument = async () => {
    fileInputRef.current.click();
  };

  const handleUploadRequiredDocumentChange = async (event) => {
    if (event.target.files.length > 0) {
      setLoading(true);
      const fileData = new FormData();
      const file = event.target.files[0];

      fileData.append('file', file);
      await updateDocument(fileData, {
        employeePk: document.pk,
        fileId: document.sk,
        bucket: 'newbuy-employee-documents',
        updatedBy: 'mike axio test',
        updatedOn: getTodaysDate(),
        label: document.label,
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const response = await deleteDocument({
      data: document,
      successTitle: 'Document deleted successfully',
      errorTitle: 'Error deleting document',
    });
    showResponseSnackbar(response);
    setLoading(false);
  };

  const handleView = async () => {
    const url = await s3GetSignedUrl({ bucket: 'newbuy-employee-documents', key: `${document.pk}/${document.sk}` });
    if (!url) {
      showResponseSnackbar({ severity: 'error', message: 'Error showing document' });
    }
    showResponseSnackbar({ severity: 'success', message: 'Secure URL generated' });
    window.open(url, '_blank');
  };

  const handleClick = () => {
    if (documentIsComplete) {
      handleView();
    } else {
      handleUploadRequiredDocument();
    }
  };

  const renderText = (
    <ListItemText
      primary={document.label}
      secondary={documentIsComplete ? `Uploaded on: ${document.updatedOn}` : null}
      primaryTypographyProps={{
        noWrap: true,
        typography: 'subtitle2',
      }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        alignItems: 'center',
        typography: 'caption',
        color: 'text.disabled',
        display: 'inline-flex',
      }}
    />
  );

  const renderCustomPopover = (
    <CustomPopover
      open={popover.open}
      onClose={(event) => {
        event.stopPropagation();
        popover.onClose();
      }}
      arrow="right-top"
      sx={{ width: 160 }}
    >
      <MenuItem
        onClick={(event) => {
          event.stopPropagation();
          popover.onClose();
          if (documentIsRequired) {
            handleUploadRequiredDocument();
          } else {
            handleEditOtherDocument();
          }
        }}
      >
        <Iconify icon="fluent:edit-12-filled" />
        {documentIsRequired ? (documentIsComplete ? 'Replace' : 'Upload') : 'Edit'}
      </MenuItem>
      {documentIsComplete && (
        <MenuItem
          onClick={(event) => {
            event.stopPropagation();
            handleView();
            popover.onClose();
          }}
        >
          <Iconify icon="carbon:view-filled" />
          View
        </MenuItem>
      )}
      {!documentIsRequired && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={(event) => {
              event.stopPropagation();
              handleDelete();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </>
      )}
    </CustomPopover>
  );

  return (
    <>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleUploadRequiredDocumentChange} />
      <Stack
        onClick={handleClick}
        component={Paper}
        variant="outlined"
        spacing={1}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'unset', sm: 'center' }}
        sx={{
          borderRadius: 2,
          bgcolor: documentIsComplete ? 'unset' : '#FFEDED',
          height: 78,
          cursor: 'pointer',
          position: 'relative',
          p: { xs: 2.5, sm: 2 },
          '&:hover': {
            bgcolor: documentIsComplete ? 'background.paper' : '#FFF0F0',
            boxShadow: (theme) => theme.customShadows.z4,
          },
        }}
      >
        {documentIsRequired ? (
          <Iconify icon={document.icon} width={36} height={36} sx={{ mr: 2, ml: 1 }} />
        ) : (
          <FileThumbnail file={document.fileName} sx={{ width: 36, height: 36, mr: 1 }} />
        )}

        {renderText}
        {!documentIsComplete && <Chip label="Not Complete" color="error" variant="outlined" />}
        {loading ? (
          <CircularProgress size={25} sx={{ mx: 1 }} />
        ) : (
          <>
            <IconButton
              sx={{ mr: 0 }}
              onClick={(event) => {
                event.stopPropagation();
                popover.onOpen(event);
              }}
              color={popover.open ? 'inherit' : 'default'}
            >
              <Iconify icon="bi:three-dots-vertical" width={24} />
            </IconButton>
            {renderCustomPopover}
          </>
        )}
      </Stack>
    </>
  );
};

export default DocumentCard;
