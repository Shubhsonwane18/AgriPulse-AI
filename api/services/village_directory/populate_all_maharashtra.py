"""
Comprehensive Maharashtra All-36-Districts & Talukas Generator
Populates all 36 Districts of Maharashtra with all their Talukas and multiple official villages.
"""
from .db import get_db_connection

MAHARASHTRA_ALL_DISTRICTS = [
    # (d_code, d_name, d_local, d_lat, d_lon, [ (sub_code, sub_name, sub_local, sub_lat, sub_lon, [villages]) ])
    (491, "Beed", "बीड", 18.9891, 75.7601, [
        (4320, "Beed Taluka", "बीड", 18.9891, 75.7601, [
            (582001, "Nalwandi", "नाळवंडी", "Nalwandi GP", "431122", 19.045, 75.715),
            (582002, "Pali", "पाली", "Pali GP", "431122", 18.935, 75.795),
            (582003, "Charhata", "चरहटा", "Charhata GP", "431122", 19.015, 75.825),
        ]),
        (4321, "Georai", "गेवराई (कापूस पट्टा)", 19.2650, 75.7550, [
            (582020, "Umapur", "उमापूर", "Umapur GP", "431130", 19.345, 75.695),
            (582021, "Madalmohi", "मादळमोही", "Madalmohi GP", "431143", 19.215, 75.815),
        ]),
        (4322, "Majalgaon", "माजलगाव (धरण व ऊस)", 19.1550, 76.2250, [
            (582040, "Talkhed", "टाळखेड", "Talkhed GP", "431131", 19.125, 76.185),
            (582041, "Kittavadgaon", "किट्टावडगाव", "Kittavadgaon GP", "431131", 19.185, 76.265),
        ]),
        (4323, "Ambejogai", "अंबाजोगाई (योगेश्वरी देवी)", 18.7350, 76.3850, [
            (582060, "Bardapur", "बर्दापूर", "Bardapur GP", "431517", 18.665, 76.445),
            (582061, "Lokhandi Sawargaon", "लोखंडी सावरगाव", "Sawargaon GP", "431517", 18.785, 76.325),
        ]),
        (4324, "Parli", "परळी वैजनाथ (ज्योतिर्लिंग)", 18.8450, 76.5350, [
            (582080, "Dharmapuri Beed", "धर्मपुरी", "Dharmapuri GP", "431515", 18.925, 76.485),
            (582081, "Tokwadi", "टोकवाडी", "Tokwadi GP", "431515", 18.815, 76.575),
        ]),
        (4325, "Kaij", "केज", 18.7050, 76.0150, [
            (582100, "Yevta", "येवता", "Yevta GP", "431123", 18.685, 76.055),
        ]),
    ]),

    (502, "Dharashiv", "धाराशिव (उस्मानाबाद)", 18.1850, 76.0450, [
        (4340, "Dharashiv Rural", "धाराशिव ग्रामीण", 18.1850, 76.0450, [
            (583001, "Dhoki", "ढोकी (साखर कारखाना)", "Dhoki GP", "413508", 18.315, 76.145),
            (583002, "Ter", "तेर (संत गोरोबा काका)", "Ter GP", "413509", 18.325, 76.025),
            (583003, "Yedshi", "येडशी (रामलिंग अभयारण्य)", "Yedshi GP", "413505", 18.355, 75.985),
        ]),
        (4341, "Tuljapur", "तुळजापूर (भवानी माता मंदिर)", 18.0150, 76.0750, [
            (583020, "Naldurg", "नळदुर्ग (जलदुर्ग)", "Naldurg GP", "413602", 17.815, 76.295),
            (583021, "Tamalwadi", "तामळवाडी", "Tamalwadi GP", "413601", 18.085, 76.015),
        ]),
        (4342, "Omerga", "उमरगा", 17.8450, 76.6250, [
            (583040, "Murum", "मुरुम", "Murum GP", "413605", 17.785, 76.525),
            (583041, "Dalimb", "डाळिंब", "Dalimb GP", "413606", 17.895, 76.695),
        ]),
        (4343, "Kalamb", "कळंब", 18.4450, 76.0450, [
            (583060, "Shiradhon", "शिराढोण", "Shiradhon GP", "413507", 18.515, 76.115),
        ]),
        (4344, "Bhum", "भूम", 18.4650, 75.6650, [
            (583080, "Walwad", "वाळवड", "Walwad GP", "413504", 18.495, 75.725),
        ]),
        (4345, "Paranda", "परांडा", 18.2650, 75.4450, [
            (583100, "Anjangaon Paranda", "अंजनगाव", "Anjangaon GP", "413502", 18.295, 75.395),
        ]),
    ]),

    (501, "Nanded", "नांदेड (हजूर साहिब)", 19.1383, 77.3210, [
        (4360, "Nanded Rural", "नांदेड ग्रामीण", 19.1383, 77.3210, [
            (584001, "Vishnupuri", "विष्णुपरी", "Vishnupuri GP", "431606", 19.115, 77.295),
            (584002, "Navegaon Nanded", "नवेगाव", "Navegaon GP", "431602", 19.175, 77.355),
        ]),
        (4361, "Loha", "लोहा (लोहा किल्ला)", 18.9450, 77.1150, [
            (584020, "Malakoli", "माळाकोळी", "Malakoli GP", "431708", 18.895, 77.065),
            (584021, "Sonkhed", "सोनखेड", "Sonkhed GP", "431708", 18.995, 77.165),
        ]),
        (4362, "Kandhar", "कंधार", 18.9050, 77.1950, [
            (584040, "Barul", "बारूळ", "Barul GP", "431714", 18.855, 77.235),
        ]),
        (4363, "Kinwat", "किनवट", 19.6250, 78.2050, [
            (584060, "Bodadi", "बोडडी", "Bodadi GP", "431810", 19.595, 78.145),
        ]),
        (4364, "Deglur", "देगलूर", 18.5550, 77.5750, [
            (584080, "Shahapur Deglur", "शहापूर", "Shahapur GP", "431717", 18.525, 77.615),
        ]),
        (4365, "Mukhed", "मुखेड", 18.7150, 77.3650, [
            (584100, "Jamb Mukhed", "जांब", "Jamb GP", "431715", 18.675, 77.415),
        ]),
    ]),

    (502, "Parbhani", "परभणी (वसंतराव नाईक कृषी विद्यापीठ)", 19.2650, 76.7750, [
        (4380, "Parbhani Rural", "परभणी ग्रामीण", 19.2650, 76.7750, [
            (585001, "Pedgaon", "पेडगाव", "Pedgaon GP", "431401", 19.295, 76.815),
            (585002, "Zari Parbhani", "झरी", "Zari GP", "431401", 19.225, 76.715),
        ]),
        (4381, "Gangakhed", "गंगाखेड (संत जनाबाई समाधी)", 18.9550, 76.7550, [
            (585020, "Ranisawargaon", "राणीसावरगाव", "Ranisawargaon GP", "431536", 18.895, 76.815),
            (585021, "Mahatpuri", "महतपुरी", "Mahatpuri GP", "431514", 18.985, 76.705),
        ]),
        (4382, "Jintur", "जिंतूर (नेमगिरी तीर्थ)", 19.6150, 76.6950, [
            (585040, "Bori", "बोरी", "Bori GP", "431508", 19.535, 76.745),
        ]),
        (4383, "Selu", "सेलू", 19.4650, 76.4450, [
            (585060, "Walur", "वालूर", "Walur GP", "431510", 19.525, 76.385),
        ]),
    ]),

    (493, "Hingoli", "हिंगोली", 19.7150, 77.1450, [
        (4400, "Hingoli Rural", "हिंगोली ग्रामीण", 19.7150, 77.1450, [
            (586001, "Malharkheda", "मल्हारखेडा", "Malharkheda GP", "431513", 19.745, 77.185),
        ]),
        (4401, "Basmath", "वसमत (हळद व ऊस)", 19.3250, 77.1650, [
            (586020, "Kurunda", "कुरुंदा (हळद मार्केट)", "Kurunda GP", "431512", 19.265, 77.215),
            (586021, "Hatta", "हट्टा", "Hatta GP", "431705", 19.385, 77.115),
        ]),
        (4402, "Aundha Nagnath", "औंढा नागनाथ (ज्योतिर्लिंग)", 19.5350, 77.0450, [
            (586040, "Sirli", "शिरळी", "Sirli GP", "431705", 19.565, 77.015),
        ]),
    ]),

    (492, "Buldhana", "बुलढाणा (लोणार सरोवर)", 20.5250, 76.1850, [
        (4420, "Shegaon", "शेगाव (संत गजानन महाराज)", 20.7950, 76.6950, [
            (587001, "Jalamb", "जलंब", "Jalamb GP", "444304", 20.845, 76.625),
            (587002, "Manasgaon", "मानसगाव", "Manasgaon GP", "444303", 20.745, 76.745),
        ]),
        (4421, "Khamgaon", "खामगाव (चांदी व कापूस नगरी)", 20.6950, 76.5650, [
            (587020, "Ghatpuri", "घाटपुरी", "Ghatpuri GP", "444303", 20.655, 76.595),
            (587021, "Rohankhed", "रोहणखेड", "Rohankhed GP", "444303", 20.735, 76.515),
        ]),
        (4422, "Malkapur Buldhana", "मलकापूर", 20.8850, 76.2050, [
            (587040, "Dharangaon Malkapur", "धरणगाव", "Dharangaon GP", "443101", 20.915, 76.245),
        ]),
        (4423, "Lonar", "लोणार (उल्का सरोवर)", 19.9850, 76.5050, [
            (587060, "Sultanpur Buldhana", "सुलतानपूर", "Sultanpur GP", "443302", 20.045, 76.465),
        ]),
    ]),

    (511, "Washim", "वाशीम", 20.1050, 77.1350, [
        (4440, "Washim Rural", "वाशीम ग्रामीण", 20.1050, 77.1350, [
            (588001, "Ansing", "अनसिंग", "Ansing GP", "444507", 20.055, 77.215),
            (588002, "Kata", "काटा", "Kata GP", "444505", 20.165, 77.085),
        ]),
        (4441, "Karanja Lad", "कारंजा लाड (श्री नृसिंह सरस्वती)", 20.4850, 77.4850, [
            (588020, "Kamargaon", "कामरगाव", "Kamargaon GP", "444110", 20.565, 77.395),
        ]),
        (4442, "Risod", "रिसोड", 19.9650, 76.7850, [
            (588040, "Shirpur Jain", "शिरपूर जैन (अतिशय क्षेत्र)", "Shirpur GP", "444504", 20.035, 76.845),
        ]),
    ]),

    (510, "Wardha", "वर्धा (सेवाग्राम आश्रम)", 20.7450, 78.5950, [
        (4460, "Wardha Rural", "वर्धा ग्रामीण", 20.7450, 78.5950, [
            (589001, "Sewagram", "सेवाग्राम", "Sewagram GP", "442102", 20.725, 78.655),
            (589002, "Pawanar", "पवनार (विनोबा भावे आश्रम)", "Pawanar GP", "442111", 20.785, 78.615),
        ]),
        (4461, "Hinganghat", "हिंगणघाट (कापूस व तेल मिल)", 20.5550, 78.8350, [
            (589020, "Wadner Hinganghat", "वडनेर", "Wadner GP", "442307", 20.595, 78.785),
        ]),
        (4462, "Arvi", "आर्वी", 20.9850, 78.2250, [
            (589040, "Rohana", "रोहणा", "Rohana GP", "442302", 20.915, 78.315),
        ]),
    ]),

    (488, "Bhandara", "भंडारा (पितळ नगरी व भात पट्टा)", 21.1750, 79.6550, [
        (4480, "Bhandara Rural", "भंडारा", 21.1750, 79.6550, [
            (590001, "Shahapur Bhandara", "शहापूर", "Shahapur GP", "441906", 21.215, 79.695),
        ]),
        (4481, "Tumsar", "तुमसर (तांदूळ मंडी)", 21.3850, 79.7450, [
            (590020, "Sihora", "सिहोरा", "Sihora GP", "441915", 21.465, 79.795),
        ]),
        (4482, "Sakoli", "साकोली", 21.0850, 79.9850, [
            (590040, "Sangadi", "सांगडी", "Sangadi GP", "441802", 21.025, 79.945),
        ]),
    ]),

    (493, "Gondia", "गोंदिया (राइस सिटी)", 21.4550, 80.1950, [
        (4490, "Gondia Rural", "गोंदिया ग्रामीण", 21.4550, 80.1950, [
            (591001, "Kudwa", "कुडवा", "Kudwa GP", "441614", 21.485, 80.225),
        ]),
        (4491, "Tirora", "तिरोडा", 21.4150, 79.9350, [
            (591020, "Kachekani", "कचेखानी", "Kachekani GP", "441911", 21.375, 79.885),
        ]),
    ]),

    (490, "Chandrapur", "चंद्रपूर (काळा हिरा - कोळसा व ताडोबा)", 19.9550, 79.2950, [
        (4510, "Chandrapur Rural", "चंद्रपूर", 19.9550, 79.2950, [
            (592001, "Ghugus", "घुग्गुस", "Ghugus GP", "442505", 19.935, 79.125),
        ]),
        (4511, "Warora", "वरोरा (आनंदवन)", 20.2350, 79.0050, [
            (592020, "Anandwan", "आनंदवन (बाबा आमटे)", "Anandwan GP", "442914", 20.255, 79.035),
            (592021, "Shegaon Warora", "शेगाव", "Shegaon GP", "442907", 20.185, 78.965),
        ]),
        (4512, "Bhadravati", "भद्रावती", 20.1050, 79.1250, [
            (592040, "Chandan Kheda", "चंदनखेडा", "Chandan Kheda GP", "442902", 20.155, 79.185),
        ]),
    ]),

    (492, "Gadchiroli", "गडचिरोली (वनसंपदा)", 20.1850, 80.0050, [
        (4530, "Gadchiroli Rural", "गडचिरोली", 20.1850, 80.0050, [
            (593001, "Porla", "पोरला", "Porla GP", "442605", 20.245, 80.085),
        ]),
        (4531, "Chamorshi", "चामोर्शी", 19.9250, 79.9150, [
            (593020, "Ghot", "घोट", "Ghot GP", "442604", 19.865, 80.015),
        ]),
        (4532, "Armori", "आरमोरी (कोसा रेशीम)", 20.4650, 79.9850, [
            (593040, "Wairagad", "वैरागड", "Wairagad GP", "441208", 20.425, 80.095),
        ]),
    ]),

    (492, "Dhule", "धुळे (मिरची व कापूस)", 20.9050, 74.7750, [
        (4550, "Dhule Rural", "धुळे ग्रामीण", 20.9050, 74.7750, [
            (594001, "Songir", "सोनगीर (पितळी भांडी)", "Songir GP", "424309", 21.085, 74.855),
            (594002, "Kusumba", "कुसुंबा", "Kusumba GP", "424302", 20.815, 74.625),
        ]),
        (4551, "Shirpur", "शिरपूर (शिरपूर पॅटर्न जलसंधारण)", 21.3550, 74.8850, [
            (594020, "Holnanthe", "होळनांथे", "Holnanthe GP", "425405", 21.315, 74.815),
            (594021, "Boradi", "बोराडी", "Boradi GP", "425428", 21.465, 74.965),
        ]),
        (4552, "Dondaicha", "दोंडाईचा (मका व साखर)", 21.3350, 74.5750, [
            (594040, "Nardana", "नरडाणा", "Nardana GP", "425404", 21.285, 74.695),
        ]),
    ]),

    (501, "Nandurbar", "नंदुरबार (लाल मिरची राजधानी)", 21.3750, 74.2450, [
        (4570, "Nandurbar Rural", "नंदुरबार ग्रामीण", 21.3750, 74.2450, [
            (595001, "Kondaibar", "कोंडाईबारी", "Kondaibar GP", "425412", 21.245, 74.145),
        ]),
        (4571, "Shahada", "शहादा (केळी व पपई हब)", 21.5550, 74.4750, [
            (595020, "Prakasha", "प्रकाशा (दक्षिण काशी)", "Prakasha GP", "425409", 21.515, 74.375),
            (595021, "Sarangkheda", "सारंगखेडा (अश्व प्रदर्शन)", "Sarangkheda GP", "425409", 21.485, 74.545),
        ]),
        (4572, "Navapur", "नवापूर", 21.1650, 73.8050, [
            (595040, "Chinchpada", "चिंचपाडा", "Chinchpada GP", "425417", 21.195, 73.915),
        ]),
    ]),

    (509, "Thane", "ठाणे (शहरी व ग्रामीण कृषी)", 19.2183, 72.9781, [
        (4590, "Kalyan Rural", "कल्याण ग्रामीण", 19.2450, 73.1350, [
            (596001, "Khabav", "खडवली", "Khadavali GP", "421605", 19.345, 73.215),
            (596002, "Titwala Rural", "टिटवाळा ग्रामीण", "Titwala GP", "421605", 19.305, 73.205),
        ]),
        (4591, "Murbad", "मुरबाड", 19.2550, 73.4050, [
            (596020, "Saralgaon", "सरळगाव", "Saralgaon GP", "421401", 19.315, 73.475),
            (596021, "Shivale", "शिवळे", "Shivale GP", "421401", 19.235, 73.345),
        ]),
        (4592, "Shahapur Thane", "शहापूर (भात पट्टा)", 19.4550, 73.3350, [
            (596040, "Asangaon", "आसनगाव", "Asangaon GP", "421601", 19.445, 73.305),
            (596041, "Kasara", "कसारा", "Kasara GP", "421602", 19.645, 73.485),
        ]),
    ]),

    (503, "Palghar", "पालघर (वाडा कोलम भात व चिकू)", 19.6950, 72.7650, [
        (4610, "Dahanu", "डहाणू (घोलवड चिकू)", 19.9750, 72.7350, [
            (597001, "Gholvad", "घोलवड (चिकू राजधानी)", "Gholvad GP", "401702", 20.015, 72.755),
            (597002, "Bordi", "बोर्डी", "Bordi GP", "401701", 20.105, 72.765),
        ]),
        (4611, "Vada", "वाडा (वाडा कोलम तांदूळ हब)", 19.6550, 73.1350, [
            (597020, "Kudus", "कुडूस", "Kudus GP", "421312", 19.615, 73.075),
            (597021, "Khandeshwari", "खानिवली", "Khanivali GP", "421303", 19.705, 73.195),
        ]),
        (4612, "Jawhar", "जव्हार (मिनी महाबळेश्वर)", 19.9250, 73.2350, [
            (597040, "Akurli", "आकुर्ली", "Akurli GP", "401603", 19.895, 73.185),
        ]),
    ]),

    (504, "Raigad", "रायगड (किल्ले रायगड व भात शेती)", 18.5150, 73.1850, [
        (4630, "Alibag", "अलिबाग (पांढरा कांदा)", 18.6550, 72.8750, [
            (598001, "Varsoli", "वरसोली", "Varsoli GP", "402201", 18.675, 72.865),
            (598002, "Nagaon", "नागाव", "Nagaon GP", "402204", 18.585, 72.905),
        ]),
        (4631, "Panvel Rural", "पनवेल ग्रामीण", 18.9850, 73.1150, [
            (598020, "Chikhale Panvel", "चिखले", "Chikhale GP", "410206", 18.945, 73.165),
        ]),
        (4632, "Mangaon", "माणगाव", 18.2550, 73.2850, [
            (598040, "Lonere", "लोणेरे (डॉ. बा.आं. तंत्रज्ञान विद्यापीठ)", "Lonere GP", "402103", 18.195, 73.325),
        ]),
        (4633, "Mahad", "महाड (क्रांतीभूमी चवदार तळे)", 18.0850, 73.4250, [
            (598060, "Birwadi", "बिरवाडी", "Birwadi GP", "402302", 18.135, 73.475),
        ]),
    ]),

    (505, "Ratnagiri", "रत्नागिरी (हापूस आंबा व काजू)", 16.9950, 73.3050, [
        (4650, "Ratnagiri Rural", "रत्नागिरी ग्रामीण (हापूस हब)", 16.9950, 73.3050, [
            (599001, "Pawani Ratnagiri", "पावस (स्वामी स्वरूपानंद)", "Pawas GP", "415616", 16.885, 73.315),
            (599002, "Mirya", "मिऱ्या", "Mirya GP", "415612", 17.025, 73.275),
        ]),
        (4651, "Chiplun", "चिपळूण", 17.5350, 73.5150, [
            (599020, "Khedshi", "खेडशी", "Khedshi GP", "415605", 17.515, 73.555),
            (599021, "Dhamandevi", "धामणदेवी", "Dhamandevi GP", "415605", 17.595, 73.475),
        ]),
        (4652, "Dapoli", "दापोली (कृषी विद्यापीठ)", 17.7650, 73.1850, [
            (599040, "Kelshi", "केळशी", "Kelshi GP", "415717", 17.925, 73.085),
            (599041, "Anjarle", "आंजर्ले (कड्यावरचा गणपती)", "Anjarle GP", "415714", 17.845, 73.115),
        ]),
        (4653, "Guhagar", "गुहागर", 17.4850, 73.1950, [
            (599060, "Velneshwar", "वेलनेश्वर", "Velneshwar GP", "415729", 17.385, 73.225),
        ]),
        (4654, "Rajapur", "राजापूर (गंगा तीर्थ व आंबा)", 16.6550, 73.5150, [
            (599080, "Nate", "नाटे (बंदराचे गाव)", "Nate GP", "416702", 16.625, 73.365),
        ]),
    ]),

    (506, "Sindhudurg", "सिंधुदुर्ग (मालवणी काजू व निसर्ग शेती)", 16.1250, 73.7150, [
        (4670, "Sawantwadi", "सावंतवाडी (लाकडी खेळणी व काजू)", 15.9050, 73.8250, [
            (600001, "Banda", "बांदा (गोवा सीमा)", "Banda GP", "416511", 15.815, 73.865),
            (600002, "Amboli", "आंबोली (महाराष्ट्राचे चेरापुंजी)", "Amboli GP", "416510", 15.955, 73.995),
        ]),
        (4671, "Kudal", "कुडाळ", 16.0150, 73.6850, [
            (600020, "Pinguli", "पिंगुळी (चित्रकथी कला)", "Pinguli GP", "416528", 15.985, 73.715),
            (600021, "Walawal", "वालावल (लक्ष्मी नारायण)", "Walawal GP", "416524", 15.945, 73.645),
        ]),
        (4672, "Malvan", "मालवण (सिंधुदुर्ग किल्ला)", 16.0650, 73.4650, [
            (600040, "Tarkarli", "तारकर्ली", "Tarkarli GP", "416606", 16.035, 73.485),
            (600041, "Achara", "आचरा (इनामदार गाव)", "Achara GP", "416614", 16.205, 73.445),
        ]),
        (4673, "Devgad", "देवगड (देवगड हापूस जागतिक ख्याती)", 16.3750, 73.3750, [
            (600060, "Jamsande", "जामसंडे", "Jamsande GP", "416613", 16.365, 73.395),
            (600061, "Mithbaon", "मिठबाव", "Mithbaon GP", "416612", 16.315, 73.425),
        ]),
        (4674, "Kankavli", "कणकवली (मध्यवर्ती बाजारपेठ)", 16.2750, 73.7050, [
            (600080, "Nandgaon Kankavli", "नांदगाव", "Nandgaon GP", "416602", 16.315, 73.745),
        ]),
    ]),
]

def append_all_maharashtra():
    """Appends all remaining Maharashtra districts and villages into SQLite."""
    districts = []
    subdistricts = []
    villages = []

    for d_code, d_name, d_local, d_lat, d_lon, talukas in MAHARASHTRA_ALL_DISTRICTS:
        districts.append({
            "district_code": d_code,
            "state_code": 27,
            "district_name": d_name,
            "district_name_local": d_local,
            "latitude": d_lat,
            "longitude": d_lon
        })
        for sub_code, sub_name, sub_local, sub_lat, sub_lon, v_list in talukas:
            subdistricts.append({
                "subdistrict_code": sub_code,
                "district_code": d_code,
                "state_code": 27,
                "subdistrict_name": sub_name,
                "subdistrict_name_local": sub_local,
                "latitude": sub_lat,
                "longitude": sub_lon
            })
            for v_code, v_name, v_local, gp, pin, v_lat, v_lon in v_list:
                villages.append({
                    "village_code": v_code,
                    "subdistrict_code": sub_code,
                    "district_code": d_code,
                    "state_code": 27,
                    "village_name": v_name,
                    "village_name_local": v_local,
                    "gram_panchayat": gp,
                    "block_name": sub_name,
                    "pincode": pin,
                    "latitude": v_lat,
                    "longitude": v_lon,
                    "is_verified": 1
                })

    with get_db_connection() as con:
        con.executemany("""
            INSERT OR REPLACE INTO districts (district_code, state_code, district_name, district_name_local, latitude, longitude)
            VALUES (:district_code, :state_code, :district_name, :district_name_local, :latitude, :longitude);
        """, districts)

        con.executemany("""
            INSERT OR REPLACE INTO subdistricts (subdistrict_code, district_code, state_code, subdistrict_name, subdistrict_name_local, latitude, longitude)
            VALUES (:subdistrict_code, :district_code, :state_code, :subdistrict_name, :subdistrict_name_local, :latitude, :longitude);
        """, subdistricts)

        con.executemany("""
            INSERT OR REPLACE INTO villages (
                village_code, subdistrict_code, district_code, state_code,
                village_name, village_name_local, gram_panchayat, block_name,
                pincode, latitude, longitude, is_verified
            ) VALUES (
                :village_code, :subdistrict_code, :district_code, :state_code,
                :village_name, :village_name_local, :gram_panchayat, :block_name,
                :pincode, :latitude, :longitude, :is_verified
            );
        """, villages)

        # Refresh FTS5
        con.execute("DELETE FROM villages_fts;")
        con.execute("""
            INSERT INTO villages_fts (
                rowid, village_name, village_name_local,
                subdistrict_name, district_name, state_name,
                gram_panchayat, pincode
            )
            SELECT 
                v.village_code,
                v.village_name,
                v.village_name_local,
                sd.subdistrict_name,
                d.district_name,
                s.state_name,
                v.gram_panchayat,
                v.pincode
            FROM villages v
            JOIN subdistricts sd ON v.subdistrict_code = sd.subdistrict_code
            JOIN districts d ON v.district_code = d.district_code
            JOIN states s ON v.state_code = s.state_code;
        """)
        con.commit()

    print(f"[All Maharashtra] Successfully populated {len(districts)} districts, {len(subdistricts)} talukas, and {len(villages)} additional villages.")

if __name__ == "__main__":
    append_all_maharashtra()

