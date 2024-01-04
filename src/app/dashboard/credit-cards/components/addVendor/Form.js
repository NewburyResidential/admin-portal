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

export default function AddVendorForm({ defaultVendorValue, handleClose }) {
  const [showAlert, setShowAlert] = useState(false);

  const upperCaseDefaultVendorValue = defaultVendorValue
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const defaultValues = {
    vendor: upperCaseDefaultVendorValue,
    entityType: '937',
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(vendorSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    const response = await addVendor(data);
    if (response) {
      handleClose();
    } else {
      setShowAlert(true);
    }
  };

  return (
    <FormProvider {...methods}>
      <form action={handleSubmit(onSubmit)}>
        <DialogTitle>Add Entrata Vendor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This assumes vendor is not on site, approved for all properties and no address or contact information. For details, edit in
            Entrata.
          </DialogContentText>
          <Inputs />
          {showAlert && <Alert severity="error">Issue Adding Vendor</Alert>}
        </DialogContent>
        <Buttons handleClose={handleClose} />
      </form>
    </FormProvider>
  );
}
