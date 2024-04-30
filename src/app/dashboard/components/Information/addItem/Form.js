import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { vendorSchema } from './vendor-schema';

import addVendor from 'src/utils/services/entrata/addVendor';

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Inputs from './Inputs';
import Buttons from './Buttons';
import { Alert } from '@mui/material';

export default function AddItemForm({ defaultVendorValue, handleClose }) {
  const [showAlert, setShowAlert] = useState(false);

  const defaultValues = {
    label: '',
    description: '',
    logo: null,
    clearance: ['1'],
    url: '',
    file: null,
  };

  const methods = useForm({
    defaultValues,
    //   resolver: yupResolver(vendorSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    console.log(data);
    // const response = await addVendor(data);
    // if (response) {
    //   handleClose();
    // } else {
    //   setShowAlert(true);
    // }
  };

  return (
    <FormProvider {...methods}>
      <form action={handleSubmit(onSubmit)}>
        <DialogTitle>Update Resource</DialogTitle>
        <DialogContent>
          <DialogContentText>Update the resource information below</DialogContentText>
          <Inputs />
          {showAlert && <Alert severity="error">Issue Updating Resource</Alert>}
        </DialogContent>
        <Buttons handleClose={handleClose} />
      </form>
    </FormProvider>
  );
}
