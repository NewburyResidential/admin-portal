'use server';

export default async function addInvoice(invoice) {
  const url = 'https://dc390lb5ne.execute-api.us-east-1.amazonaws.com/addInvoices';
  const requestOptions = {
    method: 'POST',
    //cache: 'no-cache',
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoice),
  };

  try {
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      return true;
    }
    console.error('Error fetching data: ');
    return false;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return false;
  }
}
