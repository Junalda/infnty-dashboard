export const LOCALES = ['en', 'nl'] as const
export type Locale = typeof LOCALES[number]

export const t = {
  en: {
    meta: {
      siteName: 'INFNTY Studio',
      siteUrl: 'https://infntystudio.com',
      defaultTitle: 'INFNTY Studio — Rehearsal Space Rotterdam',
      defaultDescription: 'Rotterdam\'s premier rehearsal studio. Flexible memberships, 24/7 access, fully equipped rehearsal rooms for bands, musicians and singers.',
    },
    nav: {
      home: 'Home',
      about: 'About',
      studio: 'Studio',
      memberships: 'Memberships',
      booking: 'Booking',
      community: 'Community',
      faq: 'FAQ',
      contact: 'Contact',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      menu: 'Menu',
    },
    home: {
      hero: {
        badge: "Rotterdam's #1 Rehearsal Studio",
        title: 'Your music\ndeserves a\nprofessional space.',
        subtitle: 'Flexible rehearsal memberships with 24/7 access. For bands, musicians, singers, and producers in Rotterdam.',
        cta1: 'View Memberships',
        cta2: 'Book a Tour',
        stats: [
          { value: '24/7', label: 'Access' },
          { value: '3', label: 'Membership Plans' },
          { value: '100%', label: 'Equipped Rooms' },
        ],
      },
      why: {
        badge: 'Why INFNTY Studio',
        title: 'Built for serious musicians.',
        subtitle: 'We created the rehearsal studio we always wanted — professional, accessible, and flexible.',
        items: [
          {
            icon: 'clock',
            title: '24/7 Access',
            desc: 'Your schedule, your rules. Access the studio at any time, day or night, with our smart lock system.',
          },
          {
            icon: 'shield',
            title: 'Fully Equipped',
            desc: 'Professional backline, PA system, drum kit, amps, and monitors ready to use. Just plug in and play.',
          },
          {
            icon: 'zap',
            title: 'Flexible Memberships',
            desc: 'Monthly memberships with included hours. No long-term contracts. Scale up or down as you need.',
          },
          {
            icon: 'users',
            title: 'Music Community',
            desc: 'Connect with fellow musicians, attend jam sessions, and be part of Rotterdam\'s creative music scene.',
          },
        ],
      },
      memberships: {
        badge: 'Memberships',
        title: 'Simple, transparent pricing.',
        subtitle: 'Three plans designed to fit every rehearsal schedule. No hidden fees.',
        cta: 'View All Plans',
      },
      benefits: {
        badge: 'Benefits',
        title: 'Everything you need to rehearse.',
        items: [
          'Professional drum kit (Roland & acoustic)',
          'Guitar & bass amplifiers',
          'Full PA system with subwoofer',
          'Stage monitors',
          'DI boxes & microphone stands',
          'Smart lock 24/7 access',
          'Climate controlled room',
          'Secure, private sessions',
          'Easy online booking',
          'Supportive music community',
        ],
      },
      testimonials: {
        badge: 'Members',
        title: 'What our members say.',
        items: [
          {
            quote: 'Finally a studio in Rotterdam that takes musicians seriously. The 24/7 access changed our rehearsal routine completely.',
            author: 'Thomas V.',
            role: 'Band guitarist',
          },
          {
            quote: 'As a solo musician, the Starter plan is perfect. Professional space, great vibe, and the community aspect is a bonus.',
            author: 'Amira K.',
            role: 'Singer-songwriter',
          },
          {
            quote: 'We upgraded to the Unlimited plan after two months. The equipment is top-notch and the staff is incredibly helpful.',
            author: 'DJ Renaud',
            role: 'Producer & live performer',
          },
        ],
      },
      faq: {
        title: 'Frequently asked questions.',
        items: [
          {
            q: 'Can I visit the studio before signing up?',
            a: 'Absolutely. Book a free tour through our contact page and we\'ll show you around.',
          },
          {
            q: 'What\'s included in the rehearsal room?',
            a: 'All rooms are fully equipped with drum kit, amplifiers, PA system, monitors, and microphone stands.',
          },
          {
            q: 'Is there a minimum commitment?',
            a: 'Our memberships are month-to-month with no long-term contracts required.',
          },
          {
            q: 'How does the 24/7 access work?',
            a: 'After signing up you receive a digital key on your smartphone. Unlock the studio anytime via the app.',
          },
        ],
      },
      cta: {
        title: 'Ready to start rehearsing?',
        subtitle: 'Join Rotterdam\'s premier rehearsal community. Get 24/7 access, professional equipment, and a space that inspires.',
        button: 'Start Your Membership',
        secondary: 'Book a Free Tour',
      },
    },
    about: {
      hero: {
        badge: 'Our Story',
        title: 'Built by musicians,\nfor musicians.',
        subtitle: 'INFNTY Studio was born from a simple frustration: finding a professional rehearsal space in Rotterdam was too hard.',
      },
      story: {
        title: 'How it started.',
        body: 'We spent years searching for a rehearsal space that checked all the boxes — professional equipment, fair pricing, flexible access. When we couldn\'t find one, we built it ourselves.\n\nINFNTY Studio opened in Rotterdam with one mission: give musicians a space they can be proud of. No overpriced hourly rates, no outdated equipment, no restrictive booking hours.',
      },
      mission: {
        badge: 'Mission',
        title: 'Empowering Rotterdam\'s music scene.',
        body: 'We believe every musician deserves access to a professional space to develop their craft. INFNTY Studio is designed to remove the barriers between you and your music.',
        values: [
          { title: 'Accessibility', desc: 'Open 24/7 so your schedule is never a barrier.' },
          { title: 'Quality', desc: 'Professional-grade equipment maintained to the highest standard.' },
          { title: 'Community', desc: 'A space where musicians connect, collaborate, and grow.' },
          { title: 'Flexibility', desc: 'Month-to-month memberships that fit your life.' },
        ],
      },
      community: {
        badge: 'Community',
        title: 'Part of something bigger.',
        body: 'INFNTY Studio is more than a rehearsal space. It\'s a creative hub where Rotterdam\'s musicians come together. Jam sessions, workshops, and member events are part of who we are.',
      },
      cta: {
        title: 'Come meet us.',
        subtitle: 'Book a free tour and see the studio for yourself.',
        button: 'Book a Tour',
      },
    },
    memberships: {
      hero: {
        badge: 'Memberships',
        title: 'Choose your\nrehearsal plan.',
        subtitle: 'Flexible monthly plans with no long-term commitment. All plans include 24/7 access and full equipment.',
      },
      plans: [
        {
          name: 'Starter',
          price: 200,
          hours: 8,
          popular: false,
          description: 'Perfect for solo musicians and small ensembles rehearsing a few times per month.',
          features: [
            '8 hours per month',
            '24/7 access with smart lock',
            'Full backline & PA system',
            'Online booking platform',
            'Community access',
            'Extra hours at €25/hr',
          ],
        },
        {
          name: 'Pro',
          price: 300,
          hours: 12,
          popular: true,
          description: 'Our most popular plan for active bands and musicians with a regular rehearsal schedule.',
          features: [
            '12 hours per month',
            '24/7 access with smart lock',
            'Full backline & PA system',
            'Online booking platform',
            'Priority booking slots',
            'Community access & events',
            'Extra hours at €25/hr',
          ],
        },
        {
          name: 'Unlimited',
          price: 400,
          hours: 16,
          popular: false,
          description: 'For professional bands, teachers, and heavy users who live and breathe rehearsal.',
          features: [
            '16 hours per month',
            '24/7 access with smart lock',
            'Full backline & PA system',
            'Online booking platform',
            'Priority booking slots',
            'VIP community events',
            'Guest passes (2/month)',
            'Dedicated support',
            'Extra hours at €25/hr',
          ],
        },
      ],
      extraHours: {
        title: 'Need more hours?',
        body: 'All members can book extra hours at €25 per hour on top of their included monthly hours. Non-members can book at €35 per hour.',
      },
      comparison: {
        title: 'Plan comparison.',
        features: [
          { label: 'Monthly hours', starter: '8h', pro: '12h', unlimited: '16h' },
          { label: '24/7 access', starter: true, pro: true, unlimited: true },
          { label: 'Full equipment', starter: true, pro: true, unlimited: true },
          { label: 'Online booking', starter: true, pro: true, unlimited: true },
          { label: 'Priority slots', starter: false, pro: true, unlimited: true },
          { label: 'Community events', starter: '—', pro: 'Included', unlimited: 'VIP' },
          { label: 'Guest passes', starter: false, pro: false, unlimited: '2/month' },
          { label: 'Extra hours rate', starter: '€25/hr', pro: '€25/hr', unlimited: '€25/hr' },
        ],
      },
      faq: {
        title: 'Membership questions.',
        items: [
          { q: 'Can I cancel anytime?', a: 'Yes. Memberships are month-to-month. Cancel before your next billing date with no penalty.' },
          { q: 'Can I upgrade or downgrade?', a: 'Yes. You can change your plan at any time. Changes take effect from the next billing cycle.' },
          { q: 'Do hours roll over?', a: 'Hours are valid within the calendar month and do not roll over to the following month.' },
          { q: 'Can I share my membership?', a: 'Memberships are personal and non-transferable. Each band member needs their own plan or pays extra hours.' },
        ],
      },
      cta: {
        title: 'Ready to join?',
        subtitle: 'Start your membership today and get immediate access to the studio.',
        button: 'Get Started',
        secondary: 'Book a Free Tour',
      },
    },
    studio: {
      hero: {
        badge: 'The Studio',
        title: 'A space built for\nprofessional sound.',
        subtitle: 'One fully equipped rehearsal room designed for bands, musicians, and performers.',
      },
      room: {
        badge: 'Rehearsal Room',
        title: 'Professional equipment. Always ready.',
        body: 'Our rehearsal room is stocked with professional-grade equipment maintained and tuned regularly. Walk in, plug in, and play.',
        equipment: [
          { category: 'Drums', items: ['Full acoustic drum kit', 'Roland electronic kit', 'Complete cymbal setup', 'Drum throne & pedals'] },
          { category: 'Amplification', items: ['Guitar amp (Fender/Marshall)', 'Bass amp (Ampeg)', 'Full PA system with subwoofer', '4× stage monitors'] },
          { category: 'Accessories', items: ['DI boxes', 'Microphone stands (×8)', 'Instrument cables', 'Power strips & extensions'] },
        ],
      },
      access: {
        badge: '24/7 Access',
        title: 'Your studio, your hours.',
        body: 'With our smart lock system, access the studio at any time — early morning, late night, weekends, holidays. Your membership gives you full access whenever you need it.',
        features: [
          { title: 'Smart Lock', desc: 'Smartphone-based digital key. No physical keys to lose.' },
          { title: 'Instant Access', desc: 'Receive your digital key immediately after membership activation.' },
          { title: 'Booking App', desc: 'Book your sessions online via our member portal.' },
          { title: 'Real-time Availability', desc: 'See when the room is available and book instantly.' },
        ],
      },
      location: {
        badge: 'Location',
        title: 'In the heart of Rotterdam.',
        address: 'Rotterdam, Netherlands',
        details: [
          'Close to public transport',
          'Parking available nearby',
          'Accessible by bike, tram and metro',
          'Central location, easy to reach',
        ],
        cta: 'Get Directions',
      },
      cta: {
        title: 'Want to see it in person?',
        subtitle: 'Book a free tour and experience the studio yourself.',
        button: 'Book a Free Tour',
      },
    },
    booking: {
      hero: {
        badge: 'Booking',
        title: 'Book your\nrehearsal session.',
        subtitle: 'Members book directly through the portal. First time? Start with a free tour.',
      },
      types: [
        {
          title: 'Member Booking',
          desc: 'Use your included monthly hours to book sessions. Sign in to your member portal and reserve your slot in seconds.',
          cta: 'Sign In to Book',
          href: '/login',
          accent: 'rose',
        },
        {
          title: 'Casual / Drop-in',
          desc: 'Not a member yet? Book a one-off session at €35 per hour. No commitment required.',
          cta: 'Contact Us to Book',
          href: '/contact',
          accent: 'amber',
        },
        {
          title: 'Free Tour',
          desc: 'Come see the studio before committing. A free 30-minute tour where we show you everything.',
          cta: 'Book a Tour',
          href: '/contact',
          accent: 'zinc',
        },
      ],
      pricing: {
        title: 'Pricing overview.',
        rows: [
          { label: 'Starter membership', value: '€200/month', note: '8h included' },
          { label: 'Pro membership', value: '€300/month', note: '12h included' },
          { label: 'Unlimited membership', value: '€400/month', note: '16h included' },
          { label: 'Extra hours (member)', value: '€25/hr', note: 'On top of included hours' },
          { label: 'Casual / drop-in', value: '€35/hr', note: 'No membership required' },
        ],
      },
      cta: {
        title: 'Become a member for better rates.',
        subtitle: 'Members save significantly on hourly rates. The Starter plan pays for itself after just 6 hours.',
        button: 'View Memberships',
      },
    },
    community: {
      hero: {
        badge: 'Community',
        title: 'More than a rehearsal space.',
        subtitle: 'INFNTY Studio is a community of musicians, bands, and creators who support each other.',
      },
      events: {
        badge: 'Events',
        title: 'Regular events for members.',
        items: [
          { title: 'Monthly Jam Sessions', desc: 'Open jam nights for all members. Play with musicians from different genres and backgrounds.' },
          { title: 'Workshops & Clinics', desc: 'Skills workshops led by professional musicians. Recording, mixing, performance, and more.' },
          { title: 'Member Showcases', desc: 'Intimate performances where members share their work with the community.' },
          { title: 'Networking Evenings', desc: 'Connect with other musicians, producers, and music industry professionals in Rotterdam.' },
        ],
      },
      collab: {
        badge: 'Collaboration',
        title: 'Find your next bandmate.',
        body: 'Our community board and member network help you connect with musicians looking to collaborate, form bands, or find session players.',
      },
      cta: {
        title: 'Join the community.',
        subtitle: 'Become a member and be part of Rotterdam\'s most supportive music community.',
        button: 'View Memberships',
      },
    },
    faq: {
      hero: {
        badge: 'FAQ',
        title: 'Frequently asked\nquestions.',
        subtitle: 'Everything you need to know about INFNTY Studio.',
      },
      categories: [
        {
          title: 'Memberships',
          items: [
            { q: 'What memberships are available?', a: 'We offer three plans: Starter (€200/month, 8h), Pro (€300/month, 12h), and Unlimited (€400/month, 16h). All include 24/7 access and full equipment.' },
            { q: 'Is there a minimum contract period?', a: 'No. All memberships are month-to-month. You can cancel, upgrade, or downgrade at any time before your next billing date.' },
            { q: 'Can I share a membership with my band?', a: 'Memberships are personal. Each member who wants individual access needs their own plan. Bands can share sessions from one membership.' },
            { q: 'Do unused hours roll over?', a: 'Monthly hours are valid within the calendar month. They do not carry over to the next month.' },
            { q: 'Can I upgrade my plan?', a: 'Yes. You can upgrade or downgrade at any time. Changes take effect from the next billing cycle.' },
          ],
        },
        {
          title: 'Booking',
          items: [
            { q: 'How do I book a session?', a: 'Members book through our online portal at infntystudio.com/login. You can see real-time availability and book in seconds.' },
            { q: 'How far in advance can I book?', a: 'Members can book up to 30 days in advance. Priority plan members get early access to peak slots.' },
            { q: 'Can I book extra hours beyond my plan?', a: 'Yes. Extra hours are available at €25/hr for members and €35/hr for non-members.' },
            { q: 'What is the cancellation policy?', a: 'Cancel up to 24 hours before your session with no charge. Late cancellations may incur a fee.' },
          ],
        },
        {
          title: 'Access',
          items: [
            { q: 'How does 24/7 access work?', a: 'After signing up, you receive a digital key on your smartphone via our access app. You can unlock the studio at any time from the app.' },
            { q: 'What if I forget my phone?', a: 'Contact us via WhatsApp and we can provide temporary access. We recommend always bringing your phone as backup.' },
            { q: 'Is the studio safe?', a: 'Yes. The studio is secured with camera systems, smart locks, and is located in a safe area of Rotterdam.' },
            { q: 'Can I bring guests?', a: 'Unlimited plan members receive 2 guest passes per month. Other members can bring guests who are booked for the same session.' },
          ],
        },
        {
          title: 'Payments',
          items: [
            { q: 'How is billing handled?', a: 'Memberships are billed monthly via automatic payment. We accept credit card, iDEAL, and other major payment methods.' },
            { q: 'What happens if a payment fails?', a: 'We\'ll notify you immediately. Access remains active for 3 days to allow you to update your payment method.' },
            { q: 'Do you offer refunds?', a: 'We offer pro-rata refunds if you cancel mid-month in your first 30 days. After that, the current month\'s fee is non-refundable.' },
          ],
        },
        {
          title: 'Studio Rules',
          items: [
            { q: 'What are the noise rules?', a: 'The studio is soundproofed. You can play at full volume at any time. Hallways and common areas should be kept quiet, especially late at night.' },
            { q: 'Can I record in the studio?', a: 'Yes. You can record your rehearsals using your own equipment. We don\'t offer a dedicated recording service.' },
            { q: 'Are food and drinks allowed?', a: 'Non-alcoholic drinks in closed containers are welcome. Please no food near equipment. Keep the space clean for the next member.' },
            { q: 'What if equipment is damaged?', a: 'Please report any damage immediately. Damage caused through negligence may be charged to the member\'s account.' },
          ],
        },
      ],
    },
    contact: {
      hero: {
        badge: 'Contact',
        title: 'Get in touch.',
        subtitle: 'Questions about memberships, bookings, or want to book a free tour? We\'re here to help.',
      },
      form: {
        title: 'Send us a message.',
        name: 'Your name',
        email: 'Your email',
        subject: 'Subject',
        message: 'Your message',
        submit: 'Send Message',
        success: 'Message sent! We\'ll get back to you within 24 hours.',
        subjects: ['General question', 'Membership inquiry', 'Book a tour', 'Booking help', 'Other'],
      },
      methods: [
        { type: 'whatsapp', label: 'WhatsApp', value: 'Message us on WhatsApp', desc: 'Fastest response — usually within 1 hour during business hours.' },
        { type: 'email', label: 'Email', value: 'info@infntystudio.com', desc: 'We respond within 24 hours on business days.' },
        { type: 'location', label: 'Location', value: 'Rotterdam, Netherlands', desc: 'Visit us for a free tour. Book your slot via this form.' },
      ],
    },
    footer: {
      tagline: "Rotterdam's premier rehearsal studio. Open 24/7.",
      links: {
        studio: {
          title: 'Studio',
          items: [
            { label: 'About', href: '/en/about' },
            { label: 'Studio', href: '/en/studio' },
            { label: 'Community', href: '/en/community' },
            { label: 'Contact', href: '/en/contact' },
          ],
        },
        memberships: {
          title: 'Memberships',
          items: [
            { label: 'All Plans', href: '/en/memberships' },
            { label: 'Booking', href: '/en/booking' },
            { label: 'FAQ', href: '/en/faq' },
            { label: 'Sign In', href: '/login' },
          ],
        },
      },
      legal: '© 2025 INFNTY Studio Rotterdam. All rights reserved.',
    },
  },

  // ─── DUTCH ────────────────────────────────────────────────────────────────
  nl: {
    meta: {
      siteName: 'INFNTY Studio',
      siteUrl: 'https://infntystudio.com',
      defaultTitle: 'INFNTY Studio — Oefenruimte Rotterdam',
      defaultDescription: 'De beste repetitieruimte van Rotterdam. Flexibele lidmaatschappen, 24/7 toegang, volledig uitgeruste oefenruimtes voor bands, muzikanten en zangers.',
    },
    nav: {
      home: 'Home',
      about: 'Over ons',
      studio: 'Studio',
      memberships: 'Lidmaatschappen',
      booking: 'Boeken',
      community: 'Community',
      faq: 'Veelgestelde vragen',
      contact: 'Contact',
      signIn: 'Inloggen',
      getStarted: 'Begin nu',
      menu: 'Menu',
    },
    home: {
      hero: {
        badge: "Rotterdam's #1 Oefenruimte",
        title: 'Jouw muziek\nverdient een\nprofessionele ruimte.',
        subtitle: 'Flexibele repetitielidmaatschappen met 24/7 toegang. Voor bands, muzikanten, zangers en producers in Rotterdam.',
        cta1: 'Bekijk lidmaatschappen',
        cta2: 'Plan een rondleiding',
        stats: [
          { value: '24/7', label: 'Toegang' },
          { value: '3', label: 'Abonnementen' },
          { value: '100%', label: 'Uitgerust' },
        ],
      },
      why: {
        badge: 'Waarom INFNTY Studio',
        title: 'Gebouwd voor serieuze muzikanten.',
        subtitle: 'Wij creëerden de oefenruimte die wij altijd wilden — professioneel, toegankelijk en flexibel.',
        items: [
          {
            icon: 'clock',
            title: '24/7 Toegang',
            desc: 'Jouw schema, jouw regels. Toegang tot de studio op elk moment, dag of nacht, met ons smartlocksysteem.',
          },
          {
            icon: 'shield',
            title: 'Volledig uitgerust',
            desc: 'Professionele backline, PA-systeem, drumstel, versterkers en monitors klaar voor gebruik. Plug in en speel.',
          },
          {
            icon: 'zap',
            title: 'Flexibele lidmaatschappen',
            desc: 'Maandelijkse abonnementen met inbegrepen uren. Geen langlopende contracten. Schaal op of af wanneer je wilt.',
          },
          {
            icon: 'users',
            title: 'Muziekcommunity',
            desc: 'Ontmoet andere muzikanten, doe mee met jamsessies en maak deel uit van Rotterdams creatieve muziekscene.',
          },
        ],
      },
      memberships: {
        badge: 'Lidmaatschappen',
        title: 'Duidelijke, transparante prijzen.',
        subtitle: 'Drie abonnementen voor elk repetitieritme. Geen verborgen kosten.',
        cta: 'Bekijk alle abonnementen',
      },
      benefits: {
        badge: 'Voordelen',
        title: 'Alles wat je nodig hebt om te repeteren.',
        items: [
          'Professioneel drumstel (Roland & akoestisch)',
          'Gitaar- en basversterkers',
          'Volledig PA-systeem met subwoofer',
          'Stagemonitors',
          'DI-boxen & microfoonstandaards',
          'Smart lock 24/7 toegang',
          'Klimaatgereguleerde ruimte',
          'Veilige, privé sessies',
          'Eenvoudig online boeken',
          'Ondersteunende muziekcommunity',
        ],
      },
      testimonials: {
        badge: 'Leden',
        title: 'Wat onze leden zeggen.',
        items: [
          {
            quote: 'Eindelijk een studio in Rotterdam die muzikanten serieus neemt. De 24/7 toegang heeft onze repetitieroutine volledig veranderd.',
            author: 'Thomas V.',
            role: 'Bandgitarist',
          },
          {
            quote: 'Als solo muzikant is het Starter-abonnement perfect. Professionele ruimte, geweldige sfeer, en de community is een bonus.',
            author: 'Amira K.',
            role: 'Singer-songwriter',
          },
          {
            quote: 'Na twee maanden zijn we overgestapt naar het Unlimited-abonnement. Het materiaal is top en het team is enorm behulpzaam.',
            author: 'DJ Renaud',
            role: 'Producer & live performer',
          },
        ],
      },
      faq: {
        title: 'Veelgestelde vragen.',
        items: [
          {
            q: 'Kan ik de studio bezoeken voor ik me aanmeld?',
            a: 'Uiteraard. Boek een gratis rondleiding via onze contactpagina en wij laten je alles zien.',
          },
          {
            q: 'Wat is er aanwezig in de repetitieruimte?',
            a: 'Alle ruimtes zijn volledig uitgerust met drumstel, versterkers, PA-systeem, monitors en microfoonstandaards.',
          },
          {
            q: 'Is er een minimale contractduur?',
            a: 'Onze lidmaatschappen zijn maand-tot-maand, zonder langlopende contracten.',
          },
          {
            q: 'Hoe werkt de 24/7 toegang?',
            a: 'Na aanmelding ontvang je een digitale sleutel op je smartphone. Ontgrendel de studio wanneer je wilt via de app.',
          },
        ],
      },
      cta: {
        title: 'Klaar om te beginnen?',
        subtitle: 'Sluit je aan bij Rotterdams beste repetitiestudio. Ontvang 24/7 toegang, professioneel materiaal en een ruimte die inspireert.',
        button: 'Start jouw lidmaatschap',
        secondary: 'Plan een gratis rondleiding',
      },
    },
    about: {
      hero: {
        badge: 'Ons verhaal',
        title: 'Gebouwd door muzikanten,\nvoor muzikanten.',
        subtitle: 'INFNTY Studio ontstond uit een eenvoudige frustratie: professionele oefenruimte vinden in Rotterdam was te moeilijk.',
      },
      story: {
        title: 'Hoe het begon.',
        body: 'We zochten jaren naar een repetitieruimte die aan alle eisen voldeed — professioneel materiaal, eerlijke prijzen, flexibele toegang. Toen we die niet konden vinden, bouwden we hem zelf.\n\nINFNTY Studio opende in Rotterdam met één missie: muzikanten een ruimte geven waar ze trots op kunnen zijn. Geen dure uurtarieven, geen verouderd materiaal, geen beperkende boekingstijden.',
      },
      mission: {
        badge: 'Missie',
        title: "Rotterdams muziekscene versterken.",
        body: 'Wij geloven dat elke muzikant toegang verdient tot een professionele ruimte om zijn vak te ontwikkelen. INFNTY Studio is ontworpen om de drempels tussen jou en je muziek weg te nemen.',
        values: [
          { title: 'Toegankelijkheid', desc: 'Open 24/7 zodat jouw schema nooit een belemmering is.' },
          { title: 'Kwaliteit', desc: 'Professioneel materiaal dat op het hoogste niveau onderhouden wordt.' },
          { title: 'Community', desc: 'Een plek waar muzikanten verbinden, samenwerken en groeien.' },
          { title: 'Flexibiliteit', desc: 'Maandelijkse abonnementen die passen bij jouw leven.' },
        ],
      },
      community: {
        badge: 'Community',
        title: 'Deel van iets groters.',
        body: 'INFNTY Studio is meer dan een oefenruimte. Het is een creatieve hub waar Rotterdamse muzikanten samenkomen. Jamsessies, workshops en ledenevenementen zijn onderdeel van wie we zijn.',
      },
      cta: {
        title: 'Kom ons ontmoeten.',
        subtitle: 'Boek een gratis rondleiding en bekijk de studio met eigen ogen.',
        button: 'Plan een rondleiding',
      },
    },
    memberships: {
      hero: {
        badge: 'Lidmaatschappen',
        title: 'Kies jouw\nrepetitieabonnement.',
        subtitle: 'Flexibele maandelijkse abonnementen zonder langlopend contract. Alle abonnementen bevatten 24/7 toegang en volledig materiaal.',
      },
      plans: [
        {
          name: 'Starter',
          price: 200,
          hours: 8,
          popular: false,
          description: 'Ideaal voor solo muzikanten en kleine ensembles die een paar keer per maand repeteren.',
          features: [
            '8 uur per maand',
            '24/7 toegang via smart lock',
            'Volledige backline & PA-systeem',
            'Online boekingsplatform',
            'Toegang tot community',
            'Extra uren voor €25/uur',
          ],
        },
        {
          name: 'Pro',
          price: 300,
          hours: 12,
          popular: true,
          description: 'Ons populairste abonnement voor actieve bands en muzikanten met een vast repetitieritme.',
          features: [
            '12 uur per maand',
            '24/7 toegang via smart lock',
            'Volledige backline & PA-systeem',
            'Online boekingsplatform',
            'Prioriteit bij het boeken',
            'Community-toegang & evenementen',
            'Extra uren voor €25/uur',
          ],
        },
        {
          name: 'Unlimited',
          price: 400,
          hours: 16,
          popular: false,
          description: 'Voor professionele bands, docenten en intensieve gebruikers die leven en ademen muziek.',
          features: [
            '16 uur per maand',
            '24/7 toegang via smart lock',
            'Volledige backline & PA-systeem',
            'Online boekingsplatform',
            'Prioriteit bij het boeken',
            'VIP community-evenementen',
            'Gastenkaarten (2/maand)',
            'Persoonlijke ondersteuning',
            'Extra uren voor €25/uur',
          ],
        },
      ],
      extraHours: {
        title: 'Meer uren nodig?',
        body: 'Alle leden kunnen extra uren boeken voor €25 per uur bovenop de inbegrepen maandelijkse uren. Niet-leden boeken voor €35 per uur.',
      },
      comparison: {
        title: 'Abonnementsvergelijking.',
        features: [
          { label: 'Maandelijkse uren', starter: '8u', pro: '12u', unlimited: '16u' },
          { label: '24/7 toegang', starter: true, pro: true, unlimited: true },
          { label: 'Volledig materiaal', starter: true, pro: true, unlimited: true },
          { label: 'Online boeken', starter: true, pro: true, unlimited: true },
          { label: 'Prioriteitsslots', starter: false, pro: true, unlimited: true },
          { label: 'Community-evenementen', starter: '—', pro: 'Inbegrepen', unlimited: 'VIP' },
          { label: 'Gastenkaarten', starter: false, pro: false, unlimited: '2/maand' },
          { label: 'Extra uurtarief', starter: '€25/u', pro: '€25/u', unlimited: '€25/u' },
        ],
      },
      faq: {
        title: 'Vragen over lidmaatschap.',
        items: [
          { q: 'Kan ik op elk moment opzeggen?', a: 'Ja. Lidmaatschappen zijn maand-tot-maand. Zeg op voor je volgende factuurdatum zonder boete.' },
          { q: 'Kan ik upgraden of downgraden?', a: 'Ja. Je kunt je abonnement op elk moment wijzigen. Wijzigingen gaan in per de volgende factuurperiode.' },
          { q: 'Gaan uren over naar de volgende maand?', a: 'Uren zijn geldig binnen de kalendermaand en gaan niet over naar de volgende maand.' },
          { q: 'Kan ik mijn lidmaatschap delen?', a: 'Lidmaatschappen zijn persoonlijk en niet overdraagbaar. Elk bandlid heeft zijn eigen abonnement of betaalt extra uren.' },
        ],
      },
      cta: {
        title: 'Klaar om lid te worden?',
        subtitle: 'Start vandaag nog met je lidmaatschap en krijg direct toegang tot de studio.',
        button: 'Begin nu',
        secondary: 'Plan een gratis rondleiding',
      },
    },
    studio: {
      hero: {
        badge: 'De Studio',
        title: 'Een ruimte gebouwd\nvoor professioneel geluid.',
        subtitle: 'Eén volledig uitgeruste repetitieruimte ontworpen voor bands, muzikanten en performers.',
      },
      room: {
        badge: 'Repetitieruimte',
        title: 'Professioneel materiaal. Altijd klaar.',
        body: 'Onze repetitieruimte is uitgerust met professioneel materiaal dat regelmatig onderhouden en afgestemd wordt. Loop naar binnen, plug in en speel.',
        equipment: [
          { category: 'Drums', items: ['Volledig akoestisch drumstel', 'Roland elektronisch drumstel', 'Volledige cimbaalsetup', 'Drumkruk & pedalen'] },
          { category: 'Versterking', items: ['Gitaarversterker (Fender/Marshall)', 'Basversterker (Ampeg)', 'Volledig PA-systeem met subwoofer', '4× stagemonitors'] },
          { category: 'Accessoires', items: ['DI-boxen', 'Microfoonstandaards (×8)', 'Instrumentkabels', 'Stekkerdozen & verlengkabels'] },
        ],
      },
      access: {
        badge: '24/7 Toegang',
        title: 'Jouw studio, jouw uren.',
        body: 'Met ons smart lock-systeem heb je toegang tot de studio op elk moment — vroeg in de ochtend, laat in de nacht, in het weekend, op feestdagen. Je lidmaatschap geeft je volledige toegang wanneer je het nodig hebt.',
        features: [
          { title: 'Smart Lock', desc: 'Digitale sleutel op je smartphone. Nooit meer fysieke sleutels kwijtraken.' },
          { title: 'Directe toegang', desc: 'Ontvang je digitale sleutel direct na activering van je lidmaatschap.' },
          { title: 'Boekingsapp', desc: 'Boek sessies online via ons ledenportaal.' },
          { title: 'Realtime beschikbaarheid', desc: 'Bekijk wanneer de ruimte beschikbaar is en boek direct.' },
        ],
      },
      location: {
        badge: 'Locatie',
        title: 'In het hart van Rotterdam.',
        address: 'Rotterdam, Nederland',
        details: [
          'Dicht bij openbaar vervoer',
          'Parkeren mogelijk in de buurt',
          'Bereikbaar per fiets, tram en metro',
          'Centrale locatie, makkelijk te bereiken',
        ],
        cta: 'Routebeschrijving',
      },
      cta: {
        title: 'Wil je het zelf zien?',
        subtitle: 'Boek een gratis rondleiding en ervaar de studio met eigen ogen.',
        button: 'Plan een gratis rondleiding',
      },
    },
    booking: {
      hero: {
        badge: 'Boeken',
        title: 'Boek jouw\nrepetitiesessie.',
        subtitle: 'Leden boeken direct via het portaal. Eerste keer? Begin met een gratis rondleiding.',
      },
      types: [
        {
          title: 'Ledenboeing',
          desc: 'Gebruik je inbegrepen maandelijkse uren om sessies te boeken. Log in op je ledenportaal en reserveer je slot in enkele seconden.',
          cta: 'Inloggen om te boeken',
          href: '/login',
          accent: 'rose',
        },
        {
          title: 'Losse boeking',
          desc: 'Nog geen lid? Boek een eenmalige sessie voor €35 per uur. Geen verplichting.',
          cta: 'Neem contact op',
          href: '/nl/contact',
          accent: 'amber',
        },
        {
          title: 'Gratis rondleiding',
          desc: 'Kom de studio bekijken voordat je een keuze maakt. Een gratis rondleiding van 30 minuten waarin we je alles laten zien.',
          cta: 'Plan een rondleiding',
          href: '/nl/contact',
          accent: 'zinc',
        },
      ],
      pricing: {
        title: 'Prijsoverzicht.',
        rows: [
          { label: 'Starter lidmaatschap', value: '€200/maand', note: '8u inbegrepen' },
          { label: 'Pro lidmaatschap', value: '€300/maand', note: '12u inbegrepen' },
          { label: 'Unlimited lidmaatschap', value: '€400/maand', note: '16u inbegrepen' },
          { label: 'Extra uren (lid)', value: '€25/u', note: 'Bovenop inbegrepen uren' },
          { label: 'Losse boeking', value: '€35/u', note: 'Geen lidmaatschap vereist' },
        ],
      },
      cta: {
        title: 'Word lid voor betere tarieven.',
        subtitle: 'Leden besparen aanzienlijk op uurtarieven. Het Starter-abonnement verdient zich al terug na slechts 6 uur.',
        button: 'Bekijk lidmaatschappen',
      },
    },
    community: {
      hero: {
        badge: 'Community',
        title: 'Meer dan een oefenruimte.',
        subtitle: 'INFNTY Studio is een gemeenschap van muzikanten, bands en artiesten die elkaar ondersteunen.',
      },
      events: {
        badge: 'Evenementen',
        title: 'Regelmatige evenementen voor leden.',
        items: [
          { title: 'Maandelijkse jamsessies', desc: 'Open jamsessies voor alle leden. Speel met muzikanten uit verschillende genres en achtergronden.' },
          { title: 'Workshops & clinics', desc: 'Vaardigheidstrainingen geleid door professionele muzikanten. Opnemen, mixen, optreden en meer.' },
          { title: 'Ledenshowcases', desc: 'Intieme optredens waarbij leden hun werk delen met de community.' },
          { title: 'Netwerkevenementen', desc: 'Maak contact met andere muzikanten, producers en muziekindustrie-professionals in Rotterdam.' },
        ],
      },
      collab: {
        badge: 'Samenwerking',
        title: 'Vind je volgende bandlid.',
        body: 'Ons community-board en ledennetwerk helpen je in contact te komen met muzikanten die willen samenwerken, een band willen vormen of sessiemusici zoeken.',
      },
      cta: {
        title: 'Word lid van de community.',
        subtitle: 'Sluit je aan als lid en maak deel uit van Rotterdams meest ondersteunende muziekcommunity.',
        button: 'Bekijk lidmaatschappen',
      },
    },
    faq: {
      hero: {
        badge: 'FAQ',
        title: 'Veelgestelde\nvragen.',
        subtitle: 'Alles wat je moet weten over INFNTY Studio.',
      },
      categories: [
        {
          title: 'Lidmaatschappen',
          items: [
            { q: 'Welke lidmaatschappen zijn er?', a: 'We bieden drie abonnementen: Starter (€200/maand, 8u), Pro (€300/maand, 12u) en Unlimited (€400/maand, 16u). Alle abonnementen bevatten 24/7 toegang en volledig materiaal.' },
            { q: 'Is er een minimale contractduur?', a: 'Nee. Alle abonnementen zijn maand-tot-maand. Je kunt op elk moment opzeggen, upgraden of downgraden voor je volgende factuurdatum.' },
            { q: 'Kan ik een lidmaatschap delen met mijn band?', a: 'Lidmaatschappen zijn persoonlijk. Elk lid dat individuele toegang wil, heeft zijn eigen abonnement nodig. Bands kunnen sessies delen vanuit één abonnement.' },
            { q: 'Gaan ongebruikte uren over?', a: 'Maandelijkse uren zijn geldig binnen de kalendermaand. Ze gaan niet over naar de volgende maand.' },
          ],
        },
        {
          title: 'Boeken',
          items: [
            { q: 'Hoe boek ik een sessie?', a: 'Leden boeken via ons online portaal op infntystudio.com/login. Je kunt realtime beschikbaarheid zien en in seconden boeken.' },
            { q: 'Hoe ver van tevoren kan ik boeken?', a: 'Leden kunnen tot 30 dagen van tevoren boeken. Pro- en Unlimited-leden krijgen vroeg toegang tot piekslots.' },
            { q: 'Kan ik extra uren boeken?', a: 'Ja. Extra uren zijn beschikbaar voor €25/uur voor leden en €35/uur voor niet-leden.' },
            { q: 'Wat is het annuleringsbeleid?', a: 'Annuleer tot 24 uur voor je sessie kosteloos. Late annuleringen kunnen kosten met zich meebrengen.' },
          ],
        },
        {
          title: 'Toegang',
          items: [
            { q: 'Hoe werkt de 24/7 toegang?', a: 'Na aanmelding ontvang je een digitale sleutel op je smartphone via onze toegangsapp. Je kunt de studio op elk moment ontgrendelen vanuit de app.' },
            { q: 'Wat als ik mijn telefoon vergeet?', a: 'Neem contact op via WhatsApp en wij kunnen tijdelijke toegang verlenen. We raden aan altijd je telefoon mee te nemen als backup.' },
            { q: 'Is de studio veilig?', a: 'Ja. De studio is beveiligd met camerasystemen, smart locks en bevindt zich in een veilig deel van Rotterdam.' },
          ],
        },
        {
          title: 'Betalingen',
          items: [
            { q: 'Hoe werkt facturering?', a: 'Lidmaatschappen worden maandelijks automatisch gefactureerd. We accepteren creditcard, iDEAL en andere grote betaalmethoden.' },
            { q: 'Wat als een betaling mislukt?', a: 'We sturen je direct een melding. Toegang blijft 3 dagen actief zodat je je betaalmethode kunt bijwerken.' },
            { q: 'Geven jullie restitutie?', a: 'We bieden pro-rata restitutie bij opzegging halverwege de maand in je eerste 30 dagen. Daarna is de huidige maandkosten niet-restitueerbaar.' },
          ],
        },
        {
          title: 'Studioregels',
          items: [
            { q: 'Wat zijn de geluidsregels?', a: 'De studio is geluidsgeïsoleerd. Je kunt op vol volume spelen op elk moment. Gangen en gemeenschappelijke ruimtes moeten rustig blijven, zeker \'s avonds laat.' },
            { q: 'Mag ik opnemen in de studio?', a: 'Ja. Je kunt je repetities opnemen met eigen apparatuur. We bieden geen aparte opnameservice.' },
            { q: 'Zijn eten en drinken toegestaan?', a: 'Niet-alcoholische dranken in gesloten containers zijn welkom. Geen eten in de buurt van apparatuur. Laat de ruimte schoon achter voor het volgende lid.' },
          ],
        },
      ],
    },
    contact: {
      hero: {
        badge: 'Contact',
        title: 'Neem contact op.',
        subtitle: 'Vragen over lidmaatschappen, boekingen of wil je een gratis rondleiding plannen? We helpen je graag.',
      },
      form: {
        title: 'Stuur ons een bericht.',
        name: 'Jouw naam',
        email: 'Jouw e-mailadres',
        subject: 'Onderwerp',
        message: 'Jouw bericht',
        submit: 'Verstuur bericht',
        success: 'Bericht verzonden! We nemen binnen 24 uur contact met je op.',
        subjects: ['Algemene vraag', 'Lidmaatschapsinformatie', 'Rondleiding plannen', 'Hulp bij boeken', 'Anders'],
      },
      methods: [
        { type: 'whatsapp', label: 'WhatsApp', value: 'Stuur ons een WhatsApp', desc: 'Snelste reactie — meestal binnen 1 uur tijdens kantooruren.' },
        { type: 'email', label: 'E-mail', value: 'info@infntystudio.com', desc: 'We reageren binnen 24 uur op werkdagen.' },
        { type: 'location', label: 'Locatie', value: 'Rotterdam, Nederland', desc: 'Bezoek ons voor een gratis rondleiding. Boek je slot via dit formulier.' },
      ],
    },
    footer: {
      tagline: "Rotterdams beste repetitieruimte. Open 24/7.",
      links: {
        studio: {
          title: 'Studio',
          items: [
            { label: 'Over ons', href: '/nl/about' },
            { label: 'Studio', href: '/nl/studio' },
            { label: 'Community', href: '/nl/community' },
            { label: 'Contact', href: '/nl/contact' },
          ],
        },
        memberships: {
          title: 'Lidmaatschappen',
          items: [
            { label: 'Alle abonnementen', href: '/nl/memberships' },
            { label: 'Boeken', href: '/nl/booking' },
            { label: 'FAQ', href: '/nl/faq' },
            { label: 'Inloggen', href: '/login' },
          ],
        },
      },
      legal: '© 2025 INFNTY Studio Rotterdam. Alle rechten voorbehouden.',
    },
  },
}

export type Translations = typeof t.en
