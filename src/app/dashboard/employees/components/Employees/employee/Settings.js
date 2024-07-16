import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

const specificApplicationAccessOptions = ['App1', 'App2', 'App3', 'App4'];
const rolesOptions = ['Role 1 etc', 'other 3rd role', 'this is another role', 'there are lots of roles'];

export default function Settings({ user }) {
  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      portalAccess: '',
      title: '',
      specificApplicationAccess: [],
      roles: [],
      hasAzureAccount: '',
      email: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const hasAzureAccount = watch('hasAzureAccount');

  return (
    <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'column' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ flexGrow: 1, p: 3, height: '280px'}}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="portal-access-label">Portal Access</InputLabel>
                <Controller
                  name="portalAccess"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="portal-access-label"
                      id="portal-access"
                      label="Portal Access"
                      {...field}
                      renderValue={(selected) => <Chip label={selected} color={selected === 'authorized' ? 'success' : 'error'} />}
                    >
                      <MenuItem value="authorized">Authorized</MenuItem>
                      <MenuItem value="unauthorized">Unauthorized</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="title-label">Title</InputLabel>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="title-label" id="title" label="Title" {...field}>
                      <MenuItem value="Foreman">Foreman</MenuItem>
                      <MenuItem value="District">District</MenuItem>
                      <MenuItem value="Leasing Agent">Leasing Agent</MenuItem>
                      <MenuItem value="Leasing Manager">Leasing Manager</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="azure-account-label">Has Azure Account</InputLabel>
                <Controller
                  name="hasAzureAccount"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="azure-account-label" id="azure-account" label="Has Azure Account" {...field}>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            {hasAzureAccount === 'Yes' && (
              <>
                <Grid item xs={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => <TextField fullWidth id="email" label="Email" {...field} />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="specific-application-access-label">Specific Application Access</InputLabel>
                    <Controller
                      name="specificApplicationAccess"
                      control={control}
                      render={({ field }) => (
                        <Select
                          labelId="specific-application-access-label"
                          id="specific-application-access"
                          multiple
                          input={<OutlinedInput id="select-multiple-chip" label="Specific Application Access" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip key={value} label={value} />
                              ))}
                            </Box>
                          )}
                          {...field}
                        >
                          {specificApplicationAccessOptions.map((name) => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="roles-label">Roles</InputLabel>
                    <Controller
                      name="roles"
                      control={control}
                      render={({ field }) => (
                        <Select
                          labelId="roles-label"
                          id="roles"
                          multiple
                          input={<OutlinedInput id="select-multiple-chip" label="Roles" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => (
                                <Chip key={value} label={value} />
                              ))}
                            </Box>
                          )}
                          {...field}
                        >
                          {rolesOptions.map((name) => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </Card>
      </form>
    </Grid>
  );
}
