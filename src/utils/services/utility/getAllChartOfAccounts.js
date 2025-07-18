import getEntrataChartOfAccounts from '../entrata/getChartOfAccounts';
import getWaveChartOfAccounts from '../wave/getWaveChartOfAccounts';
import { unstable_cache } from 'next/cache';

async function getAllChartOfAccountsRaw() {
  console.log('Missed cache: fetching all chart of accounts');
  const [entrataChartOfAccounts, waveChartOfAccounts] = await Promise.all([getEntrataChartOfAccounts(), getWaveChartOfAccounts()]);

  entrataChartOfAccounts.forEach((entrataAccount) => {
    const waveAccount = waveChartOfAccounts.find((account) => account.displayId === entrataAccount.accountNumber);
    if (waveAccount) {
      entrataAccount.waveGlArray = waveAccount.accounts;
    }
  });

  return entrataChartOfAccounts;
}


export default unstable_cache(getAllChartOfAccountsRaw, ['get-all-chart-of-accounts'], { tags: ['chart-of-accounts'] });
