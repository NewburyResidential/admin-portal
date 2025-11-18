import React from 'react';
import { Card, CardContent, Typography, List, ListItem, IconButton, Box, Tooltip, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import ExcelJS from 'exceljs';

const AmountByPropertyList = ({ distributionData, view, assetObject, normalDate }) => {
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
    return view === 'payrollAmounts' ? 'Payroll by Property' : view === 'trakpayAmounts' ? 'Trakpay by Property' : 'Manual by Property';
  };

  // Calculate total amount
  const totalAmount = propertyAmounts.reduce((sum, item) => sum + Number(Number(item.amount).toFixed(2)), 0);

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Payroll Distribution');

    // Set column widths
    worksheet.columns = [
      { header: 'Property', key: 'property', width: 40 },
      { header: 'Amount', key: 'amount', width: 15 },
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add data rows
    propertyAmounts.forEach((item) => {
      worksheet.addRow({
        property: assetObjectById[item.property].label,
        amount: Number(item.amount).toFixed(2),
      });
    });

    // Add total row
    const totalRow = worksheet.addRow({
      property: 'Total',
      amount: Number(totalAmount).toFixed(2),
    });
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFD700' },
    };

    // Format amount column as currency
    worksheet.getColumn('amount').numFmt = '$#,##0.00';
    worksheet.getColumn('amount').alignment = { horizontal: 'right' };

    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getTitle()}_${normalDate.replace(/\//g, '-')}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box onClick={() => navigator.clipboard.writeText(`${getTitle()} - ${normalDate}`)} sx={{ cursor: 'pointer' }}>
            <Typography variant="h6">
              {getTitle()} - {normalDate}
            </Typography>
          </Box>
          <Button variant="contained" color="primary" startIcon={<DownloadIcon />} onClick={handleDownloadExcel} size="small">
            Download Excel
          </Button>
        </Box>
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
                $
                {Number(totalAmount)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
