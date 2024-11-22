import axios from 'axios';

const tenantId = process.env.MICROSOFT_TENANT_ID;
const clientId = process.env.MICROSOFT_GRAPH_CLIENT_ID;
const clientSecret = process.env.MICROSOFT_GRAPH_CLIENT_SECRET;
console.log('tenantId:', tenantId);
console.log('clientId:', clientId);
console.log('clientSecret:', clientSecret);
const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

export default async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('scope', 'https://graph.microsoft.com/.default');
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');

  try {
    const response = await axios.post(authUrl, params);
    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error);
    throw new Error('Error obtaining access token');
  }
}
