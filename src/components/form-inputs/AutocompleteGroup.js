import React from 'react';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';
import { useFormContext, Controller } from 'react-hook-form';

export default function AutocompleteGroup({
  fieldName,
  options,
  handleChange = () => {},
  label = 'Select',
  id = 'grouped-auto-complete',
  optionLabel = 'label',
  optionId = 'id',
  sx,
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          sx={sx}
          PopperComponent={({ style, ...props }) => <Popper {...props} sx={{ ...style, height: 0 }} />}
          defaultValue={null}
          onChange={(event, newValue) => {
            field.onChange(newValue);
            handleChange(newValue);
          }}
          id={id}
          options={options.sort((a, b) => b.category.localeCompare(a.category))}
          groupBy={(option) => option.category}
          getOptionLabel={(option) => option[optionLabel]}
          renderInput={(params) => <TextField {...params} label={label} error={!!error} />}
          isOptionEqualToValue={(option, selected) => option[optionId] === selected[optionId]}
          renderOption={(props, option) => (
            <li {...props} key={option[optionId]}>
              {option[optionLabel]}
            </li>
          )}
          renderGroup={(params) => (
            <div key={params.key}>
              <ListSubheader
                sx={{ fontWeight: 'bold', color: (theme) => (theme.palette.mode === 'light' ? 'primary.darker' : theme.palette.grey[500]) }}
              >
                {params.group}
              </ListSubheader>
              {params.children}
            </div>
          )}
        />
      )}
    />
  );
}
