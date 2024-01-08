import { FormControl, InputLabel, MenuItem, Select, Skeleton, Stack, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import { entityOptions } from './vendor-data';
import { useFormStatus } from 'react-dom';

export default function Inputs() {
  const { pending } = useFormStatus();
  const { control } = useFormContext();

  return (
    <Stack spacing={2} mb={2} mt={2}>
      {pending ? (
        <>
          <Skeleton variant="rounded" height={60} />
          <Skeleton variant="rounded" height={60} />
        </>
      ) : (
        <>
          <Controller
            name="vendor"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                id="name"
                label="Vendor Name"
                type="text"
                fullWidth
                variant="outlined"
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          <Controller
            name="entityType"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="entity-type-label">Entity Type</InputLabel>
                <Select {...field} labelId="entity-type-label" id="entity-type-select" label="Entity Type">
                  {Object.entries(entityOptions).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </>
      )}
    </Stack>
  );
}
