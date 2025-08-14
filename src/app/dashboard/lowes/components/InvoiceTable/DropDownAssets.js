import AutocompleteGroup from 'src/components/form-inputs/AutocompleteGroup';

export default function DropDownAssets({ itemIndex, newburyAssets }) {
  const fieldName = `invoices[${itemIndex}].property`;
  const properties = newburyAssets.filter((item) => item.accountingSoftware === 'entrata');

  return <AutocompleteGroup options={properties} fieldName={fieldName} label="Property" id="grouped-property-accounts" />;
}
