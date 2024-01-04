'use server';

import { revalidateTag } from 'next/cache';

export default async function addVendor(data) {
    
  const upperCaseVendorValue = data.vendor
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const body = { ...data, name: upperCaseVendorValue };
  const url = 'https://jzhfwizez8.execute-api.us-east-1.amazonaws.com';
  const requestOptions = {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    console.log(data);
    if (data === 'Success') {
      revalidateTag('vendors');
      return true;
    }
    console.error('Error fetching data: ');
    return false;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return false;
  }
}