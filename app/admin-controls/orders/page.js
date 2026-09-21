import { getAdminOrders } from '@/app/actions/admin-actions';
import AdminOrdersClient from './AdminOrdersClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const res = await getAdminOrders('ALL');
  const orders = res.success ? res.orders : [];

  return <AdminOrdersClient initialOrders={orders} />;
}
