'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  Sparkles,
  Phone,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Sparkle,
} from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { useCart } from '@/app/context/CartContext';
import AuthForm from './AuthForm';

const collectionsList = [
  {
    name: 'Riwaayat-e-Chiffon',
    slug: 'riwaayat-e-chiffon',
    desc: 'Pure Chiffon with delicate Cutdana & Pitta',
    count: '5 Sarees',
    href: '/shop?category=riwaayat-e-chiffon',
  },
  {
    name: 'Georgette Reet',
    slug: 'georgette-reet',
    desc: 'Viscose Georgette with Jaal & fine Zari border',
    count: '4 Sarees',
    href: '/shop?category=georgette-reet',
  },
  {
    name: 'Silk Noorani',
    slug: 'silk-noorani',
    desc: 'Pure Katan Silks with heirloom Gota Patti',
    count: '7 Sarees',
    href: '/shop?category=silk-noorani',
  },
  {
    name: 'Organza Adaa',
    slug: 'organza-adaa',
    desc: 'Pure Organza with scalloped Aari borders',
    count: '3 Sarees',
    href: '/shop?category=organza-adaa',
  },
  {
    name: 'Banarasi Virasat',
    slug: 'banarasi-virasat',
    desc: 'Sovereign Banarasi weaves with regal antique zari',
    count: '2 Sarees',
    href: '/shop?category=banarasi-virasat',
  },
];

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Collections', href: '/#collections', isDropdown: true },
  { name: 'Catalog', href: '/shop' },
  { name: 'Promise', href: '/#values' },
  { name: 'Craft', href: '/about' },
  { name: 'Atelier', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { cartCount, setIsDrawerOpen } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCollectionsHovered, setIsCollectionsHovered] = useState(false);
  const collectionsTimeoutRef = useRef(null);

  // Scroll detection: auto-hide on scroll down past 150px, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > 150 && currentScrollY > lastScrollYRef.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Hash Navigation when arriving on page
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [pathname]);

  // Close mobile menu, search, user dropdown on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserDropdownOpen(false);
    setIsCollectionsHovered(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (e, href) => {
    setIsMobileMenuOpen(false);
    setIsCollectionsHovered(false);

    if (href.startsWith('/#')) {
      const sectionId = href.replace('/#', '');
      if (pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (href === '/') {
      if (pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsUserDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const handleMouseEnterCollections = () => {
    if (collectionsTimeoutRef.current) clearTimeout(collectionsTimeoutRef.current);
    setIsCollectionsHovered(true);
  };

  const handleMouseLeaveCollections = () => {
    collectionsTimeoutRef.current = setTimeout(() => {
      setIsCollectionsHovered(false);
    }, 200);
  };

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'OWNER';

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Top Royal Announcement Bar */}
        <div
          className={`bg-[#071E3D] text-[#FAF9F6] text-[11px] sm:text-xs px-3 sm:px-4 flex justify-between items-center tracking-wider transition-all duration-300 ${
            isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'py-2 opacity-100'
          }`}
        >
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-block bg-[rgba(193,39,45,0.25)] border border-[rgba(193,39,45,0.4)] text-[#ff8a8e] px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
              Royal Atelier
            </span>
            <span>
              Thoughtfully Handcrafted in Jodhpur •{' '}
              <span className="text-[#90c4ff] font-semibold">
                Pre-Dispatch Video Verification for Every Saree
              </span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs">
            <a
              href="https://wa.me/918824017443"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#90c4ff] hover:underline flex items-center gap-1"
            >
              <Phone className="w-3 h-3" /> +91 88240 17443
            </a>
          </div>
        </div>

        {/* Main Navigation Header */}
        <header
          className={`transition-all duration-300 border-b ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-md shadow-md border-neutral-200 py-2.5 sm:py-3'
              : 'bg-white border-neutral-200 py-3.5 sm:py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Left: Mobile Menu Toggle Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 -ml-1 text-[#0B3B60] hover:text-[#C1272D] rounded-lg transition"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#0B3B60]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#0B3B60]" />
                )}
              </button>
            </div>

            {/* Brand Logo matching Git latest commit */}
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, '/')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 border border-neutral-200">
                <Image
                  src="https://res.cloudinary.com/sjl1rfvu/image/upload/v1789675005/vitasta/brand/vitasta_logo_banner.jpg"
                  alt="Vitasta unfolding serenity logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#0B3B60] tracking-tight leading-none">
                  Vit<span className="text-[#C1272D]">a</span>sta
                </span>
                <span className="font-serif italic text-[11px] text-neutral-500 tracking-wide mt-0.5">
                  unfolding serenity
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs uppercase tracking-widest font-semibold text-[#0B3B60]">
              {navLinks.map((link) => {
                const isExactActive = pathname === link.href;

                if (link.isDropdown) {
                  return (
                    <div
                      key={link.name}
                      className="relative"
                      onMouseEnter={handleMouseEnterCollections}
                      onMouseLeave={handleMouseLeaveCollections}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="hover:text-[#C1272D] transition py-2 inline-flex items-center gap-1 group"
                      >
                        <span>{link.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                      </Link>

                      {/* Collections Dropdown Mega Menu */}
                      {isCollectionsHovered && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[340px] z-50 animate-in fade-in zoom-in-95 duration-150">
                          <div className="bg-white border border-neutral-200 rounded-2xl shadow-2xl p-3 space-y-1">
                            <div className="px-3 py-1.5 border-b border-neutral-100 flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                The 5 Royal Collections
                              </span>
                              <Link
                                href="/#collections"
                                onClick={(e) => handleNavClick(e, '/#collections')}
                                className="text-[10px] font-bold text-[#C1272D] hover:underline"
                              >
                                View All 5
                              </Link>
                            </div>

                            {collectionsList.map((col) => (
                              <Link
                                key={col.slug}
                                href={col.href}
                                onClick={() => setIsCollectionsHovered(false)}
                                className="block p-2.5 rounded-xl hover:bg-[#FAF9F6] transition group border border-transparent hover:border-neutral-200"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-serif font-bold text-[#0B3B60] text-sm group-hover:text-[#C1272D] transition">
                                    {col.name}
                                  </span>
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-[#0B3B60] font-semibold">
                                    {col.count}
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-500 font-normal lowercase tracking-normal mt-0.5 capitalize truncate">
                                  {col.desc}
                                </p>
                              </Link>
                            ))}

                            <div className="pt-2 border-t border-neutral-100">
                              <Link
                                href="/shop"
                                onClick={() => setIsCollectionsHovered(false)}
                                className="w-full py-2 px-3 rounded-xl bg-[#0B3B60] hover:bg-[#062238] text-white text-[11px] font-bold text-center block transition uppercase tracking-wider"
                              >
                                Browse All 21 Handcrafted Sarees →
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`hover:text-[#C1272D] transition py-1 relative ${
                      isExactActive ? 'text-[#C1272D] font-bold' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 sm:p-2 text-[#0B3B60] hover:text-[#C1272D] transition"
                title="Search Sarees"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Shortlist Icon */}
              <Link
                href="/account"
                className="p-1.5 sm:p-2 text-[#0B3B60] hover:text-[#C1272D] transition relative"
                title="Royal Shortlist"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              {/* Shopping Bag Trigger */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="p-1.5 sm:p-2 text-[#0B3B60] hover:text-[#C1272D] transition relative"
                title="Atelier Bag"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C1272D] text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Profile / Admin Controls / Auth Dropdown */}
              {session?.user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-1.5 py-1 px-2.5 rounded-full border border-neutral-200 hover:border-[#0B3B60] transition bg-white shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#0B3B60] text-white flex items-center justify-center text-xs font-bold uppercase">
                      {session.user.name?.charAt(0) || 'P'}
                    </div>
                    <span className="text-xs font-semibold text-[#0B3B60] hidden md:inline">
                      {session.user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-xs font-bold text-[#0B3B60] truncate">
                          {session.user.name}
                        </p>
                        <p className="text-[10px] text-neutral-500 truncate">{session.user.email}</p>
                        <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-[#0B3B60] font-semibold border border-blue-200">
                          {session.user.role === 'ADMIN' ? '👑 Atelier Admin' : '⚜️ Royal Patron'}
                        </span>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin-controls"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0B3B60] bg-blue-50 hover:bg-blue-100 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#0B3B60]" />
                          Admin Controls
                        </Link>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 transition"
                      >
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        Atelier Account & Orders
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-white border border-[#0B3B60]/30 hover:border-[#0B3B60] text-[#0B3B60] text-xs font-semibold tracking-wider uppercase transition shadow-xs cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Live Search Bar Overlay */}
          {isSearchOpen && (
            <div className="max-w-4xl mx-auto px-4 pt-2.5 pb-2 animate-in slide-in-from-top duration-200">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search pure silk, chiffon, zari border, color..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-24 py-2.5 rounded-full border border-neutral-300 bg-neutral-50 text-xs sm:text-sm focus:outline-none focus:border-[#0B3B60] text-neutral-900"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="px-2 py-1 text-neutral-400 hover:text-neutral-700 text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#0B3B60] text-white rounded-full text-xs font-semibold hover:bg-[#062238] transition"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          )}
        </header>

        {/* Luxury Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[60px] sm:top-[70px] z-50 bg-[#071E3D] px-6 py-6 overflow-y-auto flex flex-col justify-between border-t border-white/10 lg:hidden animate-in fade-in duration-200 text-white min-h-[calc(100vh-70px)]">
            <div className="space-y-6">
              {/* Brand in Drawer */}
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <span className="font-serif text-2xl font-bold text-white tracking-tight">
                    Vit<span className="text-[#ff8a8e]">a</span>sta
                  </span>
                  <p className="font-serif italic text-xs text-[#90c4ff] mt-0.5">
                    unfolding serenity
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#FAF9F6]/70 border border-white/20 px-2 py-1 rounded-full">
                  Jodhpur Atelier
                </span>
              </div>

              {/* Mobile Nav Links */}
              <div className="space-y-2 text-sm font-medium">
                <Link
                  href="/"
                  onClick={(e) => handleNavClick(e, '/')}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/10 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span>🏰</span> Home
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </Link>

                {/* Mobile Collections Expandable */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsMobileCollectionsOpen(!isMobileCollectionsOpen)}
                    className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/10 transition text-left"
                  >
                    <span className="flex items-center gap-2.5 text-[#ff8a8e] font-semibold">
                      <span>👑</span> The 5 Royal Collections
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-white/40 transition-transform ${
                        isMobileCollectionsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isMobileCollectionsOpen && (
                    <div className="pl-6 pr-2 py-2 space-y-1.5 border-l-2 border-[#C1272D]/50 ml-4 my-1">
                      {collectionsList.map((col) => (
                        <Link
                          key={col.slug}
                          href={col.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 px-3 rounded-lg text-xs hover:bg-white/10 text-neutral-200"
                        >
                          <span className="font-serif font-medium">{col.name}</span>
                          <span className="text-[9px] text-[#90c4ff]">{col.count}</span>
                        </Link>
                      ))}
                      <Link
                        href="/#collections"
                        onClick={(e) => handleNavClick(e, '/#collections')}
                        className="block text-xs font-bold text-[#90c4ff] hover:underline pt-1 px-3"
                      >
                        Explore Visual Slideshow →
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/10 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span>📜</span> Complete Catalog (21 Sarees)
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </Link>

                <Link
                  href="/#values"
                  onClick={(e) => handleNavClick(e, '/#values')}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/10 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span>🛡️</span> Video Proof & Promise
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/10 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span>🪡</span> Heritage & Adda Craft
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/10 transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span>🏛️</span> Jodhpur Royal Atelier
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </Link>

                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-[#90c4ff] hover:bg-white/10 transition font-semibold"
                >
                  <span className="flex items-center gap-2.5">
                    <span>👤</span> My Royal Account & Orders
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#90c4ff]" />
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin-controls"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#C1272D]/20 border border-[#C1272D]/40 text-[#ff8a8e] font-bold transition"
                  >
                    <span className="flex items-center gap-2.5">
                      <span>👑</span> Atelier Admin Controls
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#ff8a8e]" />
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Footer WhatsApp Contact */}
            <div className="pt-6 border-t border-white/10 text-xs space-y-3 mt-6">
              <a
                href="https://wa.me/918824017443?text=Hello%20Vitasta%20Atelier,%20I%20would%20like%20to%20inquire%20about%20your%20handcrafted%20sarees."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Phone className="w-4 h-4" /> Chat with Master Artisan (+91 88240 17443)
              </a>
              <p className="text-[10px] text-neutral-400 text-center">
                Thoughtfully Handcrafted in Jodhpur, Rajasthan • 100% Authentic Handloom
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Spacer to prevent content under fixed header */}
      <div className="h-20 sm:h-24"></div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute -top-3 -right-3 z-10 p-1.5 rounded-full bg-white text-neutral-600 shadow-lg hover:text-[#C1272D] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <AuthForm onSuccess={() => setIsAuthModalOpen(false)} isModal={true} />
          </div>
        </div>
      )}
    </>
  );
}
