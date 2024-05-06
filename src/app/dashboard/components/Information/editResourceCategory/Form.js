import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { resourceCategorySchema } from './resource-category-schema';
import { v4 as uuidv4 } from 'uuid';
import { getTodaysDate } from 'src/utils/format-time';

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

import Inputs from './Inputs';
import Buttons from './Buttons';
import updateResource from 'src/utils/services/intranet/updateResource';
import deleteResource from 'src/utils/services/intranet/deleteResource';

export default function EditResourceCategoryForm({ category, handleClose, userName, groupId }) {
  const [showAlert, setShowAlert] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const addCategory = !category;

  const defaultValues = {
    pk: uuidv4(),
    label: '',
    resourceType: 'resourceCategories',
    group: groupId,
  };

  const methods = useForm({
    defaultValues: category || defaultValues,
    resolver: yupResolver(resourceCategorySchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    const { resources, ...rest } = data;
    const response = await updateResource({ ...rest, updatedBy: userName, updatedOn: getTodaysDate() });
    if (response) {
      handleClose();
    } else {
      setShowAlert(true);
    }
  };

  const handleDelete = async () => {
    setLoadingDelete(true);
    let allDeleted = true;

    for (const resource of category.resources) {
      const response = await deleteResource(resource.pk);
      if (!response) {
        allDeleted = false;
        console.error('Failed to delete resource with pk:', resource.pk);
        break;
      }
    }
    if (allDeleted) {
      const response = await deleteResource(category.pk);
      if (!response) {
        console.error('Failed to delete category with pk:', category.pk);
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
        <DialogTitle>{addCategory ? 'Add Category' : 'Update Category'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {addCategory ? 'Add a new category by filling out the information below' : 'Update the existing category below'}
          </DialogContentText>
          <Inputs />
          {showAlert && <Alert severity="error">Issue {addCategory ? 'Adding' : 'Updating'} Category</Alert>}
        </DialogContent>
        <Buttons handleClose={handleClose} handleDelete={handleDelete} loadingDelete={loadingDelete} addCategory={addCategory} />
      </form>
    </FormProvider>
  );
}
