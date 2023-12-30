
import { Container, Typography } from '@mui/material';

export const metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  return (
    <Container >
    <Typography variant="h4">Welcome To Newbury&apos;s Admin Portal!</Typography>

    {/* <Box
      sx={{
        mt: 5,
        width: 1,
        height: 320,
        borderRadius: 2,
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
        border: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    /> */}
  </Container>
  );
}
