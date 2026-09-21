import { getOrderById } from '@/app/actions/checkout-actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PrintButton from '@/app/components/PrintButton';
import {
  CheckCircle2,
  Video,
  ArrowLeft,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InvoicePage({ params }) {
  const { orderId } = await params;
  const res = await getOrderById(orderId);

  if (!res.success || !res.order) {
    notFound();
  }

  const { order } = res;
  const shippingAddress = order.shippingAddressJson
    ? JSON.parse(order.shippingAddressJson)
    : null;

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(order.total);

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Action Header (Hidden in Print) */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0B3B60] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Exploring Sarees
        </Link>

        <PrintButton />
      </div>

      {/* Success Notification Banner */}
      <div className="mb-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left print:hidden">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-lg font-bold">
            Order Successfully Placed with Vitasta Atelier!
          </h2>
          <p className="text-xs text-emerald-700 mt-0.5">
            Your handcrafted saree order <strong>{order.orderNumber}</strong> has been registered. Our concierge team will reach out via WhatsApp with your bespoke loom video before dispatch.
          </p>
        </div>
      </div>

      {/* Printable Invoice Card */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 shadow-xl space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-neutral-200 pb-8">
          <div>
            <span className="font-serif text-3xl font-bold tracking-[0.25em] text-[#0B3B60]">
              VITASTA
            </span>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C1272D] font-sans font-semibold">
              by Smita Saraswat • Jodhpur
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              House No. 10A, Kanti, Paota B Road, Near Jalam Niwas<br />
              Jodhpur, Rajasthan – 342001, India<br />
              Concierge WhatsApp: +91 88240 17443
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase bg-blue-50 text-[#0B3B60] border border-blue-200 mb-2">
              Atelier Order Invoice
            </span>
            <p className="font-serif text-sm font-bold text-neutral-900">
              Order: {order.orderNumber}
            </p>
            <p className="text-xs text-neutral-500">
              Date: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-xs font-medium text-amber-700">
              Status: {order.statusLabel || 'Registered at Atelier'}
            </p>
          </div>
        </div>

        {/* Customer & Shipping Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div>
            <h3 className="font-serif font-bold text-sm text-[#0B3B60] uppercase tracking-wider mb-2">
              Client & Patron Details
            </h3>
            <p className="font-semibold text-neutral-900">{order.userName}</p>
            <p className="text-neutral-600">{order.userEmail}</p>
            <p className="text-neutral-600">{order.userPhone}</p>
          </div>

          <div>
            <h3 className="font-serif font-bold text-sm text-[#0B3B60] uppercase tracking-wider mb-2">
              Sovereign Delivery Address
            </h3>
            {shippingAddress ? (
              <p className="text-neutral-600 leading-relaxed">
                {shippingAddress.fullName}<br />
                {shippingAddress.addressLine1}
                {shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ''}<br />
                {shippingAddress.city}, {shippingAddress.state} – {shippingAddress.pincode}<br />
                {shippingAddress.country}
              </p>
            ) : (
              <p className="text-neutral-500">Address on file</p>
            )}
          </div>
        </div>

        {/* Itemized Saree Table */}
        <div className="border border-neutral-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] border-b border-neutral-200 font-serif uppercase tracking-wider text-neutral-600 font-semibold">
              <tr>
                <th className="p-4">Handcrafted Saree</th>
                <th className="p-4">Collection / Fabric</th>
                <th className="p-4 text-center">Qty</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50">
                  <td className="p-4 font-serif font-bold text-neutral-900">
                    {item.title}
                  </td>
                  <td className="p-4 text-neutral-600">
                    {item.category} • {item.fabric}
                  </td>
                  <td className="p-4 text-center">{item.quantity}</td>
                  <td className="p-4 text-right">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right font-serif font-bold text-[#0B3B60]">
                    ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-2.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">
                ₹{order.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Fall-Pico & Finishing</span>
              <span className="text-emerald-700 font-semibold">Complimentary</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Insured Sovereign Dispatch</span>
              <span className="text-emerald-700 font-semibold">Free Across India</span>
            </div>
            <div className="pt-3 border-t border-neutral-200 flex justify-between font-serif text-base font-bold text-[#0B3B60]">
              <span>Final Amount</span>
              <span>{formattedTotal}</span>
            </div>
          </div>
        </div>

        {/* Pre-Dispatch Loom Assurance Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071E3D] to-[#0B3B60] text-white border border-white/10 flex items-start gap-3">
          <Video className="w-5 h-5 text-[#90c4ff] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-serif font-bold text-white">
              Pre-Dispatch Loom Video Proof Guarantee
            </p>
            <p className="text-neutral-200 font-light">
              Prior to parcel dispatch, our atelier team will send an HD video of your inspected saree to {order.userPhone}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
