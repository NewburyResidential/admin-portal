import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { resourceSchema } from './resource-schema';
import { getTodaysDate } from 'src/utils/format-time';

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

import Inputs from './Inputs';
import Buttons from './Buttons';

import { fRemoveExtension } from 'src/utils/formatting/format-string';
import { deleteDocument, updateDocument, updateDocumentLabel } from 'src/utils/services/employees/updateDocument';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';

export default function EditFileForm({ documentData, handleClose, userName }) {
  const { showResponseSnackbar } = useSnackbar();
  const [showAlert, setShowAlert] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const newDocument = documentData?.file ? true : false;

  const methods = useForm({
    defaultValues: newDocument
      ? {
          fileId: `DOCUMENT#${uuidv4()}`,
          label: fRemoveExtension(documentData.file.name),
          file: documentData.file,
          employeePk: documentData.employeePk,
        }
      : {
          fileId: documentData.sk,
          label: documentData.label,
          file: { name: documentData.fileName, type: 'url' },
          employeePk: documentData.pk,
        },
    // resolver: yupResolver(resourceSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    const fileData = new FormData();
    const { file, ...rest } = data;

    let response;

    if (file.type === 'url') {
      response = await updateDocumentLabel({
        ...rest,
        updatedBy: userName,
        updatedOn: getTodaysDate(),
      });
    } else {
      fileData.append('file', data.file);
      response = await updateDocument(fileData, {
        ...rest,
        bucket: 'newbuy-employee-documents',
        updatedBy: userName,
        updatedOn: getTodaysDate(),
      });
    }

    if (response) {
      handleClose();
    } else {
      setShowAlert(true);
    }
  };

  const handleDelete = async () => {
    setLoadingDelete(true);

    const response = await deleteDocument({
      data: documentData,
      successTitle: 'Document deleted successfully',
      errorTitle: 'Error deleting document',
    });
    showResponseSnackbar(response);
    if (response.severity === 'success') {
      handleClose();
    } else {
      setShowAlert(true);
    }
    setLoadingDelete(false);
  };

  return (
    <FormProvider {...methods}>
      <form action={handleSubmit(onSubmit)}>
        <DialogTitle>{newDocument ? 'Add Document' : 'Update Document'}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Update the file below
          </DialogContentText> */}
          <Inputs />
          {showAlert && <Alert severity="error">{newDocument ? 'Issue Adding Document' : 'Issue Updating Document'}</Alert>}
        </DialogContent>
        <Buttons newDocument={newDocument} handleClose={handleClose} handleDelete={handleDelete} loadingDelete={loadingDelete} />
      </form>
    </FormProvider>
  );
}
