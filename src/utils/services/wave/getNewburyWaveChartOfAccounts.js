import { chartOfAccountsNumberArray } from 'src/assets/data/chart-of-accounts';
import { assetItems } from 'src/assets/data/assets';

export default async function getNewburyWaveChartOfAccounts() {
  const account = assetItems.find((item) => item.id === '1');
  const accountId = account.accountId;

  const bearerToken = process.env.WAVE_BEARER_TOKEN;

  const accounts = {};

  try {
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
      if (!accounts[edge.node.displayId]) {
        accounts[edge.node.displayId] = edge.node.id;
      }
    });
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error);
  }
  return accounts;
}
