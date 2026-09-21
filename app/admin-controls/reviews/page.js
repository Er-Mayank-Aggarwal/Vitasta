import { getAdminReviews } from '@/app/actions/admin-actions';
import AdminReviewsClient from './AdminReviewsClient';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const res = await getAdminReviews();
  const reviews = res.success ? res.reviews : [];

  return <AdminReviewsClient initialReviews={reviews} />;
}
