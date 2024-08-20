import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Checkbox, ListItemText } from '@mui/material';

export default function ReactHookMultiSelect({ label, options, name, disabled = false, onChange, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={['public']} // Default value set here
      render={({ field, fieldState: { error } }) => {
        // Check if field.value is empty or undefined and default to 'public'
        const selectedValues = field.value.length > 0 ? field.value : ['public'];
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
                field.onChange(event); // update the form context
                if (onChange) {
                  onChange(event, selectedValues);
                }
              }}
              renderValue={(selected) => {
                return selected.map((value) => options.find((option) => option.value === value)?.label).join(', ');
              }}
            >
              {options.map(
                (option) =>
                  option.value !== 'public' && (
                    <MenuItem key={option.value} value={option.value}>
                      <Checkbox checked={selectedValues.includes(option.value)} />
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  )
              )}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
}
