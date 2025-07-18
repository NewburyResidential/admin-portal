import { assetItems } from 'src/assets/data/assets';
import Popper from '@mui/material/Popper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ListSubheader from '@mui/material/ListSubheader';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

export default function DropDownAssets({ assets, setAssets }) {
  const currentValue = assets || [];

  return (
    <Autocomplete
      disableCloseOnSelect
      multiple
      value={currentValue}
      sx={{ width: 300 }}
      PopperComponent={({ style, ...props }) => <Popper {...props} sx={{ ...style, height: 0 }} />}
      onChange={(event, newValue) => {
        setAssets(newValue);
      }}
      id="grouped-assets"
      options={assetItems.sort((a, b) => b.category.localeCompare(a.category))}
      groupBy={(option) => option.category}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Location"
          InputProps={{
            ...params.InputProps,
            startAdornment:
              currentValue.length > 0 ? (
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }}>
                  {currentValue.map((option) => option.label).join(', ')}
                </div>
              ) : null,
          }}
        />
      )}
      isOptionEqualToValue={(option, selected) => option.accountId === selected.accountId}
      renderOption={(props, option, { selected }) => {
        const { key, ...rest } = props;
        return (
          <li key={key} {...rest}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} />
            <ListItemText primary={option.label} />
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
