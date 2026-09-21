'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  MapPin,
  ShoppingBag,
  LogOut,
  Camera,
  Edit2,
  Trash2,
  CheckCircle2,
  Plus,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  Truck,
  Sparkles,
  ShieldCheck,
  Search,
  ExternalLink,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import {
  updateUserProfile,
  updateUserAvatar,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from '@/app/actions/user-actions';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow bg-white">
      {/* Header Bar */}
      <div className="bg-[#FAF9F6] px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200">
        <div>
          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-0.5">
            Order Reference
          </p>
          <p className="text-sm font-serif font-bold text-[#0B3B60]">
            #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-0.5">
            Booking Date
          </p>
          <p className="text-xs sm:text-sm font-medium text-neutral-800">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              timeZone: 'Asia/Kolkata',
            })}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-0.5">
            Total Investment
          </p>
          <p className="text-sm font-serif font-bold text-[#0B3B60]">
            ₹{order.total.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0B3B60]/10 text-[#0B3B60] border border-[#0B3B60]/20">
            {order.statusLabel || order.orderStatus}
          </span>
          <Link
            href={`/invoice/${order.id}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-semibold text-[#0B3B60] hover:bg-[#0B3B60] hover:text-white transition shadow-xs"
          >
            <Download size={13} /> Bill
          </Link>
        </div>
      </div>

      {/* Items List */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="space-y-3">
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 py-2 border-b border-neutral-100 last:border-0">
              <div className="relative w-16 h-20 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                <Image
                  src={
                    item.image ||
                    item.product?.primaryImage ||
                    'https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675005/vitasta/brand/vitasta_logo_banner.jpg'
                  }
                  alt={item.title || item.product?.title || 'Vitasta Saree'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-serif font-bold text-neutral-900 truncate">
                  {item.title || item.product?.title || 'Handcrafted Heritage Saree'}
                </h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  {item.fabric || 'Pure Silk / Handloom'} • Qty: {item.quantity || 1}
                </p>
                {item.color && (
                  <p className="text-[11px] text-[#C1272D] font-medium">
                    Shade: {item.color}
                  </p>
                )}
              </div>
              <div className="text-right font-serif font-bold text-xs sm:text-sm text-neutral-900">
                ₹{(item.unitPrice || item.price || 0).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        {/* Pre-Dispatch Video Verification Spotlight */}
        {order.preDispatchVideoUrl && (
          <div className="p-4 rounded-xl bg-[#071E3D] border border-[#0B3B60] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#90c4ff]">
                <Video size={18} />
              </div>
              <div>
                <h5 className="text-xs font-serif font-bold text-white">
                  Pre-Dispatch Loom HD Video Verified
                </h5>
                <p className="text-[11px] text-neutral-300">
                  Full 5.5m drape, zari pallu, and fall-pico quality video verified before sealing.
                </p>
              </div>
            </div>
            <a
              href={order.preDispatchVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-[#C1272D] hover:bg-[#A01F25] text-white text-xs font-bold uppercase tracking-wider transition shrink-0 inline-flex items-center gap-1.5 shadow"
            >
              <Video size={13} /> View Video Proof
            </a>
          </div>
        )}

        {/* Expandable Tracking Timeline */}
        <div className="pt-2 border-t border-neutral-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full text-xs font-semibold text-[#0B3B60] hover:text-[#C1272D] transition py-1 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FileText size={15} /> Handloom Weaving & Dispatch Timeline
            </span>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {expanded && (
            <div className="mt-4 p-4 rounded-xl bg-[#FAF9F6] border border-neutral-200 space-y-4 text-xs">
              {order.history && order.history.length > 0 ? (
                <div className="space-y-4">
                  {order.history.map((h, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-[#0B3B60] text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} strokeWidth={2.5} />
                        </div>
                        {i !== order.history.length - 1 && (
                          <div className="w-0.5 h-full bg-[#0B3B60]/20 my-1"></div>
                        )}
                      </div>
                      <div className="pb-3">
                        <h4 className="font-semibold text-[#0B3B60]">
                          {h.status}
                        </h4>
                        {h.note && <p className="text-[11px] text-neutral-600">{h.note}</p>}
                        <span className="text-[10px] text-neutral-400">
                          {new Date(h.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-700 font-medium">
                    <CheckCircle2 size={15} />
                    <span>Order Confirmed & Artisan Adda Assigned</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-amber-700 font-medium">
                    <Sparkles size={15} />
                    <span>Pure Silk Dyeing & Zardozi Hand Embroidery in Progress (Jodhpur Hub)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-neutral-500">
                    <Video size={15} />
                    <span>Pre-Dispatch Loom HD Video Inspection Pending</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-neutral-500">
                    <Truck size={15} />
                    <span>Sovereign Insured Courier Dispatch</span>
                  </div>
                </div>
              )}

              {/* Courier Shipment Details */}
              {(order.shipment || order.trackingNumber) && (
                <div className="mt-3 pt-3 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-neutral-500 uppercase tracking-wider block">Luxury Courier</span>
                    <span className="font-semibold text-neutral-800">
                      {order.courierName || order.shipment?.courierName || 'BlueDart Sovereign Luxury Courier'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase tracking-wider block">Tracking AWB #</span>
                    <span className="font-mono font-bold text-[#0B3B60]">
                      {order.trackingNumber || order.shipment?.trackingNumber || 'Awaiting Handover'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserProfile({ user = {}, orders = [], addresses = [] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Avatar Upload State
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.image || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
  });

  // Address Modal State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    landmark: '',
    city: 'Jodhpur',
    district: '',
    state: 'Rajasthan',
    zipCode: '',
    isDefault: true,
  });
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  // Track Order Lookup State
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState(null);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'OWNER';

  // Handle Avatar Selection & Upload
  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB. Please choose a smaller portrait.');
      return;
    }

    setIsUploadingAvatar(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result;
      if (!base64Data) {
        setIsUploadingAvatar(false);
        return;
      }

      setAvatarUrl(base64Data);
      const res = await updateUserAvatar(base64Data);
      setIsUploadingAvatar(false);
      if (res.success) {
        setSuccessMsg('Profile portrait updated successfully!');
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError(res.error || 'Failed to update portrait');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Pincode Auto-Lookup (Indian Postal API)
  const handlePincodeChange = async (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 6);
    setAddressForm((prev) => ({ ...prev, zipCode: clean }));
    setPincodeError('');

    if (clean.length === 6) {
      setIsFetchingLocation(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          setAddressForm((prev) => ({
            ...prev,
            district: po.District || prev.district,
            city: po.District || po.Block || prev.city,
            state: po.State || prev.state,
          }));
        } else {
          setPincodeError('Could not verify PIN code automatically. You can enter district/state manually.');
        }
      } catch (err) {
        setPincodeError('Location lookup timed out. Please enter details manually.');
      } finally {
        setIsFetchingLocation(false);
      }
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMsg(null);

    const res = await updateUserProfile(formData);
    setIsSaving(false);
    if (res.success) {
      setIsEditing(false);
      setSuccessMsg('Royal Patron details saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setError(res.error || 'Failed to update profile');
    }
  };

  // Handle Address Submit
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await addAddress(addressForm);
    if (res.success) {
      setIsAddingAddress(false);
      setAddressForm({
        fullName: user?.name || '',
        phone: user?.phone || '',
        street: '',
        landmark: '',
        city: 'Jodhpur',
        district: '',
        state: 'Rajasthan',
        zipCode: '',
        isDefault: false,
      });
      router.refresh();
    } else {
      setError(res.error || 'Failed to save address');
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async (id) => {
    const res = await deleteAddress(id);
    if (res.success) router.refresh();
  };

  // Handle Set Default Address
  const handleSetDefaultAddress = async (id) => {
    const res = await setDefaultAddress(id);
    if (res.success) router.refresh();
  };

  // Handle Fast Order Lookup
  const handleLookupOrder = (e) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);

    const query = lookupQuery.trim().toUpperCase();
    if (!query) return;

    const found = (orders || []).find(
      (o) =>
        (o.orderNumber || o.id || '').toUpperCase().includes(query) ||
        (o.trackingNumber || o.shipment?.trackingNumber || '').toUpperCase().includes(query) ||
        (o.userPhone || user.phone || '').includes(query)
    );

    if (found) {
      setLookupResult(found);
    } else {
      setLookupError(`No booking found matching "${lookupQuery}". Please check your Order ID or phone number.`);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {}
    router.push('/');
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Admin Quick Portal Access Banner */}
      {isAdmin && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#071E3D] border border-[#0B3B60] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#90c4ff] shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-[#90c4ff]">
                  👑 Atelier Administrator
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C1272D] text-white">
                  Full Access
                </span>
              </div>
              <p className="text-xs text-neutral-200 mt-0.5 font-light">
                Manage all 21 sarees, live dispatch loom video verifications, orders, coupons, and patron directory.
              </p>
            </div>
          </div>

          <Link
            href="/admin-controls"
            className="px-5 py-2.5 rounded-full bg-[#C1272D] hover:bg-[#A01F25] text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shrink-0 shadow"
          >
            Open Admin Controls <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Main Account Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Navigation Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center shadow-sm space-y-4">
            {/* Avatar with Camera Overlay */}
            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#0B3B60] bg-[#FAF9F6] flex items-center justify-center group shadow-md">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={user.name || 'Patron'} fill className="object-cover" />
              ) : (
                <User size={38} className="text-[#0B3B60]" />
              )}

              {/* Upload Overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-medium cursor-pointer"
                title="Change Portrait"
              >
                <Camera size={18} className="mb-0.5 text-white" />
                <span>{isUploadingAvatar ? 'Saving...' : 'Update'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />
            </div>

            <div>
              <h2 className="text-lg font-serif font-bold text-[#0B3B60] truncate">
                {user.name || 'Royal Patron'}
              </h2>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-semibold bg-[#0B3B60]/10 text-[#0B3B60] border border-[#0B3B60]/20">
                👑 {user.membershipTier || 'Imperial Patron'}
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav className="pt-3 border-t border-neutral-100 space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#0B3B60] text-white font-bold shadow'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <User size={16} />
                <span>My Royal Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#0B3B60] text-white font-bold shadow'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag size={16} />
                  <span>My Saree Orders</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-200/80 font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tracking')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  activeTab === 'tracking'
                    ? 'bg-[#0B3B60] text-white font-bold shadow'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Truck size={16} />
                <span>Track Saree Order</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-[#0B3B60] text-white font-bold shadow'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span>Delivery Addresses</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-200/80 font-bold">
                  {addresses.length}
                </span>
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#C1272D] hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Sign Out of Atelier</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="lg:col-span-3">
          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0B3B60]">
                    Personal Patron Information
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Manage your identity for bespoke embroidery consultations and delivery updates.
                  </p>
                </div>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-300 text-xs font-semibold text-[#0B3B60] hover:bg-[#0B3B60] hover:text-white transition cursor-pointer"
                  >
                    <Edit2 size={13} /> Edit Profile
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-neutral-500 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-neutral-200 space-y-1">
                    <span className="text-neutral-500 font-medium">Full Name</span>
                    <p className="text-sm font-semibold text-neutral-800">
                      {user.name || 'Not provided'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-neutral-200 space-y-1">
                    <span className="text-neutral-500 font-medium">Email Address</span>
                    <p className="text-sm font-semibold text-neutral-800">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-neutral-200 space-y-1">
                    <span className="text-neutral-500 font-medium">WhatsApp / Phone</span>
                    <p className="text-sm font-semibold text-neutral-800">
                      {user.phone || '+91 88240 17443'}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-neutral-200 space-y-1">
                    <span className="text-neutral-500 font-medium">Patron Membership Tier</span>
                    <p className="text-sm font-serif font-bold text-[#0B3B60]">
                      👑 {user.membershipTier || 'Imperial Patron'}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98290 12345"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Gender (Optional)
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                      >
                        <option value="">Prefer not to specify</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl bg-[#0B3B60] hover:bg-[#071E3D] text-white font-bold uppercase tracking-wider transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? 'Saving Changes...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0B3B60]">
                    Royal Saree Orders ({orders.length})
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Track the handcrafting progress and download pre-dispatch video verification records.
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center shadow-sm space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#0B3B60]/10 border border-[#0B3B60]/20 flex items-center justify-center mx-auto text-[#0B3B60]">
                    <ShoppingBag size={28} />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#0B3B60]">
                    No Bespoke Saree Orders Placed Yet
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Explore our 5 royal collections crafted on traditional Jodhpur addas.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B3B60] hover:bg-[#071E3D] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition"
                  >
                    Explore 21 Royal Sarees <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRACK MY ORDER */}
          {activeTab === 'tracking' && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#0B3B60]">
                  Track Your Saree Order Live
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Enter your Vitasta Order ID (e.g. <code>VIT-ROYAL-8891</code>) or BlueDart/DTDC tracking number.
                </p>
              </div>

              <form onSubmit={handleLookupOrder} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="Enter Order ID or BlueDart AWB Number..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0B3B60] hover:bg-[#071E3D] text-white font-bold text-xs uppercase tracking-wider transition shrink-0 cursor-pointer"
                >
                  Locate Saree
                </button>
              </form>

              {lookupError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {lookupError}
                </div>
              )}

              {lookupResult && (
                <div className="pt-4 border-t border-neutral-200">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#0B3B60] mb-3">
                    Found Order Booking
                  </h4>
                  <OrderCard order={lookupResult} />
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#0B3B60]">
                    Saved Delivery Addresses ({addresses.length})
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Manage your royal residence addresses for insured sovereign deliveries.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B3B60] hover:bg-[#071E3D] text-white font-bold text-xs uppercase tracking-wider shadow transition cursor-pointer"
                >
                  <Plus size={14} /> Add Address
                </button>
              </div>

              {/* Add Address Modal / Inline Form */}
              {isAddingAddress && (
                <div className="p-6 rounded-2xl bg-white border-2 border-[#0B3B60]/30 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <h4 className="font-serif font-bold text-sm text-[#0B3B60] flex items-center gap-1.5">
                      <MapPin size={16} className="text-[#C1272D]" /> Add New Delivery Destination
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Street Address / Palace Wing
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        placeholder="e.g. House No. 42, Heritage Enclave"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">
                          PIN Code (Auto-Lookup)
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={addressForm.zipCode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          placeholder="342001"
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] font-mono focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                        />
                        {isFetchingLocation && (
                          <span className="text-[10px] text-[#0B3B60] block mt-0.5">
                            Looking up postal circle...
                          </span>
                        )}
                        {pincodeError && (
                          <span className="text-[10px] text-amber-600 block mt-0.5">
                            {pincodeError}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">
                          City / District
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">
                          State
                        </label>
                        <select
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-neutral-50/50 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0B3B60] focus:bg-white"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="isDefaultCheckbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="rounded border-neutral-300 text-[#0B3B60] focus:ring-[#0B3B60]"
                      />
                      <label htmlFor="isDefaultCheckbox" className="text-xs text-neutral-700 cursor-pointer">
                        Set as primary default delivery destination
                      </label>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-[#0B3B60] hover:bg-[#071E3D] text-white font-bold transition cursor-pointer"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Addresses List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-2xl bg-white border transition relative flex flex-col justify-between ${
                      addr.isDefault
                        ? 'border-[#0B3B60] shadow-md ring-1 ring-[#0B3B60]/20'
                        : 'border-neutral-200'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-sm text-[#0B3B60]">
                          {addr.fullName}
                        </h4>
                        {addr.isDefault && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0B3B60]/10 text-[#0B3B60] border border-[#0B3B60]/20">
                            Primary Default
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {addr.addressLine1}
                        {addr.addressLine2 && `, ${addr.addressLine2}`}
                        <br />
                        {addr.city}, {addr.state} — {addr.pincode}
                        <br />
                        India
                      </p>

                      <p className="text-xs text-neutral-500 font-mono">Phone: {addr.phone}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                      {!addr.isDefault ? (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[#0B3B60] font-semibold hover:underline cursor-pointer"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={13} /> Active Default
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-[#C1272D] hover:text-[#A01F25] flex items-center gap-1 cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
