export function recalculateAmountDistribution(item, handleAllocationAmountChange) {
  item.allocations.forEach((alloc) => {
    handleAllocationAmountChange(item.id, alloc.id, 0);
  });
}
