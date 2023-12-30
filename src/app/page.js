import { redirect } from 'next/navigation';
import { PATH_AFTER_LOGIN } from 'src/routes/paths';

export default async function HomePage() {
  redirect(PATH_AFTER_LOGIN);
}
