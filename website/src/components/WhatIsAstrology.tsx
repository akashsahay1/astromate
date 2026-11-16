import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  { q: "What is Astrology?", a: "Astrology is the study of the movements and relative positions of celestial bodies interpreted as having an influence on human affairs and the natural world. It is an ancient practice that has been followed across civilizations for thousands of years." },
  { q: "How does Vedic Astrology differ from other types of astrology?", a: "Vedic Astrology, also known as Jyotish, is rooted in ancient Indian scriptures. Unlike Western astrology which uses the tropical zodiac, Vedic astrology uses the sidereal zodiac and incorporates unique concepts like Nakshatras, Dashas, and detailed divisional charts for deeper analysis." },
  { q: "How can astrology help me in my life?", a: "Astrology can help you understand your strengths, challenges, and life patterns. It provides guidance on career choices, relationships, health, finances, and spiritual growth by analyzing your unique birth chart." },
  { q: "Will astrology help me know exactly what will happen in my life further down the line?", a: "Astrology reveals tendencies and potential outcomes based on planetary positions. It provides guidance and awareness rather than fixed predictions, empowering you to make informed decisions and shape your destiny." },
  { q: "Can astrology help improve my relationships?", a: "Yes! Through Kundali matching and compatibility analysis, astrology helps you understand relationship dynamics, identify areas of harmony and conflict, and provide remedies to strengthen your bonds." },
  { q: "What role does astrology play in the field of career?", a: "Astrology analyzes your 10th house (career house), planetary strengths, and Dasha periods to suggest the most suitable career paths, favorable times for job changes, business ventures, and professional growth." },
  { q: "What is a birth chart? And what is the importance of a birth chart?", a: "A birth chart (Kundli) is a celestial snapshot of the sky at the exact moment of your birth. It maps the positions of all planets across 12 houses, serving as your cosmic blueprint that reveals personality traits, life events, and karmic patterns." },
  { q: "In what ways can I obtain a reading from Astromate?", a: "You can get readings through our website via online consultations, detailed digital reports, free Kundli generation, and one-on-one sessions with our experienced astrologers." },
  { q: "Is the practice of astrology beneficial in regard to making strategies?", a: "Absolutely! Muhurta (electional astrology) helps choose auspicious timings for important decisions like starting a business, buying property, or beginning new ventures, maximizing your chances of success." },
  { q: "Can I consult an astrologer regarding a health-related issue?", a: "Yes, medical astrology analyzes the 6th house and planetary afflictions to identify potential health vulnerabilities. Our astrologers can suggest preventive measures and remedies to support your well-being." },
  { q: "For accurate readings, is it necessary to have the precise time of birth?", a: "Yes, the exact birth time is crucial for accurate chart calculations. Even a few minutes difference can change the Ascendant (Lagna) and house placements, significantly affecting the reading's accuracy." },
  { q: "Should I consider astrology when facing a transition in my life?", a: "Definitely! During major life transitions, astrology provides clarity on timing, challenges, and opportunities. Understanding your current Dasha and planetary transits helps you navigate changes with confidence." },
  { q: "How often should I consult an astrologer?", a: "It depends on your needs. Annual readings are great for general guidance, while specific consultations are recommended during major life events, career changes, or relationship decisions." },
  { q: "How does Astromate ensure accurate and authentic readings?", a: "Astromate employs experienced Vedic astrologers who follow traditional methodologies combined with precise astronomical calculations. We prioritize authenticity, depth, and personalized analysis in every reading." },
  { q: "Is Astrology - Predictions only or is it something more?", a: "Astrology is far more than predictions. It's a tool for self-discovery, personal growth, and understanding your cosmic purpose. At Astromate, we focus on empowering you with knowledge to shape your own destiny." },
];

const WhatIsAstrology = () => {
  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--hero-deep-red))] mb-6 text-center">
            What is Astrology By Astromate?
          </h2>

          <div className="prose prose-lg max-w-none text-foreground/80 space-y-5 text-[0.95rem] leading-relaxed">
            <p>
              At <strong className="text-[hsl(var(--hero-saffron))]">Astromate</strong>, we believe that astrology is a timeless guide for understanding human potential and decoding life's deepest mysteries. Rooted in ancient Vedic astrology traditions, our approach goes beyond simple astrology predictions. It focuses on understanding how stars, planets, and cosmic forces interact to shape your destiny and personal growth through astrology by date of birth.
            </p>
            <p>
              Every individual is unique, and so is their astrological journey. Through astrology, we uncover how celestial movements influence different aspects of your life. Your birth chart, or <strong>Kundli</strong>, serves as a personalized cosmic blueprint that highlights your strengths, challenges, and life possibilities.
            </p>
            <p>
              As a trusted astrology website, Astromate combines sacred wisdom with modern insights to help you explore <strong>love prediction, career prediction, finance prediction, health prediction</strong>, and authentic spiritual insights. Our experienced team of astrologers specializes in providing detailed predictions based on astrology by date of birth.
            </p>

            <h3 className="text-2xl font-bold text-[hsl(var(--hero-deep-red))] mt-10 mb-4">
              Astrology – Predictions and Beyond!
            </h3>
            <p>
              Astrology is often mistaken for mere fortune-telling, but at Astromate, we go far beyond simple predictions. Our philosophy is that astrology is a tool for personal growth, helping individuals understand their personality, purpose, and potential.
            </p>
            <p>
              Our approach addresses your unique life questions, such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/70">
              <li>When is the right time to begin a romantic relationship or a marriage?</li>
              <li>How can you grow your business or earn a promotion?</li>
              <li>How will my career progress?</li>
              <li>Can astrology provide remedies for your current health concerns?</li>
            </ul>

            <h3 className="text-2xl font-bold text-[hsl(var(--hero-deep-red))] mt-10 mb-4">
              Why Choose Astromate?
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              {[
                { title: "Authenticity & Precision", desc: "We merge ancient Vedic wisdom with modern understanding." },
                { title: "Experienced Astrologers", desc: "Skilled experts with years of experience in detailed readings." },
                { title: "Holistic Guidance", desc: "Readings covering career, health, relationships & personal development." },
                { title: "Personalized Readings", desc: "Each session customized to your Kundli (birth chart)." },
                { title: "Easy Accessibility", desc: "Online consultations and digital reports at your fingertips." },
                { title: "Empowerment Through Knowledge", desc: "We teach you how to live in alignment with the stars." },
              ].map((item) => (
                <div key={item.title} className="border border-[hsl(var(--hero-gold)/0.3)] rounded-xl p-4 bg-[hsl(var(--hero-cream))]">
                  <h4 className="font-bold text-[hsl(var(--hero-dark-brown))] mb-1">{item.title}</h4>
                  <p className="text-sm text-foreground/60">{item.desc}</p>
                </div>
              ))}
            </div>

            <blockquote className="border-l-4 border-[hsl(var(--hero-saffron))] pl-4 italic text-foreground/70 my-8">
              "Astrology is not about predicting the future — it's about using the wisdom of the stars to shape your present and create a brighter tomorrow."
            </blockquote>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--hero-deep-red))] mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
            {faqItems.map((item, i) => (
              <Accordion key={i} type="single" collapsible>
                <AccordionItem value={`faq-${i}`} className="border border-[hsl(var(--hero-saffron)/0.4)] rounded-lg px-4 bg-background">
                  <AccordionTrigger className="text-sm text-left font-medium hover:no-underline">
                    {i + 1}) {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-foreground/70">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsAstrology;
