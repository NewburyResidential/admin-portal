import { NextResponse } from 'next/server';

export const handleError = (error, summary = '') => {
  const message = error.message || 'An error occurred';
  const stack = error.stack || 'No stack available';

  if (summary)  console.error(summary);
  console.error(message);
  console.error(stack); 

  return NextResponse.json({ message, stack, summary }, { status: 500 });
};