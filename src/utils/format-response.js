import { NextResponse } from 'next/server';

export const handleError = (error, summary = '', response = true) => {
  const message = error.message || 'An error occurred';
  const stack = error.stack || 'No stack available';

  if (summary) {
    const line = '~'.repeat(50); 
    console.error(`${line}\n${summary}\n${line}`);
  }
  
  console.error(error);
  if (response) {
    return NextResponse.json({ message, stack, summary }, { status: 500 });
  } 
  return null;
};
