// Real User Geolocation & OpenStreetMap Reverse-Geocoding Engine

export interface UserLocationDetails {
  latitude: number;
  longitude: number;
  village: string;
  taluka?: string;
  district: string;
  state: string;
  country: string;
  displayName: string;
  source: 'gps' | 'ip' | 'default' | 'search' | 'lgd';
  lgdCode?: number;
  gramPanchayat?: string;
  pincode?: string;
}

export interface LGDState {
  state_code: number;
  state_name: string;
  state_name_local?: string;
  district_count?: number;
}

export interface LGDDistrict {
  district_code: number;
  state_code: number;
  district_name: string;
  district_name_local?: string;
  latitude: number;
  longitude: number;
  subdistrict_count?: number;
  village_count?: number;
}

export interface LGDSubDistrict {
  subdistrict_code: number;
  district_code: number;
  state_code: number;
  subdistrict_name: string;
  subdistrict_name_local?: string;
  latitude: number;
  longitude: number;
  village_count?: number;
}

export interface LGDVillage {
  village_code: number;
  subdistrict_code: number;
  district_code: number;
  state_code: number;
  village_name: string;
  village_name_local?: string;
  subdistrict_name?: string;
  district_name?: string;
  state_name?: string;
  gram_panchayat?: string;
  block_name?: string;
  pincode?: string;
  latitude: number;
  longitude: number;
  is_verified?: boolean;
}

const BACKEND_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

export async function fetchLGDStates(): Promise<LGDState[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/lgd/states`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('LGD fetch states error:', e);
  }
  return [
    { state_code: 27, state_name: 'Maharashtra', state_name_local: 'महाराष्ट्र' },
    { state_code: 23, state_name: 'Madhya Pradesh', state_name_local: 'मध्य प्रदेश' },
    { state_code: 24, state_name: 'Gujarat', state_name_local: 'ગુજરાત / गुजरात' },
    { state_code: 29, state_name: 'Karnataka', state_name_local: 'ಕರ್ನಾಟಕ / कर्नाटक' },
  ];
}

export async function fetchLGDDistricts(state?: string, stateCode?: number): Promise<LGDDistrict[]> {
  try {
    const params = new URLSearchParams();
    if (stateCode) params.set('stateCode', stateCode.toString());
    else if (state) params.set('state', state);
    const res = await fetch(`${BACKEND_URL}/api/v1/lgd/districts?${params.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('LGD fetch districts error:', e);
  }
  return [];
}

export async function fetchLGDTalukas(district?: string, districtCode?: number): Promise<LGDSubDistrict[]> {
  try {
    const params = new URLSearchParams();
    if (districtCode) params.set('districtCode', districtCode.toString());
    else if (district) params.set('district', district);
    const res = await fetch(`${BACKEND_URL}/api/v1/lgd/talukas?${params.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('LGD fetch talukas error:', e);
  }
  return [];
}

export async function fetchLGDVillages(params: { taluka?: string; subdistrictCode?: number; district?: string }): Promise<LGDVillage[]> {
  try {
    const p = new URLSearchParams();
    if (params.subdistrictCode) p.set('subdistrictCode', params.subdistrictCode.toString());
    if (params.taluka) p.set('taluka', params.taluka);
    if (params.district) p.set('district', params.district);
    p.set('limit', '300');
    const res = await fetch(`${BACKEND_URL}/api/v1/lgd/villages?${p.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('LGD fetch villages error:', e);
  }
  return [];
}

export async function searchLGDVillages(query: string): Promise<UserLocationDetails[]> {
  if (!query || !query.trim()) return [];
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/lgd/search?q=${encodeURIComponent(query.trim())}&limit=35`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        return data.results.map((v: LGDVillage) => ({
          latitude: v.latitude,
          longitude: v.longitude,
          village: v.village_name,
          taluka: v.subdistrict_name || v.village_name,
          district: v.district_name || 'District',
          state: v.state_name || 'Maharashtra',
          country: 'India',
          displayName: `${v.village_name} ${v.village_name_local ? '(' + v.village_name_local + ')' : ''}, ${v.subdistrict_name || ''}, ${v.district_name}`,
          source: 'lgd' as const,
          lgdCode: v.village_code,
          gramPanchayat: v.gram_panchayat,
          pincode: v.pincode,
        }));
      }
    }
  } catch (e) {
    console.warn('LGD search error:', e);
  }
  return [];
}

export async function reverseGeocodeLGD(lat: number, lon: number): Promise<UserLocationDetails | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/lgd/reverse?lat=${lat}&lon=${lon}&limit=1`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.nearest_villages && data.nearest_villages.length > 0) {
        const top = data.nearest_villages[0];
        return {
          latitude: top.latitude,
          longitude: top.longitude,
          village: top.village_name,
          taluka: top.subdistrict_name,
          district: top.district_name,
          state: top.state_name,
          country: 'India',
          displayName: `${top.village_name} ${top.village_name_local ? '(' + top.village_name_local + ')' : ''}, ${top.district_name} (${top.distance_km} km)`,
          source: 'lgd' as const,
          lgdCode: top.village_code,
          pincode: top.pincode,
        };
      }
    }
  } catch (e) {
    console.warn('LGD reverse geocode error:', e);
  }
  return null;
}

export interface TalukaRecord {
  name: string;
  nameMr: string;
  nameHi?: string;
  district: string;
  districtMr: string;
  state: string;
  latitude: number;
  longitude: number;
  type: 'taluka' | 'city' | 'major_town' | 'village';
}

// Comprehensive offline index of Indian Talukas and Agricultural Cities
export const INDIAN_TALUKAS: TalukaRecord[] = [
  // Kolhapur District (All Talukas & Major Towns)
  { name: 'Karvir', nameMr: 'करवीर (कोल्हापूर)', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.7050, longitude: 74.2433, type: 'taluka' },
  { name: 'Kolhapur City', nameMr: 'कोल्हापूर शहर', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.7050, longitude: 74.2433, type: 'city' },
  { name: 'Hatkanangale', nameMr: 'हातकणंगले', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.7450, longitude: 74.4450, type: 'taluka' },
  { name: 'Shirol', nameMr: 'शिरोळ', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.7150, longitude: 74.5950, type: 'taluka' },
  { name: 'Jaisingpur', nameMr: 'जयसिंगपूर', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.7820, longitude: 74.5580, type: 'major_town' },
  { name: 'Ichalkaranji', nameMr: 'इचलकरंजी', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.6950, longitude: 74.4600, type: 'city' },
  { name: 'Kagal', nameMr: 'कागल', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.5780, longitude: 74.3180, type: 'taluka' },
  { name: 'Gadhinglaj', nameMr: 'गडहिंग्लज', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.2250, longitude: 74.3550, type: 'taluka' },
  { name: 'Panhala', nameMr: 'पन्हाळा', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.8120, longitude: 74.1100, type: 'taluka' },
  { name: 'Radhanagari', nameMr: 'राधानगरी', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.4170, longitude: 73.9980, type: 'taluka' },
  { name: 'Shahuwadi', nameMr: 'शाहूवाडी', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.9050, longitude: 73.9450, type: 'taluka' },
  { name: 'Bhudargad', nameMr: 'भुदरगड (गारगोटी)', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.3150, longitude: 74.1550, type: 'taluka' },
  { name: 'Ajara', nameMr: 'आजरा', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.1150, longitude: 74.2100, type: 'taluka' },
  { name: 'Chandgad', nameMr: 'चंदगड', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 15.9350, longitude: 74.3980, type: 'taluka' },
  { name: 'Gaganbawda', nameMr: 'गगनबावडा', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.5400, longitude: 73.8300, type: 'taluka' },
  { name: 'Peth Vadgaon', nameMr: 'पेठ वडगाव', district: 'Kolhapur', districtMr: 'कोल्हापूर', state: 'Maharashtra', latitude: 16.8200, longitude: 74.3000, type: 'major_town' },

  // Sangli District (All Talukas & Major Towns)
  { name: 'Miraj', nameMr: 'मिरज', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 16.8250, longitude: 74.6450, type: 'taluka' },
  { name: 'Sangli City', nameMr: 'सांगली शहर', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 16.8524, longitude: 74.5815, type: 'city' },
  { name: 'Walwa', nameMr: 'वाळवा (इस्लामपूर)', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.0500, longitude: 74.2650, type: 'taluka' },
  { name: 'Islampur', nameMr: 'इस्लामपूर', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.0500, longitude: 74.2650, type: 'major_town' },
  { name: 'Tasgaon', nameMr: 'तासगाव', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.0350, longitude: 74.6000, type: 'taluka' },
  { name: 'Palus', nameMr: 'पलूस', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.1000, longitude: 74.4500, type: 'taluka' },
  { name: 'Khanapur', nameMr: 'खानापूर (विटा)', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.2750, longitude: 74.5350, type: 'taluka' },
  { name: 'Vita', nameMr: 'विटा', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.2750, longitude: 74.5350, type: 'major_town' },
  { name: 'Atpadi', nameMr: 'आटपाडी', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.4200, longitude: 74.9500, type: 'taluka' },
  { name: 'Jat', nameMr: 'जत', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.0450, longitude: 75.1650, type: 'taluka' },
  { name: 'Kadegaon', nameMr: 'कडेगाव', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 17.2950, longitude: 74.3350, type: 'taluka' },
  { name: 'Kavathe Mahankal', nameMr: 'कवठे महांकाळ', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 16.9950, longitude: 74.8850, type: 'taluka' },
  { name: 'Shirala', nameMr: 'शिराळा', district: 'Sangli', districtMr: 'सांगली', state: 'Maharashtra', latitude: 16.9850, longitude: 74.1350, type: 'taluka' },

  // Satara District
  { name: 'Karad', nameMr: 'कराड', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.2850, longitude: 74.1850, type: 'taluka' },
  { name: 'Satara City', nameMr: 'सातारा शहर', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.6850, longitude: 73.9950, type: 'city' },
  { name: 'Phaltan', nameMr: 'फलटण', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.9850, longitude: 74.4350, type: 'taluka' },
  { name: 'Wai', nameMr: 'वाई', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.9450, longitude: 73.8950, type: 'taluka' },
  { name: 'Koregaon', nameMr: 'कोरेगाव', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.6950, longitude: 74.1750, type: 'taluka' },
  { name: 'Khatav', nameMr: 'खटाव (वडूज)', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.6050, longitude: 74.4550, type: 'taluka' },
  { name: 'Man', nameMr: 'माण (दहीवडी)', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.6850, longitude: 74.7850, type: 'taluka' },
  { name: 'Patan', nameMr: 'पाटण', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.3750, longitude: 73.9050, type: 'taluka' },
  { name: 'Mahabaleshwar', nameMr: 'महाबळेश्वर', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 17.9250, longitude: 73.6600, type: 'taluka' },
  { name: 'Khandala', nameMr: 'खंडाळा', district: 'Satara', districtMr: 'सातारा', state: 'Maharashtra', latitude: 18.0450, longitude: 74.0250, type: 'taluka' },

  // Pune District
  { name: 'Baramati', nameMr: 'बारामती', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.1550, longitude: 74.5800, type: 'taluka' },
  { name: 'Indapur', nameMr: 'इंदापूर', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.1150, longitude: 75.0250, type: 'taluka' },
  { name: 'Daund', nameMr: 'दौंड', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.4650, longitude: 74.5850, type: 'taluka' },
  { name: 'Junnar', nameMr: 'जुन्नर (नारायणगाव)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 19.2050, longitude: 73.8750, type: 'taluka' },
  { name: 'Shirur', nameMr: 'शिरूर', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.8250, longitude: 74.3750, type: 'taluka' },
  { name: 'Khed', nameMr: 'खेड (चाकण/राजगुरुनगर)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.8550, longitude: 73.9050, type: 'taluka' },
  { name: 'Ambegaon', nameMr: 'आंबेगाव (मंचर)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 19.0150, longitude: 73.8350, type: 'taluka' },
  { name: 'Purandar', nameMr: 'पुरंदर (सासवड)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.3450, longitude: 74.0300, type: 'taluka' },
  { name: 'Haveli', nameMr: 'हवेली (पुणे ग्रामीण)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, type: 'taluka' },
  { name: 'Pune City', nameMr: 'पुणे शहर (गुलटेकडी)', district: 'Pune', districtMr: 'पुणे', state: 'Maharashtra', latitude: 18.4967, longitude: 73.8643, type: 'city' },

  // Solapur District
  { name: 'Pandharpur', nameMr: 'पंढरपूर', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.6750, longitude: 75.3250, type: 'taluka' },
  { name: 'Solapur City', nameMr: 'सोलापूर शहर', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.6599, longitude: 75.9064, type: 'city' },
  { name: 'Barshi', nameMr: 'बार्शी', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 18.2350, longitude: 75.6950, type: 'taluka' },
  { name: 'Malshiras', nameMr: 'माळशिरस (अकलूज)', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.8950, longitude: 75.0250, type: 'taluka' },
  { name: 'Mohol', nameMr: 'मोहोळ', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.8150, longitude: 75.6450, type: 'taluka' },
  { name: 'Sangola', nameMr: 'सांगोला', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.4350, longitude: 75.1950, type: 'taluka' },
  { name: 'Karmala', nameMr: 'करमाळा', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 18.4150, longitude: 75.1950, type: 'taluka' },
  { name: 'Madha', nameMr: 'माढा (कुर्डूवाडी)', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 18.0350, longitude: 75.5250, type: 'taluka' },
  { name: 'Mangalwedha', nameMr: 'मंगळवेढा', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.5150, longitude: 75.4450, type: 'taluka' },
  { name: 'Akkalkot', nameMr: 'अक्कलकोट', district: 'Solapur', districtMr: 'सोलापूर', state: 'Maharashtra', latitude: 17.5250, longitude: 76.2050, type: 'taluka' },

  // Nashik District
  { name: 'Lasalgaon', nameMr: 'लासलगाव (कांदा बाजार)', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.1472, longitude: 74.2255, type: 'major_town' },
  { name: 'Niphad', nameMr: 'निफाड', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.0850, longitude: 74.1100, type: 'taluka' },
  { name: 'Pimpalgaon Baswant', nameMr: 'पिंपळगाव बसवंत', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.1706, longitude: 73.9856, type: 'major_town' },
  { name: 'Nashik City', nameMr: 'नाशिक शहर', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 19.9975, longitude: 73.7898, type: 'city' },
  { name: 'Yeola', nameMr: 'येवला', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.0450, longitude: 74.4850, type: 'taluka' },
  { name: 'Sinnar', nameMr: 'सिन्नर', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 19.8550, longitude: 74.0050, type: 'taluka' },
  { name: 'Dindori', nameMr: 'दिंडोरी', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.2050, longitude: 73.8350, type: 'taluka' },
  { name: 'Kalwan', nameMr: 'कळवण', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.4950, longitude: 74.0250, type: 'taluka' },
  { name: 'Malegaon', nameMr: 'मालेगाव', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.5550, longitude: 74.5250, type: 'city' },
  { name: 'Satana', nameMr: 'सटाणा (बागलाण)', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.5950, longitude: 74.2050, type: 'taluka' },
  { name: 'Chandwad', nameMr: 'चांदवड', district: 'Nashik', districtMr: 'नाशिक', state: 'Maharashtra', latitude: 20.3250, longitude: 74.2450, type: 'taluka' },

  // Ahmednagar District
  { name: 'Rahata', nameMr: 'राहाता (शिर्डी)', district: 'Ahmednagar', districtMr: 'अहिल्यानगर', state: 'Maharashtra', latitude: 19.6850, longitude: 74.4850, type: 'taluka' },
  { name: 'Kopargaon', nameMr: 'कोपरगाव', district: 'Ahmednagar', districtMr: 'अहिल्यानगर', state: 'Maharashtra', latitude: 19.8850, longitude: 74.4850, type: 'taluka' },
  { name: 'Sangamner', nameMr: 'संगमनेर', district: 'Ahmednagar', districtMr: 'अहिल्यानगर', state: 'Maharashtra', latitude: 19.5750, longitude: 74.2150, type: 'taluka' },
  { name: 'Shrirampur', nameMr: 'श्रीरामपूर', district: 'Ahmednagar', districtMr: 'अहिल्यानगर', state: 'Maharashtra', latitude: 19.6250, longitude: 74.6550, type: 'taluka' },
  { name: 'Nevasa', nameMr: 'नेवासा', district: 'Ahmednagar', districtMr: 'अहिल्यानगर', state: 'Maharashtra', latitude: 19.5550, longitude: 74.9250, type: 'taluka' },
  { name: 'Shevgaon', nameMr: 'शेवगाव', district: 'Ahmednagar', districtMr: 'अहिल्यानगर', state: 'Maharashtra', latitude: 19.3450, longitude: 75.2250, type: 'taluka' },
  { name: 'Ahmednagar City', nameMr: 'अहिल्यानगर शहर', district: 'Ahmednagar', districtMr: 'अहिल्यानगर', state: 'Maharashtra', latitude: 19.0950, longitude: 74.7450, type: 'city' },

  // Jalgaon District
  { name: 'Jalgaon City', nameMr: 'जळगाव शहर', district: 'Jalgaon', districtMr: 'जळगाव', state: 'Maharashtra', latitude: 21.0077, longitude: 75.5626, type: 'city' },
  { name: 'Raver', nameMr: 'रावेर (केळी केंद्र)', district: 'Jalgaon', districtMr: 'जळगाव', state: 'Maharashtra', latitude: 21.2450, longitude: 76.0350, type: 'taluka' },
  { name: 'Bhusawal', nameMr: 'भुसावळ', district: 'Jalgaon', districtMr: 'जळगाव', state: 'Maharashtra', latitude: 21.0450, longitude: 75.7850, type: 'city' },
  { name: 'Chopda', nameMr: 'चोपडा', district: 'Jalgaon', districtMr: 'जळगाव', state: 'Maharashtra', latitude: 21.2550, longitude: 75.3050, type: 'taluka' },
  { name: 'Jamner', nameMr: 'जामनेर', district: 'Jalgaon', districtMr: 'जळगाव', state: 'Maharashtra', latitude: 20.8150, longitude: 75.7850, type: 'taluka' },

  // Marathwada & Vidarbha
  { name: 'Somanwadi', nameMr: 'सोमणवाडी (अंबाजोगाई)', district: 'Beed', districtMr: 'बीड', state: 'Maharashtra', latitude: 18.7120, longitude: 76.3450, type: 'village' },
  { name: 'Ambejogai', nameMr: 'अंबाजोगाई', district: 'Beed', districtMr: 'बीड', state: 'Maharashtra', latitude: 18.7300, longitude: 76.3800, type: 'taluka' },
  { name: 'Beed City', nameMr: 'बीड शहर', district: 'Beed', districtMr: 'बीड', state: 'Maharashtra', latitude: 18.9900, longitude: 75.7600, type: 'city' },
  { name: 'Parli', nameMr: 'परळी वैजनाथ', district: 'Beed', districtMr: 'बीड', state: 'Maharashtra', latitude: 18.8480, longitude: 76.5350, type: 'taluka' },
  { name: 'Majalgaon', nameMr: 'माजलगाव', district: 'Beed', districtMr: 'बीड', state: 'Maharashtra', latitude: 19.1550, longitude: 76.2250, type: 'taluka' },
  { name: 'Chhatrapati Sambhajinagar', nameMr: 'छत्रपती संभाजीनगर (औरंगाबाद)', district: 'Chhatrapati Sambhajinagar', districtMr: 'छत्रपती संभाजीनगर', state: 'Maharashtra', latitude: 19.8762, longitude: 75.3433, type: 'city' },
  { name: 'Jalna City', nameMr: 'जालना शहर (बियाणे राजधानी)', district: 'Jalna', districtMr: 'जालना', state: 'Maharashtra', latitude: 19.8410, longitude: 75.8864, type: 'city' },
  { name: 'Latur City', nameMr: 'लातूर शहर (सोयाबीन केंद्र)', district: 'Latur', districtMr: 'लातूर', state: 'Maharashtra', latitude: 18.4088, longitude: 76.5604, type: 'city' },
  { name: 'Nagpur City', nameMr: 'नागपूर शहर (संत्रा व कापूस)', district: 'Nagpur', districtMr: 'नागपूर', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, type: 'city' },
  { name: 'Wardha City', nameMr: 'वर्धा शहर (सेवाग्राम)', district: 'Wardha', districtMr: 'वर्धा', state: 'Maharashtra', latitude: 20.7453, longitude: 78.6022, type: 'city' },
  { name: 'Amravati City', nameMr: 'अमरावती शहर', district: 'Amravati', districtMr: 'अमरावती', state: 'Maharashtra', latitude: 20.9320, longitude: 77.7523, type: 'city' },
  { name: 'Akola City', nameMr: 'अकोला शहर', district: 'Akola', districtMr: 'अकोला', state: 'Maharashtra', latitude: 20.7002, longitude: 77.0082, type: 'city' },
  { name: 'Yavatmal City', nameMr: 'यवतमाळ (कापूस पट्टा)', district: 'Yavatmal', districtMr: 'यवतमाळ', state: 'Maharashtra', latitude: 20.3888, longitude: 78.1204, type: 'city' },
  { name: 'Nanded City', nameMr: 'नांदेड शहर', district: 'Nanded', districtMr: 'नांदेड', state: 'Maharashtra', latitude: 19.1383, longitude: 77.3210, type: 'city' },

  // Madhya Pradesh Key Agri Centers
  { name: 'Indore City', nameMr: 'इंदूर शहर', nameHi: 'इंदौर (छावनी मंडी)', district: 'Indore', districtMr: 'इंदूर', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, type: 'city' },
  { name: 'Ujjain City', nameMr: 'उज्जैन शहर', nameHi: 'उज्जैन कृषि उपज मंडी', district: 'Ujjain', districtMr: 'उज्जैन', state: 'Madhya Pradesh', latitude: 23.1765, longitude: 75.7885, type: 'city' },
  { name: 'Mandsaur', nameMr: 'मंदसौर', nameHi: 'मंदसौर (लहसुन मंडी)', district: 'Mandsaur', districtMr: 'मंदसौर', state: 'Madhya Pradesh', latitude: 24.0722, longitude: 75.0682, type: 'city' },
  { name: 'Neemuch', nameMr: 'नीमच', nameHi: 'नीमच कृषि मंडी', district: 'Neemuch', districtMr: 'नीमच', state: 'Madhya Pradesh', latitude: 24.4722, longitude: 74.8682, type: 'city' },
  { name: 'Bhopal City', nameMr: 'भोपाळ', nameHi: 'भोपाल', district: 'Bhopal', districtMr: 'भोपाळ', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, type: 'city' },

  // Gujarat Key Agri Centers
  { name: 'Rajkot City', nameMr: 'राजकोट', nameHi: 'राजकोट (कपास/मूंगफली)', district: 'Rajkot', districtMr: 'राजकोट', state: 'Gujarat', latitude: 22.3039, longitude: 70.8022, type: 'city' },
  { name: 'Unjha Spices Yard', nameMr: 'ऊंझा', nameHi: 'ऊंझा (जीरा व मसाला मंडी)', district: 'Mehsana', districtMr: 'महेसाणा', state: 'Gujarat', latitude: 23.8042, longitude: 72.3925, type: 'major_town' },
  { name: 'Surat City', nameMr: 'सुरत', nameHi: 'सूरत', district: 'Surat', districtMr: 'सुरत', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311, type: 'city' },
  { name: 'Gondal APMC', nameMr: 'गोंडल', nameHi: 'गोंडल APMC', district: 'Rajkot', districtMr: 'राजकोट', state: 'Gujarat', latitude: 21.9619, longitude: 70.7933, type: 'major_town' },

  // Karnataka Key Agri Centers
  { name: 'Belagavi City', nameMr: 'बेळगाव', nameHi: 'बेलगावी (कर्नाटक)', district: 'Belagavi', districtMr: 'बेळगाव', state: 'Karnataka', latitude: 15.8497, longitude: 74.4977, type: 'city' },
  { name: 'Nippani', nameMr: 'निपाणी (तंबाखू व भाजीपाला)', nameHi: 'निप्पानी', district: 'Belagavi', districtMr: 'बेळगाव', state: 'Karnataka', latitude: 16.3980, longitude: 74.3820, type: 'major_town' },
  { name: 'Hubballi (Hubli)', nameMr: 'हुबळी', nameHi: 'हुबली (धारवाड़)', district: 'Dharwad', districtMr: 'धारवाड', state: 'Karnataka', latitude: 15.3647, longitude: 75.1240, type: 'city' },
];

/**
 * Finds the closest pre-indexed taluka using Euclidean / Great-Circle distance
 */
export function findNearestIndexedTaluka(lat: number, lon: number): TalukaRecord {
  let closest = INDIAN_TALUKAS[0];
  let minD = Infinity;
  for (const t of INDIAN_TALUKAS) {
    const d = (t.latitude - lat) ** 2 + (t.longitude - lon) ** 2;
    if (d < minD) {
      minD = d;
      closest = t;
    }
  }
  return closest;
}

/**
 * Instant Offline Search + Live Fallback for City, Taluka or Village
 */
export async function searchIndianCityOrTaluka(query: string): Promise<UserLocationDetails[]> {
  if (!query || !query.trim()) {
    return getAllIndexedTalukas().slice(0, 25);
  }
  const q = query.toLowerCase().trim();

  // 1. Live match in official LGD government village directory
  const lgdMatches: UserLocationDetails[] = await searchLGDVillages(query);

  // 2. Instant match in pre-indexed talukas and cities
  const localMatches: UserLocationDetails[] = INDIAN_TALUKAS
    .filter((t) => {
      const matchName = t.name.toLowerCase().includes(q) || t.nameMr.includes(q);
      const matchDist = t.district.toLowerCase().includes(q) || t.districtMr.includes(q);
      const matchState = t.state.toLowerCase().includes(q);
      return matchName || matchDist || matchState;
    })
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q) || a.nameMr.startsWith(q);
      const bStarts = b.name.toLowerCase().startsWith(q) || b.nameMr.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    })
    .slice(0, 40)
    .map((t) => ({
      latitude: t.latitude,
      longitude: t.longitude,
      village: t.name,
      taluka: t.name,
      district: t.district,
      state: t.state,
      country: 'India',
      displayName: `${t.name} (${t.district}, ${t.state})`,
      source: 'search' as const,
    }));

  // Combine LGD results with local pre-indexed records (deduplicating)
  const combined: UserLocationDetails[] = [...lgdMatches];
  const seen = new Set(lgdMatches.map(m => `${m.village.toLowerCase()}_${m.district.toLowerCase()}`));
  for (const m of localMatches) {
    const key = `${m.village.toLowerCase()}_${m.district.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(m);
    }
  }

  if (combined.length >= 6) {
    return combined;
  }

  // 3. OpenStreetMap Nominatim Live Geocoding Fallback (without browser forbidden header)
  if (q.length >= 3) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=6`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        },
      });

      if (res.ok) {
        const osmData = await res.json();
        const osmResults: UserLocationDetails[] = osmData.map((item: any) => {
          const addr = item.address || {};
          const town = addr.village || addr.town || addr.suburb || addr.city || addr.county || item.name || query;
          const dist = addr.state_district || addr.district || addr.county || addr.city || 'District';
          const state = addr.state || 'Maharashtra';
          return {
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            village: town,
            taluka: town,
            district: dist,
            state: state,
            country: 'India',
            displayName: item.display_name.split(',').slice(0, 3).join(', '),
            source: 'search' as const,
          };
        });

        for (const r of osmResults) {
          const key = `${r.village.toLowerCase()}_${r.district.toLowerCase()}`;
          if (!seen.has(key)) {
            seen.add(key);
            combined.push(r);
          }
        }
      }
    } catch (_) {}
  }

  return combined;
}

/**
 * Returns all pre-indexed talukas and agricultural cities across India
 */
export function getAllIndexedTalukas(): UserLocationDetails[] {
  return INDIAN_TALUKAS.map((t) => ({
    latitude: t.latitude,
    longitude: t.longitude,
    village: t.name,
    taluka: t.name,
    district: t.district,
    state: t.state,
    country: 'India',
    displayName: `${t.name} (${t.district}, ${t.state})`,
    source: 'search' as const,
  }));
}

// Default fallback to Maharashtra agricultural hub (Kolhapur)
export const DEFAULT_FARMER_LOCATION: UserLocationDetails = {
  latitude: 16.7050,
  longitude: 74.2433,
  village: 'Kolhapur',
  taluka: 'Karvir',
  district: 'Kolhapur',
  state: 'Maharashtra',
  country: 'India',
  displayName: 'Kolhapur (Karvir), Maharashtra',
  source: 'default',
};

export const KOLHAPUR_LOCATION: UserLocationDetails = {
  latitude: 16.7050,
  longitude: 74.2433,
  village: 'Kolhapur',
  taluka: 'Karvir',
  district: 'Kolhapur',
  state: 'Maharashtra',
  country: 'India',
  displayName: 'Kolhapur (Karvir), Maharashtra',
  source: 'default',
};

export const POPULAR_AGRI_REGIONS: UserLocationDetails[] = [
  KOLHAPUR_LOCATION,
  {
    latitude: 18.7120,
    longitude: 76.3450,
    village: 'Somanwadi',
    taluka: 'Ambejogai',
    district: 'Beed',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Somanwadi, Ambejogai (Beed)',
    source: 'default',
  },
  {
    latitude: 20.1472,
    longitude: 74.2255,
    village: 'Lasalgaon',
    taluka: 'Niphad',
    district: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Lasalgaon (Niphad), Nashik',
    source: 'default',
  },
  {
    latitude: 18.1550,
    longitude: 74.5800,
    village: 'Baramati',
    taluka: 'Baramati',
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Baramati, Pune',
    source: 'default',
  },
  {
    latitude: 16.8250,
    longitude: 74.6450,
    village: 'Miraj',
    taluka: 'Miraj',
    district: 'Sangli',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Miraj, Sangli',
    source: 'default',
  },
  {
    latitude: 17.2850,
    longitude: 74.1850,
    village: 'Karad',
    taluka: 'Karad',
    district: 'Satara',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Karad, Satara',
    source: 'default',
  },
  {
    latitude: 17.6750,
    longitude: 75.3250,
    village: 'Pandharpur',
    taluka: 'Pandharpur',
    district: 'Solapur',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Pandharpur, Solapur',
    source: 'default',
  },
  {
    latitude: 21.0077,
    longitude: 75.5626,
    village: 'Jalgaon',
    taluka: 'Jalgaon',
    district: 'Jalgaon',
    state: 'Maharashtra',
    country: 'India',
    displayName: 'Jalgaon (Banana Belt), Maharashtra',
    source: 'default',
  },
  {
    latitude: 22.7196,
    longitude: 75.8577,
    village: 'Indore',
    taluka: 'Indore',
    district: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    displayName: 'Indore, Madhya Pradesh',
    source: 'default',
  },
  {
    latitude: 23.1765,
    longitude: 75.7885,
    village: 'Ujjain',
    taluka: 'Ujjain',
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    country: 'India',
    displayName: 'Ujjain, Madhya Pradesh',
    source: 'default',
  },
  {
    latitude: 22.3039,
    longitude: 70.8022,
    village: 'Rajkot',
    taluka: 'Rajkot',
    district: 'Rajkot',
    state: 'Gujarat',
    country: 'India',
    displayName: 'Rajkot, Gujarat',
    source: 'default',
  },
  {
    latitude: 15.8497,
    longitude: 74.4977,
    village: 'Belagavi',
    taluka: 'Belagavi',
    district: 'Belagavi',
    state: 'Karnataka',
    country: 'India',
    displayName: 'Belagavi, Karnataka',
    source: 'default',
  },
];

/**
 * Reverse geocode latitude and longitude with OpenStreetMap + offline index fallback
 */
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<UserLocationDetails> {
  // 1. Try official Local Government Directory (LGD) spatial matching
  const lgdMatch = await reverseGeocodeLGD(lat, lon);
  if (lgdMatch) {
    return lgdMatch;
  }

  const closestTaluka = findNearestIndexedTaluka(lat, lon);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const village =
        addr.village ||
        addr.town ||
        addr.suburb ||
        addr.city ||
        addr.county ||
        closestTaluka.name;
      const district =
        addr.state_district ||
        addr.district ||
        addr.county ||
        addr.city ||
        closestTaluka.district;
      const state = addr.state || closestTaluka.state;
      const country = addr.country || 'India';

      return {
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lon.toFixed(6)),
        village,
        taluka: addr.county || addr.town || closestTaluka.name,
        district,
        state,
        country,
        displayName: `${village}, ${district}, ${state}`,
        source: 'gps',
      };
    }
  } catch (err) {
    console.warn('Nominatim reverse geocoding fallback to closest indexed taluka:', err);
  }

  // High-precision offline taluka matching fallback
  return {
    latitude: Number(lat.toFixed(6)),
    longitude: Number(lon.toFixed(6)),
    village: closestTaluka.name,
    taluka: closestTaluka.name,
    district: closestTaluka.district,
    state: closestTaluka.state,
    country: 'India',
    displayName: `${closestTaluka.name}, ${closestTaluka.district}, ${closestTaluka.state}`,
    source: 'gps',
  };
}

/**
 * Robust IP-based Geolocation fallback when GPS permission is denied or unavailable
 */
export async function fetchIPLocation(): Promise<UserLocationDetails> {
  // 1. Try ipwho.is (HTTPS, free, high accuracy in India)
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.latitude && data.longitude) {
        const city = data.city || 'Kolhapur';
        const region = data.region || 'Maharashtra';
        return {
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          village: city,
          taluka: city,
          district: city,
          state: region,
          country: data.country || 'India',
          displayName: `${city}, ${region}, India`,
          source: 'ip',
        };
      }
    }
  } catch (_) {}

  // 2. Try geojs.io (HTTPS, ultra-fast, CORS-friendly)
  try {
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
    if (res.ok) {
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        const city = data.city || 'Kolhapur';
        const region = data.region || 'Maharashtra';
        return {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          village: city,
          taluka: city,
          district: city,
          state: region,
          country: data.country || 'India',
          displayName: `${city}, ${region}, India`,
          source: 'ip',
        };
      }
    }
  } catch (_) {}

  return DEFAULT_FARMER_LOCATION;
}

/**
 * Main Function: Obtains user's real GPS position from browser,
 * reverse-geocodes, and falls back gracefully to IP location or nearest taluka.
 */
export async function detectRealUserLocation(): Promise<UserLocationDetails> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(DEFAULT_FARMER_LOCATION);
      return;
    }

    if (!navigator.geolocation) {
      console.warn('Browser geolocation not supported, falling back to IP');
      fetchIPLocation().then((loc) => {
        saveFarmerLocation(loc);
        resolve(loc);
      });
      return;
    }

    let hasResolved = false;
    // Generous 9.5s fallback timer so user has ample time to click "Allow" on permission dialog
    const fallbackTimer = setTimeout(async () => {
      if (!hasResolved) {
        hasResolved = true;
        console.warn('GPS query taking too long, falling back to IP geolocation');
        const ipLocation = await fetchIPLocation();
        saveFarmerLocation(ipLocation);
        resolve(ipLocation);
      }
    }, 9500);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (hasResolved) return;
        hasResolved = true;
        clearTimeout(fallbackTimer);
        const { latitude, longitude } = pos.coords;
        try {
          const details = await reverseGeocodeCoords(latitude, longitude);
          saveFarmerLocation(details);
          resolve(details);
        } catch {
          const closestTaluka = findNearestIndexedTaluka(latitude, longitude);
          const fallback: UserLocationDetails = {
            latitude: Number(latitude.toFixed(6)),
            longitude: Number(longitude.toFixed(6)),
            village: closestTaluka.name,
            taluka: closestTaluka.name,
            district: closestTaluka.district,
            state: closestTaluka.state,
            country: 'India',
            displayName: `${closestTaluka.name}, ${closestTaluka.district}, ${closestTaluka.state}`,
            source: 'gps',
          };
          saveFarmerLocation(fallback);
          resolve(fallback);
        }
      },
      async (error) => {
        if (hasResolved) return;
        hasResolved = true;
        clearTimeout(fallbackTimer);
        console.warn('Geolocation denied or unavailable:', error.message);
        // Fall back to IP-based detection
        const ipLocation = await fetchIPLocation();
        saveFarmerLocation(ipLocation);
        resolve(ipLocation);
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 120000,
      }
    );
  });
}

/**
 * Reads cached user location from localStorage if available
 */
export function getSavedFarmerLocation(): UserLocationDetails {
  if (typeof window === 'undefined') return DEFAULT_FARMER_LOCATION;
  try {
    const raw = localStorage.getItem('kisanmitra_farmer_location');
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return DEFAULT_FARMER_LOCATION;
}

/**
 * Persists user location to localStorage and notifies all components via custom event
 */
export function saveFarmerLocation(details: UserLocationDetails): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('kisanmitra_farmer_location', JSON.stringify(details));
    window.dispatchEvent(new CustomEvent('kisanmitra_location_changed', { detail: details }));
  } catch (_) {}
}
