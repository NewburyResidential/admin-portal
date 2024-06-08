import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useFormContext, Controller } from 'react-hook-form';
import { clearanceOptions } from './resource-data';
import { uploadS3Image } from 'src/utils/services/intranet/uploadS3Image';
import { fileThumb } from 'src/components/file-thumbnail';

import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function Inputs({ resourceType, categoryOptions }) {
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);

  const { pending } = useFormStatus();
  const { control, setValue, watch, trigger } = useFormContext();

  const handleUploadType = (event, type) => {
    if (type !== null) {
      setValue('url', '');
      setValue('file', '');
    }
  };

  const uploadType = watch('uploadType');

  const handleFileChange = async (event, field) => {
    if (field === 'file') setLoadingFile(true);
    if (field === 'logo') setLoadingLogo(true);

    const file = event.target.files[0];
    if (!file) {
      if (field === 'file') setLoadingFile(false);
      if (field === 'logo') setLoadingLogo(false);
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'admin-portal-intranet');

    try {
      const response = await uploadS3Image(formData);
      if (response) {
        setValue(`${field}`, response);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      await trigger(field);
      if (field === 'file') setLoadingFile(false);
      if (field === 'logo') setLoadingLogo(false);
    }
  };

  return (
    <Grid container spacing={2} mb={2} mt={1}>
      {pending ? (
        <>
          <Grid item xs={6}>
            <Skeleton variant="rounded" height={60} />
          </Grid>
          <Grid item xs={6}>
            <Skeleton variant="rounded" height={60} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rounded" height={60} />
          </Grid>
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
          {resourceType !== 'resources' ? (
            <Grid item xs={6}>
              <Controller
                name="logo"
                control={control}
                render={({ field: { onBlur, value, ref }, fieldState: { error } }) => (
                  <div>
                    <input
                      accept="image/*"
                      type="file"
                      onChange={(event) => {
                        handleFileChange(event, 'logo');
                      }}
                      onBlur={onBlur}
                      ref={ref}
                      style={{ display: 'none' }}
                      id="logo-file-input"
                    />
                    <TextField
                      label={value && 'Logo'}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      onClick={() => document.getElementById('logo-file-input').click()}
                      value={value ? value.fileName : ''}
                      placeholder={loadingLogo ? '' : 'Logo'}
                      sx={{ m: 0 }}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            {loadingLogo ? (
                              <CircularProgress size={24} />
                            ) : (
                              value && (
                                <img
                                  src={fileThumb(value.fileName)}
                                  alt="File Icon"
                                  style={{ marginRight: 8, width: '24px', height: '24px' }}
                                />
                              )
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
          ) : (
            <Grid item xs={6}>
              <Controller
                name="category"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error} sx={{ m: 0 }}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      {...field}
                      labelId="category-label"
                      id="category-select"
                      label="Category"
                      fullWidth
                      margin="dense"
                      variant="outlined"
                    >
                      {Object.entries(categoryOptions).map(([key, label]) => (
                        <MenuItem key={key} value={key}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
          )}

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
              defaultValue={[]}
              render={({ field: { onChange, value, ...field }, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
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
                    renderValue={(selected) =>
                      Array.isArray(selected) ? selected.map((selectedValue) => clearanceOptions[selectedValue]).join(', ') : ''
                    }
                  >
                    {Object.entries(clearanceOptions).map(([key, valueOption]) => (
                      <MenuItem key={key} value={key}>
                        {valueOption}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="uploadType"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  {...field}
                  exclusive
                  onChange={(event, type) => {
                    if (type === null) return;
                    field.onChange(type);
                    handleUploadType(event, type);
                  }}
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
              )}
            />
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
                render={({ field: { onBlur, value, ref }, fieldState: { error } }) => (
                  <div>
                    <input
                      accept="*"
                      type="file"
                      onChange={(event) => {
                        handleFileChange(event, 'file');
                      }}
                      onBlur={onBlur}
                      ref={ref}
                      style={{ display: 'none' }}
                      id="file-input"
                    />
                    <TextField
                      label={value && 'Uploaded File'}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      onClick={() => document.getElementById('file-input').click()}
                      value={value ? value.fileName : ''}
                      placeholder={loadingFile ? '' : 'Select A File'}
                      sx={{ m: 0 }}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            {loadingFile ? (
                              <CircularProgress size={24} />
                            ) : (
                              value && (
                                <img
                                  src={fileThumb(value.fileName)}
                                  alt="File Icon"
                                  style={{ marginRight: 8, width: '24px', height: '24px' }}
                                />
                              )
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
