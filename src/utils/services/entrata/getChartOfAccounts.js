import fetchData from "./fetch";
import { chartOfAccounts } from "src/assets/data/chart-of-accounts";

function condenseGlAccountData(glAccountObjects) {
    
    const accountToCategoryLookup = Object.entries(chartOfAccounts).reduce((lookup, [category, accountNumbers]) => {
        accountNumbers.forEach(accountNumber => {
            lookup[accountNumber] = category;
        });
        return lookup;
    }, {});

    const refinedAccounts = glAccountObjects
        .filter(account => accountToCategoryLookup[account.AccountNumber])
        .map(account => ({
            accountName: account.AccountName,
            accountId: account["@attributes"].Id,
            accountNumber: account.AccountNumber,
            category: accountToCategoryLookup[account.AccountNumber]
        }));

    return refinedAccounts;
}


export default async function getEntrataChartOfAccounts() {
    const data = await fetchData('/api/v1/financial', "getGlTrees", 'force-cache');
    const glAccountObjects = data.response.result.GlTrees.GlTree[0].GlAccounts.GlAccount;
    return condenseGlAccountData(glAccountObjects);
}

    
      