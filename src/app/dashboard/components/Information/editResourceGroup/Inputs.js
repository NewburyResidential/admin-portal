import { useFormStatus } from 'react-dom';
import { useFormContext, Controller } from 'react-hook-form';

import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

export default function Inputs() {
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
              name="icon"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  sx={{ m: 0 }}
                  {...field}
                  autoFocus
                  margin="dense"
                  id="icon"
                  label="Icon"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}
