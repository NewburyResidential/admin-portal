'use server';

export default async function enterBillBackChargesIntoEntrata(data) {
  const url = 'https://gpxllcrxmk.execute-api.us-east-1.amazonaws.com/EnterBillbackChargesIntoEntrata';
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error Updating Utility Bill', error);
    return false;
  }
}
