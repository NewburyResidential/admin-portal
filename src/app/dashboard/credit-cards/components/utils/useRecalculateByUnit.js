import { useFormContext } from 'react-hook-form';

export const useRecalculateByUnit = () => {
  const { setValue } = useFormContext();
  const calculateTotalUnits = (allocations) => {
    const totalNumberOfUnits = allocations.reduce((total, allocation) => {
      const units = Number(allocation.asset?.units) || 0;
      return total + units;
    }, 0);

    return totalNumberOfUnits;
  };

  const recalculateByUnit = (allocations, transactionAmount) => {
    if (allocations.length === 1) {
      setValue(`allocations[0].amount`, transactionAmount);
      setValue(`allocations[0].helper`, 0);
      return;
    }
    const totalUnits = calculateTotalUnits(allocations);
    console.log('totalUnits', totalUnits);
    console.log('allocations', allocations);
    const totalAmount = Number(transactionAmount) || 0;
    let sumAllocatedAmount = 0;

    allocations.forEach((allocation, index) => {
      const { length } = allocations;
      const isLast = index === length - 1;
      const unitsToUse = Number(allocation.asset?.units) || 0;

      let updatedAmount;
      if (unitsToUse === 0) {
        updatedAmount = '';
      } else {
        updatedAmount = (unitsToUse / totalUnits) * totalAmount;
        updatedAmount = parseFloat(updatedAmount.toFixed(2));

        if (isLast) {
          const discrepancy = totalAmount - sumAllocatedAmount - updatedAmount;
          updatedAmount += discrepancy;
          updatedAmount = parseFloat(updatedAmount.toFixed(2));
        } else {
          sumAllocatedAmount += updatedAmount;
        }
      }

      setValue(`allocations[${index}].amount`, updatedAmount);
      setValue(`allocations[${index}].helper`, unitsToUse);
    });
  };

  return recalculateByUnit;
};
