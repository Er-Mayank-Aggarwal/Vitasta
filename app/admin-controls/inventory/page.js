import { getAdminInventory } from '@/app/actions/inventory-actions';
import AdminInventoryClient from './AdminInventoryClient';

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
  const res = await getAdminInventory();
  const inventory = res.success ? res.inventory : [];

  return <AdminInventoryClient initialStock={inventory} />;
}
