import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';

export default function AutocompleteGroup({
  value,
  options,
  handleChange,
  label = 'Select',
  error = false,
  id = 'grouped-auto-complete',
  optionLabel = 'label',
  optionId = 'id',
  sx,
}) {
  const currentValue = value ? value : null;
  return (
    <Autocomplete
      sx={sx}
      PopperComponent={({ style, ...props }) => <Popper {...props} sx={{ ...style, height: 0 }} />}
      value={currentValue}
      defaultValue={null}
      onChange={(event, newValue) => {
        handleChange(newValue);
      }}
      id={id}
      options={options.sort((a, b) => b.category.localeCompare(a.category))}
      groupBy={(option) => option.category}
      getOptionLabel={(option) => option[optionLabel]}
      renderInput={(params) => <TextField {...params} label={label} error={error} />}
      isOptionEqualToValue={(option, value) => option[optionId] === value[optionId]}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option[optionId]}>
            {option[optionLabel]}
          </li>
        );
      }}
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
