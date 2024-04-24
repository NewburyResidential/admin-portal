import { useTheme } from '@mui/material/styles';
import { useFormContext, useWatch } from 'react-hook-form';

import CheckboxApprove from './CheckboxApprove';
import DropDownGl from './DropDownGl';
import CheckboxFixed from './CheckboxFixed';

import Box from '@mui/material/Box';

export default function RowItem({ chartOfAccounts, uncatalogedItem, itemIndex }) {
  const { control, setValue } = useFormContext();

  const toggleRowChecked = () => {
    setValue(`uncatalogedItems[${itemIndex}].checked`, !itemsChecked);
  };

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
        ? 'white'
        : '#white'
      : isLight
        ? 'white'
        : '#212B36';

  const containerStyle = {
    display: 'flex',
    backgroundColor,
    pt: 1.4,
    pb: 1.4,
    pl: 2,
    alignItems: 'center',
    gap: 2,
    borderBottom: '2px dashed #F6F7F8',
  };

  return (
    <Box
      sx={containerStyle}
      onClick={() => {
        toggleRowChecked();
      }}
    >
      <Box sx={{ flex: '0 0 auto', pr: 2 }}>
        <CheckboxApprove itemIndex={itemIndex} />
      </Box>
      <Box sx={{ flex: 1, textAlign: 'left' }}>
        <DropDownGl chartOfAccounts={chartOfAccounts} itemIndex={itemIndex} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 2 }}>
        <CheckboxFixed itemIndex={itemIndex} />
      </Box>
      <Box sx={{ flex: 1, textAlign: 'left', marginLeft: 3 }}>
        {uncatalogedItem?.label || `${uncatalogedItem?.sku}: ${uncatalogedItem?.skuDescription}`}
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>{uncatalogedItem?.category || ''}</Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>{uncatalogedItem?.price || ''}</Box>
      <Box sx={{ flex: 1, align: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={uncatalogedItem.imageUrl || 'https://craftzone.in/assets/img/no-product.png'}
          alt="Unavailable"
          style={{
            maxWidth: '80px',
            maxHeight: '100px',
            objectFit: 'contain',
            margin: 0,
            padding: 0,
          }}
        />
      </Box>
    </Box>
  );
}

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
