'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { useLocation } from '@/components/LocationContext';
import {
  Scale,
  Calculator,
  Truck,
  MapPin,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  SlidersHorizontal,
  Navigation,
  ArrowRight,
  Compass,
  Sparkles,
  Fuel,
  Coins
} from 'lucide-react';
import {
  findNearestAndHighestMandis,
  NearestAndHighestSummary
} from '@/lib/geoService';

// Vehicle Fuel Economy Table strictly based on AGENTS.md Section 4.1
const VEHICLE_FLEET = [
  { id: 'tata_ace', name: 'Tata Ace (Chhota Hathi)', mileageKmPerL: 11.0, maxPayloadQtl: 15, tag: '1.5 Tonne LCV' },
  { id: 'pickup_407', name: 'Bolero Maxi / 407 LCV', mileageKmPerL: 8.5, maxPayloadQtl: 25, tag: '2.5 Tonne Truck' },
  { id: 'tractor', name: 'Tractor Trolley (45 HP)', mileageKmPerL: 5.0, maxPayloadQtl: 50, tag: 'Heavy Farm Trolley' },
  { id: 'three_wheeler', name: '3-Wheeler Cargo Auto', mileageKmPerL: 18.0, maxPayloadQtl: 6, tag: 'Local Runabout' },
];

export default function MarketsPage() {
  const { t, locale } = useLanguage();
  const { location, detectGPS, isLocating, setLocationModalOpen } = useLocation();

  // W5 & AGENTS.md Section 4.1 Logistics Arbitrage Inputs
  const [vehicleId, setVehicleId] = useState<string>('tata_ace');
  const [dieselPrice, setDieselPrice] = useState<number>(92.5);
  const [loadQuintals, setLoadQuintals] = useState<number>(12.0);
  const [laborFeePerQtl, setLaborFeePerQtl] = useState<number>(25.0);
  const [apmcCessPct, setApmcCessPct] = useState<number>(1.05);
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // W6 Profit Calculator Inputs
  const [selectedCropName, setSelectedCropName] = useState<string>('Onion');
  const [areaAcres, setAreaAcres] = useState<number>(2.0);
  const [costOfCultivationPerAcre, setCostOfCultivationPerAcre] = useState<number>(22000);
  const [expectedYieldPerAcre, setExpectedYieldPerAcre] = useState<number>(25); // quintal/acre

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  // Compute live nearest and highest mandis from geographic cluster
  const [mandiSummary, setMandiSummary] = useState<NearestAndHighestSummary>(() =>
    findNearestAndHighestMandis(
      location.latitude,
      location.longitude,
      selectedCropName,
      2.0,
      apmcCessPct,
      1.0
    )
  );

  useEffect(() => {
    const summary = findNearestAndHighestMandis(
      location.latitude,
      location.longitude,
      selectedCropName,
      2.0,
      apmcCessPct,
      1.0
    );
    setMandiSummary(summary);
  }, [location, selectedCropName, apmcCessPct]);

  const activeVehicle = useMemo(() => {
    return VEHICLE_FLEET.find(v => v.id === vehicleId) || VEHICLE_FLEET[0];
  }, [vehicleId]);

  // AGENTS.md Section 4.1 Mathematical Arbitrage Computation
  const evaluatedMandis = useMemo(() => {
    const mileage = activeVehicle.mileageKmPerL;

    return mandiSummary.allRanked.map((item) => {
      const grossVal = loadQuintals * item.grossPrice;
      
      // Round-trip road fuel calculation: 2 * D * (P_fuel / M_vehicle)
      const roundTripDistance = item.distanceKm * 2.0;
      const fuelCost = Math.round((roundTripDistance / mileage) * dieselPrice);
      const handlingCost = Math.round(loadQuintals * laborFeePerQtl);
      const cessCost = Math.round((apmcCessPct / 100.0) * grossVal);
      const totalOverhead = fuelCost + handlingCost + cessCost;

      const netEarnings = Math.max(0, grossVal - totalOverhead);
      const effectiveRate = loadQuintals > 0 ? Math.round(netEarnings / loadQuintals) : 0;

      return {
        ...item,
        grossVal,
        fuelCost,
        handlingCost,
        cessCost,
        totalOverhead,
        netEarnings,
        effectiveRate
      };
    }).sort((a, b) => b.netEarnings - a.netEarnings);
  }, [mandiSummary.allRanked, activeVehicle, dieselPrice, loadQuintals, laborFeePerQtl, apmcCessPct]);

  const strings = {
    badge: isEn ? 'Net Mandi Arbitrage Engine' : isMr ? 'थेट बाजार नफा विश्लेषण' : 'सटीक शुद्ध मंडी लाभ इंजन',
    cropRadius: !mounted
      ? `${selectedCropName} · ${isEn ? 'Net Realization Intelligence' : isMr ? 'बाजार समिती विश्लेषण' : 'मंडी विश्लेषण'}`
      : isEn
      ? `${selectedCropName} · Computed from ${location.village}, ${location.district} (${activeVehicle.name})`
      : isMr
      ? `${selectedCropName === 'Onion' ? 'कांदा' : selectedCropName} · ${location.village}, ${location.district} पासून`
      : `${selectedCropName === 'Onion' ? 'प्याज' : selectedCropName} · ${location.village}, ${location.district} से`,
    you: isEn ? 'You' : isMr ? 'तुम्ही' : 'आप',
    netIncomeLabel: isEn ? 'effective net / qtl' : isMr ? 'निव्वळ दर / क्विंटल' : 'शुद्ध दर / क्विंटल',
    deductionSummary: isEn
      ? `${activeVehicle.name} (${activeVehicle.mileageKmPerL} km/L) · Diesel ₹${dieselPrice}/L · Cess ${apmcCessPct}%`
      : isMr
      ? `${activeVehicle.name} (${activeVehicle.mileageKmPerL} किमी/ली) · डिझेल ₹${dieselPrice}/ली · सेस ${apmcCessPct}%`
      : `${activeVehicle.name} (${activeVehicle.mileageKmPerL} किमी/ली) · डीजल ₹${dieselPrice}/ली · टैक्स ${apmcCessPct}%`,
    editRates: isEn ? 'Change Vehicle & Diesel' : isMr ? 'वाहन व डिझेल बदला' : 'वाहन व डीजल बदलें',
    sampleDisclaimer: isEn
      ? 'Calculated via AGENTS.md Section 4.1: Net = (Produce × Price) - (2×D/Mileage × Diesel) - Loading - APMC Cess.'
      : isMr
      ? 'AGENTS.md ४.१ सूत्रानुसार: निव्वळ नफा = (उत्पादन × भाव) - (२×अंतर/मायलेज × डिझेल) - हमाली - APMC सेस.'
      : 'AGENTS.md ४.१ फॉर्मूला: शुद्ध आय = (उपज × भाव) - (२×दूरी/माइलेज × डीजल) - मजदूरी - मंडी टैक्स।',

    rankingTitle: isEn ? 'Mandi Arbitrage & Net In-Hand Realization' : isMr ? 'तपशीलवार निव्वळ उत्पन्न विश्लेषण' : 'विस्तृत शुद्ध आय विवरण',
    rank: isEn ? 'Rank' : isMr ? 'रँक' : 'रैंक',
    mandi: isEn ? 'Market Yard' : isMr ? 'बाजार समिती' : 'मंडी',
    distance: isEn ? 'One-Way Distance' : isMr ? 'एकतर्फी अंतर' : 'एकतरफा दूरी',
    grossPrice: isEn ? 'Quoted Modal Price' : isMr ? 'सकल भाव' : 'सकल भाव',
    fuelOverhead: isEn ? 'Round-Trip Fuel' : isMr ? 'येण्या-जाण्याचे डिझेल' : 'आने-जाने का डीजल',
    feesLabor: isEn ? 'Cess + Labor' : isMr ? 'सेस + हमाली' : 'टैक्स + मजदूरी',
    effectiveRate: isEn ? 'Effective Net Rate' : isMr ? 'प्रत्यक्ष निव्वळ भाव' : 'वास्तविक शुद्ध भाव',
    totalNet: isEn ? 'Total In-Hand Net' : isMr ? 'एकूण हातात नफा' : 'कुल हाथ में शुद्ध लाभ',
    verdict: isEn ? 'Recommendation' : isMr ? 'शिफारस' : 'सिफारिश',
    bestOption: isEn ? 'HIGHEST NET PROFIT' : isMr ? 'उत्तम निव्वळ नफा' : 'सर्वोत्तम शुद्ध आय',
    nearestBadge: isEn ? 'Nearest Mandi' : isMr ? 'जवळची बाजार समिती' : 'नजदीकी मंडी',
    alternate: isEn ? 'VIABLE ALTERNATIVE' : isMr ? 'योग्य पर्याय' : 'वैकल्पिक',
    excessOverhead: isEn ? 'AVOID: OVERHEAD' : isMr ? 'जास्त खर्च टाळा' : 'अत्यधिक खर्च से बचें',

    calculatorTitle: isEn ? 'Crop Cultivation & Break-Even Calculator' : isMr ? 'लागत व निव्वळ नफा गणक' : 'फसल लागत व शुद्ध लाभ कैलकुलेटर',
    calculatorDesc: isEn ? 'Enter your cultivation cost and yield to compute break-even selling price:' : isMr ? 'आपला उत्पादन खर्च व उत्पादन टाकून किमान फायदेशीर भाव काढा:' : 'खेती की लागत व पैदावार डालकर न्यूनतम लाभकारी भाव जानें:',
    crop: isEn ? 'Crop' : isMr ? 'पीक' : 'फसल',
    area: isEn ? 'Farm Area (Acres)' : isMr ? 'जमीन क्षेत्र (एकर)' : 'क्षेत्रफल (एकड़)',
    costPerAcre: isEn ? 'Cost of Cultivation (₹/Acre)' : isMr ? 'लागत खर्च (₹/एकर)' : 'लागत प्रति एकड़ (₹)',
    yieldPerAcre: isEn ? 'Expected Yield (Quintal/Acre)' : isMr ? 'अपेक्षित उत्पादन (क्विंटल/एकर)' : 'अनुमानित उपज (क्विंटल/एकड़)',
    calcProduction: isEn ? 'Total Production' : isMr ? 'एकूण उत्पादन' : 'कुल उत्पादन',
    calcCost: isEn ? 'Total Cost' : isMr ? 'एकूण खर्च' : 'कुल लागत',
    calcBreakEven: isEn ? 'Break-Even Price' : isMr ? 'ना-नफा ना-तोटा भाव' : 'ब्रेक-इवेन भाव',
    calcRevenue: isEn ? 'Expected Revenue' : isMr ? 'अपेक्षित महसूल' : 'अपेक्षित कुल आय',
    calcProfit: isEn ? 'Estimated Net Profit' : isMr ? 'अंदाजित निव्वळ नफा' : 'अनुमानित शुद्ध लाभ',
    quintals: isEn ? 'quintals' : isMr ? 'क्विंटल' : 'क्विंटल'
  };

  // W6 Profit Calculations
  const totalProduction = Math.round(areaAcres * expectedYieldPerAcre);
  const totalCost = Math.round(areaAcres * costOfCultivationPerAcre);
  const breakEvenPrice = totalProduction > 0 ? Math.round(totalCost / totalProduction) : 0;

  const topNetMandi = evaluatedMandis[0];
  const activeMarketPrice = topNetMandi?.effectiveRate || 2180;
  const totalRevenue = totalProduction * activeMarketPrice;
  const netProfit = totalRevenue - totalCost;

  return (
    <div className="min-h-screen bg-[#f4f6f4] text-gray-900 pb-16">
      
      {/* Top Header */}
      <div className="bg-[#165b33] text-white px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-emerald-200 mb-1">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              AgriAgent-OS: Autonomous Mandi Arbitrage
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {strings.badge}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
              {strings.cropRadius}
            </p>
          </div>

          {/* Location pill & trigger */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 transition-all cursor-pointer text-left"
              title="Change Farm Location"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span suppressHydrationWarning>{location.village}, {location.district}</span>
              <span className="text-[10px] text-emerald-200 underline ml-1">Change</span>
            </button>
            <button
              onClick={() => detectGPS()}
              disabled={isLocating}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-[#165b33] font-bold text-xs hover:bg-emerald-50 transition-all shadow-xs disabled:opacity-60 cursor-pointer"
            >
              <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'GPS...' : 'Update GPS'}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Crop Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['Onion', 'Wheat', 'Soybean', 'Cotton', 'Tomato', 'Potato'].map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCropName(crop)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                selectedCropName === crop
                  ? 'bg-[#165b33] text-white shadow-xs'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        {/* SECTION 1: VEHICLE LOGISTICS CONTROLS & DIESEL CONFIG */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#165b33]" />
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Vehicle Fleet & Logistics Parameters
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Round-trip fuel overhead computed dynamically
            </span>
          </div>

          {/* Vehicle Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {VEHICLE_FLEET.map((v) => (
              <button
                key={v.id}
                onClick={() => setVehicleId(v.id)}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  vehicleId === v.id
                    ? 'border-[#165b33] bg-[#f0f6f2] shadow-xs'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-bold text-gray-900">{v.name}</div>
                <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">{v.mileageKmPerL} km/L</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Cap: ~{v.maxPayloadQtl} qtl</div>
              </button>
            ))}
          </div>

          {/* Inputs Row: Diesel, Weight, Labor, APMC Cess */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <label className="text-gray-500 block text-[11px] font-semibold mb-1 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-600" />
                Diesel Price (₹/L)
              </label>
              <input
                type="number"
                step="0.5"
                value={dieselPrice}
                onChange={(e) => setDieselPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-gray-300 font-bold px-3 py-1.5 rounded-xl text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <label className="text-gray-500 block text-[11px] font-semibold mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-blue-600" />
                Produce Load (Quintals)
              </label>
              <input
                type="number"
                step="1.0"
                value={loadQuintals}
                onChange={(e) => setLoadQuintals(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-gray-300 font-bold px-3 py-1.5 rounded-xl text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <label className="text-gray-500 block text-[11px] font-semibold mb-1 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                Loading Fee (₹/qtl)
              </label>
              <input
                type="number"
                step="5.0"
                value={laborFeePerQtl}
                onChange={(e) => setLaborFeePerQtl(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-gray-300 font-bold px-3 py-1.5 rounded-xl text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <label className="text-gray-500 block text-[11px] font-semibold mb-1 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-purple-600" />
                APMC Cess (%)
              </label>
              <input
                type="number"
                step="0.05"
                value={apmcCessPct}
                onChange={(e) => setApmcCessPct(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-gray-300 font-bold px-3 py-1.5 rounded-xl text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: TOP MANDI RECOMMENDATIONS */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Top Mandi Realization for {loadQuintals} Quintals of {selectedCropName}
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                {strings.deductionSummary}
              </span>
            </div>

            {evaluatedMandis.slice(0, 4).map((item, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;

              return (
                <div
                  key={item.mandi.id}
                  className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-all ${
                    isFirst
                      ? 'border-[#165b33] bg-[#f9faf9] shadow-xs'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">
                        {idx + 1}. {item.mandi.name}
                      </h3>
                      {isFirst ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-[#165b33]">
                          ✓ {strings.bestOption}
                        </span>
                      ) : isSecond ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {strings.alternate}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          {strings.excessOverhead}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      {item.distanceKm} km one-way · Quoted Rate: ₹{item.grossPrice}/qtl · Fuel: ₹{item.fuelCost} · Cess+Labor: ₹{item.cessCost + item.handlingCost}
                    </p>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <div className="text-xl sm:text-2xl font-black text-emerald-800">
                      ₹{item.netEarnings.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      Net: ₹{item.effectiveRate}/qtl ({strings.netIncomeLabel})
                    </div>
                  </div>
                </div>
              );
            })}

            <p className="text-[11px] sm:text-xs text-gray-500 pt-2">
              {strings.sampleDisclaimer}
            </p>
          </div>
        </div>

        {/* SECTION 3: COMPARATIVE BREAKDOWN TABLE */}
        <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#165b33]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {strings.rankingTitle}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f9faf9] text-gray-600 uppercase text-[11px] font-bold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-3.5">{strings.rank}</th>
                  <th className="p-3.5">{strings.mandi}</th>
                  <th className="p-3.5">{strings.distance}</th>
                  <th className="p-3.5">{strings.grossPrice}</th>
                  <th className="p-3.5">{strings.fuelOverhead}</th>
                  <th className="p-3.5">{strings.feesLabor}</th>
                  <th className="p-3.5 text-[#165b33] font-bold">{strings.effectiveRate}</th>
                  <th className="p-3.5 text-right font-bold text-emerald-900">{strings.totalNet}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {evaluatedMandis.map((item, idx) => (
                  <tr
                    key={item.mandi.id}
                    className={`hover:bg-gray-50/60 transition-colors ${
                      idx === 0 ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <td className="p-3.5 font-black">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-[#165b33] text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-gray-900">
                      <div>{item.mandi.name}</div>
                      <div className="text-[11px] text-gray-500 font-normal">{item.mandi.district}, {item.mandi.state}</div>
                    </td>
                    <td className="p-3.5 text-gray-600">{item.distanceKm} km</td>
                    <td className="p-3.5 font-semibold text-gray-900">₹{item.grossPrice.toLocaleString('en-IN')}/q</td>
                    <td className="p-3.5 text-rose-600">-₹{item.fuelCost}</td>
                    <td className="p-3.5 text-rose-600">-₹{item.cessCost + item.handlingCost}</td>
                    <td className="p-3.5 font-extrabold text-[#165b33] text-base">
                      ₹{item.effectiveRate}/q
                    </td>
                    <td className="p-3.5 text-right font-extrabold text-emerald-950">
                      ₹{item.netEarnings.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: PROFIT & BREAK-EVEN CALCULATOR */}
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#165b33]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {strings.calculatorTitle}
            </h2>
          </div>
          <p className="text-xs text-gray-500 -mt-3">
            {strings.calculatorDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">{strings.crop}</label>
              <select
                value={selectedCropName}
                onChange={(e) => setSelectedCropName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#165b33]"
              >
                <option value="Onion">{isEn ? 'Onion' : isMr ? 'कांदा' : 'प्याज'}</option>
                <option value="Wheat">{isEn ? 'Wheat' : isMr ? 'गहू' : 'गेंहू'}</option>
                <option value="Soybean">{isEn ? 'Soybean' : isMr ? 'सोयाबीन' : 'सोयाबीन'}</option>
                <option value="Cotton">{isEn ? 'Cotton' : isMr ? 'कापूस' : 'कपास'}</option>
                <option value="Tomato">{isEn ? 'Tomato' : isMr ? 'टोमॅटो' : 'टमाटर'}</option>
                <option value="Potato">{isEn ? 'Potato' : isMr ? 'बटाटा' : 'आलू'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">{strings.area}</label>
              <input
                type="number"
                step="0.5"
                value={areaAcres}
                onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">{strings.costPerAcre}</label>
              <input
                type="number"
                step="500"
                value={costOfCultivationPerAcre}
                onChange={(e) => setCostOfCultivationPerAcre(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">{strings.yieldPerAcre}</label>
              <input
                type="number"
                step="1"
                value={expectedYieldPerAcre}
                onChange={(e) => setExpectedYieldPerAcre(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#165b33]"
              />
            </div>
          </div>

          {/* Calculator Output KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] text-gray-500 font-medium block">{strings.calcProduction}</span>
              <span className="text-base sm:text-lg font-black text-gray-900 mt-0.5 block">{totalProduction} {strings.quintals}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] text-gray-500 font-medium block">{strings.calcCost}</span>
              <span className="text-base sm:text-lg font-black text-rose-600 mt-0.5 block">₹{totalCost.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] text-gray-500 font-medium block">{strings.calcBreakEven}</span>
              <span className="text-base sm:text-lg font-black text-amber-700 mt-0.5 block">₹{breakEvenPrice.toLocaleString('en-IN')}/q</span>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] text-gray-500 font-medium block">{strings.calcRevenue}</span>
              <span className="text-base sm:text-lg font-black text-blue-700 mt-0.5 block">₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-emerald-800 font-bold block">{strings.calcProfit}</span>
              <span className={`text-base sm:text-lg font-black mt-0.5 block ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                ₹{netProfit.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
