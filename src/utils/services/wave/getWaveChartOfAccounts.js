import { chartOfAccountsNumberArray } from 'src/assets/data/chart-of-accounts';
import { assetItems } from 'src/assets/data/assets';

export default async function getWaveChartOfAccounts() {
  const businessIds = assetItems
    .filter((item) => item.accountingSoftware === 'wave')
    .map((item) => ({ asset: item.id, accountId: item.accountId }));

  const bearerToken = process.env.WAVE_BEARER_TOKEN;

  const accounts = {};
  const assetAccountCount = {};

  try {
    await Promise.all(
      businessIds.map(async ({ asset, accountId }) => {
        assetAccountCount[asset] = 0;

        const graphqlQuery = {
          query: `query ($businessId: ID!, $page: Int!, $pageSize: Int!) {
          business(id: $businessId) {
            id 
            accounts(page: $page, pageSize: $pageSize) {
              pageInfo {
                currentPage 
                totalPages 
                totalCount 
              }
              edges {
                node {
                  name 
                  id 
                  displayId 
                }
              }
            }
          }
        }`,
          variables: { businessId: accountId, page: 1, pageSize: 200 },
        };

        const response = await fetch('https://gql.waveapps.com/graphql/public', {
          cache: 'no-store',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(graphqlQuery),
        });

        const data = await response.json();

        data.data.business.accounts.edges.forEach((edge) => {
          if (chartOfAccountsNumberArray.includes(edge.node.displayId)) {
            if (!accounts[edge.node.displayId]) {
              accounts[edge.node.displayId] = [];
            }
            accounts[edge.node.displayId].push({ asset, id: edge.node.id });
            assetAccountCount[asset] += 1;
          }
        });

        if (assetAccountCount[asset] !== chartOfAccountsNumberArray.length) {
          throw new Error(`Mismatch in the number of accounts processed for asset ${asset}.`);
        }
      })
    );
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error);
  }

  return Object.keys(accounts).map((key) => ({ displayId: key, accounts: accounts[key] }));
}
