'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserLocationDetails,
  DEFAULT_FARMER_LOCATION,
  getSavedFarmerLocation,
  saveFarmerLocation,
  detectRealUserLocation
} from '@/lib/location';

interface LocationContextType {
  location: UserLocationDetails;
  setLocation: (loc: UserLocationDetails) => void;
  detectGPS: () => Promise<UserLocationDetails>;
  isLocating: boolean;
  locationModalOpen: boolean;
  setLocationModalOpen: (open: boolean) => void;
  locationStatusMsg: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<UserLocationDetails>(DEFAULT_FARMER_LOCATION);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationModalOpen, setLocationModalOpen] = useState<boolean>(false);
  const [locationStatusMsg, setLocationStatusMsg] = useState<string | null>(null);

  // Initialize from localStorage or auto-detect on client mount
  useEffect(() => {
    const saved = getSavedFarmerLocation();
    if (saved) {
      setLocationState(saved);
    }

    // Listen for custom location change events across components
    const handleLocationChange = (e: Event) => {
      const customEvent = e as CustomEvent<UserLocationDetails>;
      if (customEvent.detail) {
        setLocationState(customEvent.detail);
      }
    };

    window.addEventListener('kisanmitra_location_changed', handleLocationChange);
    return () => {
      window.removeEventListener('kisanmitra_location_changed', handleLocationChange);
    };
  }, []);

  const setLocation = useCallback((loc: UserLocationDetails) => {
    setLocationState(loc);
    saveFarmerLocation(loc);
    setLocationStatusMsg(`Location set to ${loc.village || loc.district}`);
  }, []);

  const detectGPS = useCallback(async (): Promise<UserLocationDetails> => {
    setIsLocating(true);
    setLocationStatusMsg('Detecting location via Browser GPS & Network...');
    try {
      const detected = await detectRealUserLocation();
      setLocationState(detected);
      saveFarmerLocation(detected);
      setLocationStatusMsg(`Location detected: ${detected.village}, ${detected.district}`);
      return detected;
    } catch (err: any) {
      console.warn('GPS detection notice:', err);
      const fallback = getSavedFarmerLocation();
      setLocationStatusMsg(`Using location: ${fallback.village}, ${fallback.district}`);
      return fallback;
    } finally {
      setIsLocating(false);
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        detectGPS,
        isLocating,
        locationModalOpen,
        setLocationModalOpen,
        locationStatusMsg,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

