import axios from 'axios';

const clientId = process.env.PAYLOCITY_CLIENT_ID;
const clientSecret = process.env.PAYLOCITY_CLIENT_SECRET;

const authUrl = 'https://api.paylocity.com/IdentityServer/connect/token';

export default async function getPaylocityAccessToken() {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: 'WebLinkAPI',
  });

  try {
    const response = await axios.post(authUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error.response?.data || error.message);
    throw new Error('Error obtaining access token');
  }
}
