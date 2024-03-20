import getWaveChartOfAccounts from 'src/utils/services/wave/getWaveChartOfAccounts';
import FileInput from './components/FileInput';
import getNewburyWaveChartOfAccounts from 'src/utils/services/wave/getNewburyWaveChartOfAccounts';

export default async function page() {
  const waveChartOfAccounts = await getNewburyWaveChartOfAccounts();
  console.log(waveChartOfAccounts);
  return <FileInput waveChartOfAccounts={waveChartOfAccounts} />;
}
