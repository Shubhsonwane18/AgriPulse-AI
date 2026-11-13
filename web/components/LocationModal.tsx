'use client';

import React, { useState, useEffect } from 'react';
import { useLocation } from './LocationContext';
import { useLanguage } from './LanguageContext';
import {
  X,
  Search,
  Compass,
  MapPin,
  Check,
  Building2,
  Navigation,
  Landmark,
  Layers,
  ChevronRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import {
  UserLocationDetails,
  POPULAR_AGRI_REGIONS,
  searchIndianCityOrTaluka,
  getAllIndexedTalukas,
  fetchLGDDistricts,
  fetchLGDTalukas,
  fetchLGDVillages,
  LGDDistrict,
  LGDSubDistrict,
  LGDVillage
} from '@/lib/location';
import { FarmMapLocator } from './FarmMapLocator';

export function LocationModal() {
  const { location, setLocation, detectGPS, isLocating, locationModalOpen, setLocationModalOpen } = useLocation();
  const { locale } = useLanguage();
  const isMr = locale === 'mr';
  const isHi = locale === 'hi';

  const [activeTab, setActiveTab] = useState<'satellite' | 'search' | 'cascade'>('satellite');

  // Search Mode States
  const [query, setQuery] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('all');
  const [searchResults, setSearchResults] = useState<UserLocationDetails[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 3-Tier Cascade Mode States (District -> Taluka -> Village)
  const [availableDistricts, setAvailableDistricts] = useState<LGDDistrict[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Kolhapur');
  const [availableTalukas, setAvailableTalukas] = useState<LGDSubDistrict[]>([]);
  const [selectedTaluka, setSelectedTaluka] = useState<string>('Karvir');
  const [availableVillages, setAvailableVillages] = useState<LGDVillage[]>([]);
  const [villageFilterQuery, setVillageFilterQuery] = useState('');
  const [isLoadingCascade, setIsLoadingCascade] = useState(false);

  const districtFilterChips = [
    { id: 'all', label: isMr ? 'सर्व जिल्हे' : isHi ? 'सभी जिले' : 'All Regions' },
    { id: 'Kolhapur', label: isMr ? 'कोल्हापूर' : isHi ? 'कोल्हापुर' : 'Kolhapur' },
    { id: 'Nashik', label: isMr ? 'नाशिक (लासलगाव)' : isHi ? 'नाशिक (लासलगांव)' : 'Nashik' },
    { id: 'Pune', label: isMr ? 'पुणे (बारामती)' : isHi ? 'पुणे (बारामती)' : 'Pune' },
    { id: 'Ahmednagar', label: isMr ? 'अहिल्यानगर (शिर्डी)' : isHi ? 'अहिल्यानगर' : 'Ahmednagar' },
    { id: 'Sangli', label: isMr ? 'सांगली' : isHi ? 'सांगली' : 'Sangli' },
    { id: 'Satara', label: isMr ? 'सातारा' : isHi ? 'सातारा' : 'Satara' },
    { id: 'Solapur', label: isMr ? 'सोलापूर' : isHi ? 'सोलापूर' : 'Solapur' },
    { id: 'Jalgaon', label: isMr ? 'जळगाव' : isHi ? 'जलगांव' : 'Jalgaon' },
    { id: 'Indore', label: isMr ? 'इंदूर (MP)' : isHi ? 'इंदौर (MP)' : 'Indore' },
    { id: 'Rajkot', label: isMr ? 'राजकोट (GUJ)' : isHi ? 'राजकोट (गुजरात)' : 'Rajkot' },
  ];

  // Load districts list once when modal opens
  useEffect(() => {
    if (!locationModalOpen) return;
    let active = true;
    fetchLGDDistricts('Maharashtra').then((dists) => {
      if (active && dists.length > 0) {
        setAvailableDistricts(dists);
      }
    });
    return () => { active = false; };
  }, [locationModalOpen]);

  // When selected district changes in cascade, load its talukas
  useEffect(() => {
    if (!locationModalOpen || activeTab !== 'cascade') return;
    let active = true;
    setIsLoadingCascade(true);
    fetchLGDTalukas(selectedDistrict)
      .then((talukas) => {
        if (!active) return;
        setAvailableTalukas(talukas);
        if (talukas.length > 0) {
          const firstTaluka = talukas[0].subdistrict_name;
          setSelectedTaluka(firstTaluka);
          return fetchLGDVillages({ district: selectedDistrict, taluka: firstTaluka });
        } else {
          setAvailableVillages([]);
          return [];
        }
      })
      .then((vills) => {
        if (active && vills) {
          setAvailableVillages(vills);
        }
      })
      .finally(() => {
        if (active) setIsLoadingCascade(false);
      });

    return () => { active = false; };
  }, [locationModalOpen, activeTab, selectedDistrict]);

  // When selected taluka changes in cascade, load its villages
  const handleTalukaChange = async (talukaName: string) => {
    setSelectedTaluka(talukaName);
    setIsLoadingCascade(true);
    try {
      const vills = await fetchLGDVillages({ district: selectedDistrict, taluka: talukaName });
      setAvailableVillages(vills);
    } finally {
      setIsLoadingCascade(false);
    }
  };

  // Perform search / filtering in search tab
  useEffect(() => {
    if (activeTab !== 'search') return;
    let active = true;

    if (!query.trim()) {
      const all = getAllIndexedTalukas();
      const filtered = selectedDistrictFilter === 'all'
        ? all.slice(0, 30)
        : all.filter(t => t.district.toLowerCase() === selectedDistrictFilter.toLowerCase());
      setSearchResults(filtered);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchIndianCityOrTaluka(query);
        if (active) {
          const filtered = selectedDistrictFilter === 'all'
            ? results
            : results.filter(t => t.district.toLowerCase() === selectedDistrictFilter.toLowerCase());
          setSearchResults(filtered);
        }
      } finally {
        if (active) setIsSearching(false);
      }
    }, 120);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, selectedDistrictFilter, activeTab]);

  if (!locationModalOpen) return null;

  const handleSelect = (loc: UserLocationDetails) => {
    setLocation(loc);
    setLocationModalOpen(false);
  };

  const handleSelectVillage = (v: LGDVillage) => {
    const loc: UserLocationDetails = {
      latitude: v.latitude,
      longitude: v.longitude,
      village: v.village_name,
      taluka: v.subdistrict_name || selectedTaluka,
      district: v.district_name || selectedDistrict,
      state: v.state_name || 'Maharashtra',
      country: 'India',
      displayName: `${v.village_name} ${v.village_name_local ? '(' + v.village_name_local + ')' : ''}, ${v.subdistrict_name || selectedTaluka}, ${v.district_name || selectedDistrict}`,
      source: 'lgd',
      lgdCode: v.village_code,
      gramPanchayat: v.gram_panchayat,
      pincode: v.pincode,
    };
    setLocation(loc);
    setLocationModalOpen(false);
  };

  const handleLiveGPSClick = async () => {
    const loc = await detectGPS();
    if (loc) {
      setLocationModalOpen(false);
    }
  };

  const filteredVillages = availableVillages.filter(v => {
    if (!villageFilterQuery.trim()) return true;
    const q = villageFilterQuery.toLowerCase().trim();
    return v.village_name.toLowerCase().includes(q) ||
      (v.village_name_local && v.village_name_local.includes(q)) ||
      (v.gram_panchayat && v.gram_panchayat.toLowerCase().includes(q)) ||
      (v.pincode && v.pincode.includes(q));
  });

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 md:p-4 animate-in fade-in duration-150"
      onClick={() => setLocationModalOpen(false)}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-5 md:p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[92vh] flex flex-col text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#165b33] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <span>{isMr ? 'शेतीचे अचूक गाव व स्थान निवडा' : isHi ? 'खेत का सटीक गाँव व स्थान चुनें' : 'Select Exact Farm Village & Location'}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-100 text-[#165b33] border border-emerald-200">
                  LGD 2026
                </span>
              </h3>
              <p className="text-[11px] text-gray-500">
                {isMr ? 'शासकीय गाव निर्देशिका (LGD), तालुका व थेट GPS अंतर मोजणी' : 'Authoritative Local Government Directory (LGD) & Mandi Logistics Engine'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLocationModalOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Location Pill */}
        <div className="p-2.5 md:p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#165b33] shrink-0" />
            <div>
              <span className="text-[10px] text-gray-500 block font-medium">
                {isMr ? 'सध्याचे निवडलेले गाव / स्थान:' : 'Currently Active Farm Location:'}
              </span>
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <span>{location.village}, {location.taluka ? `${location.taluka}, ` : ''}{location.district}, {location.state}</span>
                {location.lgdCode && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-emerald-200 text-emerald-900 font-bold">
                    LGD: #{location.lgdCode}
                  </span>
                )}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs">
            Active
          </span>
        </div>

        {/* Live GPS Detection Button */}
        <button
          onClick={handleLiveGPSClick}
          disabled={isLocating}
          className="w-full py-2.5 rounded-2xl bg-[#165b33] hover:bg-[#124828] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs shrink-0 disabled:opacity-70 cursor-pointer"
        >
          <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>
            {isLocating
              ? (isMr ? 'जीपीएस शोधत आहे (कृपया अनुमती द्या)...' : 'Detecting GPS (Snapping to Nearest LGD Village)...')
              : (isMr ? '📍 थेट GPS स्थान शोधा (Snap to Nearest LGD Village)' : '📍 Detect Live GPS (Snap to Nearest Village)')}
          </span>
        </button>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-3 p-1 bg-gray-100 rounded-2xl shrink-0 text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('satellite')}
            className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'satellite'
                ? 'bg-[#165b33] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>🛰️</span>
            <span>{isMr ? 'उपग्रह नकाशा' : 'Satellite Pin'}</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'search'
                ? 'bg-white text-[#165b33] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isMr ? 'शोध' : 'Search'}</span>
          </button>
          <button
            onClick={() => setActiveTab('cascade')}
            className={`py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'cascade'
                ? 'bg-white text-[#165b33] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>{isMr ? 'गाव यादी' : 'LGD List'}</span>
          </button>
        </div>

        {/* ================= TAB 0: HIGH-PRECISION SATELLITE PLOT LOCATOR ================= */}
        {activeTab === 'satellite' && (
          <div className="flex-1 overflow-y-auto">
            <FarmMapLocator
              initialLat={location.latitude || 18.7120}
              initialLon={location.longitude || 76.3450}
              onConfirmLocation={(loc) => {
                setLocation(loc);
                setLocationModalOpen(false);
              }}
            />
          </div>
        )}

        {/* ================= TAB 1: INSTANT MULTILINGUAL SEARCH ================= */}
        {activeTab === 'search' && (
          <div className="flex-1 flex flex-col space-y-3 min-h-0">
            {/* Search Input Box */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isMr
                    ? 'गाव, तालुका किंवा शहराचे नाव शोधा (उदा. लासलगाव, शिर्डी, कसबा बावडा, बारामती...)'
                    : 'Search any Village, Taluka or District (e.g. Lasalgaon, Shirdi, Kasaba Bawada...)'
                }
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-300 rounded-2xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#165b33] focus:bg-white transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick District Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 text-xs">
              {districtFilterChips.map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedDistrictFilter(chip.id)}
                  className={`px-3 py-1 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
                    selectedDistrictFilter === chip.id
                      ? 'bg-[#165b33] text-white font-bold'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Search Results List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-56">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1">
                {query.trim()
                  ? `Matches for "${query}" (${searchResults.length}):`
                  : selectedDistrictFilter === 'all'
                  ? 'Key Agricultural Talukas & Verified Villages:'
                  : `${selectedDistrictFilter} Villages & Talukas:`}
              </span>

              {searchResults.length === 0 && !isSearching && (
                <div className="p-4 text-center text-xs text-gray-500">
                  No matching village found. Switch to the <strong>LGD Village Hierarchy</strong> tab to browse all talukas and villages.
                </div>
              )}

              {searchResults.map((item, idx) => {
                const isCurrent =
                  location.village.toLowerCase() === item.village.toLowerCase() &&
                  location.district.toLowerCase() === item.district.toLowerCase();

                return (
                  <button
                    key={`search-${item.village}-${idx}`}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-50 border-emerald-300 font-bold text-[#165b33]'
                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-[13px]">{item.village}</span>
                        {item.lgdCode && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                            LGD #{item.lgdCode}
                          </span>
                        )}
                        {item.source === 'lgd' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                            Govt LGD
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 font-normal block">
                        {item.taluka && item.taluka !== item.village ? `${item.taluka}, ` : ''}{item.district}, {item.state}
                        {item.gramPanchayat ? ` · GP: ${item.gramPanchayat}` : ''} · GPS ({item.latitude.toFixed(2)}°N, {item.longitude.toFixed(2)}°E)
                      </span>
                    </div>
                    {isCurrent ? (
                      <Check className="w-4 h-4 text-[#165b33] shrink-0" />
                    ) : (
                      <span className="text-[11px] font-bold text-gray-400 hover:text-[#165b33]">Select →</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 2: 3-TIER LGD CASCADE DRILLDOWN ================= */}
        {activeTab === 'cascade' && (
          <div className="flex-1 flex flex-col space-y-3 min-h-0">
            {/* Step 1 & 2: District and Taluka Dropdowns */}
            <div className="grid grid-cols-2 gap-2 shrink-0">
              {/* District Select */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  1. {isMr ? 'जिल्हा निवडा (District)' : 'Select District'}
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-2.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#165b33]"
                >
                  {availableDistricts.length === 0 && (
                    <option value="Kolhapur">Kolhapur (कोल्हापूर)</option>
                  )}
                  {availableDistricts.map((d) => (
                    <option key={d.district_code} value={d.district_name}>
                      {d.district_name} {d.district_name_local ? `(${d.district_name_local})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Taluka Select */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                  2. {isMr ? 'तालुका निवडा (Taluka)' : 'Select Taluka'}
                </label>
                <select
                  value={selectedTaluka}
                  onChange={(e) => handleTalukaChange(e.target.value)}
                  disabled={availableTalukas.length === 0}
                  className="w-full px-2.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#165b33] disabled:opacity-60"
                >
                  {availableTalukas.length === 0 && (
                    <option value={selectedTaluka}>{selectedTaluka}</option>
                  )}
                  {availableTalukas.map((t) => (
                    <option key={t.subdistrict_code} value={t.subdistrict_name}>
                      {t.subdistrict_name} {t.subdistrict_name_local ? `(${t.subdistrict_name_local})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter villages within taluka */}
            <div className="relative shrink-0">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={villageFilterQuery}
                onChange={(e) => setVillageFilterQuery(e.target.value)}
                placeholder={`Filter villages in ${selectedTaluka} taluka...`}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            {/* Village Results List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-52">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  3. {isMr ? 'गाव निवडा (All Villages)' : 'Select Village'}: {filteredVillages.length} Villages in {selectedTaluka}
                </span>
                {isLoadingCascade && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#165b33]" />
                )}
              </div>

              {filteredVillages.length === 0 && !isLoadingCascade && (
                <div className="p-4 text-center text-xs text-gray-500">
                  No villages listed for {selectedTaluka}. You can select the Taluka centroid directly or search by name.
                </div>
              )}

              {filteredVillages.map((v) => {
                const isCurrent =
                  location.village.toLowerCase() === v.village_name.toLowerCase() &&
                  location.district.toLowerCase() === (v.district_name || selectedDistrict).toLowerCase();

                return (
                  <button
                    key={`cascade-v-${v.village_code}`}
                    onClick={() => handleSelectVillage(v)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-50 border-emerald-300 font-bold text-[#165b33]'
                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{v.village_name}</span>
                        {v.village_name_local && (
                          <span className="text-[11px] text-gray-600 font-medium">({v.village_name_local})</span>
                        )}
                        <span className="text-[9px] px-1 py-0.2 rounded-xs bg-gray-100 text-gray-600 font-mono">
                          LGD: {v.village_code}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-normal block">
                        GP: {v.gram_panchayat || v.village_name} · PIN: {v.pincode || '—'} · GPS ({v.latitude.toFixed(2)}°N, {v.longitude.toFixed(2)}°E)
                      </span>
                    </div>
                    {isCurrent ? (
                      <Check className="w-4 h-4 text-[#165b33] shrink-0" />
                    ) : (
                      <span className="text-[11px] font-bold text-gray-400 hover:text-[#165b33]">Select →</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Popular Agricultural Centers Preset Section */}
        <div className="border-t border-gray-100 pt-2.5 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            {isMr ? 'प्रमुख शेतमाल बाजार केंद्रे:' : 'Major Agricultural APMC Hubs:'}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {POPULAR_AGRI_REGIONS.slice(0, 6).map((preset) => (
              <button
                key={preset.displayName}
                onClick={() => handleSelect(preset)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-100 hover:bg-emerald-50 hover:text-emerald-900 border border-gray-200 transition-colors cursor-pointer"
              >
                {preset.village} ({preset.district})
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
