import { Box, Card, Grid, Stack, Typography, LinearProgress } from '@mui/material';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
import { calculateAgeInMonths, calculateAgeInYears, formatDateFromISO } from 'src/utils/format-time';
import { fToTitleCase } from 'src/utils/formatting/format-string';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';
import createMicrosoftUser from 'src/utils/services/microsoft-graph-api/create-microsoft-user';
import { useState } from 'react';

// Add this helper function at the top of your component
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

//what are some other names for this?

export default function Information({ employee }) {
  const { showResponseSnackbar } = useSnackbar();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const yearsOfService = calculateAgeInYears(formatDateFromISO(employee.hireDate));
  const monthsOfService = calculateAgeInMonths(formatDateFromISO(employee.hireDate));
  const yearsOfServiceText = yearsOfService > 1 ? `${yearsOfService} Years, ` : yearsOfService === 0 ? `` : `${yearsOfService} Year, `;
  const monthsOfServiceText = monthsOfService > 1 ? `${monthsOfService} Months` : `${monthsOfService} Month`;

  const data = [
    { icon: 'mingcute:location-fill', text: employee?.fullAddress },
    { icon: 'ic:baseline-work-history', text: `${yearsOfServiceText}${monthsOfServiceText} of Service` },
    { icon: 'solar:phone-bold', text: formatPhoneNumber(employee?.personalPhone) },
    { icon: 'fluent:mail-24-filled', text: fToTitleCase(employee.personalEmail) },
  ];

  // Add workEmail with conditional rendering
  if (employee.workEmail === null || employee.workEmail === '') {
    data.push({
      icon: 'file-icons:microsoft-outlook',
      text: (
        <Typography sx={{ color: '#0066FF', fontSize: '13px', cursor: 'pointer' }} onClick={() => setConfirmDialogOpen(true)}>
          Assign Work Email
        </Typography>
      ),
    });
  } else if (employee.workEmail === 'syncing') {
    data.push({
      icon: 'file-icons:microsoft-outlook',
      text: <LinearProgress size={14} sx={{ width: '40%' }} />,
    });
  } else {
    data.push({
      icon: 'file-icons:microsoft-outlook',
      text: fToTitleCase(employee.workEmail),
    });
  }

  const half = Math.ceil(data.length / 2);
  const leftSideData = data.slice(0, half);
  const rightSideData = data.slice(half);

  const displayName = employee.fullName;
  const mailNickname = employee.fullName.replace(/\s+/g, '.');
  const userPrincipalName = `${mailNickname.toLowerCase()}@newburyresidential.com`;

  const handleCreateNewMicrosoftUser = async () => {
    setIsLoading(true);
    const response = await createMicrosoftUser({ pk: employee.pk, displayName, mailNickname, userPrincipalName });
    showResponseSnackbar(response);
    setConfirmDialogOpen(false);
    setIsLoading(false);
  };

  return (
    <>
      <ConfirmDialog
        content={`Please confirm that you would like to assign the following Microsoft Email: ${userPrincipalName}`}
        open={confirmDialogOpen}
        title="Assign Work Email"
        confirm="Assign"
        handleConfirm={handleCreateNewMicrosoftUser}
        handleClose={() => setConfirmDialogOpen(false)}
        confirmButtonIsLoading={isLoading}
      />
      <Grid container spacing={3} justifyContent="center">
        <Grid
          size={{
            xs: 12,
            sm: 12
          }}>
          <Card sx={{ flexGrow: 1, px: 3, py: 4, mt: 2 }}>
            <Grid container spacing={3}>
              <Grid size={6}>
                <Stack spacing={2}>
                  {leftSideData.map((item, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="center">
                      <Iconify icon={item.icon} width={24} />
                      <Box sx={{ typography: 'body2', flex: 1 }}>{item.text}</Box>
                    </Stack>
                  ))}
                </Stack>
              </Grid>

              <Grid size={6}>
                <Stack spacing={2}>
                  {rightSideData.map((item, index) => (
                    <Stack key={index} direction="row" spacing={2} alignItems="center">
                      <Iconify icon={item.icon} width={24} />
                      <Box sx={{ typography: 'body2', flex: 1 }}>{item.text}</Box>
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
