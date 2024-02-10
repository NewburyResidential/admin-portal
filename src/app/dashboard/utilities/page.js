import getEntataLeases from 'src/utils/services/utility-bills/getEntataLeases';
import getUtilityBills from 'src/utils/services/utility-bills/getUtilityBills';
import Report from './components/Report';

export default async function page() {
  const [leases, utilityBills] = await Promise.all([getEntataLeases(), getUtilityBills()]);

  return <Report leases={leases} utilityBills={utilityBills} />;
}
