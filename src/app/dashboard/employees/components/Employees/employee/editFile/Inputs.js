import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
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
import { fRemoveExtension } from 'src/utils/formatting/format-string';

export default function Inputs() {
  const [loadingFile, setLoadingFile] = useState(false);

  const { pending } = useFormStatus();
  const { control, setValue, watch, trigger } = useFormContext();
  const file = watch('file');

  const handleUploadType = (event, type) => {
    if (type !== null) {
      setValue('url', '');
      setValue('file', '');
    }
  };

  const handleFileChange = async (event, field) => {
    const file = event.target.files[0];
    setValue('file', file);
  };

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
        </>
      ) : (
        <>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <Controller
              name="file"
              control={control}
              render={({ field: { onBlur, value, ref }, fieldState: { error } }) => {
                console.log(value);
                return (
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
                      value={value ? value.name : ''}
                      placeholder={'Select A File'}
                      sx={{ m: 0 }}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            {value && (
                              <img src={fileThumb(value.name)} alt="File Icon" style={{ marginRight: 8, width: '24px', height: '24px' }} />
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
                );
              }}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}
