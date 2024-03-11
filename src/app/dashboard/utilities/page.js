import getEntataLeases from 'src/utils/services/utility-bills/getEntataLeases';
import Report from './components/Report';

export default async function page() {
  const [leases] = await Promise.all([getEntataLeases()]);

  return <Report leases={leases} utilityBills={[]} />;
}
