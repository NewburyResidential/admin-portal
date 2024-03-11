import { useFormStatus } from 'react-dom';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { assetItems } from 'src/assets/data/assets';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function Inputs() {
  const { pending } = useFormStatus();
  const { control } = useFormContext();

  const selectedProperty = useWatch({
    control,
    name: 'property',
  });

  const propertyOptions = assetItems.filter((item) => item.utilities);
  const utilityOptions = assetItems.filter((item) => item.id === selectedProperty)[0]?.utilities || [];

  return (
    <Stack spacing={2.4} mb={2} mt={3}>
      {pending ? (
        <>
          <Skeleton variant="rounded" height={60} />
          <Skeleton variant="rounded" height={60} />
        </>
      ) : (
        <>
          <Controller
            name="property"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth>
                <InputLabel id="property-select">Property</InputLabel>
                <Select error={!!error} {...field} labelId="property-select" id="property-select" label="Property">
                  {propertyOptions.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="utilityVendor"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth>
                <InputLabel id="utility-select">Utility</InputLabel>
                <Select error={!!error} {...field} labelId="utility-select" id="utility-select" label="Utility">
                  {utilityOptions.map((utility) => (
                    <MenuItem key={utility.label} value={utility.id}>
                      {utility.label}
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
