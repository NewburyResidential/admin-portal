import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { assetItems } from 'src/assets/data/assets';
import * as yup from 'yup';

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import Inputs from './Inputs';
import Buttons from './Buttons';
import Alert from '@mui/material/Alert';
import { uploadS3Utility } from 'src/utils/services/aws/uploadS3Utility';

export default function UploadDialog({ openDialog, setOpenDialog, files, setFiles }) {
  const [showAlert, setShowAlert] = useState(false);

  const uploadBillSchema = yup.object().shape({
    property: yup.string().required('Property is required'),
    utilityVendor: yup
      .string()
      .required('Utility is required')
      .test('is-valid-utility', 'Invalid utility', function (value) {
        if (!value) return false;
        const { property } = this.parent;
        if (!property) return false;
        const asset = assetItems.filter((item) => item.id === property);
        const utilities = asset[0]?.utilities || [];
        return utilities.some((utility) => utility.id === value);
      }),
  });

  const methods = useForm({
    defaultValues: { property: '', utilityVendor: '' },
    resolver: yupResolver(uploadBillSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    const skPrefix = `${data.property}#${data.utilityVendor}#`;
    if (files && data.property && data.utilityVendor) {
      try {
        const uploadPromises = files.map((file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('skPrefix', skPrefix);
          return uploadS3Utility(formData);
        });
        const responses = await Promise.all(uploadPromises);

        if (responses.some((response) => !response)) {
          setShowAlert(true);
        } else {
          setFiles([]);
          handleClose();
        }
      } catch (error) {
        console.error('Error uploading utility bill:', error);
        setShowAlert(true);
      }
    } else {
      setShowAlert(true);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Dialog open={openDialog} onClose={handleClose}>
        <FormProvider {...methods}>
          <form action={handleSubmit(onSubmit)}>
            <DialogTitle>Upload Utility Bill</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Choose the appropriate property and utility vendor realted to the utility bills you are uploading. Do not upload utility
                bills for different properties or vendors.
              </DialogContentText>
              <Inputs />
              {showAlert && <Alert severity="error">Issue Uploading Utility</Alert>}
            </DialogContent>
            <Buttons handleClose={handleClose} />
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}
