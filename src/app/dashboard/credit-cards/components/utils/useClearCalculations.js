import { useFormContext } from 'react-hook-form';

export const useClearCalculations = () => {
  const { setValue } = useFormContext();

  const clearAmounts = (allocations) => {
    allocations.forEach((allocation, index) => {
      setValue(`allocations[${index}].amount`, '');
      setValue(`allocations[${index}].helper`, '');
    });
  };
  return clearAmounts;
};
