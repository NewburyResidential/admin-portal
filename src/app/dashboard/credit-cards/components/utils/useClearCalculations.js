import { useFormContext } from 'react-hook-form';

export const useClearCalculations = () => {
  const { setValue } = useFormContext();

  const clearAmounts = (allocations, transactionIndex) => {
    allocations.forEach((allocation, index) => {
      setValue(`transactions[${transactionIndex}].allocations[${index}].amount`, '');
      setValue(`transactions[${transactionIndex}].allocations[${index}].helper`, '');
    });
  };
  return clearAmounts;
};
