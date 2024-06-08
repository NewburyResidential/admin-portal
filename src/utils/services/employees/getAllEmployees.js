'use server';

export default async function getAllEmployees() {
  const url = `https://0e1bxf2dr7.execute-api.us-east-1.amazonaws.com/getAllItems?tableName=employees`;
  const requestOptions = {
    next: { revalidate: 0 },
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
}
