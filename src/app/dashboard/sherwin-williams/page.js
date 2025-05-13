import InvoiceTable from "./components/Table";
import getAssets from "src/utils/services/newbury/get-assets";
import { authOptions } from "src/app/api/auth/[...nextauth]/route";
import { dashboardPaths } from "src/routes/paths";
import isAuthorizedToViewPage from "src/layouts/dashboard/authorization/isAuthorizedToViewPage";
import { getServerSession } from "next-auth";
import getSherwinWilliamsInvoices from "src/utils/services/sherwin-williams/get-sherwin-williams-invoices";
import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';


export default async function SherwinWilliams() {
  const [assets, sherwinWilliamsInvoices, chartOfAccounts, session] = await Promise.all([getAssets(), getSherwinWilliamsInvoices(), getAllChartOfAccounts(), getServerSession(authOptions)]);

 isAuthorizedToViewPage(session, dashboardPaths.sherwinWilliams.root);

  return (
    <div>
      <InvoiceTable assets={assets} sherwinWilliamsInvoices={sherwinWilliamsInvoices} chartOfAccounts={chartOfAccounts} />
    </div>
  );
}
    
