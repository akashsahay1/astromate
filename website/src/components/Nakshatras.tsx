import { useNavigate } from "react-router-dom";
import { useT } from "@/hooks/useLang";


const nakshatras = [
  { name: "अश्विनी", planet: "केतु", icon: "🐴", description: "अश्विनी नक्षत्र पहला नक्षत्र है। इसके देवता अश्विनी कुमार हैं। यह तेज गति, चिकित्सा शक्ति और नई शुरुआत का प्रतीक है।", quality: "शुभ", deity: "अश्विनी कुमार", element: "अग्नि", nameEn: "Ashwini", planetEn: "Ketu", descriptionEn: "Ashwini is the first nakshatra, ruled over by the Ashwini Kumars. It stands for speed, healing power and new beginnings.", qualityEn: "Auspicious", deityEn: "Ashwini Kumars", elementEn: "Fire" },
  { name: "भरणी", planet: "शुक्र", icon: "🔱", description: "भरणी नक्षत्र का स्वामी शुक्र है। यह सृजन, पोषण और जीवन-मृत्यु के चक्र से जुड़ा है। धैर्य और सहनशीलता इसकी विशेषता है।", quality: "उग्र", deity: "यम", element: "पृथ्वी", nameEn: "Bharani", planetEn: "Venus", descriptionEn: "Bharani is ruled by Venus. It is linked to creation, nourishment and the cycle of life and death, and is marked by patience and endurance.", qualityEn: "Fierce", deityEn: "Yama", elementEn: "Earth" },
  { name: "कृत्तिका", planet: "सूर्य", icon: "🌙", description: "कृत्तिका नक्षत्र अग्नि तत्व से जुड़ा है। यह शुद्धिकरण, ऊर्जा और तेज का प्रतीक है। कार्तिकेय इसके देवता हैं।", quality: "मिश्र", deity: "अग्नि", element: "अग्नि", nameEn: "Krittika", planetEn: "Sun", descriptionEn: "Krittika is linked to the fire element. It stands for purification, energy and brilliance. Kartikeya is its deity.", qualityEn: "Mixed", deityEn: "Agni", elementEn: "Fire" },
  { name: "रोहिणी", planet: "चंद्र", icon: "🐂", description: "रोहिणी सबसे सुंदर नक्षत्र माना जाता है। यह सौंदर्य, कला और समृद्धि का प्रतीक है। ब्रह्मा इसके देवता हैं।", quality: "शुभ", deity: "ब्रह्मा", element: "पृथ्वी", nameEn: "Rohini", planetEn: "Moon", descriptionEn: "Rohini is considered the most beautiful nakshatra. It stands for beauty, art and prosperity. Brahma is its deity.", qualityEn: "Auspicious", deityEn: "Brahma", elementEn: "Earth" },
  { name: "मृगशिरा", planet: "मंगल", icon: "🦌", description: "मृगशिरा नक्षत्र खोज और जिज्ञासा का प्रतीक है। यह कोमलता और सौम्यता से भरपूर है। सोम इसके देवता हैं।", quality: "मृदु", deity: "सोम", element: "पृथ्वी", nameEn: "Mrigashira", planetEn: "Mars", descriptionEn: "Mrigashira stands for search and curiosity, full of gentleness and grace. Soma is its deity.", qualityEn: "Gentle", deityEn: "Soma", elementEn: "Earth" },
  { name: "आर्द्रा", planet: "राहु", icon: "💧", description: "आर्द्रा नक्षत्र तूफान और परिवर्तन का प्रतीक है। यह विनाश के बाद पुनर्निर्माण का संदेश देता है। रुद्र इसके देवता हैं।", quality: "तीक्ष्ण", deity: "रुद्र", element: "जल", nameEn: "Ardra", planetEn: "Rahu", descriptionEn: "Ardra stands for storms and transformation — the message of rebuilding after destruction. Rudra is its deity.", qualityEn: "Sharp", deityEn: "Rudra", elementEn: "Water" },
  { name: "पुनर्वसु", planet: "बृहस्पति", icon: "🏹", description: "पुनर्वसु नक्षत्र पुनर्जन्म और नवीनता का प्रतीक है। यह समृद्धि और सुरक्षा प्रदान करता है। अदिति इसकी देवी हैं।", quality: "चर", deity: "अदिति", element: "आकाश", nameEn: "Punarvasu", planetEn: "Jupiter", descriptionEn: "Punarvasu stands for renewal and rebirth. It brings prosperity and protection. Aditi is its goddess.", qualityEn: "Movable", deityEn: "Aditi", elementEn: "Ether" },
  { name: "पुष्य", planet: "शनि", icon: "🌸", description: "पुष्य सबसे शुभ नक्षत्र माना जाता है। यह पोषण, देखभाल और आध्यात्मिक विकास का प्रतीक है। बृहस्पति इसके देवता हैं।", quality: "शुभ", deity: "बृहस्पति", element: "जल", nameEn: "Pushya", planetEn: "Saturn", descriptionEn: "Pushya is considered the most auspicious nakshatra. It stands for nourishment, care and spiritual growth. Brihaspati is its deity.", qualityEn: "Auspicious", deityEn: "Brihaspati", elementEn: "Water" },
  { name: "आश्लेषा", planet: "बुध", icon: "🐍", description: "आश्लेषा नक्षत्र नाग देवता से जुड़ा है। यह गहराई, रहस्य और कुंडलिनी शक्ति का प्रतीक है।", quality: "तीक्ष्ण", deity: "नाग", element: "जल", nameEn: "Ashlesha", planetEn: "Mercury", descriptionEn: "Ashlesha is linked to the serpent deity. It stands for depth, mystery and Kundalini energy.", qualityEn: "Sharp", deityEn: "Naga", elementEn: "Water" },
  { name: "मघा", planet: "केतु", icon: "👑", description: "मघा नक्षत्र पूर्वजों और राजसी गौरव का प्रतीक है। यह सम्मान, प्रतिष्ठा और वंश परंपरा से जुड़ा है।", quality: "उग्र", deity: "पितृ", element: "जल", nameEn: "Magha", planetEn: "Ketu", descriptionEn: "Magha stands for ancestors and royal pride. It is linked to honour, prestige and lineage.", qualityEn: "Fierce", deityEn: "Pitris", elementEn: "Water" },
  { name: "पूर्वा फाल्गुनी", planet: "शुक्र", icon: "🛏️", description: "पूर्वा फाल्गुनी आनंद, विश्राम और रचनात्मकता का नक्षत्र है। यह प्रेम और सौंदर्य का प्रतीक है।", quality: "उग्र", deity: "भग", element: "जल", nameEn: "Purva Phalguni", planetEn: "Venus", descriptionEn: "Purva Phalguni is the nakshatra of pleasure, rest and creativity. It stands for love and beauty.", qualityEn: "Fierce", deityEn: "Bhaga", elementEn: "Water" },
  { name: "उत्तरा फाल्गुनी", planet: "सूर्य", icon: "🛋️", description: "उत्तरा फाल्गुनी मित्रता, सहायता और उदारता का नक्षत्र है। आर्यमा इसके देवता हैं।", quality: "स्थिर", deity: "आर्यमा", element: "अग्नि", nameEn: "Uttara Phalguni", planetEn: "Sun", descriptionEn: "Uttara Phalguni is the nakshatra of friendship, support and generosity. Aryaman is its deity.", qualityEn: "Fixed", deityEn: "Aryaman", elementEn: "Fire" },
  { name: "हस्त", planet: "चंद्र", icon: "✋", description: "हस्त नक्षत्र कुशलता, शिल्प और निपुणता का प्रतीक है। यह हाथों के कार्य में माहिर बनाता है।", quality: "क्षिप्र", deity: "सवितृ", element: "अग्नि", nameEn: "Hasta", planetEn: "Moon", descriptionEn: "Hasta stands for skill, craft and dexterity, making its natives masters of work done with the hands.", qualityEn: "Swift", deityEn: "Savitr", elementEn: "Fire" },
  { name: "चित्रा", planet: "मंगल", icon: "💎", description: "चित्रा नक्षत्र सुंदरता, चमक और कलात्मकता का प्रतीक है। विश्वकर्मा इसके देवता हैं।", quality: "मृदु", deity: "विश्वकर्मा", element: "अग्नि", nameEn: "Chitra", planetEn: "Mars", descriptionEn: "Chitra stands for beauty, brilliance and artistry. Vishwakarma is its deity.", qualityEn: "Gentle", deityEn: "Vishwakarma", elementEn: "Fire" },
  { name: "स्वाति", planet: "राहु", icon: "🌿", description: "स्वाति नक्षत्र स्वतंत्रता, लचीलापन और अनुकूलन का प्रतीक है। वायु इसके देवता हैं।", quality: "चर", deity: "वायु", element: "अग्नि", nameEn: "Swati", planetEn: "Rahu", descriptionEn: "Swati stands for independence, flexibility and adaptability. Vayu is its deity.", qualityEn: "Movable", deityEn: "Vayu", elementEn: "Fire" },
  { name: "विशाखा", planet: "बृहस्पति", icon: "🚪", description: "विशाखा नक्षत्र लक्ष्य-प्राप्ति और दृढ़ संकल्प का प्रतीक है। इंद्र-अग्नि इसके देवता हैं।", quality: "मिश्र", deity: "इंद्र-अग्नि", element: "अग्नि", nameEn: "Vishakha", planetEn: "Jupiter", descriptionEn: "Vishakha stands for achieving goals and firm determination. Indra-Agni are its deities.", qualityEn: "Mixed", deityEn: "Indra-Agni", elementEn: "Fire" },
  { name: "अनुराधा", planet: "शनि", icon: "🪷", description: "अनुराधा नक्षत्र मित्रता, भक्ति और सफलता का प्रतीक है। मित्र इसके देवता हैं।", quality: "मृदु", deity: "मित्र", element: "अग्नि", nameEn: "Anuradha", planetEn: "Saturn", descriptionEn: "Anuradha stands for friendship, devotion and success. Mitra is its deity.", qualityEn: "Gentle", deityEn: "Mitra", elementEn: "Fire" },
  { name: "ज्येष्ठा", planet: "बुध", icon: "🌂", description: "ज्येष्ठा नक्षत्र वरिष्ठता, नेतृत्व और सुरक्षा का प्रतीक है। इंद्र इसके देवता हैं।", quality: "तीक्ष्ण", deity: "इंद्र", element: "वायु", nameEn: "Jyeshtha", planetEn: "Mercury", descriptionEn: "Jyeshtha stands for seniority, leadership and protection. Indra is its deity.", qualityEn: "Sharp", deityEn: "Indra", elementEn: "Air" },
  { name: "मूल", planet: "केतु", icon: "⚔️", description: "मूल नक्षत्र जड़ों, मूल स्वभाव और गहन खोज का प्रतीक है। निऋति इसके देवता हैं।", quality: "तीक्ष्ण", deity: "निऋति", element: "वायु", nameEn: "Mula", planetEn: "Ketu", descriptionEn: "Mula stands for roots, true nature and deep inquiry. Nirriti is its deity.", qualityEn: "Sharp", deityEn: "Nirriti", elementEn: "Air" },
  { name: "पूर्वाषाढ़ा", planet: "शुक्र", icon: "🪭", description: "पूर्वाषाढ़ा विजय और अजेयता का नक्षत्र है। अपास इसके देवता हैं।", quality: "उग्र", deity: "अपास", element: "वायु", nameEn: "Purva Ashadha", planetEn: "Venus", descriptionEn: "Purva Ashadha is the nakshatra of victory and invincibility. Apas is its deity.", qualityEn: "Fierce", deityEn: "Apas", elementEn: "Air" },
  { name: "उत्तराषाढ़ा", planet: "सूर्य", icon: "⭐", description: "उत्तराषाढ़ा अंतिम विजय और स्थायी सफलता का नक्षत्र है। विश्वेदेव इसके देवता हैं।", quality: "स्थिर", deity: "विश्वेदेव", element: "वायु", nameEn: "Uttara Ashadha", planetEn: "Sun", descriptionEn: "Uttara Ashadha is the nakshatra of final victory and lasting success. The Vishvedevas are its deities.", qualityEn: "Fixed", deityEn: "Vishvedevas", elementEn: "Air" },
  { name: "श्रवण", planet: "चंद्र", icon: "👂", description: "श्रवण नक्षत्र सुनने, सीखने और ज्ञान प्राप्ति का प्रतीक है। विष्णु इसके देवता हैं।", quality: "चर", deity: "विष्णु", element: "वायु", nameEn: "Shravana", planetEn: "Moon", descriptionEn: "Shravana stands for listening, learning and gaining knowledge. Vishnu is its deity.", qualityEn: "Movable", deityEn: "Vishnu", elementEn: "Air" },
  { name: "धनिष्ठा", planet: "मंगल", icon: "🥁", description: "धनिष्ठा नक्षत्र संगीत, धन और समृद्धि का प्रतीक है। अष्ट वसु इसके देवता हैं।", quality: "चर", deity: "अष्ट वसु", element: "आकाश", nameEn: "Dhanishtha", planetEn: "Mars", descriptionEn: "Dhanishtha stands for music, wealth and prosperity. The eight Vasus are its deities.", qualityEn: "Movable", deityEn: "Ashta Vasu", elementEn: "Ether" },
  { name: "शतभिषा", planet: "राहु", icon: "⭕", description: "शतभिषा नक्षत्र चिकित्सा और रहस्यमय शक्तियों का प्रतीक है। वरुण इसके देवता हैं।", quality: "चर", deity: "वरुण", element: "आकाश", nameEn: "Shatabhisha", planetEn: "Rahu", descriptionEn: "Shatabhisha stands for healing and mystical powers. Varuna is its deity.", qualityEn: "Movable", deityEn: "Varuna", elementEn: "Ether" },
  { name: "पूर्वा भाद्रपद", planet: "बृहस्पति", icon: "🔥", description: "पूर्वा भाद्रपद अग्नि और तपस्या का नक्षत्र है। अज एकपाद इसके देवता हैं।", quality: "उग्र", deity: "अज एकपाद", element: "आकाश", nameEn: "Purva Bhadrapada", planetEn: "Jupiter", descriptionEn: "Purva Bhadrapada is the nakshatra of fire and austerity. Aja Ekapada is its deity.", qualityEn: "Fierce", deityEn: "Aja Ekapada", elementEn: "Ether" },
  { name: "उत्तरा भाद्रपद", planet: "शनि", icon: "🐍", description: "उत्तरा भाद्रपद गहराई, ध्यान और आध्यात्मिकता का नक्षत्र है। अहिर्बुध्न्य इसके देवता हैं।", quality: "स्थिर", deity: "अहिर्बुध्न्य", element: "आकाश", nameEn: "Uttara Bhadrapada", planetEn: "Saturn", descriptionEn: "Uttara Bhadrapada is the nakshatra of depth, meditation and spirituality. Ahirbudhnya is its deity.", qualityEn: "Fixed", deityEn: "Ahirbudhnya", elementEn: "Ether" },
  { name: "रेवती", planet: "बुध", icon: "🐟", description: "रेवती अंतिम नक्षत्र है जो समृद्धि, यात्रा और मोक्ष का प्रतीक है। पूषा इसके देवता हैं।", quality: "मृदु", deity: "पूषा", element: "आकाश", nameEn: "Revati", planetEn: "Mercury", descriptionEn: "Revati is the last nakshatra, standing for prosperity, travel and moksha. Pushan is its deity.", qualityEn: "Gentle", deityEn: "Pushan", elementEn: "Ether" },
];

const NakshatraCard = ({ nakshatra }: { nakshatra: typeof nakshatras[0] }) => {
  const navigate = useNavigate();
  const t = useT();

  return (
    <div
      onClick={() => navigate("/nakshatra")}
      className="bg-[#FFFDF5] rounded-[14px] overflow-hidden border border-[hsl(40,50%,85%)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Image Header with Gradient */}
      <div className="relative h-[120px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
        <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded font-semibold z-10">
          Astromate
        </span>
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 200">
          <circle cx="200" cy="100" r="80" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
          <circle cx="200" cy="100" r="60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
          <circle cx="200" cy="100" r="40" fill="white" opacity="0.05" />
        </svg>
        <span className="text-5xl relative z-10 drop-shadow-lg">{nakshatra.icon}</span>
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
          <p className="text-white text-[0.82rem] font-bold leading-tight">{t(nakshatra.nameEn, nakshatra.name)}</p>
          <span className="text-white/80 text-[0.62rem] block mt-0.5">{t(nakshatra.planetEn, nakshatra.planet)} • {t(nakshatra.elementEn, nakshatra.element)}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col">
        <p className="text-[0.77rem] text-muted-foreground leading-relaxed line-clamp-2 flex-1">{t(nakshatra.descriptionEn, nakshatra.description)}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[0.7rem] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 font-medium">{t(nakshatra.qualityEn, nakshatra.quality)}</span>
          <span className="text-[0.7rem] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 font-medium">{t(nakshatra.deityEn, nakshatra.deity)}</span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-t border-[hsl(40,50%,90%)]">
        <button
          onClick={(e) => { e.stopPropagation(); navigate("/nakshatra"); }}
          className="flex-1 bg-[#171452] text-white py-2 rounded-lg text-[0.86rem] font-semibold hover:bg-[#1e1a6e] transition-colors"
        >
          {t("View Details", "विवरण देखें")}
        </button>
      </div>
    </div>
  );
};


const Nakshatras = () => {
  const t = useT();
  return (
    <section id="nakshatras" className="py-8 lg:py-12 bg-[#FDF6E3]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <h2 className="text-3xl lg:text-4xl font-bold text-[#171452] mb-1.5">
          {t("27 Nakshatras", "27 नक्षत्र")}
        </h2>
        <p className="text-[0.95rem] text-muted-foreground mb-8">
          {t("Discover the 27 sacred nakshatras of Vedic astrology", "वैदिक ज्योतिष के 27 पवित्र नक्षत्रों के बारे में जानें")}
        </p>

        {/* Nakshatras Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {nakshatras.map((nakshatra, index) => (
            <NakshatraCard key={index} nakshatra={nakshatra} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Nakshatras;
