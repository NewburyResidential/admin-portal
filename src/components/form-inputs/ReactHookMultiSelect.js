import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Checkbox, ListItemText } from '@mui/material';

export default function ReactHookMultiSelect({ label, options, name, disabled = false, onChange, ...other }) {
  const { control } = useFormContext();

  // No manual mode: Use onChange to handle changes or reversions

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl error={!!error} fullWidth variant="outlined">
            <InputLabel disabled={disabled} id={`${name}-label`}>
              {label}
            </InputLabel>
            <Select
              {...field}
              {...other}
              labelId={`${name}-label`}
              label={label}
              disabled={disabled}
              multiple
              onChange={(event) => {
                field.onChange(event);
                if (onChange) {
                  onChange(event, field.value);
                }
              }}
              renderValue={(selected) => selected.map((value) => options.find((option) => option.value === value)?.label).join(', ')}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Checkbox checked={field.value.includes(option.value)} />
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
}
