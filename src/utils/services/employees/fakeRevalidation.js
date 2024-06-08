'use server';

import { revalidatePath } from 'next/cache';

export const fakeRevalidation = async () => {
  revalidatePath('/onboarding/[slug]');
};
