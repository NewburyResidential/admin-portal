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
import updateResource from 'src/utils/services/intranet/update-resource';
import deleteResource from 'src/utils/services/intranet/delete-resource';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';

export default function EditResourceForm({ resource, handleClose, userName, resourceType, groupId, categoryId, categoryOptions }) {
  const { showResponseSnackbar } = useSnackbar();
  const [showAlert, setShowAlert] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const addResource = !resource;

  const defaultValues = {
    pk: uuidv4(),
    label: '',
    description: '',
    logo: '',
    roles: ['public'],
    url: '',
    file: '',
    uploadType: 'website',
    resourceType,
    group: resourceType === 'resources' ? groupId : null,
    category: resourceType === 'resources' ? categoryId : null,
  };

  const methods = useForm({
    defaultValues: resource || defaultValues,
    resolver: yupResolver(resourceSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    const { pk, ...rest } = data;
    const attributes = { ...rest, updatedBy: userName, updatedOn: getTodaysDate() };

    const response = await updateResource({ pk, attributes });
    showResponseSnackbar(response);
    if (response.severity === 'success') {
      handleClose();
    } else {
      setShowAlert(true);
    }
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    const response = await deleteResource({ pk: resource.pk });
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
        <DialogTitle>{addResource ? 'Add Resource' : 'Update Resource'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {addResource ? 'Add a new Resource by filling out the information below' : 'Update the existing resource below'}
          </DialogContentText>
          <Inputs resourceType={resourceType} categoryOptions={categoryOptions} />
          {showAlert && <Alert severity="error">Issue {addResource ? 'Adding' : 'Updating'} Resource</Alert>}
        </DialogContent>
        <Buttons handleClose={handleClose} handleDelete={handleDelete} loadingDelete={loadingDelete} addResource={addResource} />
      </form>
    </FormProvider>
  );
}
