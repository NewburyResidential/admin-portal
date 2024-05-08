'use server';

export default async function addVendor(data) {
  const upperCaseVendorValue = data.vendor
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const body = { ...data, name: upperCaseVendorValue };
  const url = 'https://jzhfwizez8.execute-api.us-east-1.amazonaws.com';
  const requestOptions = {
    method: 'POST',
    //cache: 'no-cache',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      console.error('Error fetching data: ', response.statusText);
      return null;
    } else {
      return response.json();
    }
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
}
