import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import Inputs from './Inputs';
import Buttons from './Buttons';
import Alert from '@mui/material/Alert';
import { s3FormDataUpload } from 'src/utils/services/sdk-config/aws/S3';
import { v4 as uuidv4 } from 'uuid';

export default function UploadDialog({ openDialog, setOpenDialog, files, setFiles, assetItems }) {
  const [showAlert, setShowAlert] = useState(false);

  const uploadBillSchema = yup.object().shape({
    propertyUtility: yup
      .object()
      .shape({
        propertyId: yup.string().required('Property is required'),
        utilityId: yup.string().required('Utility is required'),
      })
      .required('Property and utility selection is required'),
    paymentType: yup.string().required('Payment type is required').oneOf(['separate', 'same', 'manual'], 'Invalid payment type'),
    manualPaymentId: yup.string().when('paymentType', {
      is: 'manual',
      then: (schema) => schema.required('Payment ID is required'),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(uploadBillSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  console.log(errors);

  const onSubmit = async (data) => {
    const utilityVendor = data.propertyUtility.utilityId;
    const {propertyId} = data.propertyUtility;

    if (!files?.length || !data.propertyUtility) {
      setShowAlert(true);
      return;
    }

    try {
      const sharedPaymentId = data.paymentType === 'same' ? uuidv4() : null;

      // Split files into chunks of 3
      const chunkSize = 3;
      const fileChunks = [];
      for (let i = 0; i < files.length; i += chunkSize) {
        fileChunks.push(files.slice(i, i + chunkSize));
      }

      // Process each chunk with a delay
      for (let i = 0; i < fileChunks.length; i++) {
        const chunk = fileChunks[i];
        const uploadPromises = chunk.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('bucket', 'admin-portal-utility-bills-ai-analyzer');
          formData.append('key', uuidv4());
          formData.append('contentDisposition', 'inline');

          const paymentId = data.paymentType === 'manual' ? data.manualPaymentId : data.paymentType === 'same' ? sharedPaymentId : uuidv4();

          formData.append(
            'metadata',
            JSON.stringify({
              'x-amz-meta-account-number': null,
              'x-amz-meta-invoice-number': null,
              'x-amz-meta-property-id': propertyId,
              'x-amz-meta-scraped-amount': null,
              'x-amz-meta-utility-vendor': utilityVendor,
              'x-amz-meta-payment-id': paymentId,
            })
          );

          return s3FormDataUpload(formData);
        });

        const responses = await Promise.all(uploadPromises);

        if (responses.some((response) => !response)) {
          setShowAlert(true);
          return;
        }

        // Wait for 1 minute before processing next chunk, but don't wait after the last chunk
        if (i < fileChunks.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 60000)); // 60000ms = 1 minute
        }
      }

      setFiles([]);
      handleClose();
    } catch (error) {
      console.error('Error uploading utility bill:', error);
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
              <Inputs assetItems={assetItems} />
              {showAlert && <Alert severity="error">Issue Uploading Utility</Alert>}
            </DialogContent>
            <Buttons handleClose={handleClose} />
          </form>
        </FormProvider>
      </Dialog>
    </div>
  );
}
