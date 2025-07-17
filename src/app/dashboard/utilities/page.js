import getAssets from "src/utils/services/newbury/get-assets";
import UtilityTableWrapper from './components/UtilityTableWrapper';
import getAllUtilities from "src/utils/services/utilities/get-all-utilities";

export default async function UtilitiesPage() {
  // Fetch data in parallel
  const [assetList, utilities] = await Promise.all([
    getAssets(),
    getAllUtilities(),
  ]);
  
  return (
    <UtilityTableWrapper 
      assetList={assetList}   
      utilities={utilities}
    />
  );
}

