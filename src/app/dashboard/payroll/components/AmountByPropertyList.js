import React from 'react';
import { Card, CardContent, Typography, List, ListItem, IconButton, Box, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const AmountByPropertyList = ({ distributionData, view, assetObject }) => {
  // Transform assetObject to use property ID as key
  const assetObjectById = Object.entries(assetObject).reduce((acc, [_, asset]) => {
    acc[asset.id] = asset;
    return acc;
  }, {});

  const [copiedStates, setCopiedStates] = React.useState({});

  const handleCopyClick = (amount, index) => {
    navigator.clipboard.writeText(
      Number(amount)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );
    setCopiedStates({ [view]: index });
  };

  // Transform distribution data into the format we need
  const propertyAmounts = distributionData
    ? Object.entries(distributionData).map(([propertyId, data]) => ({
        property: propertyId,
        amount: data.amount,
      }))
    : [];

  const getTitle = () => {
    return view === 'payrollAmounts'
      ? 'Payroll Amounts by Property'
      : view === 'trakpayAmounts'
        ? 'Trakpay Amounts by Property'
        : 'Manual Amounts by Property';
  };

  // Calculate total amount
  const totalAmount = propertyAmounts.reduce(
    (sum, item) => sum + Number(Number(item.amount).toFixed(2)),
    0
  );

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {getTitle()}
        </Typography>
        <List>
          {propertyAmounts.map((item, index) => (
            <ListItem
              key={`${index}-${view}`}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: index < propertyAmounts.length - 1 ? '1px solid #eee' : 'none',
                py: 1,
                backgroundColor: copiedStates[view] === index ? '#e3f2fd' : 'transparent',
                '&:hover': {
                  backgroundColor: copiedStates[view] === index ? '#e3f2fd' : 'rgba(0, 0, 0, 0.04)',
                },
                transition: 'background-color 0.2s ease',
              }}
            >
              <Typography variant="body1">{assetObjectById[item.property].label}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'grey.200',
                  borderRadius: 1,
                  padding: '4px',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'monospace',
                    px: 2.5,
                  }}
                >
                  $
                  {Number(item.amount)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </Typography>
                <Tooltip title="Copy amount">
                  <IconButton size="small" onClick={() => handleCopyClick(item.amount, index)} sx={{ ml: -0.5 }}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItem>
          ))}
          
          {/* Total row */}
          <ListItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '2px solid #eee',
              py: 1,
              fontWeight: 'bold',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Total
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'grey.200',
                borderRadius: 1,
                padding: '4px',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  px: 2.5,
                  fontWeight: 'bold',
                }}
              >
                ${Number(totalAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Typography>
              <Tooltip title="Copy amount">
                <IconButton size="small" onClick={() => handleCopyClick(totalAmount, 'total')} sx={{ ml: -0.5 }}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default AmountByPropertyList;
