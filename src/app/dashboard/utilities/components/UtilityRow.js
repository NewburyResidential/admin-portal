import { Fragment, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import Label from 'src/components/label';
import Box from '@mui/material/Box';
import Big from 'big.js';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import EditIcon from '@mui/icons-material/Edit';
import EditUtilityDialog from './EditUtilityDialog';
import Tooltip from '@mui/material/Tooltip';
import { subMonths, isWithinInterval, parse } from 'date-fns';
import { apartmentFormatRegex } from './apartmentFormatRegex'; // Import the regex patterns

const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') return '$0.00';
  if (amount instanceof Big) {
    return `$${amount.toFixed(2)}`;
  }
  // If amount is a number or a string that can be converted to a number
  const num = Number(amount);
  if (!Number.isNaN(num)) {
    return `$${Big(num).toFixed(2)}`;
  }
  // Fallback for anything else
  return '$0.00';
};

const ApartmentCell = ({ apartment, completeAddress, startService, endService }) => (
  <Tooltip title={startService && endService ? `Service Dates: ${startService} - ${endService}` : ''} arrow placement="right">
    <Box>
      <Box
        sx={{
          ...(apartment?.toString()?.toLowerCase() === 'common' && {
            textTransform: 'uppercase',
            fontWeight: 'medium',
          }),
        }}
      >
        {apartment}
      </Box>
      {completeAddress && (
        <Box
          sx={{
            fontSize: '0.60rem',
            color: 'text.secondary',
            whiteSpace: 'normal',
            lineHeight: 1.2,
            mt: 0.5,
          }}
        >
          {completeAddress}
        </Box>
      )}
    </Box>
  </Tooltip>
);

const cleanAmountForComparison = (amount) => {
  if (!amount) return '0';
  // Remove dollar signs, commas, and whitespace
  return amount.toString().replace(/[$,\s]/g, '') || '0';
};

const safeNumber = (v) => {
  if (v === null || v === undefined) return '0';
  const cleaned = String(v).replace(/[$,\\s]/g, '');
  return cleaned === '' || Number.isNaN(Number(cleaned)) ? '0' : cleaned;
};

// Move TotalCell outside of UtilityRow to avoid react/no-unstable-nested-components
const TotalCell = ({ children, scrapedAmount, isGrouped }) => (
  <TableCell
    align="right"
    sx={
      isGrouped
        ? {
            fontWeight: 'bold',
            color: 'primary.main',
          }
        : {}
    }
  >
    {scrapedAmount ? (
      <Tooltip title={`Scraped Amount: ${scrapedAmount}`} arrow>
        <Box component="span" sx={{ cursor: 'help' }}>
          {children}
        </Box>
      </Tooltip>
    ) : (
      children
    )}
  </TableCell>
);

export default function UtilityRow({ groupId, bills, selected, onSelectRow, onDelete, onEdit }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [billToEdit, setBillToEdit] = useState(null);

  const isGrouped = bills.length > 1;
  const mainBill = bills[0];

  const getMiscTotal = (bill) => {
    if (!bill.miscAmount) return '0.00';

    // Handle legacy array format
    if (Array.isArray(bill.miscAmount)) {
      return bill.miscAmount.reduce((sum, item) => {
        return Big(sum)
          .plus(item.amount || '0')
          .toString();
      }, '0');
    }

    // Handle new single value format
    return bill.miscAmount;
  };

  const checkAmountDiscrepancy = (bill, groupTotals) => {
    try {
      // Check if individual bill
      if (bill) {
        const miscTotal = getMiscTotal(bill);
        const calculatedTotal = Big(safeNumber(bill.electricAmount))
          .plus(safeNumber(bill.waterSewerAmount))
          .plus(safeNumber(bill.gasAmount))
          .plus(safeNumber(miscTotal))
          .plus(safeNumber(bill.taxAmount));

        // Check if amounts don't add up to total
        const totalMismatch = !calculatedTotal.eq(Big(safeNumber(bill.totalAmount)));

        // Check if scrapedAmount exists and doesn't match totalAmount
        const scrapedMismatch =
          bill.scrapedAmount &&
          !bill.ignoreScraped &&
          !Big(cleanAmountForComparison(bill.scrapedAmount)).eq(Big(cleanAmountForComparison(bill.totalAmount)));

        return totalMismatch || scrapedMismatch;
      }

      // Check group totals
      const calculatedGroupTotal = Big(safeNumber(groupTotals.electric))
        .plus(safeNumber(groupTotals.waterSewer))
        .plus(safeNumber(groupTotals.gas))
        .plus(safeNumber(groupTotals.misc))
        .plus(safeNumber(groupTotals.tax));

      return !calculatedGroupTotal.eq(Big(safeNumber(groupTotals.total)));
    } catch (error) {
      console.error('Error calculating amount discrepancy:', error);
      return true; // Highlight row if there's an error in calculation
    }
  };

  // Fix no-shadow: rename parameter from 'bills' to 'billList'
  const calculateTotal = (billList, field) => {
    return billList.reduce((sum, bill) => {
      if (field === 'miscAmount') {
        return Big(sum).plus(getMiscTotal(bill)).toString();
      }
      const value = bill[field] || '0';
      return Big(safeNumber(sum)).plus(safeNumber(value)).toString();
    }, '0');
  };

  const groupTotals = {
    electric: calculateTotal(bills, 'electricAmount'),
    waterSewer: calculateTotal(bills, 'waterSewerAmount'),
    gas: calculateTotal(bills, 'gasAmount'),
    tax: calculateTotal(bills, 'taxAmount'),
    misc: calculateTotal(bills, 'miscAmount'),
    total: calculateTotal(bills, 'totalAmount'),
  };

  const getGroupStatus = (billList) => {
    const statuses = new Set(billList.map((bill) => bill.status));
    return statuses.size === 1 ? billList[0].status : 'Varies';
  };

  const getS3Url = (key) => {
    return `https://admin-portal-utility-bills-ai-analyzer.s3.us-east-1.amazonaws.com/${key}`;
  };

  const handleEdit = (bill) => {
    setBillToEdit(bill);
    setEditDialogOpen(true);
  };

  const handleSave = async (values) => {
    await onEdit(billToEdit.pk, billToEdit.sk, values);
  };

  const checkDateValidity = (startDate, endDate) => {
    try {
      const today = new Date();
      const twoMonthsAgo = subMonths(today, 2);

      // Parse the dates (assuming MM/DD/YYYY format)
      const start = parse(startDate, 'MM/dd/yyyy', new Date());
      const end = parse(endDate, 'MM/dd/yyyy', new Date());

      // Check if either date is within the valid range
      const isStartValid = isWithinInterval(start, { start: twoMonthsAgo, end: today });
      const isEndValid = isWithinInterval(end, { start: twoMonthsAgo, end: today });

      return isStartValid || isEndValid;
    } catch (error) {
      console.error('Error checking date validity:', error);
      return false;
    }
  };

  const getErrorMessage = (bill) => {
    const errors = [];

    // Check dates
    if (!checkDateValidity(bill.startService, bill.endService)) {
      errors.push('Dates not within last 2 months');
    }

    // Check amounts
    const miscTotal = getMiscTotal(bill);
    const calculatedTotal = Big(safeNumber(bill.electricAmount))
      .plus(safeNumber(bill.waterSewerAmount))
      .plus(safeNumber(bill.gasAmount))
      .plus(safeNumber(miscTotal))
      .plus(safeNumber(bill.taxAmount));

    if (!calculatedTotal.eq(Big(safeNumber(bill.totalAmount)))) {
      errors.push('Amount discrepancy');
    }

    // Check scraped amount - with more defensive checking
    if (bill.scrapedAmount) {
      try {
        const cleanedScrapedAmount = cleanAmountForComparison(bill.scrapedAmount);
        const cleanedTotalAmount = cleanAmountForComparison(bill.totalAmount);

        if (!Big(cleanedScrapedAmount).eq(Big(cleanedTotalAmount))) {
          errors.push('Scraped amount mismatch');
        }
      } catch (error) {
        console.error('Error comparing scraped amount:', error);
        errors.push('Invalid scraped amount format');
      }
    }

    // Check apartment format based on utility vendor
    const apartment = bill.apartment?.toString();
    //console.log('bill', bill)
    const vendor = bill.utilityVendor;

    if (apartment && apartment.toLowerCase() !== 'common' && vendor) {
      const regex = apartmentFormatRegex[vendor];
      if (regex && !regex.test(apartment)) {
        errors.push(`Invalid apartment format for ${vendor}`);
      }
    }

    return errors.length > 0 ? errors.join(', ') : null;
  };

  // Fix no-shadow: rename variable from 'groupTotals' to 'totals' in getGroupErrorMessage
  const getGroupErrorMessage = (billList, totals) => {
    const errors = [];

    // Check individual bills
    billList.forEach((bill) => {
      const billErrors = getErrorMessage(bill);
      if (billErrors) {
        errors.push(`Bill ${bill.sk}: ${billErrors}`);
      }
    });

    // Check group totals
    const calculatedGroupTotal = Big(safeNumber(totals.electric))
      .plus(safeNumber(totals.waterSewer))
      .plus(safeNumber(totals.gas))
      .plus(safeNumber(totals.misc))
      .plus(safeNumber(totals.tax));

    if (!calculatedGroupTotal.eq(Big(safeNumber(totals.total)))) {
      errors.push('Group total mismatch');
    }

    return errors.length > 0 ? errors.join('\n') : null;
  };

  const getRowBackgroundColor = (bill, isGroupItem = false) => {
    const baseColor = isGroupItem ? 'background.paper' : 'inherit';
    const selectedColor = '#e3f2fd';
    const errorColor = '#ff000015';
    const errorHoverColor = '#ff000025';
    const dateErrorColor = '#ff6b6b15';
    const dateErrorHoverColor = '#ff6b6b25';

    if (selected) {
      return {
        bgcolor: selectedColor,
        '&:hover': {
          bgcolor: '#d0e8fc',
        },
      };
    }

    // Check for date errors
    const hasDateError = !checkDateValidity(bill.startService, bill.endService);

    // Check for amount discrepancy
    const hasAmountError = isGroupItem
      ? checkAmountDiscrepancy(bill)
      : isGrouped
        ? checkAmountDiscrepancy(null, groupTotals)
        : checkAmountDiscrepancy(mainBill);

    // Check for apartment format error
    const hasApartmentError = getErrorMessage(bill)?.includes('Invalid apartment format');

    if (hasDateError || hasAmountError || hasApartmentError) {
      return {
        bgcolor: hasDateError ? dateErrorColor : errorColor,
        '&:hover': {
          bgcolor: hasDateError ? dateErrorHoverColor : errorHoverColor,
        },
      };
    }

    return {
      bgcolor: baseColor,
      '&:hover': {
        bgcolor: (theme) => theme.palette.action.hover,
      },
    };
  };

  return (
    <>
      {/* Main Row */}
      <Tooltip title={isGrouped ? getGroupErrorMessage(bills, groupTotals) : getErrorMessage(mainBill)} arrow placement="left">
        <TableRow
          hover
          selected={selected}
          sx={{
            ...getRowBackgroundColor(mainBill),
            ...(isGrouped && {
              bgcolor: (theme) => (selected ? '#e3f2fd' : 'background.neutral'),
            }),
          }}
        >
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onChange={onSelectRow} />
          </TableCell>
          <TableCell>{isGrouped ? 'GROUP' : mainBill.sk || 'N/A'}</TableCell>
          <TableCell>{isGrouped ? '' : mainBill.propertyId}</TableCell>
          <TableCell sx={{ minWidth: 200, maxWidth: 300 }}>
            {!isGrouped && (
              <ApartmentCell
                apartment={mainBill.apartment}
                completeAddress={mainBill.completeAddress}
                startService={mainBill.startService}
                endService={mainBill.endService}
              />
            )}
          </TableCell>
          <TotalCell scrapedAmount={mainBill.scrapedElectricAmount} isGrouped={isGrouped}>
            <Box component="span" sx={{ fontWeight: isGrouped ? 'bold' : 'inherit' }}>
              {formatAmount(groupTotals.electric)}
            </Box>
          </TotalCell>
          <TotalCell scrapedAmount={mainBill.scrapedWaterSewerAmount} isGrouped={isGrouped}>
            <Box component="span" sx={{ fontWeight: isGrouped ? 'bold' : 'inherit' }}>
              {formatAmount(groupTotals.waterSewer)}
            </Box>
          </TotalCell>
          <TotalCell scrapedAmount={mainBill.scrapedGasAmount} isGrouped={isGrouped}>
            <Box component="span" sx={{ fontWeight: isGrouped ? 'bold' : 'inherit' }}>
              {formatAmount(groupTotals.gas)}
            </Box>
          </TotalCell>
          <TotalCell scrapedAmount={mainBill.scrapedMiscAmount} isGrouped={isGrouped}>
            <Box component="span" sx={{ fontWeight: isGrouped ? 'bold' : 'inherit' }}>
              {formatAmount(groupTotals.misc)}
            </Box>
          </TotalCell>
          <TotalCell scrapedAmount={mainBill.scrapedTaxAmount} isGrouped={isGrouped}>
            <Box component="span" sx={{ fontWeight: isGrouped ? 'bold' : 'inherit' }}>
              {formatAmount(groupTotals.tax)}
            </Box>
          </TotalCell>
          <TotalCell scrapedAmount={mainBill.scrapedAmount} isGrouped={isGrouped}>
            <Box component="span" sx={{ fontWeight: isGrouped ? 'bold' : 'inherit' }}>
              {formatAmount(groupTotals.total)}
            </Box>
          </TotalCell>
          <TableCell align="center">
            <Label
              variant="soft"
              color={
                (isGrouped ? getGroupStatus(bills) : mainBill.status) === 'approved'
                  ? 'success'
                  : (isGrouped ? getGroupStatus(bills) : mainBill.status) === 'unapproved'
                    ? 'warning'
                    : (isGrouped ? getGroupStatus(bills) : mainBill.status) === 'error'
                      ? 'error'
                      : 'default'
              }
            >
              {isGrouped ? getGroupStatus(bills) : mainBill.status}
            </Label>
          </TableCell>
          <TableCell align="right">
            {!isGrouped && (
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <IconButton size="small" color="primary" component={Link} href={getS3Url(mainBill.sourceFile?.key)} target="_blank">
                  <VisibilityIcon />
                </IconButton>
                <IconButton size="small" color="info" onClick={() => handleEdit(mainBill)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => onDelete(mainBill.pk, mainBill.sk)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            )}
          </TableCell>
        </TableRow>
      </Tooltip>

      {/* Group Items */}
      {isGrouped &&
        bills.map((bill, index) => (
          <Tooltip key={bill.sk} title={getErrorMessage(bill)} arrow placement="left">
            <TableRow
              sx={{
                ...getRowBackgroundColor(bill, true),
                '& td': {
                  py: 1.5,
                  borderTop: 'none',
                },
              }}
            >
              <TableCell padding="checkbox" />
              <TableCell sx={{ pl: 7 }}>{bill.sk || 'N/A'}</TableCell>
              <TableCell>{bill.propertyId}</TableCell>
              <TableCell sx={{ minWidth: 200, maxWidth: 300 }}>
                <ApartmentCell
                  apartment={bill.apartment}
                  completeAddress={bill.completeAddress}
                  startService={bill.startService}
                  endService={bill.endService}
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title={bill.scrapedElectricAmount ? `Scraped Amount: ${bill.scrapedElectricAmount}` : ''} arrow>
                  <Box component="span" sx={{ cursor: bill.scrapedElectricAmount ? 'help' : 'default' }}>
                    {formatAmount(bill.electricAmount)}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Tooltip title={bill.scrapedWaterSewerAmount ? `Scraped Amount: ${bill.scrapedWaterSewerAmount}` : ''} arrow>
                  <Box component="span" sx={{ cursor: bill.scrapedWaterSewerAmount ? 'help' : 'default' }}>
                    {formatAmount(bill.waterSewerAmount)}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Tooltip title={bill.scrapedGasAmount ? `Scraped Amount: ${bill.scrapedGasAmount}` : ''} arrow>
                  <Box component="span" sx={{ cursor: bill.scrapedGasAmount ? 'help' : 'default' }}>
                    {formatAmount(bill.gasAmount)}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Tooltip title={bill.scrapedMiscAmount ? `Scraped Amount: ${bill.scrapedMiscAmount}` : ''} arrow>
                  <Box component="span" sx={{ cursor: bill.scrapedMiscAmount ? 'help' : 'default' }}>
                    {formatAmount(getMiscTotal(bill))}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Tooltip title={bill.scrapedTaxAmount ? `Scraped Amount: ${bill.scrapedTaxAmount}` : ''} arrow>
                  <Box component="span" sx={{ cursor: bill.scrapedTaxAmount ? 'help' : 'default' }}>
                    {formatAmount(bill.taxAmount)}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Tooltip title={bill.scrapedAmount ? `Scraped Amount: ${bill.scrapedAmount}` : ''} arrow>
                  <Box component="span" sx={{ cursor: bill.scrapedAmount ? 'help' : 'default' }}>
                    {formatAmount(bill.totalAmount)}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Label
                  variant="soft"
                  color={
                    (bill.status === 'approved' && 'success') ||
                    (bill.status === 'unapproved' && 'warning') ||
                    (bill.status === 'error' && 'error') ||
                    'default'
                  }
                >
                  {bill.status}
                </Label>
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton size="small" color="primary" component={Link} href={getS3Url(bill.sourceFile?.key)} target="_blank">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" color="info" onClick={() => handleEdit(bill)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onDelete(bill.pk, bill.sk)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          </Tooltip>
        ))}

      <EditUtilityDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} bill={billToEdit} onSave={handleSave} />
    </>
  );
}
