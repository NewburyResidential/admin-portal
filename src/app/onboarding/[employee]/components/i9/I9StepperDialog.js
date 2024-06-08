import { useState } from 'react';
// @mui
import Step from '@mui/material/Step';

import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Container from '@mui/material/Container';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import { listAIdentifications } from './utils/identification-options';
import { Dialog } from '@mui/material';

// ----------------------------------------------------------------------

export default function I9StepperDialog({ employee, open, handleClose, hasApprovalRights, openPandaSession }) {
  const steps = hasApprovalRights
    ? ['Approve 1st Identification', 'Approve 2nd Identification', 'Complete I-9 Form']
    : ['Upload 1st Identification', 'Upload 2nd Identification', 'Fill Out I-9 Form'];

  const identificationOneData = employee?.onboarding['#ONBOARDING#IDENTIFICATIONONE'] || null;
  const identificationTwoData = employee?.onboarding['#ONBOARDING#IDENTIFICATIONTWO'] || null;

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = (identification = null) => {
    const canSkipStep2 = listAIdentifications.map((item) => item.value).includes(identification);

    if ((canSkipStep2 && activeStep === 0) || activeStep === 1) {
      openPandaSession();
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Dialog open={open} fullScreen handleClose={handleClose}>
      <Container maxWidth="lg">
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6, mt: 6 }}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <>
          {activeStep === 0 && (
            <Step1
              activeStep={activeStep}
              handleBack={handleClose}
              handleNext={handleNext}
              identificationOneData={identificationOneData}
              hasApprovalRights={hasApprovalRights}
            />
          )}
          {activeStep === 1 && (
            <Step2
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
              identificationTwoData={identificationTwoData}
              hasApprovalRights={hasApprovalRights}
            />
          )}
          {activeStep === 2 && <Step3 activeStep={activeStep} handleBack={handleBack} handleNext={handleNext} />}
        </>
      </Container>
    </Dialog>
  );
}
