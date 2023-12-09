import fetchData from "./fetch";

function condenseGlAccountData(glAccountObjects) {
    
    const categoryToAccountMapping = {
        'Repairs & Improvements': [
          '611100', '611200', '611300', '611400', '611500', '611600', 
          '611700', '611800', '611900', '650500', '640400', '650000', 
          '650100', '650200', '650300', '650400', '654100', '624300', '624700'
        ],
        'Travel': [
          '631100', '631500'
        ],
        'Admin': [
          '631600', '632100', '632300', '632400', '654200', '622200', 
          '622300', '630100', '630300', '630200', '630400'
        ],
        'Office': [
          '621100', '621200', '622100', '632500'
        ],
      };

    const accountToCategoryLookup = Object.entries(categoryToAccountMapping).reduce((lookup, [category, accountNumbers]) => {
        accountNumbers.forEach(accountNumber => {
            lookup[accountNumber] = category;
        });
        return lookup;
    }, {});

    const refinedAccounts = glAccountObjects
        .filter(account => accountToCategoryLookup[account.AccountNumber])
        .map(account => ({
            accountName: account.AccountName,
            accountNumber: account.AccountNumber,
            category: accountToCategoryLookup[account.AccountNumber]
        }));

    return refinedAccounts;
}


export default async function getChartOfAccounts() {
    const data = await fetchData('/api/v1/financial', "getGlTrees");
    const glAccountObjects = data.response.result.GlTrees.GlTree[0].GlAccounts.GlAccount;
    return condenseGlAccountData(glAccountObjects);
}

    
      