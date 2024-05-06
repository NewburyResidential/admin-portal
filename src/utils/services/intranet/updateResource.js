'use server';

import { revalidateTag } from 'next/cache';

export default async function updateResource(data) {
  const url = 'https://9e9astziyi.execute-api.us-east-1.amazonaws.com/updateResource';
  const requestOptions = {
    method: 'POST',
    //cache: 'no-cache',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      revalidateTag('resources');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return false;
  }
}
