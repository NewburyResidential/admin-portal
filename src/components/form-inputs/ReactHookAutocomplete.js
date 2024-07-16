import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ReactHookAutocomplete({ label, options, name, disabled = false, onChange, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { value, onChange: fieldOnChange, ...restField } = field;

        return (
          <FormControl error={!!error} fullWidth variant="outlined">
            <>
              <Autocomplete
                {...restField}
                {...other}
                options={options}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
                disabled={disabled}
                value={value || null}
                onChange={(event, value) => {
                  fieldOnChange(value);
                  if (onChange) {
                    onChange(value);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    error={!!error}
                    helperText={error ? error.message : null}
                    disabled={disabled}
                  />
                )}
              />
            </>
          </FormControl>
        );
      }}
    />
  );
}
