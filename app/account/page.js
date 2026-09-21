import { Suspense } from 'react';
import AuthForm from '../components/AuthForm';
import UserProfile from '../components/UserProfile';
import { getUserProfile, getUserOrders, getUserAddresses } from '../actions/user-actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Royal Account | VITASTA Saree Atelier',
  description: 'Manage your Vitasta Atelier bespoke saree orders, loom video verification, addresses, and royal patron profile.',
};

export default async function AccountPage() {
  const user = await getUserProfile();

  if (!user) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#0B3B60]/20 border-t-[#0B3B60] rounded-full animate-spin" />
          </div>
        }
      >
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
          <AuthForm isModal={false} />
        </div>
      </Suspense>
    );
  }

  const [orders, addresses] = await Promise.all([
    getUserOrders(),
    getUserAddresses(),
  ]);

  return (
    <div className="min-h-screen py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <UserProfile user={user} orders={orders} addresses={addresses} />
    </div>
  );
}
