'use server';

import { dynamoQuery } from '../sdk-config/aws/dynamo-db';

export default async function getTransactions(pk, sk = null) {
  console.log('pk: ', pk);
  console.log('sk: ', sk);
  const response = await dynamoQuery({ tableName: 'admin_portal_expenses', pk, sk });

  if (!response) {
    return []
  }
  return response;

  // console.log('response: ', response);

  // const baseUrl = 'https://0yxexcpp8f.execute-api.us-east-1.amazonaws.com/getTransactions';
  // const url = new URL(baseUrl);
  // if (pk) url.searchParams.append('pk', pk);
  // if (sk) url.searchParams.append('sk', sk);

  // const requestOptions = {
  //   //cache: 'no-cache',
  //   next: { revalidate: 0 },
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };

  // try {
  //   const response = await fetch(url.toString(), requestOptions);
  //   if (!response.ok) {
  //     console.error(`HTTP error! Status: ${response.status}`);
  //     return [];
  //   }
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error('Error fetching data: ', error);
  //   return [];
  // }
}
