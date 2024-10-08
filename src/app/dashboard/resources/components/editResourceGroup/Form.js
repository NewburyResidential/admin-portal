import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { resourceGroupSchema } from './resource-group-schema';
import { v4 as uuidv4 } from 'uuid';
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

export default function EditResourceGroupForm({ resourceObject, group, handleClose, userName }) {
  const { showResponseSnackbar } = useSnackbar();
  const [showAlert, setShowAlert] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const addGroup = !group;
  const uniqueId = uuidv4();

  const defaultValues = {
    pk: uniqueId,
    label: '',
    icon: '',
    resourceType: 'resourceGroups',
    group: uniqueId,
  };

  const methods = useForm({
    defaultValues: group || defaultValues,
    resolver: yupResolver(resourceGroupSchema),
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

    const groupId = group.group;
    const categoriesByGroup = resourceObject?.resourceCategories?.filter((category) => category.group === groupId);
    const resourcesByGroup = resourceObject?.resources?.filter((resource) => resource.group === groupId);

    let allResourcesDeleted = true;
    const allCategoriesDeleted = true;

    if (resourcesByGroup) {
      for (const resource of resourcesByGroup) {
        const response = await deleteResource({ pk: resource.pk });
        if (response.severity !== 'success') {
          allResourcesDeleted = false;
          showResponseSnackbar(response);
          break;
        }
      }
    }

    if (allResourcesDeleted && categoriesByGroup) {
      for (const resource of categoriesByGroup) {
        const response = await deleteResource({ pk: resource.pk });
        if (response.severity !== 'success') {
          allResourcesDeleted = false;
          showResponseSnackbar(response);
          break;
        }
      }
    }

    if (allResourcesDeleted && allCategoriesDeleted) {
      const response = await deleteResource({ pk: group.pk });
      showResponseSnackbar(response);
      if (response.severity !== 'success') {
        setShowAlert(true);
      } else {
        handleClose();
      }
    } else {
      setShowAlert(true);
    }
    setLoadingDelete(false);
  };

  return (
    <FormProvider {...methods}>
      <form action={handleSubmit(onSubmit)}>
        <DialogTitle>{addGroup ? 'Add Group' : 'Update Group'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {addGroup
              ? 'Add a new Group by filling out the information below. Use icons from Iconify, for instance: "fluent:money-24-regular"'
              : 'Update the existing Group below'}
          </DialogContentText>
          <Inputs />
          {showAlert && <Alert severity="error">Issue {addGroup ? 'Adding' : 'Updating'} Group</Alert>}
        </DialogContent>
        <Buttons handleClose={handleClose} handleDelete={handleDelete} loadingDelete={loadingDelete} addGroup={addGroup} />
      </form>
    </FormProvider>
  );
}
