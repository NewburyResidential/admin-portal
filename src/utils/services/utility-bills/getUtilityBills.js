'use server';

export default async function getUtilityBills(pk, sk) {
  const encodedPk = encodeURIComponent(pk);
  const encodedSk = encodeURIComponent(sk);

  const url = `https://gpxllcrxmk.execute-api.us-east-1.amazonaws.com/getutilitybills?pk=${encodedPk}&sk=${encodedSk}`;
  const requestOptions = {
    next: { tags: ['utilities'] },
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