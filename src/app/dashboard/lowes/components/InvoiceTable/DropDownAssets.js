import AutocompleteGroup from 'src/components/form-inputs/AutocompleteGroup';
import { assetItems } from 'src/assets/data/assets';

export default function DropDownAssets({ itemIndex }) {
  const fieldName = `invoices[${itemIndex}].property`;
  const properties = assetItems.filter((item) => item.accountingSoftware === 'entrata');

  return <AutocompleteGroup options={properties} fieldName={fieldName} label="Property" id="grouped-property-accounts" />;
}
