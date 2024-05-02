'use server';

export default async function getResources() {
  const url = 'https://9e9astziyi.execute-api.us-east-1.amazonaws.com/getResources';
  const requestOptions = {
    //cache: 'no-cache',
    next: { revalidate: 0, tags: ['resources']},
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return [];
  }
}
