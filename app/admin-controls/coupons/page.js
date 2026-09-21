import { getAdminCoupons } from '@/app/actions/coupon-actions';
import AdminCouponsClient from './AdminCouponsClient';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const res = await getAdminCoupons();
  const coupons = res.success ? res.coupons : [];

  return <AdminCouponsClient initialCoupons={coupons} />;
}
