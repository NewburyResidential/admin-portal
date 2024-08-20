import { redirect } from 'next/navigation';
import { dashboardPaths } from 'src/routes/paths';

export default async function HomePage() {
  redirect(dashboardPaths.resources.root);
}
