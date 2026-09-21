import { getAdminSubscribers } from '@/app/actions/admin-actions';
import AdminSubscribersClient from './AdminSubscribersClient';

export const dynamic = 'force-dynamic';

export default async function AdminSubscribersPage() {
  const res = await getAdminSubscribers();
  const subscribers = res.success ? res.subscribers : [];

  return <AdminSubscribersClient initialSubscribers={subscribers} />;
}
