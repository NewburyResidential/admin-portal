import { isMissingValue } from 'src/utils/expense-calculations/missing-value';
import AutocompleteGroup from 'src/components/form-inputs/AutocompleteGroup';

export default function DropDownGl({ chartOfAccounts, allocation, handleGlAccountChange, item }) {
  const currentValue = allocation.glAccount ? allocation.glAccount : null;

  const handleChange = (newValue) => {
    handleGlAccountChange(item.id, allocation.id, newValue);
  };

  return (
    <AutocompleteGroup
      value={currentValue}
      options={chartOfAccounts}
      handleChange={handleChange}
      label="GL Account"
      id="grouped-gl-accounts"
      optionLabel="accountName"
      optionId="accountNumber"
      error={item?.isSubmitted && isMissingValue(currentValue)}
    />
  );
}
