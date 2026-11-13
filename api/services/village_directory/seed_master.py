"""
Comprehensive Master Database Initializer for Local Government Directory (LGD)
Includes all 36 Districts of Maharashtra + Agricultural Hubs of MP, Gujarat, Karnataka, Punjab.
"""
from .db import get_db_connection
from .constants import OFFICIAL_MAHARASHTRA_DISTRICT_CODES

def seed_master():
    with get_db_connection() as con:
        # Wipe old data for clean seed
        con.execute("DELETE FROM villages_fts;")
        con.execute("DELETE FROM villages;")
        con.execute("DELETE FROM subdistricts;")
        con.execute("DELETE FROM districts;")
        con.execute("DELETE FROM states;")

        # 1. States
        states = [
            (27, "Maharashtra", "महाराष्ट्र"),
            (23, "Madhya Pradesh", "मध्य प्रदेश"),
            (24, "Gujarat", "ગુજરાત / गुजरात"),
            (29, "Karnataka", "ಕರ್ನಾಟಕ / कर्नाटक"),
            (3, "Punjab", "ਪੰਜਾਬ / पंजाब"),
        ]
        con.executemany("INSERT INTO states (state_code, state_name, state_name_local) VALUES (?, ?, ?);", states)

        # 2. Insert all 36 Maharashtra Districts
        for d_name, (d_code, d_local, d_lat, d_lon) in OFFICIAL_MAHARASHTRA_DISTRICT_CODES.items():
            con.execute("""
                INSERT INTO districts (district_code, state_code, district_name, district_name_local, latitude, longitude)
                VALUES (?, 27, ?, ?, ?, ?);
            """, (d_code, d_name, d_local, d_lat, d_lon))

        # Other States Districts
        other_districts = [
            (407, 23, "Indore", "इंदौर", 22.7196, 75.8577),
            (428, 23, "Ujjain", "उज्जैन", 23.1765, 75.7885),
            (415, 23, "Mandsaur", "मंदसौर", 24.0722, 75.0682),
            (419, 23, "Neemuch", "नीमच", 24.4722, 74.8682),
            (461, 24, "Rajkot", "રાજકોટ / राजकोट", 22.3039, 70.8022),
            (457, 24, "Mehsana", "મહેસાણા / मेहसाणा (ऊंझा)", 23.8042, 72.3925),
            (465, 24, "Surat", "સુરત / सूरत", 21.1702, 72.8311),
            (528, 29, "Belagavi", "ಬೆಳಗಾವಿ / बेळगाव", 15.8497, 74.4977),
            (534, 29, "Dharwad", "ಧಾರವಾಡ / धारवाड (हुबळी)", 15.3647, 75.1240),
            (34, 3, "Ludhiana", "ਲੁਧਿਆਣਾ / लुधियाना", 30.9010, 75.8573),
        ]
        con.executemany("""
            INSERT INTO districts (district_code, state_code, district_name, district_name_local, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?);
        """, other_districts)

        # 3. Talukas / Subdistricts & Villages
        # Format: (sub_code, d_code, s_code, sub_name, sub_local, sub_lat, sub_lon, [ (v_code, v_name, v_local, gp, pin, v_lat, v_lon) ])
        subdistricts_data = [
            # Kolhapur (501)
            (4150, 501, 27, "Karvir", "करवीर", 16.7050, 74.2433, [
                (567101, "Kasaba Bawada", "कसबा बावडा", "Kasaba Bawada GP", "416006", 16.7210, 74.2450),
                (567102, "Uchgaon", "उचगाव", "Uchgaon GP", "416005", 16.6850, 74.2750),
                (567103, "Vadanange", "वदनंगे", "Vadanange GP", "416012", 16.7350, 74.2150),
                (567104, "Kalamba", "कळंबा", "Kalamba GP", "416007", 16.6650, 74.2350),
                (567105, "Shiroli Dumala", "शिरोली दुमाला", "Shiroli Dumala GP", "416122", 16.7450, 74.2950),
                (567106, "Gokul Shirgaon", "गोकुळ शिरगाव", "Gokul Shirgaon GP", "416234", 16.6350, 74.2850),
                (567107, "Mudshingi", "मुडशिंगी", "Mudshingi GP", "416119", 16.6750, 74.3150),
                (567108, "Kaneri", "कानेरी (सिद्धगिरी)", "Kaneri Math GP", "416234", 16.6120, 74.2650),
            ]),
            (4151, 501, 27, "Hatkanangale", "हातकणंगले", 16.7450, 74.4450, [
                (567120, "Hupari", "हुपरी (चांदी नगरी)", "Hupari GP", "416115", 16.6250, 74.4050),
                (567121, "Pattankodoli", "पट्टणकोडोली", "Pattankodoli GP", "416109", 16.6450, 74.3450),
                (567122, "Rukadi", "रुकडी", "Rukadi GP", "416118", 16.7250, 74.3550),
                (567123, "Alte", "आळते", "Alte GP", "416110", 16.7850, 74.4250),
                (567124, "Kumbhoj", "कुंभोज", "Kumbhoj GP", "416111", 16.7650, 74.4750),
                (567125, "Kabnoor", "कबणूर", "Kabnoor GP", "416115", 16.7150, 74.4850),
            ]),
            (4152, 501, 27, "Shirol", "शिरोळ", 16.7150, 74.5950, [
                (567140, "Jaysingpur", "जयसिंगपूर", "Jaysingpur Town", "416101", 16.7820, 74.5580),
                (567141, "Kurundwad", "कुरुंदवाड", "Kurundwad GP", "416106", 16.6850, 74.6050),
                (567142, "Danoli", "दानोळी", "Danoli GP", "416101", 16.7650, 74.5250),
                (567143, "Dharangutti", "धरंगुत्ती", "Dharangutti GP", "416101", 16.7350, 74.5450),
            ]),
            (4153, 501, 27, "Kagal", "कागल", 16.5780, 74.3180, [
                (567160, "Murgud", "मुरगूड", "Murgud GP", "416219", 16.4850, 74.2250),
                (567161, "Senapati Kapashi", "सेनापती कापशी", "Kapashi GP", "416218", 16.4550, 74.2950),
                (567162, "Hamidwada", "हमीदवाडा", "Hamidwada GP", "416235", 16.5350, 74.3450),
            ]),
            (4154, 501, 27, "Gadhinglaj", "गडहिंग्लज", 16.2250, 74.3550, [
                (567180, "Nool", "नूल", "Nool GP", "416502", 16.2050, 74.3850),
                (567181, "Koujalgi", "कौजलगी", "Koujalgi GP", "416502", 16.1850, 74.3350),
            ]),
            (4155, 501, 27, "Panhala", "पन्हाळा", 16.8120, 74.1100, [
                (567200, "Kodoli", "कोडोली", "Kodoli GP", "416114", 16.8650, 74.1950),
                (567201, "Kotoli", "कोतोली", "Kotoli GP", "416230", 16.7850, 74.0550),
            ]),
            (4156, 501, 27, "Radhanagari", "राधानगरी", 16.4170, 73.9980, [
                (567220, "Tarale", "ताराळे", "Tarale GP", "416211", 16.4950, 74.0550),
                (567221, "Kasaba Walva", "कसबा वाळवा", "Kasaba Walva GP", "416211", 16.4550, 74.0850),
            ]),

            # Nashik (508)
            (4230, 508, 27, "Niphad", "निफाड", 20.0850, 74.1100, [
                (571001, "Lasalgaon", "लासलगाव (कांदा राजधानी)", "Lasalgaon GP", "422306", 20.1472, 74.2255),
                (571002, "Pimpalgaon Baswant", "पिंपळगाव बसवंत (टोमॅटो मार्केट)", "Pimpalgaon GP", "422209", 20.1706, 73.9856),
                (571003, "Ozar", "ओझर", "Ozar GP", "422206", 20.0950, 73.9350),
                (571004, "Vinchur", "विंचूर", "Vinchur GP", "422305", 20.1150, 74.2650),
            ]),
            (4231, 508, 27, "Yeola", "येवला", 20.0450, 74.4850, [
                (571020, "Andarsul", "अंदरसूल", "Andarsul GP", "423402", 19.9650, 74.5550),
                (571021, "Nagarsul", "नगरसूल", "Nagarsul GP", "423403", 20.0950, 74.4550),
            ]),
            (4232, 508, 27, "Sinnar", "सिन्नर", 19.8550, 74.0050, [
                (571040, "Musalgaon", "मुसळगाव", "Musalgaon GP", "422112", 19.8950, 74.0350),
                (571041, "Wavi", "वावी", "Wavi GP", "422104", 19.8250, 74.1950),
            ]),
            (4233, 508, 27, "Dindori", "दिंडोरी", 20.2050, 73.8350, [
                (571060, "Vani", "वणी (सप्तशृंगी पायथा)", "Vani GP", "422215", 20.3250, 73.9050),
                (571061, "Janori", "जानोरी", "Janori GP", "422206", 20.1250, 73.8650),
            ]),

            # Ahmednagar (488)
            (4270, 488, 27, "Rahata", "राहाता", 19.6850, 74.4850, [
                (573001, "Shirdi", "शिर्डी", "Shirdi Town", "423109", 19.7650, 74.4750),
                (573002, "Loni Pravara", "लोणी प्रवरा", "Loni GP", "413736", 19.5850, 74.4650),
                (573003, "Sakori", "साकोरी", "Sakori GP", "423107", 19.6950, 74.4950),
                (573004, "Puntamba", "पुणतांबा", "Puntamba GP", "413707", 19.7750, 74.6150),
            ]),
            (4271, 488, 27, "Kopargaon", "कोपरगाव", 19.8850, 74.4850, [
                (573020, "Pohegaon", "पोहेगाव", "Pohegaon GP", "423106", 19.7950, 74.5250),
                (573021, "Suregaon", "सुरेगाव", "Suregaon GP", "423601", 19.9250, 74.4150),
            ]),
            (4272, 488, 27, "Sangamner", "संगमनेर", 19.5750, 74.2150, [
                (573040, "Ashwi", "आश्वी", "Ashwi GP", "413738", 19.5650, 74.3950),
                (573041, "Talegaon Dighe", "तळेगाव दिघे", "Talegaon Dighe GP", "422611", 19.6450, 74.2950),
            ]),
            (4273, 488, 27, "Shrirampur", "श्रीरामपूर", 19.6250, 74.6550, [
                (573060, "Belapur", "बेलापूर", "Belapur GP", "413715", 19.5750, 74.6450),
                (573061, "Taklibhan", "टाकळीभान", "Taklibhan GP", "413725", 19.6750, 74.7250),
            ]),
            (4274, 488, 27, "Nevasa", "नेवासा", 19.5550, 74.9250, [
                (573080, "Sonai", "सोनाई (शनि शिंगणापूर)", "Sonai GP", "414105", 19.3850, 74.8450),
                (573081, "Kukana", "कुकणा", "Kukana GP", "414604", 19.4650, 75.0550),
            ]),

            # Pune (511)
            (4210, 511, 27, "Baramati", "बारामती", 18.1550, 74.5800, [
                (570001, "Malegaon Budruk", "माळेगाव बुद्रुक", "Malegaon Bk GP", "413115", 18.1350, 74.5250),
                (570002, "Someshwarnagar", "सोमेश्वरनगर", "Someshwarnagar GP", "412306", 18.1950, 74.3450),
                (570003, "Supe Baramati", "सुपे", "Supe GP", "412258", 18.2950, 74.4150),
                (570004, "Morgaon", "मोरगाव", "Morgaon GP", "412304", 18.2750, 74.3150),
            ]),
            (4211, 511, 27, "Indapur", "इंदापूर", 18.1150, 75.0250, [
                (570020, "Bawada Indapur", "बावडा", "Bawada GP", "413114", 17.9850, 74.9650),
                (570021, "Bhigwan", "भिगवण", "Bhigwan GP", "413130", 18.2950, 74.7750),
            ]),
            (4213, 511, 27, "Junnar", "जुन्नर (नारायणगाव)", 19.2050, 73.8750, [
                (570060, "Narayangaon", "नारायणगाव", "Narayangaon GP", "410504", 19.1250, 73.9750),
                (570061, "Alephata", "आळेफाटा", "Alephata GP", "412411", 19.1850, 74.1050),
                (570062, "Otur", "ओतूर", "Otur GP", "412409", 19.2650, 73.9850),
            ]),
            (4215, 511, 27, "Khed", "खेड (चाकण)", 18.8550, 73.9050, [
                (570100, "Chakan", "चाकण (कांदा मार्केट)", "Chakan GP", "410501", 18.7650, 73.8550),
                (570101, "Rajgurunagar", "राजगुरुनगर", "Rajgurunagar Town", "410505", 18.8550, 73.9050),
            ]),
            (4216, 511, 27, "Ambegaon", "आंबेगाव (मंचर)", 19.0150, 73.8350, [
                (570120, "Manchar", "मंचर (कृषी उपज मंडी)", "Manchar GP", "410503", 19.0050, 73.9450),
            ]),

            # Sangli (514)
            (4170, 514, 27, "Miraj", "मिरज", 16.8250, 74.6450, [
                (568001, "Kupwad", "कुपवाड", "Kupwad GP", "416436", 16.8650, 74.6150),
                (568002, "Budhgaon", "बुधगाव", "Budhgaon GP", "416304", 16.8950, 74.6350),
                (568003, "Mhaishal", "म्हैसाळ", "Mhaishal GP", "416409", 16.7450, 74.7050),
            ]),
            (4171, 514, 27, "Walwa", "वाळवा (इस्लामपूर)", 17.0500, 74.2650, [
                (568020, "Islampur", "इस्लामपूर", "Islampur Town", "415409", 17.0500, 74.2650),
                (568021, "Ashta", "आष्टा", "Ashta GP", "416301", 16.9550, 74.4050),
                (568022, "Kasegaon Walwa", "कासेगाव", "Kasegaon GP", "415404", 17.1350, 74.2450),
            ]),
            (4172, 514, 27, "Tasgaon", "तासगाव", 17.0350, 74.6000, [
                (568040, "Savalaj", "सावळज (द्राक्ष हब)", "Savalaj GP", "416311", 17.0950, 74.7150),
                (568041, "Visapur", "विसापूर", "Visapur GP", "416312", 17.0550, 74.5250),
            ]),

            # Satara (515)
            (4190, 515, 27, "Karad", "कराड", 17.2850, 74.1850, [
                (569001, "Ogalewadi", "ओगलेवाडी", "Ogalewadi GP", "415105", 17.2950, 74.2150),
                (569002, "Umbraj", "उंब्रज", "Umbraj GP", "415109", 17.4050, 74.1150),
                (569003, "Masur", "मसूर", "Masur GP", "415106", 17.3650, 74.2250),
            ]),
            (4192, 515, 27, "Phaltan", "फलटण", 17.9850, 74.4350, [
                (569040, "Sakharwadi", "साखरवाडी", "Sakharwadi GP", "415522", 17.9550, 74.3850),
                (569041, "Taradgaon", "तरडगाव", "Taradgaon GP", "415528", 18.0450, 74.3250),
            ]),
            (4199, 515, 27, "Khandala", "खंडाळा", 18.0450, 74.0250, [
                (569180, "Lonand", "लोणंद (कांदा व आले बाजार)", "Lonand GP", "415521", 18.0450, 74.1950),
                (569181, "Shirwal", "शिरवळ", "Shirwal GP", "412801", 18.1350, 73.9850),
            ]),

            # Solapur (517)
            (4250, 517, 27, "Pandharpur", "पंढरपूर", 17.6750, 75.3250, [
                (572001, "Karkamb", "करकंब (डाळिंब हब)", "Karkamb GP", "413302", 17.8250, 75.3950),
                (572002, "Bhalwani", "भालवणी", "Bhalwani GP", "413310", 17.6150, 75.2450),
            ]),
            (4252, 517, 27, "Malshiras", "माळशिरस (अकलूज)", 17.8950, 75.0250, [
                (572040, "Akluj", "अकलूज (दूध व साखर)", "Akluj GP", "413101", 17.8950, 75.0250),
                (572041, "Natepute", "नातेपुते", "Natepute GP", "413109", 17.9150, 74.7750),
            ]),
            (4253, 517, 27, "Sangola", "सांगोला", 17.4350, 75.1950, [
                (572060, "Mahud", "महुद (डाळिंब)", "Mahud GP", "413306", 17.5850, 75.1450),
            ]),
            (4257, 517, 27, "Mangalwedha", "मंगळवेढा", 17.5150, 75.4450, [
                (572140, "Borale", "बोराळे (मालदांडी ज्वारी)", "Borale GP", "413305", 17.5650, 75.3950),
            ]),

            # Jalgaon (499)
            (4290, 499, 27, "Raver", "रावेर", 21.2450, 76.0350, [
                (574001, "Savda", "सावदा (केळी निर्यात केंद्र)", "Savda GP", "425502", 21.1450, 75.8950),
                (574002, "Nimbhora", "निंभोरा", "Nimbhora GP", "425507", 21.2250, 75.9550),
            ]),
            (4291, 499, 27, "Bhusawal", "भुसावळ", 21.0450, 75.7850, [
                (574020, "Varangaon", "वरणगाव", "Varangaon GP", "425305", 21.0150, 75.9050),
            ]),
            (4292, 499, 27, "Chopda", "चोपडा", 21.2550, 75.3050, [
                (574040, "Adavad", "अडावद", "Adavad GP", "425303", 21.2850, 75.4450),
            ]),

            # Chhatrapati Sambhajinagar (490)
            (4310, 490, 27, "Paithan", "पैठण", 19.4850, 75.3850, [
                (575001, "Pachod", "पाचोड (कापूस केंद्र)", "Pachod GP", "431121", 19.4650, 75.5450),
                (575002, "Bidkin", "बिडकीन", "Bidkin GP", "431105", 19.6850, 75.3350),
            ]),
            (4311, 490, 27, "Gangapur", "गंगापूर", 19.6950, 75.0150, [
                (575020, "Lasur Station", "लासूर स्टेशन (कांदा)", "Lasur GP", "423702", 19.8450, 74.9650),
            ]),

            # Jalna (500)
            (4331, 500, 27, "Ambad", "अंबड", 19.6150, 75.7950, [
                (576020, "Wadigodri", "वाडीगोद्री", "Wadigodri GP", "431205", 19.5750, 75.6850),
                (576021, "Shahagad", "शहागड", "Shahagad GP", "431212", 19.4950, 75.7750),
            ]),

            # Latur (502)
            (4350, 502, 27, "Latur Rural", "लातूर ग्रामीण", 18.4088, 76.5604, [
                (577001, "Murud Latur", "मुरुड", "Murud GP", "413510", 18.4350, 76.4150),
                (577002, "Babhalgaon", "बाभळगाव", "Babhalgaon GP", "413531", 18.3750, 76.6250),
            ]),
            (4351, 502, 27, "Ausa", "औसा", 18.2550, 76.5050, [
                (577020, "Belkund", "बेलकुंड", "Belkund GP", "413520", 18.2150, 76.4450),
            ]),

            # Nagpur (505)
            (4370, 505, 27, "Katol", "काटोल (संत्रा हब)", 21.2750, 78.5850, [
                (578001, "Metpanjra", "मेटपांजरा", "Metpanjra GP", "441302", 21.2450, 78.6450),
            ]),
            (4371, 505, 27, "Narkhed", "नरखेड", 21.4650, 78.5350, [
                (578020, "Mowad", "मोवाड", "Mowad GP", "441303", 21.5450, 78.4850),
            ]),

            # Amravati (487)
            (4390, 487, 27, "Warud", "वरुड (संत्रा हब)", 21.4650, 78.2650, [
                (579001, "Benoda", "बेनोडा", "Benoda GP", "444908", 21.4950, 78.3450),
                (579002, "Shendurjana Ghat", "शेंदूरजना घाट", "Shendurjana GP", "444907", 21.5150, 78.1950),
            ]),

            # Buldhana (493)
            (4420, 493, 27, "Shegaon", "शेगाव", 20.7950, 76.6950, [
                (587001, "Jalamb", "जलंब", "Jalamb GP", "444304", 20.845, 76.625),
            ]),
            (4421, 493, 27, "Khamgaon", "खामगाव", 20.6950, 76.5650, [
                (587020, "Ghatpuri", "घाटपुरी", "Ghatpuri GP", "444303", 20.655, 76.595),
            ]),

            # Yavatmal (521)
            (4430, 521, 27, "Wani", "वणी", 20.0650, 78.9550, [
                (581001, "Kayar", "कायर", "Kayar GP", "445304", 20.0250, 78.8950),
            ]),

            # Palghar (664)
            (4610, 664, 27, "Dahanu", "डहाणू (चिकू राजधानी)", 19.9750, 72.7350, [
                (597001, "Gholvad", "घोलवड", "Gholvad GP", "401702", 20.015, 72.755),
                (597002, "Bordi", "बोर्डी", "Bordi GP", "401701", 20.105, 72.765),
            ]),
            (4611, 664, 27, "Vada", "वाडा (वाडा कोलम भात)", 19.6550, 73.1350, [
                (597020, "Kudus", "कुडूस", "Kudus GP", "421312", 19.615, 73.075),
            ]),

            # Ratnagiri (513)
            (4650, 513, 27, "Ratnagiri Rural", "रत्नागिरी ग्रामीण", 16.9950, 73.3050, [
                (599001, "Pawas", "पावस", "Pawas GP", "415616", 16.885, 73.315),
            ]),
            (4652, 513, 27, "Dapoli", "दापोली", 17.7650, 73.1850, [
                (599040, "Kelshi", "केळशी", "Kelshi GP", "415717", 17.925, 73.085),
                (599041, "Anjarle", "आंजर्ले", "Anjarle GP", "415714", 17.845, 73.115),
            ]),

            # Sindhudurg (516)
            (4670, 516, 27, "Sawantwadi", "सावंतवाडी", 15.9050, 73.8250, [
                (600001, "Banda", "बांदा", "Banda GP", "416511", 15.815, 73.865),
                (600002, "Amboli", "आंबोली", "Amboli GP", "416510", 15.955, 73.995),
            ]),
            (4673, 516, 27, "Devgad", "देवगड (हापूस आंबा)", 16.3750, 73.3750, [
                (600060, "Jamsande", "जामसंडे", "Jamsande GP", "416613", 16.365, 73.395),
            ]),

            # Raigad (512)
            (4630, 512, 27, "Alibag", "अलिबाग", 18.6550, 72.8750, [
                (598001, "Varsoli", "वरसोली", "Varsoli GP", "402201", 18.675, 72.865),
                (598002, "Nagaon", "नागाव", "Nagaon GP", "402204", 18.585, 72.905),
            ]),

            # Dharashiv (509)
            (4340, 509, 27, "Dharashiv Rural", "धाराशिव", 18.1850, 76.0450, [
                (583001, "Dhoki", "ढोकी", "Dhoki GP", "413508", 18.315, 76.145),
                (583002, "Ter", "तेर", "Ter GP", "413509", 18.325, 76.025),
            ]),
            (4341, 509, 27, "Tuljapur", "तुळजापूर", 18.0150, 76.0750, [
                (583020, "Naldurg", "नळदुर्ग", "Naldurg GP", "413602", 17.815, 76.295),
            ]),

            # Beed (491)
            (4320, 491, 27, "Beed Rural", "बीड", 18.9891, 75.7601, [
                (582001, "Nalwandi", "नाळवंडी", "Nalwandi GP", "431122", 19.045, 75.715),
                (582002, "Pali", "पाली", "Pali GP", "431122", 18.935, 75.795),
            ]),
            (4323, 491, 27, "Ambejogai", "अंबाजोगाई (योगेश्वरी देवी)", 18.7350, 76.3850, [
                (582062, "Somanwadi", "सोमणवाडी", "Somanwadi GP", "431517", 18.7120, 76.3450),
                (582060, "Bardapur", "बर्दापूर", "Bardapur GP", "431517", 18.6650, 76.4450),
                (582061, "Lokhandi Sawargaon", "लोखंडी सावरगाव", "Sawargaon GP", "431517", 18.7850, 76.3250),
                (582063, "Chanai", "चनई", "Chanai GP", "431517", 18.7450, 76.4050),
                (582064, "Morewadi", "मोरेवाडी", "Morewadi GP", "431517", 18.7250, 76.3650),
                (582065, "Salegaon", "साळेगाव", "Salegaon GP", "431517", 18.7650, 76.4250),
                (582066, "Radi", "राडी", "Radi GP", "431517", 18.6950, 76.3850),
            ]),
            (4324, 491, 27, "Parli", "परळी वैजनाथ (ज्योतिर्लिंग)", 18.8450, 76.5350, [
                (582080, "Dharmapuri Beed", "धर्मपुरी", "Dharmapuri GP", "431515", 18.925, 76.485),
                (582081, "Tokwadi", "टोकवाडी", "Tokwadi GP", "431515", 18.815, 76.575),
            ]),
            (4322, 491, 27, "Majalgaon", "माजलगाव (धरण व ऊस)", 19.1550, 76.2250, [
                (582040, "Talkhed", "टाळखेड", "Talkhed GP", "431131", 19.1250, 76.1850),
            ]),
            (4321, 491, 27, "Georai", "गेवराई (कापूस पट्टा)", 19.2650, 75.7550, [
                (582020, "Umapur", "उमापूर", "Umapur GP", "431130", 19.3450, 75.6950),
            ]),
            (4325, 491, 27, "Kaij", "केज", 18.7050, 76.0150, [
                (582100, "Yevta", "येवता", "Yevta GP", "431123", 18.6850, 76.0550),
            ]),
            (4327, 491, 27, "Ashti", "आष्टी", 18.8050, 75.1750, [
                (582140, "Kada", "कडा (गुळ व कांदा)", "Kada GP", "414202", 18.8850, 75.1250),
            ]),

            # Nanded (506)
            (4360, 506, 27, "Nanded Rural", "नांदेड", 19.1383, 77.3210, [
                (584001, "Vishnupuri", "विष्णुपरी", "Vishnupuri GP", "431606", 19.115, 77.295),
            ]),

            # Parbhani (510)
            (4381, 510, 27, "Gangakhed", "गंगाखेड", 18.9550, 76.7550, [
                (585020, "Ranisawargaon", "राणीसावरगाव", "Ranisawargaon GP", "431536", 18.895, 76.815),
            ]),

            # Hingoli (498)
            (4401, 498, 27, "Basmath", "वसमत (हळद)", 19.3250, 77.1650, [
                (586020, "Kurunda", "कुरुंदा", "Kurunda GP", "431512", 19.265, 77.215),
            ]),

            # Washim (520)
            (4441, 520, 27, "Karanja Lad", "कारंजा लाड", 20.4850, 77.4850, [
                (588020, "Kamargaon", "कामरगाव", "Kamargaon GP", "444110", 20.565, 77.395),
            ]),

            # Wardha (519)
            (4460, 519, 27, "Wardha Rural", "वर्धा", 20.7450, 78.5950, [
                (589001, "Sewagram", "सेवाग्राम", "Sewagram GP", "442102", 20.725, 78.655),
            ]),

            # Bhandara (492)
            (4481, 492, 27, "Tumsar", "तुमसर (भात मंडी)", 21.3850, 79.7450, [
                (590020, "Sihora", "सिहोरा", "Sihora GP", "441915", 21.465, 79.795),
            ]),

            # Gondia (497)
            (4490, 497, 27, "Gondia Rural", "गोंदिया", 21.4550, 80.1950, [
                (591001, "Kudwa", "कुडवा", "Kudwa GP", "441614", 21.485, 80.225),
            ]),

            # Chandrapur (494)
            (4511, 494, 27, "Warora", "वरोरा (आनंदवन)", 20.2350, 79.0050, [
                (592020, "Anandwan", "आनंदवन", "Anandwan GP", "442914", 20.255, 79.035),
            ]),

            # Gadchiroli (496)
            (4530, 496, 27, "Gadchiroli Rural", "गडचिरोली", 20.1850, 80.0050, [
                (593001, "Porla", "पोरला", "Porla GP", "442605", 20.245, 80.085),
            ]),

            # Dhule (495)
            (4551, 495, 27, "Shirpur", "शिरपूर", 21.3550, 74.8850, [
                (594020, "Holnanthe", "होळनांथे", "Holnanthe GP", "425405", 21.315, 74.815),
            ]),

            # Nandurbar (507)
            (4571, 507, 27, "Shahada", "शहादा", 21.5550, 74.4750, [
                (595020, "Prakasha", "प्रकाशा", "Prakasha GP", "425409", 21.515, 74.375),
            ]),

            # Thane (518)
            (4591, 518, 27, "Murbad", "मुरबाड", 19.2550, 73.4050, [
                (596020, "Saralgaon", "सरळगाव", "Saralgaon GP", "421401", 19.315, 73.475),
            ]),

            # Akola (486)
            (4410, 486, 27, "Akot", "आकोट", 21.0950, 77.0550, [
                (580001, "Panaj", "पणाज", "Panaj GP", "444101", 21.1650, 77.1250),
            ]),

            # Mumbai City (503) & Suburban (504)
            (4680, 503, 27, "Mumbai South", "दक्षिण मुंबई", 18.9388, 72.8354, [
                (601001, "Colaba Agri Market", "कुलाबा", "Colaba Area", "400005", 18.9067, 72.8147),
            ]),
            (4681, 504, 27, "Borivali", "बोरिवली", 19.2307, 72.8567, [
                (601020, "Gorai", "गोराई", "Gorai GP", "400091", 19.2450, 72.7850),
            ]),

            # Madhya Pradesh - Indore (407)
            (4500, 407, 23, "Sanwer", "सांवेर (सोयाबीन मंडी)", 22.9750, 75.8250, [
                (590001, "Dharampuri Indore", "धरमपुरी", "Dharampuri GP", "453551", 22.9550, 75.8550),
                (590002, "Kshipra", "क्षिप्रा", "Kshipra GP", "453771", 22.9150, 75.9850),
            ]),
            (4502, 407, 23, "Mhow", "महू (डॉ. आंबेडकर नगर)", 22.5550, 75.7650, [
                (590040, "Manpur MP", "मानपुर", "Manpur GP", "453661", 22.4250, 75.6450),
            ]),

            # Madhya Pradesh - Mandsaur (415)
            (4540, 415, 23, "Mandsaur Mandi", "मंदसौर मंडी क्षेत्र", 24.0722, 75.0682, [
                (592001, "Daloda", "दलोदा (लहसुन मंडी)", "Daloda GP", "458667", 23.9550, 75.1250),
                (592002, "Piplia Mandi", "पिपलिया मंडी", "Piplia GP", "458664", 24.2150, 75.0150),
            ]),

            # Gujarat - Rajkot (461)
            (4600, 461, 24, "Gondal", "ગોંડલ / गोंडल (APMC)", 21.9619, 70.7933, [
                (593001, "Gomta", "ગોમટા / गोमटा", "Gomta GP", "360311", 21.8950, 70.7850),
                (593002, "Virpur", "વીરપુર / वीरपुर", "Virpur GP", "360380", 21.8450, 70.7650),
            ]),

            # Gujarat - Mehsana (457)
            (4602, 457, 24, "Unjha", "ઊંઝા / ऊंझा (जीरा व मसाला मंडी)", 23.8042, 72.3925, [
                (593040, "Aithor", "ઐઠોર / ऐठोर", "Aithor GP", "384170", 23.8250, 72.4150),
            ]),

            # Karnataka - Belagavi (528)
            (4700, 528, 29, "Nippani", "ನಿಪ್ಪಾಣಿ / निपाणी (मिरची)", 16.3980, 74.3820, [
                (594001, "Yamagarni", "ಯಮಗರ್ಣಿ / यमगर्णी", "Yamagarni GP", "591237", 16.3550, 74.4150),
                (594002, "Soundalga", "ಸೌಂದಲಗಾ / सौंदलगा", "Soundalga GP", "591225", 16.4450, 74.3450),
            ]),
        ]

        subdistricts = []
        villages = []
        seen_v_codes = set()
        next_v_code = 700000

        for sub_code, d_code, s_code, sub_name, sub_local, sub_lat, sub_lon, v_list in subdistricts_data:
            subdistricts.append((sub_code, d_code, s_code, sub_name, sub_local, sub_lat, sub_lon))
            for v_code, v_name, v_local, gp, pin, v_lat, v_lon in v_list:
                actual_v_code = v_code
                if actual_v_code in seen_v_codes:
                    next_v_code += 1
                    actual_v_code = next_v_code
                seen_v_codes.add(actual_v_code)
                villages.append((actual_v_code, sub_code, d_code, s_code, v_name, v_local, gp, sub_name, pin, v_lat, v_lon, 1))

        # Insert subdistricts
        con.executemany("""
            INSERT INTO subdistricts (subdistrict_code, district_code, state_code, subdistrict_name, subdistrict_name_local, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, subdistricts)

        # Insert villages
        con.executemany("""
            INSERT INTO villages (
                village_code, subdistrict_code, district_code, state_code,
                village_name, village_name_local, gram_panchayat, block_name,
                pincode, latitude, longitude, is_verified
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, villages)

        # Populate FTS5 index
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

        print(f"[Master LGD Initialized] Successfully registered {len(OFFICIAL_MAHARASHTRA_DISTRICT_CODES) + len(other_districts)} districts, {len(subdistricts)} talukas, and {len(villages)} villages with full FTS5 search.")

if __name__ == "__main__":
    seed_master()
