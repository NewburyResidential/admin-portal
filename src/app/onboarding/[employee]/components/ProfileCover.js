'use client';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';

import Iconify from 'src/components/iconify';

// theme
import { bgGradient } from 'src/theme/css';
import { _mock } from 'src/_mock';
import UpdateAvatar from 'src/components/avatar/UpdateAvatar';
import useAvatar from 'src/components/avatar/use-avatar';

// ----------------------------------------------------------------------

export default function ProfileCover({ employee, progress }) {
  const theme = useTheme();
  const avatar = useAvatar();

  return (
    <>
      <UpdateAvatar
        pk={employee.pk}
        name={employee.firstName}
        avatar={employee.avatar}
        open={avatar.open}
        handleClose={avatar.handleClose}
        handleUpdate={avatar.handleUpdate}
      />
      <Grid container spacing={3} sx={{ height: 190 }}>
        <Grid item xs={12}>
          <Card
            sx={{
              height: '100%',
            }}
          >
            <Box
              sx={{
                ...bgGradient({
                  color: alpha(theme.palette.primary.darker, 0.8),
                  imgUrl: _mock.image.cover(6),
                }),
                height: 1,
                color: 'common.white',
                position: 'relative',
              }}
            >
              {/* <Chip
                label={true ? 'In Progress' : 'Terminated'}
                color={true ? 'warning' : 'error'}
                variant="outlined"
                sx={{
                  position: 'absolute',
                  top: 22,
                  right: 22,
                }}
              /> */}
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                sx={{
                  left: { md: 24 },
                  bottom: { md: 36 },
                  zIndex: { md: 10 },
                  pt: { xs: 6, md: 0 },
                  position: { md: 'absolute' },
                }}
              >
                <Box
                  sx={{ position: 'relative', mx: 'auto' }}
                  onClick={() => {
                    avatar.handleOpen();
                  }}
                >
                  {!employee.avatar ? (
                    <>
                      <Avatar
                        sx={{
                          width: { xs: 64, md: 106 },
                          height: { xs: 64, md: 106 },
                          border: `solid 3px ${theme.palette.common.white}`,
                        }}
                      ></Avatar>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          border: 'solid 1px white',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: theme.palette.grey[500],
                          color: theme.palette.common.white,
                          cursor: 'pointer',
                          '&:hover': {
                            color: theme.palette.grey[300],
                            backgroundColor: theme.palette.grey[600],
                          },
                        }}
                      >
                        <Iconify icon="solar:camera-add-bold" width={32} height={32} />
                        <Box sx={{ fontSize: 11, mt: 1 }}>Add Avatar</Box>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Avatar
                        src={employee.avatar}
                        sx={{
                          width: { xs: 64, md: 106 },
                          height: { xs: 64, md: 106 },
                          border: `solid 3px ${theme.palette.common.white}`,
                          transition: 'opacity 0.3s',
                          fontSize: 54,
                        }}
                      >
                        {employee.firstName.charAt(0)}
                      </Avatar>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          border: 'solid 1px white',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: alpha(theme.palette.grey[900], 0.7),
                          color: 'white',
                          opacity: 0,
                          transition: 'opacity 0.3s',
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        <Iconify icon="solar:camera-add-bold" width={32} height={32} />
                        <Box sx={{ mt: 1, fontSize: 11 }}>Update Avatar</Box>
                      </Box>
                    </>
                  )}
                </Box>

                <ListItemText
                  sx={{
                    mt: 2.4,
                    ml: { md: 5 },
                    textAlign: { xs: 'center', md: 'unset' },
                  }}
                  primary={`Welcome, ${employee.firstName}!`}
                  secondary={'Complete Your Onboarding'}
                  primaryTypographyProps={{
                    typography: 'h4',
                  }}
                  secondaryTypographyProps={{
                    mt: 0.5,
                    color: 'inherit',
                    component: 'span',
                    typography: 'body2',
                    sx: { opacity: 0.48 },
                  }}
                />
              </Stack>
            </Box>
            <Box
              sx={{
                width: 1,
                bottom: 0,
                zIndex: 9,
                position: 'absolute',
                bgcolor: 'background.paper',
                height: '11px',
              }}
            >
              <LinearProgress
                variant="determinate"
                value={Math.max(1, progress)}
                color="success"
                sx={{
                  borderRadius: 0,
                  height: '11px',
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
