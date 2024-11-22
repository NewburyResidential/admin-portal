import Box from '@mui/material/Box';

import DropDownGl from './DropDownGl';
import InputAmounts from './InputAmounts';
import TextFieldNote from './TextFieldNote';
import DropDownAssets from './DropDownAssets';
import ButtonTransactionSplit from './ButtonTransactionSplit';
import { useRecalculateByUnit } from '../utils/useRecalculateByUnit';
import { useClearCalculations } from '../utils/useClearCalculations';
import { useFormContext } from 'react-hook-form';

export default function RowSubItem({
  allocationFields,
  allocationIndex,
  chartOfAccounts,
  backgroundColor,
  totalAmount,
  isSplit,
  append,
  remove,
}) {
  const clearAmounts = useClearCalculations();
  const recalculateByUnit = useRecalculateByUnit();

  const { getValues, setValue } = useFormContext();

  const handleTransactionSplit = () => {
    const calculationMethod = getValues(`calculationMethod`);
    const { length } = allocationFields;

    if (allocationIndex === 0) {
      const currentAllocation = getValues(`allocations[${allocationIndex}]`);

      append({
        note: currentAllocation?.note || '',
        asset: currentAllocation?.asset || null,
        glAccount: currentAllocation?.glAccount || null,
      });

      if (calculationMethod === 'amount') {
        const updatedAllocations = getValues(`allocations`);
        clearAmounts(updatedAllocations);
      } else {
        const updatedAllocations = getValues(`allocations`);
        recalculateByUnit(updatedAllocations, totalAmount);
      }
    } else {
      if (length === 2) {
        setValue(`allocations[0].amount`, totalAmount);
        setValue(`allocations[0].helper`, 100);
      } else if (calculationMethod === 'amount') {
        const updatedAllocations = getValues(`allocations`);
        clearAmounts(updatedAllocations);
      }
      remove(allocationIndex);
      if (calculationMethod === 'unit') {
        const updatedAllocations = getValues(`allocations`);
        recalculateByUnit(updatedAllocations, totalAmount, allocationIndex);
      }
    }
  };
  const baseFieldName = `allocations[${allocationIndex}]`;

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
        <ButtonTransactionSplit isDefault={allocationIndex === 0} handleTransactionSplit={() => handleTransactionSplit()} />
      </Box>

      <Box sx={{ flex: 3.2 }}>
        <DropDownAssets allocationIndex={allocationIndex} baseFieldName={baseFieldName} />
      </Box>
      <Box sx={{ flex: 3.2 }}>
        <DropDownGl chartOfAccounts={chartOfAccounts} baseFieldName={baseFieldName} />
      </Box>
      <Box sx={{ flex: 3.2 }}>
        <TextFieldNote baseFieldName={baseFieldName} />
      </Box>
      <InputAmounts
        allocationFields={allocationFields}
        allocationIndex={allocationIndex}
        baseFieldName={baseFieldName}
        totalAmount={totalAmount}
        isSplit={isSplit}
      />
    </Box>
  );
}
