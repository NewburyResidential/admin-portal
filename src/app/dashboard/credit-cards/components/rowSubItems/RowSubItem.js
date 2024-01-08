
import Box from '@mui/material/Box';

import DropDownGl from './DropDownGl';
import InputAmounts from './InputAmounts';
import TextFieldNote from './TextFieldNote';
import DropDownAssets from './DropDownAssets';
import ButtonTransactionSplit from './ButtonTransactionSplit';

export default function RowSubItem({
  handleTransactionSplit,
  allocationFields,
  transactionIndex,
  allocationIndex,
  chartOfAccounts,
  backgroundColor,
  totalAmount,
  isSplit,
}) {
  const baseFieldName = `transactions[${transactionIndex}].allocations[${allocationIndex}]`;

  const containerStyle = {
    display: 'flex',
    backgroundColor,
    pb: 2,
    alignItems: 'center',
    gap: 2,
    pr: 1,
  };
  return (
    <Box sx={containerStyle}>
      <Box sx={{ flex: '0 0 auto', pr: 2, pl: 4 }}>
        <ButtonTransactionSplit isDefault={allocationIndex === 0} handleTransactionSplit={handleTransactionSplit} />
      </Box>
      <Box sx={{ flex: 3.2 }}>
        <TextFieldNote baseFieldName={baseFieldName} />
      </Box>
      <Box sx={{ flex: 3.2 }}>
        <DropDownAssets transactionIndex={transactionIndex} allocationIndex={allocationIndex} baseFieldName={baseFieldName} />
      </Box>
      <Box sx={{ flex: 3.2 }}>
        <DropDownGl chartOfAccounts={chartOfAccounts} baseFieldName={baseFieldName} />
      </Box>
      <InputAmounts
        allocationFields={allocationFields}
        allocationIndex={allocationIndex}
        transactionIndex={transactionIndex}
        baseFieldName={baseFieldName}
        totalAmount={totalAmount}
        isSplit={isSplit}
      />
    </Box>
  );
}
