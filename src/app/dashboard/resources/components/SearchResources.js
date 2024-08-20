import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import Typography from '@mui/material/Typography';

import { fileThumb } from 'src/components/file-thumbnail';
import { useResponsive } from 'src/hooks/use-responsive';

function highlightText(text, highlight, label) {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return parts.map((part, i) => (
    <span key={i} style={{ fontWeight: part.toLowerCase() === highlight.toLowerCase() ? 800 : label ? 600 : 400 }}>
      {part}
    </span>
  ));
}

function renderOption(option, inputValue, isLaptop) {
  const icon =
    option.uploadType === 'website' ? (
      <Iconify
        icon="solar:card-search-bold-duotone"
        sx={{
          width: 24,
          mr: '10px',
          height: 24,
          color: '#4682B4',
          ml: '2px',
        }}
      />
    ) : (
      <img
        src={fileThumb(option.file.fileName)}
        alt="File Icon"
        style={{ marginRight: 13, width: '18px', height: '18px', marginLeft: 6 }}
      />
    );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {icon}
      <div>
        <strong>{highlightText(option.label, inputValue, true)}</strong>
        {isLaptop && <div style={{ fontSize: '0.8rem', color: 'text.secondary' }}>{highlightText(option.description, inputValue)}</div>}
      </div>
    </Box>
  );
}

export default function SearchResources({ resources }) {
  const isLaptop = useResponsive('up', 'lg');
  return (
    <Box sx={{ width: '100%', margin: 'auto', mt: 8, mb: 2 }}>
      <Typography variant="h5" color="" sx={{ mb: 2 }}>
        Resources
      </Typography>
      <Autocomplete
        onChange={(event, value) => {
          const url = value?.url || value?.file?.fileUrl;
          if (url) {
            window.open(url, '_blank').focus();
          }
        }}
        freeSolo
        id="search-resources"
        options={resources}
        getOptionLabel={(option) => `${option.label} - ${option.description}`}
        renderInput={(params) => <TextField {...params} label="Search All Resources" variant="outlined" />}
        renderOption={(props, option, { inputValue }) => {
          const { key, ...otherProps } = props;
          return (
            <li key={key} {...otherProps}>
              {renderOption(option, inputValue, isLaptop)}
            </li>
          );
        }}
        filterOptions={(options, { inputValue }) =>
          options.filter(
            (option) =>
              option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
              option.description.toLowerCase().includes(inputValue.toLowerCase())
          )
        }
      />
    </Box>
  );
}
