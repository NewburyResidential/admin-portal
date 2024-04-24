import { useFormContext, useWatch } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

export default function SubRowItems({ lineItem, catalogedItems, itemIndex }) {
  const itemLabel = catalogedItems[lineItem?.sku]?.label ? catalogedItems[lineItem?.sku]?.label : lineItem.skuDescription;
  const accountName = catalogedItems[lineItem.sku].glAccountName;

  const gridItemStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    overflow: 'hidden',
  };

  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const { control } = useFormContext();

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

  return (
    <>
      <Box sx={{ padding: '9px 25px', backgroundColor }}>
        <Grid container spacing={2}>
          <Grid item xs={5} sx={{ ...gridItemStyle, justifyContent: 'flex-start', textOverflow: 'ellipsis' }}>
            <Typography variant="body1" noWrap fontSize="13px">
              {itemLabel}
            </Typography>
          </Grid>

          <Grid item xs={2.5} sx={gridItemStyle}>
            <Typography variant="body1" fontSize="13px">
              {accountName}
            </Typography>
          </Grid>

          <Grid item xs={1.5} sx={gridItemStyle}>
            <Typography variant="body1" fontSize="13px">
              {lineItem.qty}
            </Typography>
          </Grid>

          <Grid item xs={1.5} sx={gridItemStyle}>
            <Typography variant="body1" fontSize="13px">
              {lineItem.cost}
            </Typography>
          </Grid>

          <Grid item xs={1.5} sx={gridItemStyle}>
            <Typography variant="body1" fontSize="13px">
              {lineItem.totalCost}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider color="white" />
    </>
  );
}

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
