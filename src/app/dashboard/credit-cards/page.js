import Table from "./components/Table";
import getVendorLocations  from "../../../utils/services/entrata/getVendorLocations";
import getChartOfAccounts from "../../../utils/services/entrata/getChartOfAccounts";

export default async function page () {
  const vendors = await getVendorLocations();
  const chartOfAccounts = await getChartOfAccounts();
  //console.log(vendors)

  return (
    <div>
      <Table vendors={vendors} chartOfAccounts={chartOfAccounts}/>
    </div>
  )
}