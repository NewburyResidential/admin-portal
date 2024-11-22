import { Controller, useFormContext, useWatch } from 'react-hook-form';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function InputAmounts({ allocationFields, isSplit, baseFieldName, allocationIndex, totalAmount }) {
  const { control, getValues, setValue } = useFormContext();

  const percent = useWatch({
    control,
    name: allocationFields.map((_, index) => `allocations[${index}].helper`),
  });

  const calculationMethod = getValues(`calculationMethod`);
  const amount = getValues(`allocations.${allocationIndex}.amount`);

  const formatMessage = (value, isPercent) => {
    const absValue = Math.abs(value);
    const formattedValue = absValue % 1 === 0 ? absValue : absValue.toFixed(2);
    const sign = value >= 0 ? '+' : '-';
    return isPercent ? `${sign}${formattedValue}` : `${sign}$${formattedValue}`;
  };

  const roundAsNeeded = (value) => {
    const roundedValue = Math.round(value * 100) / 100;
    return roundedValue;
  };

  let allocations;
  let sumOfAllocations;
  let amountDifference;
  let percentDifference;
  let amountMessage;
  let percentMessage;

  if (calculationMethod === 'amount') {
    allocations = getValues(`allocations`);
    sumOfAllocations = allocations.reduce((sum, allocation) => sum + parseFloat(allocation.amount || 0), 0);
    amountDifference = parseFloat((parseFloat(totalAmount) - sumOfAllocations).toFixed(2)) || 0;
    percentDifference = Math.round((amountDifference / totalAmount) * 100);

    amountMessage = formatMessage(amountDifference, false);
    percentMessage = formatMessage(percentDifference, true);
  }

  const handlePercentChange = (e, field) => {
    let value = parseInt(e.target.value, 10);
    value = Number.isNaN(value) ? '' : Math.max(0, Math.min(value, 100));

    const sumOfPercents = allocations.reduce(
      (sum, allocation, index) => sum + (index !== allocationIndex ? parseFloat(allocation.helper || 0) : 0),
      0
    );

    let updatedAmount = '';
    if (value !== 0 && value !== '') {
      updatedAmount =
        value + sumOfPercents === 100
          ? roundAsNeeded((percent[allocationIndex] / 100) * totalAmount + amountDifference)
          : roundAsNeeded((value / 100) * totalAmount);
    }

    setValue(`${baseFieldName}.amount`, updatedAmount.toString());
    field.onChange(value.toString());
  };

  const handleAmountChange = (e, field) => {
    const { value } = e.target;
    const isValueEmptyOrZero = value === '' || value === 0;

    if (isValueEmptyOrZero) {
      setValue(`${baseFieldName}.helper`, '');
    } else {
      const numericValue = parseFloat(value);
      if (!Number.isNaN(numericValue) && totalAmount !== 0) {
        const helperValue = Math.round((numericValue / totalAmount) * 100).toString();
        setValue(`${baseFieldName}.helper`, helperValue);
      } else {
        setValue(`${baseFieldName}.helper`, '');
      }
    }
    field.onChange(value);
  };

  return (
    <>
      {isSplit && (
        <Box sx={{ flex: isSplit ? 0.92 : 1 }}>
          {calculationMethod === 'amount' ? (
            <Controller
              name={`${baseFieldName}.helper`}
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextField
                    {...field}
                    label={amountDifference === 0 ? 'Percent' : `${percentMessage}%`}
                    variant="outlined"
                    autoComplete="off"
                    fullWidth
                    onChange={(e) => handlePercentChange(e, field)}
                    error={!!error}
                  />
                );
              }}
            />
          ) : (
            <TextField value={percent[allocationIndex]} label="Units" disabled variant="outlined" autoComplete="off" fullWidth />
          )}
        </Box>
      )}
      <Box sx={{ flex: isSplit ? 0.92 : 2 }}>
        {calculationMethod === 'amount' ? (
          <Controller
            name={`${baseFieldName}.amount`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Box sx={{ position: 'relative', width: '100%' }}>
                <TextField
                  {...field}
                  label={amountDifference === 0 ? (isSplit ? 'Amount' : 'Total') : `${amountMessage}`}
                  variant="outlined"
                  autoComplete="off"
                  type="number"
                  disabled={allocations.length === 1}
                  fullWidth
                  error={!!error}
                  onChange={(e) => {
                    handleAmountChange(e, field);
                  }}
                />
                {amountDifference !== 0 && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      right: '-14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                    onClick={(e) => {
                      let amountValue = getValues(`${baseFieldName}.amount`);
                      amountValue = roundAsNeeded(amountDifference + Number(amountValue));
                      let percentValue = getValues(`${baseFieldName}.helper`);
                      percentValue = roundAsNeeded(percentDifference + Number(percentValue));
                      setValue(`${baseFieldName}.helper`, percentValue.toString());
                      setValue(`${baseFieldName}.amount`, amountValue.toString());
                    }}
                  >
                    <AddCircleIcon />
                  </IconButton>
                )}
              </Box>
            )}
          />
        ) : (
          <TextField
            InputProps={{ startAdornment: <span>$</span> }}
            value={amount}
            label="Amount"
            disabled
            variant="outlined"
            autoComplete="off"
            fullWidth
          />
        )}
      </Box>
    </>
  );
}
