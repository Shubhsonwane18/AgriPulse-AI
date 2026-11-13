'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Compass,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Layers,
  Search,
  RefreshCw,
  Landmark,
  ShieldCheck,
  Building2,
  Navigation,
  Droplets,
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';
import { UserLocationDetails } from '@/lib/location';

export interface FarmMapLocatorProps {
  initialLat?: number;
  initialLon?: number;
  onConfirmLocation?: (location: UserLocationDetails) => void;
  compact?: boolean;
}

export function FarmMapLocator({
  initialLat = 18.7120, // Default: Somanwadi / Ambejogai regional coordinates
  initialLon = 76.3450,
  onConfirmLocation,
  compact = false
}: FarmMapLocatorProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: initialLat,
    lon: initialLon
  });
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locking' | 'locked' | 'manual' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Stand under open sky for satellite GNSS lock');
  const [resolvedVillage, setResolvedVillage] = useState<any>(null);
  const [infrastructure, setInfrastructure] = useState<any>(null);
  const [nearestMandis, setNearestMandis] = useState<any[]>([]);
  const [isResolving, setIsResolving] = useState<boolean>(false);

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Map Tile Layer Style (Default: Google Hybrid for live roads, rivers, village names)
  const [activeLayer, setActiveLayer] = useState<'google_hybrid' | 'esri_satellite' | 'osm_roads'>('google_hybrid');

  const BACKEND_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

  // 1. Resolve coordinates via Backend LGD Spatial Boundary & Infrastructure Engine
  const resolveBackendSpatial = useCallback(async (lat: number, lon: number, acc?: number | null) => {
    setIsResolving(true);
    try {
      const spatialUrl = `${BACKEND_URL}/api/v1/spatial/resolve?lat=${lat}&lon=${lon}${acc ? `&accuracy=${acc}` : ''}`;
      const res = await fetch(spatialUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          setResolvedVillage(data.village);
          setInfrastructure(data.infrastructure || null);
          setNearestMandis(data.nearest_mandis || []);
        }
      }
    } catch (err) {
      console.warn('Spatial resolution fallback:', err);
    } finally {
      setIsResolving(false);
    }
  }, [BACKEND_URL]);

  // Initial resolve on mount
  useEffect(() => {
    resolveBackendSpatial(coords.lat, coords.lon, accuracy);
  }, []);

  // 2. Initialize Leaflet Map with True Hybrid Satellite Layer (Real-Time Village, Road, River Labels)
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Fix Leaflet marker icons in bundlers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Custom High-Contrast Farm Marker Icon
      const farmIcon = L.divIcon({
        className: 'custom-farm-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">
            <div style="position: absolute; width: 40px; height: 40px; background: rgba(22, 91, 51, 0.35); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 32px; height: 32px; background: #165b33; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 14px rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: bold;">
              📍
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const map = L.map(mapContainerRef.current, {
        center: [coords.lat, coords.lon],
        zoom: 16, // Field-level view showing roads, plots, and rivers
        zoomControl: true,
      });

      // Layer: Google Hybrid (Satellite + High-Resolution Vector Roads, Rivers, Canals, Village Names)
      const baseLayer = L.tileLayer(
        'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        {
          attribution: '&copy; Google Maps &mdash; Satellite Hybrid (Villages, Roads & Rivers)',
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }
      ).addTo(map);

      tileLayerRef.current = baseLayer;

      // Draggable Farm Marker
      const marker = L.marker([coords.lat, coords.lon], {
        draggable: true,
        icon: farmIcon,
      }).addTo(map);

      // Accuracy Circle
      const circle = L.circle([coords.lat, coords.lon], {
        radius: accuracy || 25,
        color: '#165b33',
        fillColor: '#86efac',
        fillOpacity: 0.25,
        weight: 1.5,
      }).addTo(map);

      // Allow farmer to drag pin directly onto farm boundary / borewell
      marker.on('dragend', (e: any) => {
        const pos = e.target.getLatLng();
        const newLat = Number(pos.lat.toFixed(6));
        const newLon = Number(pos.lng.toFixed(6));
        setCoords({ lat: newLat, lon: newLon });
        circle.setLatLng([newLat, newLon]);
        setGpsStatus('manual');
        setStatusMessage(`शेतावर पिन सेट केली: ${newLat}, ${newLon}`);
        resolveBackendSpatial(newLat, newLon, null);
      });

      // Map Click to reposition pin
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        const newLat = Number(lat.toFixed(6));
        const newLon = Number(lng.toFixed(6));
        marker.setLatLng([newLat, newLon]);
        circle.setLatLng([newLat, newLon]);
        setCoords({ lat: newLat, lon: newLon });
        setGpsStatus('manual');
        setStatusMessage(`शेतावर पिन ठेवली: ${newLat}, ${newLon}`);
        resolveBackendSpatial(newLat, newLon, null);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      circleRef.current = circle;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    initMap();

    return () => {
      isMounted = false;
      if (watchIdRef.current !== null && typeof navigator !== 'undefined') {
        navigator.geolocation?.clearWatch(watchIdRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 3. Switch Map Layer (Google Hybrid vs ESRI Satellite vs OpenStreetMap)
  const switchMapLayer = async (layerType: 'google_hybrid' | 'esri_satellite' | 'osm_roads') => {
    setActiveLayer(layerType);
    if (!mapInstanceRef.current) return;
    const L = (await import('leaflet')).default;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let newTileLayer: any;
    if (layerType === 'google_hybrid') {
      newTileLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps &mdash; Satellite Hybrid (Villages, Roads & Rivers)',
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      });
    } else if (layerType === 'esri_satellite') {
      newTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; World Imagery',
        maxZoom: 19
      });
    } else {
      newTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors &mdash; Roads & Rivers',
        maxZoom: 19
      });
    }

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  };

  // 4. Live Search for ANY Village, River, Road, or Town across India
  const handleLiveSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=5`;
      const res = await fetch(url, { headers: { 'User-Agent': 'AgriPulse-PlotLocator/2.0' } });
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const top = results[0];
          const lat = Number(parseFloat(top.lat).toFixed(6));
          const lon = Number(parseFloat(top.lon).toFixed(6));

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lon], 16, { duration: 1.2 });
          }

          setCoords({ lat, lon });
          if (markerRef.current) markerRef.current.setLatLng([lat, lon]);
          if (circleRef.current) circleRef.current.setLatLng([lat, lon]);

          setGpsStatus('manual');
          setStatusMessage(`स्थान सापडले: ${top.display_name.split(',')[0]}`);
          resolveBackendSpatial(lat, lon, null);
        } else {
          setStatusMessage('गाव किंवा रस्ता सापडला नाही. कृपया स्पेलिंग तपासा.');
        }
      }
    } catch (err) {
      console.warn('Live search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // 5. Hardware GPS High-Precision Watcher (Progressive Filter)
  const startHighPrecisionWatch = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsStatus('error');
      setStatusMessage('Geolocation is not supported by your browser.');
      return;
    }

    setGpsStatus('locking');
    setStatusMessage('सॅटेलाइट GPS सिग्नल शोधत आहे... उघड्या आकाशाखाली उभे राहा');

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    let lockCount = 0;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const acc = position.coords.accuracy;

        setAccuracy(acc);
        lockCount++;

        // Update map & marker in real time
        if (markerRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([lat, lon]);
          if (circleRef.current) {
            circleRef.current.setLatLng([lat, lon]);
            circleRef.current.setRadius(acc);
          }
          if (lockCount <= 2) {
            mapInstanceRef.current.setView([lat, lon], 17);
          }
        }

        setCoords({ lat: Number(lat.toFixed(6)), lon: Number(lon.toFixed(6)) });

        if (acc <= 15) {
          setGpsStatus('locked');
          setStatusMessage(`अचूक GPS लॉक झाले! (±${Math.round(acc)}m) आवश्यकतेनुसार पिन शेतावर सरकवा.`);
          resolveBackendSpatial(lat, lon, acc);
        } else {
          setGpsStatus('locking');
          setStatusMessage(`सॅटेलाइट सिग्नल लॉक करत आहे... (अचूकता: ±${Math.round(acc)}m)`);
          if (lockCount >= 3) {
            resolveBackendSpatial(lat, lon, acc);
          }
        }
      },
      (err) => {
        console.warn('GPS Watch error:', err);
        setGpsStatus('error');
        setStatusMessage(
          err.code === 1
            ? 'लोकेशन परवानगी नाकारली. कृपया परवानगी द्या किंवा नकाशावर थेट पिन ठेवा.'
            : 'कमकुवत सिग्नल. आपण थेट नकाशावर पिन ठेवू शकता.'
        );
      },
      geoOptions
    );
  };

  // Confirm Location Handler
  const handleConfirm = () => {
    if (!onConfirmLocation) return;
    const villageName = resolvedVillage?.village_name_local || resolvedVillage?.village_name || 'My Farm';
    const subdistrict = resolvedVillage?.subdistrict_name || 'Ambejogai';
    const district = resolvedVillage?.district_name || 'Beed';
    const state = resolvedVillage?.state_name || 'Maharashtra';
    const pincode = resolvedVillage?.pincode || '';

    const payload: UserLocationDetails = {
      latitude: coords.lat,
      longitude: coords.lon,
      village: villageName,
      taluka: subdistrict,
      district: district,
      state: state,
      country: 'India',
      displayName: `${villageName}, ${subdistrict} (${district})`,
      source: accuracy && accuracy <= 15 ? 'gps' : 'lgd',
      lgdCode: resolvedVillage?.village_code,
      gramPanchayat: resolvedVillage?.gram_panchayat,
      pincode: pincode
    };

    onConfirmLocation(payload);
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Header */}
      <div className="p-3 bg-gray-50/90 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#165b33] text-white flex items-center justify-center font-bold shadow-xs">
            🛰️
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 leading-tight">
              High-Precision Satellite Plot Locator
            </h3>
            <p className="text-[11px] text-gray-500">
              रिअल-टाईम उपग्रह नकाशावर सर्व गावे, रस्ते व जलस्रोत थेट पहा
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Map Layer Mode Switcher */}
          <div className="flex items-center bg-gray-200/80 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              type="button"
              onClick={() => switchMapLayer('google_hybrid')}
              className={`px-2 py-1 rounded-lg transition-all ${
                activeLayer === 'google_hybrid'
                  ? 'bg-[#165b33] text-white shadow-xs'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              उपग्रह + रस्ते
            </button>
            <button
              type="button"
              onClick={() => switchMapLayer('esri_satellite')}
              className={`px-2 py-1 rounded-lg transition-all ${
                activeLayer === 'esri_satellite'
                  ? 'bg-[#165b33] text-white shadow-xs'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              केवळ उपग्रह
            </button>
            <button
              type="button"
              onClick={() => switchMapLayer('osm_roads')}
              className={`px-2 py-1 rounded-lg transition-all ${
                activeLayer === 'osm_roads'
                  ? 'bg-[#165b33] text-white shadow-xs'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              रस्ते व नद्या
            </button>
          </div>

          {/* GPS Hardware Lock Button */}
          <button
            type="button"
            onClick={startHighPrecisionWatch}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              gpsStatus === 'locking'
                ? 'bg-amber-500 text-white animate-pulse'
                : gpsStatus === 'locked'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#165b33] hover:bg-[#124828] text-white'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${gpsStatus === 'locking' ? 'animate-spin' : ''}`} />
            <span>
              {gpsStatus === 'locking'
                ? 'Locking GPS...'
                : gpsStatus === 'locked'
                ? 'GPS Locked ✓'
                : 'Start GPS'}
            </span>
          </button>
        </div>
      </div>

      {/* Universal Search Bar for ANY Village, River, Road, or Taluka */}
      <form onSubmit={handleLiveSearch} className="p-2.5 bg-emerald-50/50 border-b border-emerald-100 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="कोणतेही गाव, नदी, रस्ता किंवा तालुका शोधा (उदा. अंबाजोगाई, मांजरा नदी, बर्दापूर, NH548D)..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#165b33] shadow-2xs font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-3.5 py-1.5 bg-[#165b33] hover:bg-[#124828] text-white font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1 disabled:opacity-60 transition-all"
        >
          {isSearching ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
          <span>शोधा</span>
        </button>
      </form>

      {/* The Leaflet Map Canvas */}
      <div className="relative w-full" style={{ height: compact ? '320px' : '420px' }}>
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Accuracy Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1.5">
          <div className="bg-black/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${accuracy && accuracy <= 15 ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span>
              {accuracy !== null ? `Accuracy: ±${Math.round(accuracy)}m` : 'Live Satellite (20x)'}
            </span>
          </div>
        </div>

        {/* Actionable Instruction Overlay on Map Canvas */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 bg-white/95 backdrop-blur-xs border border-gray-300 px-3 py-2 rounded-xl text-[11px] text-gray-800 shadow-md flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[#165b33] text-sm">📍</span>
            <span className="truncate">
              <b>शेत निवडण्यासाठी:</b> नकाशा झूम करा आणि हिरवी पिन (📍) थेट आपल्या <b>शेतावर किंवा बोअरवेलवर ड्रॅग करा</b>.
            </span>
          </div>
          <span className="font-mono text-gray-600 shrink-0 font-bold text-[11px]">
            {coords.lat.toFixed(4)}°, {coords.lon.toFixed(4)}°
          </span>
        </div>
      </div>

      {/* Practical Farmer-Centric Help Box */}
      <div className="px-3.5 py-2.5 bg-emerald-50/70 border-b border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-950">
        <Info className="w-4 h-4 text-[#165b33] shrink-0 mt-0.5" />
        <div className="space-y-1 w-full">
          <span className="font-bold block text-[11px] text-[#165b33]">
            💡 आपले शेत अचूक शोधण्यासाठी सोप्या पायऱ्या (How to Pinpoint Your Farm):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-gray-700">
            <div className="flex items-start gap-1">
              <span className="font-bold text-[#165b33]">१.</span>
              <span><b>नकाशा झूम करा (+):</b> शेतातील झाडे, विहीर, रस्ता व बांध स्पष्ट दिसेपर्यंत मोठे करा.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-bold text-[#165b33]">२.</span>
              <span><b>खुणा ओळखा:</b> जवळचा डांबरी रस्ता, पाणंद रस्ता किंवा ओढा पाहून शेताची दिशा ओळखा.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-bold text-[#165b33]">३.</span>
              <span><b>पिन ठेवा:</b> हिरवी पिन (📍) थेट आपल्या शेतावर सरकवा किंवा शेतावर क्लिक करा.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Geolocation & Land Infrastructure Card */}
      <div className="p-3.5 bg-white space-y-2.5 text-xs">
        {/* Status Message */}
        <div
          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-medium ${
            gpsStatus === 'locked'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : gpsStatus === 'locking'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : gpsStatus === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {gpsStatus === 'locked' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : gpsStatus === 'locking' ? (
              <RefreshCw className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-[#165b33] shrink-0" />
            )}
            <span>{statusMessage}</span>
          </div>

          {isResolving && (
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border text-gray-500 animate-pulse font-bold">
              Snapping LGD...
            </span>
          )}
        </div>

        {/* Real-Time Infrastructure & Settlement Details */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#165b33] uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5" />
              निवडलेल्या शेतीचे रिअल-टाईम भौगोलिक तपशील (Land Geolocation Info)
            </span>
            {resolvedVillage?.village_code && (
              <span className="font-mono text-[11px] bg-emerald-100 text-[#165b33] px-2 py-0.5 rounded font-bold border border-emerald-200">
                LGD: #{resolvedVillage.village_code}
              </span>
            )}
          </div>

          {/* Grid of Village, Road, River & Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Village & Panchayat */}
            <div className="bg-white p-2 rounded-lg border border-emerald-100 space-y-0.5">
              <span className="text-[10px] text-gray-500 font-bold block">🏡 गाव व तालुका (Village & Taluka):</span>
              <span className="font-extrabold text-gray-900 block text-xs">
                {resolvedVillage?.village_name_local || resolvedVillage?.village_name || 'गाव निश्चित करत आहे...'}
                {resolvedVillage?.subdistrict_name ? ` (ता. ${resolvedVillage.subdistrict_name})` : ''}
              </span>
              <span className="text-[10px] text-gray-600">
                जिल्हा: {resolvedVillage?.district_name || 'बीड'} | पिनकोड: {resolvedVillage?.pincode || '431517'}
              </span>
            </div>

            {/* Nearest Road / Field Approach Road */}
            <div className="bg-white p-2 rounded-lg border border-emerald-100 space-y-0.5">
              <span className="text-[10px] text-gray-500 font-bold block">🛣️ जवळचा रस्ता (Nearest Road / Track):</span>
              <span className="font-extrabold text-gray-900 block text-xs">
                {infrastructure?.road || 'शेताचा पाणंद रस्ता / ग्रामीण रस्ता'}
              </span>
              <span className="text-[10px] text-gray-600">
                {infrastructure?.display_name ? infrastructure.display_name.split(',').slice(0, 2).join(',') : 'शेत रस्ता जोडणी'}
              </span>
            </div>

            {/* River Basin / Waterbody */}
            <div className="bg-white p-2 rounded-lg border border-emerald-100 space-y-0.5">
              <span className="text-[10px] text-gray-500 font-bold block">💧 जलस्रोत / नदी (Water Source / River):</span>
              <span className="font-extrabold text-emerald-900 block text-xs flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-600 shrink-0" />
                <span>{infrastructure?.waterbody || 'स्थानिक नदी खोरे / ओढा'}</span>
              </span>
              <span className="text-[10px] text-gray-600">
                भूजल व शेती सिंचन क्षेत्र
              </span>
            </div>

            {/* GPS Coordinates */}
            <div className="bg-white p-2 rounded-lg border border-emerald-100 space-y-0.5">
              <span className="text-[10px] text-gray-500 font-bold block">🧭 अचूक GPS पिनपॉइंट:</span>
              <span className="font-mono font-extrabold text-gray-900 block text-xs">
                {coords.lat.toFixed(6)}° N, {coords.lon.toFixed(6)}° E
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {accuracy ? `सॅटेलाइट अचूकता: ±${Math.round(accuracy)} मीटर` : 'उपग्रह पिन निश्चित'}
              </span>
            </div>
          </div>

          {/* Nearest Multi-Tier Mandis from Universal Registry */}
          {nearestMandis.length > 0 && (
            <div className="pt-2 border-t border-emerald-200/80 mt-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-gray-700 block">
                  🏢 जवळच्या सर्व बाजारपेठा (Universal Multi-Tier Mandis):
                </span>
                <span className="text-[9px] bg-emerald-100 text-[#165b33] font-bold px-1.5 py-0.5 rounded">
                  APMC + उपबाजार + आठवडी बाजार
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {nearestMandis.map((m) => (
                  <div key={m.id || m.name} className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <span className="font-extrabold text-gray-900 block leading-tight truncate">
                          {m.name_local || m.name}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            m.tier === 'PRINCIPAL_APMC'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : m.tier === 'SUB_YARD'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : m.tier === 'GRAM_HAAT'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            {m.tier === 'PRINCIPAL_APMC' ? 'मुख्य APMC' : m.tier === 'SUB_YARD' ? 'तालुका उपबाजार' : m.tier === 'GRAM_HAAT' ? 'आठवडी बाजार' : 'FPO केंद्र'}
                          </span>
                          <span className="text-[9px] text-gray-500 font-mono">
                            {m.is_open_today ? '🟢 आज सुरू' : '🟡 आज बंद'}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[#165b33] font-black text-xs shrink-0 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {m.distance_km} km
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-gray-100 text-[10px]">
                      <span className="text-gray-600">
                        दर: <b className="text-gray-900 font-bold">₹{m.modal_price}</b>/Qtl
                        {m.variety ? ` (${m.variety})` : ''}
                      </span>
                      <span className="text-[9px] text-emerald-700 font-medium">
                        {m.price_source || 'e-NAM / MSAMB'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Button */}
        {onConfirmLocation && (
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3 rounded-xl bg-[#165b33] hover:bg-[#124828] text-white font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Farm Location · हे शेताचे स्थान निश्चित करा</span>
          </button>
        )}
      </div>
    </div>
  );
}
