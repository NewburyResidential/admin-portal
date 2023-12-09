import Table from "./components/Table";
import getVendorLocations  from "src/utils/services/entrata/getVendorLocations";
import getChartOfAccounts from "src/utils/services/entrata/getChartOfAccounts";
import getUnapprovedTransactions from "src/utils/services/CCExpenses/getUnapprovedTransactions";

export default async function page () {
  const vendors = await getVendorLocations();
  const chartOfAccounts = await getChartOfAccounts();
  const unapprovedTransactions = await getUnapprovedTransactions();


  return (
    <div>
      <Table vendors={vendors} chartOfAccounts={chartOfAccounts} unapprovedTransactions={unapprovedTransactions}/>
    </div>
  )
}