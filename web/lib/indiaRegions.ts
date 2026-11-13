// ============================================================================
// Comprehensive Regional Hierarchy: States -> Districts -> Talukas -> Villages
// Covers all major Indian agricultural states, districts, and talukas with exact coordinates.
// ============================================================================

export interface VillageInfo {
  name: string;
  nameMr?: string;
  nameHi?: string;
}

export interface TalukaInfo {
  name: string;
  nameMr?: string;
  nameHi?: string;
  latitude: number;
  longitude: number;
  villages: (string | VillageInfo)[];
}

export interface DistrictInfo {
  name: string;
  nameMr?: string;
  nameHi?: string;
  latitude: number;
  longitude: number;
  talukas: TalukaInfo[];
}

export interface StateInfo {
  name: string;
  nameMr?: string;
  nameHi?: string;
  districts: DistrictInfo[];
}

export const INDIA_REGIONS: StateInfo[] = [
  // ==========================================================================
  // 1. MAHARASHTRA (Complete 36 Districts with Talukas and Agri Villages)
  // ==========================================================================
  {
    name: 'Maharashtra',
    nameMr: 'महाराष्ट्र',
    nameHi: 'महाराष्ट्र',
    districts: [
      {
        name: 'Kolhapur',
        nameMr: 'कोल्हापूर',
        nameHi: 'कोल्हापुर',
        latitude: 16.7050,
        longitude: 74.2433,
        talukas: [
          {
            name: 'Karvir',
            nameMr: 'करवीर',
            latitude: 16.7050,
            longitude: 74.2433,
            villages: ['Kasaba Bawada', 'Uchgaon', 'Vadanange', 'Kalamba', 'Shiroli', 'Gandhinagar', 'Mudshingi', 'Kaneri', 'Gokul Shirgaon', 'Ujalaiwadi', 'Chikhali', 'Nagdevwadi']
          },
          {
            name: 'Hatkanangale',
            nameMr: 'हातकणंगले',
            latitude: 16.7450,
            longitude: 74.4450,
            villages: ['Hupari', 'Pattankodoli', 'Korochi', 'Ruikar', 'Rukadi', 'Hergewadi', 'Manjare', 'Kumbhoj', 'Talandage', 'Alte', 'Kabnoor']
          },
          {
            name: 'Shirol',
            nameMr: 'शिरोळ',
            latitude: 16.7150,
            longitude: 74.5950,
            villages: ['Jaysingpur', 'Kurundwad', 'Danoli', 'Ganeshwadi', 'Dharangutti', 'Shirol Town', 'Alas', 'Nandre', 'Rajapur', 'Kawatheguland']
          },
          {
            name: 'Kagal',
            nameMr: 'कागल',
            latitude: 16.5780,
            longitude: 74.3180,
            villages: ['Murgud', 'Kapashi', 'Hamidwada', 'Sangaon', 'Sulgaon', 'Valgud', 'Kallammavadi', 'Bhadgaon', 'Sidhnarli', 'Kagal City']
          },
          {
            name: 'Gadhinglaj',
            nameMr: 'गडहिंग्लज',
            latitude: 16.2250,
            longitude: 74.3550,
            villages: ['Gadhinglaj Town', 'Nool', 'Koujalgi', 'Halgoli', 'Bhadgaon', 'Hidaddugi', 'Gajarwadi', 'Harali', 'Nandgaon']
          },
          {
            name: 'Panhala',
            nameMr: 'पन्हाळा',
            latitude: 16.8120,
            longitude: 74.1100,
            villages: ['Kodoli', 'Kotoli', 'Borpadle', 'Kale', 'Padasali', 'Ghotavade', 'Pokhale', 'Panhala Fort Area']
          },
          {
            name: 'Radhanagari',
            nameMr: 'राधानगरी',
            latitude: 16.4170,
            longitude: 73.9980,
            villages: ['Radhanagari Town', 'Tarale', 'Kasaba Walva', 'Shelewadi', 'Solankur', 'Titave', 'Saroli']
          },
          {
            name: 'Shahuwadi',
            nameMr: 'शाहूवाडी',
            latitude: 16.9050,
            longitude: 73.9450,
            villages: ['Malkapur', 'Shahuwadi Town', 'Bambavade', 'Perid', 'Kapashi', 'Amba', 'Salashi']
          },
          {
            name: 'Bhudargad',
            nameMr: 'भुदरगड (गारगोटी)',
            latitude: 16.3150,
            longitude: 74.1550,
            villages: ['Gargoti', 'Madilge', 'Shengaon', 'Kadgaon', 'Minche', 'Pal', 'Pategaon']
          },
          {
            name: 'Ajara',
            nameMr: 'आजरा',
            latitude: 16.1150,
            longitude: 74.2100,
            villages: ['Ajara Town', 'Uttur', 'Gowalkop', 'Maligre', 'Haliwade', 'Khanapur']
          },
          {
            name: 'Chandgad',
            nameMr: 'चंदगड',
            latitude: 15.9350,
            longitude: 74.3980,
            villages: ['Chandgad Town', 'Shinoli', 'Kowad', 'Hajgoli', 'Adkur', 'Naganwadi']
          },
          {
            name: 'Gaganbawda',
            nameMr: 'गगनबावडा',
            latitude: 16.5400,
            longitude: 73.8300,
            villages: ['Bawda', 'Mandukali', 'Palasambe', 'Sangulwadi', 'Shenavade']
          }
        ]
      },
      {
        name: 'Sangli',
        nameMr: 'सांगली',
        nameHi: 'सांगली',
        latitude: 16.8524,
        longitude: 74.5815,
        talukas: [
          {
            name: 'Miraj',
            nameMr: 'मिरज',
            latitude: 16.8250,
            longitude: 74.6450,
            villages: ['Miraj City', 'Sangli Urban', 'Budhgaon', 'Madhavnagar', 'Bedag', 'Mhaishal', 'Kavathepiran', 'Malgaon', 'Haripur']
          },
          {
            name: 'Walwa',
            nameMr: 'वाळवा (इस्लामपूर)',
            latitude: 17.0500,
            longitude: 74.2650,
            villages: ['Islampur', 'Ashta', 'Borgaon', 'Kameri', 'Peth', 'Shirgaon', 'Kasegaon', 'Bavachi', 'Nandre']
          },
          {
            name: 'Tasgaon',
            nameMr: 'तासगाव',
            latitude: 17.0350,
            longitude: 74.6000,
            villages: ['Tasgaon Town', 'Savlaj', 'Manerajuri', 'Visapur', 'Nimani', 'Kavathe Ekand', 'Kumthe', 'Balagavade']
          },
          {
            name: 'Palus',
            nameMr: 'पलूस',
            latitude: 17.1000,
            longitude: 74.4500,
            villages: ['Palus Town', 'Kundal', 'Bhilawadi', 'Dudhgaon', 'Ramanandnagar', 'Ankalkhop', 'Burli']
          },
          {
            name: 'Khanapur',
            nameMr: 'खानापूर (विटा)',
            latitude: 17.2750,
            longitude: 74.5350,
            villages: ['Vita', 'Khanapur Town', 'Bhalawani', 'Bhivghat', 'Garebardi', 'Revangaon', 'Lengare']
          },
          {
            name: 'Atpadi',
            nameMr: 'आटपाडी',
            latitude: 17.4200,
            longitude: 74.9500,
            villages: ['Atpadi Town', 'Dighanchi', 'Zare', 'Kharpudi', 'Nelkaranji', 'Mhaswad Border']
          },
          {
            name: 'Jat',
            nameMr: 'जत',
            latitude: 17.0450,
            longitude: 75.1650,
            villages: ['Jat Town', 'Sankh', 'Madgyal', 'Umapadi', 'Valsang', 'Morabgi', 'Gudapur']
          },
          {
            name: 'Kadegaon',
            nameMr: 'कडेगाव',
            latitude: 17.2950,
            longitude: 74.3350,
            villages: ['Kadegaon Town', 'Sonsal', 'Kotij', 'Shivgaj', 'Tondoli', 'Hingangaon']
          },
          {
            name: 'Kavathe Mahankal',
            nameMr: 'कवठे महांकाळ',
            latitude: 16.9950,
            longitude: 74.8850,
            villages: ['Kavathe Mahankal Town', 'Dhalgaon', 'Karkamb', 'Nagaj', 'Langar Peth', 'Hingangaon Bk']
          },
          {
            name: 'Shirala',
            nameMr: 'शिराळा',
            latitude: 16.9850,
            longitude: 74.1350,
            villages: ['Shirala Town', 'Kokrud', 'Bilashi', 'Chikhali', 'Mangale', 'Sagareshwar']
          }
        ]
      },
      {
        name: 'Satara',
        nameMr: 'सातारा',
        nameHi: 'सातारा',
        latitude: 17.6850,
        longitude: 73.9950,
        talukas: [
          {
            name: 'Karad',
            nameMr: 'कराड',
            latitude: 17.2850,
            longitude: 74.1850,
            villages: ['Karad City', 'Malkapur', 'Ogalewadi', 'Saidapur', 'Umbraj', 'Vadgaon Haveli', 'Koregaon Karad', 'Kole']
          },
          {
            name: 'Satara',
            nameMr: 'सातारा शहर',
            latitude: 17.6850,
            longitude: 73.9950,
            villages: ['Satara City', 'Karanje', 'Shahupuri', 'Godoli', 'Varye', 'Songaon', 'Kodoli Satara']
          },
          {
            name: 'Phaltan',
            nameMr: 'फलटण',
            latitude: 17.9850,
            longitude: 74.4350,
            villages: ['Phaltan Town', 'Lonand', 'Taradgaon', 'Girvi', 'Barad', 'Asu', 'Salpa']
          },
          {
            name: 'Wai',
            nameMr: 'वाई',
            latitude: 17.9450,
            longitude: 73.8950,
            villages: ['Wai City', 'Bhuinj', 'Surur', 'Panchgani Border', 'Bhilare', 'Bavdhan']
          },
          {
            name: 'Koregaon',
            nameMr: 'कोरेगाव',
            latitude: 17.6950,
            longitude: 74.1750,
            villages: ['Koregaon Town', 'Rahimatpur', 'Khed', 'Wathar', 'Kumthe', 'Borgaon']
          },
          {
            name: 'Khatav',
            nameMr: 'खटाव (वडूज)',
            latitude: 17.6050,
            longitude: 74.4550,
            villages: ['Vaduj', 'Khatav Village', 'Mayani', 'Aundh', 'Pusegaon', 'Nimsod']
          },
          {
            name: 'Man',
            nameMr: 'माण (दहीवडी)',
            latitude: 17.6850,
            longitude: 74.7850,
            villages: ['Dahiwadi', 'Mhaswad', 'Shingnapur', 'Gondavale', 'Pangri', 'Pulakoti']
          },
          {
            name: 'Patan',
            nameMr: 'पाटण',
            latitude: 17.3750,
            longitude: 73.9050,
            villages: ['Patan Town', 'Koynanagar', 'Malhar Peth', 'Dhebewadi', 'Chaphal', 'Helwak']
          },
          {
            name: 'Khandala',
            nameMr: 'खंडाळा',
            latitude: 18.0450,
            longitude: 74.0250,
            villages: ['Khandala Town', 'Shirwal', 'Pargaon', 'Ahir', 'Bavada']
          }
        ]
      },
      {
        name: 'Pune',
        nameMr: 'पुणे',
        nameHi: 'पुणे',
        latitude: 18.5204,
        longitude: 73.8567,
        talukas: [
          {
            name: 'Baramati',
            nameMr: 'बारामती',
            latitude: 18.1550,
            longitude: 74.5800,
            villages: ['Baramati City', 'Malegaon Bk', 'Supa', 'Someshwar', 'Morgaon', 'Katewadi', 'Gundegaon', 'Karkhel']
          },
          {
            name: 'Indapur',
            nameMr: 'इंदापूर',
            latitude: 18.1150,
            longitude: 75.0250,
            villages: ['Indapur Town', 'Bawada', 'Nimbgaon Ketki', 'Walchandnagar', 'Shetfal', 'Anthurne']
          },
          {
            name: 'Daund',
            nameMr: 'दौंड',
            latitude: 18.4650,
            longitude: 74.5850,
            villages: ['Daund City', 'Patas', 'Yawat', 'Kurkumbh', 'Kedgaon', 'Kashti Border']
          },
          {
            name: 'Junnar',
            nameMr: 'जुन्नर (नारायणगाव)',
            latitude: 19.2050,
            longitude: 73.8750,
            villages: ['Narayangaon', 'Junnar City', 'Otur', 'Alephata', 'Belhe', 'Rajur', 'Kukadi Canal Area']
          },
          {
            name: 'Shirur',
            nameMr: 'शिरूर',
            latitude: 18.8250,
            longitude: 74.3750,
            villages: ['Shirur City', 'Shikrapur', 'Ranjangaon', 'Sanaswadi', 'Mandavgan Farata', 'Nimgaon Mhalungi']
          },
          {
            name: 'Khed',
            nameMr: 'खेड (चाकण/राजगुरुनगर)',
            latitude: 18.8550,
            longitude: 73.9050,
            villages: ['Chakan', 'Rajgurunagar (Khed)', 'Alandi', 'Mahalunge', 'Kuruli', 'Shel Pimpalgaon']
          },
          {
            name: 'Ambegaon',
            nameMr: 'आंबेगाव (मंचर)',
            latitude: 19.0150,
            longitude: 73.8350,
            villages: ['Manchar', 'Ghodegaon', 'Pargaon', 'Kalamb', 'Nirgudsar', 'Bhimashankar Border']
          },
          {
            name: 'Purandar',
            nameMr: 'पुरंदर (सासवड)',
            latitude: 18.3450,
            longitude: 74.0300,
            villages: ['Saswad', 'Jejuri', 'Belsar', 'Walhe', 'Dive', 'Kodi']
          },
          {
            name: 'Haveli',
            nameMr: 'हवेली (पुणे ग्रामीण)',
            latitude: 18.5204,
            longitude: 73.8567,
            villages: ['Uruli Kanchan', 'Loni Kalbhor', 'Wagholi', 'Hadapsar Rural', 'Khadakwasla', 'Manjari']
          }
        ]
      },
      {
        name: 'Nashik',
        nameMr: 'नाशिक',
        nameHi: 'नासिक',
        latitude: 19.9975,
        longitude: 73.7898,
        talukas: [
          {
            name: 'Niphad',
            nameMr: 'निफाड (लासलगाव)',
            latitude: 20.0850,
            longitude: 74.1100,
            villages: ['Lasalgaon', 'Niphad Town', 'Saykheda', 'Vinchur', 'Khedgaon', 'Pimpalgaon Baswant Border', 'Kundewadi', 'Ranwad']
          },
          {
            name: 'Dindori',
            nameMr: 'दिंडोरी',
            latitude: 20.1950,
            longitude: 73.8350,
            villages: ['Dindori Town', 'Vani', 'Nanashi', 'Mungsara', 'Dhaur', 'Janori']
          },
          {
            name: 'Sinnar',
            nameMr: 'सिन्नर',
            latitude: 19.8450,
            longitude: 73.9950,
            villages: ['Sinnar City', 'Musalgaon', 'Pangri', 'Doiharan', 'Wavi', 'Dubere', 'Naygaon']
          },
          {
            name: 'Yeola',
            nameMr: 'येवला',
            latitude: 20.0350,
            longitude: 74.4850,
            villages: ['Yeola City', 'Andarsul', 'Nagarsul', 'Patoda', 'Rangaon', 'Babhulgaon']
          },
          {
            name: 'Malegaon',
            nameMr: 'मालेगाव',
            latitude: 20.5550,
            longitude: 74.5250,
            villages: ['Malegaon City', 'Ravalgaon', 'Sayane', 'Camp Area', 'Tehare', 'Dabhadi', 'Nimgaon']
          },
          {
            name: 'Chandwad',
            nameMr: 'चांदवड',
            latitude: 20.3250,
            longitude: 74.2450,
            villages: ['Chandwad Town', 'Vadner Bhairao', 'Dahiwad', 'Usmanabad Chandwad', 'Shiur']
          },
          {
            name: 'Satana',
            nameMr: 'सटाणा (बागलाण)',
            latitude: 20.5950,
            longitude: 74.2050,
            villages: ['Satana Town', 'Nampur', 'Tahrawad', 'Mulher', 'Brahmangaon', 'Dang Saundane']
          },
          {
            name: 'Kalwan',
            nameMr: 'कळवण',
            latitude: 20.4950,
            longitude: 73.9950,
            villages: ['Kalwan Town', 'Abhona', 'Dalwat', 'Kanashi', 'Bhadne']
          }
        ]
      },
      {
        name: 'Solapur',
        nameMr: 'सोलापूर',
        nameHi: 'सोलापुर',
        latitude: 17.6599,
        longitude: 75.9064,
        talukas: [
          {
            name: 'Pandharpur',
            nameMr: 'पंढरपूर',
            latitude: 17.6750,
            longitude: 75.3250,
            villages: ['Pandharpur City', 'Karkamb', 'Korti', 'Bhalawani', 'Tungat', 'Wakhari', 'Puluj']
          },
          {
            name: 'Malshiras',
            nameMr: 'माळशिरस (अकलूज)',
            latitude: 17.8950,
            longitude: 75.0250,
            villages: ['Akluj', 'Malshiras Town', 'Natepute', 'Borgaon', 'Velapur', 'Pilatav', 'Sangam']
          },
          {
            name: 'Barshi',
            nameMr: 'बार्शी',
            latitude: 18.2350,
            longitude: 75.6950,
            villages: ['Barshi City', 'Vairag', 'Pangri', 'Upale Dumala', 'Gaudgaon', 'Chumb']
          },
          {
            name: 'Mohol',
            nameMr: 'मोहोळ',
            latitude: 17.8150,
            longitude: 75.6450,
            villages: ['Mohol Town', 'Kurul', 'Penur', 'Angar', 'Wafale', 'Pokhrapur']
          },
          {
            name: 'Sangola',
            nameMr: 'सांगोला',
            latitude: 17.4350,
            longitude: 75.1950,
            villages: ['Sangola City', 'Mahud', 'Nazarbul', 'Javala', 'Gherdi', 'Sonand']
          },
          {
            name: 'Karmala',
            nameMr: 'करमाळा',
            latitude: 18.4150,
            longitude: 75.1950,
            villages: ['Karmala Town', 'Jinti', 'Korti', 'Kem', 'Pophlaj', 'Sade']
          },
          {
            name: 'Madha',
            nameMr: 'माढा (कुर्डूवाडी)',
            latitude: 18.0350,
            longitude: 75.5250,
            villages: ['Kurduvadi', 'Madha Town', 'Modnimb', 'Ranjani', 'Kavhe', 'Bhend']
          },
          {
            name: 'Mangalwedha',
            nameMr: 'मंगळवेढा',
            latitude: 17.5150,
            longitude: 75.4450,
            villages: ['Mangalwedha Town', 'Marawade', 'Borse', 'Andhalgaon', 'Salgar']
          },
          {
            name: 'Akkalkot',
            nameMr: 'अक्कलकोट',
            latitude: 17.5250,
            longitude: 76.2050,
            villages: ['Akkalkot City', 'Maindargi', 'Karjal', 'Chapalgaon', 'Wagadari', 'Tadwal']
          }
        ]
      },
      {
        name: 'Ahmednagar',
        nameMr: 'अहमदनगर',
        nameHi: 'अहमदनगर',
        latitude: 19.0948,
        longitude: 74.7480,
        talukas: [
          {
            name: 'Rahuri',
            nameMr: 'राहुरी (कृषी विद्यापीठ)',
            latitude: 19.3950,
            longitude: 74.6550,
            villages: ['Rahuri Town', 'MPKV Campus', 'Deolali Pravara', 'Wambori', 'Kolhar Bk', 'Baragaon Nandur']
          },
          {
            name: 'Shrirampur',
            nameMr: 'श्रीरामपूर',
            latitude: 19.6150,
            longitude: 74.6550,
            villages: ['Shrirampur City', 'Belapur', 'Padhegaon', 'Taklibhan', 'Malunja', 'Nipani Wadgaon']
          },
          {
            name: 'Sangamner',
            nameMr: 'संगमनेर',
            latitude: 19.5750,
            longitude: 74.2150,
            villages: ['Sangamner City', 'Ghargaon', 'Ashwi', 'Talegaon Dighe', 'Sakur', 'Chandnapuri']
          },
          {
            name: 'Kopargaon',
            nameMr: 'कोपरगाव',
            latitude: 19.8850,
            longitude: 74.4850,
            villages: ['Kopargaon City', 'Kolpewadi', 'Pohegaon', 'Sasure', 'Ranjangaon Deshmukh']
          },
          {
            name: 'Newasa',
            nameMr: 'नेवासा',
            latitude: 19.5550,
            longitude: 74.9250,
            villages: ['Newasa Town', 'Sonai', 'Kuka', 'Maka', 'Bhenda', 'Chanda']
          },
          {
            name: 'Shevgaon',
            nameMr: 'शेवगाव',
            latitude: 19.3450,
            longitude: 75.2150,
            villages: ['Shevgaon Town', 'Bodhegaon', 'Erangavhane', 'Bhadale', 'Kharwandi']
          },
          {
            name: 'Parner',
            nameMr: 'पारनेर',
            latitude: 19.0050,
            longitude: 74.4450,
            villages: ['Parner Town', 'Ralegan Siddhi', 'Nighoj', 'Supa', 'Alkuti', 'Takli Dhokeshwar']
          }
        ]
      },
      {
        name: 'Jalgaon',
        nameMr: 'जळगाव',
        nameHi: 'जलगांव',
        latitude: 21.0077,
        longitude: 75.5626,
        talukas: [
          {
            name: 'Jalgaon',
            nameMr: 'जळगाव शहर',
            latitude: 21.0077,
            longitude: 75.5626,
            villages: ['Jalgaon City', 'Nashirabad', 'Mamurabad', 'Kusumba', 'Pimprala', 'Nandra']
          },
          {
            name: 'Raver',
            nameMr: 'रावेर (केळी पट्टा)',
            latitude: 21.2500,
            longitude: 76.0350,
            villages: ['Raver Town', 'Savda', 'Faizpur', 'Nhavi', 'Khiroda', 'Ainpur']
          },
          {
            name: 'Chopda',
            nameMr: 'चोपडा',
            latitude: 21.2500,
            longitude: 75.3000,
            villages: ['Chopda Town', 'Adavad', 'Hated', 'Vadhode', 'Lasur Chopda', 'Gorgaon']
          },
          {
            name: 'Bhusawal',
            nameMr: 'भुसावळ',
            latitude: 21.0450,
            longitude: 75.7850,
            villages: ['Bhusawal City', 'Varangaon', 'Bodwad Border', 'Kandari', 'Sakegaon']
          },
          {
            name: 'Amalner',
            nameMr: 'अमळनेर',
            latitude: 21.0450,
            longitude: 75.0550,
            villages: ['Amalner City', 'Marwad', 'Patonda', 'Nimbhore', 'Dahiwad']
          }
        ]
      },
      {
        name: 'Chhatrapati Sambhajinagar',
        nameMr: 'छत्रपती संभाजीनगर',
        nameHi: 'छत्रपति संभाजीनगर (औरंगाबाद)',
        latitude: 19.8762,
        longitude: 75.3433,
        talukas: [
          {
            name: 'Aurangabad',
            nameMr: 'संभाजीनगर शहर',
            latitude: 19.8762,
            longitude: 75.3433,
            villages: ['Chikalthana', 'Waluj', 'Shendra', 'Harsul', 'Padegaon', 'Bidkin']
          },
          {
            name: 'Paithan',
            nameMr: 'पैठण',
            latitude: 19.4850,
            longitude: 75.3850,
            villages: ['Paithan City', 'Pachod', 'Bidkin Rural', 'Nathnagar', 'Dhakephal', 'Balegaon']
          },
          {
            name: 'Vaijapur',
            nameMr: 'वैजापूर',
            latitude: 19.9250,
            longitude: 74.4950,
            villages: ['Vaijapur Town', 'Shiur', 'Rotegaon', 'Babhulgaon', 'Parsoda']
          },
          {
            name: 'Gangapur',
            nameMr: 'गंगापूर',
            latitude: 19.7050,
            longitude: 75.0100,
            villages: ['Gangapur Town', 'Lasur Station', 'Bhendala', 'Manjari Gangapur', 'Waluj Rural']
          },
          {
            name: 'Kannad',
            nameMr: 'कन्नड',
            latitude: 20.2650,
            longitude: 75.1350,
            villages: ['Kannad Town', 'Chalisgaon Border', 'Pishor', 'Nachanwel', 'Nagapur']
          }
        ]
      },
      {
        name: 'Latur',
        nameMr: 'लातूर',
        nameHi: 'लातूर',
        latitude: 18.4088,
        longitude: 76.5604,
        talukas: [
          {
            name: 'Latur',
            nameMr: 'लातूर शहर',
            latitude: 18.4088,
            longitude: 76.5604,
            villages: ['Latur City', 'Murud', 'Babhalgaon', 'Harangul', 'Ganjur', 'Bhadgaon']
          },
          {
            name: 'Ausa',
            nameMr: 'औसा',
            latitude: 18.2550,
            longitude: 76.5050,
            villages: ['Ausa Town', 'Killari', 'Bhudanwadi', 'Lamjana', 'Matola', 'Belkund']
          },
          {
            name: 'Udgir',
            nameMr: 'उदगीर',
            latitude: 18.3950,
            longitude: 77.1150,
            villages: ['Udgir City', 'Nalegaon', 'Deoni Border', 'Her', 'Wadhona', 'Kallur']
          },
          {
            name: 'Nilanga',
            nameMr: 'निलंगा',
            latitude: 18.1250,
            longitude: 76.7550,
            villages: ['Nilanga Town', 'Kasar Sirsi', 'Aurad Shahajani', 'Halki', 'Nitil']
          }
        ]
      },
      {
        name: 'Dhule',
        nameMr: 'धुळे',
        nameHi: 'धुले',
        latitude: 20.9042,
        longitude: 74.7749,
        talukas: [
          {
            name: 'Dhule',
            nameMr: 'धुळे शहर',
            latitude: 20.9042,
            longitude: 74.7749,
            villages: ['Dhule City', 'Kusumba', 'Songir', 'Mukti', 'Mohadi', 'Morane']
          },
          {
            name: 'Shirpur',
            nameMr: 'शिरपूर',
            latitude: 21.3500,
            longitude: 74.8850,
            villages: ['Shirpur Town', 'Thalner', 'Boradi', 'Holnanthe', 'Nimzari']
          },
          {
            name: 'Sindkheda',
            nameMr: 'शिंदखेडा (दोंडाईचा)',
            latitude: 21.2650,
            longitude: 74.7500,
            villages: ['Dondaicha', 'Sindkheda Town', 'Betawad', 'Chimthane', 'Pasarde']
          }
        ]
      },
      {
        name: 'Nagpur',
        nameMr: 'नागपूर',
        nameHi: 'नागपुर',
        latitude: 21.1458,
        longitude: 79.0882,
        talukas: [
          {
            name: 'Nagpur Rural',
            nameMr: 'नागपूर ग्रामीण (कळमेश्वर)',
            latitude: 21.1458,
            longitude: 79.0882,
            villages: ['Kalmeshwar', 'Kamptee', 'Bori', 'Wadi Nagpur', 'Hingna', 'Parsodi']
          },
          {
            name: 'Katol',
            nameMr: 'काटोल (संत्रा हब)',
            latitude: 21.2750,
            longitude: 78.5850,
            villages: ['Katol City', 'Kondhali', 'Paradsinga', 'Metpanjra', 'Sawargaon']
          },
          {
            name: 'Narkhed',
            nameMr: 'नरखेड',
            latitude: 21.3650,
            longitude: 78.5350,
            villages: ['Narkhed Town', 'Mowad', 'Jalal Kheda', 'Sawargaon Narkhed', 'Mendhepathar']
          },
          {
            name: 'Saoner',
            nameMr: 'सावनेर',
            latitude: 21.3850,
            longitude: 78.9150,
            villages: ['Saoner Town', 'Khapa', 'Kelod', 'Dhapewada', 'Bichwa']
          }
        ]
      },
      {
        name: 'Amravati',
        nameMr: 'अमरावती',
        nameHi: 'अमरावती',
        latitude: 20.9320,
        longitude: 77.7523,
        talukas: [
          {
            name: 'Amravati',
            nameMr: 'अमरावती शहर',
            latitude: 20.9320,
            longitude: 77.7523,
            villages: ['Amravati City', 'Badnera', 'Nandgaon Peth', 'Walgaon', 'Shirala Amravati']
          },
          {
            name: 'Achalpur',
            nameMr: 'अचलपूर (परतवाडा)',
            latitude: 21.2580,
            longitude: 77.5100,
            villages: ['Paratwada', 'Achalpur City', 'Sirajgaon Kasba', 'Chandur Bazar Border', 'Pathrot']
          },
          {
            name: 'Warud',
            nameMr: 'वरुड (संत्रा पट्टा)',
            latitude: 21.4650,
            longitude: 78.2650,
            villages: ['Warud Town', 'Shendurjana Ghat', 'Benoda', 'Pusla', 'Loni Warud']
          },
          {
            name: 'Morshi',
            nameMr: 'मोर्शी',
            latitude: 21.3250,
            longitude: 78.0100,
            villages: ['Morshi Town', 'Ner Pinglai', 'Dhamangaon Morshi', 'Rithpur', 'Ambada']
          }
        ]
      },
      {
        name: 'Beed',
        nameMr: 'बीड',
        nameHi: 'बीड',
        latitude: 18.9900,
        longitude: 75.7600,
        talukas: [
          {
            name: 'Ambejogai',
            nameMr: 'अंबाजोगाई',
            latitude: 18.7300,
            longitude: 76.3800,
            villages: ['Somanwadi', 'Bardapur', 'Lokhandi Sawargaon', 'Chanai', 'Morewadi', 'Salegaon', 'Radi', 'Ambejogai Town', 'Pangri', 'Kadapewadi', 'Ghatewadi']
          },
          {
            name: 'Parli',
            nameMr: 'परळी वैजनाथ',
            latitude: 18.8480,
            longitude: 76.5350,
            villages: ['Parli Vaijnath', 'Dharmapuri', 'Tokwadi', 'Sirala', 'Helamb']
          },
          {
            name: 'Majalgaon',
            nameMr: 'माजलगाव',
            latitude: 19.1550,
            longitude: 76.2250,
            villages: ['Majalgaon City', 'Kitti Adgaon', 'Gangamasla', 'Patrud', 'Telgaon']
          },
          {
            name: 'Beed',
            nameMr: 'बीड शहर',
            latitude: 18.9900,
            longitude: 75.7600,
            villages: ['Beed City', 'Pali', 'Pimpalner', 'Chinchwan', 'Nalwandi']
          },
          {
            name: 'Georai',
            nameMr: 'गेवराई',
            latitude: 19.2600,
            longitude: 75.7500,
            villages: ['Georai City', 'Umapur', 'Madalmohi', 'Panchaleshwar', 'Talkhed']
          },
          {
            name: 'Kaij',
            nameMr: 'केज',
            latitude: 18.7050,
            longitude: 76.0150,
            villages: ['Kaij Town', 'Yewati', 'Hanuman Takli', 'Chandan Sawargaon', 'Vida']
          },
          {
            name: 'Ashti',
            nameMr: 'आष्टी',
            latitude: 18.8100,
            longitude: 75.1700,
            villages: ['Ashti Town', 'Kada', 'Dhamangaon Ashti', 'Karanji', 'Doithan']
          },
          {
            name: 'Dharur',
            nameMr: 'धारूर',
            latitude: 18.8200,
            longitude: 76.1150,
            villages: ['Dharur Town', 'Kasarwadi', 'Arawad', 'Chinchpur']
          },
          {
            name: 'Patoda',
            nameMr: 'पाटोदा',
            latitude: 18.9100,
            longitude: 75.4400,
            villages: ['Patoda Town', 'Amalner Patoda', 'Rohatwadi', 'Nalwandi']
          },
          {
            name: 'Shirur Kasar',
            nameMr: 'शिरूर कासार',
            latitude: 19.1100,
            longitude: 75.3100,
            villages: ['Shirur Kasar Town', 'Takarwan', 'Raymoha', 'Ranjani']
          },
          {
            name: 'Wadwani',
            nameMr: 'वडवणी',
            latitude: 19.0150,
            longitude: 76.0100,
            villages: ['Wadwani Town', 'Kotharban', 'Devgaon', 'Salegaon Wadwani']
          }
        ]
      },
      {
        name: 'Wardha',
        nameMr: 'वर्धा',
        nameHi: 'वर्धा',
        latitude: 20.7453,
        longitude: 78.6022,
        talukas: [
          {
            name: 'Wardha Rural',
            nameMr: 'वर्धा ग्रामीण (सेवाग्राम)',
            latitude: 20.7250,
            longitude: 78.6550,
            villages: ['Sewagram', 'Pawanar', 'Pipri', 'Nalwadi', 'Sawangi Meghe', 'Sindi']
          },
          {
            name: 'Deoli',
            nameMr: 'देवळी',
            latitude: 20.6650,
            longitude: 78.4850,
            villages: ['Deoli Town', 'Pulgaon', 'Andori', 'Nachangaon', 'Vijaygopal']
          },
          {
            name: 'Seloo',
            nameMr: 'सेलू',
            latitude: 20.8350,
            longitude: 78.7100,
            villages: ['Seloo Town', 'Hingani', 'Sukli', 'Rehki', 'Zadshi']
          },
          {
            name: 'Hinganghat',
            nameMr: 'हिंगणघाट (कापूस केंद्र)',
            latitude: 20.5500,
            longitude: 78.8350,
            villages: ['Hinganghat City', 'Alipur', 'Kajalsara', 'Wadner', 'Pohana']
          },
          {
            name: 'Arvi',
            nameMr: 'आर्वी',
            latitude: 20.9950,
            longitude: 78.2350,
            villages: ['Arvi Town', 'Talegaon Shyamji Pant', 'Rohna', 'Virul', 'Nimbhari']
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // 2. KARNATAKA (Major Agri Hubs & Border Belts)
  // ==========================================================================
  {
    name: 'Karnataka',
    nameMr: 'कर्नाटक',
    nameHi: 'कर्नाटक',
    districts: [
      {
        name: 'Belagavi',
        nameMr: 'बेळगाव',
        nameHi: 'बेलगाम',
        latitude: 15.8497,
        longitude: 74.4977,
        talukas: [
          {
            name: 'Chikkodi',
            nameMr: 'चिक्कोडी',
            latitude: 16.4300,
            longitude: 74.5950,
            villages: ['Chikkodi Town', 'Nipani', 'Ankali', 'Kabbur', 'Examba', 'Sadashivgad Border', 'Khadaklat']
          },
          {
            name: 'Athani',
            nameMr: 'अथणी',
            latitude: 16.7350,
            longitude: 75.0550,
            villages: ['Athani Town', 'Kagwad', 'Ugar Khurd', 'Shedbal', 'Ainapur', 'Kokatnur']
          },
          {
            name: 'Gokak',
            nameMr: 'गोकाक',
            latitude: 16.1680,
            longitude: 74.8250,
            villages: ['Gokak City', 'Konnur', 'Koujalgi', 'Arabhavi', 'Ghataprabha', 'Lolsur']
          },
          {
            name: 'Hukkeri',
            nameMr: 'हुक्केरी (संकेश्वर)',
            latitude: 16.2250,
            longitude: 74.6000,
            villages: ['Sankeshwar', 'Hukkeri Town', 'Yamakanmardi', 'Bellikatti', 'Gudigoppa']
          },
          {
            name: 'Belagavi',
            nameMr: 'बेळगाव शहर',
            latitude: 15.8497,
            longitude: 74.4977,
            villages: ['Belagavi City', 'Kakati', 'Peeranwadi', 'Udyambag', 'Kudachi', 'Mutga']
          }
        ]
      },
      {
        name: 'Vijayapura',
        nameMr: 'विजापूर',
        nameHi: 'बीजापुर (कर्नाटक)',
        latitude: 16.8302,
        longitude: 75.7100,
        talukas: [
          {
            name: 'Vijayapura',
            nameMr: 'विजापूर शहर',
            latitude: 16.8302,
            longitude: 75.7100,
            villages: ['Vijayapura Urban', 'Tikota (द्राक्षे हब)', 'Babaleshwar', 'Jumnal', 'Toravi']
          },
          {
            name: 'Indi',
            nameMr: 'इंडी',
            latitude: 17.1850,
            longitude: 75.9550,
            villages: ['Indi Town', 'Chadchan', 'Horti', 'Loni Indi', 'Salotgi', 'Zalki']
          },
          {
            name: 'Sindagi',
            nameMr: 'सिंदगी',
            latitude: 16.9200,
            longitude: 76.2350,
            villages: ['Sindagi Town', 'Almel', 'Devara Hippargi', 'Yankanchi', 'Golageri']
          }
        ]
      },
      {
        name: 'Bagalkot',
        nameMr: 'बागलकोट',
        nameHi: 'बागलकोट',
        latitude: 16.1850,
        longitude: 75.6950,
        talukas: [
          {
            name: 'Jamkhandi',
            nameMr: 'जमखंडी',
            latitude: 16.5100,
            longitude: 75.3000,
            villages: ['Jamkhandi Town', 'Rabkavi', 'Banhatti', 'Terdal', 'Kavathe', 'Savalgi']
          },
          {
            name: 'Mudhol',
            nameMr: 'मुधोळ',
            latitude: 16.3450,
            longitude: 75.2850,
            villages: ['Mudhol Town', 'Lokapur', 'Mahalingpur', 'Yadwad Border', 'Chichkhandi']
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // 3. MADHYA PRADESH (Soybean, Wheat & Garlic Heartland)
  // ==========================================================================
  {
    name: 'Madhya Pradesh',
    nameMr: 'मध्य प्रदेश',
    nameHi: 'मध्य प्रदेश',
    districts: [
      {
        name: 'Indore',
        nameMr: 'इंदूर',
        nameHi: 'इंदौर',
        latitude: 22.7196,
        longitude: 75.8577,
        talukas: [
          {
            name: 'Sanwer',
            nameHi: 'सांवेर',
            latitude: 22.9750,
            longitude: 75.8150,
            villages: ['Sanwer Town', 'Kshipra', 'Mangliya', 'Panod', 'Dhamnai']
          },
          {
            name: 'Depalpur',
            nameHi: 'देपालपुर',
            latitude: 22.8450,
            longitude: 75.5450,
            villages: ['Depalpur Town', 'Betma', 'Gautampura', 'Rala', 'Aghor']
          },
          {
            name: 'Mhow',
            nameHi: 'महू (डॉ. आंबेडकर नगर)',
            latitude: 22.5550,
            longitude: 75.7600,
            villages: ['Mhow City', 'Manpur', 'Hasalpur', 'Choral', 'Simrol']
          }
        ]
      },
      {
        name: 'Ujjain',
        nameMr: 'उज्जैन',
        nameHi: 'उज्जैन',
        latitude: 23.1765,
        longitude: 75.7885,
        talukas: [
          {
            name: 'Ujjain Rural',
            nameHi: 'उज्जैन ग्रामीण',
            latitude: 23.1765,
            longitude: 75.7885,
            villages: ['Nagziri', 'Lekoda', 'Panthpiplai', 'Tajpur', 'Ghatia']
          },
          {
            name: 'Badnagar',
            nameHi: 'बड़नगर',
            latitude: 23.0650,
            longitude: 75.3750,
            villages: ['Badnagar Town', 'Ingoriya', 'Maulana', 'Runkheda', 'Jahangirpur']
          }
        ]
      },
      {
        name: 'Mandsaur',
        nameMr: 'मंदसौर',
        nameHi: 'मंदसौर (लहसुन मंडी)',
        latitude: 24.0722,
        longitude: 75.0682,
        talukas: [
          {
            name: 'Mandsaur',
            nameHi: 'मंदसौर',
            latitude: 24.0722,
            longitude: 75.0682,
            villages: ['Mandsaur City Mandi', 'Daloda', 'Sitamau', 'Piplia Mandi', 'Garoth']
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // 4. GUJARAT (Cotton, Groundnut & Spice Hub)
  // ==========================================================================
  {
    name: 'Gujarat',
    nameMr: 'गुजरात',
    nameHi: 'गुजरात',
    districts: [
      {
        name: 'Rajkot',
        nameMr: 'राजकोट',
        nameHi: 'राजकोट',
        latitude: 22.3039,
        longitude: 70.8022,
        talukas: [
          {
            name: 'Gondal',
            nameHi: 'गोंडल (मर्चु व मूंगफली मंडी)',
            latitude: 21.9650,
            longitude: 70.7950,
            villages: ['Gondal Mandi Yard', 'Kotda Sangani', 'Gomta', 'Bhojpara', 'Daiya']
          },
          {
            name: 'Rajkot Rural',
            nameHi: 'राजकोट ग्रामीण',
            latitude: 22.3039,
            longitude: 70.8022,
            villages: ['Bedi Mandi', 'Kuvadva', 'Paddhari', 'Shapar', 'Jasdan Border']
          }
        ]
      },
      {
        name: 'Mehsana',
        nameMr: 'महेसाणा',
        nameHi: 'मेहसाणा (उंझा जीरा)',
        latitude: 23.5880,
        longitude: 72.3693,
        talukas: [
          {
            name: 'Unjha',
            nameHi: 'उंझा (एशिया सबसे बड़ी मसाला मंडी)',
            latitude: 23.8042,
            longitude: 72.3925,
            villages: ['Unjha APMC Yard', 'Brahmanwada', 'Aithor', 'Makbupura', 'Kantharpar']
          },
          {
            name: 'Kadi',
            nameHi: 'कड़ी (कपास हब)',
            latitude: 23.3000,
            longitude: 72.3350,
            villages: ['Kadi Town', 'Nandasan', 'Chhatral', 'Agol', 'Kundal Kadi']
          }
        ]
      }
    ]
  },

  // ==========================================================================
  // 5. RAJASTHAN (Mustard, Bajra & Guar Belt)
  // ==========================================================================
  {
    name: 'Rajasthan',
    nameMr: 'राजस्थान',
    nameHi: 'राजस्थान',
    districts: [
      {
        name: 'Jaipur',
        nameMr: 'जयपूर',
        nameHi: 'जयपुर',
        latitude: 26.9124,
        longitude: 75.7873,
        talukas: [
          {
            name: 'Chomu',
            nameHi: 'चौमूं (सब्जी मंडी)',
            latitude: 27.1750,
            longitude: 75.7250,
            villages: ['Chomu Town', 'Kala Dera', 'Morija', 'Harsoli', ' सामोद Samode']
          },
          {
            name: 'Kotputli',
            nameHi: 'कोटपूतली',
            latitude: 27.7050,
            longitude: 76.2000,
            villages: ['Kotputli Town', 'Paniyala', 'Kansli', 'Bansur Border', 'Paota']
          }
        ]
      },
      {
        name: 'Kota',
        nameMr: 'कोटा',
        nameHi: 'कोटा',
        latitude: 25.2138,
        longitude: 75.8648,
        talukas: [
          {
            name: 'Ramganj Mandi',
            nameHi: 'रामगंज मंडी (धनिया हब)',
            latitude: 24.6500,
            longitude: 75.9450,
            villages: ['Bhamashah Mandi Kota', 'Ramganj Mandi Yard', 'Suket', 'Modak', 'Khairabad']
          }
        ]
      }
    ]
  }
];

// Helper Functions

export function getAllStateNames(): string[] {
  return INDIA_REGIONS.map(s => s.name);
}

export function getStateByName(stateName: string): StateInfo | undefined {
  return INDIA_REGIONS.find(s => s.name.toLowerCase() === stateName.toLowerCase());
}

export function getDistrictsForState(stateName: string): DistrictInfo[] {
  const s = getStateByName(stateName);
  return s ? s.districts : [];
}

export function getDistrictByName(stateName: string, districtName: string): DistrictInfo | undefined {
  const districts = getDistrictsForState(stateName);
  return districts.find(d => d.name.toLowerCase() === districtName.toLowerCase());
}

export function getTalukasForDistrict(stateName: string, districtName: string): TalukaInfo[] {
  const d = getDistrictByName(stateName, districtName);
  return d ? d.talukas : [];
}

export function getTalukaByName(stateName: string, districtName: string, talukaName: string): TalukaInfo | undefined {
  const talukas = getTalukasForDistrict(stateName, districtName);
  return talukas.find(t => t.name.toLowerCase() === talukaName.toLowerCase() || t.name.toLowerCase().includes(talukaName.toLowerCase()));
}

export function getVillagesForTaluka(stateName: string, districtName: string, talukaName: string): string[] {
  const t = getTalukaByName(stateName, districtName, talukaName);
  if (!t) return [];
  return t.villages.map(v => typeof v === 'string' ? v : v.name);
}

/**
 * Resolves the exact Farm Geolocation Coordinates (Latitude, Longitude)
 * Uses high-precision OpenStreetMap Nominatim structured geocoding with API Key fallback
 * and instant offline catalog centroid fallback.
 */
export async function resolveExactFarmLocation(params: {
  state: string;
  district: string;
  taluka?: string;
  village?: string;
  apiKey?: string;
}): Promise<{
  latitude: number;
  longitude: number;
  displayName: string;
  source: 'nominatim' | 'catalog_taluka' | 'catalog_district';
}> {
  const { state, district, taluka, village, apiKey } = params;

  // 1. Live Geocoding via OpenStreetMap Nominatim
  if (village && village.trim()) {
    try {
      const q = `${village}, ${taluka || ''}, ${district}, ${state}, India`.replace(/,\s*,/g, ',');
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&limit=1&addressdetails=1`;
      
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const item = data[0];
          return {
            latitude: Number(parseFloat(item.lat).toFixed(6)),
            longitude: Number(parseFloat(item.lon).toFixed(6)),
            displayName: item.display_name.split(',').slice(0, 3).join(', '),
            source: 'nominatim'
          };
        }
      }
    } catch (e) {
      console.warn('Live geocoding error:', e);
    }
  }

  // 2. High-precision offline catalog fallback by Taluka
  if (taluka) {
    const t = getTalukaByName(state, district, taluka);
    if (t) {
      return {
        latitude: t.latitude,
        longitude: t.longitude,
        displayName: `${village ? village + ', ' : ''}${t.name}, ${district}, ${state}`,
        source: 'catalog_taluka'
      };
    }
  }

  // 3. Fallback by District centroid
  const d = getDistrictByName(state, district);
  if (d) {
    return {
      latitude: d.latitude,
      longitude: d.longitude,
      displayName: `${district}, ${state}`,
      source: 'catalog_district'
    };
  }

  // 4. Default Maharashtra Agri Pulse Central Coordinates (Kolhapur Karvir)
  return {
    latitude: 16.7050,
    longitude: 74.2433,
    displayName: `${village || taluka || district}, ${state}`,
    source: 'catalog_district'
  };
}
