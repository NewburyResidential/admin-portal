import { useCallback, useState } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import useDialog from 'src/components/custom-dialog/use-dialog';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ReactHookSelect from 'src/components/form-inputs/ReactHookSelect';
import StepperButtons from './StepperButtons';

import ReactHookDatePicker from 'src/components/form-inputs/ReactHookDatePicker';
import ConfirmDriversLicenseDialog from 'src/components/custom-dialog/confirm-dialog';
import ConfirmIdentificationDialog from './ConfirmIdentificationDialog';
import { Upload } from 'src/components/upload';

import { updateOnboardingRequirement } from 'src/utils/services/employees/updateOnboaring';
import { listAIdentifications, listBIdentifications } from './utils/identification-options';
import { step1Schema } from './utils/validation';
import { getTodaysDate } from 'src/utils/format-time';
import { yupResolver } from '@hookform/resolvers/yup';

export default function Step1({ activeStep, handleBack, handleNext, identificationOneData, hasApprovalRights, employeePk }) {
  const driversLicenseConfirmationDialog = useDialog();
  const identificationConfirmationDialog = useDialog();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      hasLicense: identificationOneData ? identificationOneData.hasLicense : '',
      licenseExpiration: identificationOneData ? identificationOneData.licenseExpiration : null,
      identificationOne: identificationOneData?.identification || '',
      file: identificationOneData
        ? {
            preview: identificationOneData.url,
            name: identificationOneData.fileName,
          }
        : null,
    },
    resolver: yupResolver(step1Schema(hasApprovalRights)),
  });

  const { control, handleSubmit, trigger, formState } = methods;

  const driverLicenseOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];

  const hasLicense = useWatch({ control, name: 'hasLicense' });
  const identificationOne = useWatch({ control, name: 'identificationOne' });
  const file = useWatch({ control, name: 'file' });
  const fileError = formState?.errors?.file;
  const isDirty = formState?.isDirty;
  const isFileDirty = formState?.dirtyFields.file || false;
  const dirtyFields = formState?.dirtyFields;
  console.log('dirtyFields', dirtyFields);

  const handleDropSingleFile = useCallback(
    (newFile) => {
      methods.setValue('file', newFile, { shouldDirty: true });
    },
    [methods]
  );

  const handleDriverLicenseChange = (event) => {
    if (event.target.value === true) {
      methods.setValue('hasLicense', true);
      methods.setValue('identificationOne', 'driversLicense');
      methods.setValue('file', null);
    } else {
      driversLicenseConfirmationDialog.handleOpen();
    }
  };
  const handleDriverLicenseConfirmation = () => {
    methods.setValue('hasLicense', false);
    methods.setValue('identificationOne', '');
    methods.setValue('file', null);

    driversLicenseConfirmationDialog.handleClose();
  };

  const handleDriverLicenseCancel = () => {
    methods.setValue('hasLicense', '');
    methods.setValue('identificationOne', '');
    driversLicenseConfirmationDialog.handleClose();
  };

  const identificationOptions = [...listAIdentifications, ...listBIdentifications];
  const identificationSelection = identificationOptions.find((item) => item.value === identificationOne) || null;

  const handleIdentificationConfirmation = async () => {
    identificationConfirmationDialog.handleClose();
    setLoading(true);
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
    if (isDirty) {
      let fileData = null;
      if (isFileDirty) {
        fileData = new FormData();
        fileData.append('file', data.file);
        fileData.append('bucket', 'newbuy-employee-documents');
      }
      const pk = employeePk;
      const sk = '#ONBOARDING#IDENTIFICATIONONE';
      const attributes = {
        updatedBy: 'mike',
        updatedOn: getTodaysDate(),
        status: '#PENDING',
        identification: data.identificationOne,
        hasLicense: data.hasLicense,
        licenseExpiration: data.licenseExpiration,
      };
      await updateOnboardingRequirement(fileData, pk, sk, attributes);
    }
    handleNext(data.identificationOne);
    setLoading(false);
  };

  return (
    <Box>
      <ConfirmIdentificationDialog
        open={identificationConfirmationDialog.open}
        handleClose={identificationConfirmationDialog.handleClose}
        handleConfirm={handleIdentificationConfirmation}
        identificationSelection={identificationSelection?.label}
      />
      <ConfirmDriversLicenseDialog
        title="Confirm Submission"
        content={
          <>
            <Typography>
              {`You have indicated that you do not currently have a valid driver's license. Be aware that you will not be permitted to drive a
  company car until a valid license is submitted. If this is correct, please proceed.`}
            </Typography>

            <br />
            <Typography sx={{ fontWeight: 600 }}>Please select an alternative form of identification from the dropdown</Typography>
          </>
        }
        confirm="Continue"
        open={driversLicenseConfirmationDialog.open}
        handleClose={driversLicenseConfirmationDialog.handleClose}
        handleConfirm={handleDriverLicenseConfirmation}
        handleCancel={handleDriverLicenseCancel}
        maxWidth="sm"
      />
      {hasApprovalRights ? (
        <Typography variant="body1" sx={{ mb: 4.5 }}>
          Please review these documents with the employee. Ensure <strong> uploaded documents are clear and easy to read</strong>. Verify
          the identification type is correct and not expired. Include the license expiration if applicable.
        </Typography>
      ) : (
        <Typography variant="body1" sx={{ mb: 4.5 }}>
          To comply with employment regulations, we are required to collect identification documents from all new employees. Please fill out
          the secure form below and ensure <strong>your uploaded documents are clear and easy to read</strong>. Our portal is accessible on
          both mobile devices and computers, so you can upload documents using whichever you prefer. If you encounter any issues or have
          questions, please contact your manager or use the help bubble located at the bottom of the screen.
        </Typography>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ mb: 4.5 }}>
            <Grid item xs={12} md={hasApprovalRights && hasLicense ? 4 : 6}>
              <ReactHookSelect
                label="Do you have a valid Driver's License"
                options={driverLicenseOptions}
                name="hasLicense"
                onChange={handleDriverLicenseChange}
              />
            </Grid>
            <Grid item xs={12} md={hasApprovalRights && hasLicense ? 4 : 6}>
              <ReactHookSelect
                label={hasLicense ? 'Identification Type' : 'Select Identification Type'}
                options={identificationOptions}
                name="identificationOne"
                disabled={hasLicense || hasLicense === ''}
                onChange={() => methods.setValue('file', null)}
              />
            </Grid>
            {hasApprovalRights && hasLicense && (
              <Grid item xs={12} md={4}>
                <ReactHookDatePicker label="License Expiration" name="licenseExpiration" />
              </Grid>
            )}
          </Grid>
        </form>
      </FormProvider>
      {identificationOne && (
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
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
          }}
        />
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
