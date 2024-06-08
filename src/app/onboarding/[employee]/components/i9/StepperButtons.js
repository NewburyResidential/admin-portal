import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function StepperButtons({ activeStep, handleBack, handleNext, hasApprovalRights, isDirty, loading }) {
  return (
    <Box sx={{ display: 'flex', mt: 5, mb: 1 }}>
      <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
        {activeStep === 0 ? 'Close' : 'Back'}
      </Button>
      <Box sx={{ flexGrow: 1 }} />

      <LoadingButton loading={loading} variant="contained" color={hasApprovalRights ? 'success' : 'inherit'} onClick={handleNext} sx={{ minWidth: '130px' }}>
        {hasApprovalRights ? (isDirty ? 'Update And Approve' : 'Approve') : 'Continue'}
      </LoadingButton>
    </Box>
    // <Box sx={{ position: 'relative', p: 2}}> {/* pb is padding bottom to prevent overlap */}
  
    // <Box sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', p: 3 }}>
    //   <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
    //     <Button color="inherit" onClick={handleBack} sx={{ mr: 1}}>
    //       {activeStep === 0 ? 'Close' : 'Back'}
    //     </Button>
    //     <Button
    //       variant="contained"
    //       color={hasApprovalRights ? 'success' : 'inherit'}
    //       onClick={handleNext}
    //       sx={{ minWidth: '130px' }}
    //     >
    //       {hasApprovalRights ? (isDirty ? 'Update And Approve' : 'Approve') : 'Continue'}
    //     </Button>
    //   </Box>
    // </Box>
    // </Box>
  );
}
