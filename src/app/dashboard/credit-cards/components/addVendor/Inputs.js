
import { useFormStatus } from 'react-dom';
import { useFormContext, Controller } from 'react-hook-form';
import { entityOptions, informationReturnOptions } from './vendor-data';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function Inputs() {
  const { pending } = useFormStatus();
  const { control } = useFormContext();

  return (
    <Stack spacing={2.4} mb={2} mt={3}>
      {pending ? (
        <>
          <Skeleton variant="rounded" height={60} />
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
          <Controller
            name="informationReturn"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="informationReturn-type-label">Requires 1099</InputLabel>
                <Select {...field} labelId="informationReturn-type-label" id="informationReturn-type-select" label="Requires 1099">
                  {Object.entries(informationReturnOptions).map(([key, value]) => (
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
