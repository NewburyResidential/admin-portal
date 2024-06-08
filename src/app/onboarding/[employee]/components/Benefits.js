import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import { LoadingButton } from '@mui/lab';

import ResourceCard from 'src/app/dashboard/components/Information/ResourceCard';
import { updateOnboardingRequirement } from 'src/utils/services/employees/updateOnboaring';
import { getTodaysDate } from 'src/utils/format-time';

export default function BenefitsDialog({ hasApprovalRights, open, handleClose }) {
  const [loading, setLoading] = useState(false);
  const { control, watch, reset } = useForm({
    defaultValues: {
      checkbox1: false,
      checkbox2: false,
      checkbox3: false,
    },
  });
  const watchAllFields = watch();

  const allChecked = watchAllFields.checkbox1 && watchAllFields.checkbox2 && watchAllFields.checkbox3;
  const handleSubmit = async () => {
    setLoading(true);
    const pk = '18';
    const sk = '#ONBOARDING#BENEFITSENROLLMENT';
    if (hasApprovalRights) {
      await updateOnboardingRequirement(null, pk, sk, { status: '#COMPLETE', updatedOn: getTodaysDate(), updatedBy: 'admin' });
    } else {
      await updateOnboardingRequirement(null, pk, sk, { status: '#PENDING', updatedOn: getTodaysDate(), updatedBy: 'admin' });
    }
    handleClose();
    reset();
    setLoading(false);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => {
        reset();
        handleClose();
      }}
    >
      <Container maxWidth="lg" sx={{ zIndex: 1, pt: 5 }}>
        <Typography variant="h4" sx={{ mb: 3.5 }}>
          {hasApprovalRights ? 'Review Enrollment' : 'Enroll in Benefits'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2.5 }}>
          Newbury Residential provides comprehensive Health, Dental, and Vision benefits packages. Our benefits are managed through a
          platform called Ease. Whether you choose to enroll in benefits or decline coverage, all employees must make their selection
          through Ease. If you experience any issues or have questions, please reach out to your manager or use the help bubble at the
          bottom of the screen.
        </Typography>
        {hasApprovalRights ? (
          <Typography variant="body1" sx={{ mb: 4.5, fontWeight: 600 }}>
            {
              'Please use the link below to review that the employee has completed their enrollment. To see signed election forms: Employees > [select employee] > Documents > Forms'
            }
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ mb: 4.5, fontWeight: 600 }}>
            Begin your enrollment by following the links below. Check off each box as you go through the steps. After completing all steps,
            click 'Finish Enrollment' and a team member will process your enrollment!
          </Typography>
        )}

        <ResourceCard
          label="Enrollment Instruction Guide"
          description="Click to review instructions for Ease"
          url="https://newbury-intranet.s3.amazonaws.com/Health+%26+Benefits+-+Ease+Portal+Guide.pdf"
          uploadType={'file'}
          isResource={true}
          fileName="fjdlaskj.pdf"
        />
        <br />
        <ResourceCard
          label={hasApprovalRights ? 'Review Enrollment' : 'Start Enrollment'}
          description={
            hasApprovalRights ? "Click to be redirected to the employee's directory in Ease" : 'Click to create an account and enroll in benefits'
          }
          url="https://newburyresidential.ease.com/?6xE4T6ICZQh0ABkhV8iIFlJVJBt3WGT4nhSajS2AWYU=_162650504e27d846eec4a4021f81b80658b291463cddb4c4514460bb68d7e1f4ec"
          uploadType={'website'}
          isResource={true}
        />
        {!hasApprovalRights && (
          <form>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2, mt: 4.5 }}>
              <FormControlLabel
                control={
                  <Controller
                    name="checkbox1"
                    control={control}
                    render={({ field }) => <Checkbox {...field} sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }} />}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '1.125rem' }}>
                    I have reviewed the enrollment instructions
                  </Typography>
                }
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Controller
                    name="checkbox2"
                    control={control}
                    render={({ field }) => <Checkbox {...field} sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }} />}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '1.125rem' }}>
                    I enrolled or denied coverage
                  </Typography>
                }
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Controller
                    name="checkbox3"
                    control={control}
                    render={({ field }) => <Checkbox {...field} sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }} />}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '1.125rem' }}>
                    I signed and completed enrollment
                  </Typography>
                }
                sx={{ mb: 1 }}
              />
            </Box>
          </form>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, pb: 3 }}>
          <Button
            color="inherit"
            onClick={() => {
              reset();
              handleClose();
            }}
          >
            Close
          </Button>
          <LoadingButton
            disabled={!allChecked && !hasApprovalRights}
            color={hasApprovalRights ? 'success' : 'inherit'}
            variant="contained"
            onClick={() => handleSubmit()}
            loading={loading}
          >
            {hasApprovalRights ? 'Approve Enrollment' : 'Finish Enrollment'}
          </LoadingButton>
        </Box>
      </Container>
    </Dialog>
  );
}
