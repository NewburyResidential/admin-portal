import { chartOfAccountsNumberArray } from 'src/assets/data/chart-of-accounts';
import getNewburyAssets from '../newbury/get-assets';

export default async function getWaveChartOfAccounts() {
  const newburyAssets = await getNewburyAssets();
  const businessIds = newburyAssets
    .filter((item) => item.accountingSoftware === 'wave')
    .map((item) => ({ asset: item.pk, accountId: item.accountId }));

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
          variables: { businessId: accountId, page: 1, pageSize: 400 },
        };

        const response = await fetch('https://gql.waveapps.com/graphql/public', {
          //cache: 'no-cache',
          next: { revalidate: 0 },
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
          console.log(`Asset ${asset}: Found ${assetAccountCount[asset]} accounts, expected ${chartOfAccountsNumberArray.length}`);

          // Get the displayIds that were found for this asset
          const foundAccountIds = Object.keys(accounts).filter((displayId) =>
            accounts[displayId].some((account) => account.asset === asset)
          );

          // Find missing accounts
          const missingAccounts = chartOfAccountsNumberArray.filter((expectedId) => !foundAccountIds.includes(expectedId));

          console.log(`Missing accounts for asset ${asset}:`, missingAccounts);
          console.log(`Found accounts for asset ${asset}:`, foundAccountIds.sort());

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
