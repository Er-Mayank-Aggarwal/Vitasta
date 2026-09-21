import { getAdminCustomers } from '@/app/actions/admin-actions';
import AdminCustomersClient from './AdminCustomersClient';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const res = await getAdminCustomers();
  const customers = res.success ? res.customers : [];

  return <AdminCustomersClient initialCustomers={customers} />;
}
