import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';
import Steps from './components/Steps';

export default async function page() {
  const [chartOfAccounts] = await Promise.all([getAllChartOfAccounts()]);

  return (
    <div>
      <Steps chartOfAccounts={chartOfAccounts} />
    </div>
  );
}
