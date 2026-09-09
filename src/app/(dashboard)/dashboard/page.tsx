import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardDispatcher() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'CREATOR') {
    redirect('/dashboard/creator');
  } else {
    redirect('/dashboard/company');
  }
}
