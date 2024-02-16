'use server';

import { revalidateTag } from 'next/cache';

export default async function updateUtilityBill(data) {
    
  const url = 'https://gpxllcrxmk.execute-api.us-east-1.amazonaws.com/updateutilitybill';
  const requestOptions = {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      revalidateTag('utilities');
      return true;
    } else {
      revalidateTag('utilities');
      return false;
    }
  } catch (error) {
    console.error('Error Updating Utility Bill', error);
    return false;
  }
}
