'use server';

import { revalidateTag } from 'next/cache';

export default async function updateTransactions(transactionsToUpdate) {
  const url = 'https://0yxexcpp8f.execute-api.us-east-1.amazonaws.com/updateTransactions';
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionsToUpdate),
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }
    const data = await response.json();
    revalidateTag('transactions');
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
}