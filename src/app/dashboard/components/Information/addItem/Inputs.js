import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useFormContext, Controller } from 'react-hook-form';
import { clearanceOptions } from './vendor-data';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { fileThumb } from 'src/components/file-thumbnail';
import InputAdornment from '@mui/material/InputAdornment';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function Inputs() {
  const [uploadType, setUploadType] = useState('website');

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setUploadType(newAlignment);
    }
  };
  const { pending } = useFormStatus();
  const { control } = useFormContext();

  return (
    <Grid container spacing={2} mb={2} mt={1}>
      {pending ? (
        <>
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={60} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={60} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={60} />
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={6}>
            <Controller
              name="label"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  sx={{ m: 0 }}
                  {...field}
                  autoFocus
                  margin="dense"
                  id="label"
                  label="Label"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="logo"
              control={control}
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <div>
                  <input
                    accept="*"
                    type="file"
                    onChange={(event) => {
                      onChange(event.target.files[0]);
                    }}
                    onBlur={onBlur}
                    ref={ref}
                    style={{ display: 'none' }}
                    id="logo-file-input"
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    onClick={() => document.getElementById('logo-file-input').click()}
                    value={value ? value.name : ''}
                    placeholder="Logo"
                    sx={{ m: 0 }}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          {value && (
                            <img src={fileThumb(value.name)} alt="File Icon" style={{ marginRight: 8, width: '26px', height: '26px' }} />
                          )}
                        </InputAdornment>
                      ),
                      inputProps: {
                        style: { cursor: 'pointer' },
                      },
                    }}
                    error={!!error}
                    helperText={error && error.message}
                  />
                </div>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  sx={{ m: 0 }}
                  rows={2}
                  multiline
                  autoFocus
                  margin="dense"
                  id="description"
                  label="Description"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="clearance"
              control={control}
              defaultValue={[]} // Ensure the default value is an empty array
              render={({ field: { onChange, value, ...field } }) => (
                <FormControl fullWidth>
                  <InputLabel id="clearance-label">Clearance Level</InputLabel>
                  <Select
                    {...field}
                    labelId="clearance-label"
                    id="clearance"
                    label="Clearance Level"
                    multiple
                    value={value || []} 
                    onChange={(event) => {
                      const { value: newValue } = event.target;

                      if (newValue.includes('1') && !value.includes('1')) {
                        onChange(['1']);
                      } else if (value.includes('1') && newValue.some((val) => val !== '1')) {
                        const filteredArray = newValue.filter((val) => val !== '1');
                        onChange(filteredArray);
                      } else {
                        onChange(newValue); 
                      }
                    }}
                    renderValue={(selected) => (Array.isArray(selected) ? selected.map((value) => clearanceOptions[value]).join(', ') : '')}
                  >
                    {Object.entries(clearanceOptions).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <ToggleButtonGroup
              value={uploadType}
              exclusive
              onChange={handleAlignment}
              aria-label="text alignment"
              align="center"
              sx={{
                width: '100%',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <ToggleButton value="website" aria-label="left aligned" sx={{ width: '50%' }}>
                Website URL
              </ToggleButton>
              <ToggleButton value="file" aria-label="centered" sx={{ width: '50%' }}>
                File Upload
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          {uploadType === 'website' ? (
            <Grid item xs={12}>
              <Controller
                name="url"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    sx={{ m: 0 }}
                    {...field}
                    autoFocus
                    margin="dense"
                    id="url"
                    label="Website URL"
                    type="text"
                    fullWidth
                    variant="outlined"
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Controller
                name="file"
                control={control}
                render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                  <div>
                    <input
                      accept="*"
                      type="file"
                      onChange={(event) => {
                        onChange(event.target.files[0]);
                      }}
                      onBlur={onBlur}
                      ref={ref}
                      style={{ display: 'none' }}
                      id="file-input"
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      onClick={() => document.getElementById('file-input').click()}
                      value={value ? value.name : ''}
                      placeholder="Select a file"
                      sx={{ m: 0 }}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            {value && (
                              <img src={fileThumb(value.name)} alt="File Icon" style={{ marginRight: 8, width: '26px', height: '26px' }} />
                            )}
                          </InputAdornment>
                        ),
                        inputProps: {
                          style: { cursor: 'pointer' },
                        },
                      }}
                      error={!!error}
                      helperText={error && error.message}
                    />
                  </div>
                )}
              />
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
}
