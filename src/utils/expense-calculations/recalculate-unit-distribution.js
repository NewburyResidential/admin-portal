export function recalculateUnitDistribution(item, handleAllocationAmountChange) {
  const totalUnits = item.allocations.reduce((total, alloc) => total + (alloc.asset?.units || 0), 0);

  if (totalUnits === 0) {
    item.allocations.forEach((alloc) => {
      handleAllocationAmountChange(item.id, alloc.id, 0);
    });
    return;
  }

  let sumAllocatedAmount = 0;
  const allocationsLength = item.allocations.length;

  item.allocations.forEach((alloc, index) => {
    let updatedAmount = ((alloc.asset?.units || 0) / totalUnits) * item.amount;
    updatedAmount = parseFloat(updatedAmount.toFixed(2));

    if (index === allocationsLength - 1) {
      const discrepancy = item.amount - sumAllocatedAmount - updatedAmount;
      updatedAmount += discrepancy;
    } else {
      sumAllocatedAmount += updatedAmount;
    }

    updatedAmount = parseFloat(updatedAmount.toFixed(2));

    handleAllocationAmountChange(item.id, alloc.id, updatedAmount);
  });
}
