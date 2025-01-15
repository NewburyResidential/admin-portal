import AutocompleteGroup from 'src/components/form-inputs/AutocompleteGroup';
import { useFormContext } from 'react-hook-form';

export default function DropDownGl({ chartOfAccounts, baseFieldName }) {
  const fieldName = `${baseFieldName}.glAccount`;

  const { watch } = useFormContext();
  const glAccount = watch(fieldName);
  const disabled = glAccount?.accountName === 'Reimbursement';
  return (
    <AutocompleteGroup
      options={chartOfAccounts}
      fieldName={fieldName}
      label="GL Account"
      id="grouped-gl-accounts"
      optionLabel="accountName"
      optionId="accountNumber"
      disabled={disabled}
    />
  );
}
