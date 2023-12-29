'use client';
import { assetItems } from 'src/assets/data/assets';
import AutocompleteGroup from 'src/components/form-inputs/AutocompleteGroup';

export default function DropDownAssets({ asset, setAsset }) {

  const handleAssetChange = (asset) => {
    setAsset(asset);
  };
  
  return (
    <AutocompleteGroup 
    value={asset}
    options={assetItems}
    handleChange={handleAssetChange}
    label="Location"
    id="grouped-asset-accounts"
    sx={{ width: '200px'}}
    /> 
  );
}