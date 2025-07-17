import { useFormStatus } from 'react-dom';
import { useFormContext, Controller, useWatch } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';

export default function Inputs({ assetItems }) {
  const { pending } = useFormStatus();
  const { control } = useFormContext();

  const selectedPaymentType = useWatch({
    control,
    name: 'paymentType',
  });

  // Flatten and structure options
  const options = assetItems
    .filter(item => item.utilities && item.utilities.length > 0)
    .reduce((acc, property) => {
      const propertyUtilities = property.utilities.map(utility => ({
        propertyId: property.pk,
        utilityId: utility.id,
        propertyName: property.label,
        utilityName: utility.label
      }));
      return [...acc, ...propertyUtilities];
    }, []);

    console.log(options);
    console.log(assetItems);

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
            name="propertyUtility"
            control={control}
            defaultValue={null}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                options={options}
                groupBy={(option) => option.propertyName}
                getOptionLabel={(option) => option.utilityName}
                isOptionEqualToValue={(option, value) => 
                  option?.propertyId === value?.propertyId && 
                  option?.utilityId === value?.utilityId
                }
                onChange={(_, newValue) => {
                  field.onChange(newValue ? {
                    propertyId: newValue.propertyId,
                    utilityId: newValue.utilityId,
                    propertyName: newValue.propertyName,
                    utilityName: newValue.utilityName
                  } : null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Property and Utility"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
                PaperComponent={({ children }) => (
                  <Paper elevation={8}>
                    <List
                      sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        position: 'relative',
                        '& ul': { padding: 0 },
                      }}
                      component="nav"
                      aria-labelledby="property-utility-list"
                    >
                      {children}
                    </List>
                  </Paper>
                )}
                renderGroup={(params) => (
                  <div key={params.key}>
                    <ListSubheader
                      component="div"
                      sx={{
                        bgcolor: 'background.paper',
                        fontWeight: 700,
                        color: 'common.black',
                        lineHeight: '36px',
                      }}
                    >
                      {params.group}
                    </ListSubheader>
                    <ul>{params.children}</ul>
                  </div>
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <ListItem key={key} {...otherProps}>
                      <ListItemText primary={option.utilityName} />
                    </ListItem>
                  );
                }}
                slotProps={{
                  popper: {
                    sx: {
                      '& .MuiAutocomplete-listbox': {
                        padding: 0,
                      },
                    },
                  },
                }}
              />
            )}
          />
          <Stack spacing={3}>
            <Controller
              name="paymentType"
              control={control}
              defaultValue="separate"
              render={({ field: { onChange, value } }) => (
                <ButtonGroup 
                  fullWidth 
                  variant="outlined" 
                  aria-label="payment type selection"
                  sx={{
                    '& .MuiButton-root': {
                      color: 'text.secondary',
                      borderColor: 'divider',
                      '&.Mui-selected, &:hover': {
                        borderColor: 'divider',
                      },
                      '&.MuiButton-contained': {
                        bgcolor: 'action.selected',
                        '&:hover': {
                          bgcolor: 'action.selected',
                        },
                      },
                    },
                  }}
                >
                  <Button 
                    onClick={() => onChange('separate')}
                    variant={value === 'separate' ? 'contained' : 'outlined'}
                  >
                    Separate Payments
                  </Button>
                  <Button 
                    onClick={() => onChange('same')}
                    variant={value === 'same' ? 'contained' : 'outlined'}
                  >
                    Same Payment
                  </Button>
                  <Button 
                    onClick={() => onChange('manual')}
                    variant={value === 'manual' ? 'contained' : 'outlined'}
                  >
                    Manual ID
                  </Button>
                </ButtonGroup>
              )}
            />

            {selectedPaymentType === 'manual' && (
              <Controller
                name="manualPaymentId"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    label="Enter Payment ID"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}
          </Stack>
        </>
      )}
    </Stack>
  );
}
