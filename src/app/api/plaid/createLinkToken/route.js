import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
  const client = new PlaidApi(
    new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET,
        },
      },
    })
  );

    const createTokenResponse = await client.linkTokenCreate({
      user: {
        client_user_id: 'Admin-User',
      },
      client_name: 'Credit Card Expenses',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });

    return NextResponse.json({token: createTokenResponse.data}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: error}, { status: 500 });
  }
}
