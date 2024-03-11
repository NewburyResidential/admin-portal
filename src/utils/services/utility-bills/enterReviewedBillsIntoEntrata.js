'use server';

export default async function enterReviewedBillsIntoEntrata() {
  const url = 'https://gpxllcrxmk.execute-api.us-east-1.amazonaws.com/enterReviewedBillsIntoEntrata';
  const requestOptions = {
    cache: 'no-store',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
}
