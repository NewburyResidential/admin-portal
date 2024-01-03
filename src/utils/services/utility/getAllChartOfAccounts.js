import getEntrataChartOfAccounts from "../entrata/getChartOfAccounts";
import getWaveChartOfAccounts from "../wave/getWaveChartOfAccounts";

export default async function getAllChartOfAccounts() {
    const [entrataChartOfAccounts, waveChartOfAccounts] = await Promise.all([
        getEntrataChartOfAccounts(),
        getWaveChartOfAccounts(),
    ])

    entrataChartOfAccounts.forEach(entrataAccount => {
        const waveAccount = waveChartOfAccounts.find(waveAccount => waveAccount.displayId === entrataAccount.accountNumber);
        if (waveAccount) {
            entrataAccount.waveGlArray = waveAccount.accounts;
        }
    });

    return entrataChartOfAccounts;

}