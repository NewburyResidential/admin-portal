import { useFormContext } from 'react-hook-form';

export const useRecalculateByPercentage = () => {
  const { setValue } = useFormContext();

  const recalculateByPercentage = (allocations, transactionAmount) => {
    if (allocations.length === 1) {
      setValue(`allocations[0].amount`, transactionAmount);
      setValue(`allocations[0].helper`, 100);
      return;
    }

    const totalAmount = Number(transactionAmount) || 0;
    const numberOfAllocations = allocations.length;
    const percentagePerAllocation = 100 / numberOfAllocations;
    let sumAllocatedAmount = 0;

    allocations.forEach((allocation, index) => {
      const isLast = index === numberOfAllocations - 1;

      let updatedAmount = (percentagePerAllocation / 100) * totalAmount;
      updatedAmount = parseFloat(updatedAmount.toFixed(2));

      if (isLast) {
        // Handle rounding discrepancies by adjusting the last allocation
        const discrepancy = totalAmount - sumAllocatedAmount - updatedAmount;
        updatedAmount += discrepancy;
        updatedAmount = parseFloat(updatedAmount.toFixed(2));
      } else {
        sumAllocatedAmount += updatedAmount;
      }

      setValue(`allocations[${index}].amount`, updatedAmount);
      setValue(`allocations[${index}].helper`, parseFloat(percentagePerAllocation.toFixed(2)));
    });
  };

  return recalculateByPercentage;
};
