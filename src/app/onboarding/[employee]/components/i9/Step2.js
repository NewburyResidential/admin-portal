import React, { useCallback, useState } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import useDialog from 'src/components/custom-dialog/use-dialog';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ReactHookSelect from 'src/components/form-inputs/ReactHookSelect';
import ConfirmIdentificationDialog from './ConfirmIdentificationDialog';
import StepperButtons from './StepperButtons';
import { Upload } from 'src/components/upload';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateOnboardingRequirement } from 'src/utils/services/employees/updateOnboaring';
import { listAIdentifications, listCIdentifications } from './utils/identification-options';
import { getTodaysDate } from 'src/utils/format-time';
import { step2Schema } from './utils/validation';

// TO DO loading buttons and fix dialog driver's license

export default function Step2({ activeStep, handleBack, handleNext, identificationTwoData, hasApprovalRights }) {
  const identificationConfirmationDialog = useDialog();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      identificationTwo: identificationTwoData?.identification || '',
      file: identificationTwoData
        ? {
            preview: identificationTwoData.url,
            name: identificationTwoData.fileName,
          }
        : null,
    },
    resolver: yupResolver(step2Schema),
  });

  const { control, handleSubmit, trigger, formState } = methods;

  const identificationTwo = useWatch({ control: control, name: 'identificationTwo' });
  const file = useWatch({ control: control, name: 'file' });
  const fileError = formState?.errors?.file;
  const isDirty = formState?.isDirty;

  const handleDropSingleFile = useCallback((file) => {
    methods.setValue('file', file, { shouldDirty: true });
  }, []);

  const identificationOptions = [...listAIdentifications, ...listCIdentifications];
  const identificationSelection = identificationOptions.find((item) => item.value === identificationTwo) || null;

  const handleIdentificationConfirmation = () => {
    setLoading(true);
    identificationConfirmationDialog.handleClose();
    handleSubmit(onSubmit)();
  };

  const handleContinue = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (hasApprovalRights || !isDirty) {
        setLoading(true);
        handleSubmit(onSubmit)();
      } else {
        identificationConfirmationDialog.handleOpen();
      }
    }
  };

  const onSubmit = async (data) => {
    console.log('isDirty', isDirty);
    console.log('data', data);
    if (isDirty) {
      const fileData = new FormData();
      fileData.append('file', data.file);
      fileData.append('bucket', 'newbuy-employee-documents');
      const pk = '18';
      const sk = '#ONBOARDING#IDENTIFICATIONTWO';
      const attributes = {
        updatedBy: 'mike',
        updatedOn: getTodaysDate(),
        status: '#PENDING',
        identification: data.identificationTwo,
      };
      const response = await updateOnboardingRequirement(fileData, pk, sk, attributes);
    }
    handleNext();
    setLoading(false);
  };
  console.log(file);

  return (
    <Box>
      <ConfirmIdentificationDialog
        open={identificationConfirmationDialog.open}
        handleClose={identificationConfirmationDialog.handleClose}
        handleConfirm={handleIdentificationConfirmation}
        identificationSelection={identificationSelection?.label}
      />

      {hasApprovalRights ? (
        <Typography variant="body1" sx={{ mb: 4.5 }}>
          Please review these documents with the employee. Ensure <strong> uploaded documents are clear and easy to read</strong>. Verify
          the identification type is correct and the document is not expired and/or a duplicate.
        </Typography>
      ) : (
        <Typography variant="body1" sx={{ mb: 4.5 }}>
          Please select a second form of identification from the list below to upload. Ensure
          <strong> your uploaded documents are clear and easy to read</strong>. If you encounter any issues or have questions, please
          contact your manager or use the help bubble located at the bottom of the screen.
        </Typography>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ mb: 4.5 }}>
            <Grid item xs={12} md={12}>
              <ReactHookSelect
                label={'Select Identification Type'}
                options={identificationOptions}
                name="identificationTwo"
                onChange={() => methods.setValue('file', null)}
              />
            </Grid>
          </Grid>
        </form>
      </FormProvider>
      {identificationTwo && (
        <>
          <Upload
            title={`Upload ${identificationSelection?.label}`}
            onFileChange={handleDropSingleFile}
            file={file}
            onDelete={() => methods.setValue('file', null, { shouldDirty: true })}
            previewFit="full"
            error={fileError}
            accept={{
              'application/pdf': ['.pdf'],
              'image/jpeg': ['.jpeg', '.jpg'],
              'image/heic': ['.heic'],
              'image/webp': ['.webp'],
              'image/png': ['.png'],
              'image/gif': ['.gif'],
              'image/bmp': ['.bmp'],
              'image/tiff': ['.tiff', '.tif'],
            }}
          />
        </>
      )}
      <StepperButtons
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={handleContinue}
        hasApprovalRights={hasApprovalRights}
        isDirty={isDirty}
        loading={loading}
      />
      <br />
    </Box>
  );
}
