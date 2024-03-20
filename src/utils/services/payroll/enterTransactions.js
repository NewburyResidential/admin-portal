'use server';

export default async function enterTransactions(data) {
  const url = '	https://eddtuwh860.execute-api.us-east-1.amazonaws.com/enterTransactions';
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
    console.log(response);
    if (response.ok) {
      return response.json();
    } else {
      return response.json()
    }
  } catch (error) {
    console.error('Error Updating Utility Bill', error);
    return error;
  }
}
