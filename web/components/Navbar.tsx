'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { useLocation } from './LocationContext';
import { Locale } from '@/lib/i18n';
import { ChevronDown, Menu, X, User, MapPin } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, t, languages } = useLanguage();
  const { user, profile } = useAuth();
  const { location, setLocationModalOpen } = useLocation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLangMeta = languages.find(l => l.code === locale) || languages[0];

  const navLinks = [
    { name: t.nav.dashboard, href: '/' },
    { name: t.nav.prices, href: '/prices' },
    { name: t.nav.forecast, href: '/forecast' },
    { name: t.nav.markets, href: '/markets' },
    { name: t.nav.profit, href: '/profit' },
    { name: t.nav.soil, href: '/soil' },
    { name: t.nav.store, href: '/store' },
    { name: t.nav.chat, href: '/chat' },
    { name: t.nav.alerts, href: '/alerts' },
    { name: t.nav.disease, href: '/disease' },
    { name: t.nav.admin, href: '/admin' },
  ];

  return (
    <header className="w-full bg-[#f4f6f4] border-b border-gray-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Brand Logo: AgriPulse (किसानमित्र) */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-[#165b33]">
                AgriPulse
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-semibold text-emerald-800 bg-emerald-100 rounded">
                किसानमित्र
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-5 lg:space-x-7 text-[14px]">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-semibold transition-colors pb-1 relative ${isActive
                        ? 'text-[#165b33] font-bold border-b-2 border-[#165b33]'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Location Selector, Language Pill & Auth */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Global Location Selector Pill */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-gray-800 text-xs font-semibold border border-gray-300 shadow-xs transition-all cursor-pointer"
              title="Change Farm Location"
            >
              <MapPin className="w-3.5 h-3.5 text-[#165b33] shrink-0" />
              <span className="truncate max-w-[100px] lg:max-w-[130px] font-bold">
                {location.village || location.district || 'Location'}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-500 shrink-0" />
            </button>

            {/* Language Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-800 text-xs font-medium border border-gray-300 shadow-xs transition-all"
              >
                <span>{currentLangMeta.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
                    Language / भाषा
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code as Locale);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between transition-colors ${locale === lang.code
                          ? 'bg-emerald-50 text-[#165b33] font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-sm">{lang.name}</span>
                      <span className="text-[11px] text-gray-400">{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Link / Profile */}
            {user ? (
              <Link
                href="/settings"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#165b33] text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>{profile?.full_name?.split(' ')[0] || t.nav.settings}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-2 py-1.5"
              >
                {t.nav.login}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white text-gray-800 text-xs font-bold border border-gray-200 shadow-xs"
            >
              <MapPin className="w-3 h-3 text-[#165b33]" />
              <span className="truncate max-w-[80px]">{location.village || 'Location'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white text-gray-700 border border-gray-200 shadow-xs"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg">
          {/* Location Selector for Mobile */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500">Location:</span>
            <button
              onClick={() => {
                setLocationModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#165b33] text-xs font-bold border border-emerald-200"
            >
              <MapPin className="w-3 h-3 text-[#165b33]" />
              <span>{location.village}, {location.district}</span>
              <span className="text-[10px] underline ml-1">Change</span>
            </button>
          </div>

          {/* Language Selector for Mobile */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500">Language:</span>
            <div className="flex flex-wrap gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code as Locale);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${locale === lang.code
                      ? 'bg-[#165b33] text-white border-[#165b33]'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg text-sm font-semibold ${pathname === link.href
                    ? 'bg-emerald-50 text-[#165b33]'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Link
              href={user ? '/settings' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 text-center rounded-xl bg-[#165b33] text-white font-bold text-xs"
            >
              {user ? (profile?.full_name || t.nav.settings) : t.nav.login}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
