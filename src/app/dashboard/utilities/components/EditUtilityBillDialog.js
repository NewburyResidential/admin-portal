import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';

import { Grid } from '@mui/material';
import Alert from '@mui/material/Alert';

import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import updateUtilityBill from 'src/utils/services/utility-bills/updateUtilityBill';
import { useFormStatus } from 'react-dom';
import EditUtilityForm from './EditUtilityForm';
import { editUtilityBillSchema } from './edit-utility-bill-schema';

export default function EditUtilityBillDialog({ editDialog, setEditDialog }) {
  const [showAlert, setShowAlert] = useState(false);

  const defaultValues = {
    pk: editDialog?.utilityBill?.pk,
    sk: editDialog?.utilityBill?.sk,
    accountNumber: editDialog?.utilityBill?.accountNumber,
    building: editDialog?.utilityBill?.building,
    unit: editDialog?.utilityBill?.unit,
    startService: editDialog?.utilityBill?.startService || '',
    endService: editDialog?.utilityBill?.endService || '',
    electricAmount: editDialog?.utilityBill?.electricAmount || 0,
    gasAmount: editDialog?.utilityBill?.gasAmount || 0,
    waterAmount: editDialog?.utilityBill?.waterAmount || 0,
    miscellaneousAmount: editDialog?.utilityBill?.miscellaneousAmount || 0,
    taxAmount: editDialog?.utilityBill?.taxAmount || 0,
    totalAmount: editDialog?.utilityBill?.totalAmount || 0,
  };

  const methods = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(editUtilityBillSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    const response = await updateUtilityBill(data);
    if (response) {
      // handleClose();
    } else {
      setShowAlert(true);
    }
  };

  const handleClose = () => {
    setEditDialog({ open: false, utilityBill: {} });
    methods.reset();
  };

  return (
    <Dialog open={editDialog?.open} onClose={handleClose}>
      <FormProvider {...methods}>
        <form action={handleSubmit(onSubmit)}>
          <EditUtilityForm showAlert={showAlert} handleClose={handleClose} />
        </form>
      </FormProvider>
    </Dialog>
  );
}
