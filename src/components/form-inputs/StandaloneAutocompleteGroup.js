import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';

export default function StandaloneAutocompleteGroup({
  value = null,
  onChange = () => {},
  options,
  label = 'Select',
  id = 'grouped-auto-complete',
  optionLabel = 'label',
  optionId = 'id',
  variant = 'outlined',
  sx,
  disabled = false,
  error = false,
  helperText,
}) {
  const sortedOptions = options.sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    return 0;
  });

  return (
    <Autocomplete
      value={value}
      sx={sx}
      onChange={(event, newValue) => {
        onChange(newValue);
        event.stopPropagation();
      }}
      id={id}
      options={sortedOptions}
      groupBy={(option) => option.category}
      getOptionLabel={(option) => option[optionLabel]}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          variant={variant}
          onClick={(event) => {
            event.stopPropagation();
          }}
          {...params}
          label={label}
          error={error}
          helperText={helperText}
        />
      )}
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
  );
}
