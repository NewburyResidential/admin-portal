import { Box, Card, Grid, Stack } from '@mui/material';
import Iconify from 'src/components/iconify';
import { calculateAgeInMonths, calculateAgeInYears } from 'src/utils/format-time';
import { fToTitleCase } from 'src/utils/formatting/format-string';

export default function Information({ employee }) {
  const yearsOfService = calculateAgeInYears(employee.hireDate);
  const monthsOfService = calculateAgeInMonths(employee.hireDate);
  const yearsOfServiceText = yearsOfService > 1 ? `${yearsOfService} Years, ` : yearsOfService === 0 ? `` : `${yearsOfService} Year, `;
  const monthsOfServiceText = monthsOfService > 1 ? `${monthsOfService} Months` : `${monthsOfService} Month`;

  const data = [
    { icon: 'mingcute:location-fill', text: employee?.address },
    { icon: 'mingcute:birthday-2-fill', text: `${employee.birthDate} (${calculateAgeInYears(employee.birthDate)})` },
    {
      icon: 'ic:baseline-work-history',
      text: `${yearsOfServiceText}${monthsOfServiceText} of Service`,
    },
    { icon: 'solar:phone-bold', text: employee?.mobilePhone },
    { icon: 'fluent:mail-24-filled', text: fToTitleCase(employee.personalEmail) },
  ];
  if (employee.workEmail) {
    data.push({ icon: 'file-icons:microsoft-outlook', text: fToTitleCase(employee.workEmail) });
  }

  const half = Math.ceil(data.length / 2);
  const leftSideData = data.slice(0, half);
  const rightSideData = data.slice(half);

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} sm={12}>
        <Card sx={{ flexGrow: 1, px: 3, py: 4, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Stack spacing={2}>
                {leftSideData.map((item, index) => (
                  <Stack key={index} direction="row" spacing={2} alignItems="center">
                    <Iconify icon={item.icon} width={24} />
                    <Box sx={{ typography: 'body2', flex: 1 }}>{item.text}</Box>
                  </Stack>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={6}>
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
  );
}
