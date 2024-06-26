import AutocompleteGroup from 'src/components/form-inputs/AutocompleteGroup';

export default function DropDownGl({ chartOfAccounts, itemIndex }) {
  const fieldName = `uncatalogedItems[${itemIndex}].glAccount`;

  return (
    <AutocompleteGroup
      options={chartOfAccounts}
      fieldName={fieldName}
      label="GL Account"
      id="grouped-gl-accounts"
      optionLabel="accountName"
      optionId="accountNumber"
    />
  );
}
