// Complete Multilingual Localization Dictionary for KisanMitra
// Supporting English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali, Punjabi

export type Locale = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'kn' | 'bn' | 'pa';

export interface DashboardTranslations {
  cropTitle: string;
  changeCrop: string;
  changeMarket: string;
  modalPriceLabel: string;
  modalPriceValue: string;
  perQuintal: string;
  forecastDaysLabel: string;
  forecastDaysValue: string;
  forecastRange: string;
  bestMarketLabel: string;
  bestMarketValue: string;
  bestMarketSub: string;
  adviceLabel: string;
  adviceVerdict: string;
  adviceSub: string;

  priceForecastTitle: string;
  priceForecastSampleNote: string;
  todayLabel: string;

  bestMarketsTitle: string;
  tableMarket: string;
  tableDistance: string;
  tableNet: string;
  tableFooterNote: string;

  soilTitle: string;
  soilSubtitle: string;
  soilCrops: string[];

  fertilizerTitle: string;
  fertilizerApproved: string;
  fertilizerStages: string[];
  requestFromStore: string;

  askTitle: string;
  askSubtitle: string;
  askPlaceholder: string;

  footerDisclaimer: string;
}

export interface Translations {
  appName: string;
  tagline: string;
  subtagline: string;
  nav: {
    dashboard: string;
    prices: string;
    forecast: string;
    weather: string;
    markets: string;
    profit: string;
    soil: string;
    store: string;
    chat: string;
    alerts: string;
    disease: string;
    admin: string;
    login: string;
    settings: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrices: string;
    ctaStore: string;
    ctaChat: string;
    linkWhatsApp: string;
  };
  features: {
    mandiTitle: string;
    mandiDesc: string;
    forecastTitle: string;
    forecastDesc: string;
    storeTitle: string;
    storeDesc: string;
    soilTitle: string;
    soilDesc: string;
    whatsappTitle: string;
    whatsappDesc: string;
  };
  store: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterSeeds: string;
    filterFertilizers: string;
    filterPesticides: string;
    requestBtn: string;
    inStock: string;
    expertApproved: string;
    khaatScheduleTitle: string;
    adjustedSoilBadge: string;
  };
  prices: {
    title: string;
    subtitle: string;
    modalPrice: string;
    minPrice: string;
    maxPrice: string;
    arrivals: string;
    sellOrWaitTitle: string;
    verdictSell: string;
    verdictWait: string;
  };
  chat: {
    title: string;
    placeholder: string;
    send: string;
    voiceBtn: string;
    listening: string;
    speaking: string;
    disclaimer: string;
    talkToExpert: string;
  };
  dashboard: DashboardTranslations;
  common: {
    selectCropTitle: string;
    selectMarketTitle: string;
    close: string;
    apply: string;
    rupeePerQuintal: string;
    rupeePerPack: string;
    approvedByExpert: string;
    disclaimerDecision: string;
  };
}

const enTranslations: Translations = {
  appName: 'AgriPulse',
  tagline: 'The Farmer’s Trusted Digital Agricultural Advisor',
  subtagline: 'Real-time Mandi rates, scientific fertilizer schedules, AI chatbot & products right on your phone.',
  nav: {
    dashboard: 'Dashboard',
    prices: 'Prices',
    forecast: 'Forecast',
    weather: 'Weather',
    markets: 'Markets',
    profit: 'Profit & MSP',
    soil: 'Soil',
    store: 'Store',
    chat: 'Chat',
    alerts: 'Alerts',
    disease: 'Disease',
    admin: 'Agronomist',
    login: 'Login',
    settings: 'Settings'
  },
  hero: {
    badge: '🌾 100% Free Open Digital Public Good',
    title: 'Precision Mandi Intelligence, Smart Storage & Crop Care',
    subtitle: 'Live APMC market arrivals, 14-day ML price predictions, ICAR-approved fertilizer regimens, and 24x7 WhatsApp voice advisory.',
    ctaPrices: 'Check Live Mandi Prices',
    ctaStore: 'Explore Store & Fertilizer Plans',
    ctaChat: 'Ask AI Assistant with Voice',
    linkWhatsApp: 'Link WhatsApp'
  },
  features: {
    mandiTitle: 'Live APMC Mandi Rates',
    mandiDesc: 'Min, max, and modal prices across Indian mandis with 90-day trend lines and seasonal arrival patterns.',
    forecastTitle: '14 & 30-Day ML Price Forecasts',
    forecastDesc: 'Probabilistic p10, p50, and p90 price forecasting with explainable SHAP market drivers and risk warnings.',
    storeTitle: 'Farm Inputs & Fertilizer Schedule',
    storeDesc: 'Growth-stage khaat dosages (Basal, 30 days, 60 days) dynamically customized to Soil Health Card data.',
    soilTitle: 'Soil Health & Crop Matching',
    soilDesc: 'Satellite soil texture & pH evaluation coupled with Soil Health Card override for top 5 lucrative crops.',
    whatsappTitle: 'WhatsApp & Telegram Bots',
    whatsappDesc: 'Query in any Indian language with voice notes or text. Receive localized spoken audio responses.'
  },
  store: {
    title: 'KisanMitra Agri Store & Fertilizer Plans',
    subtitle: 'Certified Seeds, Nano Fertilizers & Crop Protection with Direct Enquiry Flow',
    filterAll: 'All Products',
    filterSeeds: 'Certified Seeds',
    filterFertilizers: 'Fertilizers & Nutrients',
    filterPesticides: 'Crop Protection & Bio',
    requestBtn: 'Request Delivery / Enquiry',
    inStock: 'Available Stock',
    expertApproved: 'ICAR / Agri University Verified',
    khaatScheduleTitle: 'Scientific Crop-Wise Fertilizer Schedule',
    adjustedSoilBadge: 'Adjusted for Soil Health Card Values'
  },
  prices: {
    title: 'Today’s APMC Mandi Prices & Arrivals',
    subtitle: 'Track real-time commodities and regional wholesale trends',
    modalPrice: 'Modal Price',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    arrivals: 'Arrivals (Tonnes)',
    sellOrWaitTitle: 'Sell Today or Wait? (Decision Engine)',
    verdictSell: 'SELL NOW (Favorable Peak)',
    verdictWait: 'WAIT & STORE (Upcoming Rise)'
  },
  chat: {
    title: 'KisanMitra Multilingual AI Companion',
    placeholder: 'Speak or type in your language (e.g. When to apply second dose of urea in wheat?)',
    send: 'Send',
    voiceBtn: 'Speak Question',
    listening: 'Listening... Please speak',
    speaking: 'Playing audio answer...',
    disclaimer: 'Grounding rule: Answers derived strictly from verified agronomic documents. For crop emergencies, consult local KVK.',
    talkToExpert: 'Talk to Agronomist (Human Handoff)'
  },
  dashboard: {
    cropTitle: 'Onion · Lasalgaon, Maharashtra',
    changeCrop: 'Change crop',
    changeMarket: 'Change market',
    modalPriceLabel: "Today's modal price",
    modalPriceValue: '₹2,300',
    perQuintal: '/ quintal',
    forecastDaysLabel: 'Forecast in 14 days',
    forecastDaysValue: '₹2,450',
    forecastRange: 'Range ₹2,200 to ₹2,700',
    bestMarketLabel: 'Best market, net income',
    bestMarketValue: '₹2,180',
    bestMarketSub: 'Lasalgaon, 24 km away',
    adviceLabel: 'Advice',
    adviceVerdict: 'Wait',
    adviceSub: 'Prices may rise as arrivals fall',

    priceForecastTitle: 'Price forecast',
    priceForecastSampleNote: 'Most likely ₹2,450, range ₹2,200 to ₹2,700. Sample data.',
    todayLabel: 'Today',

    bestMarketsTitle: 'Best markets by net income',
    tableMarket: 'Market',
    tableDistance: 'Distance',
    tableNet: 'Net per quintal',
    tableFooterNote: 'Price minus transport, fee and loss. Rates are editable.',

    soilTitle: 'Soil and crop suggestions',
    soilSubtitle: 'Black soil, pH about 7.6 (satellite estimate, not a lab test)',
    soilCrops: [
      '1. Soybean, expected profit ₹38,500/acre',
      '2. Cotton, expected profit ₹34,200/acre',
      '3. Onion, expected profit ₹42,000/acre'
    ],

    fertilizerTitle: 'Fertilizer plan (khaat)',
    fertilizerApproved: 'Approved by company agronomist',
    fertilizerStages: [
      'At sowing: basal dose',
      '30 days: top dressing',
      '60 days: second top dressing'
    ],
    requestFromStore: 'Request from store',

    askTitle: 'Ask KisanMitra',
    askSubtitle: 'Type or speak in your language',
    askPlaceholder: 'When should I sell?',

    footerDisclaimer: 'Forecast is decision support, not a guarantee. Figures shown are sample data.'
  },
  common: {
    selectCropTitle: 'Select Crop',
    selectMarketTitle: 'Select Market',
    close: 'Close',
    apply: 'Apply',
    rupeePerQuintal: '₹/quintal',
    rupeePerPack: '₹',
    approvedByExpert: 'Expert Approved',
    disclaimerDecision: 'Forecast is decision support, not a guarantee.'
  }
};

const hiTranslations: Translations = {
  appName: 'AgriPulse (किसानमित्र)',
  tagline: 'भारतीय किसानों का सच्चा साथी व सलाहकार',
  subtagline: 'सही मंडी भाव, खाद का समय, AI चैटबॉट और कृषि उत्पाद सीधे आपके फोन पर।',
  nav: {
    dashboard: 'डैशबोर्ड',
    prices: 'मंडी भाव',
    forecast: 'पूर्वानुमान',
    weather: 'मौसम व छिड़काव',
    markets: 'मंडी तुलना',
    profit: 'मुनाफा व MSP',
    soil: 'मिट्टी व फसल',
    store: 'खाद-बीज स्टोर',
    chat: 'AI सहायक',
    alerts: 'अलर्ट',
    disease: 'रोग पहचान',
    admin: 'कृषि विशेषज्ञ',
    login: 'लॉगिन',
    settings: 'सेटिंग्स'
  },
  hero: {
    badge: '🌾 100% निःशुल्क किसान डिजिटल सेवा',
    title: 'सही मंडी, सही भाव और सही खाद का सटीक फैसला',
    subtitle: 'मंडी के ताजा भाव, 14 दिनों का सटीक पूर्वानुमान, ICAR प्रमाणित खाद अनुसूची और व्हाट्सएप पर 24x7 सलाह।',
    ctaPrices: 'आज के मंडी भाव देखें',
    ctaStore: 'खाद-बीज स्टोर व खाद तालिका',
    ctaChat: 'AI सहायक से पूछें (आवाज से)',
    linkWhatsApp: 'व्हाट्सएप से जोड़ें'
  },
  features: {
    mandiTitle: 'लाइव APMC मंडी भाव',
    mandiDesc: 'देशभर की मंडियों के न्यूनतम, अधिकतम और मॉडल भाव। 90 दिनों का ट्रेंड व मौसमी ग्राफ।',
    forecastTitle: '14 व 30 दिन का भाव अनुमान',
    forecastDesc: 'AI मशीन लर्निंग द्वारा भाव के उतार-चढ़ाव (p10, p50, p90) का वैज्ञानिक विश्लेषण।',
    storeTitle: 'खाद-बीज स्टोर व खाद शेड्यूल',
    storeDesc: 'फसल की अवस्था अनुसार वैज्ञानिक खाद डोज (बेसल, 30 दिन, 60 दिन) व घर बैठे मंगाने की सुविधा।',
    soilTitle: 'मृदा स्वास्थ्य व फसल चयन',
    soilDesc: 'मिट्टी की जांच (Soil Card) के अनुसार फसल व खाद की मात्रा में स्वचालित सुधार।',
    whatsappTitle: 'व्हाट्सएप व टेलीग्राम बॉट',
    whatsappDesc: 'अपनी मातृभाषा में बोलकर या लिखकर सवाल पूछें। वॉइस नोट में ही तुरंत जवाब पाएं।'
  },
  store: {
    title: 'किसानमित्र कृषि स्टोर व खाद तालिका',
    subtitle: 'प्रमाणित बीज, नैनो यूरिया, डीएपी व फसल सुरक्षा उत्पाद — सीधे मंगाएं',
    filterAll: 'सभी उत्पाद',
    filterSeeds: 'प्रमाणित बीज',
    filterFertilizers: 'खाद व उर्वरक',
    filterPesticides: 'कीटनाशक व फफूंदनाशक',
    requestBtn: 'ऑर्डर / पूछताछ भेजें',
    inStock: 'उपलब्ध स्टॉक',
    expertApproved: 'ICAR कृषि विश्वविद्यालय द्वारा अनुमोदित',
    khaatScheduleTitle: 'फसलावस्था अनुसार वैज्ञानिक खाद तालिका',
    adjustedSoilBadge: 'मृदा स्वास्थ्य कार्ड (Soil Health Card) से समायोजित'
  },
  prices: {
    title: 'आज के ताजा मंडी भाव व आवक',
    subtitle: 'अपने नजदीकी APMC मंडी के प्रामाणिक भाव देखें',
    modalPrice: 'मॉडल भाव',
    minPrice: 'न्यूनतम',
    maxPrice: 'अधिकतम',
    arrivals: 'दैनिक आवक',
    sellOrWaitTitle: 'आज बेचें या रुकें? (निर्णय इंजन)',
    verdictSell: 'आज ही बेचें (Sell Now)',
    verdictWait: 'रुकें व भंडारण करें (Wait & Store)'
  },
  chat: {
    title: 'किसानमित्र AI कृषक साथी',
    placeholder: 'अपनी भाषा में बोलें या लिखें (जैसे: गेंहू में पहली खाद कब दें?)',
    send: 'भेजें',
    voiceBtn: 'बोलकर पूछें',
    listening: 'सुन रहा है... बोलिए',
    speaking: 'उत्तर सुना रहा है...',
    disclaimer: 'यह AI सलाह ICAR दस्तावेजों पर आधारित है। आपात स्थिति में स्थानीय कृषि केंद्र से संपर्क करें।',
    talkToExpert: 'कृषि विशेषज्ञ (Agronomist) से बात करें'
  },
  dashboard: {
    cropTitle: 'प्याज · लासलगांव, महाराष्ट्र',
    changeCrop: 'फसल बदलें',
    changeMarket: 'मंडी बदलें',
    modalPriceLabel: 'आज का मॉडल भाव',
    modalPriceValue: '₹2,300',
    perQuintal: '/ क्विंटल',
    forecastDaysLabel: '14 दिन में भाव अनुमान',
    forecastDaysValue: '₹2,450',
    forecastRange: 'सीमा ₹2,200 से ₹2,700',
    bestMarketLabel: 'सर्वोत्तम मंडी, शुद्ध आय',
    bestMarketValue: '₹2,180',
    bestMarketSub: 'लासलगांव, 24 किमी दूर',
    adviceLabel: 'सलाह',
    adviceVerdict: 'रुकें (Wait)',
    adviceSub: 'आवक घटने से भाव बढ़ सकते हैं',

    priceForecastTitle: 'भाव पूर्वानुमान (Price forecast)',
    priceForecastSampleNote: 'सबसे संभावित ₹2,450, रेंज ₹2,200 से ₹2,700. नमूना डेटा।',
    todayLabel: 'आज',

    bestMarketsTitle: 'शुद्ध आय अनुसार प्रमुख मंडियां',
    tableMarket: 'मंडी',
    tableDistance: 'दूरी',
    tableNet: 'शुद्ध प्रति क्विंटल',
    tableFooterNote: 'भाड़ा, मंडी शुल्क व घट काटकर। दरें संपादन योग्य हैं।',

    soilTitle: 'मृदा व फसल सुझाव',
    soilSubtitle: 'काली मिट्टी, pH लगभग 7.6 (सैटेलाइट अनुमान, लैब टेस्ट नहीं)',
    soilCrops: [
      '1. सोयाबीन, अपेक्षित लाभ ₹38,500/एकड़',
      '2. कपास, अपेक्षित लाभ ₹34,200/एकड़',
      '3. प्याज, अपेक्षित लाभ ₹42,000/एकड़'
    ],

    fertilizerTitle: 'खाद अनुसूची (Fertilizer plan)',
    fertilizerApproved: 'कंपनी कृषि विशेषज्ञ द्वारा अनुमोदित',
    fertilizerStages: [
      'बुवाई के समय: बेसल डोज (DAP + पोटाश)',
      '30 दिन: पहली टॉप ड्रेसिंग (नीम कोटेड यूरिया)',
      '60 दिन: द्वितीय टॉप ड्रेसिंग (पोषक छिड़काव)'
    ],
    requestFromStore: 'स्टोर से मंगाएं',

    askTitle: 'किसानमित्र से पूछें',
    askSubtitle: 'अपनी भाषा में बोलें या टाइप करें',
    askPlaceholder: 'मैं फसल कब बेचूं?',

    footerDisclaimer: 'पूर्वानुमान केवल निर्णय सहायता है, गारंटी नहीं। प्रदर्शित आंकड़े नमूना डेटा हैं।'
  },
  common: {
    selectCropTitle: 'फसल चुनें',
    selectMarketTitle: 'मंडी चुनें',
    close: 'बंद करें',
    apply: 'लागू करें',
    rupeePerQuintal: '₹/क्विंटल',
    rupeePerPack: '₹',
    approvedByExpert: 'विशेषज्ञ अनुमोदित',
    disclaimerDecision: 'पूर्वानुमान केवल निर्णय सहायता है, गारंटी नहीं।'
  }
};

const mrTranslations: Translations = {
  appName: 'AgriPulse (किसानमित्र)',
  tagline: 'महाराष्ट्रातील शेतकरी बांधवांचा विश्वासू मार्गदर्शक',
  subtagline: 'अचूक बाजारभाव, खत व्यवस्थापन, AI चॅटबॉट आणि कृषी उत्पादने आपल्या मोबाईलवर.',
  nav: {
    dashboard: 'डॅशबोर्ड',
    prices: 'बाजारभाव',
    forecast: 'भाव अंदाज',
    weather: 'हवामान व फवारणी',
    markets: 'विक्री की साठवणूक',
    profit: 'नफा व MSP',
    soil: 'माती व पीक',
    store: 'खत-बियाणे दालन',
    chat: 'AI सल्लागार',
    alerts: 'सूचना',
    disease: 'रोग निदान',
    admin: 'कृषी तज्ञ',
    login: 'लॉगिन',
    settings: 'सेटिंग्ज'
  },
  hero: {
    badge: '🌾 १००% मोफत शेतकरी डिजिटल सेवा',
    title: 'योग्य बाजारपेठ, योग्य भाव आणि खतांचे अचूक नियोजन',
    subtitle: 'ताजे कृषी उत्पन्न बाजार समिती भाव, पुढील १४ दिवसांचा भाव अंदाज आणि व्हॉट्सॲपवर २४x७ मार्गदर्शन.',
    ctaPrices: 'आजचे बाजारभाव तपासा',
    ctaStore: 'खत-बियाणे दालन व खत वेळापत्रक',
    ctaChat: 'AI सल्लागाराला आवाजात विचारा',
    linkWhatsApp: 'व्हॉट्सॲप लिंक करा'
  },
  features: {
    mandiTitle: 'थेट APMC बाजारभाव',
    mandiDesc: 'लासलगाव, नाशिक, इंदूर सह सर्व प्रमुख बाजार समित्यांचे आजचे किमान, कमाल व सरासरी भाव.',
    forecastTitle: '१४ व ३० दिवसांचा अंदाज',
    forecastDesc: 'AI मशीन लर्निंग तंत्रज्ञानावर आधारित भावातील चढउतारांचे वैज्ञानिक विश्लेषण.',
    storeTitle: 'खत-बियाणे दालन व वेळापत्रक',
    storeDesc: 'पिकांच्या वाढीच्या टप्प्यानुसार (पेरणी, ३० दिवस, ६० दिवस) शास्त्रीय खत डोस आणि घरपोच मागणी.',
    soilTitle: 'मृदा आरोग्य व पीक निवड',
    soilDesc: 'माती परीक्षणानुसार पिकांची शिफारस व खतांच्या प्रमाणामध्ये अचूक बदल.',
    whatsappTitle: 'व्हॉट्सॲप व टेलिग्राम बॉट',
    whatsappDesc: 'मराठीत बोलून किंवा टाईप करून प्रश्न विचारा, व्हॉईस नोटमध्ये उत्तर मिळवा.'
  },
  store: {
    title: 'किसानमित्र कृषी दालन व खत वेळापत्रक',
    subtitle: 'प्रमाणित बियाणे, नॅनो युरिया, डीएपी व पीक संरक्षण — घरपोच मागणी करा',
    filterAll: 'सर्व उत्पादने',
    filterSeeds: 'प्रमाणित बियाणे',
    filterFertilizers: 'खते व सूक्ष्म अन्नद्रव्ये',
    filterPesticides: 'कीटकनाशके व बुरशीनाशके',
    requestBtn: 'मागणी नोंदवा / चौकशी करा',
    inStock: 'उपलब्ध साठा',
    expertApproved: 'कृषी विद्यापीठ व तज्ञांद्वारे प्रमाणित',
    khaatScheduleTitle: 'पिकाच्या वाढीनुसार शास्त्रीय खत वेळापत्रक',
    adjustedSoilBadge: 'माती परीक्षण अहवालानुसार (Soil Card) समायोजित'
  },
  prices: {
    title: 'आजचे ताजे कृषी उत्पन्न बाजारभाव',
    subtitle: 'आपल्या जवळच्या बाजार समितीचे अचूक भाव पहा',
    modalPrice: 'सरासरी भाव',
    minPrice: 'किमान',
    maxPrice: 'कमाल',
    arrivals: 'दैनिक आवक',
    sellOrWaitTitle: 'माल आज विकावा की साठवावा? (निर्णय सहाय्यक)',
    verdictSell: 'आजच विका (Sell Now)',
    verdictWait: 'साठवणूक करा (Wait & Store)'
  },
  chat: {
    title: 'किसानमित्र AI कृषी मित्र',
    placeholder: 'मराठीत बोला किंवा टाईप करा (उदा: कांद्यावरील करपा रोगावर काय उपाय?)',
    send: 'पाठवा',
    voiceBtn: 'आवाजात विचारा',
    listening: 'ऐकत आहे... बोला',
    speaking: 'उत्तर वाचून दाखवत आहे...',
    disclaimer: 'हा सल्ला ICAR च्या अधिकृत नोंदींवर आधारित आहे. तातडीच्या मदतीसाठी स्थानिक कृषी विज्ञान केंद्राशी संपर्क साधा.',
    talkToExpert: 'कृषी तज्ञांशी बोला (Talk to Expert)'
  },
  dashboard: {
    cropTitle: 'कांदा · लासलगाव, महाराष्ट्र',
    changeCrop: 'पीक बदला',
    changeMarket: 'बाजार समिती बदला',
    modalPriceLabel: 'आजचा सरासरी भाव',
    modalPriceValue: '₹२,३००',
    perQuintal: '/ क्विंटल',
    forecastDaysLabel: '१४ दिवसांचा भाव अंदाज',
    forecastDaysValue: '₹२,४५०',
    forecastRange: 'अपेक्षित कक्षा ₹२,२०० ते ₹२,७००',
    bestMarketLabel: 'उत्तम बाजारपेठ, निव्वळ नफा',
    bestMarketValue: '₹२,१८०',
    bestMarketSub: 'लासलगाव, २४ किमी अंतर',
    adviceLabel: 'सल्ला',
    adviceVerdict: 'थांबा (Wait)',
    adviceSub: 'आवक घटल्याने भावात वाढ संभवते',

    priceForecastTitle: 'भाव अंदाज (Price forecast)',
    priceForecastSampleNote: 'सर्वाधिक शक्यता ₹२,४५०, मर्यादा ₹२,२०० ते ₹२,७००. नमुना माहिती.',
    todayLabel: 'आज',

    bestMarketsTitle: 'निव्वळ नफ्यानुसार उत्तम बाजार समित्या',
    tableMarket: 'बाजार समिती',
    tableDistance: 'अंतर',
    tableNet: 'निव्वळ प्रति क्विंटल',
    tableFooterNote: 'वाहतूक खर्च व घट वजा जाता. दर बदलता येतील.',

    soilTitle: 'माती व पीक शिफारसी',
    soilSubtitle: 'काळी कसदार जमीन, pH सुमारे ७.६ (उपग्रह अंदाज, प्रयोगशाळा चाचणी नाही)',
    soilCrops: [
      '१. सोयाबीन, अपेक्षित नफा ₹३८,५००/एकर',
      '२. कापूस, अपेक्षित नफा ₹३४,२००/एकर',
      '३. कांदा, अपेक्षित नफा ₹४२,०००/एकर'
    ],

    fertilizerTitle: 'खत वेळापत्रक (खात नियोजन)',
    fertilizerApproved: 'कंपनी कृषी तज्ञांद्वारे प्रमाणित',
    fertilizerStages: [
      'पेरणीच्या वेळी: बेसल डोस (डीएपी + पोटॅश)',
      '३० दिवस: पहिली खत मात्रा (युरिया)',
      '६० दिवस: दुसरी खत मात्रा (फवारणी)'
    ],
    requestFromStore: 'स्टोअरमधून मागवा',

    askTitle: 'किसानमित्रला विचारा',
    askSubtitle: 'आपल्या भाषेत बोला किंवा टाईप करा',
    askPlaceholder: 'मी माल कधी विकावा?',

    footerDisclaimer: 'अंदाज हा निर्णय समर्थनासाठी आहे, हमी नाही. दर्शविलेले आकडे नमुना डेटा आहेत.'
  },
  common: {
    selectCropTitle: 'पीक निवडा',
    selectMarketTitle: 'बाजार समिती निवडा',
    close: 'बंद करा',
    apply: 'लागू करा',
    rupeePerQuintal: '₹/क्विंटल',
    rupeePerPack: '₹',
    approvedByExpert: 'तज्ञ प्रमाणित',
    disclaimerDecision: 'अंदाज हा निर्णय समर्थनासाठी आहे, हमी नाही.'
  }
};

const guTranslations: Translations = {
  appName: 'AgriPulse (કિસાનમિત્ર)',
  tagline: 'ભારતીય ખેડૂતોનો વિશ્વાસુ ડિજિટલ કૃષિ સલાહકાર',
  subtagline: 'સાચા APMC બજાર ભાવ, ખાતર વ્યવસ્થાપન, AI ચેટબોટ અને કૃષિ ઉત્પાદનો તમારા ફોન પર.',
  nav: {
    dashboard: 'ડેશબોર્ડ',
    prices: 'બજાર ભાવ',
    forecast: 'ભાવ અનુમાન',
    weather: 'હવામાન',
    markets: 'બજાર સરખામણી',
    profit: 'નફો અને MSP',
    soil: 'જમીન અને પાક',
    store: 'કૃષિ સ્ટોર',
    chat: 'AI સહાયક',
    alerts: 'સૂચનાઓ',
    disease: 'રોગ નિદાન',
    admin: 'કૃષિ નિષ્ણાત',
    login: 'લૉગિન',
    settings: 'સેટિંગ્સ'
  },
  hero: {
    badge: '🌾 ૧૦૦% નિઃશુલ્ક ડિજિટલ કિસાન સેવા',
    title: 'સાચી બજારપેઠ, સાચો ભાવ અને ખાતરનું સચોટ આયોજન',
    subtitle: 'તાજા APMC બજાર ભાવ, ૧૪ દિવસનું ભાવ અનુમાન, ICAR પ્રમાણિત ખાતર આયોજન અને વોટ્સએપ પર ૨૪x૭ સલાહ.',
    ctaPrices: 'આજના બજાર ભાવ જુઓ',
    ctaStore: 'ખાતર-બિયારણ સ્ટોર',
    ctaChat: 'AI સહાયકને અવાજથી પૂછો',
    linkWhatsApp: 'વોટ્સએપ જોડો'
  },
  features: {
    mandiTitle: 'લાઈવ APMC બજાર ભાવ',
    mandiDesc: 'ગુજરાત અને ભારતીય બજારોના લઘુત્તમ, મહત્તમ અને મોડલ ભાવ.',
    forecastTitle: '૧૪ અને ૩૦ દિવસનું ભાવ અનુમાન',
    forecastDesc: 'AI મશીન લર્નિંગ દ્વારા ભાવ વધઘટનું વૈજ્ઞાનિક વિશ્લેષણ.',
    storeTitle: 'બિયારણ-ખાતર અને સમયપત્રક',
    storeDesc: 'પાકના તબક્કા મુજબ પ્રમાણિત ખાતર ડોઝ અને ઓર્ડરની સુવિધા.',
    soilTitle: 'જમીન આરોગ્ય અને પાક પસંદગી',
    soilDesc: 'સોઇલ હેલ્થ કાર્ડ મુજબ નફાકારક પાક અને ખાતરમાં સુધારો.',
    whatsappTitle: 'વોટ્સએપ અને ટેલિગ્રામ બોટ',
    whatsappDesc: 'તમારી માતૃભાષામાં બોલીને કે લખીને પ્રશ્નો પૂછો.'
  },
  store: {
    title: 'કિસાનમિત્ર કૃષિ સ્ટોર અને ખાતર આયોજન',
    subtitle: 'પ્રમાણિત બિયારણ, નેનો યુરિયા, ડીએપી અને પાક સંરક્ષણ ઉત્પાદનો',
    filterAll: 'બધા ઉત્પાદનો',
    filterSeeds: 'પ્રમાણિત બિયારણ',
    filterFertilizers: 'ખાતર અને પોષક તત્વો',
    filterPesticides: 'જંતુનાશક અને ફૂગનાશક',
    requestBtn: 'ઓર્ડર / પૂછપરછ મોકલો',
    inStock: 'ઉપલબ્ધ સ્ટોક',
    expertApproved: 'ICAR / કૃષિ યુનિવર્સિટી માન્ય',
    khaatScheduleTitle: 'વૈજ્ઞાનિક પાકવાર ખાતર સમયપત્રક',
    adjustedSoilBadge: 'સોઇલ હેલ્થ કાર્ડ મુજબ સુધારેલ'
  },
  prices: {
    title: 'આજના તાજા APMC બજાર ભાવ અને આવક',
    subtitle: 'નજીકના માર્કેટ યાર્ડના અધિકૃત ભાવ જુઓ',
    modalPrice: 'મોડલ ભાવ',
    minPrice: 'લઘુત્તમ',
    maxPrice: 'મહત્તમ',
    arrivals: 'દૈનિક આવક',
    sellOrWaitTitle: 'આજે વેચવું કે રાહ જોવી? (નિર્ણય સહાયક)',
    verdictSell: 'આજે જ વેચો (Sell Now)',
    verdictWait: 'રાહ જુઓ અને સંગ્રહ કરો (Wait & Store)'
  },
  chat: {
    title: 'કિસાનમિત્ર AI સહાયક',
    placeholder: 'ગુજરાતીમાં બોલો અથવા લખો (દા.ત. ઘઉંમાં પહેલું ખાતર ક્યારે આપવું?)',
    send: 'મોકલો',
    voiceBtn: 'બોલીને પૂછો',
    listening: 'સાંભળી રહ્યા છીએ... બોલો',
    speaking: 'જવાબ સંભળાવી રહ્યા છીએ...',
    disclaimer: 'આ સલાહ ICAR દસ્તાવેજો પર આધારિત છે. કટોકટીમાં સ્થાનિક કૃષિ વિજ્ઞાન કેન્દ્રનો સંપર્ક કરો.',
    talkToExpert: 'કૃષિ નિષ્ણાત સાથે વાત કરો'
  },
  dashboard: {
    cropTitle: 'ડુંગળી · લાંસલગાવ, મહારાષ્ટ્ર',
    changeCrop: 'પાક બદલો',
    changeMarket: 'માર્કેટ યાર્ડ બદલો',
    modalPriceLabel: 'આજનો મોડલ ભાવ',
    modalPriceValue: '₹૨,૩૦૦',
    perQuintal: '/ ક્વિન્ટલ',
    forecastDaysLabel: '૧૪ દિવસમાં ભાવ અનુમાન',
    forecastDaysValue: '₹૨,૪૫૦',
    forecastRange: 'રેન્જ ₹૨,૨૦૦ થી ₹૨,૭૦૦',
    bestMarketLabel: 'શ્રેષ્ઠ માર્કેટ યાર્ડ, ચોખ્ખી આવક',
    bestMarketValue: '₹૨,૧૮૦',
    bestMarketSub: 'લાંસલગાવ, ૨૪ કિમી દૂર',
    adviceLabel: 'સલાહ',
    adviceVerdict: 'રાહ જુઓ (Wait)',
    adviceSub: 'આવક ઘટવાથી ભાવ વધી શકે છે',
    priceForecastTitle: 'ભાવ અનુમાન (Price Forecast)',
    priceForecastSampleNote: 'સંભવિત ભાવ ₹૨,૪૫૦, રેન્જ ₹૨,૨૦૦ થી ₹૨,૭૦૦. નમૂના માહિતી.',
    todayLabel: 'આજે',
    bestMarketsTitle: 'ચોખ્ખી આવક મુજબ મુખ્ય બજારો',
    tableMarket: 'માર્કેટ યાર્ડ',
    tableDistance: 'અંતર',
    tableNet: 'ચોખ્ખી આવક પ્રતિ ક્વિન્ટલ',
    tableFooterNote: 'ભાડું અને ખર્ચ બાદ કર્યા પછી. દરો સંપાદન કરી શકાય છે.',
    soilTitle: 'જમીન અને પાક ભલામણો',
    soilSubtitle: 'કાળી જમીન, pH લગભગ ૭.૬ (સેટેલાઇટ અંદાજ)',
    soilCrops: [
      '૧. સોયાબીન, અપેક્ષિત નફો ₹૩૮,૫૦૦/એકર',
      '૨. કપાસ, અપેક્ષિત નફો ₹૩૪,૨૦૦/એકર',
      '૩. ડુંગળી, અપેક્ષિત નફો ₹૪૨,૦૦૦/એકર'
    ],
    fertilizerTitle: 'ખાતર સમયપત્રક (Fertilizer Plan)',
    fertilizerApproved: 'કૃષિ નિષ્ણાત દ્વારા પ્રમાણિત',
    fertilizerStages: [
      'વાવણી વખતે: બેસલ ડોઝ (DAP + પોટાશ)',
      '૩૦ દિવસ: પહેલો ટોપ ડ્રેસિંગ (યુરિયા)',
      '૬૦ દિવસ: બીજો ટોપ ડ્રેસિંગ (સ્પ્રે)'
    ],
    requestFromStore: 'સ્ટોરમાંથી મંગાવો',
    askTitle: 'કિસાનમિત્રને પૂછો',
    askSubtitle: 'તમારી ભાષામાં બોલો અથવા ટાઈપ કરો',
    askPlaceholder: 'હું માલ ક્યારે વેચું?',
    footerDisclaimer: 'અનુમાન નિર્ણય સહાય માટે છે, ગેરંટી નથી.'
  },
  common: {
    selectCropTitle: 'પાક પસંદ કરો',
    selectMarketTitle: 'માર્કેટ યાર્ડ પસંદ કરો',
    close: 'બંધ કરો',
    apply: 'લાગુ કરો',
    rupeePerQuintal: '₹/ક્વિન્ટલ',
    rupeePerPack: '₹',
    approvedByExpert: 'નિષ્ણાત માન્ય',
    disclaimerDecision: 'અનુમાન નિર્ણય સહાય માટે છે, ગેરંટી નથી.'
  }
};

const taTranslations: Translations = {
  appName: 'AgriPulse (கிசான்மித்ரா)',
  tagline: 'விவசாயிகளின் நம்பகமான டிஜிட்டல் வேளாண் ஆலோசகர்',
  subtagline: 'நேரலை சந்தை விலைகள், உர அட்டவணை, AI உதவியாளர் உங்கள் மொபைலில்.',
  nav: {
    dashboard: 'முகப்பு',
    prices: 'சந்தை விலைகள்',
    forecast: 'விலை கணிப்பு',
    weather: 'வானிலை',
    markets: 'சந்தை ஒப்பீடு',
    profit: 'லாபம் & MSP',
    soil: 'மண் & பயிர்',
    store: 'விவசாய அங்காடி',
    chat: 'AI உதவியாளர்',
    alerts: 'அறிவிப்புகள்',
    disease: 'நோய் கண்டறிதல்',
    admin: 'வேளாண் நிபுணர்',
    login: 'உள்நுழைக',
    settings: 'அமைப்புகள்'
  },
  hero: {
    badge: '🌾 100% இலவச டிஜிட்டல் உழவர் சேவை',
    title: 'துல்லியமான சந்தை நிலவரம், உகந்த விற்பனை மற்றும் பயிர் பராமரிப்பு',
    subtitle: 'நேரலை APMC சந்தை விலைகள், 14 நாள் விலை கணிப்பு, ICAR சான்றளிக்கப்பட்ட உர அட்டவணை.',
    ctaPrices: 'இன்றைய விலைகளை காண்க',
    ctaStore: 'உர அங்காடி & திட்டங்கள்',
    ctaChat: 'AI உதவியாளரிடம் பேசவும்',
    linkWhatsApp: 'வாட்ஸ்அப் இணைக்கவும்'
  },
  features: {
    mandiTitle: 'நேரலை APMC சந்தை விலைகள்',
    mandiDesc: 'அனைத்து முக்கிய சந்தைகளின் குறைந்தபட்ச, அதிகபட்ச மற்றும் மாதிரி விலைகள்.',
    forecastTitle: '14 & 30 நாள் விலை கணிப்பு',
    forecastDesc: 'AI இயந்திர கற்றல் மூலம் கணிக்கப்பட்ட துல்லிய விலை மாற்றங்கள்.',
    storeTitle: 'விவசாய இடுபொருட்கள் & உர அட்டவணை',
    storeDesc: 'பயிரின் வளர்ச்சி நிலைக்கு ஏற்ப உர அளவு மற்றும் நேரடி முன்பதிவு.',
    soilTitle: 'மண் வளம் & பயிர் தேர்வு',
    soilDesc: 'மண் பரிசோதனை அட்டை அடிப்படையில் சிறந்த 5 லாபகரமான பயிர்கள்.',
    whatsappTitle: 'வாட்ஸ்அப் & டெலிகிராம் பாட்',
    whatsappDesc: 'உங்கள் தாய்மொழியில் பேசி அல்லது தட்டச்சு செய்து தீர்வு பெறுங்கள்.'
  },
  store: {
    title: 'கிசான்மித்ரா விவசாய அங்காடி & உரத் திட்டம்',
    subtitle: 'சான்றளிக்கப்பட்ட விதைகள், நானோ யூரியா, DAP & பயிர் பாதுகாப்பு',
    filterAll: 'அனைத்து பொருட்கள்',
    filterSeeds: 'சான்றளிக்கப்பட்ட விதைகள்',
    filterFertilizers: 'உரங்கள் & ஊட்டச்சத்துக்கள்',
    filterPesticides: 'பயிர் பாதுகாப்பு',
    requestBtn: 'ஆர்டர் / விசாரணை செய்க',
    inStock: 'கையிருப்பு உள்ளது',
    expertApproved: 'ICAR / வேளாண் பல்கலை அங்கீகரித்தது',
    khaatScheduleTitle: 'அறிவியல் பூர்வ உர அட்டவணை',
    adjustedSoilBadge: 'மண் பரிசோதனைக்கு ஏற்ப மாற்றப்பட்டது'
  },
  prices: {
    title: 'இன்றைய சந்தை விலைகள் & வரத்து',
    subtitle: 'அருகிலுள்ள ஒழுங்குமுறை விற்பனைக்கூட நேரலை விலைகள்',
    modalPrice: 'மாதிரி விலை',
    minPrice: 'குறைந்தபட்சம்',
    maxPrice: 'அதிகபட்சம்',
    arrivals: 'வரத்து (டன்கள்)',
    sellOrWaitTitle: 'இன்று விற்பதா அல்லது காத்திருப்பதா? (முடிவு இயந்திரம்)',
    verdictSell: 'இன்றே விற்கவும் (விற்பனை நேரம்)',
    verdictWait: 'சேமித்து வைக்கவும் (விலை உயரும்)'
  },
  chat: {
    title: 'கிசான்மித்ரா AI வேளாண் தோழன்',
    placeholder: 'தமிழில் பேசவும் அல்லது தட்டச்சு செய்யவும் (எ.கா: கோதுமைக்கு எப்போது உரமிட வேண்டும்?)',
    send: 'அனுப்புக',
    voiceBtn: 'பேசி கேட்கவும்',
    listening: 'கேட்கிறது... பேசவும்',
    speaking: 'பதில் ஒலிக்கிறது...',
    disclaimer: 'இந்த ஆலோசனைகள் ICAR தகவல்கள் அடிப்படையிலானவை. அவசரத்திற்கு உள்ளூர் வேளாண்மை மையத்தை அணுகவும்.',
    talkToExpert: 'வேளாண் நிபுணருடன் பேசவும்'
  },
  dashboard: {
    cropTitle: 'வெங்காயம் · லசல்கான், மகாராஷ்டிரா',
    changeCrop: 'பயிர் மாற்றுக',
    changeMarket: 'சந்தை மாற்றுக',
    modalPriceLabel: 'இன்றைய மாதிரி விலை',
    modalPriceValue: '₹2,300',
    perQuintal: '/ குவிண்டால்',
    forecastDaysLabel: '14 நாள் விலை கணிப்பு',
    forecastDaysValue: '₹2,450',
    forecastRange: 'வரம்பு ₹2,200 முதல் ₹2,700',
    bestMarketLabel: 'சிறந்த சந்தை, நிகர லாபம்',
    bestMarketValue: '₹2,180',
    bestMarketSub: 'லசல்கான், 24 கி.மீ தொலைவு',
    adviceLabel: 'ஆலோசனை',
    adviceVerdict: 'காத்திருக்கவும் (Wait)',
    adviceSub: 'வரத்து குறைவதால் விலை அதிகரிக்க வாய்ப்பு',
    priceForecastTitle: 'விலை கணிப்பு (Price forecast)',
    priceForecastSampleNote: 'எதிர்பார்க்கப்படும் விலை ₹2,450, வரம்பு ₹2,200 - ₹2,700.',
    todayLabel: 'இன்று',
    bestMarketsTitle: 'நிகர லாப அடிப்படையில் சிறந்த சந்தைகள்',
    tableMarket: 'சந்தை',
    tableDistance: 'தொலைவு',
    tableNet: 'குவிண்டாலுக்கு நிகர வருவாய்',
    tableFooterNote: 'போக்குவரத்து மற்றும் கட்டணம் கழித்த பிறகு. மாற்றிக்கொள்ளலாம்.',
    soilTitle: 'மண் மற்றும் பயிர் பரிந்துரைகள்',
    soilSubtitle: 'கரிசல் மண், pH சுமார் 7.6 (செயற்கைக்கோள் மதிப்பீடு)',
    soilCrops: [
      '1. சோயாபீன், எதிர்பார்க்கும் லாபம் ₹38,500/ஏக்கர்',
      '2. பருத்தி, எதிர்பார்க்கும் லாபம் ₹34,200/ஏக்கர்',
      '3. வெங்காயம், எதிர்பார்க்கும் லாபம் ₹42,000/ஏக்கர்'
    ],
    fertilizerTitle: 'உர அட்டவணை (Fertilizer plan)',
    fertilizerApproved: 'வேளாண் விஞ்ஞானிகளால் அங்கீகரிக்கப்பட்டது',
    fertilizerStages: [
      'விதைக்கும் போது: அடித்தள உரம் (DAP + பொட்டாஷ்)',
      '30 நாட்கள்: முதல் மேலுரம் (யூரியா)',
      '60 நாட்கள்: இரண்டாம் மேலுரம் (தெளிப்பு)'
    ],
    requestFromStore: 'அங்காடியில் கோருக',
    askTitle: 'கிசான்மித்ராவிடம் கேளுங்கள்',
    askSubtitle: 'உங்கள் மொழியில் பேசலாம் அல்லது எழுதலாம்',
    askPlaceholder: 'பயிரை எப்போது விற்க வேண்டும்?',
    footerDisclaimer: 'முன்கணிப்பு வழிகாட்டுதலுக்கு மட்டுமே, உத்தரவாதம் அல்ல.'
  },
  common: {
    selectCropTitle: 'பயிரைத் தேர்ந்தெடுக்கவும்',
    selectMarketTitle: 'சந்தையைத் தேர்ந்தெடுக்கவும்',
    close: 'மூடுக',
    apply: 'பயன்படுத்துக',
    rupeePerQuintal: '₹/குவிண்டால்',
    rupeePerPack: '₹',
    approvedByExpert: 'நிபுணர் அங்கீகரித்தது',
    disclaimerDecision: 'முன்கணிப்பு வழிகாட்டுதலுக்கு மட்டுமே, உத்தரவாதம் அல்ல.'
  }
};

const teTranslations: Translations = {
  appName: 'AgriPulse (కిసాన్‌మిత్ర)',
  tagline: 'రైతుల విశ్వసనీయ డిజిటల్ వ్యవసాయ సలహాదారు',
  subtagline: 'ఖచ్చితమైన మార్కెట్ ధరలు, ఎరువుల షెడ్యూల్, AI చాట్‌బాట్ మరియు వ్యవసాయ ఉత్పత్తులు.',
  nav: {
    dashboard: 'డాష్‌బోర్డ్',
    prices: 'మార్కెట్ ధరలు',
    forecast: 'ధర అంచనా',
    weather: 'వాతావరణం',
    markets: 'మార్కెట్ పోలిక',
    profit: 'లాభం & MSP',
    soil: 'నేల & పంటలు',
    store: 'రైతు స్టోర్',
    chat: 'AI సహాయకుడు',
    alerts: 'హెచ్చరికలు',
    disease: 'తెగుళ్ల నిర్ధారణ',
    admin: 'వ్యవసాయ నిపుణుడు',
    login: 'లాగిన్',
    settings: 'సెట్టింగ్‌లు'
  },
  hero: {
    badge: '🌾 100% ఉచిత డిజిటల్ రైతు సేవ',
    title: 'సరైన మార్కెట్, సరైన ధర మరియు ఎరువుల సమగ్ర ప్రణాళిక',
    subtitle: 'లైవ్ APMC మార్కెట్ ధరలు, 14 రోజుల ధర అంచనా, ICAR ధృవీకరించిన ఎరువుల ప్రణాళిక.',
    ctaPrices: 'లైవ్ మార్కెట్ ధరలు చూడండి',
    ctaStore: 'ఎరువులు & విత్తనాల స్టోర్',
    ctaChat: 'AI సహాయకుడిని అడగండి',
    linkWhatsApp: 'వాట్సాప్ అనుసంధానం'
  },
  features: {
    mandiTitle: 'లైవ్ APMC మార్కెట్ ధరలు',
    mandiDesc: 'అన్ని ప్రధాన మార్కెట్ల కనీస, గరిష్ట మరియు మోడల్ ధరలు.',
    forecastTitle: '14 & 30 రోజుల ధరల అంచనా',
    forecastDesc: 'AI మెషిన్ లెర్నింగ్ ద్వారా మార్కెట్ ధరల హెచ్చుతగ్గుల విశ్లేషణ.',
    storeTitle: 'విత్తనాలు, ఎరువులు & షెడ్యూల్',
    storeDesc: 'పంట పెరుగుదల దశల ప్రకారం సిఫార్సు చేసిన ఎరువుల మోతాదు.',
    soilTitle: 'నేల ఆరోగ్యం & పంట ఎంపిక',
    soilDesc: 'సాయిల్ హెల్త్ కార్డ్ ఆధారంగా అధిక లాభదాయక పంటల సిఫార్సు.',
    whatsappTitle: 'వాట్సాప్ & టెలిగ్రామ్ బాట్',
    whatsappDesc: 'మీ మాతృభాషలో మాట్లాడి లేదా టైప్ చేసి పరిష్కారం పొందండి.'
  },
  store: {
    title: 'కిసాన్‌మిత్ర అగ్రి స్టోర్ & ఎరువుల ప్రణాళిక',
    subtitle: 'ధృవీకరించిన విత్తనాలు, నానో యూరియా, DAP & పంట రక్షణ ఉత్పత్తులు',
    filterAll: 'అన్ని ఉత్పత్తులు',
    filterSeeds: 'ధృవీకరించిన విత్తనాలు',
    filterFertilizers: 'ఎరువులు & పోషకాలు',
    filterPesticides: 'పంట రక్షణ',
    requestBtn: 'ఆర్డర్ / విచారణ పంపండి',
    inStock: 'స్టాక్ అందుబాటులో ఉంది',
    expertApproved: 'ICAR / వ్యవసాయ యూనివర్సిటీ ఆమోదం',
    khaatScheduleTitle: 'శాస్త్రీయ పంటల ఎరువుల షెడ్యూల్',
    adjustedSoilBadge: 'సాయిల్ హెల్త్ కార్డ్ ప్రకారం మార్చబడింది'
  },
  prices: {
    title: 'ఈరోజు మార్కెట్ ధరలు & రాకలు',
    subtitle: 'సమీప వ్యవసాయ మార్కెట్ల తాజా ధరల వివరాలు',
    modalPrice: 'మోడల్ ధర',
    minPrice: 'కనీసం',
    maxPrice: 'గరిష్టం',
    arrivals: 'రోజువారీ రాకలు (టన్నులు)',
    sellOrWaitTitle: 'ఈరోజే అమ్మాలా లేదా నిల్వ చేయాలా? (నిర్ణయ సహాయం)',
    verdictSell: 'ఇప్పుడే అమ్మండి (అనుకూల సమయం)',
    verdictWait: 'వేచి ఉండండి & నిల్వ చేయండి (ధర పెరుగుతుంది)'
  },
  chat: {
    title: 'కిసాన్‌మిత్ర AI సహాయకుడు',
    placeholder: 'తెలుగులో మాట్లాడండి లేదా టైప్ చేయండి (ఉదా: గోధుమ పంటలో మొదటి ఎరువు ఎప్పుడు వేయాలి?)',
    send: 'పంపండి',
    voiceBtn: 'వాయిస్‌తో అడగండి',
    listening: 'వింటోంది... మాట్లాడండి',
    speaking: 'సమాధానం వినిపిస్తోంది...',
    disclaimer: 'ఈ సలహాలు ICAR పత్రాల ఆధారంగా ఇవ్వబడ్డాయి. అత్యవసర పరిస్థితుల్లో స్థానిక కృషి విజ్ఞాన కేంద్రాన్ని సంప్రదించండి.',
    talkToExpert: 'వ్యవసాయ నిపుణుడితో మాట్లాడండి'
  },
  dashboard: {
    cropTitle: 'ఉల్లిపాయ · లసల్‌గావ్, మహారాష్ట్ర',
    changeCrop: 'పంట మార్చండి',
    changeMarket: 'మార్కెట్ మార్చండి',
    modalPriceLabel: 'ఈరోజు మోడల్ ధర',
    modalPriceValue: '₹2,300',
    perQuintal: '/ క్వింటాల్',
    forecastDaysLabel: '14 రోజుల్లో ధర అంచనా',
    forecastDaysValue: '₹2,450',
    forecastRange: 'పరిధి ₹2,200 నుండి ₹2,700',
    bestMarketLabel: 'ఉత్తమ మార్కెట్, నికర లాభం',
    bestMarketValue: '₹2,180',
    bestMarketSub: 'లసల్‌గావ్, 24 కి.మీ దూరం',
    adviceLabel: 'సలహా',
    adviceVerdict: 'వేచి ఉండండి (Wait)',
    adviceSub: 'రాక తగ్గడం వల్ల ధరలు పెరిగే అవకాశం ఉంది',
    priceForecastTitle: 'ధరల అంచనా (Price forecast)',
    priceForecastSampleNote: 'అంచనా ధర ₹2,450, పరిధి ₹2,200 నుండి ₹2,700.',
    todayLabel: 'ఈరోజు',
    bestMarketsTitle: 'నికర ఆదాయం ఆధారంగా ఉత్తమ మార్కెట్లు',
    tableMarket: 'మార్కెట్',
    tableDistance: 'దూరం',
    tableNet: 'క్వింటాల్‌కు నికర రాబడి',
    tableFooterNote: 'రవాణా మరియు రుసుము మినహాయించిన తర్వాత. సవరించవచ్చు.',
    soilTitle: 'నేల & పంట సిఫార్సులు',
    soilSubtitle: 'నల్లరేగడి నేల, pH సుమారు 7.6 (శాటిలైట్ అంచనా)',
    soilCrops: [
      '1. సోయాబీన్, అంచనా లాభం ₹38,500/ఎకరా',
      '2. పత్తి, అంచనా లాభం ₹34,200/ఎకరా',
      '3. ఉల్లిపాయ, అంచనా లాభం ₹42,000/ఎకరా'
    ],
    fertilizerTitle: 'ఎరువుల ప్రణాళిక (Fertilizer plan)',
    fertilizerApproved: 'వ్యవసాయ నిపుణులచే ఆమోదించబడింది',
    fertilizerStages: [
      'విత్తే సమయంలో: బేసల్ డోస్ (DAP + పొటాష్)',
      '30 రోజులు: మొదటి టాప్ డ్రెస్సింగ్ (యూరియా)',
      '60 రోజులు: రెండవ టాప్ డ్రెస్సింగ్ (స్ప్రే)'
    ],
    requestFromStore: 'స్టోర్ నుండి కోరండి',
    askTitle: 'కిసాన్‌మిత్రను అడగండి',
    askSubtitle: 'మీ భాషలో మాట్లాడండి లేదా టైప్ చేయండి',
    askPlaceholder: 'నేను పంటను ఎప్పుడు అమ్మాలి?',
    footerDisclaimer: 'అంచనా నిర్ణయ మద్దతు మాత్రమే, హామీ కాదు.'
  },
  common: {
    selectCropTitle: 'పంటను ఎంచుకోండి',
    selectMarketTitle: 'మార్కెట్‌ను ఎంచుకోండి',
    close: 'మూసివేయండి',
    apply: 'వర్తింపజేయండి',
    rupeePerQuintal: '₹/క్వింటాల్',
    rupeePerPack: '₹',
    approvedByExpert: 'నిపుణులచే ఆమోదితం',
    disclaimerDecision: 'అంచనా నిర్ణయ మద్దతు మాత్రమే, హామీ కాదు.'
  }
};

const knTranslations: Translations = {
  appName: 'AgriPulse (ಕಿಸಾನ್‌ಮಿತ್ರ)',
  tagline: 'ರೈತರ ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಕೃಷಿ ಸಲಹೆಗಾರ',
  subtagline: 'ಲೈವ್ ಎಪಿಎಂಸಿ ದರಗಳು, ಗೊಬ್ಬರ ವೇಳಾಪಟ್ಟಿ, AI ಸಹಾಯಕ ಮತ್ತು ಕೃಷಿ ಉತ್ಪನ್ನಗಳು.',
  nav: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    prices: 'ಮಾರುಕಟ್ಟೆ ದರಗಳು',
    forecast: 'ದರ ಮುನ್ಸೂಚನೆ',
    weather: 'ಹವಾಮಾನ',
    markets: 'ಮಾರುಕಟ್ಟೆ ಹೋಲಿಕೆ',
    profit: 'ಲಾಭ & MSP',
    soil: 'ಮಣ್ಣು & ಬೆಳೆಗಳು',
    store: 'ರೈತ ಮಳಿಗೆ',
    chat: 'AI ಸಹಾಯಕ',
    alerts: 'ಎಚ್ಚರಿಕೆಗಳು',
    disease: 'ರೋಗ ಪತ್ತೆ',
    admin: 'ಕೃಷಿ ತಜ್ಞ',
    login: 'ಲಾಗಿನ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು'
  },
  hero: {
    badge: '🌾 100% ಉಚಿತ ಡಿಜಿಟಲ್ ಕಿಸಾನ್ ಸೇವೆ',
    title: 'ನಿಖರ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ, ಸೂಕ್ತ ಮಾರಾಟ ಮತ್ತು ಬೆಳೆ ಆರೈಕೆ',
    subtitle: 'ಲೈವ್ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು, 14 ದಿನಗಳ ದರ ಮುನ್ಸೂಚನೆ, ICAR ಅನುಮೋದಿತ ಗೊಬ್ಬರ ವೇಳಾಪಟ್ಟಿ.',
    ctaPrices: 'ಲೈವ್ ದರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    ctaStore: 'ರಸಗೊಬ್ಬರ & ಬೀಜ ಮಳಿಗೆ',
    ctaChat: 'AI ಸಹಾಯಕರೊಂದಿಗೆ ಮಾತನಾಡಿ',
    linkWhatsApp: 'ವಾಟ್ಸಾಪ್ ಲಿಂಕ್ ಮಾಡಿ'
  },
  features: {
    mandiTitle: 'ಲೈವ್ ಎಪಿಎಂಸಿ ದರಗಳು',
    mandiDesc: 'ಕರ್ನಾಟಕ ಮತ್ತು ದೇಶದ ಪ್ರಮುಖ ಮಾರುಕಟ್ಟೆಗಳ ಕನಿಷ್ಠ, ಗರಿಷ್ಠ ಮತ್ತು ಮಾದರಿ ದರಗಳು.',
    forecastTitle: '14 ಮತ್ತು 30 ದಿನಗಳ ದರ ಮುನ್ಸೂಚನೆ',
    forecastDesc: 'AI ಯಂತ್ರ ಕಲಿಕೆ ಆಧಾರಿತ ವೈಜ್ಞಾನಿಕ ಮಾರುಕಟ್ಟೆ ದರ ವಿಶ್ಲೇಷಣೆ.',
    storeTitle: 'ಕೃಷಿ ಪರಿಕರಗಳು & ಗೊಬ್ಬರ ವೇಳಾಪಟ್ಟಿ',
    storeDesc: 'ಬೆಳೆಯ ಹಂತವಾರು ನಿಖರ ಗೊಬ್ಬರ ಪ್ರಮಾಣ ಮತ್ತು ನೇರ ಬೇಡಿಕೆ ಸೌಲಭ್ಯ.',
    soilTitle: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ & ಬೆಳೆ ಆಯ್ಕೆ',
    soilDesc: 'ಮಣ್ಣು ಪರೀಕ್ಷೆ ಆಧಾರಿತ ಗರಿಷ್ಠ ಲಾಭ ನೀಡುವ ಬೆಳೆಗಳ ಶಿಫಾರಸು.',
    whatsappTitle: 'ವಾಟ್ಸಾಪ್ & ಟೆಲಿಗ್ರಾಂ ಬಾಟ್',
    whatsappDesc: 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಧ್ವನಿ ಅಥವಾ ಸಂದೇಶದ ಮೂಲಕ ಪ್ರಶ್ನೆ ಕೇಳಿ.'
  },
  store: {
    title: 'ಕಿಸಾನ್‌ಮಿತ್ರ ಕೃಷಿ ಮಳಿಗೆ & ಗೊಬ್ಬರ ಯೋಜನೆ',
    subtitle: 'ಪ್ರಮಾಣೀಕೃತ ಬೀಜಗಳು, ನ್ಯಾನೋ ಯೂರಿಯಾ, ಡಿಎಪಿ ಮತ್ತು ಬೆಳೆ ರಕ್ಷಣೆ',
    filterAll: 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು',
    filterSeeds: 'ಪ್ರಮಾಣೀಕೃತ ಬೀಜಗಳು',
    filterFertilizers: 'ಗೊಬ್ಬರಗಳು & ಪೋಷಕಾಂಶಗಳು',
    filterPesticides: 'ಬೆಳೆ ರಕ್ಷಣೆ',
    requestBtn: 'ಆರ್ಡರ್ / ವಿಚಾರಣೆ ಕಳುಹಿಸಿ',
    inStock: 'ದಾಸ್ತಾನು ಲಭ್ಯವಿದೆ',
    expertApproved: 'ICAR / ಕೃಷಿ ವಿವಿ ಮಾನ್ಯತೆ ಪಡೆದಿದೆ',
    khaatScheduleTitle: 'ವೈಜ್ಞಾನಿಕ ಬೆಳೆವಾರು ಗೊಬ್ಬರ ವೇಳಾಪಟ್ಟಿ',
    adjustedSoilBadge: 'ಮಣ್ಣಿನ ವರದಿ ಪ್ರಕಾರ ಹೊಂದಿಸಲಾಗಿದೆ'
  },
  prices: {
    title: 'ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ದರಗಳು & ಆವಕ',
    subtitle: 'ಹತ್ತಿರದ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಗಳ ಅಧಿಕೃತ ದರಗಳು',
    modalPrice: 'ಮಾದರಿ ದರ',
    minPrice: 'ಕನಿಷ್ಠ',
    maxPrice: 'ಗರಿಷ್ಠ',
    arrivals: 'ದೈನಂದಿನ ಆವಕ (ಟನ್‌ಗಳಲ್ಲಿ)',
    sellOrWaitTitle: 'ಇಂದೇ ಮಾರಾಟ ಮಾಡಬೇಕೇ ಅಥವಾ ಕಾಯಬೇಕೇ? (ನಿರ್ಧಾರ ಎಂಜಿನ್)',
    verdictSell: 'ಇಂದೇ ಮಾರಾಟ ಮಾಡಿ (ಉತ್ತಮ ಸಮಯ)',
    verdictWait: 'ಕಾಯಿರಿ ಮತ್ತು ಸಂಗ್ರಹಿಸಿ (ದರ ಏರಿಕೆಯಾಗಲಿದೆ)'
  },
  chat: {
    title: 'ಕಿಸಾನ್‌ಮಿತ್ರ AI ಕೃಷಿ ಸಂಗಾತಿ',
    placeholder: 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ (ಉದಾ: ಗೋಧಿಗೆ ಮೊದಲ ಗೊಬ್ಬರ ಯಾವಾಗ ಹಾಕಬೇಕು?)',
    send: 'ಕಳುಹಿಸಿ',
    voiceBtn: 'ಧ್ವನಿಯ ಮೂಲಕ ಕೇಳಿ',
    listening: 'ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ',
    speaking: 'ಉತ್ತರ ಧ್ವನಿಸುತ್ತಿದೆ...',
    disclaimer: 'ಈ ಸಲಹೆಗಳು ICAR ದಾಖಲೆಗಳ ಆಧಾರಿತವಾಗಿವೆ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ಸ್ಥಳೀಯ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    talkToExpert: 'ಕೃಷಿ ತಜ್ಞರೊಂದಿಗೆ ಮಾತನಾಡಿ'
  },
  dashboard: {
    cropTitle: 'ಈರುಳ್ಳಿ · ಲಸಲ್‌ಗಾಂವ್, ಮಹಾರಾಷ್ಟ್ರ',
    changeCrop: 'ಬೆಳೆ ಬದಲಿಸಿ',
    changeMarket: 'ಮಾರುಕಟ್ಟೆ ಬದಲಿಸಿ',
    modalPriceLabel: 'ಇಂದಿನ ಮಾದರಿ ದರ',
    modalPriceValue: '₹2,300',
    perQuintal: '/ ಕ್ವಿಂಟಾಲ್',
    forecastDaysLabel: '14 ದಿನಗಳ ದರ ಮುನ್ಸೂಚನೆ',
    forecastDaysValue: '₹2,450',
    forecastRange: 'ವ್ಯಾಪ್ತಿ ₹2,200 ರಿಂದ ₹2,700',
    bestMarketLabel: 'ಉತ್ತಮ ಮಾರುಕಟ್ಟೆ, ನಿವ್ವಳ ಆದಾಯ',
    bestMarketValue: '₹2,180',
    bestMarketSub: 'ಲಸಲ್‌ಗಾಂವ್, 24 ಕಿ.ಮೀ ದೂರ',
    adviceLabel: 'ಸಲಹೆ',
    adviceVerdict: 'ಕಾಯಿರಿ (Wait)',
    adviceSub: 'ಆವಕ ಕಡಿಮೆಯಾಗುವುದರಿಂದ ಬೆಲೆ ಹೆಚ್ಚಾಗುವ ಸಾಧ್ಯತೆ',
    priceForecastTitle: 'ದರ ಮುನ್ಸೂಚನೆ (Price forecast)',
    priceForecastSampleNote: 'ಸಂಭಾವ್ಯ ದರ ₹2,450, ವ್ಯಾಪ್ತಿ ₹2,200 ರಿಂದ ₹2,700.',
    todayLabel: 'ಇಂದು',
    bestMarketsTitle: 'ನಿವ್ವಳ ಆದಾಯದ ಆಧಾರದ ಮೇಲೆ ಪ್ರಮುಖ ಮಾರುಕಟ್ಟೆಗಳು',
    tableMarket: 'ಮಾರುಕಟ್ಟೆ',
    tableDistance: 'ದೂರ',
    tableNet: 'ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ನಿವ್ವಳ ಆದಾಯ',
    tableFooterNote: 'ಸಾರಿಗೆ ಮತ್ತು ಶುಲ್ಕ ಕಡಿತದ ನಂತರ. ದರಗಳನ್ನು ಬದಲಾಯಿಸಬಹುದು.',
    soilTitle: 'ಮಣ್ಣು ಮತ್ತು ಬೆಳೆ ಶಿಫಾರಸುಗಳು',
    soilSubtitle: 'ಕಪ್ಪು ಮಣ್ಣು, pH ಸುಮಾರು 7.6 (ಉಪಗ್ರಹ ಅಂದಾಜು)',
    soilCrops: [
      '1. ಸೋಯಾಬೀನ್, ಅಂದಾಜು ಲಾಭ ₹38,500/ಎಕರೆ',
      '2. ಹತ್ತಿ, ಅಂದಾಜು ಲಾಭ ₹34,200/ಎಕರೆ',
      '3. ಈರುಳ್ಳಿ, ಅಂದಾಜು ಲಾಭ ₹42,000/ಎಕರೆ'
    ],
    fertilizerTitle: 'ಗೊಬ್ಬರ ವೇಳಾಪಟ್ಟಿ (Fertilizer plan)',
    fertilizerApproved: 'ಕೃಷಿ ತಜ್ಞರಿಂದ ಅನುಮೋದಿಸಲಾಗಿದೆ',
    fertilizerStages: [
      'ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ: ಆರಂಭಿಕ ಡೋಸ್ (DAP + ಪೊಟ್ಯಾಶ್)',
      '30 ದಿನಗಳು: ಮೊದಲ ಮೇಲುಗೊಬ್ಬರ (ಯೂರಿಯಾ)',
      '60 ದಿನಗಳು: ಎರಡನೇ ಮೇಲುಗೊಬ್ಬರ (ಸಿಂಪಡಣೆ)'
    ],
    requestFromStore: 'ಮಳಿಗೆಯಿಂದ ತರಿಸಿಕೊಳ್ಳಿ',
    askTitle: 'ಕಿಸಾನ್‌ಮಿತ್ರನನ್ನು ಕೇಳಿ',
    askSubtitle: 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಬರೆಯಿರಿ',
    askPlaceholder: 'ನಾನು ಬೆಳೆಯನ್ನು ಯಾವಾಗ ಮಾರಾಟ ಮಾಡಬೇಕು?',
    footerDisclaimer: 'ಮುನ್ಸೂಚನೆಯು ನಿರ್ಧಾರ ಬೆಂಬಲಕ್ಕಾಗಿ ಮಾತ್ರ, ಖಾತರಿಯಲ್ಲ.'
  },
  common: {
    selectCropTitle: 'ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ',
    selectMarketTitle: 'ಮಾರುಕಟ್ಟೆ ಆಯ್ಕೆಮಾಡಿ',
    close: 'ಮುಚ್ಚಿ',
    apply: 'ಅನ್ವಯಿಸಿ',
    rupeePerQuintal: '₹/ಕ್ವಿಂಟಾಲ್',
    rupeePerPack: '₹',
    approvedByExpert: 'ತಜ್ಞರ ಅನುಮೋದನೆ ಪಡೆದಿದೆ',
    disclaimerDecision: 'ಮುನ್ಸೂಚನೆಯು ನಿರ್ಧಾರ ಬೆಂಬಲಕ್ಕಾಗಿ ಮಾತ್ರ, ಖಾತರಿಯಲ್ಲ.'
  }
};

const bnTranslations: Translations = {
  appName: 'AgriPulse (কিষাণমিত্র)',
  tagline: 'ভারতীয় কৃষকদের বিশ্বস্ত ডিজিটাল কৃষি উপদেষ্টা',
  subtagline: 'লাইভ মাণ্ডি দর, বৈজ্ঞানিক সারের সময়সূচি, AI চ্যাটবট আপনার ফোনে।',
  nav: {
    dashboard: 'ড্যাশবোর্ড',
    prices: 'বাজার দর',
    forecast: 'দর পূর্বাভাস',
    weather: 'আবহাওয়া',
    markets: 'মাণ্ডি তুলনা',
    profit: 'লাভ ও MSP',
    soil: 'মাটি ও ফসল',
    store: 'কৃষি ভাণ্ডার',
    chat: 'AI সহকারী',
    alerts: 'সতর্কবার্তা',
    disease: 'রোগ নির্ণয়',
    admin: 'কৃষি বিশেষজ্ঞ',
    login: 'লগইন',
    settings: 'সেটিংস'
  },
  hero: {
    badge: '🌾 ১০০% বিনামূল্যে ডিজিটাল কৃষক সেবা',
    title: 'সঠিক বাজার, সঠিক দর এবং সারের নিখুঁত পরিকল্পনা',
    subtitle: 'লাইভ APMC বাজার দর, ১৪ দিনের দর পূর্বাভাস, ICAR অনুমোদিত সার সময়সূচি।',
    ctaPrices: 'আজকের বাজার দর দেখুন',
    ctaStore: 'সার-বীজ ভাণ্ডার ও পরিকল্পনা',
    ctaChat: 'AI সহকারীকে মুখে বলুন',
    linkWhatsApp: 'হোয়াটসঅ্যাপ যুক্ত করুন'
  },
  features: {
    mandiTitle: 'লাইভ APMC বাজার দর',
    mandiDesc: 'দেশের সমস্ত প্রধান মাণ্ডির সর্বনিম্ন, সর্বোচ্চ এবং গড় দর।',
    forecastTitle: '১৪ ও ৩০ দিনের দর পূর্বাভাস',
    forecastDesc: 'AI মেশিন লার্নিং দ্বারা বাজারের দামের ওঠানামার বৈজ্ঞানিক বিশ্লেষণ।',
    storeTitle: 'সার-বীজ স্টোর ও সময়সূচি',
    storeDesc: 'ফসলের বৃদ্ধি অনুযায়ী সঠিক সারের মাত্রা ও সরাসরি অর্ডারের সুবিধা।',
    soilTitle: 'মাটির স্বাস্থ্য ও ফসল নির্বাচন',
    soilDesc: 'সয়েল হেলথ কার্ডের উপর ভিত্তি করে সর্বোচ্চ লাভজনক ফসলের পরামর্শ।',
    whatsappTitle: 'হোয়াটসঅ্যাপ ও টেলিগ্রাম বট',
    whatsappDesc: 'নিজের ভাষায় মুখে বলে বা লিখে প্রশ্ন করুন এবং উত্তর পান।'
  },
  store: {
    title: 'কিষাণমিত্র কৃষি স্টোর ও সার পরিকল্পনা',
    subtitle: 'প্রমাণিত বীজ, ন্যানো ইউরিয়া, ডিএপি ও ফসল সুরক্ষা পণ্য',
    filterAll: 'সমস্ত পণ্য',
    filterSeeds: 'প্রমাণিত বীজ',
    filterFertilizers: 'সার ও পুষ্টি',
    filterPesticides: 'ফসল সুরক্ষা',
    requestBtn: 'অর্ডার / অনুসন্ধান পাঠান',
    inStock: 'স্টক উপলব্ধ',
    expertApproved: 'ICAR / কৃষি বিশ্ববিদ্যালয় দ্বারা অনুমোদিত',
    khaatScheduleTitle: 'বৈজ্ঞানিক ফসলভিত্তিক সার সময়সূচি',
    adjustedSoilBadge: 'মাটি পরীক্ষার মান অনুযায়ী সমন্বিত'
  },
  prices: {
    title: 'আজকের তাজা মাণ্ডি দর ও আমদানি',
    subtitle: 'নিকটবর্তী পাইকারি কৃষি বাজারের আসল দর জানুন',
    modalPrice: 'গড় দর',
    minPrice: 'সর্বনিম্ন',
    maxPrice: 'সর্বোচ্চ',
    arrivals: 'দৈনিক আমদানি (টন)',
    sellOrWaitTitle: 'আজ বিক্রি করবেন না অপেক্ষা করবেন? (সিদ্ধান্ত ইঞ্জিন)',
    verdictSell: 'আজই বিক্রি করুন (অনুকূল সময়)',
    verdictWait: 'অপেক্ষা ও সংরক্ষণ করুন (দাম বাড়বে)'
  },
  chat: {
    title: 'কিষাণমিত্র AI কৃষি সঙ্গী',
    placeholder: 'বাংলায় বলুন বা লিখুন (যেমন: গমে প্রথম সার কখন দেব?)',
    send: 'পাঠান',
    voiceBtn: 'মুখে বলে প্রশ্ন করুন',
    listening: 'শুনছি... বলুন',
    speaking: 'উত্তর শোনানো হচ্ছে...',
    disclaimer: 'এই পরামর্শ ICAR তথ্যের উপর ভিত্তি করে। জরুরি প্রয়োজনে স্থানীয় কৃষি বিজ্ঞান কেন্দ্রে যোগাযোগ করুন।',
    talkToExpert: 'কৃষি বিশেষজ্ঞের সাথে কথা বলুন'
  },
  dashboard: {
    cropTitle: 'পেঁয়াজ · লাসালগাঁও, মহারাষ্ট্র',
    changeCrop: 'ফসল পরিবর্তন',
    changeMarket: 'বাজার পরিবর্তন',
    modalPriceLabel: 'আজকের গড় দর',
    modalPriceValue: '₹২,৩০০',
    perQuintal: '/ কুইন্টাল',
    forecastDaysLabel: '১৪ দিনে দর পূর্বাভাস',
    forecastDaysValue: '₹২,৪৫০',
    forecastRange: 'সীমা ₹২,২০০ থেকে ₹২,৭০০',
    bestMarketLabel: 'সেরা বাজার, নিট আয়',
    bestMarketValue: '₹২,১৮০',
    bestMarketSub: 'লাসালগাঁও, ২৪ কিমি দূরে',
    adviceLabel: 'পরামর্শ',
    adviceVerdict: 'অপেক্ষা করুন (Wait)',
    adviceSub: 'আমদানি কমায় দাম বাড়ার সম্ভাবনা রয়েছে',
    priceForecastTitle: 'দর পূর্বাভাস (Price forecast)',
    priceForecastSampleNote: 'সর্বাধিক সম্ভাব্য ₹২,৪৫০, পরিসর ₹২,২০০ থেকে ₹২,৭০০।',
    todayLabel: 'আজ',
    bestMarketsTitle: 'নিট আয়ের ভিত্তিতে সেরা বাজারগুলি',
    tableMarket: 'বাজার',
    tableDistance: 'দূরত্ব',
    tableNet: 'কুইন্টাল প্রতি নিট আয়',
    tableFooterNote: 'পরিবহন ও মাণ্ডি ফি কাটার পর। হার পরিবর্তনযোগ্য।',
    soilTitle: 'মাটি ও ফসলের সুপারিশ',
    soilSubtitle: 'কালো মাটি, pH প্রায় ৭.৬ (স্যাটেলাইট অনুমান)',
    soilCrops: [
      '১. সয়াবিন, প্রত্যাশিত লাভ ₹৩৮,৫০০/একর',
      '২. তুলা, প্রত্যাশিত লাভ ₹৩৪,২০০/একর',
      '৩. পেঁয়াজ, প্রত্যাশিত লাভ ₹৪২,০০০/একর'
    ],
    fertilizerTitle: 'সার সময়সূচি (Fertilizer plan)',
    fertilizerApproved: 'কৃষি বিশেষজ্ঞদের দ্বারা অনুমোদিত',
    fertilizerStages: [
      'বপনের সময়: বেসাল ডোজ (DAP + পটাশ)',
      '৩০ দিন: প্রথম টপ ড্রেসিং (ইউরিয়া)',
      '৬০ দিন: দ্বিতীয় টপ ড্রেসিং (স্প্রে)'
    ],
    requestFromStore: 'স্টোর থেকে অর্ডার করুন',
    askTitle: 'কিষাণমিত্রকে জিজ্ঞাসা করুন',
    askSubtitle: 'নিজের ভাষায় বলুন বা লিখুন',
    askPlaceholder: 'আমি কখন ফসল বিক্রি করব?',
    footerDisclaimer: 'পূর্বাভাস সিদ্ধান্তের সহায়তার জন্য, কোনো নিশ্চয়তা নয়।'
  },
  common: {
    selectCropTitle: 'ফসল নির্বাচন করুন',
    selectMarketTitle: 'বাজার নির্বাচন করুন',
    close: 'বন্ধ করুন',
    apply: 'প্রয়োগ করুন',
    rupeePerQuintal: '₹/কুইন্টাল',
    rupeePerPack: '₹',
    approvedByExpert: 'বিশেষজ্ঞ অনুমোদিত',
    disclaimerDecision: 'পূর্বাভাস সিদ্ধান্তের সহায়তার জন্য, কোনো নিশ্চয়তা নয়।'
  }
};

const paTranslations: Translations = {
  appName: 'AgriPulse (ਕਿਸਾਨਮਿੱਤਰ)',
  tagline: 'ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਦਾ ਭਰੋਸੇਮੰਦ ਡਿਜੀਟਲ ਖੇਤੀ ਸਲਾਹਕਾਰ',
  subtagline: 'ਤਾਜ਼ਾ ਮੰਡੀ ਭਾਅ, ਖਾਦ ਦਾ ਸਹੀ ਸਮਾਂ, AI ਸਹਾਇਕ ਅਤੇ ਖੇਤੀ ਉਤਪਾਦ ਤੁਹਾਡੇ ਫ਼ੋਨ ਤੇ।',
  nav: {
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    prices: 'ਮੰਡੀ ਭਾਅ',
    forecast: 'ਭਾਅ ਅਨੁਮਾਨ',
    weather: 'ਮੌਸਮ',
    markets: 'ਮੰਡੀ ਤੁਲਨਾ',
    profit: 'ਮੁਨਾਫ਼ਾ ਤੇ MSP',
    soil: 'ਮਿੱਟੀ ਤੇ ਫ਼ਸਲ',
    store: 'ਕਿਸਾਨ ਸਟੋਰ',
    chat: 'AI ਸਹਾਇਕ',
    alerts: 'ਅਲਰਟ',
    disease: 'ਬਿਮਾਰੀ ਪਛਾਣ',
    admin: 'ਖੇਤੀ ਮਾਹਿਰ',
    login: 'ਲਾਗਇਨ',
    settings: 'ਸੈਟਿੰਗਾਂ'
  },
  hero: {
    badge: '🌾 100% ਮੁਫ਼ਤ ਡਿਜੀਟਲ ਕਿਸਾਨ ਸੇਵਾ',
    title: 'ਸਹੀ ਮੰਡੀ, ਸਹੀ ਭਾਅ ਅਤੇ ਖਾਦਾਂ ਦੀ ਵਿਗਿਆਨਕ ਯੋਜਨਾ',
    subtitle: 'ਤਾਜ਼ਾ APMC ਮੰਡੀ ਰੇਟ, 14 ਦਿਨਾਂ ਦਾ ਭਾਅ ਅਨੁਮਾਨ, ICAR ਪ੍ਰਮਾਣਿਤ ਖਾਦ ਸ਼ਡਿਊਲ ਅਤੇ ਵਟਸਐਪ ਤੇ 24x7 ਸਲਾਹ।',
    ctaPrices: 'ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਅ ਵੇਖੋ',
    ctaStore: 'ਖਾਦ-ਬੀਜ ਸਟੋਰ',
    ctaChat: 'AI ਸਹਾਇਕ ਨੂੰ ਬੋਲ ਕੇ ਪੁੱਛੋ',
    linkWhatsApp: 'ਵਟਸਐਪ ਲਿੰਕ ਕਰੋ'
  },
  features: {
    mandiTitle: 'ਲਾਈਵ APMC ਮੰਡੀ ਭਾਅ',
    mandiDesc: 'ਪੰਜਾਬ ਅਤੇ ਦੇਸ਼ ਦੀਆਂ ਮੁੱਖ ਮੰਡੀਆਂ ਦੇ ਘੱਟੋ-ਘੱਟ, ਵੱਧ ਤੋਂ ਵੱਧ ਅਤੇ ਔਸਤ ਭਾਅ।',
    forecastTitle: '14 ਤੇ 30 ਦਿਨਾਂ ਦਾ ਭਾਅ ਅਨੁਮਾਨ',
    forecastDesc: 'AI ਮਸ਼ੀਨ ਲਰਨਿੰਗ ਰਾਹੀਂ ਮੰਡੀ ਭਾਅ ਦੇ ਉਤਰਾਅ-ਚੜ੍ਹਾਅ ਦਾ ਵਿਗਿਆਨਕ ਵਿਸ਼ਲੇਸ਼ਣ।',
    storeTitle: 'ਬੀਜ, ਖਾਦ ਤੇ ਸ਼ਡਿਊਲ',
    storeDesc: 'ਫ਼ਸਲ ਦੇ ਵਾਧੇ ਅਨੁਸਾਰ ਸਹੀ ਖਾਦ ਦੀ ਖ਼ੁਰਾਕ ਅਤੇ ਘਰ ਬੈਠੇ ਮੰਗਵਾਉਣ ਦੀ ਸਹੂਲਤ।',
    soilTitle: 'ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਤੇ ਫ਼ਸਲ ਚੋਣ',
    soilDesc: 'ਸੋਇਲ ਹੈਲਥ ਕਾਰਡ ਅਨੁਸਾਰ ਵੱਧ ਮੁਨਾਫ਼ੇ ਵਾਲੀਆਂ ਫ਼ਸਲਾਂ ਦੀ ਸਿਫ਼ਾਰਸ਼।',
    whatsappTitle: 'ਵਟਸਐਪ ਤੇ ਟੈਲੀਗ੍ਰਾਮ ਬੋਟ',
    whatsappDesc: 'ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲ ਕੇ ਜਾਂ ਲਿਖ ਕੇ ਸਵਾਲ ਪੁੱਛੋ ਅਤੇ ਤੁਰੰਤ ਜਵਾਬ ਪਾਓ।'
  },
  store: {
    title: 'ਕਿਸਾਨਮਿੱਤਰ ਐਗਰੀ ਸਟੋਰ ਤੇ ਖਾਦ ਪਲਾਨ',
    subtitle: 'ਪ੍ਰਮਾਣਿਤ ਬੀਜ, ਨੈਨੋ ਯੂਰੀਆ, ਡੀਏਪੀ ਅਤੇ ਫ਼ਸਲ ਸੁਰੱਖਿਆ ਉਤਪਾਦ',
    filterAll: 'ਸਾਰੇ ਉਤਪਾਦ',
    filterSeeds: 'ਪ੍ਰਮਾਣਿਤ ਬੀਜ',
    filterFertilizers: 'ਖਾਦਾਂ ਤੇ ਪੌਸ਼ਟਿਕ ਤੱਤ',
    filterPesticides: 'ਫ਼ਸਲ ਸੁਰੱਖਿਆ',
    requestBtn: 'ਆਰਡਰ / ਪੁੱਛਗਿੱਛ ਭੇਜੋ',
    inStock: 'ਸਟਾਕ ਉਪਲਬਧ ਹੈ',
    expertApproved: 'ICAR / ਖੇਤੀ ਯੂਨੀਵਰਸਿਟੀ ਮਾਨਤਾ ਪ੍ਰਾਪਤ',
    khaatScheduleTitle: 'ਵਿਗਿਆਨਕ ਫ਼ਸਲਵਾਰ ਖਾਦ ਸ਼ਡਿਊਲ',
    adjustedSoilBadge: 'ਮਿੱਟੀ ਪਰਖ ਰਿਪੋਰਟ ਅਨੁਸਾਰ ਸੋਧਿਆ'
  },
  prices: {
    title: 'ਅੱਜ ਦੇ ਤਾਜ਼ਾ ਮੰਡੀ ਭਾਅ ਤੇ ਆਮਦ',
    subtitle: 'ਨੇੜਲੀਆਂ ਅਨਾਜ ਮੰਡੀਆਂ ਦੇ ਅਸਲ ਭਾਅ ਵੇਖੋ',
    modalPrice: 'ਔਸਤ ਭਾਅ',
    minPrice: 'ਘੱਟੋ-ਘੱਟ',
    maxPrice: 'ਵੱਧ ਤੋਂ ਵੱਧ',
    arrivals: 'ਰੋਜ਼ਾਨਾ ਆਮਦ (ਟਨ)',
    sellOrWaitTitle: 'ਅੱਜ ਵੇਚੀਏ ਜਾਂ ਰੋਕੀਏ? (ਫ਼ੈਸਲਾ ਇੰਜਣ)',
    verdictSell: 'ਅੱਜ ਹੀ ਵੇਚੋ (ਸਹੀ ਸਮਾਂ)',
    verdictWait: 'ਰੋਕੋ ਤੇ ਸਟੋਰ ਕਰੋ (ਭਾਅ ਵਧੇਗਾ)'
  },
  chat: {
    title: 'ਕਿਸਾਨਮਿੱਤਰ AI ਖੇਤੀ ਸਾਥੀ',
    placeholder: 'ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ ਜਾਂ ਲਿਖੋ (ਜਿਵੇਂ: ਕਣਕ ਵਿੱਚ ਪਹਿਲਾ ਪਾਣੀ ਅਤੇ ਯੂਰੀਆ ਕਦੋਂ ਪਾਈਏ?)',
    send: 'ਭੇਜੋ',
    voiceBtn: 'ਬੋਲ ਕੇ ਪੁੱਛੋ',
    listening: 'ਸੁਣ ਰਿਹਾ ਹੈ... ਬੋਲੋ',
    speaking: 'ਜਵਾਬ ਬੋਲਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
    disclaimer: 'ਇਹ ਸਲਾਹ ICAR ਦਸਤਾਵੇਜ਼ਾਂ ਤੇ ਆਧਾਰਿਤ ਹੈ। ਐਮਰਜੈਂਸੀ ਲਈ ਨੇੜਲੇ ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।',
    talkToExpert: 'ਖੇਤੀ ਮਾਹਿਰ ਨਾਲ ਗੱਲ ਕਰੋ'
  },
  dashboard: {
    cropTitle: 'ਪਿਆਜ਼ · ਲਾਸਲਗਾਂਵ, ਮਹਾਰਾਸ਼ਟਰ',
    changeCrop: 'ਫ਼ਸਲ ਬਦਲੋ',
    changeMarket: 'ਮੰਡੀ ਬਦਲੋ',
    modalPriceLabel: 'ਅੱਜ ਦਾ ਔਸਤ ਭਾਅ',
    modalPriceValue: '₹2,300',
    perQuintal: '/ ਕੁਇੰਟਲ',
    forecastDaysLabel: '14 ਦਿਨਾਂ ਵਿੱਚ ਭਾਅ ਅਨੁਮਾਨ',
    forecastDaysValue: '₹2,450',
    forecastRange: 'ਰੇਂਜ ₹2,200 ਤੋਂ ₹2,700',
    bestMarketLabel: 'ਸਭ ਤੋਂ ਵਧੀਆ ਮੰਡੀ, ਸ਼ੁੱਧ ਕਮਾਈ',
    bestMarketValue: '₹2,180',
    bestMarketSub: 'ਲਾਸਲਗਾਂਵ, 24 ਕਿਮੀ ਦੂਰ',
    adviceLabel: 'ਸਲਾਹ',
    adviceVerdict: 'ਰੋਕੋ (Wait)',
    adviceSub: 'ਆਮਦ ਘਟਣ ਨਾਲ ਭਾਅ ਵਧਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ',
    priceForecastTitle: 'ਭਾਅ ਅਨੁਮਾਨ (Price forecast)',
    priceForecastSampleNote: 'ਅਨੁਮਾਨਿਤ ਭਾਅ ₹2,450, ਸੀਮਾ ₹2,200 ਤੋਂ ₹2,700.',
    todayLabel: 'ਅੱਜ',
    bestMarketsTitle: 'ਸ਼ੁੱਧ ਆਮਦਨ ਅਨੁਸਾਰ ਮੁੱਖ ਮੰਡੀਆਂ',
    tableMarket: 'ਮੰਡੀ',
    tableDistance: 'ਦੂਰੀ',
    tableNet: 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ ਸ਼ੁੱਧ ਆਮਦਨ',
    tableFooterNote: 'ਕਿਰਾਇਆ ਅਤੇ ਖ਼ਰਚੇ ਕੱਟਣ ਤੋਂ ਬਾਅਦ। ਰੇਟ ਬਦਲ ਸਕਦੇ ਹਨ।',
    soilTitle: 'ਮਿੱਟੀ ਅਤੇ ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼ਾਂ',
    soilSubtitle: 'ਕਾਲੀ ਮਿੱਟੀ, pH ਲਗਭਗ 7.6 (ਸੈਟੇਲਾਈਟ ਅੰਦਾਜ਼ਾ)',
    soilCrops: [
      '1. ਸੋਇਆਬੀਨ, ਅਨੁਮਾਨਿਤ ਮੁਨਾਫ਼ਾ ₹38,500/ਏਕੜ',
      '2. ਕਪਾਹ/ਨਰਮਾ, ਅਨੁਮਾਨਿਤ ਮੁਨਾਫ਼ਾ ₹34,200/ਏਕੜ',
      '3. ਪਿਆਜ਼, ਅਨੁਮਾਨਿਤ ਮੁਨਾਫ਼ਾ ₹42,000/ਏਕੜ'
    ],
    fertilizerTitle: 'ਖਾਦ ਪਲਾਨ (Fertilizer plan)',
    fertilizerApproved: 'ਖੇਤੀ ਮਾਹਿਰਾਂ ਵੱਲੋਂ ਪ੍ਰਮਾਣਿਤ',
    fertilizerStages: [
      'ਬਿਜਾਈ ਸਮੇਂ: ਬੇਸਲ ਡੋਜ਼ (DAP + ਪੋਟਾਸ਼)',
      '30 ਦਿਨ: ਪਹਿਲੀ ਖਾਦ (ਯੂਰੀਆ)',
      '60 ਦਿਨ: ਦੂਜੀ ਖਾਦ (ਸਪਰੇਅ)'
    ],
    requestFromStore: 'ਸਟੋਰ ਤੋਂ ਮੰਗਵਾਓ',
    askTitle: 'ਕਿਸਾਨਮਿੱਤਰ ਨੂੰ ਪੁੱਛੋ',
    askSubtitle: 'ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਬੋਲੋ ਜਾਂ ਲਿਖੋ',
    askPlaceholder: 'ਮੈਂ ਫ਼ਸਲ ਕਦੋਂ ਵੇਚਾਂ?',
    footerDisclaimer: 'ਅਨੁਮਾਨ ਫ਼ੈਸਲੇ ਵਿੱਚ ਮਦਦ ਲਈ ਹੈ, ਕੋਈ ਗਰੰਟੀ ਨਹੀਂ।'
  },
  common: {
    selectCropTitle: 'ਫ਼ਸਲ ਚੁਣੋ',
    selectMarketTitle: 'ਮੰਡੀ ਚੁਣੋ',
    close: 'ਬੰਦ ਕਰੋ',
    apply: 'ਲਾਗੂ ਕਰੋ',
    rupeePerQuintal: '₹/ਕੁਇੰਟਲ',
    rupeePerPack: '₹',
    approvedByExpert: 'ਮਾਹਿਰ ਪ੍ਰਮਾਣਿਤ',
    disclaimerDecision: 'ਅਨੁਮਾਨ ਫ਼ੈਸਲੇ ਵਿੱਚ ਮਦਦ ਲਈ ਹੈ, ਕੋਈ ਗਰੰਟੀ ਨਹੀਂ।'
  }
};

export const translations: Record<Locale, Translations> = {
  en: enTranslations,
  hi: hiTranslations,
  mr: mrTranslations,
  gu: guTranslations,
  ta: taTranslations,
  te: teTranslations,
  kn: knTranslations,
  bn: bnTranslations,
  pa: paTranslations,
};
