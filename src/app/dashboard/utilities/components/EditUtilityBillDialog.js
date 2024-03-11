import { useState } from 'react';

import Dialog from '@mui/material/Dialog';

import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import updateUtilityBill from 'src/utils/services/utility-bills/updateUtilityBill';
import EditUtilityForm from './EditUtilityForm';
import { editUtilityBillSchema } from './edit-utility-bill-schema';
import getUtilityBills from 'src/utils/services/utility-bills/getUtilityBills';

export default function EditUtilityBillDialog({ editDialog, setEditDialog, setUtilityBills, sk, pk }) {
  const [showAlert, setShowAlert] = useState(false);

  const defaultValues = {
    status: editDialog?.utilityBill?.status,
    pk: editDialog?.utilityBill?.pk,
    sk: editDialog?.utilityBill?.sk,
    invoiceNumber: editDialog?.utilityBill?.invoiceNumber,
    building: editDialog?.utilityBill?.building,
    unit: editDialog?.utilityBill?.unit,
    startService: editDialog?.utilityBill?.startService || '',
    endService: editDialog?.utilityBill?.endService || '',
    electricAmount: editDialog?.utilityBill?.electricAmount,
    gasAmount: editDialog?.utilityBill?.gasAmount,
    waterAmount: editDialog?.utilityBill?.waterAmount,
    miscellaneousAmount: editDialog?.utilityBill?.miscellaneousAmount,
    taxAmount: editDialog?.utilityBill?.taxAmount,
    totalAmount: editDialog?.utilityBill?.totalAmount,
    type: editDialog?.utilityBill?.type || 'common',
    objectKey: editDialog?.utilityBill?.objectKey,
    scrapedAmount: editDialog?.utilityBill?.scrapedAmount,
  };

  const methods = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(editUtilityBillSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    const response = await updateUtilityBill(data);
    const updatedData = await getUtilityBills(pk, sk);
    setUtilityBills(updatedData);
    if (response && updatedData) {
      handleClose();
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
