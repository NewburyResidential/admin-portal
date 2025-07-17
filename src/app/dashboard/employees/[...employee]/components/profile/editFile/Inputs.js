import { useFormStatus } from 'react-dom';
import { useFormContext, Controller } from 'react-hook-form';
import { fileThumb } from 'src/components/file-thumbnail';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';

import InputAdornment from '@mui/material/InputAdornment';

export default function Inputs() {

  const { pending } = useFormStatus();
  const { control, setValue,  } = useFormContext();

  const handleFileChange = async (event, field) => {
    const file = event.target.files[0];
    setValue('file', file);
  };

  return (
    <Grid container spacing={2} mb={2} mt={1}>
      {pending ? (
        <>
          <Grid size={12}>
            <Skeleton variant="rounded" height={60} />
          </Grid>
          <Grid size={12}>
            <Skeleton variant="rounded" height={60} />
          </Grid>
        </>
      ) : (
        <>
          <Grid size={12}>
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
          <Grid size={12}>
            <Controller
              name="file"
              control={control}
              render={({ field: { onBlur, value, ref }, fieldState: { error } }) => {
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
                      placeholder="Select A File"
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
