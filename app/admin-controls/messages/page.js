import { getAdminMessages } from '@/app/actions/admin-actions';
import AdminMessagesClient from './AdminMessagesClient';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const res = await getAdminMessages();
  const messages = res.success ? res.messages : [];

  return <AdminMessagesClient initialMessages={messages} />;
}
