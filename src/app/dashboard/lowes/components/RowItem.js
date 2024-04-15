import { useTheme } from '@mui/material/styles';
import { useFormContext, useFieldArray, useWatch, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CheckboxApprove from './CheckboxApprove';

export default function RowItem({ itemIndex }) {
  const { control } = useFormContext();

  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const itemsChecked = useWatch({
    control,
    name: `uncatalogedItems[${itemIndex}].checked`,
  });

  const backgroundColor = itemsChecked
    ? isLight
      ? 'primary.lighter'
      : hexToRgba(theme.palette.primary.dark, 0.4)
    : itemIndex % 2 !== 0
      ? isLight
        ? '#FAFBFC'
        : '#2F3944'
      : isLight
        ? '#f0f0f0'
        : '#212B36';

  const containerStyle = {
    display: 'flex',
    backgroundColor,
    pt: 2,
    pb: 3,
    pl: 2,
    alignItems: 'center',
    gap: 2,
  };

  return (
    <>
      <Box sx={containerStyle}>
        <Box sx={{ flex: '0 0 auto', pr: 2 }}>
          <CheckboxApprove itemIndex={itemIndex} />
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>1</Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>2</Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>3</Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>4</Box>
      </Box>
    </>
  );
}

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
