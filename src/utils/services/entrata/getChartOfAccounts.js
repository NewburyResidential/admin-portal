import { ENTRATA_API } from 'src/config-global';
import { authorization } from './authorization';
import { chartOfAccounts } from 'src/assets/data/chart-of-accounts';

export default async function getEntrataChartOfAccounts() {
  const data = await fetchData();
  const glAccountObjects = data.response.result.GlTrees.GlTree[0].GlAccounts.GlAccount;
  return condenseGlAccountData(glAccountObjects);
}

async function fetchData() {
  const endpoint = '/api/v1/financial';
  const bodyMethod = 'getGlTrees';
  const url = `${ENTRATA_API.baseUrl}${endpoint}`;
  const body = {
    auth: { type: 'basic' },
    requestId: '15',
    method: { name: bodyMethod },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch ${bodyMethod} failed:`, error);
    throw error;
  }
}

function condenseGlAccountData(glAccountObjects) {
  const accountToCategoryLookup = Object.entries(chartOfAccounts).reduce((lookup, [category, accountNumbers]) => {
    accountNumbers.forEach((accountNumber) => {
      lookup[accountNumber] = category;
    });
    return lookup;
  }, {});

  const refinedAccounts = glAccountObjects
    .filter((account) => accountToCategoryLookup[account.AccountNumber])
    .map((account) => ({
      accountName: account.AccountName,
      accountId: account['@attributes'].Id,
      accountNumber: account.AccountNumber,
      category: accountToCategoryLookup[account.AccountNumber],
    }));

  return refinedAccounts;
}
