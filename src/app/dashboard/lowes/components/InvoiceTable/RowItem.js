import { useTheme } from '@mui/material/styles';
import { useFormContext, useWatch } from 'react-hook-form';

import CheckboxApprove from './CheckboxApprove';
import DropDownAssets from './DropDownAssets';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function RowItem({ itemIndex, invoice, expanded, toggleExpanded, newburyAssets }) {
  const { control, setValue } = useFormContext();

  const toggleRowChecked = () => {
    setValue(`invoices[${itemIndex}].checked`, !itemsChecked);
  };

  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const itemsChecked = useWatch({
    control,
    name: `invoices[${itemIndex}].checked`,
  });

  const backgroundColor = itemsChecked
    ? isLight
      ? 'primary.lighter'
      : hexToRgba(theme.palette.primary.dark, 0.4)
    : itemIndex % 2 !== 0
      ? isLight
        ? 'white'
        : 'white'
      : isLight
        ? 'white'
        : '#212B36';

  const containerStyle = {
    display: 'flex',
    backgroundColor,
    pt: 2,
    pb: 2,
    pl: 2,
    pr: 3,
    alignItems: 'center',
    gap: 3,
    borderBottom: '2px dashed #F6F7F8',
  };

  function toTitleCase(text) {
    if (!text) return text;
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', ...containerStyle }}
      onClick={toggleRowChecked}
    >
      <Box sx={{ flex: 0.3 }}>
        <CheckboxApprove itemIndex={itemIndex} />
      </Box>
      <Box sx={{ flex: 1.7 }}>
        <DropDownAssets itemIndex={itemIndex} newburyAssets={newburyAssets} />
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {invoice?.invoiceNumber}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {toTitleCase(invoice?.buyerName)}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {invoice?.jobName}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center' }}>{invoice?.totalInvoice}</Box>
      <Box sx={{ flex: 0.3, textAlign: 'right', paddingRight: 2 }}>
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            toggleExpanded(itemIndex);
          }}
        >
          {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
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
