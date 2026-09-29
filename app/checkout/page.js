'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useSession } from '@/lib/auth-client';
import { createOrder } from '@/app/actions/checkout-actions';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/app/actions/razorpay-actions';
import { getUserAddresses, getUserProfile } from '@/app/actions/user-actions';
import {
  ShoppingBag,
  ShieldCheck,
  Video,
  ArrowRight,
  Sparkles,
  Lock,
  AlertCircle,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  Plus,
  User,
  Check,
  ChevronRight,
  CreditCard,
  QrCode,
  Banknote,
} from 'lucide-react';


const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, cartTotal, clearCart } = useCart();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Jodhpur',
    state: 'Rajasthan',
    pincode: '',
    notes: '',
    saveAddress: true,
  });

  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // 'RAZORPAY' or 'CONSULTATION'

  // Helper to dynamically load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Load user profile & saved addresses when session is available
  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      setIsLoadingAddresses(true);
      try {
        const [addresses, profile] = await Promise.all([
          getUserAddresses(),
          getUserProfile(),
        ]);

        if (!isMounted) return;

        if (profile) {
          setFormData((prev) => ({
            ...prev,
            fullName: prev.fullName || profile.name || session?.user?.name || '',
            email: prev.email || profile.email || session?.user?.email || '',
            phone: prev.phone || profile.phone || session?.user?.phone || '',
          }));
        } else if (session?.user) {
          setFormData((prev) => ({
            ...prev,
            fullName: prev.fullName || session.user.name || '',
            email: prev.email || session.user.email || '',
            phone: prev.phone || session.user.phone || '',
          }));
        }

        if (addresses && addresses.length > 0) {
          setSavedAddresses(addresses);
          const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
          setSelectedAddressId(defaultAddr.id);
          setFormData((prev) => ({
            ...prev,
            fullName: defaultAddr.fullName || prev.fullName,
            phone: defaultAddr.phone || prev.phone,
            addressLine1: defaultAddr.addressLine1 || '',
            addressLine2: defaultAddr.addressLine2 || '',
            city: defaultAddr.city || 'Jodhpur',
            state: defaultAddr.state || 'Rajasthan',
            pincode: defaultAddr.pincode || '',
          }));
        } else {
          setSelectedAddressId('new');
        }
      } catch (err) {
        console.error('Failed to load user address book:', err);
      } finally {
        if (isMounted) setIsLoadingAddresses(false);
      }
    }

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [session]);

  // Handle saved address selection change
  const handleSelectAddress = (addr) => {
    if (addr === 'new') {
      setSelectedAddressId('new');
      setFormData((prev) => ({
        ...prev,
        addressLine1: '',
        addressLine2: '',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '',
        saveAddress: true,
      }));
    } else {
      setSelectedAddressId(addr.id);
      setFormData((prev) => ({
        ...prev,
        fullName: addr.fullName || prev.fullName,
        phone: addr.phone || prev.phone,
        addressLine1: addr.addressLine1 || '',
        addressLine2: addr.addressLine2 || '',
        city: addr.city || 'Jodhpur',
        state: addr.state || 'Rajasthan',
        pincode: addr.pincode || '',
      }));
    }
  };

  // Indian Postal PIN Code Auto-Lookup
  const handlePincodeChange = async (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, pincode: clean }));
    setPincodeError('');

    if (clean.length === 6) {
      setIsFetchingLocation(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: po.District || po.Block || prev.city,
            state: po.State || prev.state,
          }));
        } else {
          setPincodeError('Could not auto-verify PIN code. Please select state/city manually.');
        }
      } catch (err) {
        setPincodeError('Postal lookup timed out. Please enter details manually.');
      } finally {
        setIsFetchingLocation(false);
      }
    }
  };

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(cartTotal);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-neutral-200 shadow-xl space-y-4">
          <ShoppingBag className="w-12 h-12 text-neutral-400 mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#0B3B60]">
            Your Bag is Empty
          </h2>
          <p className="text-xs text-neutral-500">
            Please add a royal saree to your bag before proceeding to atelier checkout.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 rounded-full bg-[#0B3B60] hover:bg-[#071E3D] text-white text-xs font-semibold uppercase tracking-wider shadow"
          >
            Explore Royal Sarees
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const isExistingAddress = selectedAddressId !== 'new';

      const orderPayload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        addressId: isExistingAddress ? selectedAddressId : null,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || null,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        notes: formData.notes || null,
        saveAddress: isExistingAddress ? false : formData.saveAddress,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          fabric: item.fabric,
          color: item.color,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      };

      // Step 1: Create verified order with atomic inventory locks
      const result = await createOrder(orderPayload);

      if (!result.success) {
        setError(result.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Step 2: Handle Razorpay Online Payment Flow
      if (paymentMethod === 'RAZORPAY') {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          setError('Payment gateway network timed out. Order saved; you can view your invoice.');
          clearCart();
          router.push(`/invoice/${result.orderId}`);
          return;
        }

        const rzpOrderRes = await createRazorpayOrder(result.orderId);
        if (!rzpOrderRes.success) {
          setError(rzpOrderRes.error || 'Failed to initialize Razorpay checkout.');
          setIsSubmitting(false);
          return;
        }

        // Check if sandbox / demo fallback
        if (rzpOrderRes.isDemoMode || !window.Razorpay) {
          await verifyRazorpayPayment({
            orderId: result.orderId,
            razorpayOrderId: rzpOrderRes.razorpayOrderId,
            razorpayPaymentId: `pay_demo_${Date.now()}`,
            razorpaySignature: 'demo_signature_valid',
          });
          clearCart();
          router.push(`/invoice/${result.orderId}`);
          return;
        }

        const razorpayOptions = {
          key: rzpOrderRes.keyId,
          amount: rzpOrderRes.amount,
          currency: rzpOrderRes.currency || 'INR',
          name: 'Vitasta by Smita Saraswat',
          description: `Handcrafted Saree Order #${rzpOrderRes.orderNumber}`,
          image: 'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675005/vitasta/brand/vitasta_logo_banner.jpg',
          order_id: rzpOrderRes.razorpayOrderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#0B3B60',
          },
          handler: async function (paymentResponse) {
            try {
              const verifyRes = await verifyRazorpayPayment({
                orderId: result.orderId,
                razorpayOrderId: paymentResponse.razorpay_order_id || rzpOrderRes.razorpayOrderId,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              });

              if (verifyRes.success) {
                clearCart();
                router.push(`/invoice/${result.orderId}`);
              } else {
                setError(verifyRes.error || 'Payment signature verification failed.');
                setIsSubmitting(false);
              }
            } catch (err) {
              setError('Error verifying payment. Order saved.');
              clearCart();
              router.push(`/invoice/${result.orderId}`);
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
              clearCart();
              router.push(`/invoice/${result.orderId}`);
            },
          },
        };

        const rzp = new window.Razorpay(razorpayOptions);
        rzp.on('payment.failed', function (resp) {
          setError(`Payment declined: ${resp.error?.description || 'Transaction unsuccessful.'}`);
          setIsSubmitting(false);
        });
        rzp.open();
      } else {
        // Atelier Consultation & Bank Transfer / COD
        clearCart();
        router.push(`/invoice/${result.orderId}`);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during checkout.');
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#0B3B60] bg-[#0B3B60]/10 mb-2 border border-[#0B3B60]/20">
          <Lock className="w-3.5 h-3.5 text-[#C1272D]" /> Sovereign Atelier Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B3B60]">
          Confirm Your Bespoke Saree Order
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Complimentary fall-pico finishing & pre-dispatch loom video inspection included.
        </p>
      </div>

      {/* Guest Patron Sign-In Suggestion */}
      {!session?.user && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#C1272D] shrink-0" />
            <span>
              Already have an account? Sign in to automatically access your saved addresses & order history.
            </span>
          </div>
          <Link
            href="/account"
            className="px-4 py-1.5 rounded-full bg-[#0B3B60] hover:bg-[#071E3D] text-white font-bold text-[11px] uppercase tracking-wider transition shrink-0"
          >
            Sign In
          </Link>
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form: Delivery Address & Patron Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Contact Information */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#0B3B60] flex items-center gap-2">
              <User className="w-4 h-4 text-[#C1272D]" /> 1. Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smt. Radhika Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Phone (WhatsApp for Loom HD Video) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address (For Invoice & Dispatch Tracking) *
              </label>
              <input
                type="email"
                required
                placeholder="yourname@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
              />
            </div>
          </div>

          {/* Section 2: Delivery Address Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="font-serif text-lg font-bold text-[#0B3B60] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C1272D]" /> 2. Sovereign Delivery Destination
              </h2>
              {savedAddresses.length > 0 && (
                <span className="text-[11px] font-semibold text-neutral-500">
                  {savedAddresses.length} Saved {savedAddresses.length === 1 ? 'Address' : 'Addresses'}
                </span>
              )}
            </div>

            {/* Saved Address Cards Carousel / Selector */}
            {savedAddresses.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-neutral-700">
                  Select a Saved Palace / Residence Address:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className={`relative p-4 rounded-xl border-2 transition cursor-pointer text-xs space-y-1.5 ${
                          isSelected
                            ? 'border-[#0B3B60] bg-[#0B3B60]/5 shadow-sm'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-[#0B3B60]">
                              {addr.fullName}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                                Default
                              </span>
                            )}
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#0B3B60] border-[#0B3B60] text-white'
                                : 'border-neutral-300'
                            }`}
                          >
                            {isSelected && <Check size={11} strokeWidth={3} />}
                          </div>
                        </div>

                        <p className="text-neutral-600 leading-relaxed line-clamp-2">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        </p>

                        <p className="text-neutral-700 font-medium">
                          {addr.city}, {addr.state} – <span className="font-mono">{addr.pincode}</span>
                        </p>

                        <p className="text-[11px] text-neutral-500 pt-1 flex items-center gap-1">
                          <Phone size={11} /> {addr.phone}
                        </p>
                      </div>
                    );
                  })}

                  {/* Option: Deliver to a New Address */}
                  <div
                    onClick={() => handleSelectAddress('new')}
                    className={`p-4 rounded-xl border-2 border-dashed transition cursor-pointer text-xs flex flex-col items-center justify-center text-center gap-1.5 min-h-[120px] ${
                      selectedAddressId === 'new'
                        ? 'border-[#0B3B60] bg-[#0B3B60]/5 text-[#0B3B60] font-bold'
                        : 'border-neutral-300 hover:border-[#0B3B60] text-neutral-600'
                    }`}
                  >
                    <Plus size={18} className="text-[#C1272D]" />
                    <span>+ Deliver to a Different / New Address</span>
                  </div>
                </div>
              </div>
            )}

            {/* New Address Input Form (Shown if 'new' is selected or no saved addresses) */}
            {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
              <div className="pt-3 border-t border-neutral-100 space-y-4">
                {savedAddresses.length > 0 && (
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B3B60]">
                    Enter New Delivery Address Details
                  </h4>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Street Address / Palace Wing / House No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House No., Apartment, Street name"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white mb-3"
                  />

                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Landmark / Area (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Near landmark or colony name"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      PIN Code (Auto-Lookup) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 342001"
                      value={formData.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                    />
                    {isFetchingLocation && (
                      <span className="text-[10px] text-[#0B3B60] block mt-0.5 animate-pulse">
                        Verifying postal circle...
                      </span>
                    )}
                    {pincodeError && (
                      <span className="text-[10px] text-amber-700 block mt-0.5">
                        {pincodeError}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaipur"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      State *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Save Address Checkbox for logged-in users */}
                {session?.user && (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={formData.saveAddress}
                      onChange={(e) => setFormData({ ...formData, saveAddress: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0B3B60] focus:ring-[#0B3B60] border-neutral-300"
                    />
                    <label htmlFor="saveAddress" className="text-xs text-neutral-700 cursor-pointer">
                      Save this delivery address to my account for future orders
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Customization / Adda Notes */}
            <div className="pt-4 border-t border-neutral-100">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center justify-between">
                <span>Special Adda Customization / Event Date Notes (Optional)</span>
                <span className="text-[10px] text-neutral-400 font-normal">Sent to Master Weavers</span>
              </label>
              <textarea
                rows={2}
                placeholder="Mention any specific blouse unstitched requirements, auspicious dates, or custom fall-pico instructions..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
              />
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#0B3B60] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C1272D]" /> 3. Select Payment Mode
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Option 1: Razorpay */}
              <div
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-[#0B3B60] bg-blue-50/40 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0B3B60] text-white flex items-center justify-center font-bold text-xs">
                      ₹
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0B3B60]">
                        Razorpay Secure Gateway
                      </h4>
                      <p className="text-[10px] text-neutral-500">
                        Instant Online Payment
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'RAZORPAY'
                        ? 'border-[#0B3B60] bg-[#0B3B60]'
                        : 'border-neutral-300'
                    }`}
                  >
                    {paymentMethod === 'RAZORPAY' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200/60 flex flex-wrap items-center gap-1.5 text-[9px] text-neutral-600 font-medium">
                  <span className="px-1.5 py-0.5 rounded bg-white border border-neutral-200">UPI / QR</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-neutral-200">GPay</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-neutral-200">PhonePe</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-neutral-200">Cards</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-neutral-200">NetBanking</span>
                </div>
              </div>

              {/* Option 2: Atelier Consultation / Bank Transfer / COD */}
              <div
                onClick={() => setPaymentMethod('CONSULTATION')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === 'CONSULTATION'
                    ? 'border-[#0B3B60] bg-blue-50/40 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FAF9F6] border border-neutral-300 text-neutral-700 flex items-center justify-center font-bold text-xs">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">
                        Atelier Concierge / COD
                      </h4>
                      <p className="text-[10px] text-neutral-500">
                        Direct Bank Transfer or Pay on Loom Verification
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'CONSULTATION'
                        ? 'border-[#0B3B60] bg-[#0B3B60]'
                        : 'border-neutral-300'
                    }`}
                  >
                    {paymentMethod === 'CONSULTATION' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200/60 text-[9.5px] text-neutral-600 font-light">
                  Loom video verification provided prior to dispatch.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form: Order Summary & Placement */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xl space-y-6 sticky top-24">
            <h2 className="font-serif text-lg font-bold text-[#0B3B60] flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-sans text-neutral-400 font-normal">
                {items.length} {items.length === 1 ? 'Saree' : 'Sarees'}
              </span>
            </h2>

            {/* Items List */}
            <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-top"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs font-bold text-neutral-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-neutral-500 uppercase">{item.fabric || 'Royal Silk'}</p>
                    <span className="text-xs text-[#0B3B60] font-bold">
                      ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-neutral-100 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">
                  {formattedTotal}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Handloom Finishing & Fall-Pico</span>
                <span className="text-emerald-700 font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Insured Sovereign Dispatch</span>
                <span className="text-emerald-700 font-semibold">Free Across India</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between font-serif text-base font-bold text-[#0B3B60]">
                <span>Total Amount</span>
                <span>{formattedTotal}</span>
              </div>
            </div>

            {/* Assurance Note */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-neutral-700 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#0B3B60]">
                <Video className="w-3.5 h-3.5 text-[#C1272D]" /> Pre-Dispatch Loom Video Included
              </div>
              <p>
                A high-definition video of your saree drape and zari finishing will be recorded and shared via WhatsApp ({formData.phone || 'your phone number'}) before sealing.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-[#C1272D] hover:bg-[#A01F25] text-white font-bold text-xs uppercase tracking-widest shadow-xl hover:shadow-2xl transition active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                paymentMethod === 'RAZORPAY' ? 'Launching Razorpay Gateway...' : 'Registering Atelier Order...'
              ) : paymentMethod === 'RAZORPAY' ? (
                <>
                  Pay {formattedTotal} via Razorpay <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Confirm Order & Generate Invoice <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

