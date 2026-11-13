'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthContext';
import { useLanguage } from '@/components/LanguageContext';
import { Locale } from '@/lib/i18n';
import {
  Sprout,
  Globe,
  MapPin,
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Layers,
  Sparkles
} from 'lucide-react';
import { MOCK_COMMODITIES } from '@shared/index';
import { detectRealUserLocation } from '@/lib/location';
import {
  INDIA_REGIONS,
  getDistrictsForState,
  getTalukasForDistrict,
  getVillagesForTaluka,
  resolveExactFarmLocation
} from '@/lib/indiaRegions';
import { FarmMapLocator } from '@/components/FarmMapLocator';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, refreshProfile, isDemo, updateDemoProfile } = useAuth();
  const { languages, setLocale, locale } = useLanguage();

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  const strings = {
    step: isEn ? 'Step' : isMr ? 'टप्पा' : 'कदम',
    of: isEn ? 'of' : isMr ? 'पैकी' : 'में से',
    step1Title: isEn ? 'Language Selection' : isMr ? 'मातृभाषा निवड' : 'मातृभाषा चयन',
    step2Title: isEn ? 'Farm Location' : isMr ? 'शेतीचे स्थान' : 'स्थान व जिला',
    step3Title: isEn ? 'Crops & Land' : isMr ? 'पिके व क्षेत्र' : 'खेत व फसलें',
    langHeading: isEn ? 'Select Your Preferred Language' : isMr ? 'आपली पसंतीची भाषा निवडा' : 'अपनी पसंदीदा भाषा चुनें',
    langSub: isEn
      ? 'KisanMitra will display mandi prices, forecasts, and answer queries in your chosen language.'
      : isMr
      ? 'किसानमित्र आपल्या निवडलेल्या भाषेत बोलेल आणि बाजारभाव दाखवेल.'
      : 'किसानमित्र आपकी चुनी हुई भाषा में बोलेगा, लिखेगा और मंडी भाव दिखाएगा।',
    locHeading: isEn ? 'Enter Your Farm / Mandi Region' : isMr ? 'आपल्या शेतीचे / बाजार समितीचे क्षेत्र' : 'अपना खेत / मंडी क्षेत्र दर्ज करें',
    locSub: isEn
      ? 'Used to compute transport freight, nearest mandi rankings, and local weather advisories.'
      : isMr
      ? 'जवळच्या बाजार समितीचे भाव व वाहतूक खर्च काढण्यासाठी आवश्यक.'
      : 'नजदीकी मंडी के भाव, परिवहन भाड़ा एवं मौसम चेतावनी के लिए आवश्यक।',
    gpsBtn: isEn ? 'Detect Current GPS Location' : isMr ? 'GPS द्वारे थेट स्थान मिळवा' : 'GPS स्थान प्राप्त करें',
    gpsDetecting: isEn ? 'Detecting location...' : isMr ? 'स्थान शोधत आहे...' : 'स्थान खोजा जा रहा है...',
    stateLabel: isEn ? 'State' : isMr ? 'राज्य' : 'राज्य',
    districtLabel: isEn ? 'District' : isMr ? 'जिल्हा' : 'जिला',
    talukaLabel: isEn ? 'Taluka / Tehsil' : isMr ? 'तालुका' : 'तहसील / तालुका',
    villageSelectLabel: isEn ? 'Key Villages in Taluka' : isMr ? 'तालुक्यातील प्रमुख गावे' : 'तहसील के प्रमुख गाँव',
    customVillageLabel: isEn ? 'Exact Village / Farm Locality' : isMr ? 'आपले गाव / वाडी / शेताचे ठिकाण' : 'सटीक गाँव / ढाणी / खेत का पता',
    coordinatesLabel: isEn ? 'Exact Farm GPS Pinpoint' : isMr ? 'शेताचे अचूक जीपीएस निर्देशांक' : 'खेत के सटीक जीपीएस निर्देशांक',
    villageLabel: isEn ? 'Village / Tehsil' : isMr ? 'गाव / तालुका' : 'गाँव / तहसील',
    cropsHeading: isEn ? 'Select Crops & Farm Size' : isMr ? 'पिके व शेतीचे क्षेत्र निवडा' : 'फसलें एवं खेत का रकबा',
    cropsSub: isEn
      ? 'Used for customized growth-stage fertilizer schedules and harvest advice.'
      : isMr
      ? 'खत वेळापत्रक व विक्री सल्ल्यासाठी आवश्यक.'
      : 'संतुलित खाद शेड्यूल व विक्रय सलाह के लिए आवश्यक।',
    landLabel: isEn ? 'Total Farm Land (Acres)' : isMr ? 'एकूण शेती क्षेत्र (एकर)' : 'कुल जमीन का रकबा (एकड़)',
    cropsLabel: isEn ? 'Select the crops you grow:' : isMr ? 'आपण घेत असलेली पिके निवडा:' : 'उगाई जाने वाली फसलें चुनें:',
    finishBtn: isEn ? 'Finish Setup & Open Dashboard' : isMr ? 'तयार! डॅशबोर्डवर जा' : 'सेटअप पूरा करें व डॅशबोर्ड खोलें',
    nextBtn: isEn ? 'Next Step' : isMr ? 'पुढील टप्पा' : 'अगला कदम',
    prevBtn: isEn ? 'Back' : isMr ? 'मागे' : 'पीछे'
  };

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLang, setSelectedLang] = useState<Locale>(locale || 'en');
  const [stateName, setStateName] = useState(profile?.state || 'Maharashtra');
  const [districtName, setDistrictName] = useState(profile?.district || 'Kolhapur');
  const [talukaName, setTalukaName] = useState('Karvir');
  const [villageName, setVillageName] = useState(profile?.village || 'Kasaba Bawada');
  const [landSize, setLandSize] = useState(profile?.land_size_acres || 2.5);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Onion']);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat?: number; lon?: number }>({ lat: 18.7120, lon: 76.3450 });
  const [coordSource, setCoordSource] = useState<string>('catalog_taluka');
  const [submitting, setSubmitting] = useState(false);
  const [locationInputMode, setLocationInputMode] = useState<'map' | 'dropdown'>('map');

  // Dynamic cascading lists based on selected State & District
  const availableDistricts = useMemo(() => getDistrictsForState(stateName), [stateName]);
  const availableTalukas = useMemo(() => getTalukasForDistrict(stateName, districtName), [stateName, districtName]);
  const availableVillages = useMemo(() => getVillagesForTaluka(stateName, districtName, talukaName), [stateName, districtName, talukaName]);

  // Synchronize farm GPS coordinates whenever State/District/Taluka/Village changes
  useEffect(() => {
    let active = true;
    resolveExactFarmLocation({
      state: stateName,
      district: districtName,
      taluka: talukaName,
      village: villageName
    }).then(res => {
      if (active) {
        setCoordinates({ lat: res.latitude, lon: res.longitude });
        setCoordSource(res.source);
      }
    });
    return () => { active = false; };
  }, [stateName, districtName, talukaName, villageName]);

  const toggleCrop = (cropName: string) => {
    setSelectedCrops(prev =>
      prev.includes(cropName)
        ? prev.filter(c => c !== cropName)
        : [...prev, cropName]
    );
  };

  const handleDetectGPS = async () => {
    setGpsLoading(true);
    setGpsStatusMessage(null);
    try {
      const loc = await detectRealUserLocation();
      setCoordinates({
        lat: loc.latitude,
        lon: loc.longitude,
      });
      if (loc.state) {
        setStateName(loc.state);
      }
      if (loc.district) {
        setDistrictName(loc.district);
      }
      if (loc.taluka) {
        setTalukaName(loc.taluka);
      }
      if (loc.village) {
        setVillageName(loc.village);
      }
      const label = `${loc.village || loc.taluka || loc.district}, ${loc.district} (${loc.state})`;
      setGpsStatusMessage(`✓ Exact Farm detected: ${label}`);
      setTimeout(() => setGpsStatusMessage(null), 6000);
    } catch (err) {
      console.warn('GPS error:', err);
      setGpsStatusMessage('Could not auto-detect location. Please choose from dropdowns.');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleFinishOnboarding = async () => {
    setSubmitting(true);
    try {
      const farmerFullVillage = villageName ? `${villageName} (${talukaName})` : talukaName;
      if (user) {
        if (isDemo) {
          updateDemoProfile({
            full_name: profile?.full_name || user.user_metadata?.full_name || (isEn ? 'Farmer' : 'किसान भाई'),
            phone: profile?.phone || user.user_metadata?.phone || undefined,
            language: selectedLang,
            state: stateName,
            district: districtName,
            village: farmerFullVillage,
            land_size_acres: landSize,
            latitude: coordinates.lat || 16.7050,
            longitude: coordinates.lon || 74.2433,
          });
        } else {
          // 1. Update Profile in Supabase
          await supabase.from('profiles').upsert({
            id: user.id,
            full_name: profile?.full_name || user.user_metadata?.full_name || (isEn ? 'Farmer' : 'किसान भाई'),
            phone: profile?.phone || user.user_metadata?.phone || null,
            language: selectedLang,
            state: stateName,
            district: districtName,
            village: farmerFullVillage,
            land_size_acres: landSize,
            latitude: coordinates.lat || 16.7050,
            longitude: coordinates.lon || 74.2433,
            updated_at: new Date().toISOString(),
          });

          await refreshProfile();
        }

        // Also save to local storage so the entire app immediately uses the new coordinates
        const farmLoc = {
          latitude: coordinates.lat || 16.7050,
          longitude: coordinates.lon || 74.2433,
          village: villageName || talukaName,
          taluka: talukaName,
          district: districtName,
          state: stateName,
          country: 'India',
          displayName: `${villageName ? villageName + ', ' : ''}${talukaName}, ${districtName}, ${stateName}`,
          source: 'search' as const,
        };
        try {
          localStorage.setItem('kisanmitra_farmer_location', JSON.stringify(farmLoc));
        } catch (_) {}
      }

      setLocale(selectedLang);
      router.push('/');
    } catch (err: any) {
      console.error('Onboarding save error:', err);
      router.push('/');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500">
            <span>{strings.step} {step} {strings.of} 3</span>
            <span className="text-[#165b33]">
              {step === 1 ? strings.step1Title : step === 2 ? strings.step2Title : strings.step3Title}
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div
              className="bg-[#165b33] h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: LANGUAGE SELECTION (Exact match to PDF Page 8) */}
        {step === 1 && (
          <div className="space-y-6 pt-2">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                KisanMitra
              </h1>
              <p className="text-base sm:text-lg font-bold text-gray-800">
                अपनी भाषा चुनें · Choose your language
              </p>
            </div>

            {/* 2-Column Grid matching PDF Page 8 */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { code: 'mr', name: 'मराठी' },
                { code: 'hi', name: 'हिन्दी' },
                { code: 'en', name: 'English' },
                { code: 'gu', name: 'ગુજરાતી' },
                { code: 'ta', name: 'தமிழ்' },
                { code: 'te', name: 'తెలుగు' },
                { code: 'kn', name: 'ಕನ್ನಡ' },
                { code: 'bn', name: 'বাংলা' },
                { code: 'pa', name: 'ਪੰਜਾਬੀ' },
                { code: 'ml', name: 'മലയാളം' },
              ].map((lang) => {
                const isSelected = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLang(lang.code as Locale)}
                    className={`h-14 px-4 rounded-2xl border text-base font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#165b33] border-[#165b33] text-white shadow-sm'
                        : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
                    }`}
                  >
                    <span>{lang.name}</span>
                    {isSelected && <span className="ml-1.5 font-black">✓</span>}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-gray-500 text-center font-medium">
              You can change the language any time in Settings.
            </p>

            <button
              onClick={() => { setLocale(selectedLang); setStep(2); }}
              className="w-full py-3.5 rounded-2xl bg-[#165b33] hover:bg-[#124828] text-white font-extrabold text-sm shadow-xs flex items-center justify-center gap-2 transition-all mt-4"
            >
              <span>{selectedLang === 'mr' ? 'पुढे · Next' : selectedLang === 'hi' ? 'आगे बढ़ें · Next' : 'Next'}</span>
            </button>
          </div>
        )}

        {/* STEP 2: LOCATION & DISTRICT */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#165b33] border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {strings.locHeading}
              </h2>
              <p className="text-xs text-gray-500">
                {strings.locSub}
              </p>
            </div>

            {/* Mode Switcher: High-Precision Satellite Pin vs Cascading Form */}
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => setLocationInputMode('map')}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  locationInputMode === 'map'
                    ? 'bg-[#165b33] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>🛰️</span>
                <span>{isMr ? 'उपग्रह नकाशा (Satellite Map)' : 'Satellite Plot Locator'}</span>
              </button>
              <button
                type="button"
                onClick={() => setLocationInputMode('dropdown')}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  locationInputMode === 'dropdown'
                    ? 'bg-[#165b33] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isMr ? 'यादीतून निवडा (List Mode)' : 'Cascading List'}</span>
              </button>
            </div>

            {locationInputMode === 'map' ? (
              <div className="space-y-4">
                <FarmMapLocator
                  initialLat={coordinates.lat || 18.7120}
                  initialLon={coordinates.lon || 76.3450}
                  compact={false}
                  onConfirmLocation={(loc) => {
                    setStateName(loc.state);
                    setDistrictName(loc.district);
                    setTalukaName(loc.taluka || '');
                    setVillageName(loc.village);
                    setCoordinates({ lat: loc.latitude, lon: loc.longitude });
                    setCoordSource('satellite_pin');
                    setGpsStatusMessage(`✓ Exact Farm confirmed: ${loc.village}, ${loc.taluka} (${loc.district})`);
                    setStep(3);
                  }}
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{strings.prevBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>{strings.nextBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* GPS Detection Button */}
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={gpsLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold hover:bg-gray-100 flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-75"
                >
                  <Compass className={`w-4 h-4 text-[#165b33] ${gpsLoading ? 'animate-spin' : ''}`} />
                  <span>{gpsLoading ? strings.gpsDetecting : strings.gpsBtn}</span>
                </button>

                {gpsStatusMessage && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-[#165b33] font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#165b33] shrink-0" />
                    <span>{gpsStatusMessage}</span>
                  </div>
                )}

                {/* Quick Farm Location Shortcuts */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-600 block">
                    {isMr ? '⚡ झटपट गाव निवडा / Quick Select:' : '⚡ Quick Select Farm / गाव निवडा:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Somanwadi', labelMr: '📍 सोमणवाडी (अंबाजोगाई, बीड)', dist: 'Beed', tal: 'Ambejogai', vill: 'Somanwadi', lat: 18.7120, lon: 76.3450 },
                      { name: 'Kolhapur', labelMr: '📍 करवीर (कोल्हापूर)', dist: 'Kolhapur', tal: 'Karvir', vill: 'Kasaba Bawada', lat: 16.7050, lon: 74.2433 },
                      { name: 'Lasalgaon', labelMr: '📍 लासलगाव (नाशिक)', dist: 'Nashik', tal: 'Niphad', vill: 'Lasalgaon', lat: 20.1472, lon: 74.2255 },
                      { name: 'Baramati', labelMr: '📍 बारामती (पुणे)', dist: 'Pune', tal: 'Baramati', vill: 'Baramati', lat: 18.1550, lon: 74.5800 }
                    ].map(item => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          setStateName('Maharashtra');
                          setDistrictName(item.dist);
                          setTalukaName(item.tal);
                          setVillageName(item.vill);
                          setCoordinates({ lat: item.lat, lon: item.lon });
                          setCoordSource('quick_preset');
                        }}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                          districtName === item.dist && talukaName === item.tal && villageName === item.vill
                            ? 'bg-[#165b33] text-white border-[#165b33] shadow-xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {item.labelMr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ISP Geolocation Notice for Desktop / Broadband */}
                <div className="p-2.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                  <span className="font-bold">💡 {isMr ? 'लोकेशन बाबत महत्त्वाची माहिती:' : 'Note on Device Geolocation:'}</span>{' '}
                  {isMr 
                    ? 'लॅपटॉप किंवा वाय-फाय (Wi-Fi) इंटरनेटवरून वापरताना ISP गेटवेमुळे वर्धा (Wardha) अथवा इतर शहर दिसू शकते. आपण वरील झटपट बटनाने किंवा खालील ड्रॉपडाउनमधून आपले अचूक गाव (उदा. बीड ➔ अंबाजोगाई ➔ सोमणवाडी) थेट निवडू शकता.'
                    : 'If browsing on a PC or Wi-Fi hotspot, internet provider routing may report the ISP gateway hub (e.g. Wardha). You can immediately select your exact village (e.g. Beed -> Ambejogai -> Somanwadi) using the buttons or dropdowns below.'}
                </div>

                {/* Cascading 1: State & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">{strings.stateLabel}</label>
                    <select
                      value={stateName}
                      onChange={(e) => {
                        const nextState = e.target.value;
                        setStateName(nextState);
                        const dists = getDistrictsForState(nextState);
                        if (dists.length > 0) {
                          setDistrictName(dists[0].name);
                          const tals = dists[0].talukas;
                          if (tals.length > 0) {
                            setTalukaName(tals[0].name);
                            const vills = getVillagesForTaluka(nextState, dists[0].name, tals[0].name);
                            setVillageName(vills.length > 0 ? vills[0] : '');
                          }
                        }
                      }}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33] font-medium"
                    >
                      {INDIA_REGIONS.map((st) => (
                        <option key={st.name} value={st.name}>
                          {isMr ? st.nameMr || st.name : isEn ? st.name : st.nameHi || st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">{strings.districtLabel}</label>
                    <select
                      value={districtName}
                      onChange={(e) => {
                        const nextDist = e.target.value;
                        setDistrictName(nextDist);
                        const tals = getTalukasForDistrict(stateName, nextDist);
                        if (tals.length > 0) {
                          setTalukaName(tals[0].name);
                          const vills = getVillagesForTaluka(stateName, nextDist, tals[0].name);
                          setVillageName(vills.length > 0 ? vills[0] : '');
                        }
                      }}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33] font-medium"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d.name} value={d.name}>
                          {isMr ? d.nameMr || d.name : isEn ? d.name : d.nameHi || d.name}
                        </option>
                      ))}
                      {districtName && !availableDistricts.some(d => d.name.toLowerCase() === districtName.toLowerCase()) && (
                        <option value={districtName}>{districtName}</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Cascading 2: Taluka / Tehsil */}
                <div className="text-xs">
                  <label className="block text-gray-700 font-semibold mb-1">{strings.talukaLabel}</label>
                  <select
                    value={talukaName}
                    onChange={(e) => {
                      const nextTal = e.target.value;
                      setTalukaName(nextTal);
                      const vills = getVillagesForTaluka(stateName, districtName, nextTal);
                      if (vills.length > 0) {
                        setVillageName(vills[0]);
                      }
                    }}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33] font-medium"
                  >
                    {availableTalukas.map((t) => (
                      <option key={t.name} value={t.name}>
                        {isMr ? t.nameMr || t.name : isEn ? t.name : t.nameHi || t.name}
                      </option>
                    ))}
                    {talukaName && !availableTalukas.some(t => t.name.toLowerCase() === talukaName.toLowerCase()) && (
                      <option value={talukaName}>{talukaName}</option>
                    )}
                  </select>
                </div>

                {/* Cascading 3: Village / Farm Locality */}
                <div className="space-y-2 text-xs">
                  <label className="block text-gray-700 font-semibold">{strings.customVillageLabel}</label>
                  
                  {/* Quick Pick Known Villages */}
                  {availableVillages.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-500 font-medium">{strings.villageSelectLabel}:</span>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-gray-50 border border-gray-200 rounded-xl">
                        {availableVillages.map((vill) => (
                          <button
                            key={vill}
                            type="button"
                            onClick={() => setVillageName(vill)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                              villageName === vill
                                ? 'bg-[#165b33] text-white shadow-2xs'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {vill}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exact Village / Farm Address Input */}
                  <input
                    type="text"
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                    placeholder={isEn ? "Enter village, wadi, or farm locality" : isMr ? "गाव, वाडी, किंवा वस्तीचे नाव प्रविष्ट करा" : "गाँव, ढाणी अथवा खेत का नाम दर्ज करें"}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#165b33]"
                  />
                </div>

                {/* Resolved GPS Coordinates Badge */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#165b33] flex items-center justify-center font-black">
                      📍
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block text-[11px]">{strings.coordinatesLabel}</span>
                      <span className="text-gray-600 font-mono text-[11px]">
                        {coordinates.lat?.toFixed(4) || '18.7120'}° N, {coordinates.lon?.toFixed(4) || '76.3450'}° E
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                    {coordSource === 'nominatim' ? 'Live Geocoded' : 'Taluka Centroid'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{strings.prevBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>{strings.nextBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: CROPS & LAND SIZE */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#165b33] border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <Sprout className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                {strings.cropsHeading}
              </h2>
              <p className="text-xs text-gray-500">
                {strings.cropsSub}
              </p>
            </div>

            <div className="text-xs">
              <label className="block text-gray-700 font-semibold mb-1">{strings.landLabel}</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={landSize}
                onChange={(e) => setLandSize(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-[#165b33]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold text-xs">{strings.cropsLabel}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MOCK_COMMODITIES.map((c) => {
                  const isSelected = selectedCrops.includes(c.name);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCrop(c.name)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-[#165b33] text-[#165b33] shadow-xs'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{isEn ? c.name : c.localNames?.mr || c.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#165b33]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{strings.prevBtn}</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleFinishOnboarding}
                className="w-2/3 py-2.5 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                <span>{submitting ? '...' : strings.finishBtn}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
