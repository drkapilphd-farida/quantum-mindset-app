export type Lang = "en" | "hi";

export const translations = {
  en: {
    nav: {
      links: [
        { label: "Programs", href: "#explore-programs" },
        { label: "Retreats", href: "/retreats/online-11-day" },
        { label: "Mentoring", href: "/mentoring/personal-class" },
        { label: "About", href: "/about" },
        { label: "FAQ", href: "#faq" },
      ],
      ctaPrimary: "Start 7 Days Free",
    },
    // Shared, not nested under qsrLanding/retreatLanding — the exact same
    // trust line and policy link appear next to every primary Razorpay
    // CTA across both pages, so one translated copy avoids drift between
    // them (see CheckoutTrustLine.tsx).
    checkoutTrust: {
      line: "Payments secured by Razorpay. 100% safe & encrypted — we never store your card details.",
      refundLabel: "Refund & Cancellation Policy",
    },
    // Shared, not nested under retreatLanding/residentialLanding/tier3 —
    // the same standing safety line appears near every enrollment CTA for
    // a spiritual/energy-work offering (both Retreat pages' final CTA,
    // Residential's pricing section, and the homepage Personal Class
    // mentoring card), so the wording never drifts between placements
    // (see PracticeDisclaimer.tsx).
    wellnessDisclaimer: {
      line: "This is a spiritual and personal-development practice, not a substitute for licensed medical or mental health treatment. If you're in crisis, please contact a licensed professional or local emergency services.",
    },
    // Shared, not nested under a page — the same two-part pricing story
    // (live masterclass / continue plan) appears on the homepage and the
    // QSR landing page, so one translated copy avoids the two pages
    // drifting out of sync (see AccessModelStrip.tsx). No free-access
    // tier — removed per explicit correction: neither the app alone nor
    // the live sessions alone deliver the program's result, so there is
    // no free way to get the program itself. What's genuinely free (the
    // Reading Speed Test, the live intro session) lives in its own
    // sections, never framed as "free access to the program."
    accessModel: {
      masterclassLabel: "Live Masterclass — ₹9,999",
      masterclassDesc: "The full 30-day curriculum, 7 live sessions with Dr. Sharma, and app access throughout — one-time.",
      continueLabel: "Continue — ₹499/mo",
      continueDesc: "For graduates who've completed the program and want continued app practice afterward.",
    },
    hero: {
      eyebrow: "Dr. Kapil Dev Sharma — Mind Ur Mind",
      credentials: [
        "English Professor (15+ Years Experience)",
        "India's First QSR Pioneer (Since 2015)",
        "10,000+ Students Guided",
      ],
      headline: "India's First Science-Backed Quantum Speed Reading",
      headlineEm: "5x Faster Reading. 100% Retention. EEG-Verified.",
      sub: "Struggling to finish your syllabus? Reading for hours but remembering nothing? Your child studies for hours but forgets everything? This isn't a reading problem — it's a training problem. No hypnosis, no shortcuts — pure cognitive science.",
      ctaPrimary: "Watch the Free Training Now",
      ctaSecondary: "Take the Free Speed Test",
      portraitName: "Dr. Kapil Dev Sharma",
      portraitTitle: "Founder, Mind Ur Mind",
      stats: [
        { value: "30-Day Streak", label: "Quantum Speed Reading" },
        { value: "11 Days, Monthly", label: "Online Meditation & Inner Mastery Retreat" },
        { value: "3–4× / Year", label: "Residential · Rishikesh & Lonavala" },
        { value: "1-on-1", label: "Personal Class" },
      ],
    },
    tier1: {
      eyebrow: "Tier 01 · Prime Flagship",
      audienceTag: "For Students & Professionals",
      title: "Quantum Speed Reading",
      titleEm: "30-Day Masterclass",
      desc: "Not a webinar. A 30-day rebuild of how your mind processes information — for students, professionals, and lifelong learners of every age.",
      features: [
        "30-day progressive app streak with daily drills",
        "7 live masterclass sessions with Dr. Sharma",
        "WPM & comprehension tracking, not just raw speed",
        "Designed for every age group and reading level",
      ],
      trustQuote: {
        quote: "I finished two books in the time it used to take me to finish one chapter.",
        name: "Ananya R.",
      },
      cta: "Unlock 30-Day Masterclass",
      visualCaption: "Day 22 of 30 · Streak Active",
    },
    tier2: {
      eyebrow: "Tier 02 · Deep Immersive Retreats",
      title: "Go beyond technique —",
      titleEm: "into direct experience",
      desc: "For those ready to move past reading and into meditation and inner mastery, online or in person.",
      online: {
        tag: "Online · Monthly Batch",
        audienceTag: "For Deep Seekers",
        urgency: "Small Cohort · Limited Enrollment",
        title: "11-Day Online Meditation & Inner Mastery Retreat",
        desc: "An intensive, live, 11-day journey through meditation and inner mastery disciplines — guided daily by Dr. Sharma.",
        pills: [
          "Telepathy Send/Receive",
          "Aura Scanning & Reading",
          "Samadhi Meditation",
          "Chakra Activation & Enlightenment",
          "Kundalini Meditation",
          "Astral Projection",
        ],
        trustQuote: {
          quote: "The Kundalini sessions alone were worth the entire eleven days.",
          name: "Vikram S.",
        },
        cta: "Secure Your Batch Spot",
        freePracticeLinkLabel: "Or try a free guided practice first",
      },
      residential: {
        tag: "In-Person · 3–4× a Year",
        audienceTag: "For Deep Seekers",
        urgency: "Small Group · Limited Seats",
        title: "Residential Retreats",
        desc: "Small-group, fully immersive retreats held in Rishikesh and Lonavala — the deepest format Mind Ur Mind offers.",
        pills: ["Rishikesh", "Lonavala", "Small Group, Exclusive", "Full Immersion"],
        cta: "Secure Your Retreat Seat",
      },
    },
    tier3: {
      eyebrow: "Tier 03 · Specialized & 1-on-1",
      title: "Precise work for a",
      titleEm: "specific problem",
      desc: "Not everyone needs a retreat. Some people need one mind fixed on one thing — starting with their own.",
      mentoring: {
        tag: "Private · Custom Intensity",
        audienceTag: "Customized 1-on-1",
        title: "Personal Class — 1-on-1 Intensive Mentoring",
        desc: "Direct, private mentoring with Dr. Sharma, fully customized — for life stress and spiritual breakthroughs, not a replacement for therapy.",
        pills: ["Spiritual Breakthroughs", "Fully Customized"],
        trustQuote: {
          quote: "Six private sessions did what years of general advice never managed.",
          name: "Priya M.",
        },
        cta: "Apply for 1-on-1 Mentoring",
      },
      course: {
        tag: "21-Day Program",
        audienceTag: "For Overthinkers",
        title: "Overthinking Mastery Course",
        desc: "A focused, 21-day course built to interrupt the overthinking loop — practical, daily, specific.",
        pills: ["Daily Practice", "21 Days", "Mental Clarity Focus"],
        cta: "Begin Your 21-Day Reset",
      },
    },
    programSelector: {
      title: "Where Would You Like to Begin?",
      subtitle: "Tell us who this is for — we'll point you the right way.",
      // Audience-first path cards (see the "Homepage & QSR Conversion
      // Rewrite" task) — replaces the earlier "QSR flagship + 3 other
      // programs" layout with 3 cards keyed to WHO the visitor is
      // shopping for, not which product they'd pick. Two of the three
      // point at QSR itself (self vs. parent framing); the third is the
      // only homepage path into deeper mind-training work (meditation /
      // overthinking) since that's not sold as a single product.
      paths: [
        {
          key: "self",
          title: "Learning for Myself",
          desc: "Read faster, retain more, and get through your syllabus or reading list without burning out.",
          cta: "Explore Quantum Speed Reading",
        },
        {
          key: "child",
          title: "Looking for My Child",
          desc: "Help your child study less, remember more, and feel less stressed before exams.",
          cta: "See the Program for Parents",
        },
        {
          key: "deeper",
          title: "Deeper Mind Training",
          desc: "For meditation, inner stillness, and working through overthinking with direct guidance.",
          cta: "Explore Mentoring",
        },
      ],
    },
    homeProgramCards: {
      eyebrow: "The Catalog",
      title: "Explore Our Programs",
      habitBuilder: {
        number: "02",
        eyebrowLabel: "A Lead-In to Quantum Speed Reading",
        title: "Quantum Mind & Habit Builder",
        desc: "Build your daily focus habit before starting QSR — free 7-day starter.",
        priceLine: "7 Days Free · ₹99 one-time",
        cta: "Start Free",
      },
      featured: {
        number: "01",
        eyebrowLabel: "30-Day Masterclass · Flagship",
        cta: "Explore Program",
      },
      retreat: {
        number: "03",
        eyebrowLabel: "11-Day Immersive Experience",
        cta: "Explore Retreat",
      },
      course: {
        number: "04",
        eyebrowLabel: "21-Day Self-Paced Program",
        cta: "Explore Program",
      },
      mentoring: {
        number: "05",
        eyebrowLabel: "Personalised Guidance",
        cta: "Apply for Mentoring",
      },
      whatsappCard: {
        title: "Have Questions?",
        desc: "Not sure which program fits? Message us directly — a real person replies, not a bot.",
        cta: "Chat on WhatsApp",
      },
    },
    homeHabitFeature: {
      // Positioning fix (see the "Fix Homepage & QSR Page Positioning"
      // task) — this section previously got homepage-hero-level visual
      // treatment (a large headline, a dominant 250px phone mockup, four
      // supporting thumbnails), which competed with the QSR flagship for
      // attention. Copy now explicitly frames this as a low-commitment
      // on-ramp for a visitor not ready for the full Masterclass, rather
      // than implying it via layout alone.
      eyebrow: "Before You Start QSR",
      title: "Build the Focus Habit First",
      lead: "Build your daily focus habit before starting QSR — free 7-day starter. A low-commitment, 21-day guided on-ramp, no pressure to enroll in anything else.",
      freeLabel: "7 DAYS FREE",
      priceLabel: "₹99 one-time",
      noSubscriptionLabel: "No monthly subscription.",
      cta: "Start 7 Days Free",
      mainScreenshotAlt: "The Quantum Mindset & Habit Builder dashboard — a real streak and daily continue screen",
    },
    // Mumbai in-person QSR workshop — a bright, distinct homepage card
    // (see the "Build the Mumbai Offline Workshop Feature + Fix EEG
    // Copy" task, Part 2). Deliberately more eye-catching than the
    // site's other Tier-2/3 secondary cards (a real "NEW" launch worth
    // standing out), but still placed below and never larger than the
    // QSR flagship block in ProgramSelector above it.
    homeMumbaiWorkshop: {
      badge: "New · Pilot Batch",
      title: "QSR, Now Live In-Person in Mumbai",
      desc: "A 2-day in-person extension of the Masterclass — live coaching, a Cognitive & Focus Engagement Demo, and the same ₹9,999 price.",
      meta: "Mumbai · 2 Days · ₹9,999 · Limited Seats",
      cta: "Explore the Mumbai Workshop",
    },
    // Offline QSR + EEG Cognitive Testing — multi-city (see the
    // "Homepage, QSR & Multi-City EEG Rewrite" task) — replaces the old
    // single-line "EEG available in Vadodara" mention and the old
    // Mumbai-only workshop banner. Shared between the QSR page (full
    // placement, all copy below) and the homepage (teaserDesc + a single
    // CTA pointing at the full section on the QSR page, not the
    // full city grid). City list/status lives in eegWorkshopCities.ts,
    // not here — this block is copy only.
    offlineEegWorkshop: {
      eyebrow: "Offline QSR + EEG",
      title: "Offline QSR + EEG Cognitive Testing — Available in Your City",
      desc: "Want to see your own brain states on EEG? Our 2-Day Offline QSR Workshop includes live EEG testing so you can track your Alpha/Theta training in person with our trainers. The rest of your 30-day program continues online, at your own pace.",
      teaserDesc: "Want to see your own brain states on EEG, not just read about them? Our 2-Day Offline QSR Workshop includes live, in-person EEG testing — now open across 6 cities.",
      howItWorksLabel: "How It Works",
      steps: [
        "Register for the 2-day offline workshop in your nearest city (EEG testing included)",
        "Attend 2 days in person for live brain-state tracking and hands-on coaching",
        "Continue the remaining sessions of your 30-day program online",
      ],
      citiesLabel: "Available Cities",
      waitlistCta: "Join Waitlist — We'll Confirm Your City's Date",
      registerCta: "Register Now",
      teaserCta: "See Cities & Join the Waitlist",
    },
    homeOverviewVideo: {
      eyebrow: "Real People. Real Sessions.",
      title: "See the Mind Ur Mind Experience",
      subtitle: "A look inside real workshops, with real participants — not a promotional reel.",
      closingMessage: "Find the path that's right for you.",
      cta: "Explore Your Path",
      videoTitle: "The Mind Ur Mind Experience",
    },
    homeSpeedTest: {
      eyebrow: "Always Free",
      title: "How Fast Do You Really Read?",
      lead: "Most people have never measured their actual reading speed.",
      desc: "Take our free reading speed test and discover your current reading speed and potential.",
      cta: "Take the Free Reading Speed Test",
    },
    homeWhy: {
      eyebrow: "More Than Courses",
      title: "More Than Courses.",
      subtitle: "A Different Approach to Learning & Transformation.",
      lead: "We don't believe everyone should learn the same way.",
      concepts: [
        { title: "Learn", desc: "Knowledge and learning systems", programLabel: "Quantum Speed Reading" },
        { title: "Practice", desc: "Daily exercises and structured challenges", programLabel: "Quantum Mind & Habit Builder" },
        { title: "Experience", desc: "Retreats and immersive learning", programLabel: "Retreats" },
        { title: "Personalise", desc: "Individual mentoring and guidance", programLabel: "1-on-1 Mentoring" },
      ],
    },
    homeGuide: {
      eyebrow: "The Teacher Behind the Method",
      title: "Meet Dr. Kapil Sharma",
      cta: "Discover Dr. Kapil's Journey",
    },
    homeFinalCta: {
      title: "Ready to Read Differently?",
      desc: "Watch the free training and see the method before you commit to anything.",
      ctaPrimary: "Watch the Free Training Now",
      ctaSecondary: "Explore All Programs",
    },
    galleryGlimpse: {
      eyebrow: "A Glimpse Inside",
      title: "Moments From Our Workshops",
      subPrefix: "Real workshops. Real people. Across",
      subSuffix: "cities in India.",
      viewGalleryCta: "View Full Gallery",
    },
    galleryPage: {
      eyebrow: "The Gallery",
      title: "Real Moments From Real Programs",
      desc: "Workshops, retreats, and live sessions — photos dropped in as each program happens.",
      filterAll: "All",
      filterWorkshops: "Workshops",
      filterRetreats: "Retreats",
      filterQsr: "QSR Sessions",
    },
    homeFranchiseTeaser: {
      headline: "Are You a Trainer or Edupreneur?",
      line: "Start your own QSR Training Business — with a ready platform, marketing kit, and certification.",
      cta: "See Franchise Details",
    },
    franchisePage: {
      hero: {
        eyebrow: "Franchise Opportunity",
        headline: "Are You a Trainer or Edupreneur?",
        sub: "Start your own Quantum Speed Reading training business — with a ready platform, marketing kit, and certification.",
        ctaPrimary: "Apply to Become a Certified Trainer",
        ctaSecondary: "Watch Introduction",
      },
      applyCta: "Apply Now",
      problem: {
        eyebrow: "The Reality",
        headline: "Starting Alone Is Hard",
        points: [
          {
            title: "No Ready Platform",
            desc: "No curriculum, no training platform — you'd have to build everything from zero before you can teach a single class.",
          },
          {
            title: "Expensive Content",
            desc: "Producing your own marketing materials and course content costs time and money most first-time trainers don't have.",
          },
          {
            title: "No Marketing Know-How",
            desc: "Being a great trainer doesn't mean you know how to find students, run ads, or convert a demo into an enrollment.",
          },
        ],
      },
      included: {
        eyebrow: "What You Get",
        title: "Everything you need to start",
        items: [
          {
            title: "Training & Certification",
            desc: "A structured 7-day trainer certification program that equips you to launch and run your own Quantum Speed Reading training practice immediately — not just learn a skill.",
          },
          {
            title: "Branded Software",
            desc: "Access to the training software under your own brand name and logo — not ours.",
          },
          {
            title: "Ready-to-Use Landing Page",
            desc: "A dedicated landing page to support your own promotion and enrollments.",
          },
          {
            title: "Marketing Material",
            desc: "Resources to help you promote the program to your own audience.",
          },
          {
            title: "Quantum Speed Reading Methodology",
            desc: "The complete, structured curriculum developed and refined by Dr. Kapil Dev Sharma since 2015.",
          },
          {
            title: "Partner Ecosystem & Support",
            desc: "Ongoing access to the Mind Ur Mind team whenever you have a question.",
          },
        ],
      },
      trainerTestimonials: {
        eyebrow: "Real Trainers, Real Experiences",
        title: "Real Trainers. Real Experiences.",
        desc: "See what trainers have experienced while learning and preparing to deliver the methodology.",
        verifiedLabel: "Verified via WhatsApp",
        items: [
          { id: "dev-prakash", name: "Dev Prakash", city: "Mumbai" },
          { id: "saloni-shah", name: "Saloni Shah", city: "Delhi" },
          { id: "sandeep-gupta", name: "Sandeep Gupta", city: "Kolkata" },
        ],
      },
      studentTestimonials: {
        eyebrow: "What Students Say",
        title: "What Students Say",
        desc: "Real experiences from learners who have experienced Quantum Speed Reading.",
        videoLabel: "Student Testimonial",
      },
      earning: {
        eyebrow: "Earning Potential",
        headline: "What You Could Earn",
        scenarios: [
          {
            label: "Part-Time",
            desc: "3–5 students / month",
            range: "₹21,600 – ₹36,000",
          },
          {
            label: "Established",
            desc: "8–10 students / month",
            range: "₹57,600 – ₹72,000",
          },
          {
            label: "Full-Time",
            desc: "15+ students / month",
            range: "₹1,08,000+",
          },
        ],
        disclaimer: "These are illustrative estimates based on an example course fee, not guaranteed outcomes. Actual earnings depend on your effort, local market, and enrollment numbers.",
      },
      businessModel: {
        eyebrow: "Business Model",
        headline: "A Transparent Business Model",
        explanation: "Partners bring their own students and build their own training business using the methodology, software, and resources provided.",
        onboardingLabel: "One-Time Onboarding Fee",
        onboardingValue: "₹20,000 – ₹25,000",
        revenueLabel: "Revenue Share",
        revenueValue: "15–20%",
        revenueUnit: "per student enrollment",
        monthlyLabel: "Monthly Fee",
        monthlyValue: "₹0",
        renewalLabel: "Renewal After 1 Year",
        renewalValue: "₹5,000",
        weProvideTitle: "We Provide",
        weProvideItems: [
          "The Quantum Speed Reading methodology",
          "Training & certification",
          "Software access, branded with your own name and logo",
          "A ready-to-use landing page",
          "Marketing material",
        ],
        youBringTitle: "You Bring",
        youBringItems: [
          "Your own students",
          "Your own audience",
          "Your teaching and business effort",
        ],
      },
      howItWorks: {
        eyebrow: "Process",
        headline: "How It Works",
        steps: [
          { title: "Apply", desc: "Submit your interest through the application form." },
          { title: "Form", desc: "Share your background and why you're interested." },
          { title: "Screening", desc: "Our team reviews your application." },
          { title: "Call", desc: "A short conversation to understand fit on both sides." },
          { title: "Selection", desc: "Confirmed partners move forward to certification." },
          { title: "Training", desc: "Learn the complete Quantum Speed Reading methodology." },
          { title: "Certification", desc: "Complete the 7-day certification program." },
        ],
      },
      about: {
        eyebrow: "About",
        headline: "Who You're Partnering With",
        bio: "Dr. Kapil Dev Sharma has 26 years of experience as a mind trainer and coach. He developed the Quantum Speed Reading methodology in 2015, and has continued to evolve it into a structured, cognitive-science-based program since — the same curriculum and training method this partner program is built on.",
        credentials: [
          "26 years as a mind trainer and coach",
          "Developer of the Quantum Speed Reading methodology, since 2015",
          "10,000+ students guided directly",
        ],
        videoTitle: "Quantum Speed Reading Introduction",
      },
      whoFor: {
        eyebrow: "Who Is This For",
        headline: "Is This Right For You?",
        cards: [
          {
            title: "Recent Graduates",
            desc: "Looking to start a career with a ready curriculum instead of building one from scratch.",
          },
          {
            title: "Coaching Center / Tuition Owners",
            desc: "Wanting a new revenue stream by adding a high-demand program to your existing business.",
          },
          {
            title: "Teachers",
            desc: "Wanting a part-time or side income, running your own sessions alongside your existing work.",
          },
        ],
      },
      faq: {
        eyebrow: "Questions",
        headline: "Frequently Asked Questions",
        items: [
          {
            question: "Who can become a certified trainer?",
            answer: "Teachers, coaching center or tuition owners, recent graduates, and anyone comfortable speaking in front of a group. There's no fixed educational requirement.",
          },
          {
            question: "Do I need prior teaching experience?",
            answer: "No formal teaching degree is required, but you should be comfortable speaking in front of a group. The certification program itself trains you in both the technique and how to facilitate a session.",
          },
          {
            question: "How long does certification take?",
            answer: "The certification program is 7 days, completed after your screening call and selection.",
          },
          {
            question: "What exactly do I receive?",
            answer: "Training and Quantum Speed Reading certification, access to the training software under your own brand name and logo, a ready-to-use landing page, and marketing material to help you promote the program.",
          },
          {
            question: "Do you provide students?",
            answer: "No. You bring your own students and audience — we provide the methodology, training, certification, branded software, landing page, and marketing material to support you in teaching them.",
          },
          {
            question: "What marketing support is included?",
            answer: "A ready-to-use landing page and marketing material to help you promote the program to your own audience. Finding and enrolling students is your responsibility.",
          },
          {
            question: "Is there a monthly fee?",
            answer: "No. There is no monthly fee.",
          },
          {
            question: "What is the onboarding fee?",
            answer: "A one-time partner onboarding fee of ₹20,000–₹25,000, covering your training, certification, branded software, landing page, and marketing material.",
          },
          {
            question: "What is the revenue share?",
            answer: "15–20% of each student enrollment goes to Mind Ur Mind Academy — this scales with what you actually earn, not a fixed fee.",
          },
          {
            question: "Is there a renewal fee, and what happens after one year?",
            answer: "Yes — a renewal fee of ₹5,000 applies after your first year as a certified partner. Your partnership continues on payment of this fee, with no other change to what you receive or how the revenue share works.",
          },
          {
            question: "What is the application process?",
            answer: "Apply through the form below, complete a short background form, go through screening and a call with our team, and — if selected — begin your 7-day training and certification.",
          },
        ],
      },
      apply: {
        eyebrow: "Apply",
        title: "Ready to Build Your Quantum Speed Reading Training Practice?",
        sub: "Apply to become a certified trainer and explore whether this partnership is right for you.",
        instantApplyCta: "Apply Instantly via WhatsApp",
        talkToTeamLabel: "Talk to Our Team",
      },
      whatsapp: {
        bubble: "Have questions about becoming a certified trainer? Chat with our team instantly.",
        button: "Chat on WhatsApp",
        ariaLabel: "Chat with the Mind Ur Mind team on WhatsApp about the trainer partner program",
      },
    },
    testimonials: {
      eyebrow: "Real People, Real Shifts",
      title: "What changes when you read differently",
      desc: "A few of the students, professionals, and exam aspirants who've been through Quantum Speed Reading — in their own words.",
      videoLabel: "Watch Real Stories",
      viewAll: "Watch More Stories",
      items: [
        {
          id: "ananya-r",
          qsrPageOnly: false,
          name: "Ananya R.",
          program: "Quantum Speed Reading",
          programKey: "qsr",
          quote: "I finished two books in the time it used to take me to finish one chapter.",
          context: "",
          result: "~2x reading throughput",
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "dr-preeti",
          qsrPageOnly: true,
          name: "Dr. Preeti",
          program: "Quantum Speed Reading",
          programKey: "qsr",
          quote:
            "The Quantum Speed Reading workshop completely changed how I process medical journals; I can now scan through extensive research papers in a fraction of the usual time.",
          context: "Mumbai",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "shailesh",
          qsrPageOnly: true,
          name: "Shailesh",
          program: "Quantum Speed Reading",
          programKey: "qsr",
          quote:
            "As a business owner, processing market reports and financial statements has become remarkably fast after attending this program.",
          context: "Ahmedabad · Business Owner",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "sudha",
          qsrPageOnly: true,
          name: "Sudha",
          program: "Quantum Speed Reading",
          programKey: "qsr",
          quote:
            "Initially skeptical, but the 30-day practice streak genuinely improved my focus and overall reading comprehension beyond expectations.",
          context: "Kolkata",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "vikram-malhotra",
          qsrPageOnly: true,
          name: "Vikram Malhotra",
          program: "Quantum Speed Reading",
          programKey: "qsr",
          quote:
            "The combination of live sessions and daily app practice helped me break through a lifelong reading plateau.",
          context: "Bengaluru",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "amit-patel",
          qsrPageOnly: true,
          name: "Amit Patel",
          program: "Quantum Speed Reading",
          programKey: "qsr",
          quote:
            "A profound mental reboot — my retention power skyrocketed, and I now finish thick management books in a single sitting.",
          context: "Surat",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "karan-mehra",
          qsrPageOnly: true,
          name: "Karan Mehra",
          program: "Quantum Speed Reading",
          programKey: "qsr",
          quote:
            "The mental clarity and speed I've gained through these 30 days have drastically cut down my study and preparation time.",
          context: "Jaipur",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "vikram-s",
          qsrPageOnly: false,
          name: "Vikram S.",
          program: "11-Day Online Retreat",
          programKey: "retreat",
          quote: "The Kundalini sessions alone were worth the entire eleven days.",
          context: "",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "priya-m",
          qsrPageOnly: false,
          name: "Priya M.",
          program: "Personal Class",
          programKey: "mentoring",
          quote: "Six private sessions did what years of general advice never managed.",
          context: "",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "rohan-k",
          qsrPageOnly: false,
          name: "Rohan K.",
          program: "Overthinking Mastery",
          programKey: "course",
          quote: "Twenty-one days, and the loop in my head finally went quiet.",
          context: "",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
      ],
    },
    faq: {
      eyebrow: "Before You Reach Out",
      title: "Questions people ask before starting",
      desc: "Straight answers to the things most people hesitate on. Still unsure? Message us directly below.",
      // Reordered to lead with Quantum Speed Reading (see the "Homepage,
      // QSR & Multi-City EEG Rewrite" task) — this used to open with 4
      // questions about Habit Builder's ₹99 pricing before QSR was
      // mentioned at all, which undercut the whole site's QSR-first
      // positioning right at the one section every hesitant visitor
      // actually reads. Habit Builder's pricing questions (free/₹99/
      // subscription) move to positions 8–10 — kept here rather than
      // duplicated onto /programs/habit-builder, which already has its
      // own dedicated HabitBuilderFaq covering the same ground.
      items: [
        {
          question: "Who is Quantum Speed Reading for?",
          answer:
            "Students, working professionals, and lifelong learners of every age who want to read, learn, and retain information faster — no prior speed-reading experience needed.",
        },
        {
          question: "I'm completely new to this — will it work for me?",
          answer:
            "Yes. Every program starts from zero. Quantum Speed Reading assumes no prior skill — Dr. Sharma has guided 10,000+ students from complete beginners to advanced practitioners since 2014.",
        },
        {
          question: "Is this hypnosis or some unscientific method?",
          answer:
            "No. This is cognitive training grounded in neuroscience — eye-movement retraining, breathing-based focus drills, and memory techniques. We track real progress using EEG, not claims. There's no hypnosis, no blindfold reading, no belief system required — it's trained the way you'd train any other cognitive skill.",
        },
        {
          question: "How much does the QSR Masterclass cost, and what's included?",
          answer:
            "The 30-Day Quantum Speed Reading Live Masterclass is ₹9,999, one-time — the full curriculum, 7 live sessions with Dr. Sharma, and app access throughout, backed by our 100% Results Guarantee for online students. We don't offer free access to the program itself, but you can watch the free training video or take our free 2-minute Reading Speed Test first. Graduates who want continued app practice afterward can continue for ₹499/month.",
        },
        {
          question: "How does the offline workshop + EEG testing work, and which cities is it in?",
          answer:
            "Our 2-Day Offline QSR Workshop adds live, in-person EEG testing to the same 30-day program: you register for your nearest city, attend 2 days in person for hands-on coaching and real EEG brain-state tracking, then continue the remaining sessions online at your own pace. Currently open in Mumbai, Pune, Vadodara, Surat, Ahmedabad, and Noida — exact batch dates are confirmed city by city, so most cities start on a waitlist until a date is locked, rather than a fixed 'register now' date we can't yet guarantee.",
        },
        {
          question: "What age group are these programs designed for?",
          answer:
            "Students, working professionals, and lifelong learners of every age go through these programs — from teenagers preparing for exams to retirees exploring meditation for the first time. Each track is paced to fit where you are.",
        },
        {
          question: "Which program should I start with?",
          answer:
            "If you specifically want to read and learn faster, start with Quantum Speed Reading — this site's flagship program. If you want the easiest, lowest-commitment way in first, start with the free 7 days of Quantum Mind & Habit Builder before QSR. If you're looking for deeper inner work, explore the Retreats or apply for 1-on-1 Mentoring.",
        },
        {
          question: "Is Quantum Mind & Habit Builder really free?",
          answer:
            "Yes — Days 1–7 are completely free, no card required to start. Day 8 onward is a single one-time payment of ₹99 to continue through Day 21.",
        },
        {
          question: "What happens after the 7-day free period?",
          answer:
            "You'll be asked to make the one-time ₹99 payment to keep going. Nothing charges automatically — you choose when, or whether, to continue.",
        },
        {
          question: "Is ₹99 a subscription?",
          answer: "No. ₹99 is a one-time payment to continue the full journey — there is no recurring charge at any point.",
        },
        {
          question: "Are the retreats online or residential?",
          answer:
            "Both. The 11-Day Online Meditation & Inner Mastery Retreat runs monthly from wherever you are; Residential Retreats in Rishikesh and Lonavala run 3–4 times a year in small groups for those who want the fully in-person format.",
        },
        {
          question: "How does 1-on-1 mentoring work?",
          answer:
            "Personal Class is private, custom-paced mentoring directly with Dr. Sharma — sessions are built entirely around your own goals and challenges, not a fixed curriculum. Apply to discuss fit and scheduling.",
        },
        {
          question: "Do I need to believe in anything specific — is this religious?",
          answer:
            "No particular belief system is required. The meditation and awareness work draws on breathwork and inner-awareness practices — you bring your own openness, we guide the method.",
        },
        {
          question: "What if I have a question this didn't answer?",
          answer: "Message Dr. Kapil's team directly on WhatsApp for a real, direct answer — no bots.",
        },
      ],
      ctaLabel: "Ask on WhatsApp",
    },
    whatsapp: {
      bubble: "Have questions about retreats or masterclasses? Chat directly with Dr. Kapil's team.",
      button: "Chat on WhatsApp",
      ariaLabel: "Chat with Dr. Kapil's team on WhatsApp",
    },
    footer: {
      blurb: "Quantum Speed Reading and advanced Meditation & Mind-Training under Dr. Kapil Dev Sharma.",
      columns: {
        programs: {
          heading: "Programs",
          links: [
            { label: "Quantum Speed Reading", href: "/programs/quantum-speed-reading" },
            { label: "Quantum Mindset & Habit Builder", href: "/programs/habit-builder" },
          ],
        },
        retreats: {
          heading: "Retreats",
          links: [
            { label: "Online 11-Day Retreat", href: "/retreats/online-11-day" },
            { label: "Residential Retreats", href: "/retreats/residential" },
          ],
        },
        mentoring: {
          heading: "Mentoring",
          links: [
            { label: "Personal Class (1-on-1)", href: "/mentoring/personal-class" },
            { label: "Overthinking Mastery", href: "/mentoring/overthinking-course" },
          ],
        },
        habitApp: {
          heading: "Quantum Mind App",
          links: [{ label: "Habit Builder — 7 Days Free, ₹99 One-Time", href: "/programs/habit-builder" }],
        },
        philosophy: {
          heading: "Dr. Kapil's Philosophy",
          links: [
            { label: "About Us", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Become a Partner", href: "/franchise-individual" },
          ],
        },
      },
      copyright: "© Mind Ur Mind. mindurmind.org.in",
      location: "Vadodara, Gujarat, India",
    },
    contactPage: {
      headline: "Get in Touch",
      sub: "Questions about a program, a payment, or just not sure where to start? Reach us directly.",
      emailLabel: "Email",
      whatsappLabel: "WhatsApp / Phone",
      addressLabel: "Address",
      address: "Gitanjali Duplex, Novino–Tarsali Road, Vadodara, Gujarat, India",
      responseTime: "We respond to all queries within 24 hours.",
      ctaPrimary: "Chat on WhatsApp",
      ctaSecondary: "Or email us at",
    },
    aboutPage: {
      headline: "About Mind Ur Mind",
      body: [
        "Mind Ur Mind was founded in 2014 by Dr. Kapil Dev Sharma, bringing together academic research and hands-on coaching into a single practice focused on how people read, think, and manage their own minds.",
        "What began as in-person workshops has grown into a full range of programs — Quantum Speed Reading, spiritual retreats, one-on-one mentoring, and the Quantum Mind app — while staying rooted in the same principle: real cognitive and personal change comes from structured, sustained practice, not quick fixes.",
        "Mind Ur Mind is a proprietorship led by Dr. Kapil Dev Sharma, based in Vadodara, Gujarat, and works with students, professionals, and lifelong learners across India.",
      ],
      stats: [
        { value: "10,000+", label: "Students Guided" },
        { value: "500+", label: "Workshops Delivered" },
        { value: "2014", label: "Founded" },
      ],
      guide: {
        eyebrow: "The Founder",
        title: "Dr. Kapil Dev Sharma",
        credential: "Professor · Researcher · Life Coach · 26 Years Experience",
        bio: "Dr. Kapil Dev Sharma brings 26 years of experience — 15 years as a professor and researcher in formal education, and 11 years as a life coach and mind trainer. That combination of academic rigour and direct coaching practice is what shapes how sessions are built.",
        stats: [
          { value: "26", label: "Years Total" },
          { value: "15", label: "Years Professor" },
          { value: "11", label: "Years Coaching" },
        ],
        quote:
          "Most people already know what they need to change. The harder work is understanding why they haven't — and building the conditions where that becomes possible.",
      },
    },
    qsrLanding: {
      hero: {
        eyebrow: "Science-Backed Advanced Neuro-Cognitive Transformation Program",
        headline: "For Students, Competitive Exam Aspirants & Parents —",
        headlineEm: "Science-Backed Quantum Speed Reading",
        sub: "Studying for hours but forgetting by the next day? This isn't about willpower — it's about how your brain reads.",
        ctaPrimary: "Watch the Free Training Now",
        ctaPrimaryMeta: "Free · Watch Anytime",
        // CTA restructure (see the "Homepage, QSR & Multi-City EEG
        // Rewrite" task) — primary is now the real, honestly-labeled
        // on-demand video (QsrFounderVideo, id="founder" — a genuine
        // short intro from Dr. Kapil, not inflated into a claimed
        // 45-minute walkthrough it isn't). Paid enrollment stays
        // secondary here (own price meta + checkout trust/guarantee
        // copy). The live Q&A session moved out of this hero entirely —
        // it already has its own dedicated section further down
        // (QsrLiveIntroSession) so it isn't lost, just not fighting for
        // hero-level space alongside two other CTAs. The 2-minute Speed
        // Test stays a plain tertiary text link below.
        ctaSecondary: "Secure Your Batch Spot",
        ctaSecondaryMeta: "₹9,999 · One-Time Enrollment",
        ctaTertiary: "Or take the free 2-minute Speed Test",
        trustLine: "For students, professionals, and lifelong learners of every age group.",
        visualCaption: "Your 30-Day Streak Starts Day 1",
      },
      speedTestCta: {
        afterScience: "Curious how fast you actually read? Try the free 2-minute test.",
        beforePricing: "Not ready to commit yet? Try the free 2-minute Reading Speed Test first — no card required.",
      },
      // "Who is this for?" audience strip (see the "Homepage & QSR
      // Conversion Rewrite" task) — 3 visual-confirmation cards directly
      // under the hero pain point, before any feature/metric content.
      // No deep-linked subsections exist yet for each audience, so these
      // currently just confirm "yes, this page is for you" rather than
      // jumping anywhere — simplest version to ship first, per the
      // task's own fallback instruction.
      whoIsThisFor: {
        title: "Who Is This For?",
        cards: [
          {
            title: "Competitive Exam Aspirant",
            desc: "UPSC, JEE, NEET, Banking — too much syllabus, too little time to revise it all.",
          },
          {
            title: "School Student",
            desc: "Hours of homework and textbook reading that still doesn't stick by test day.",
          },
          {
            title: "Working Professional",
            desc: "Reports, research, and reading piling up faster than you can get through them.",
          },
        ],
      },
      // Pain Points section (see the "Homepage & QSR Conversion Rewrite"
      // task) — two audiences, each in their own plain language, toggled
      // rather than both dumped on screen at once. Placed before
      // QsrBrainScience/QsrNeuroCognitiveScience's metrics content, per
      // the task's explicit ordering.
      painPoints: {
        eyebrow: "Sound Familiar?",
        title: "The Real Problem Isn't Effort",
        toggleSelf: "I'm learning for myself",
        toggleParent: "I'm looking into this for my child",
        self: {
          title: "For Competitive Exam Aspirants",
          items: [
            "Syllabus too large to revise in the time you have left",
            "Forgetting entire chapters by the time the test actually arrives",
            "Hours of study time that don't translate into proportional results",
            "Watching other aspirants seem to move faster than you",
            "Current affairs and long passages that take too long to get through",
          ],
        },
        parent: {
          title: "For Parents Evaluating This for Their Child",
          items: [
            "Your child studies for hours but retains very little of it",
            "Homework and school reading drag on, pushing bedtime later and later",
            "Screen time has visibly shortened their attention span",
            "Visible stress before exams because revision never finishes in time",
            "You're wary of \"hypnosis\" or unverified methods — you need to see this is actually evidence-based",
          ],
        },
      },
      trustBadge: {
        title: "Personally Confirmed, Not Automated",
        desc: "Every enrollment is confirmed by Dr. Kapil's own team within 24 hours of checkout — a real person, not a bot.",
        secondaryLine: "Secure checkout via Razorpay · 10,000+ students since 2014",
      },
      guarantee: {
        title: "100% Results Guaranteed for Online Students",
        desc: "Complete the full 30-day protocol as instructed — every app session, all 7 live masterclasses. If you do, and your reading speed and comprehension haven't measurably improved, tell us and we'll issue a full refund.",
        policyLabel: "See our Refund & Cancellation Policy",
        heroLine: "100% Results Guaranteed — complete the full 30-day protocol, or get a full refund.",
      },
      brainScience: {
        eyebrow: "The Science Behind It",
        title: "Why this works when other methods don't",
        desc: "Quantum Speed Reading isn't a trick — it retrains four specific cognitive systems most reading habits never touch.",
        cards: [
          {
            title: "Right-Brain Capabilities",
            desc: "Traditional reading leans almost entirely on the brain's language-processing side. This training brings the right hemisphere's parallel processing and pattern recognition into the process — so you absorb in parallel, not word by word.",
          },
          {
            title: "Visualization & Intuition",
            desc: "Once the right brain is engaged, information anchors as vivid mental imagery instead of abstract text. That's what makes it stick — and what most people mean when they say they finally \"see\" what they read.",
          },
          {
            title: "Peripheral Vision",
            desc: "Most readers only take in the handful of letters directly in their focal point. Widening your peripheral visual span lets your eyes capture whole phrases, sometimes whole lines, in a single fixation.",
          },
          {
            title: "Deep Concentration",
            desc: "None of the above holds without sustained, distraction-free focus. The same daily drills that build reading speed also train your ability to hold attention on one task for longer stretches.",
          },
        ],
      },
      // Science-Backed Neuro-Cognitive Positioning™ — the program's own
      // real, already-computed metrics (Brain Score, comprehension %,
      // daily-streak consistency — see practiceHistory.ts /
      // ThirtyDayCurriculumOverview.tsx) presented as clean typographic
      // stat callouts, never a chart or dashboard screenshot standing in
      // for real EEG data that doesn't exist for the online cohort.
      // Alpha/Theta are framed as the states the breathing/concentration
      // and visualization/memory drills are designed to help a student
      // access — a training target, not a per-session measured claim,
      // since only the Vadodara in-person track has physical EEG
      // hardware to actually verify brain state (see eeg below).
      neuroCognitive: {
        eyebrow: "Advanced Neuro-Cognitive Training",
        title: "A Science-Backed Neuro-Cognitive Transformation Program",
        desc: "This isn't just faster reading — it's structured training toward the brain states linked to deep focus and durable memory, with your own progress tracked on real cognitive metrics from Day 1.",
        metrics: [
          {
            label: "Brain Score",
            desc: "A composite score built from your real reading growth and comprehension data, tracked from your own Day 1 baseline.",
          },
          {
            label: "Comprehension %",
            desc: "How much of what you read you actually retain, scored every session — never speed reported without it.",
          },
          {
            label: "Consistency",
            desc: "Your daily practice streak — the single strongest real predictor of whether the training actually sticks.",
          },
        ],
        // "Normal Reading vs. Quantum Speed Reading" comparison (see the
        // "Homepage & QSR Conversion Rewrite" task) — replaces the
        // earlier plain "Trained Toward Two Brain States" alpha/theta
        // block with a fuller side-by-side, folding the same alpha/theta
        // framing into the "with QSR" column rather than dropping it.
        comparison: {
          title: "Normal Reading vs. Quantum Speed Reading",
          normal: {
            label: "Normal Reading — What's Happening Now",
            points: [
              "Eyes move in constant stop-start jumps (saccades) with frequent regressions — 10–15 stops per line",
              "Brain stays mostly in high-frequency Beta state — alert but effortful, fatigues quickly",
              "Left hemisphere does most of the work (language/word processing only) — the right hemisphere (pattern/image processing) stays mostly idle",
            ],
            result: "Result: slow speed, shallow retention, quick mental fatigue",
          },
          quantum: {
            label: "With Quantum Speed Reading",
            points: [
              "Eyes trained to move across wider visual spans (peripheral vision training) — fewer fixations and regressions",
              "Breathing and focus drills bring the brain into Alpha state (relaxed-alert); deeper practice produces short Theta bursts linked to memory consolidation",
              "Left and right hemispheres work together — words processed as language AND as visual/pattern information, improving hemispheric coordination",
            ],
            result: "Result: faster speed, deeper retention, less fatigue, and over time, stronger visual/photographic memory",
          },
          measuredNote: "How this is measured: the same Brain Score, comprehension %, and consistency tracking above — plus, if you join the Offline QSR + EEG Workshop in your city, real physical EEG brain mapping in person (see below).",
          notHypnosisLine: "This is not hypnosis, not blindfold reading, and not any supernatural claim. It's cognitive training — the same way you'd train a muscle at the gym.",
          researchNote: "Research-aligned: saccadic eye movement and alpha/theta memory consolidation are established neuroscience concepts, named here as design targets — not proprietary claims or linked studies.",
        },
        disclaimer: "Brain-state framing describes the design intent of these drills, not a per-session measured guarantee for online students — see the Vadodara EEG track below for hardware-verified sessions.",
      },
      appPreview: {
        eyebrow: "Inside the App",
        title: "What your daily drill actually looks like",
        desc: "Every day of the 30-day streak opens the same way — a short, focused session the app tracks automatically.",
        drillLabel: "Today's Drill",
        drillValue: "Peripheral Expansion",
        stats: [
          { label: "Session Length", value: "~10 min" },
          { label: "Current WPM", value: "412" },
          { label: "Comprehension", value: "91%" },
        ],
        caption: "Example preview — your real numbers start from your own Day 1 baseline.",
      },
      ageGroups: {
        eyebrow: "Built For Every Age",
        title: "One Masterclass, Tailored for Every Age Group",
        desc: "The same core training, expressed through two real, verified pathways — because a child and a working professional don't learn the same way, and this program doesn't ask them to.",
        pathways: [
          {
            title: "For Children",
            tag: "High Neuroplasticity",
            desc: "Younger minds have exceptional neuroplasticity — the raw capacity to build new visual and cognitive pathways quickly. With guided training, many children develop rapid peripheral vision and pattern-recognition skills well beyond their starting point — you can see these sessions in our student video reviews.",
          },
          {
            title: "For Adults & Professionals",
            tag: "Rapid Open-Eye Reading",
            desc: "Working professionals bring sharpened focus and reading discipline built up over years — a real foundation the training builds on directly. With guided practice, most adults develop rapid, open-eye peripheral reading, taking in full lines and pages at high speed, so a full book is finished in a fraction of the usual time.",
          },
        ],
        unifyingLine:
          "Different expression, same underlying training: peripheral vision, deep concentration, and right-brain engagement — every skill covered in \"The Science Behind It\" above. Whichever path a student takes, that's what they're building.",
        ctaLabel: "Watch Real Student Videos",
      },
      authority: {
        // TODO(Dr. Sharma): the "10,000+ students" figure appears
        // sitewide (this card, QSR hero credentials/stat/secondaryLine,
        // the QSR FAQ, homepage meta description, the franchise page,
        // and both retreat/residential pages — see the "QSR Page Cleanup
        // & Credibility Fixes" task, Fix 5, for the full list) as a
        // specific, checkable statistic. Please confirm it's accurate
        // before it stays live; if not verified, it should be replaced
        // or softened per the site's existing "no fabricated statistics"
        // standard. Also note a real internal inconsistency sitting in
        // this exact card list: "India's First QSR Pioneer (Since 2015)"
        // right next to "Conducting live teaching workshops since 2014"
        // below — two different start years for what reads like the
        // same claim. Please confirm which year is correct.
        eyebrow: "Direct From The Source",
        title: "Learn From The Person Who Brought QSR To India",
        desc: "Not a licensed instructor teaching someone else's system — the person who introduced it.",
        cards: [
          {
            title: "English Professor (15+ Years Experience)",
            desc: "15+ years of academic teaching experience in English.",
          },
          {
            title: "India's First QSR Pioneer (Since 2015)",
            desc: "Introduced Quantum Speed Reading to India — the origin point for the method taught in this Masterclass.",
          },
          {
            title: "10,000+ Students Guided",
            desc: "Personally guided thousands of students from complete beginners to advanced practitioners.",
          },
          {
            title: "500+ Workshops Delivered",
            desc: "Conducting live teaching workshops since 2014, across schools, colleges, and corporate audiences.",
          },
        ],
      },
      credibilityStrip: {
        label: "Trusted By Learners From",
        placeholderStatement: "Workshops delivered across [CITY LIST NEEDED — confirm real cities/count]",
        citiesHeadlinePrefix: "Workshops delivered across",
        citiesHeadlineSuffix: "cities in India",
      },
      founderVideo: {
        eyebrow: "From Dr. Kapil, Directly",
        title: "Why Quantum Speed Reading is different",
        desc: "A short introduction from Dr. Kapil Dev Sharma — an English Professor with 15+ years of teaching experience, and India's first QSR pioneer, who introduced Quantum Speed Reading to the country in 2015. You're learning directly from the originator of the method, not a licensed instructor teaching someone else's system.",
        placeholderLabel: "Video coming soon",
        ctaLabel: "Ask a Question Instead",
        videoTitle: "Quantum Speed Reading Introduction",
      },
      liveIntroSession: {
        eyebrow: "Free · 45 Minutes · Live",
        title: "Reserve Your Spot — Live Q&A with Dr. Kapil",
        desc: "One real Quantum Speed Reading technique, taught live, plus open Q&A — a genuinely free session, not free access to the 30-day program itself, and not a recording. If it clicks, you'll get a straightforward invite to join a paid batch afterward — no pressure either way.",
        ctaLabel: "Reserve Your Spot",
      },
      videoTestimonials: {
        eyebrow: "Watch Real Students",
        title: "200+ video reviews, not paid actors",
        desc: "Every video in this playlist is a real student, filmed after finishing the program — unscripted.",
        moreLabel: "More Real Quantum Speed Reading Students",
        watchLabel: "Watch Video",
        adultsLabel: "Adults",
        youngLearnersLabel: "Young Learners",
        watchMoreVideosLabel: "Watch More Student Stories",
        watchFewerVideosLabel: "Show Fewer",
      },
      mechanics: {
        eyebrow: "How It Works",
        title: "Two systems, one transformation",
        desc: "A daily app streak that trains the skill, and live sessions that install the mindset behind it.",
        app: {
          tag: "Daily · In the App",
          title: "The 30-Day App Streak",
          desc: "Progressive cognitive drills you do at your own pace, every day, right inside the Quantum Mind app.",
          bullets: [
            "WPM (words-per-minute) tracked every session, not just once",
            "Comprehension scored alongside speed — never one without the other",
            "Progressive difficulty — Day 30 asks more of you than Day 1",
            "Every completed day stays open — practice it again anytime",
            "About 10 minutes a day",
          ],
        },
        live: {
          tag: "Weekly · Live with Dr. Sharma",
          title: "The 7 Live Masterclasses",
          desc: "Interactive sessions across the 30 days where Dr. Sharma personally walks you through the technique in real time.",
          bullets: [
            "Right-brain visual reading, taught live, not pre-recorded",
            "Direct Q&A — ask about your own specific sticking point",
            "Group accountability with your live batch cohort",
            "Recordings available if you miss a session",
          ],
        },
      },
      moreThanSpeed: {
        eyebrow: "Beyond Reading Speed",
        title: "More Than Just Speed",
        goalSetting: {
          tag: "Day 1",
          title: "Goal-Setting",
          desc: "On Day 1, every student sets personal reading and learning goals with their trainer — creating ownership from day one.",
        },
        memoryTechniques: {
          tag: "Practical Skills",
          title: "Practical Memory Techniques",
          desc: "Beyond reading speed, students learn real-world memory tools — the Memory Palace, the Peg System, and Acronym techniques — skills they can demonstrate immediately.",
        },
      },
      focusInDistractedWorld: {
        eyebrow: "Screen Time & Focus",
        title: "Building Focus in a Distracted World",
        intro: "Many parents worry about screen time affecting their child's focus and reading habits. This program includes practical screen-management guidance alongside the reading training.",
        tips: [
          {
            title: "Posture & Eye-Care",
            desc: "Simple tips to protect posture and reduce eye strain during long reading sessions.",
          },
          {
            title: "The 20-20-20 Rule",
            desc: "Every 20 minutes, look at something 20 feet away for 20 seconds.",
          },
          {
            title: "Digital Detox Habits",
            desc: "Simple habits — like keeping the phone away for 10 minutes before practice.",
          },
        ],
      },
      documentMastery: {
        // Judgment call (see the "QSR Page Cleanup & Credibility Fixes"
        // task, Fix 3): reframed from a 5-screenshot promotional showcase
        // (its own primary image + 4 supporting images) down to a single
        // compact "what's included" list — see QsrDocumentMastery.tsx.
        // Deliberately NOT claiming this is free/included with the
        // ₹9,999 enrollment: the app's real pricing page
        // (PricingPlansGrid.tsx) shows this Document Studio feature has
        // its own separate ₹399–₹699/month subscription tiers, a fact
        // this rewritten copy avoids contradicting rather than guessing
        // at the real relationship between Masterclass enrollment and
        // Document Studio access.
        eyebrow: "Also In The App",
        title: "The AI Document Studio",
        desc: "The same AI-powered Document Studio available inside the Quantum Mind app — upload any PDF, textbook, or research paper and get speed-reading drills, mind maps, and revision notes built from it.",
        items: [
          {
            title: "Upload & Learn",
            desc: "Drop in any PDF or textbook — no manual formatting or setup needed.",
          },
          {
            title: "AI-Generated Drills",
            desc: "Your own material becomes real Quantum Speed Reading practice, not generic sample text.",
          },
          {
            title: "Visual Knowledge Maps",
            desc: "See how the ideas in your document actually connect, at a glance.",
          },
          {
            title: "Key Concept Extraction",
            desc: "The core ideas pulled out automatically, so you know what actually matters.",
          },
          {
            title: "Memory & Revision Notes",
            desc: "Built-in notes designed for review later — not just a one-time read.",
          },
        ],
      },
      curriculum: {
        eyebrow: "The Curriculum",
        title: "What the 30 days actually look like",
        desc: "Four structured phases. Each one builds directly on the last — nothing here is optional filler.",
        weeks: [
          {
            range: "Days 1–7",
            title: "Breaking Ocular Fixation",
            desc: "Retrain how your eyes physically move across a page — expanding peripheral vision and eliminating the stop-start fixation habit that caps most readers under 250 WPM.",
          },
          {
            range: "Days 8–14",
            title: "Bypassing Sub-Vocalization",
            desc: "Interrupt the inner voice that silently narrates every word as you read. This single shift is usually where your reading speed jumps the most.",
          },
          {
            range: "Days 15–21",
            title: "Photographic Memory Anchoring",
            desc: "Layer in visual and multi-sensory memory techniques so what you read fast, you also retain — full-page and multi-layer data intake.",
          },
          {
            range: "Days 22–30",
            title: "Full-Book Synthesis & Mastery",
            desc: "Apply everything to a real, full-length book, speed-test your final numbers, and complete your Mastery Certification.",
          },
        ],
      },
      examBenefits: {
        eyebrow: "Subject By Subject",
        title: "How QSR Helps You, Subject by Subject",
        cards: [
          {
            title: "UPSC / Banking / Government Exam Aspirants",
            desc: "Cover the same current-affairs and editorial volume in half the time, freeing up hours for revision cycles.",
          },
          {
            title: "JEE / NEET Aspirants",
            desc: "Retain diagrams, formulas, and long theory chapters faster through visual encoding, leaving more time for mock tests.",
          },
          {
            title: "School Students (Board Exams)",
            desc: "Turn long descriptive chapters into structured mental maps instead of rote memorization, for faster, more durable recall.",
          },
        ],
      },
      // Positioning fix — this used to open with a "Three kinds of people
      // take this Masterclass" 3-persona grid (Students/Professionals/
      // Lifelong Learners), which diluted the ICP by trying to speak to
      // everyone equally. Removed: real testimonials elsewhere on this
      // page already show who this is for (a business owner, a doctor,
      // students) without a dedicated multi-persona pitch, and the
      // homepage/hero already lead with students & exam aspirants as the
      // primary audience. What's left is the one piece of this section
      // that was never about persona-spreading — concrete, day-to-day
      // parent-facing outcomes — now flattened to one level instead of
      // nested under a `parentSection` key that no longer needs to share
      // space with anything else. The fourth item (a monthly parent-child
      // reading activity) moved here from the removed AllRoundDevelopment
      // section's "Family Bonding" card — same real detail, just no
      // longer pitched as a fourth equal "pillar" of the program.
      audience: {
        eyebrow: "For Parents",
        title: "What Changes Day to Day",
        items: [
          "Homework and reading sessions that used to drag on start finishing faster",
          "Your child sees a book through instead of abandoning it midway",
          "Less last-minute panic before exams, because syllabus gets covered on schedule",
          "A monthly parent-child reading activity, built into the program",
        ],
      },
      faq: {
        eyebrow: "Before You Enroll",
        title: "Questions people ask before Day 1",
        items: [
          {
            question: "Is this hard for a complete beginner?",
            answer:
              "No. The 30-day structure assumes zero prior skill and starts from your true baseline — Dr. Sharma has guided 10,000+ students through it since 2014, most of them starting as complete beginners.",
          },
          {
            question: "What's the time commitment per day?",
            answer:
              "About 10 minutes a day inside the app, plus one live masterclass session a week with Dr. Sharma. It's designed to fit around a full-time job or study schedule, not compete with it.",
          },
          {
            question: "Does this work for every age group?",
            answer:
              "Yes — students preparing for exams, working professionals, and lifelong learners of every age have all completed this Masterclass. The pace adapts to where you're starting from.",
          },
          {
            question: "Is any of this actually free?",
            answer:
              "The Masterclass itself is a fully paid, result-oriented program — ₹9,999 one-time for the full 30-day curriculum, all 7 live sessions with Dr. Sharma, and app access throughout. We don't offer free access to the program, because neither the app alone nor the live sessions alone deliver the result — they're built to work together. What is free: our 2-minute Reading Speed Test, and our free 45-minute live intro session with Dr. Sharma — see below.",
          },
          {
            question: "What exactly do I get for ₹9,999?",
            answer:
              "The full 30-day progressive app curriculum, all 7 live masterclass sessions with Dr. Sharma, WPM & comprehension tracking throughout, and app access for the full 30 days — a one-time enrollment, not a subscription. Once you finish the program, continued app practice is a separate ₹499/month option if you want it.",
          },
          {
            question: "What if it doesn't work for me?",
            answer:
              "You're backed by our 100% Results Guarantee for online students: complete the full 30-day protocol as instructed — every app session, all 7 live masterclasses — and if your reading speed and comprehension haven't measurably improved, tell us and we'll issue a full refund. See our Refund & Cancellation Policy for the full terms.",
          },
          {
            question: "What happens right after I pay?",
            answer:
              "Enrollment is confirmed personally by Dr. Kapil's team, not an automated system — you'll hear from us with your batch schedule shortly after checkout.",
          },
          {
            question: "What if I have a question this didn't answer?",
            answer: "Message Dr. Kapil's team directly on WhatsApp before you enroll — a real person, not a bot.",
          },
          {
            question: "Is this hypnosis or some unscientific method?",
            answer:
              "No. Quantum Speed Reading is cognitive training grounded in neuroscience — peripheral vision training, breathing/focus drills, and memory-anchoring techniques — with your progress measured on real Brain Score, comprehension, and consistency metrics (and, for Vadodara students, actual EEG brain mapping). It is not hypnosis, not blindfold reading, and not any pseudoscientific technique.",
          },
        ],
        ctaLabel: "Ask on WhatsApp",
      },
      finalCta: {
        eyebrow: "Ready When You Are",
        title: "Your 30 Days Start With One Decision",
        desc: "Enrollment is confirmed personally by Dr. Kapil's own team, not an automated system.",
        cta: "Secure Your Batch Spot",
        ctaMeta: "₹9,999 · One-Time Enrollment",
        batchNoticeLabel: "Next Batch Starts",
        cadenceLine: "New batches begin twice a month — the 7th and the 25th.",
        structureLine: "7 live classes across your 30 days · daily practice through the app",
      },
      stickyBar: {
        text: "30-Day Quantum Speed Reading Masterclass",
        price: "₹9,999 · One-Time",
        cta: "Secure Your Batch Spot",
      },
      whatsapp: {
        bubble: "Have questions about the QSR batch? Chat with Dr. Kapil's team instantly.",
        button: "Chat on WhatsApp",
        ariaLabel: "Chat with Dr. Kapil's team on WhatsApp about the Quantum Speed Reading Masterclass",
      },
      // Bright, distinct card promoting the Mumbai in-person workshop
      // (see the "Build the Mumbai Offline Workshop Feature + Fix EEG
      // Copy" task, Part 3) — replaces the earlier plain text-link
      // banner. Deliberately worded as a complementary option ("also
      // available"), not a competing primary offer.
      mumbaiWorkshopCard: {
        badge: "New · Pilot Batch",
        title: "Also Available: Live, In-Person in Mumbai",
        desc: "A 2-day in-person extension of this Masterclass — live coaching from Dr. Kapil Dev Sharma, a Cognitive & Focus Engagement Demo, and the same ₹9,999 price.",
        meta: "Mumbai · 2 Days · ₹9,999 · Limited Seats",
        cta: "Explore the Mumbai Workshop",
      },
    },
    // Mumbai In-Person Workshop™ — a hybrid extension of the QSR 30-Day
    // Masterclass: a live, 2-day, in-person kickoff in Mumbai (Cognitive
    // & Focus Engagement Demo, in-person coaching, WPM + retention
    // measured across an overnight gap), after which the same app
    // curriculum as the online track continues. Deliberately its own
    // i18n block (not folded into qsrLanding) since it's a distinct page
    // with its own nav/sticky bar/WhatsApp widget, mirroring the
    // retreatLanding/residentialLanding pattern for a dedicated landing
    // page. EEG language throughout is deliberately "Cognitive & Focus
    // Engagement Demo" (see the "Build the Mumbai Offline Workshop
    // Feature + Fix EEG Copy" task, Fix A, for why this exact term was
    // chosen over "Attention & Focus Engagement Snapshot," used in an
    // earlier pass), never "brain test," "brain mapping," or
    // "diagnostic" — an explicit, non-negotiable framing rule for this
    // page (contrast with qsrLanding.neuroCognitive.eeg above, which
    // predates this rule and describes a different, hardware-verified
    // Vadodara offering in clinical language — that section is out of
    // scope and was left untouched, but the inconsistency is worth a
    // look).
    qsrMumbaiLanding: {
      hero: {
        eyebrow: "Live, In-Person · Mumbai · Pilot Batch",
        headline: "Read 5x Faster.",
        headlineEm: "Live, In Person, in Mumbai.",
        sub: "A 2-day, in-person extension of the 30-Day Quantum Speed Reading Masterclass — live coaching from Dr. Kapil Dev Sharma, a real-time cognitive & focus engagement demo, and your reading speed measured on Day 1 and again on Day 2, after an overnight gap. The remaining 28 days then continue through the same app as our online track.",
        ctaPrimary: "Reserve a Pilot Batch Seat",
        ctaPrimaryMeta: "₹9,999 · Same Price as the Online Masterclass",
        ctaSecondary: "See the 2-Day Schedule",
        badge: "2-Day Live Event",
      },
      whatsDifferent: {
        eyebrow: "In-Person vs. Online",
        title: "What's Different From the Online Program",
        items: [
          {
            title: "A Live Cognitive & Focus Engagement Demo",
            desc: "A short, in-person cognitive & focus engagement demo using a Muse 2 headband on Day 1 — see below for exactly what this is, and isn't.",
          },
          {
            title: "In-Person Coaching From Dr. Kapil Dev Sharma",
            desc: "Live, face-to-face technique correction across both days — not a video call.",
          },
          {
            title: "Reading Speed Measured Twice, a Night Apart",
            desc: "An initial WPM reading on Day 1, then a final WPM and retention check on Day 2 — after a real overnight gap, not back-to-back.",
          },
          {
            title: "Then the Same App-Based Curriculum",
            desc: "After the 2-day event, the remaining 28 days continue through the same Quantum Speed Reading app our online students use — no separate, disconnected track.",
          },
        ],
      },
      schedule: {
        eyebrow: "The 2 Days",
        title: "How the Workshop Runs",
        day1: {
          label: "Day 1 · Saturday",
          title: "Baseline & Technique",
          items: [
            "Cognitive & focus engagement demo (Muse 2 headband)",
            "Core Quantum Speed Reading technique, taught live",
            "First guided practice session",
            "Initial reading speed (WPM) measurement",
          ],
        },
        day2: {
          label: "Day 2 · Sunday",
          title: "Practice & Results",
          items: [
            "Further guided practice",
            "Final WPM and retention measurement",
            "Certificate of completion",
            "Optional video testimonial recording",
          ],
        },
        overnightCallout: {
          title: "Why Two Days, Not One?",
          desc: "Retention is measured after a full night's sleep, not in the same session it was taught in — sleep-based consolidation is part of how the technique is designed to stick, so the gap between Day 1 and Day 2 is a deliberate design choice, not a scheduling convenience.",
        },
      },
      venue: {
        eyebrow: "Venue & Batch",
        title: "Mumbai · Pilot Batch",
        venueLine: "[Venue name & address to be confirmed — Powai or Bandra West area]",
        dateLine: "[Exact dates to be confirmed]",
        timeLine: "[Timings to be confirmed]",
        pilotNote: "This is our first in-person batch in this format — seats are genuinely limited, and we're keeping it small on purpose. Batches are grouped by age (a younger group and an older/adult group run separately, not mixed), for delivery quality.",
      },
      eegDemo: {
        eyebrow: "Day 1",
        title: "Cognitive & Focus Engagement Demo",
        desc: "On Day 1, we use a Muse 2 headband to give you a live, real-time demo of your cognitive focus and engagement while you practice — a way to see the training happening, not just take our word for it.",
        disclaimer: "This is a live engagement demo tool, not a diagnostic or medical device. It does not produce a clinical brain report, and it isn't a substitute for any medical or neurological assessment.",
        addOn: {
          title: "Optional: A Detailed Personal Engagement Report",
          desc: "For those who want it, a more detailed personal engagement report based on your session is available as a paid add-on.",
          pricePlaceholder: "[Add-on price to be confirmed]",
        },
      },
      pricing: {
        title: "₹9,999",
        priceNote: "One-time — same price as the online Masterclass. Includes both days in Mumbai plus the full 30-day app curriculum that follows.",
        addOnNote: "The personal engagement report above is a separate, optional add-on.",
        cta: "Reserve a Pilot Batch Seat",
      },
      faq: {
        eyebrow: "Questions",
        title: "Before You Reserve a Seat",
        items: [
          {
            question: "How is this different from the online program?",
            answer: "The curriculum is the same 30-day program. This adds a live, in-person 2-day kickoff in Mumbai — a face-to-face session with Dr. Kapil Dev Sharma, a live cognitive & focus engagement demo, and reading speed measured on both days with an overnight gap in between. After Day 2, you continue on the same app the online track uses.",
          },
          {
            question: "What does the EEG device do — is it a medical test?",
            answer: "No. It's a live cognitive & focus engagement demo using a Muse 2 headband, meant to show your focus during practice in real time. It is not a diagnostic or medical device, and it does not produce a clinical or medical brain report.",
          },
          {
            question: "What if my child can only attend one day, not both?",
            answer: "The two days are designed to build on each other — Day 1 teaches the technique and takes a baseline, Day 2 measures real retention after an overnight gap. We'd strongly recommend attending both. [Exact policy for partial attendance to be confirmed.]",
          },
          {
            question: "How does the rest of the 30-day program continue after the 2 days?",
            answer: "After the in-person weekend, you continue through the same Quantum Speed Reading app used by our online students, for the remainder of the 30-day curriculum.",
          },
          {
            question: "Is this for children of all ages?",
            answer: "Yes — but we run separate batches by age group (a younger group and an older/adult group) rather than mixing all ages in one session, so the pace and delivery suit each group properly.",
          },
          {
            question: "What's the refund policy for the in-person workshop?",
            answer: "[Refund & cancellation terms for the in-person format are pending confirmation before this page goes live — the online program's refund policy is WPM-improvement-based and may not translate directly to a 2-day in-person event.]",
          },
        ],
        ctaLabel: "Ask on WhatsApp",
      },
      testimonialsPlaceholder: {
        eyebrow: "Social Proof",
        title: "Real Stories, Coming After the Pilot Batch",
        desc: "This is our first in-person batch in this format. We'll add real video testimonials from Mumbai participants here after the pilot batch runs — nothing fabricated in the meantime.",
      },
      stickyBar: {
        text: "Mumbai Workshop · 2-Day Pilot Batch",
        price: "₹9,999 · One-Time",
        cta: "Reserve a Seat",
      },
      whatsapp: {
        bubble: "Have questions about the Mumbai workshop? Chat with Dr. Kapil's team instantly.",
        button: "Chat on WhatsApp",
        ariaLabel: "Chat with Dr. Kapil's team on WhatsApp about the Mumbai in-person workshop",
      },
    },
    habitBuilderLanding: {
      hero: {
        eyebrow: "21-Day Guided Program",
        headline: "Build a Real Reading Habit in 21 Days",
        headlineEm: "A short daily practice — not a personality overhaul, not a subscription trap.",
        sub: "A guided, day-by-day program that pairs your Quantum Speed Reading practice with focus and memory exercises — one short session a day, for 21 real days.",
        ctaPrimary: "Start Free — 7 Days, No Payment Required",
        navCta: "Start Free",
        ctaPrimaryMeta: "No card required to start",
        pricingLine: "Free for Days 1–7. Then a one-time payment of ₹99 to continue through Day 21 — never a subscription.",
      },
      benefits: {
        eyebrow: "What's Inside",
        title: "Built to actually keep you coming back",
        items: [
          {
            title: "Daily Streak Tracking",
            desc: "A real streak counter tracks the days you show up — visible on your dashboard from Day 1.",
          },
          {
            title: "Day 1 Baseline Diagnostic",
            desc: "A short reading assessment on Day 1 sets your real starting point, so every day after measures genuine growth against it.",
          },
          {
            title: "AI Coach Briefings",
            desc: "Every day opens with a short, personalized note referencing your own last session — not a generic reminder.",
          },
          {
            title: "Day 21 Certificate & Celebration",
            desc: "Finish all 21 real days and unlock a downloadable, personalized completion certificate showing your actual Day 1-to-Day 21 growth.",
          },
        ],
      },
      howItWorks: {
        eyebrow: "How It Works",
        title: "Three weeks, one real structure",
        weeks: [
          {
            range: "Days 1–7",
            title: "Foundation & Brain Gym",
            desc: "Eye-movement and focus drills, plus a mandatory 2-minute breathing warm-up to build the habit.",
          },
          {
            range: "Days 8–14",
            title: "Expansion & Visualisation",
            desc: "Memory and visualisation exercises build on the foundation from Week 1.",
          },
          {
            range: "Days 15–21",
            title: "Advanced Quantum Flow & Intuition",
            desc: "The most advanced exercises in the program, building toward your Day 21 finale.",
          },
        ],
        dayShapeTitle: "Every day follows the same real shape",
        dayShapeSteps: [
          "A short warm-up exercise",
          "A second focus or memory exercise",
          "A reading practice session",
          "A quick retention check",
        ],
      },
      pricing: {
        eyebrow: "Pricing",
        title: "Simple, honest pricing",
        freeCard: {
          label: "Days 1–7",
          price: "Free",
          desc: "The full first week, no payment required, no card on file.",
        },
        paidCard: {
          label: "Days 8–21",
          price: "₹99",
          priceNote: "one-time payment — not a subscription",
          desc: "Pay once to continue the remaining two weeks through your Day 21 finale.",
        },
        cta: "Start Free — Day 1",
      },
      faq: {
        eyebrow: "Questions",
        title: "Frequently Asked Questions",
        items: [
          {
            question: "Is this a subscription?",
            answer: "No. Days 1–7 are completely free. Day 8 onward is a single one-time payment of ₹99 — there is no recurring charge at any point.",
          },
          {
            question: "What happens after the free 7 days?",
            answer: "You'll be asked to make the one-time ₹99 payment to keep going. Nothing charges automatically — you choose when (or whether) to continue.",
          },
          {
            question: "What if I miss a day — do I lose my progress?",
            answer: "Your streak resets if you miss a full day, but your actual progress doesn't — you pick up on the next day, not back at Day 1.",
          },
          {
            question: "Do I need any special app or equipment?",
            answer: "No — just this website, from your phone or computer. A few minutes a day is all it takes.",
          },
          {
            question: "What do I get at the end?",
            answer: "Complete all 21 real days and you'll unlock a downloadable, personalized completion certificate showing your real Day 1-to-Day 21 growth.",
          },
        ],
        ctaLabel: "Ask on WhatsApp",
      },
    },
    retreatLanding: {
      hero: {
        eyebrow: "Online · Since 2014 · Small Cohort",
        headline: "Awaken Your Higher Mind",
        headlineEm: "The 11-Day Online Meditation & Inner Mastery Retreat",
        sub: "Not another meditation app that leaves you exactly where you started. An intensive, live, 11-day journey into authentic Kriya Yoga, Prana, and cosmic energy — guided nightly by Dr. Kapil Dev Sharma, personally teaching this path since 2014.",
        ctaPrimary: "Secure Your Retreat Spot",
        ctaPrimaryMeta: "Secure Checkout via Razorpay",
        ctaSecondary: "See the 11-Day Curriculum",
        ctaTertiary: "Not ready to book? Watch real student stories first",
        trustLine: "For burnt-out professionals, chronic overthinkers, and real spiritual seekers — tired of theory, ready for a tangible inner experience.",
        visualPlaceholderLabel: "Retreat Introduction — Coming Soon",
      },
      coreProblem: {
        eyebrow: "Why Meditation Apps Don't Work",
        title: "Your mind isn't broken. It's untrained — and undernourished.",
        desc: "You've tried the apps. The breathing exercises. The ten-minute guided sessions with rain sounds. The loop in your head is still there five minutes later.",
        painPoints: [
          "A ten-minute recording can help in the moment. This is eleven nights of sustained, live practice — real depth, not a loop you replay.",
          "You don't need another relaxation technique. You need contact with something real — your own life force, not a distraction from its absence.",
          "Every app promises calm. Almost none explain what's actually happening inside you, or give you a real method to change it.",
        ],
        solution:
          "This retreat isn't built on modern wellness trends. It's rooted in Kriya Yoga — a real, centuries-old discipline for working directly with Prana, your own life force, through cosmic energy and cosmic fusion, not just your attention span. What you practice for 11 nights produces a felt, physical shift, not five quieter minutes.",
      },
      schedule: {
        eyebrow: "Batch Schedule",
        title: "Reserve Your Spot in the Next Batch",
        desc: "A new batch begins on the 10th of every month and runs for 11 days — the same daily window for everyone in that batch.",
        durationLabel: "Duration",
        durationValue: "11 Days · Day 10 – Day 20",
        cadenceLabel: "Batch Cadence",
        cadenceValue: "Monthly, Online",
        timingLabel: "Daily Live Session",
        timingValue: "7:30 PM – 10:30 PM",
        nextBatchLabel: "Next Batch",
        cta: "Secure Your Retreat Spot",
        ctaMeta: "Secure Checkout via Razorpay",
        badges: [
          { title: "Secure Payment", desc: "Checkout is handled by Razorpay, a trusted payment gateway." },
          { title: "Personally Confirmed", desc: "A real person on Dr. Kapil's team confirms your batch and schedule — not a bot." },
          { title: "Small Cohort", desc: "Each batch is kept deliberately small — limited enrollment, not a mass webinar." },
        ],
      },
      disciplines: {
        eyebrow: "What You Will Master",
        title: "Six disciplines, one 11-day journey",
        desc: "Each night builds on the last, guided live by Dr. Sharma — never a theory you read about, always a practice you feel.",
        items: [
          {
            title: "Telepathy Send & Receive",
            desc: "Experience silent, direct mind-to-mind resonance — a depth of connection words were never built to carry.",
          },
          {
            title: "Aura Scanning & Reading",
            desc: "Learn to perceive the energy fields around you, protect your own, and read what people's words don't say.",
          },
          {
            title: "Samadhi Meditation",
            desc: "Quiet the mental loops that won't switch off, and touch a stillness underneath them that's been there the whole time.",
          },
          {
            title: "Chakra Activation & Enlightenment",
            desc: "Clear energetic blockages you've carried for years, and let real vitality — not caffeine, not willpower — move through your body again.",
          },
          {
            title: "Kundalini Meditation",
            desc: "Safely awaken the dormant energy at the base of your spine, and let it move you, not shake you.",
          },
          {
            title: "Astral Projection",
            desc: "Step beyond the edges of the physical plane — and come back changed by what you find there.",
          },
        ],
      },
      authority: {
        eyebrow: "A Decade Of Practice, Not A Trend",
        title: "Guided by the same teacher, for over a decade",
        desc: "Real years, real students, real reviews — not a program that launched last quarter.",
        cards: [
          {
            title: "Teaching Since 2014",
            desc: "12+ years personally guiding students through this exact path — not a recently-launched program chasing a trend.",
          },
          {
            title: "150+ Real Student Reviews",
            desc: "Written and video reviews from real participants, not stock footage or paid actors.",
          },
          {
            title: "Small Cohort, Every Batch",
            desc: "Every batch is kept deliberately small so Dr. Sharma can actually guide you, not lecture at a crowd.",
          },
          {
            title: "Personally Led, Every Night",
            desc: "Not pre-recorded, not delegated to an assistant instructor — Dr. Sharma, live, all 11 nights.",
          },
        ],
      },
      liveStructure: {
        eyebrow: "How The 11 Nights Work",
        title: "Live guidance, not a pre-recorded course",
        desc: "Every one of the 11 nights, 7:30 PM to 10:30 PM, you're live with Dr. Sharma — not a video library you work through whenever it's convenient.",
        points: [
          {
            title: "Nightly Live Session",
            desc: "A live guided session with Dr. Sharma every night of the retreat, 7:30 PM – 10:30 PM — real-time, not pre-recorded.",
          },
          {
            title: "Interactive Practice",
            desc: "Structured practice time for that day's discipline, with direct feedback instead of a checklist to self-grade.",
          },
          {
            title: "Direct Mentorship",
            desc: "Questions answered directly by Dr. Sharma during the retreat, not routed through a support ticket.",
          },
        ],
      },
      outcomes: {
        eyebrow: "After The 11 Nights",
        title: "What changes when the retreat ends",
        items: [
          "The mental loops finally go quiet — not suppressed, resolved",
          "A felt sense of your own energy, not just an idea of it",
          "Real emotional steadiness under the pressure that used to flatten you",
          "A lasting shift in how you experience your own mind — not an 11-day high that fades by day 12",
        ],
      },
      gallery: {
        eyebrow: "Inside the Retreat",
        title: "What the live sessions actually look like",
        desc: "Real screenshots and moments from past batches — photos dropped in as each batch happens.",
        viewGalleryCta: "View Full Gallery",
      },
      freeMeditation: {
        eyebrow: "Try It First, Free",
        title: "A free practice before you commit",
        desc: "Three short, guided relaxation and breathing practices — no signup required. See how the pacing feels before you decide on the full 11 nights.",
        videoCaption: "A guided relaxation practice many people find deeply calming. Press play — no signup needed.",
        comingSoonLabel: "Coming Soon",
        noSignupNote: "No signup required — just press play.",
        downloadPrompt: "Want these as downloads?",
        downloadCtaLabel: "Ask on WhatsApp",
      },
      videoTestimonials: {
        eyebrow: "Watch Real Students",
        title: "150+ real reviews, from 12+ years of real retreats",
        desc: "Six real students, filmed after finishing the retreat — unscripted. Tap any video to watch.",
        ctaLabel: "More Video Reviews",
      },
      faq: {
        eyebrow: "Before You Enroll",
        title: "Questions people ask before Day 1",
        items: [
          {
            question: "Do I need any prior experience with meditation or energy work?",
            answer:
              "No particular belief system or prior experience is required. Kriya Yoga builds up gradually across the 11 nights — you bring your own openness, Dr. Sharma guides the method, step by step.",
          },
          {
            question: "Is the energy work — Kundalini, Samadhi — actually safe?",
            answer:
              "Every technique is taught step by step, live, with Dr. Sharma guiding the pace each night. That said, these are intensive practices — for a small number of people, deep meditative or energy-focused work can surface strong emotional experiences. We ask participants to share any relevant mental health history before the retreat, so pacing can be adjusted accordingly. This retreat is a personal and spiritual practice, not a substitute for licensed therapy or psychiatric care — if you're currently in treatment for a mental health condition, please consult your provider before joining.",
          },
          {
            question: "What is Kriya Yoga, exactly?",
            answer:
              "Kriya Yoga is a real, centuries-old discipline for working directly with Prana — your own life force — through breath and specific inner techniques, not a philosophy you only read about. It's the foundation this entire 11-day retreat is built on.",
          },
          {
            question: "What's the daily time commitment?",
            answer:
              "Each day includes a live session with Dr. Sharma from 7:30 PM to 10:30 PM, plus guided practice — the same window every day of the 11-day batch.",
          },
          {
            question: "What time are the live sessions held?",
            answer:
              "7:30 PM to 10:30 PM, daily, for all 11 days of the batch — the same window for every batch, so you can plan around it in advance.",
          },
          {
            question: "What do I need technically to join?",
            answer:
              "Just a stable internet connection and a device with camera and audio. The live session link is shared directly with confirmed participants closer to the start date.",
          },
          {
            question: "Is this religious, or tied to a specific belief system?",
            answer:
              "No particular belief system is required. The work draws on meditation, breathwork, and awareness practices — you bring your own openness, we guide the method.",
          },
          {
            question: "When is the next batch, and how many seats are left?",
            answer:
              "A new batch starts on the 10th of every month and runs through the 20th. Message us on WhatsApp for the current batch's remaining seats.",
          },
        ],
        ctaLabel: "Ask on WhatsApp",
      },
      finalCta: {
        eyebrow: "Ready When You Are",
        title: "Your Awakening Starts With One Decision",
        desc: "Enrollment is confirmed personally by Dr. Kapil's own team — not an automated system. Twelve years, 150+ real students, one small cohort at a time. Book your spot in the next batch.",
        cta: "Secure Your Retreat Spot",
      },
      stickyBar: {
        text: "11-Day Online Meditation & Inner Mastery Retreat",
        price: "Small Cohort · Limited Enrollment",
        cta: "Secure Your Retreat Spot",
      },
      whatsapp: {
        bubble: "Have questions about the 11-Day Retreat? Chat with Dr. Kapil's team instantly.",
        button: "Chat on WhatsApp",
        ariaLabel: "Chat with Dr. Kapil's team on WhatsApp about the 11-Day Retreat",
      },
    },
    residentialLanding: {
      hero: {
        eyebrow: "Residential Retreats · Since 2014 · Small Cohorts",
        headline: "Step Away. Fully.",
        headlineEm: "Residential Retreats in Lonavala & Rishikesh",
        sub: "You've meditated in bed, in traffic, with an app telling you to just breathe. It didn't work — not because you failed at it, but because a 10-minute recording was never built to reach where the exhaustion actually lives. This is Dr. Kapil Dev Sharma, in the room with you, for days — Kriya Yoga, Prana, and cosmic energy work, guided directly, since 2014.",
        ctaPrimary: "Secure Your Residential Seat",
        ctaPrimaryMeta: "Personally confirmed by Dr. Kapil's team",
        ctaSecondary: "See the 2026–27 Roadmap",
        trustLine: "For burnt-out professionals, chronic overthinkers, and real spiritual seekers — ready to leave, not just log off.",
      },
      roadmap: {
        eyebrow: "The Official Schedule",
        title: "Four Journeys. Two Sacred Grounds. One Path.",
        desc: "Every residential retreat is deliberately small, deliberately seasonal, and spaced apart — so each one can go deep instead of wide.",
        items: [
          { when: "November 2026", where: "Lonavala", theme: "Mountain & Nature Deep Immersion" },
          { when: "February 2027", where: "Rishikesh", theme: "The Spiritual Capital by the Ganges" },
          { when: "June 2027", where: "Lonavala", theme: "Monsoon Soul Retreat" },
          { when: "November 2027", where: "Lonavala", theme: "Winter Deep Practice" },
        ],
        ctaLabel: "Apply for This Date",
      },
      coreProblem: {
        eyebrow: "Why Even Online Isn't Enough",
        title: "Your mind doesn't need more information. It needs distance.",
        desc: "You've tried the apps. Maybe even a live online session. The loop softens for an hour, then your inbox opens and it's back.",
        painPoints: [
          "An app competes with a nervous system that's been in low-grade alarm for years — and loses, every time, because it's still running in the same noisy environment that created the exhaustion.",
          "Even a live online retreat still has your phone on the desk beside you. Real disconnect doesn't happen through a screen, no matter how good the guidance is.",
          "Deep energy work — Kundalini, Samadhi, direct Pranic activation — is safest and strongest with a teacher physically present to see exactly where you are, not guessing from a video call.",
        ],
        solution:
          "This is why the residential format exists. Real Kriya Yoga, worked directly with Prana — your own life force — through cosmic energy and cosmic fusion, in a room with no notifications, no inbox, and a living teacher who can actually see you. What happens over these days produces a felt, physical shift, not a temporary calm that fades on the drive home.",
      },
      advantage: {
        eyebrow: "The Part No App Can Replicate",
        title: "Four Things That Only Happen in the Room",
        desc: "This is the entire reason the retreat is residential, not optional.",
        items: [
          {
            title: "Total Disconnect",
            desc: "No notifications, no inbox, no \"just checking one thing.\" Your nervous system gets to fully stand down — often for the first time in years.",
          },
          {
            title: "Direct Energy Transmission",
            desc: "There's a real, felt difference between a recording of a teacher and sitting in the same room as one. This cannot be digitized.",
          },
          {
            title: "Small, Exclusive Cohorts",
            desc: "Not a stadium event. Every retreat is kept deliberately small, so Dr. Kapil can actually see your posture, your breath, your resistance — and correct it in real time.",
          },
          {
            title: "Personal Vetting",
            desc: "Every applicant is reviewed before confirmation. A room this intimate only works if everyone in it is genuinely ready to do the work.",
          },
        ],
      },
      journey: {
        eyebrow: "The Work Itself",
        title: "A Structured, Multi-Day Immersion",
        desc: "Each residential retreat unfolds as a deliberate arc — grounding first, then energy activation, then deep stillness, then integration — so the shift has time to actually settle.",
        items: [
          {
            title: "Grounding & Arrival",
            desc: "Breath realignment and nervous system down-regulation — arriving fully before the deeper work begins.",
          },
          {
            title: "Kriya Yoga & Pranic Activation",
            desc: "The core technique, taught in structured, safe progression, corrected in person.",
          },
          {
            title: "Energy & Chakra Work",
            desc: "Direct, guided practice — not theory read off a slide.",
          },
          {
            title: "Deep Stillness & Samadhi Practice",
            desc: "The state everything else in the retreat has been quietly building toward.",
          },
          {
            title: "Integration & Closing",
            desc: "So what you've built doesn't dissolve the moment you're back home.",
          },
        ],
      },
      gallery: {
        eyebrow: "Inside the Retreat",
        title: "What It Actually Looks Like",
        desc: "A glimpse of the environment, the group, and the practice — real photos dropped in as each retreat happens.",
        viewGalleryCta: "View Full Gallery",
      },
      authority: {
        eyebrow: "A Proven Path, Not A Trend",
        title: "Guided by the same teacher, for over a decade",
        desc: "Real years, real students, real reviews — not a retreat that launched last quarter.",
        cards: [
          {
            title: "Teaching Since 2014",
            desc: "Over a decade personally guiding residential retreats — not a recently-launched retreat business chasing a trend.",
          },
          {
            title: "150+ Real Student Reviews",
            desc: "Written and video reviews from real participants, not stock footage or paid actors.",
          },
          {
            title: "Small Cohort, Every Retreat",
            desc: "Every retreat is kept deliberately small so Dr. Kapil can actually guide you, not lecture at a crowd.",
          },
          {
            title: "Personally Led, In Person",
            desc: "Not delegated to an assistant instructor — Dr. Kapil, physically present, for the full retreat.",
          },
        ],
      },
      venues: {
        eyebrow: "Where It Happens",
        title: "Two Sacred Grounds",
        desc: "Every location is chosen on purpose — the terrain is part of the practice.",
        locations: [
          {
            name: "Dream Holiday Resort, Tungarli",
            address: "Tungarli, Lonavala, Maharashtra",
            note: "Hosts three of the four 2026–27 retreats — November 2026, June 2027, and November 2027.",
          },
          {
            name: "Hotel Krishna Cottage",
            address: "Jonk, Swargashram, Rishikesh",
            note: "Hosts the February 2027 retreat — on the banks of the Ganges, in the spiritual capital of the Himalayas.",
          },
        ],
      },
      pricing: {
        eyebrow: "Choose Your Room",
        title: "One Price, No Surprises",
        desc: "Same rate across all four 2026–27 dates — per person, food and stay included.",
        tiers: [
          {
            name: "Sharing Room",
            price: "₹35,000",
            priceNote: "per person",
            features: [
              "Full residential retreat, all sessions included",
              "Shared deluxe accommodation",
              "Pure satvik meals, included",
              "Direct, in-person guidance from Dr. Kapil",
            ],
            cta: "Book Sharing Room",
          },
          {
            name: "Private Room",
            price: "₹45,000",
            priceNote: "per person",
            features: [
              "Full residential retreat, all sessions included",
              "Private, non-sharing accommodation",
              "Pure satvik meals, included",
              "Direct, in-person guidance from Dr. Kapil",
            ],
            cta: "Book Private Room",
          },
        ],
        note: "Seats are confirmed personally by Dr. Kapil's team, not by automated checkout — message us on WhatsApp with your preferred date to begin.",
      },
      videoTestimonials: {
        eyebrow: "Watch Real Students",
        title: "150+ real reviews, from over a decade of real retreats",
        desc: "Six real students, filmed after finishing a retreat — unscripted. Tap any video to watch.",
        ctaLabel: "More Video Reviews",
      },
      audience: {
        eyebrow: "Be Honest With Yourself Here",
        title: "This Isn't for Everyone. It's for You If —",
        items: [
          "You're a high-performer who's quietly burnt out — successful on paper, exhausted underneath it",
          "You're a chronic overthinker — the loop doesn't stop just because your circumstances are fine",
          "You've tried the apps, the books, the podcasts — and gotten temporary relief, never real change",
          "You're a genuine spiritual seeker — ready for real practice, not more content to consume",
          "You can commit fully for the retreat's duration — this only works if you actually leave",
        ],
        disclaimer: "If you're looking for a relaxing holiday with some yoga on the side, this isn't it. If you're ready for real, structured inner work with a teacher watching closely, you're in the right place.",
      },
      faq: {
        eyebrow: "Before You Apply",
        title: "Questions people ask before booking",
        items: [
          {
            question: "Is this suitable for complete beginners?",
            answer: "Yes. No prior experience with Kriya Yoga, meditation, or energy work is required. Every practice is taught from the ground up, in safe, structured progression.",
          },
          {
            question: "Is the energy work — Kundalini, Samadhi — actually safe?",
            answer:
              "Every technique is taught step by step, under direct in-person supervision. That said, these are intensive practices — for a small number of people, deep meditative or energy-focused work can surface strong emotional experiences. We ask participants to share any relevant mental health history before the retreat, so Dr. Sharma can adjust pacing accordingly. This retreat is a personal and spiritual practice, not a substitute for licensed therapy or psychiatric care — if you're currently in treatment for a mental health condition, please consult your provider before joining.",
          },
          {
            question: "How is this different from your 11-Day Online Retreat?",
            answer: "The online retreat is a live, guided journey you join from home. The Residential Retreat requires you to physically travel and stay on-site — full disconnect, direct in-person energy transmission, and a small in-person cohort the online format can't replicate.",
          },
          {
            question: "What's included in the price?",
            answer: "Both room options — ₹35,000 sharing, ₹45,000 private — include the full residential retreat, all sessions, pure satvik meals, and your stay at the venue.",
          },
          {
            question: "What should I bring?",
            answer: "Comfortable clothing, a journal, and an open mind. A full essentials list is shared after your seat is confirmed.",
          },
          {
            question: "Are meals accommodating of dietary needs?",
            answer: "Yes — pure satvik vegetarian meals are standard, with Jain, gluten-free, and allergy-friendly options available on request.",
          },
        ],
        ctaLabel: "Ask on WhatsApp",
      },
      finalCta: {
        eyebrow: "Four Dates. Limited Seats Each.",
        title: "The Room Is Small on Purpose. Don't Wait to Apply.",
        desc: "Every one of the four 2026–2027 residential retreats has a hard cap on seats, because the entire method depends on Dr. Kapil being able to actually see every person in the room. Seats are confirmed in the order applications arrive.",
        cta: "Secure Your Residential Seat",
      },
      stickyBar: {
        text: "Residential Retreats — Lonavala & Rishikesh",
        price: "From ₹35,000 per person",
        cta: "Secure Your Seat",
      },
      whatsapp: {
        bubble: "Have questions about a Residential Retreat? Chat with Dr. Kapil's team instantly.",
        button: "Chat on WhatsApp",
        ariaLabel: "Chat with Dr. Kapil's team on WhatsApp about the Residential Retreats",
      },
    },
    mentoringLanding: {
      hero: {
        eyebrowBadges: ["Private", "Structured", "Limited Availability"],
        headline: "Focused work, on your situation, with someone who's done this for 26 years.",
        sub: "One-on-one mentoring for overthinking, focus, and personal growth — shaped around what you're actually dealing with, not a fixed curriculum.",
        guideLabel: "Your Guide",
        guideName: "Dr. Kapil Dev Sharma",
        guideCredential: "Professor · Researcher · Life Coach · 26 Years",
        ctaPrimary: "Apply Now",
      },
      fit: {
        eyebrow: "Is This For You?",
        title: "You may benefit from personal work if…",
        items: [
          "I understand my patterns but still repeat them.",
          "I want guidance, not more information.",
          "I feel mentally overloaded.",
          "Group programs don't fully fit my situation.",
        ],
      },
      areas: {
        eyebrow: "The Areas",
        title: "Six starting points, shaped around you",
        items: [
          {
            title: "Overthinking",
            desc: "Understanding the thought patterns that run automatically — and building the capacity to engage them differently.",
          },
          {
            title: "Focus",
            desc: "Developing the ability to direct attention intentionally — at work, in conversation, and in daily life.",
          },
          {
            title: "Meditation Practice",
            desc: "Establishing a personal practice that is actually sustainable — guided, adjusted, and made to fit your routine.",
          },
          {
            title: "Emotional Awareness",
            desc: "Learning to notice emotional states before they determine reactions — with more clarity and less reactivity.",
          },
          {
            title: "Mental Clarity",
            desc: "Creating the internal conditions where decisions, communication, and daily experience become less draining.",
          },
          {
            title: "Personal Growth",
            desc: "Working on specific patterns, habits, or areas of life that aren't responding to information alone.",
          },
        ],
        disclaimer:
          "Every programme is customised. The areas listed above are starting points — sessions are shaped around what's relevant to you, not a fixed curriculum. No guaranteed outcomes are promised or implied.",
      },
      comparison: {
        eyebrow: "Understanding The Difference",
        title: "Group program vs.",
        titleEm: "Personal Intensive.",
        columnGroup: "Group Program",
        columnPersonal: "Personal Intensive",
        rows: [
          { label: "Setting", group: "Shared with others", personal: "Private, one-on-one only" },
          { label: "Pace", group: "Fixed batch schedule", personal: "Your schedule, your pace" },
          { label: "Content", group: "Standardised for group", personal: "Designed for your situation" },
          { label: "Availability", group: "Scheduled monthly batches", personal: "Apply anytime, start when ready" },
          { label: "Follow-Up", group: "Shared group check-ins", personal: "Direct follow-up between sessions" },
        ],
      },
      process: {
        eyebrow: "The Process",
        title: "How it works.",
        steps: [
          {
            title: "Apply",
            desc: "Fill a short form or message on WhatsApp. Tell us what you're currently dealing with and what you're hoping to work on.",
          },
          {
            title: "Short conversation",
            desc: "A brief call or WhatsApp exchange to understand your situation properly — before any recommendation is made.",
          },
          {
            title: "Custom plan",
            desc: "A session plan is proposed based on what you've shared — you decide whether to proceed. No pressure, no upfront commitment.",
          },
        ],
        formats: [
          {
            duration: "7 Days",
            tag: "Focused",
            desc: "Daily sessions. One defined area. Clear daily structure and support throughout.",
          },
          {
            duration: "14 Days",
            tag: "Recommended",
            desc: "Two weeks for interlinked issues. Space to adjust the approach as sessions progress.",
          },
        ],
      },
      guide: {
        eyebrow: "The Guide",
        title: "Dr. Kapil Dev Sharma",
        credential: "Professor · Researcher · Life Coach · 26 Years Experience",
        bio: "Dr. Kapil Dev Sharma brings 26 years of experience — 15 years as a professor and researcher in formal education, and 11 years as a life coach and mind trainer. That combination of academic rigour and direct coaching practice is what shapes how sessions are built.",
        stats: [
          { value: "26", label: "Years Total" },
          { value: "15", label: "Years Professor" },
          { value: "11", label: "Years Coaching" },
        ],
        quote:
          "Most people already know what they need to change. The harder work is understanding why they haven't — and building the conditions where that becomes possible.",
      },
      testimonials: {
        eyebrow: "What People Say",
        title: "Participant experiences.",
        ctaLabel: "Watch More Reviews",
        comingSoonNote: "Video reviews from 1-on-1 mentoring clients are being added here as they're recorded.",
      },
      apply: {
        eyebrow: "Apply",
        title: "Start the conversation.",
        sub: "A short application. No commitment yet.",
        body: "This form helps understand your situation before any recommendation is made. There is no obligation to proceed.",
        nameLabel: "Name",
        phoneLabel: "Phone",
        cityLabel: "City",
        situationLabel: "What are you currently dealing with?",
        situationOptionalTag: "Optional",
        situationPlaceholder: "Optional — a line or two is enough",
        submitLabel: "Send Application",
        disclaimer:
          "This is a personal-development and coaching practice, not a substitute for licensed therapy or psychiatric care. If you're currently in treatment for a mental health condition, or in crisis, please consult a licensed professional or local emergency services.",
      },
      faq: {
        eyebrow: "Questions",
        title: "Before you apply",
        items: [
          {
            question: "How is this different from the group programs?",
            answer:
              "Group programs (like the 30-Day Masterclass or the 11-Day Retreat) run on a fixed schedule with standardised content for everyone in the batch. This is private, one-on-one, and shaped entirely around your own situation — the pace, focus areas, and format adjust to you, not the other way around.",
          },
          {
            question: "What if I'm not sure what I need help with?",
            answer:
              "That's exactly what the short conversation step is for. You don't need a clear diagnosis before applying — just a sense of what's not working. Dr. Sharma helps identify the actual focus area during that first exchange, before any plan is proposed.",
          },
          {
            question: "Is this therapy?",
            answer:
              "No. This is a personal-development and coaching practice, not a substitute for licensed therapy or psychiatric care. If you're currently in treatment for a mental health condition, or in crisis, please consult a licensed professional or local emergency services.",
          },
          {
            question: "What happens after I apply?",
            answer:
              "You'll hear back for a short call or WhatsApp conversation to understand your situation. After that, a session plan is proposed — you decide whether to proceed. There's no upfront commitment at the application stage.",
          },
        ],
      },
      whatsapp: {
        bubble: "Have questions about 1-on-1 Mentoring? Chat with Dr. Kapil's team instantly.",
        button: "Chat on WhatsApp",
        ariaLabel: "Chat with Dr. Kapil's team about 1-on-1 Mentoring on WhatsApp",
      },
      stickyBar: {
        text: "Personal Class — 1-on-1 Intensive Mentoring",
        price: "Private · Fully Customised",
        cta: "Apply Now",
      },
    },
    // 21-Day Mind Reset System™ — content for /mentoring/overthinking-
    // course (see that page's own doc comment). Replaced the old
    // `courseLanding` block entirely (deleted, not just unlinked — see
    // the "MASTER PROMPT (FINAL, SELF-CONTAINED)" task): that block's
    // ₹2,999/₹5,999/₹8,999 tiers and "2 live sessions" as a universal
    // feature are gone from the codebase, not just off this page. Live
    // sessions are a ₹999/6-month-only feature throughout every section
    // below that mentions pricing or plan comparison.
    mindResetLanding: {
      hero: {
        eyebrow: "Overthinking & Mental Clarity",
        productName: "The 21-Day Mind Reset System™",
        headline: "Stop Getting Lost in Your Thoughts. Start Understanding Your Mind.",
        tagline: "Understand Your Mind • Build Mental Clarity",
        sub: "21 days of daily training, meditation, and guided activity. Live sessions with Dr. Kapil included with 6-month access.",
        ctaPrimary: "Start Your Mind Reset — ₹499",
        ctaSecondary: "Take the Free Overthinking Test",
        trustLine: "Hindi Online Program • 21 Days • Guided Learning • Meditation",
      },
      problem: {
        eyebrow: "Sound Familiar?",
        title: "Does Your Mind Feel Busy Even When You Want to Relax?",
        items: [
          "Replaying past conversations",
          "Worrying about what might happen next",
          "Finding it difficult to switch off your thoughts",
          "Feeling mentally overloaded by work, family, or daily responsibilities",
          "Struggling to focus on one thing at a time",
          "Spending too much time thinking and too little time feeling present",
        ],
        closingLine:
          "You are not expected to change everything in one day. You can begin by understanding what is happening in your mind.",
      },
      whatIsOverthinking: {
        eyebrow: "Understanding the Difference",
        title: "What Is Overthinking, Really?",
        desc: "Thinking itself isn't the problem. Overthinking is what happens when thinking stops being useful — the same worry looping again and again, without moving any closer to a decision.",
        productiveLabel: "Productive Thinking",
        productiveSteps: ["Understand", "Decide", "Act"],
        overthinkingLabel: "Overthinking",
        overthinkingSteps: ["Repeat", "Worry", "Mental Exhaustion"],
      },
      assessmentCta: {
        eyebrow: "Free Overthinking Test",
        title: "Understand Your Thought, Worry & Stress Patterns",
        desc: "Take a simple self-awareness test to reflect on your experiences related to overthinking, worry, and stress.",
        scoreCards: [
          { title: "Overthinking Awareness" },
          { title: "Anxiety / Worry Awareness" },
          { title: "Stress Awareness" },
        ],
        cta: "Take the Overthinking Test",
        disclaimer:
          "For self-awareness and educational purposes only — this is not a clinical diagnostic test, and results are not a medical diagnosis.",
      },
      experience: {
        eyebrow: "What You Will Experience",
        title: "A Simple 21-Day Journey for Your Mind",
        desc: "Every day follows the same structured routine, building on the day before.",
        items: [
          { title: "Training Video", desc: "A short daily lesson introducing the day's focus." },
          { title: "Educational Video", desc: "The thinking or psychology behind that day's topic, explained simply." },
          { title: "Guided Meditation", desc: "A short practice to apply what the day is teaching." },
          { title: "Daily Activity", desc: "A practical exercise or reflection to make it real, not just theory." },
          { title: "PDF Workbook", desc: "A place to track your own patterns and progress." },
        ],
        liveSessionsNote: {
          title: "2 Live Sessions with Dr. Kapil",
          desc: "Included only with 6-Month Access (₹999) — not part of the ₹499 plan.",
        },
      },
      journey: {
        eyebrow: "Your 21 Days",
        title: "The 21-Day Course Journey",
        desc: "A broad overview of the three stages — not the exact daily lesson titles.",
        stages: [
          {
            label: "Days 1–7",
            title: "Understand Your Mind",
            topics: [
              "Understanding overthinking",
              "Recognising thought patterns",
              "Understanding the overthinking cycle",
              "Thought awareness",
              "Past, present, and future thinking",
              "Recognising personal triggers",
              "Week 1 reflection",
            ],
          },
          {
            label: "Days 8–14",
            title: "Work With Your Thoughts & Emotions",
            topics: [
              "Understanding stress",
              "Understanding worry and anxiety-related experiences",
              "The power of pause",
              "Recognising unhelpful thoughts",
              "Self-doubt and inner dialogue",
              "Emotional awareness",
              "Week 2 reflection",
            ],
          },
          {
            label: "Days 15–21",
            title: "Build Mental Clarity & Better Habits",
            topics: [
              "Focus and mental clarity",
              "Mindful living",
              "Digital overload and mental space",
              "Better decision-making",
              "Healthy boundaries",
              "Creating a personal mind-reset routine",
              "Final reflection and next steps",
            ],
          },
        ],
      },
      whoFor: {
        eyebrow: "Who Is This For?",
        title: "Built for Real Indian Lives",
        items: [
          { title: "Working Professionals", desc: "Managing work pressure and a mind that won't switch off after hours." },
          { title: "Parents", desc: "Looking for calmer, clearer thinking amid the daily demands of family life." },
          { title: "Students", desc: "Learning to manage exam stress and racing thoughts." },
          { title: "Homemakers", desc: "Wanting a structured practice that fits around a full day at home." },
          { title: "Entrepreneurs", desc: "Navigating constant decisions and the mental load that comes with them." },
          { title: "Anyone Curious About Self-Awareness", desc: "You don't need a specific problem to start understanding your own mind better." },
        ],
        disclaimer: "This course is educational and self-awareness focused — it is not a substitute for mental-health treatment.",
      },
      included: {
        eyebrow: "What You Get",
        title: "Everything Included in Your Plan",
        universalLabel: "Included in Every Plan",
        universalItems: [
          "21 days of structured learning",
          "Hindi training videos",
          "Educational videos",
          "Guided meditation",
          "Daily practical activities",
          "PDF workbooks",
          "1-month access with the ₹499 plan, or 6-month access with the ₹999 plan",
        ],
        extraLabel: "Additionally With the ₹999 Plan",
        extraItem: "2 live sessions with Dr. Kapil Dev Sharma",
      },
      guide: {
        eyebrow: "Your Guide",
        title: "Dr. Kapil Dev Sharma",
        credential: "Professor · Researcher · Life Coach · 26 Years Experience",
        bio: "Dr. Kapil Dev Sharma brings 26 years of experience — 15 years as a professor and researcher in formal education, and 11 years as a life coach and mind trainer. That combination of academic rigour and direct coaching practice is what shapes how this course is built.",
        stats: [
          { value: "26", label: "Years Total" },
          { value: "15", label: "Years Professor" },
          { value: "11", label: "Years Coaching" },
        ],
        quote:
          "Most people already know what they need to change. The harder work is understanding why they haven't — and building the conditions where that becomes possible.",
      },
      pricing: {
        eyebrow: "Pricing",
        title: "Start Your Mind Reset Journey Today",
        classplusNote: "Your plan is selected at checkout on Classplus.",
        card1: {
          name: "Mind Reset Starter",
          price: "₹499",
          period: "1 Month Access",
          desc: "A complete 21-day Hindi learning experience with training, meditation, activities, and PDFs — fully self-paced.",
          features: [
            "Complete 21-day course",
            "Training videos",
            "Educational videos",
            "Guided meditation",
            "Daily activities",
            "PDF workbooks",
          ],
          cta: "Join for ₹499",
        },
        card2: {
          name: "Mind Reset Extended",
          price: "₹999",
          period: "6 Months Access",
          desc: "Prefer live guidance from Dr. Kapil and more time to practise? Includes everything in the ₹499 plan, plus live sessions with Dr. Kapil.",
          features: [
            "Complete 21-day course",
            "Training videos",
            "Educational videos",
            "Guided meditation",
            "Daily activities",
            "PDF workbooks",
          ],
          liveSessionHighlight: "2 Live Sessions with Dr. Kapil",
          cta: "Choose 6-Month Access",
        },
        comparisonNote:
          "Both plans include the full 21-day self-paced course. The 6-month plan additionally includes 2 live sessions with Dr. Kapil and more time to complete the program.",
      },
      howItWorks: {
        eyebrow: "How It Works",
        title: "How It Works",
        steps: [
          { title: "Take the Overthinking Test", desc: "Take the free Overthinking Test to reflect on where you're starting from." },
          { title: "Choose Your Access", desc: "Pick ₹499 for 1 month, or ₹999 for 6 months plus live sessions." },
          { title: "Learn & Practise", desc: "Follow the daily routine for 21 days — about 20–30 minutes a day." },
          { title: "Keep Building", desc: "Continue building your own personal mind-reset routine after Day 21." },
        ],
      },
      faq: {
        eyebrow: "Questions",
        title: "Before You Start",
        ctaLabel: "Ask on WhatsApp",
        items: [
          {
            question: "What is the 21-Day Mind Reset System™?",
            answer:
              "A 21-day guided Hindi online program to understand overthinking, develop mental clarity, and build better mind habits — through daily training videos, meditation, and activities.",
          },
          {
            question: "Is the course in Hindi?",
            answer: "Yes. All training videos, educational videos, and guided meditations are in Hindi.",
          },
          {
            question: "What is included in the course?",
            answer:
              "Every day includes a training video, an educational video, guided meditation, a daily activity, and PDF workbook material. The ₹999 plan additionally includes 2 live sessions with Dr. Kapil.",
          },
          {
            question: "Are live sessions included in both plans?",
            answer:
              "No. Live sessions are included only with the ₹999 / 6-month plan. The ₹499 / 1-month plan is fully self-paced, with no live sessions.",
          },
          {
            question: "What is the difference between ₹499 and ₹999?",
            answer:
              "Two things: access validity (1 month with ₹499 vs. 6 months with ₹999), and live sessions — the ₹999 plan includes 2 live sessions with Dr. Kapil, which the ₹499 plan does not.",
          },
          {
            question: "How long is the course?",
            answer: "21 days of daily content, designed to take about 20–30 minutes a day.",
          },
          {
            question: "Can I learn from my mobile?",
            answer: "Yes, the course is fully mobile-friendly through the Classplus app or website.",
          },
          {
            question: "Do I need previous meditation experience?",
            answer: "No prior experience is needed — the course is designed to guide you from wherever you're starting.",
          },
          {
            question: "Is this course a treatment for anxiety or depression?",
            answer:
              "No. This is an educational, self-awareness-focused course. It is not a substitute for licensed therapy or psychiatric care. If you're currently in treatment for a mental health condition, or in crisis, please consult a licensed professional or local emergency services.",
          },
          {
            question: "Can I take the Overthinking Test before purchasing?",
            answer: "Yes — the Overthinking Test is free and available to anyone, whether or not you enroll in the course.",
          },
          {
            question: "What happens after I purchase?",
            answer: "[Access-delivery details to be confirmed — you'll receive instructions for the Classplus platform where the course lives.]",
          },
        ],
      },
      finalCta: {
        eyebrow: "Ready When You Are",
        headline: "Your Mind Deserves Your Attention.",
        desc: "Start with one small step. Learn, reflect, practise, and build a better relationship with your thoughts.",
        ctaPrimary: "Start Your Mind Reset — ₹499",
        ctaSecondary: "Take the Free Overthinking Test",
      },
      whatsapp: {
        bubble: "Have questions about the 21-Day Mind Reset System? Chat with Dr. Kapil's team instantly.",
        button: "Chat on WhatsApp",
        ariaLabel: "Chat with Dr. Kapil's team about the 21-Day Mind Reset System on WhatsApp",
      },
      stickyBar: {
        text: "The 21-Day Mind Reset System",
        price: "₹499 · 1 Month Access",
        cta: "Start for ₹499",
      },
    },
    // Overthinking Test™ — the real, working assessment at /mind-
    // assessment (see the "Build the Overthinking Test Free Assessment"
    // task), replacing the earlier "coming soon" placeholder. 15
    // statements across 3 categories (5 each), one per screen, 0–4 scored
    // on a 5-point frequency scale. Band thresholds (0–7 Low / 8–14
    // Moderate / 15–20 High) are specified per-category (each category
    // is naturally 0–20, 5 statements × 0–4) — the spec doesn't define a
    // separate threshold set for the 0–60 overall sum, so the overall
    // band is derived from the AVERAGE of the three category scores
    // (0–20) against these same thresholds, and the raw 0–60 sum is
    // shown only as a number, not banded on its own scale. Documented
    // here as a judgment call, not silently decided.
    overthinkingTestLanding: {
      meta: {
        title: "Overthinking Test — Free 2-Minute Self-Awareness Test",
        description:
          "A free 2-minute self-awareness test for overthinking, worry, and stress patterns — not a diagnosis, just a mirror.",
      },
      hero: {
        eyebrow: "Free · 2 Minutes · 15 Questions",
        headline: "Do You Overthink Everything?",
        sub: "A free 2-minute self-awareness test — not a diagnosis, just a mirror.",
        startCta: "Start the Test",
      },
      scaleLabels: ["Never", "Sometimes", "Often", "Most of the time", "Always"],
      progress: { label: "Question", of: "of" },
      backLabel: "Back",
      categories: [
        {
          key: "overthinking",
          label: "Overthinking",
          statements: [
            "I can't get even a small thing out of my head",
            "My mind replays old conversations before I fall asleep",
            "Even a small decision can take me hours to make",
            "I keep wondering if I said something wrong",
            "Before starting anything, I've already imagined every way it could go wrong",
          ],
        },
        {
          key: "worry",
          label: "Worry / Anxiety",
          statements: [
            "I feel like something bad is about to happen, without any real reason",
            "Just thinking about the future makes me uneasy",
            "I get a knot in my stomach or feel jittery before something important",
            "I assume the worst outcome even for small things",
            "If someone takes long to reply, I start thinking something's wrong",
          ],
        },
        {
          key: "stress",
          label: "Stress",
          statements: [
            "I feel like I have too much to do and not enough time",
            "Small things make me irritable or angry",
            "I feel tired even after a full night's sleep",
            "My mind doesn't feel calm even while scrolling my phone or social media",
            "I feel like I'm juggling too many things at once",
          ],
        },
      ],
      bands: {
        low: {
          label: "Low",
          shortLine: "This doesn't seem to be affecting you much right now.",
          title: "This doesn't seem to be affecting you much right now.",
          desc: "Your answers suggest this isn't weighing heavily on your day-to-day life at the moment. A little structured daily awareness practice can still help keep it that way.",
        },
        moderate: {
          label: "Moderate",
          shortLine: "Worth paying a little attention to.",
          title: "Worth paying a little attention to.",
          desc: "Your answers suggest this shows up often enough to be worth noticing. Structured daily practice can help you build more awareness around it — not a cure, just a steadier starting point.",
        },
        high: {
          label: "High",
          shortLine: "This may be affecting your daily life more than you realize.",
          title: "This may be affecting your daily life more than you realize.",
          desc: "Your answers suggest this shows up often, and often enough to notice in daily life. That's worth paying honest attention to — structured daily practice can help you build awareness and a steadier routine, though it isn't a substitute for professional support if you feel you need it.",
        },
      },
      teaser: {
        title: "Your Result",
        overallScoreLabel: "Your Overthinking Score",
      },
      fullReport: {
        title: "Your Full Report",
        overallLabel: "Overall",
        courseTitle: "Not sure what to do next?",
        courseDesc: "The 21-Day Mind Reset System is a structured, daily Hindi program to build exactly this kind of awareness.",
        courseCta: "Explore the 21-Day Mind Reset System",
      },
      disclaimer: "This is a self-awareness tool, not a clinical diagnosis.",
      restartLabel: "Retake the Test",
    },
  },

  hi: {
    nav: {
      links: [
        { label: "प्रोग्राम्स", href: "#explore-programs" },
        { label: "रिट्रीट्स", href: "/retreats/online-11-day" },
        { label: "मेंटरिंग", href: "/mentoring/personal-class" },
        { label: "परिचय", href: "/about" },
        { label: "सवाल-जवाब", href: "#faq" },
      ],
      ctaPrimary: "7 दिन मुफ़्त शुरू करें",
    },
    checkoutTrust: {
      line: "भुगतान Razorpay द्वारा सुरक्षित। 100% सुरक्षित और एन्क्रिप्टेड — हम कभी आपके कार्ड की जानकारी संग्रहीत नहीं करते।",
      refundLabel: "रिफंड और कैंसिलेशन नीति",
    },
    wellnessDisclaimer: {
      line: "यह एक आध्यात्मिक और व्यक्तिगत-विकास अभ्यास है, लाइसेंस-प्राप्त चिकित्सा या मानसिक स्वास्थ्य उपचार का विकल्प नहीं। यदि आप संकट में हैं, तो कृपया किसी लाइसेंस-प्राप्त पेशेवर या स्थानीय आपातकालीन सेवाओं से संपर्क करें।",
    },
    accessModel: {
      masterclassLabel: "लाइव मास्टरक्लास — ₹9,999",
      masterclassDesc: "पूरा 30-दिवसीय पाठ्यक्रम, डॉ. शर्मा के साथ 7 लाइव सेशन, और पूरे समय ऐप एक्सेस — एकमुश्त।",
      continueLabel: "जारी रखें — ₹499/माह",
      continueDesc: "उन ग्रेजुएट्स के लिए जिन्होंने प्रोग्राम पूरा कर लिया है और बाद में भी ऐप अभ्यास जारी रखना चाहते हैं।",
    },
    hero: {
      eyebrow: "डॉ. कपिल देव शर्मा — माइंड उर माइंड",
      credentials: [
        "इंग्लिश प्रोफेसर (15+ वर्षों का अनुभव)",
        "भारत में QSR के प्रणेता (2015 से)",
        "10,000+ विद्यार्थियों का मार्गदर्शन",
      ],
      headline: "भारत की पहली विज्ञान-आधारित क्वांटम स्पीड रीडिंग",
      headlineEm: "5 गुना तेज़ पढ़ें। 100% याद रखें। EEG-सत्यापित।",
      sub: "सिलेबस पूरा करने में दिक्कत हो रही है? घंटों पढ़ते हैं पर कुछ याद नहीं रहता? आपका बच्चा घंटों पढ़ता है पर सब भूल जाता है? यह पढ़ाई की समस्या नहीं है — यह ट्रेनिंग की समस्या है। कोई सम्मोहन नहीं, कोई शॉर्टकट नहीं — शुद्ध कॉग्निटिव साइंस।",
      ctaPrimary: "अभी फ्री ट्रेनिंग देखें",
      ctaSecondary: "फ्री स्पीड टेस्ट लें",
      portraitName: "डॉ. कपिल देव शर्मा",
      portraitTitle: "संस्थापक, माइंड उर माइंड",
      stats: [
        { value: "30-दिन की स्ट्रीक", label: "क्वांटम स्पीड रीडिंग" },
        { value: "11 दिन, मासिक", label: "ऑनलाइन ध्यान एंड इनर मास्टरी रिट्रीट" },
        { value: "वर्ष में 3–4 बार", label: "रेजिडेंशियल · ऋषिकेश और लोनावला" },
        { value: "1-ऑन-1", label: "पर्सनल क्लास" },
      ],
    },
    tier1: {
      eyebrow: "टियर 01 · प्रमुख फ्लैगशिप",
      audienceTag: "विद्यार्थियों और पेशेवरों के लिए",
      title: "क्वांटम स्पीड रीडिंग",
      titleEm: "30-दिवसीय मास्टरक्लास",
      desc: "यह कोई वेबिनार नहीं है। यह हर आयु वर्ग के विद्यार्थियों, पेशेवरों और आजीवन सीखने वालों के लिए, आपके मस्तिष्क की सूचना प्रोसेस करने की क्षमता का 30-दिवसीय पुनर्निर्माण है।",
      features: [
        "दैनिक अभ्यास के साथ 30-दिवसीय प्रगतिशील ऐप स्ट्रीक",
        "डॉ. शर्मा के साथ 7 लाइव मास्टरक्लास सत्र",
        "केवल गति नहीं, बल्कि WPM और समझ (comprehension) की ट्रैकिंग",
        "हर आयु वर्ग और पठन-स्तर के लिए उपयुक्त",
      ],
      trustQuote: {
        quote: "जितने समय में पहले एक अध्याय पूरा होता था, अब उतने समय में दो किताबें पूरी हो जाती हैं।",
        name: "अनन्या आर.",
      },
      cta: "30-दिवसीय मास्टरक्लास अनलॉक करें",
      visualCaption: "30 में से दिन 22 · स्ट्रीक सक्रिय",
    },
    tier2: {
      eyebrow: "टियर 02 · गहन इमर्सिव रिट्रीट",
      title: "तकनीक से आगे —",
      titleEm: "प्रत्यक्ष अनुभव की ओर",
      desc: "जो लोग रीडिंग से आगे बढ़कर ध्यान और आंतरिक मास्टरी में जाने के लिए तैयार हैं, उनके लिए — ऑनलाइन या व्यक्तिगत रूप से।",
      online: {
        tag: "ऑनलाइन · मासिक बैच",
        audienceTag: "गहरी खोज करने वालों के लिए",
        urgency: "छोटा समूह · सीमित नामांकन",
        title: "11-दिवसीय ऑनलाइन ध्यान एंड इनर मास्टरी रिट्रीट",
        desc: "ध्यान और आंतरिक मास्टरी के मुख्य अनुशासनों के माध्यम से एक गहन, लाइव, 11-दिवसीय यात्रा — प्रतिदिन डॉ. शर्मा द्वारा मार्गदर्शित।",
        pills: [
          "मानसिक तरंग संचार (टेलीपैथी)",
          "आभा स्कैनिंग और रीडिंग",
          "समाधि ध्यान",
          "चक्र सक्रियण और ज्ञानोदय",
          "कुंडलिनी ध्यान",
          "सूक्ष्म शरीर यात्रा",
        ],
        trustQuote: {
          quote: "अकेले कुंडलिनी सत्र ही पूरे ग्यारह दिनों के लायक थे।",
          name: "विक्रम एस.",
        },
        cta: "अपनी बैच सीट सुरक्षित करें",
        freePracticeLinkLabel: "या पहले एक मुफ़्त गाइडेड अभ्यास आज़माएं",
      },
      residential: {
        tag: "व्यक्तिगत उपस्थिति · वर्ष में 3–4 बार",
        audienceTag: "गहरी खोज करने वालों के लिए",
        urgency: "छोटा समूह · सीमित सीटें",
        title: "रेजिडेंशियल रिट्रीट",
        desc: "ऋषिकेश और लोनावला में आयोजित छोटे-समूह, पूर्ण-विसर्जन रिट्रीट — माइंड उर माइंड का सबसे गहन प्रारूप।",
        pills: ["ऋषिकेश", "लोनावला", "छोटा समूह, एक्सक्लूसिव", "पूर्ण विसर्जन"],
        cta: "अपनी रिट्रीट सीट सुरक्षित करें",
      },
    },
    tier3: {
      eyebrow: "टियर 03 · विशेष एवं 1-ऑन-1",
      title: "एक विशिष्ट समस्या के लिए",
      titleEm: "सटीक कार्य",
      desc: "हर किसी को रिट्रीट की ज़रूरत नहीं होती। कुछ लोगों को बस एक चीज़ पर केंद्रित मन चाहिए होता है — अपने ही मन से शुरुआत करते हुए।",
      mentoring: {
        tag: "निजी · कस्टम इंटेंसिटी",
        audienceTag: "पूरी तरह कस्टमाइज़्ड 1-ऑन-1",
        title: "पर्सनल क्लास — 1-ऑन-1 इंटेंसिव मेंटरिंग",
        desc: "डॉ. शर्मा के साथ सीधा, निजी मार्गदर्शन, पूरी तरह कस्टमाइज़्ड — जीवन के तनाव और आध्यात्मिक सफलताओं के लिए, थेरेपी का विकल्प नहीं।",
        pills: ["आध्यात्मिक सफलताएं", "पूरी तरह कस्टमाइज़्ड"],
        trustQuote: {
          quote: "छह निजी सत्रों ने वह कर दिखाया जो वर्षों की सामान्य सलाह कभी नहीं कर पाई।",
          name: "प्रिया एम.",
        },
        cta: "1-ऑन-1 मेंटरिंग के लिए आवेदन करें",
      },
      course: {
        tag: "21-दिवसीय कार्यक्रम",
        audienceTag: "अति-चिंतन करने वालों के लिए",
        title: "ओवरथिंकिंग मास्टरी कोर्स",
        desc: "ओवरथिंकिंग के चक्र को तोड़ने के लिए बनाया गया एक केंद्रित, 21-दिवसीय कोर्स — व्यावहारिक, दैनिक, विशिष्ट।",
        pills: ["दैनिक अभ्यास", "21 दिन", "मानसिक स्पष्टता पर केंद्रित"],
        cta: "अपना 21-दिवसीय रीसेट शुरू करें",
      },
    },
    programSelector: {
      title: "आप कहां से शुरू करना चाहेंगे?",
      subtitle: "बताइए यह किसके लिए है — हम आपको सही रास्ता दिखाएंगे।",
      paths: [
        {
          key: "self",
          title: "अपने लिए सीखना",
          desc: "तेज़ी से पढ़ें, ज़्यादा याद रखें, और बिना थके अपना सिलेबस या रीडिंग लिस्ट पूरी करें।",
          cta: "क्वांटम स्पीड रीडिंग एक्सप्लोर करें",
        },
        {
          key: "child",
          title: "अपने बच्चे के लिए ढूंढ रहे हैं",
          desc: "अपने बच्चे को कम पढ़ाई में ज़्यादा याद रखने और परीक्षा से पहले कम तनाव महसूस करने में मदद करें।",
          cta: "पेरेंट्स के लिए प्रोग्राम देखें",
        },
        {
          key: "deeper",
          title: "गहरी माइंड ट्रेनिंग",
          desc: "ध्यान, आंतरिक शांति, और ओवरथिंकिंग से निपटने के लिए सीधे मार्गदर्शन के साथ।",
          cta: "मेंटरिंग एक्सप्लोर करें",
        },
      ],
    },
    homeProgramCards: {
      eyebrow: "कैटलॉग",
      title: "हमारे प्रोग्राम्स एक्सप्लोर करें",
      habitBuilder: {
        number: "02",
        eyebrowLabel: "क्वांटम स्पीड रीडिंग की ओर एक शुरुआत",
        title: "Quantum Mind & Habit Builder",
        desc: "QSR शुरू करने से पहले अपनी दैनिक फोकस आदत बनाएं — फ्री 7-दिन स्टार्टर।",
        priceLine: "7 दिन मुफ़्त · ₹99 एकमुश्त",
        cta: "मुफ़्त शुरू करें",
      },
      featured: {
        number: "01",
        eyebrowLabel: "30-दिवसीय मास्टरक्लास · फ्लैगशिप",
        cta: "प्रोग्राम एक्सप्लोर करें",
      },
      retreat: {
        number: "03",
        eyebrowLabel: "11-दिवसीय इमर्सिव अनुभव",
        cta: "रिट्रीट एक्सप्लोर करें",
      },
      course: {
        number: "04",
        eyebrowLabel: "21-दिवसीय सेल्फ-पेस्ड प्रोग्राम",
        cta: "प्रोग्राम एक्सप्लोर करें",
      },
      mentoring: {
        number: "05",
        eyebrowLabel: "व्यक्तिगत मार्गदर्शन",
        cta: "मेंटरिंग के लिए आवेदन करें",
      },
      whatsappCard: {
        title: "सवाल हैं?",
        desc: "पक्का नहीं कि कौन सा प्रोग्राम सही है? सीधे हमें मैसेज करें — एक असली व्यक्ति जवाब देगा, कोई बॉट नहीं।",
        cta: "WhatsApp पर चैट करें",
      },
    },
    homeHabitFeature: {
      eyebrow: "QSR शुरू करने से पहले",
      title: "पहले फोकस की आदत बनाएं",
      lead: "QSR शुरू करने से पहले अपनी दैनिक फोकस आदत बनाएं — फ्री 7-दिन स्टार्टर। एक कम-प्रतिबद्धता वाला 21-दिवसीय गाइडेड शुरुआत, किसी और चीज़ में दाखिला लेने का कोई दबाव नहीं।",
      freeLabel: "7 दिन मुफ़्त",
      priceLabel: "₹99 एकमुश्त",
      noSubscriptionLabel: "कोई मंथली सब्सक्रिप्शन नहीं।",
      cta: "7 दिन मुफ़्त शुरू करें",
      mainScreenshotAlt: "Quantum Mindset & Habit Builder डैशबोर्ड — असली स्ट्रीक और डेली continue स्क्रीन",
    },
    homeMumbaiWorkshop: {
      badge: "नया · पायलट बैच",
      title: "QSR, अब मुंबई में लाइव व्यक्तिगत रूप से",
      desc: "मास्टरक्लास का एक 2-दिवसीय व्यक्तिगत विस्तार — लाइव कोचिंग, एक Cognitive व Focus Engagement Demo, और वही ₹9,999 कीमत।",
      meta: "मुंबई · 2 दिन · ₹9,999 · सीमित सीटें",
      cta: "मुंबई वर्कशॉप एक्सप्लोर करें",
    },
    offlineEegWorkshop: {
      eyebrow: "ऑफलाइन QSR + EEG",
      title: "ऑफलाइन QSR + EEG कॉग्निटिव टेस्टिंग — अब आपके शहर में",
      desc: "क्या आप EEG पर अपनी खुद की ब्रेन स्टेट्स देखना चाहते हैं? हमारी 2-दिवसीय ऑफलाइन QSR वर्कशॉप में लाइव EEG टेस्टिंग शामिल है, ताकि आप अपने Alpha/Theta ट्रेनिंग को हमारे ट्रेनर्स के साथ व्यक्तिगत रूप से ट्रैक कर सकें। आपके 30-दिवसीय प्रोग्राम का बाकी हिस्सा ऑनलाइन, अपनी गति से जारी रहता है।",
      teaserDesc: "क्या आप सिर्फ पढ़ना नहीं, बल्कि EEG पर अपनी खुद की ब्रेन स्टेट्स देखना चाहते हैं? हमारी 2-दिवसीय ऑफलाइन QSR वर्कशॉप में लाइव, व्यक्तिगत EEG टेस्टिंग शामिल है — अब 6 शहरों में उपलब्ध।",
      howItWorksLabel: "यह कैसे काम करता है",
      steps: [
        "अपने नज़दीकी शहर में 2-दिवसीय ऑफलाइन वर्कशॉप के लिए रजिस्टर करें (EEG टेस्टिंग शामिल)",
        "लाइव ब्रेन-स्टेट ट्रैकिंग और हैंड्स-ऑन कोचिंग के लिए 2 दिन व्यक्तिगत रूप से शामिल हों",
        "अपने 30-दिवसीय प्रोग्राम के बाकी सेशन ऑनलाइन जारी रखें",
      ],
      citiesLabel: "उपलब्ध शहर",
      waitlistCta: "वेटलिस्ट जॉइन करें — हम आपके शहर की तारीख कन्फर्म करेंगे",
      registerCta: "अभी रजिस्टर करें",
      teaserCta: "शहर देखें और वेटलिस्ट जॉइन करें",
    },
    homeOverviewVideo: {
      eyebrow: "असली लोग। असली सेशन।",
      title: "माइंड उर माइंड एक्सपीरियंस देखें",
      subtitle: "असली वर्कशॉप्स और असली प्रतिभागियों की एक झलक — कोई प्रचार रील नहीं।",
      closingMessage: "वह रास्ता खोजें जो आपके लिए सही है।",
      cta: "अपना रास्ता एक्सप्लोर करें",
      videoTitle: "माइंड उर माइंड एक्सपीरियंस",
    },
    homeSpeedTest: {
      eyebrow: "हमेशा मुफ़्त",
      title: "आप असल में कितनी तेज़ी से पढ़ते हैं?",
      lead: "ज़्यादातर लोगों ने कभी अपनी असली रीडिंग स्पीड नहीं मापी।",
      desc: "हमारा मुफ़्त रीडिंग स्पीड टेस्ट लें और अपनी मौजूदा रीडिंग स्पीड और क्षमता जानें।",
      cta: "मुफ़्त रीडिंग स्पीड टेस्ट लें",
    },
    homeWhy: {
      eyebrow: "सिर्फ़ कोर्सेज़ से कहीं ज़्यादा",
      title: "सिर्फ़ कोर्सेज़ से कहीं ज़्यादा।",
      subtitle: "सीखने और बदलाव के लिए एक अलग तरीका।",
      lead: "हम यह नहीं मानते कि सभी को एक ही तरीके से सीखना चाहिए।",
      concepts: [
        { title: "सीखें", desc: "ज्ञान और सीखने के सिस्टम", programLabel: "क्वांटम स्पीड रीडिंग" },
        { title: "अभ्यास करें", desc: "रोज़ की एक्सरसाइज़ और संरचित चैलेंजेस", programLabel: "Quantum Mind & Habit Builder" },
        { title: "अनुभव करें", desc: "रिट्रीट्स और इमर्सिव लर्निंग", programLabel: "रिट्रीट्स" },
        { title: "व्यक्तिगत बनाएं", desc: "व्यक्तिगत मेंटरिंग और मार्गदर्शन", programLabel: "1-ऑन-1 मेंटरिंग" },
      ],
    },
    homeGuide: {
      eyebrow: "मेथड के पीछे के शिक्षक",
      title: "डॉ. कपिल शर्मा से मिलें",
      cta: "डॉ. कपिल की यात्रा जानें",
    },
    homeFinalCta: {
      title: "क्या आप अलग तरीके से पढ़ने के लिए तैयार हैं?",
      desc: "फ्री ट्रेनिंग देखें और किसी भी प्रतिबद्धता से पहले खुद यह तरीका देखें।",
      ctaPrimary: "अभी फ्री ट्रेनिंग देखें",
      ctaSecondary: "सभी प्रोग्राम्स एक्सप्लोर करें",
    },
    galleryGlimpse: {
      eyebrow: "एक झलक",
      title: "हमारी वर्कशॉप्स के पल",
      subPrefix: "असली वर्कशॉप्स। असली लोग। भारत के",
      subSuffix: "शहरों में।",
      viewGalleryCta: "पूरी गैलरी देखें",
    },
    galleryPage: {
      eyebrow: "गैलरी",
      title: "असली प्रोग्राम्स के असली पल",
      desc: "वर्कशॉप्स, रिट्रीट्स, और लाइव सेशंस — हर प्रोग्राम के होने पर फ़ोटो जोड़ी जाती हैं।",
      filterAll: "सभी",
      filterWorkshops: "वर्कशॉप्स",
      filterRetreats: "रिट्रीट्स",
      filterQsr: "QSR सेशंस",
    },
    homeFranchiseTeaser: {
      headline: "क्या आप Trainer या Edupreneur हैं?",
      line: "अपना खुद का QSR Training Business शुरू करें — ready platform, marketing kit, और certification के साथ",
      cta: "Franchise Details देखें",
    },
    franchisePage: {
      hero: {
        eyebrow: "फ्रेंचाइज़ी अवसर",
        headline: "क्या आप Trainer या Edupreneur हैं?",
        sub: "अपना खुद का Quantum Speed Reading Training Business शुरू करें — ready platform, marketing kit, और certification के साथ।",
        ctaPrimary: "Certified Trainer बनने के लिए आवेदन करें",
        ctaSecondary: "परिचय वीडियो देखें",
      },
      applyCta: "अभी आवेदन करें",
      problem: {
        eyebrow: "असली चुनौती",
        headline: "अकेले शुरुआत करना मुश्किल है",
        points: [
          {
            title: "तैयार प्लेटफ़ॉर्म नहीं है",
            desc: "कोई कर्रिकुलम या ट्रेनिंग प्लेटफ़ॉर्म नहीं — एक भी क्लास पढ़ाने से पहले आपको सब कुछ शुरुआत से बनाना पड़ेगा।",
          },
          {
            title: "कंटेंट बनाना महंगा है",
            desc: "अपनी खुद की मार्केटिंग सामग्री और कोर्स कंटेंट बनाना समय और पैसा दोनों माँगता है — जो ज़्यादातर नए ट्रेनर्स के पास नहीं होता।",
          },
          {
            title: "मार्केटिंग की जानकारी नहीं है",
            desc: "अच्छा ट्रेनर होने का मतलब यह नहीं कि आपको विद्यार्थी ढूंढना, विज्ञापन चलाना, या डेमो को एडमिशन में बदलना आता है।",
          },
        ],
      },
      included: {
        eyebrow: "आपको क्या मिलता है",
        title: "शुरू करने के लिए सब कुछ",
        items: [
          {
            title: "ट्रेनिंग और सर्टिफिकेशन",
            desc: "एक structured 7-दिन का trainer certification प्रोग्राम, जो आपको सिर्फ एक स्किल सिखाने के बजाय अपनी खुद की Quantum Speed Reading training practice तुरंत शुरू करने और चलाने के लिए तैयार करता है।",
          },
          {
            title: "ब्रांडेड सॉफ्टवेयर",
            desc: "आपके अपने ब्रांड नाम और लोगो के तहत ट्रेनिंग सॉफ्टवेयर का एक्सेस — हमारे नहीं।",
          },
          {
            title: "तैयार लैंडिंग पेज",
            desc: "आपकी अपनी प्रमोशन और एनरोलमेंट को सपोर्ट करने के लिए एक dedicated लैंडिंग पेज।",
          },
          {
            title: "मार्केटिंग सामग्री",
            desc: "अपने ऑडियंस तक प्रोग्राम पहुंचाने में मदद करने वाले resources।",
          },
          {
            title: "Quantum Speed Reading मेथडोलॉजी",
            desc: "डॉ. कपिल देव शर्मा द्वारा 2015 से विकसित और परिष्कृत की गई पूरी, structured कर्रिकुलम।",
          },
          {
            title: "पार्टनर इकोसिस्टम और सपोर्ट",
            desc: "जब भी कोई सवाल हो, माइंड उर माइंड टीम का ऑनगोइंग एक्सेस।",
          },
        ],
      },
      trainerTestimonials: {
        eyebrow: "असली ट्रेनर्स, असली अनुभव",
        title: "असली ट्रेनर्स। असली अनुभव।",
        desc: "देखें कि मेथडोलॉजी सीखने और उसे पढ़ाने की तैयारी के दौरान ट्रेनर्स ने क्या अनुभव किया।",
        verifiedLabel: "WhatsApp के ज़रिए सत्यापित",
        items: [
          { id: "dev-prakash", name: "देव प्रकाश", city: "मुंबई" },
          { id: "saloni-shah", name: "सलोनी शाह", city: "दिल्ली" },
          { id: "sandeep-gupta", name: "संदीप गुप्ता", city: "कोलकाता" },
        ],
      },
      studentTestimonials: {
        eyebrow: "विद्यार्थी क्या कहते हैं",
        title: "विद्यार्थी क्या कहते हैं",
        desc: "Quantum Speed Reading का अनुभव करने वाले विद्यार्थियों के असली अनुभव।",
        videoLabel: "विद्यार्थी की प्रतिक्रिया",
      },
      earning: {
        eyebrow: "कमाई की संभावना",
        headline: "आप कितना कमा सकते हैं",
        scenarios: [
          {
            label: "पार्ट-टाइम",
            desc: "3–5 स्टूडेंट / महीना",
            range: "₹21,600 – ₹36,000",
          },
          {
            label: "एस्टैब्लिश्ड",
            desc: "8–10 स्टूडेंट / महीना",
            range: "₹57,600 – ₹72,000",
          },
          {
            label: "फुल-टाइम",
            desc: "15+ स्टूडेंट / महीना",
            range: "₹1,08,000+",
          },
        ],
        disclaimer: "यह estimate है, गारंटी नहीं — एक उदाहरण कोर्स फ़ीस पर आधारित है। आपकी असली कमाई आपकी मेहनत, local market, और एनरोलमेंट संख्या पर निर्भर करती है।",
      },
      businessModel: {
        eyebrow: "बिज़नेस मॉडल",
        headline: "एक पारदर्शी बिज़नेस मॉडल",
        explanation: "पार्टनर्स अपने खुद के विद्यार्थी लाते हैं और दी गई मेथडोलॉजी, सॉफ्टवेयर व resources का उपयोग करके अपना खुद का ट्रेनिंग बिज़नेस बनाते हैं।",
        onboardingLabel: "One-Time Onboarding Fee",
        onboardingValue: "₹20,000 – ₹25,000",
        revenueLabel: "Revenue Share",
        revenueValue: "15–20%",
        revenueUnit: "प्रति स्टूडेंट एनरोलमेंट",
        monthlyLabel: "मंथली फ़ीस",
        monthlyValue: "₹0",
        renewalLabel: "1 साल बाद रिन्यूअल",
        renewalValue: "₹5,000",
        weProvideTitle: "हम क्या देते हैं",
        weProvideItems: [
          "Quantum Speed Reading मेथडोलॉजी",
          "ट्रेनिंग और सर्टिफिकेशन",
          "आपके अपने नाम और लोगो के साथ ब्रांडेड सॉफ्टवेयर एक्सेस",
          "एक तैयार लैंडिंग पेज",
          "मार्केटिंग सामग्री",
        ],
        youBringTitle: "आप क्या लाते हैं",
        youBringItems: [
          "अपने खुद के विद्यार्थी",
          "अपना खुद का ऑडियंस",
          "अपनी टीचिंग और बिज़नेस मेहनत",
        ],
      },
      howItWorks: {
        eyebrow: "प्रोसेस",
        headline: "यह कैसे काम करता है",
        steps: [
          { title: "आवेदन करें", desc: "एप्लीकेशन फ़ॉर्म के ज़रिए अपनी रुचि बताएं।" },
          { title: "फ़ॉर्म", desc: "अपनी पृष्ठभूमि और रुचि की वजह बताएं।" },
          { title: "स्क्रीनिंग", desc: "हमारी टीम आपके आवेदन की समीक्षा करती है।" },
          { title: "कॉल", desc: "दोनों तरफ़ से फ़िट समझने के लिए एक छोटी बातचीत।" },
          { title: "सिलेक्शन", desc: "चुने गए पार्टनर्स सर्टिफिकेशन की ओर बढ़ते हैं।" },
          { title: "ट्रेनिंग", desc: "पूरी Quantum Speed Reading मेथडोलॉजी सीखें।" },
          { title: "सर्टिफिकेशन", desc: "7-दिन का सर्टिफिकेशन प्रोग्राम पूरा करें।" },
        ],
      },
      about: {
        eyebrow: "परिचय",
        headline: "आप किनके साथ पार्टनर बन रहे हैं",
        bio: "डॉ. कपिल देव शर्मा को एक mind trainer और coach के रूप में 26 साल का अनुभव है। उन्होंने 2015 में Quantum Speed Reading मेथडोलॉजी बनाई, और तब से इसे लगातार एक structured, cognitive-science-based प्रोग्राम में विकसित किया है — यही कर्रिकुलम और ट्रेनिंग मेथड इस पार्टनर प्रोग्राम का आधार है।",
        credentials: [
          "mind trainer और coach के रूप में 26 साल",
          "Quantum Speed Reading मेथडोलॉजी के निर्माता, 2015 से",
          "10,000+ विद्यार्थियों को सीधे गाइड किया",
        ],
        videoTitle: "क्वांटम स्पीड रीडिंग परिचय",
      },
      whoFor: {
        eyebrow: "यह किनके लिए है",
        headline: "क्या यह आपके लिए सही है?",
        cards: [
          {
            title: "हाल के ग्रेजुएट्स",
            desc: "करियर शुरू करना चाहते हैं, शुरुआत से बनाने के बजाय एक तैयार कर्रिकुलम के साथ।",
          },
          {
            title: "कोचिंग सेंटर / ट्यूशन ओनर्स",
            desc: "अपने मौजूदा बिज़नेस में एक high-demand प्रोग्राम जोड़कर एक नया रेवेन्यू स्ट्रीम चाहते हैं।",
          },
          {
            title: "टीचर्स",
            desc: "अपने मौजूदा काम के साथ अपने खुद के सेशन चलाकर पार्ट-टाइम या साइड इनकम चाहते हैं।",
          },
        ],
      },
      faq: {
        eyebrow: "सवाल-जवाब",
        headline: "अक्सर पूछे जाने वाले सवाल",
        items: [
          {
            question: "Certified trainer कौन बन सकता है?",
            answer: "टीचर्स, कोचिंग सेंटर या ट्यूशन ओनर्स, हाल के ग्रेजुएट्स, और ग्रुप के सामने बोलने में सहज कोई भी व्यक्ति। कोई फिक्स्ड एजुकेशनल requirement नहीं है।",
          },
          {
            question: "क्या मुझे पहले से टीचिंग अनुभव चाहिए?",
            answer: "कोई औपचारिक टीचिंग डिग्री ज़रूरी नहीं, लेकिन आपको ग्रुप के सामने बोलने में सहज होना चाहिए। सर्टिफिकेशन प्रोग्राम खुद आपको तकनीक और सेशन चलाना दोनों सिखाता है।",
          },
          {
            question: "सर्टिफिकेशन में कितना समय लगता है?",
            answer: "सर्टिफिकेशन प्रोग्राम 7 दिन का है, जो आपकी स्क्रीनिंग कॉल और सिलेक्शन के बाद पूरा होता है।",
          },
          {
            question: "मुझे बिल्कुल क्या मिलता है?",
            answer: "ट्रेनिंग और Quantum Speed Reading सर्टिफिकेशन, आपके अपने ब्रांड नाम और लोगो के तहत ट्रेनिंग सॉफ्टवेयर का एक्सेस, एक तैयार लैंडिंग पेज, और प्रोग्राम प्रमोट करने में मदद करने वाली मार्केटिंग सामग्री।",
          },
          {
            question: "क्या आप विद्यार्थी उपलब्ध कराते हैं?",
            answer: "नहीं। आप अपने खुद के विद्यार्थी और ऑडियंस लाते हैं — हम मेथडोलॉजी, ट्रेनिंग, सर्टिफिकेशन, ब्रांडेड सॉफ्टवेयर, लैंडिंग पेज, और मार्केटिंग सामग्री देकर आपको उन्हें पढ़ाने में सपोर्ट करते हैं।",
          },
          {
            question: "क्या मार्केटिंग सपोर्ट शामिल है?",
            answer: "एक तैयार लैंडिंग पेज और मार्केटिंग सामग्री, ताकि आप अपने ऑडियंस तक प्रोग्राम पहुंचा सकें। विद्यार्थी ढूंढना और एनरोल करना आपकी ज़िम्मेदारी है।",
          },
          {
            question: "क्या कोई मंथली फ़ीस है?",
            answer: "नहीं। कोई मंथली फ़ीस नहीं है।",
          },
          {
            question: "ऑनबोर्डिंग फ़ीस क्या है?",
            answer: "₹20,000–₹25,000 की एक-बार की पार्टनर ऑनबोर्डिंग फ़ीस, जिसमें आपकी ट्रेनिंग, सर्टिफिकेशन, ब्रांडेड सॉफ्टवेयर, लैंडिंग पेज, और मार्केटिंग सामग्री शामिल है।",
          },
          {
            question: "Revenue share क्या है?",
            answer: "हर स्टूडेंट एनरोलमेंट का 15–20% माइंड उर माइंड एकेडमी को जाता है — यह आपकी असली कमाई के साथ बदलता है, कोई फिक्स्ड फ़ीस नहीं है।",
          },
          {
            question: "क्या रिन्यूअल फ़ीस है, और 1 साल बाद क्या होता है?",
            answer: "हां — certified partner के रूप में आपके पहले साल के बाद ₹5,000 की रिन्यूअल फ़ीस लागू होती है। यह फ़ीस चुकाने पर आपकी पार्टनरशिप जारी रहती है, और आपको मिलने वाली चीज़ों या revenue share में कोई और बदलाव नहीं होता।",
          },
          {
            question: "आवेदन प्रोसेस क्या है?",
            answer: "नीचे दिए गए फ़ॉर्म से आवेदन करें, एक छोटा background फ़ॉर्म भरें, हमारी टीम के साथ स्क्रीनिंग और कॉल से गुज़रें, और — सिलेक्ट होने पर — अपनी 7-दिन की ट्रेनिंग और सर्टिफिकेशन शुरू करें।",
          },
        ],
      },
      apply: {
        eyebrow: "आवेदन करें",
        title: "अपनी Quantum Speed Reading Training Practice बनाने के लिए तैयार हैं?",
        sub: "Certified trainer बनने के लिए आवेदन करें और जानें कि यह पार्टनरशिप आपके लिए सही है या नहीं।",
        instantApplyCta: "WhatsApp पर तुरंत आवेदन करें",
        talkToTeamLabel: "हमारी टीम से बात करें",
      },
      whatsapp: {
        bubble: "Certified trainer बनने के बारे में सवाल हैं? हमारी टीम से तुरंत चैट करें।",
        button: "WhatsApp पर चैट करें",
        ariaLabel: "Trainer partner प्रोग्राम के बारे में माइंड उर माइंड टीम से WhatsApp पर चैट करें",
      },
    },
    testimonials: {
      eyebrow: "वास्तविक लोग, वास्तविक बदलाव",
      title: "जब आप अलग तरीके से पढ़ते हैं, तो क्या बदलता है",
      desc: "क्वांटम स्पीड रीडिंग से गुज़रे कुछ विद्यार्थी, पेशेवर और परीक्षा उम्मीदवार — उन्हीं के शब्दों में।",
      videoLabel: "असली कहानियां देखें",
      viewAll: "और कहानियां देखें",
      items: [
        {
          id: "ananya-r",
          qsrPageOnly: false,
          name: "अनन्या आर.",
          program: "क्वांटम स्पीड रीडिंग",
          programKey: "qsr",
          quote: "जितने समय में पहले एक अध्याय पूरा होता था, अब उतने समय में दो किताबें पूरी हो जाती हैं।",
          context: "",
          result: "~2 गुना तेज़ पढ़ाई",
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "dr-preeti",
          qsrPageOnly: true,
          name: "डॉ. प्रीति",
          program: "क्वांटम स्पीड रीडिंग",
          programKey: "qsr",
          quote:
            "क्वांटम स्पीड रीडिंग वर्कशॉप ने मेडिकल जर्नल्स पढ़ने का मेरा तरीका पूरी तरह बदल दिया; अब मैं विस्तृत शोध पत्रों को पहले से कहीं कम समय में पढ़ लेती हूं।",
          context: "मुंबई",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "shailesh",
          qsrPageOnly: true,
          name: "शैलेश",
          program: "क्वांटम स्पीड रीडिंग",
          programKey: "qsr",
          quote:
            "एक व्यवसायी के रूप में, इस प्रोग्राम में शामिल होने के बाद मार्केट रिपोर्ट्स और वित्तीय विवरण पढ़ना काफी तेज़ हो गया है।",
          context: "अहमदाबाद · व्यवसायी",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "sudha",
          qsrPageOnly: true,
          name: "सुधा",
          program: "क्वांटम स्पीड रीडिंग",
          programKey: "qsr",
          quote:
            "शुरुआत में मुझे संदेह था, लेकिन 30-दिन की प्रैक्टिस स्ट्रीक ने मेरे फोकस और समग्र पठन-बोध को उम्मीद से कहीं बेहतर बना दिया।",
          context: "कोलकाता",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "vikram-malhotra",
          qsrPageOnly: true,
          name: "विक्रम मल्होत्रा",
          program: "क्वांटम स्पीड रीडिंग",
          programKey: "qsr",
          quote:
            "लाइव सेशंस और रोज़ाना ऐप प्रैक्टिस के संयोजन ने मुझे जीवनभर की रीडिंग रुकावट से बाहर निकालने में मदद की।",
          context: "बेंगलुरु",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "amit-patel",
          qsrPageOnly: true,
          name: "अमित पटेल",
          program: "क्वांटम स्पीड रीडिंग",
          programKey: "qsr",
          quote:
            "एक गहरा मानसिक रीबूट — मेरी स्मरण शक्ति काफी बढ़ गई, और अब मैं मोटी मैनेजमेंट किताबें एक ही बैठक में पूरी कर लेता हूं।",
          context: "सूरत",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "karan-mehra",
          qsrPageOnly: true,
          name: "करण मेहरा",
          program: "क्वांटम स्पीड रीडिंग",
          programKey: "qsr",
          quote:
            "इन 30 दिनों में मिली मानसिक स्पष्टता और गति ने मेरे पढ़ाई और तैयारी के समय को काफी कम कर दिया है।",
          context: "जयपुर",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "vikram-s",
          qsrPageOnly: false,
          name: "विक्रम एस.",
          program: "11-दिवसीय ऑनलाइन रिट्रीट",
          programKey: "retreat",
          quote: "अकेले कुंडलिनी सत्र ही पूरे ग्यारह दिनों के लायक थे।",
          context: "",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "priya-m",
          qsrPageOnly: false,
          name: "प्रिया एम.",
          program: "पर्सनल क्लास",
          programKey: "mentoring",
          quote: "छह निजी सत्रों ने वह कर दिखाया जो वर्षों की सामान्य सलाह कभी नहीं कर पाई।",
          context: "",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
        {
          id: "rohan-k",
          qsrPageOnly: false,
          name: "रोहन के.",
          program: "ओवरथिंकिंग मास्टरी",
          programKey: "course",
          quote: "इक्कीस दिन, और आखिरकार मेरे सिर का शोर शांत हो गया।",
          context: "",
          result: undefined,
          videoUrl: "[VIDEO URL NEEDED]",
        },
      ],
    },
    faq: {
      eyebrow: "संपर्क करने से पहले",
      title: "शुरू करने से पहले लोग जो सवाल पूछते हैं",
      desc: "ज़्यादातर लोग जिन बातों पर हिचकिचाते हैं, उनके सीधे जवाब। फिर भी असमंजस में हैं? नीचे सीधे हमसे संपर्क करें।",
      items: [
        {
          question: "क्वांटम स्पीड रीडिंग किनके लिए है?",
          answer:
            "हर उम्र के विद्यार्थी, कामकाजी पेशेवर, और जीवन-पर्यंत सीखने वाले जो जानकारी को तेज़ी से पढ़ना, सीखना और याद रखना चाहते हैं — पहले से किसी स्पीड-रीडिंग अनुभव की ज़रूरत नहीं।",
        },
        {
          question: "मैं इसमें बिल्कुल नया हूं — क्या यह मेरे लिए काम करेगा?",
          answer:
            "हां, बिल्कुल। हर कार्यक्रम शून्य से शुरू होता है। क्वांटम स्पीड रीडिंग में किसी पूर्व कौशल की ज़रूरत नहीं — डॉ. शर्मा ने 2014 से अब तक 10,000+ विद्यार्थियों को पूर्ण शुरुआती से उन्नत अभ्यासी तक मार्गदर्शन दिया है।",
        },
        {
          question: "क्या यह सम्मोहन है या कोई अवैज्ञानिक तरीका?",
          answer:
            "नहीं। यह न्यूरोसाइंस पर आधारित कॉग्निटिव ट्रेनिंग है — आई-मूवमेंट रीट्रेनिंग, श्वास-आधारित फोकस अभ्यास, और मेमोरी तकनीकें। हम असली प्रगति EEG से ट्रैक करते हैं, दावों से नहीं। इसमें कोई सम्मोहन नहीं, कोई ब्लाइंडफोल्ड रीडिंग नहीं, किसी विश्वास प्रणाली की ज़रूरत नहीं — इसे उसी तरह प्रशिक्षित किया जाता है जैसे कोई भी अन्य कॉग्निटिव स्किल।",
        },
        {
          question: "QSR मास्टरक्लास की कीमत कितनी है, और इसमें क्या शामिल है?",
          answer:
            "30-दिवसीय क्वांटम स्पीड रीडिंग लाइव मास्टरक्लास की कीमत ₹9,999 है, एकमुश्त — पूरा पाठ्यक्रम, डॉ. शर्मा के साथ 7 लाइव सेशन, और पूरे समय ऐप एक्सेस, ऑनलाइन विद्यार्थियों के लिए हमारी 100% रिज़ल्ट गारंटी के साथ। हम प्रोग्राम का मुफ़्त एक्सेस नहीं देते, लेकिन आप पहले फ्री ट्रेनिंग वीडियो देख सकते हैं या हमारा मुफ़्त 2-मिनट स्पीड टेस्ट आज़मा सकते हैं। जो ग्रेजुएट्स बाद में भी ऐप अभ्यास जारी रखना चाहते हैं, वे ₹499/माह में जारी रख सकते हैं।",
        },
        {
          question: "ऑफलाइन वर्कशॉप + EEG टेस्टिंग कैसे काम करती है, और यह किन शहरों में है?",
          answer:
            "हमारी 2-दिवसीय ऑफलाइन QSR वर्कशॉप उसी 30-दिवसीय प्रोग्राम में लाइव, व्यक्तिगत EEG टेस्टिंग जोड़ती है: आप अपने नज़दीकी शहर के लिए रजिस्टर करते हैं, हैंड्स-ऑन कोचिंग और असली EEG ब्रेन-स्टेट ट्रैकिंग के लिए 2 दिन व्यक्तिगत रूप से शामिल होते हैं, फिर बाकी सेशन अपनी गति से ऑनलाइन जारी रखते हैं। फिलहाल मुंबई, पुणे, वडोदरा, सूरत, अहमदाबाद, और नोएडा में उपलब्ध — सटीक बैच तारीखें शहर-दर-शहर तय होती हैं, इसलिए ज़्यादातर शहर तारीख पक्की होने तक वेटलिस्ट पर रहते हैं, न कि एक तय 'अभी रजिस्टर करें' तारीख पर जिसकी हम अभी गारंटी नहीं दे सकते।",
        },
        {
          question: "ये कार्यक्रम किस आयु वर्ग के लिए बने हैं?",
          answer:
            "विद्यार्थी, कामकाजी पेशेवर, और हर उम्र के जीवन-पर्यंत सीखने वाले इन कार्यक्रमों से गुज़रते हैं — परीक्षा की तैयारी करने वाले किशोरों से लेकर पहली बार ध्यान करने वाले रिटायर्ड लोगों तक। हर ट्रैक आपकी स्थिति के अनुसार गति में रहता है।",
        },
        {
          question: "मुझे किस प्रोग्राम से शुरुआत करनी चाहिए?",
          answer:
            "अगर आप खासतौर पर तेज़ी से पढ़ना और सीखना चाहते हैं, तो क्वांटम स्पीड रीडिंग से शुरू करें — इस साइट का फ्लैगशिप प्रोग्राम। अगर आप पहले सबसे आसान, सबसे कम कमिटमेंट वाला रास्ता चाहते हैं, तो QSR से पहले Quantum Mind & Habit Builder के मुफ़्त 7 दिनों से शुरू करें। अगर आप गहरे आंतरिक कार्य की तलाश में हैं, तो रिट्रीट्स एक्सप्लोर करें या 1-ऑन-1 मेंटरिंग के लिए आवेदन करें।",
        },
        {
          question: "क्या Quantum Mind & Habit Builder वाकई मुफ़्त है?",
          answer:
            "हां — दिन 1 से 7 पूरी तरह मुफ़्त हैं, शुरू करने के लिए कोई कार्ड ज़रूरी नहीं। दिन 8 से आगे जारी रखने के लिए ₹99 की एक-बार की पेमेंट है।",
        },
        {
          question: "7 दिन के मुफ़्त पीरियड के बाद क्या होता है?",
          answer:
            "आगे जारी रखने के लिए आपसे एक-बार ₹99 की पेमेंट करने को कहा जाएगा। कुछ भी अपने आप चार्ज नहीं होता — जारी रखना है या नहीं, यह आप तय करते हैं।",
        },
        {
          question: "क्या ₹99 एक सब्सक्रिप्शन है?",
          answer: "नहीं। ₹99 पूरी यात्रा जारी रखने के लिए एक-बार की पेमेंट है — किसी भी समय कोई रिकरिंग चार्ज नहीं है।",
        },
        {
          question: "क्या रिट्रीट्स ऑनलाइन हैं या रेजिडेंशियल?",
          answer:
            "दोनों। 11-दिवसीय ऑनलाइन ध्यान एंड इनर मास्टरी रिट्रीट हर महीने चलता है, जहां से भी आप हों; ऋषिकेश और लोनावला में रेजिडेंशियल रिट्रीट वर्ष में 3–4 बार छोटे समूहों में उन लोगों के लिए होते हैं जो पूरी तरह व्यक्तिगत उपस्थिति वाला प्रारूप चाहते हैं।",
        },
        {
          question: "अगला ऑनलाइन रिट्रीट या रेजिडेंशियल बैच कब है?",
          answer:
            "11-दिवसीय ऑनलाइन रिट्रीट हर महीने चलता है; ऋषिकेश और लोनावला में रेजिडेंशियल रिट्रीट वर्ष में 3–4 बार छोटे समूहों में आयोजित होते हैं। अगली पक्की तारीख और बची हुई सीटों के लिए हमसे WhatsApp पर बात करें।",
        },
        {
          question: "1-ऑन-1 मेंटरिंग कैसे काम करती है?",
          answer:
            "पर्सनल क्लास डॉ. शर्मा के साथ सीधे, निजी, कस्टम-पेस्ड मेंटरिंग है — सेशन पूरी तरह आपके अपने लक्ष्यों और चुनौतियों के आसपास बनाए जाते हैं, किसी फिक्स्ड कर्रिकुलम पर नहीं। फिट और शेड्यूलिंग पर चर्चा के लिए आवेदन करें।",
        },
        {
          question: "क्या मुझे किसी विशेष चीज़ में विश्वास रखना ज़रूरी है — क्या यह धार्मिक है?",
          answer:
            "किसी विशेष विश्वास प्रणाली की आवश्यकता नहीं है। ध्यान और जागरूकता का यह कार्य श्वास-अभ्यास और आंतरिक-जागरूकता की तकनीकों पर आधारित है — आप अपना खुलापन लाएं, विधि हम बताएंगे।",
        },
        {
          question: "अगर मेरा सवाल यहां नहीं है तो?",
          answer: "डॉ. कपिल की टीम को सीधे WhatsApp पर संदेश भेजें — असली, सीधा जवाब मिलेगा, कोई बॉट नहीं।",
        },
      ],
      ctaLabel: "WhatsApp पर पूछें",
    },
    whatsapp: {
      bubble: "रिट्रीट्स या मास्टरक्लास के बारे में सवाल हैं? डॉ. कपिल की टीम से सीधे बात करें।",
      button: "WhatsApp पर चैट करें",
      ariaLabel: "डॉ. कपिल की टीम से WhatsApp पर चैट करें",
    },
    footer: {
      blurb: "डॉ. कपिल देव शर्मा के मार्गदर्शन में क्वांटम स्पीड रीडिंग और उन्नत मेडिटेशन एवं माइंड-ट्रेनिंग।",
      columns: {
        programs: {
          heading: "प्रोग्राम्स",
          links: [
            { label: "क्वांटम स्पीड रीडिंग", href: "/programs/quantum-speed-reading" },
            { label: "क्वांटम माइंडसेट एंड हैबिट बिल्डर", href: "/programs/habit-builder" },
          ],
        },
        retreats: {
          heading: "रिट्रीट्स",
          links: [
            { label: "ऑनलाइन 11-दिवसीय रिट्रीट", href: "/retreats/online-11-day" },
            { label: "रेजिडेंशियल रिट्रीट", href: "/retreats/residential" },
          ],
        },
        mentoring: {
          heading: "मेंटरिंग",
          links: [
            { label: "पर्सनल क्लास (1-ऑन-1)", href: "/mentoring/personal-class" },
            { label: "ओवरथिंकिंग मास्टरी", href: "/mentoring/overthinking-course" },
          ],
        },
        habitApp: {
          heading: "क्वांटम माइंड ऐप",
          links: [{ label: "Habit Builder — 7 दिन मुफ़्त, ₹99 एकमुश्त", href: "/programs/habit-builder" }],
        },
        philosophy: {
          heading: "डॉ. कपिल का दर्शन",
          links: [
            { label: "हमारे बारे में", href: "/about" },
            { label: "संपर्क करें", href: "/contact" },
            { label: "पार्टनर बनें", href: "/franchise-individual" },
          ],
        },
      },
      copyright: "© माइंड उर माइंड। mindurmind.org.in",
      location: "वडोदरा, गुजरात, भारत",
    },
    contactPage: {
      headline: "संपर्क करें",
      sub: "किसी प्रोग्राम, पेमेंट के बारे में सवाल हैं, या समझ नहीं आ रहा कहां से शुरू करें? सीधे हमसे संपर्क करें।",
      emailLabel: "ईमेल",
      whatsappLabel: "WhatsApp / फ़ोन",
      addressLabel: "पता",
      address: "गीतांजलि डुप्लेक्स, नोविनो–तरसाली रोड, वडोदरा, गुजरात, भारत",
      responseTime: "हम सभी प्रश्नों का उत्तर 24 घंटों के भीतर देते हैं।",
      ctaPrimary: "WhatsApp पर चैट करें",
      ctaSecondary: "या हमें ईमेल करें",
    },
    aboutPage: {
      headline: "माइंड उर माइंड के बारे में",
      body: [
        "माइंड उर माइंड की स्थापना 2014 में डॉ. कपिल देव शर्मा ने की थी, जिन्होंने शैक्षणिक शोध और प्रत्यक्ष कोचिंग को एक ही प्रैक्टिस में जोड़ा — इस पर केंद्रित कि लोग कैसे पढ़ते हैं, सोचते हैं, और अपने मन को कैसे संभालते हैं।",
        "जो व्यक्तिगत वर्कशॉप्स के रूप में शुरू हुआ, वह अब प्रोग्राम्स की एक पूरी रेंज बन चुका है — क्वांटम स्पीड रीडिंग, आध्यात्मिक रिट्रीट्स, वन-ऑन-वन मेंटरिंग, और क्वांटम माइंड ऐप — फिर भी एक ही सिद्धांत में जड़ें जमाए हुए: असली संज्ञानात्मक और व्यक्तिगत बदलाव संरचित, निरंतर अभ्यास से आता है, त्वरित उपायों से नहीं।",
        "माइंड उर माइंड डॉ. कपिल देव शर्मा के नेतृत्व में एक प्रोप्राइटरशिप है, जो वडोदरा, गुजरात में स्थित है, और पूरे भारत में विद्यार्थियों, पेशेवरों, और आजीवन सीखने वालों के साथ काम करती है।",
      ],
      stats: [
        { value: "10,000+", label: "विद्यार्थियों का मार्गदर्शन" },
        { value: "500+", label: "वर्कशॉप्स आयोजित" },
        { value: "2014", label: "स्थापना वर्ष" },
      ],
      guide: {
        eyebrow: "संस्थापक",
        title: "डॉ. कपिल देव शर्मा",
        credential: "प्रोफेसर · शोधकर्ता · लाइफ कोच · 26 वर्षों का अनुभव",
        bio: "डॉ. कपिल देव शर्मा 26 वर्षों का अनुभव लाते हैं — औपचारिक शिक्षा में 15 वर्ष प्रोफेसर और शोधकर्ता के रूप में, और 11 वर्ष लाइफ कोच और माइंड ट्रेनर के रूप में। यही शैक्षणिक कठोरता और प्रत्यक्ष कोचिंग अभ्यास का मेल तय करता है कि सेशंस कैसे बनाए जाते हैं।",
        stats: [
          { value: "26", label: "कुल वर्ष" },
          { value: "15", label: "वर्ष प्रोफेसर" },
          { value: "11", label: "वर्ष कोचिंग" },
        ],
        quote:
          "ज़्यादातर लोग पहले से जानते हैं कि उन्हें क्या बदलना है। मुश्किल काम यह समझना है कि उन्होंने अब तक ऐसा क्यों नहीं किया — और वे स्थितियां बनाना जिनमें यह संभव हो सके।",
      },
    },
    qsrLanding: {
      hero: {
        eyebrow: "साइंस-बैक्ड एडवांस्ड न्यूरो-कॉग्निटिव ट्रांसफॉर्मेशन प्रोग्राम",
        headline: "विद्यार्थियों, प्रतियोगी परीक्षा उम्मीदवारों और अभिभावकों के लिए —",
        headlineEm: "साइंस-बैक्ड क्वांटम स्पीड रीडिंग",
        sub: "घंटों पढ़ते हैं पर अगले दिन तक भूल जाते हैं? यह इच्छाशक्ति की कमी नहीं है — यह इस बात का मामला है कि आपका दिमाग कैसे पढ़ता है।",
        ctaPrimary: "अभी फ्री ट्रेनिंग देखें",
        ctaPrimaryMeta: "फ्री · कभी भी देखें",
        ctaSecondary: "अपनी बैच सीट सुरक्षित करें",
        ctaSecondaryMeta: "₹9,999 · एकमुश्त नामांकन",
        ctaTertiary: "या मुफ़्त 2-मिनट स्पीड टेस्ट लें",
        trustLine: "विद्यार्थियों, पेशेवरों, और हर आयु वर्ग के आजीवन सीखने वालों के लिए।",
        visualCaption: "आपकी 30-दिवसीय स्ट्रीक दिन 1 से शुरू होती है",
      },
      speedTestCta: {
        afterScience: "जानना चाहते हैं कि आप असल में कितनी तेज़ी से पढ़ते हैं? मुफ़्त 2-मिनट टेस्ट लें।",
        beforePricing: "अभी फैसला नहीं कर पा रहे? पहले मुफ़्त 2-मिनट रीडिंग स्पीड टेस्ट आज़माएं — कोई कार्ड ज़रूरी नहीं।",
      },
      whoIsThisFor: {
        title: "यह किसके लिए है?",
        cards: [
          {
            title: "प्रतियोगी परीक्षा उम्मीदवार",
            desc: "UPSC, JEE, NEET, बैंकिंग — सिलेबस बहुत बड़ा, रिवीज़न के लिए समय बहुत कम।",
          },
          {
            title: "स्कूल का छात्र",
            desc: "घंटों होमवर्क और किताबें पढ़ना, फिर भी परीक्षा के दिन तक याद नहीं रहता।",
          },
          {
            title: "कामकाजी पेशेवर",
            desc: "रिपोर्ट्स, रिसर्च और रीडिंग — इतनी तेज़ी से जमा होती है कि पूरी नहीं हो पाती।",
          },
        ],
      },
      painPoints: {
        eyebrow: "जाना-पहचाना लगता है?",
        title: "असली समस्या मेहनत की कमी नहीं है",
        toggleSelf: "मैं अपने लिए सीख रहा/रही हूं",
        toggleParent: "मैं अपने बच्चे के लिए देख रहा/रही हूं",
        self: {
          title: "प्रतियोगी परीक्षा उम्मीदवारों के लिए",
          items: [
            "बचे हुए समय में रिवीज़न के लिए सिलेबस बहुत बड़ा है",
            "टेस्ट तक आते-आते पूरे चैप्टर भूल जाना",
            "पढ़ाई के घंटे नतीजों के अनुपात में नहीं मिलना",
            "दूसरे उम्मीदवारों को खुद से आगे बढ़ता देखना",
            "करेंट अफेयर्स और लंबे पैसेज पढ़ने में बहुत समय लगना",
          ],
        },
        parent: {
          title: "अपने बच्चे के लिए विचार कर रहे अभिभावकों के लिए",
          items: [
            "आपका बच्चा घंटों पढ़ता है पर बहुत कम याद रख पाता है",
            "होमवर्क और स्कूल की रीडिंग लंबी खिंचती है, सोने का समय देर होता जाता है",
            "स्क्रीन टाइम ने ध्यान केंद्रित करने की क्षमता को साफ़ तौर पर कम कर दिया है",
            "रिवीज़न समय पर पूरा न होने के कारण परीक्षा से पहले साफ़ दिखने वाला तनाव",
            "आपको \"सम्मोहन\" या असत्यापित तरीकों से सावधानी है — आपको यह देखना है कि यह वाकई विज्ञान-आधारित है",
          ],
        },
      },
      trustBadge: {
        title: "व्यक्तिगत रूप से पुष्टि, कोई ऑटोमेशन नहीं",
        desc: "हर नामांकन की पुष्टि चेकआउट के 24 घंटों के भीतर डॉ. कपिल की अपनी टीम करती है — एक असली व्यक्ति, कोई बॉट नहीं।",
        secondaryLine: "Razorpay के ज़रिए सुरक्षित चेकआउट · 2014 से 10,000+ विद्यार्थी",
      },
      guarantee: {
        title: "ऑनलाइन विद्यार्थियों के लिए 100% रिज़ल्ट गारंटी",
        desc: "पूरा 30-दिवसीय प्रोटोकॉल निर्देशानुसार पूरा करें — हर ऐप सेशन, सभी 7 लाइव मास्टरक्लास। अगर आपने ऐसा किया और आपकी रीडिंग स्पीड व समझ मापने योग्य रूप से नहीं सुधरी, तो हमें बताएं और हम पूरा रिफंड जारी करेंगे।",
        policyLabel: "हमारी रिफंड और कैंसिलेशन नीति देखें",
        heroLine: "100% रिज़ल्ट गारंटी — पूरा 30-दिवसीय प्रोटोकॉल पूरा करें, या पूरा रिफंड पाएं।",
      },
      brainScience: {
        eyebrow: "इसके पीछे का विज्ञान",
        title: "यह तरीका क्यों काम करता है, जब बाकी तरीके नहीं करते",
        desc: "क्वांटम स्पीड रीडिंग कोई तिकड़म नहीं है — यह चार खास संज्ञानात्मक प्रणालियों को फिर से प्रशिक्षित करती है, जिन्हें ज़्यादातर पढ़ने की आदतें कभी छूती ही नहीं।",
        cards: [
          {
            title: "राइट-ब्रेन क्षमताएं",
            desc: "पारंपरिक पढ़ाई लगभग पूरी तरह मस्तिष्क के भाषा-प्रोसेसिंग वाले हिस्से पर निर्भर करती है। यह प्रशिक्षण दायें गोलार्ध की समानांतर प्रोसेसिंग और पैटर्न पहचान को भी इसमें शामिल करता है — ताकि आप एक-एक शब्द नहीं, बल्कि समानांतर रूप में ग्रहण करें।",
          },
          {
            title: "विज़ुअलाइज़ेशन और अंतर्ज्ञान",
            desc: "जब राइट-ब्रेन सक्रिय होता है, तो जानकारी सार अक्षरों की बजाय जीवंत मानसिक चित्रों के रूप में जुड़ जाती है। यही इसे याद रखने लायक बनाता है — और यही वह अनुभव है जब ज़्यादातर लोग कहते हैं कि वे आखिरकार जो पढ़ रहे हैं उसे \"देख\" पा रहे हैं।",
          },
          {
            title: "पेरिफेरल विज़न",
            desc: "ज़्यादातर पाठक केवल अपने केंद्र-बिंदु पर मौजूद कुछ अक्षर ही ग्रहण करते हैं। अपने पेरिफेरल दृष्टि क्षेत्र का विस्तार करने से आपकी आंखें एक ही फिक्सेशन में पूरे वाक्यांश — कभी-कभी पूरी पंक्तियां — ग्रहण कर पाती हैं।",
          },
          {
            title: "गहन एकाग्रता",
            desc: "ऊपर बताई गई कोई भी बात बिना निरंतर, विकर्षण-मुक्त फोकस के टिक नहीं पाती। वही दैनिक अभ्यास जो पढ़ने की गति बढ़ाते हैं, आपकी लंबे समय तक एक ही काम पर ध्यान केंद्रित करने की क्षमता को भी प्रशिक्षित करते हैं।",
          },
        ],
      },
      neuroCognitive: {
        eyebrow: "एडवांस्ड न्यूरो-कॉग्निटिव ट्रेनिंग",
        title: "एक साइंस-बैक्ड न्यूरो-कॉग्निटिव ट्रांसफॉर्मेशन प्रोग्राम",
        desc: "यह सिर्फ़ तेज़ पढ़ना नहीं है — यह गहन फोकस और स्थायी याददाश्त से जुड़ी मस्तिष्क अवस्थाओं की ओर संरचित प्रशिक्षण है, जिसमें आपकी अपनी प्रगति Day 1 से ही असली कॉग्निटिव मेट्रिक्स पर ट्रैक होती है।",
        metrics: [
          {
            label: "ब्रेन स्कोर",
            desc: "आपकी असली रीडिंग ग्रोथ और कॉम्प्रिहेंशन डेटा से बना एक समग्र स्कोर, आपकी अपनी Day 1 बेसलाइन से ट्रैक किया जाता है।",
          },
          {
            label: "कॉम्प्रिहेंशन %",
            desc: "आप जो पढ़ते हैं उसमें से वास्तव में कितना याद रखते हैं — हर सेशन में स्कोर होता है, स्पीड कभी अकेले नहीं बताई जाती।",
          },
          {
            label: "कंसिस्टेंसी",
            desc: "आपकी दैनिक अभ्यास स्ट्रीक — यह सबसे मज़बूत असली संकेतक है कि ट्रेनिंग वाकई असर करेगी या नहीं।",
          },
        ],
        comparison: {
          title: "सामान्य पढ़ाई बनाम क्वांटम स्पीड रीडिंग",
          normal: {
            label: "सामान्य पढ़ाई — अभी क्या हो रहा है",
            points: [
              "आंखें बार-बार रुक-रुक कर उछलती हैं (सैकेड्स) और बार-बार पीछे जाती हैं — प्रति पंक्ति 10–15 रुकावटें",
              "दिमाग ज़्यादातर हाई-फ़्रीक्वेंसी बीटा अवस्था में रहता है — सजग लेकिन मेहनत भरा, जल्दी थकान",
              "बायां गोलार्ध ज़्यादातर काम करता है (सिर्फ़ भाषा/शब्द प्रोसेसिंग) — दायां गोलार्ध (पैटर्न/इमेज प्रोसेसिंग) ज़्यादातर निष्क्रिय रहता है",
            ],
            result: "नतीजा: धीमी गति, कम याददाश्त, जल्दी मानसिक थकान",
          },
          quantum: {
            label: "क्वांटम स्पीड रीडिंग के साथ",
            points: [
              "आंखें व्यापक विज़ुअल स्पैन में चलने के लिए प्रशिक्षित (पेरिफेरल विज़न ट्रेनिंग) — कम फिक्सेशन और कम पीछे जाना",
              "श्वास और फोकस अभ्यास दिमाग को अल्फा अवस्था (शांत-सजग) में लाते हैं; गहरे अभ्यास से छोटे थीटा बर्स्ट बनते हैं जो याददाश्त के सुदृढ़ीकरण से जुड़े हैं",
              "बायां और दायां दोनों गोलार्ध साथ काम करते हैं — शब्द भाषा के रूप में AND विज़ुअल/पैटर्न जानकारी के रूप में प्रोसेस होते हैं, जिससे गोलार्ध समन्वय बेहतर होता है",
            ],
            result: "नतीजा: तेज़ गति, गहरी याददाश्त, कम थकान, और समय के साथ मज़बूत विज़ुअल/फोटोग्राफिक मेमोरी",
          },
          measuredNote: "यह कैसे मापा जाता है: ऊपर बताए गए वही ब्रेन स्कोर, कॉम्प्रिहेंशन % और कंसिस्टेंसी ट्रैकिंग — साथ ही, अगर आप अपने शहर में ऑफलाइन QSR + EEG वर्कशॉप जॉइन करते हैं, तो असली फिज़िकल EEG ब्रेन मैपिंग व्यक्तिगत रूप से (नीचे देखें)।",
          notHypnosisLine: "यह सम्मोहन नहीं है, ब्लाइंडफोल्ड रीडिंग नहीं है, और कोई अलौकिक दावा नहीं है। यह कॉग्निटिव ट्रेनिंग है — बिल्कुल वैसे ही जैसे जिम में मांसपेशी को प्रशिक्षित किया जाता है।",
          researchNote: "रिसर्च-अलाइन्ड: सैकेडिक आई मूवमेंट और अल्फा/थीटा मेमोरी कंसोलिडेशन स्थापित न्यूरोसाइंस अवधारणाएं हैं, जिन्हें यहां डिज़ाइन लक्ष्य के रूप में नाम दिया गया है — न कि प्रोप्राइटरी दावे या जुड़े हुए अध्ययन।",
        },
        disclaimer: "ब्रेन-स्टेट फ़्रेमिंग इन अभ्यासों के डिज़ाइन इरादे को बताती है, ऑनलाइन विद्यार्थियों के लिए हर-सेशन मापी गई गारंटी नहीं — हार्डवेयर-सत्यापित सेशन के लिए नीचे वडोदरा EEG ट्रैक देखें।",
      },
      appPreview: {
        eyebrow: "ऐप के भीतर",
        title: "आपका दैनिक अभ्यास वास्तव में कैसा दिखता है",
        desc: "30-दिवसीय स्ट्रीक का हर दिन एक जैसे शुरू होता है — एक छोटा, केंद्रित सत्र जिसे ऐप अपने आप ट्रैक करता है।",
        drillLabel: "आज का अभ्यास",
        drillValue: "पेरिफेरल विस्तार",
        stats: [
          { label: "सत्र की अवधि", value: "~10 मिनट" },
          { label: "वर्तमान WPM", value: "412" },
          { label: "समझ", value: "91%" },
        ],
        caption: "उदाहरण के तौर पर पूर्वावलोकन — आपके असली आंकड़े आपके अपने दिन 1 के आधार-स्तर से शुरू होंगे।",
      },
      ageGroups: {
        eyebrow: "हर उम्र के लिए बनाया गया",
        title: "एक मास्टरक्लास, हर आयु वर्ग के लिए अनुकूलित",
        desc: "एक ही मूल प्रशिक्षण, दो असली और सत्यापित तरीकों में — क्योंकि एक बच्चा और एक कामकाजी पेशेवर एक जैसे नहीं सीखते, और यह कार्यक्रम उनसे ऐसा करने को नहीं कहता।",
        pathways: [
          {
            title: "बच्चों के लिए",
            tag: "उच्च न्यूरोप्लास्टिसिटी",
            desc: "युवा मस्तिष्क में असाधारण न्यूरोप्लास्टिसिटी होती है — नए विज़ुअल और कॉग्निटिव मार्ग तेज़ी से बनाने की मूल क्षमता। सही मार्गदर्शन के साथ, कई बच्चे अपनी शुरुआती क्षमता से कहीं आगे तेज़ पेरिफेरल विज़न और पैटर्न-पहचान कौशल विकसित करते हैं — आप ये सत्र हमारे विद्यार्थियों के वीडियो रिव्यूज़ में देख सकते हैं।",
          },
          {
            title: "वयस्कों और पेशेवरों के लिए",
            tag: "तेज़ ओपन-आई रीडिंग",
            desc: "कामकाजी पेशेवर वर्षों से बनाया गया गहन फोकस और पढ़ने का अनुशासन साथ लाते हैं — एक असली बुनियाद जिस पर यह प्रशिक्षण सीधे निर्माण करता है। सही अभ्यास के साथ, ज़्यादातर वयस्क तेज़, खुली आंखों से पेरिफेरल रीडिंग विकसित करते हैं, पूरी पंक्तियां और पन्ने तेज़ गति से ग्रहण करते हुए — ताकि एक पूरी किताब सामान्य समय के एक अंश में पूरी हो जाए।",
          },
        ],
        unifyingLine:
          "अलग अभिव्यक्ति, लेकिन एक ही अंतर्निहित प्रशिक्षण: पेरिफेरल विज़न, गहन एकाग्रता, और राइट-ब्रेन एंगेजमेंट — वही कौशल जो ऊपर \"इसके पीछे का विज्ञान\" में बताए गए हैं। विद्यार्थी चाहे कोई भी रास्ता चुनें, वही बुनियाद बन रही होती है।",
        ctaLabel: "असली विद्यार्थियों के वीडियो देखें",
      },
      authority: {
        eyebrow: "सीधे मूल स्रोत से",
        title: "भारत में QSR लाने वाले व्यक्ति से सीखें",
        desc: "किसी लाइसेंस-प्राप्त प्रशिक्षक से नहीं जो किसी और की प्रणाली सिखा रहा हो — बल्कि उस व्यक्ति से जिसने इसे शुरू किया।",
        cards: [
          {
            title: "इंग्लिश प्रोफेसर (15+ वर्षों का अनुभव)",
            desc: "इंग्लिश विषय में 15+ वर्षों का शैक्षणिक शिक्षण अनुभव।",
          },
          {
            title: "भारत में QSR के प्रणेता (2015 से)",
            desc: "भारत में क्वांटम स्पीड रीडिंग की शुरुआत की — इस मास्टरक्लास में पढ़ाई जाने वाली विधि का मूल स्रोत।",
          },
          {
            title: "10,000+ विद्यार्थियों का मार्गदर्शन",
            desc: "हज़ारों विद्यार्थियों को पूर्ण शुरुआती से उन्नत अभ्यासी तक व्यक्तिगत रूप से मार्गदर्शन दिया।",
          },
          {
            title: "500+ वर्कशॉप्स आयोजित",
            desc: "2014 से स्कूलों, कॉलेजों, और कॉर्पोरेट दर्शकों के लिए लाइव शिक्षण वर्कशॉप्स आयोजित कर रहे हैं।",
          },
        ],
      },
      credibilityStrip: {
        label: "इनके विद्यार्थी हम पर भरोसा करते हैं",
        placeholderStatement: "भारत के [CITY LIST NEEDED — confirm real cities/count] शहरों में वर्कशॉप्स आयोजित",
        citiesHeadlinePrefix: "भारत के",
        citiesHeadlineSuffix: "शहरों में वर्कशॉप्स आयोजित",
      },
      founderVideo: {
        eyebrow: "डॉ. कपिल की ओर से, सीधे",
        title: "क्वांटम स्पीड रीडिंग अलग क्यों है",
        desc: "डॉ. कपिल देव शर्मा की ओर से एक संक्षिप्त परिचय — एक इंग्लिश प्रोफेसर, जिनके पास 15+ वर्षों का शिक्षण अनुभव है, और भारत में QSR के प्रणेता, जिन्होंने 2015 में देश में क्वांटम स्पीड रीडिंग की शुरुआत की। आप सीधे इस विधि के प्रणेता से सीख रहे हैं, किसी और की प्रणाली सिखाने वाले लाइसेंस-प्राप्त प्रशिक्षक से नहीं।",
        placeholderLabel: "वीडियो जल्द आ रहा है",
        ctaLabel: "इसके बजाय सवाल पूछें",
        videoTitle: "क्वांटम स्पीड रीडिंग परिचय",
      },
      liveIntroSession: {
        eyebrow: "मुफ़्त · 45 मिनट · लाइव",
        title: "अपनी सीट रिज़र्व करें — डॉ. कपिल के साथ लाइव Q&A",
        desc: "एक असली क्वांटम स्पीड रीडिंग तकनीक, लाइव सिखाई गई, साथ में खुला Q&A — यह वाकई एक मुफ़्त सेशन है, 30-दिवसीय प्रोग्राम का मुफ़्त एक्सेस नहीं, और कोई रिकॉर्डिंग नहीं। अगर यह आपको पसंद आता है, तो बाद में आपको एक सीधा-सादा पेड बैच जॉइन करने का न्योता मिलेगा — किसी भी तरह कोई दबाव नहीं।",
        ctaLabel: "अपनी सीट रिज़र्व करें",
      },
      videoTestimonials: {
        eyebrow: "असली विद्यार्थियों को देखें",
        title: "200+ वीडियो रिव्यूज़, कोई पेड एक्टर नहीं",
        desc: "इस प्लेलिस्ट का हर वीडियो एक असली विद्यार्थी का है, जो प्रोग्राम पूरा करने के बाद फिल्माया गया — बिना किसी स्क्रिप्ट के।",
        moreLabel: "क्वांटम स्पीड रीडिंग के और असली विद्यार्थी",
        watchLabel: "वीडियो देखें",
        adultsLabel: "वयस्क",
        youngLearnersLabel: "युवा शिक्षार्थी",
        watchMoreVideosLabel: "और विद्यार्थी कहानियां देखें",
        watchFewerVideosLabel: "कम दिखाएं",
      },
      mechanics: {
        eyebrow: "यह कैसे काम करता है",
        title: "दो प्रणालियां, एक बदलाव",
        desc: "एक दैनिक ऐप स्ट्रीक जो कौशल सिखाती है, और लाइव सत्र जो उसके पीछे की मानसिकता स्थापित करते हैं।",
        app: {
          tag: "प्रतिदिन · ऐप में",
          title: "30-दिवसीय ऐप स्ट्रीक",
          desc: "आपकी अपनी गति से, हर दिन, क्वांटम माइंड ऐप के भीतर ही प्रगतिशील संज्ञानात्मक अभ्यास।",
          bullets: [
            "हर सत्र में WPM (शब्द प्रति मिनट) ट्रैक होता है, केवल एक बार नहीं",
            "गति के साथ-साथ समझ का भी स्कोर — कभी एक के बिना दूसरा नहीं",
            "प्रगतिशील कठिनाई — दिन 30, दिन 1 से कहीं ज़्यादा मांग करता है",
            "हर पूरा किया गया दिन खुला रहता है — जब चाहें दोबारा अभ्यास करें",
            "लगभग 10 मिनट प्रतिदिन",
          ],
        },
        live: {
          tag: "साप्ताहिक · डॉ. शर्मा के साथ लाइव",
          title: "7 लाइव मास्टरक्लास सत्र",
          desc: "30 दिनों में फैले इंटरैक्टिव सत्र, जहां डॉ. शर्मा व्यक्तिगत रूप से रीयल-टाइम में आपको तकनीक सिखाते हैं।",
          bullets: [
            "राइट-ब्रेन विज़ुअल रीडिंग — लाइव सिखाई जाती है, पहले से रिकॉर्ड नहीं",
            "सीधा प्रश्नोत्तर — अपनी खास अटकी हुई समस्या के बारे में पूछें",
            "अपने लाइव बैच समूह के साथ ग्रुप एकाउंटेबिलिटी",
            "सत्र छूट जाने पर रिकॉर्डिंग उपलब्ध",
          ],
        },
      },
      moreThanSpeed: {
        eyebrow: "स्पीड से आगे",
        title: "सिर्फ स्पीड से कहीं ज़्यादा",
        goalSetting: {
          tag: "दिन 1",
          title: "गोल-सेटिंग",
          desc: "दिन 1 पर ही, हर विद्यार्थी अपने ट्रेनर के साथ अपने personal reading और learning goals तय करता है — जिससे शुरुआत से ही ownership बनती है।",
        },
        memoryTechniques: {
          tag: "प्रैक्टिकल स्किल्स",
          title: "प्रैक्टिकल मेमोरी तकनीकें",
          desc: "रीडिंग स्पीड से आगे, विद्यार्थी असली मेमोरी टूल्स सीखते हैं — Memory Palace, Peg System, और Acronym तकनीकें — जिन्हें वे तुरंत दिखा भी सकते हैं।",
        },
      },
      focusInDistractedWorld: {
        eyebrow: "स्क्रीन टाइम और फोकस",
        title: "एक distracted दुनिया में फोकस बनाना",
        intro: "कई माता-पिता चिंतित रहते हैं कि स्क्रीन टाइम उनके बच्चे के फोकस और रीडिंग हैबिट्स को प्रभावित कर रहा है। यह प्रोग्राम रीडिंग ट्रेनिंग के साथ-साथ प्रैक्टिकल स्क्रीन-मैनेजमेंट गाइडेंस भी शामिल करता है।",
        tips: [
          {
            title: "पोश्चर और आई-केयर",
            desc: "लंबे रीडिंग सेशन के दौरान पोश्चर और आँखों की थकान कम करने के आसान टिप्स।",
          },
          {
            title: "20-20-20 नियम",
            desc: "हर 20 मिनट में, 20 फीट दूर किसी चीज़ को 20 सेकंड के लिए देखें।",
          },
          {
            title: "डिजिटल डिटॉक्स हैबिट्स",
            desc: "आसान आदतें — जैसे प्रैक्टिस से पहले 10 मिनट के लिए फोन दूर रखना।",
          },
        ],
      },
      documentMastery: {
        eyebrow: "ऐप में यह भी है",
        title: "AI Document Studio",
        desc: "Quantum Mind app के अंदर मौजूद वही AI-पावर्ड Document Studio — कोई भी PDF, टेक्स्टबुक या रिसर्च पेपर अपलोड करें और उससे स्पीड-रीडिंग ड्रिल्स, माइंड मैप्स, और रिवीज़न नोट्स पाएं।",
        items: [
          {
            title: "अपलोड करें और सीखें",
            desc: "कोई भी PDF या टेक्स्टबुक डालें — किसी मैनुअल फॉर्मेटिंग या सेटअप की ज़रूरत नहीं।",
          },
          {
            title: "AI-जनरेटेड ड्रिल्स",
            desc: "आपकी अपनी सामग्री असली Quantum Speed Reading प्रैक्टिस बन जाती है, कोई जेनेरिक सैंपल टेक्स्ट नहीं।",
          },
          {
            title: "विज़ुअल नॉलेज मैप्स",
            desc: "देखें कि आपके डॉक्यूमेंट के विचार असल में एक-दूसरे से कैसे जुड़े हैं, एक नज़र में।",
          },
          {
            title: "मुख्य अवधारणाएं निकालना",
            desc: "मुख्य विचार अपने आप निकाले जाते हैं, ताकि आपको पता चले कि असल में क्या मायने रखता है।",
          },
          {
            title: "मेमोरी और रिवीज़न नोट्स",
            desc: "बाद में रिवीजन के लिए बने नोट्स — सिर्फ एक बार पढ़ने के लिए नहीं।",
          },
        ],
      },
      curriculum: {
        eyebrow: "पाठ्यक्रम",
        title: "30 दिन वास्तव में कैसे दिखते हैं",
        desc: "चार संरचित चरण। हर चरण पिछले पर सीधे आधारित है — यहां कुछ भी वैकल्पिक फिलर नहीं है।",
        weeks: [
          {
            range: "दिन 1–7",
            title: "ऑकुलर फिक्सेशन तोड़ना",
            desc: "आपकी आंखें पन्ने पर शारीरिक रूप से कैसे चलती हैं, इसे फिर से प्रशिक्षित करें — पेरिफेरल विज़न का विस्तार, और उस रुक-रुक कर पढ़ने की आदत को खत्म करना जो ज़्यादातर पाठकों को 250 WPM से नीचे रोके रखती है।",
          },
          {
            range: "दिन 8–14",
            title: "सब-वोकलाइज़ेशन को बायपास करना",
            desc: "उस भीतरी आवाज़ को रोकें जो पढ़ते समय चुपचाप हर शब्द बोलती है। यही एक बदलाव आमतौर पर आपकी पढ़ने की गति में सबसे बड़ी छलांग लाता है।",
          },
          {
            range: "दिन 15–21",
            title: "फोटोग्राफिक मेमोरी एंकरिंग",
            desc: "विज़ुअल और मल्टी-सेंसरी मेमोरी तकनीकों की परतें जोड़ें, ताकि जो आप तेज़ी से पढ़ें, वह याद भी रहे — पूरे पन्ने और बहु-स्तरीय जानकारी का ग्रहण।",
          },
          {
            range: "दिन 22–30",
            title: "पूर्ण-पुस्तक संश्लेषण और मास्टरी",
            desc: "सब कुछ एक असली, पूर्ण-लंबाई की किताब पर लागू करें, अपने अंतिम आंकड़ों की स्पीड-टेस्टिंग करें, और अपना मास्टरी सर्टिफिकेशन पूरा करें।",
          },
        ],
      },
      examBenefits: {
        eyebrow: "विषय दर विषय",
        title: "QSR आपकी कैसे मदद करता है, विषय दर विषय",
        cards: [
          {
            title: "UPSC / बैंकिंग / सरकारी परीक्षा के उम्मीदवार",
            desc: "उतनी ही करेंट-अफेयर्स और एडिटोरियल मात्रा को आधे समय में कवर करें, रिवीज़न साइकिल के लिए घंटों खाली करते हुए।",
          },
          {
            title: "JEE / NEET के उम्मीदवार",
            desc: "विज़ुअल एन्कोडिंग के ज़रिए डायग्राम, फॉर्मूले, और लंबे थ्योरी चैप्टर तेज़ी से याद रखें, मॉक टेस्ट के लिए ज़्यादा समय बचाते हुए।",
          },
          {
            title: "स्कूली विद्यार्थी (बोर्ड परीक्षाएं)",
            desc: "लंबे वर्णनात्मक चैप्टरों को रटने के बजाय संरचित मेंटल मैप्स में बदलें, तेज़ और ज़्यादा टिकाऊ याददाश्त के लिए।",
          },
        ],
      },
      audience: {
        eyebrow: "अभिभावकों के लिए",
        title: "दिन-प्रतिदिन क्या बदलता है",
        items: [
          "होमवर्क और पढ़ाई के सेशन जो पहले लंबे खिंचते थे, अब जल्दी खत्म होने लगते हैं",
          "आपका बच्चा किताब को बीच में छोड़ने के बजाय पूरा पढ़ता है",
          "परीक्षा से पहले आखिरी समय की घबराहट कम होती है, क्योंकि सिलेबस समय पर कवर हो जाता है",
          "एक मासिक पेरेंट-चाइल्ड रीडिंग एक्टिविटी, प्रोग्राम में शामिल",
        ],
      },
      faq: {
        eyebrow: "नामांकन से पहले",
        title: "दिन 1 से पहले लोग जो सवाल पूछते हैं",
        items: [
          {
            question: "क्या यह पूर्ण शुरुआती के लिए मुश्किल है?",
            answer:
              "नहीं। 30-दिवसीय संरचना यह मानकर चलती है कि आपको कोई पूर्व कौशल नहीं है और आपकी असली शुरुआत से आरंभ होती है — डॉ. शर्मा ने 2014 से अब तक 10,000+ विद्यार्थियों को इसमें मार्गदर्शन दिया है, जिनमें अधिकांश पूर्ण शुरुआती थे।",
          },
          {
            question: "प्रतिदिन कितना समय देना होगा?",
            answer:
              "ऐप में लगभग 10 मिनट प्रतिदिन, साथ ही डॉ. शर्मा के साथ सप्ताह में एक लाइव मास्टरक्लास सत्र। यह पूर्णकालिक नौकरी या पढ़ाई के शेड्यूल के साथ फिट होने के लिए बनाया गया है, उससे टकराने के लिए नहीं।",
          },
          {
            question: "क्या यह हर आयु वर्ग के लिए काम करता है?",
            answer:
              "हां — परीक्षा की तैयारी करने वाले विद्यार्थियों, कामकाजी पेशेवरों, और हर उम्र के आजीवन सीखने वालों ने यह मास्टरक्लास पूरा किया है। गति आपकी शुरुआती स्थिति के अनुसार ढल जाती है।",
          },
          {
            question: "क्या इसमें से कुछ वास्तव में मुफ़्त है?",
            answer:
              "मास्टरक्लास खुद एक पूरी तरह से भुगतान वाला, परिणाम-उन्मुख प्रोग्राम है — ₹9,999 एकमुश्त में पूरा 30-दिवसीय पाठ्यक्रम, डॉ. शर्मा के साथ सभी 7 लाइव सेशन, और पूरे समय ऐप एक्सेस मिलता है। हम प्रोग्राम का मुफ़्त एक्सेस नहीं देते, क्योंकि न तो अकेले ऐप और न ही अकेले लाइव सेशन पूरा परिणाम देते हैं — दोनों एक साथ काम करने के लिए बनाए गए हैं। जो मुफ़्त है: हमारा 2-मिनट रीडिंग स्पीड टेस्ट, और डॉ. शर्मा के साथ हमारा मुफ़्त 45-मिनट लाइव इंट्रो सेशन — नीचे देखें।",
          },
          {
            question: "₹9,999 में मुझे वास्तव में क्या मिलता है?",
            answer:
              "पूरा 30-दिवसीय प्रगतिशील ऐप पाठ्यक्रम, डॉ. शर्मा के साथ सभी 7 लाइव मास्टरक्लास सत्र, पूरे समय WPM व समझ की ट्रैकिंग, और पूरे 30 दिनों का ऐप एक्सेस — एक एकमुश्त नामांकन, कोई सब्सक्रिप्शन नहीं। प्रोग्राम पूरा करने के बाद, निरंतर ऐप अभ्यास एक अलग ₹499/माह विकल्प है, अगर आप चाहें।",
          },
          {
            question: "अगर यह मेरे लिए काम नहीं करता तो?",
            answer:
              "आप ऑनलाइन विद्यार्थियों के लिए हमारी 100% रिज़ल्ट गारंटी से सुरक्षित हैं: पूरा 30-दिवसीय प्रोटोकॉल निर्देशानुसार पूरा करें — हर ऐप सेशन, सभी 7 लाइव मास्टरक्लास — और अगर आपकी रीडिंग स्पीड व समझ मापने योग्य रूप से नहीं सुधरी, तो हमें बताएं और हम पूरा रिफंड जारी करेंगे। पूरी शर्तों के लिए हमारी रिफंड और कैंसिलेशन नीति देखें।",
          },
          {
            question: "भुगतान के तुरंत बाद क्या होता है?",
            answer:
              "नामांकन की पुष्टि डॉ. कपिल की टीम व्यक्तिगत रूप से करती है, कोई ऑटोमेटेड सिस्टम नहीं — चेकआउट के तुरंत बाद हम आपसे आपके बैच शेड्यूल के साथ संपर्क करेंगे।",
          },
          {
            question: "अगर मेरा सवाल यहां नहीं है तो?",
            answer: "नामांकन से पहले डॉ. कपिल की टीम को सीधे WhatsApp पर संदेश भेजें — असली व्यक्ति से बात होगी, कोई बॉट नहीं।",
          },
          {
            question: "क्या यह सम्मोहन है या कोई अवैज्ञानिक तरीका?",
            answer:
              "नहीं। क्वांटम स्पीड रीडिंग न्यूरोसाइंस पर आधारित कॉग्निटिव ट्रेनिंग है — पेरिफेरल विज़न ट्रेनिंग, श्वास/फोकस अभ्यास, और मेमोरी-एंकरिंग तकनीकें — जिसमें आपकी प्रगति असली ब्रेन स्कोर, कॉम्प्रिहेंशन और कंसिस्टेंसी मेट्रिक्स पर मापी जाती है (और वडोदरा विद्यार्थियों के लिए, असली EEG ब्रेन मैपिंग पर भी)। यह सम्मोहन नहीं है, ब्लाइंडफोल्ड रीडिंग नहीं है, और कोई भी छद्म-वैज्ञानिक तकनीक नहीं है।",
          },
        ],
        ctaLabel: "WhatsApp पर पूछें",
      },
      finalCta: {
        eyebrow: "जब आप तैयार हों",
        title: "आपके 30 दिन एक फैसले से शुरू होते हैं",
        desc: "नामांकन की पुष्टि डॉ. कपिल की अपनी टीम व्यक्तिगत रूप से करती है, कोई ऑटोमेटेड सिस्टम नहीं।",
        cta: "अपनी बैच सीट सुरक्षित करें",
        ctaMeta: "₹9,999 · एकमुश्त नामांकन",
        batchNoticeLabel: "अगला बैच शुरू होता है",
        cadenceLine: "नए बैच महीने में दो बार शुरू होते हैं — 7 तारीख और 25 तारीख को।",
        structureLine: "आपके 30 दिनों में 7 लाइव क्लासेज़ · दैनिक अभ्यास ऐप के ज़रिए",
      },
      stickyBar: {
        text: "30-दिवसीय क्वांटम स्पीड रीडिंग मास्टरक्लास",
        price: "₹9,999 · एकमुश्त",
        cta: "अपनी बैच सीट सुरक्षित करें",
      },
      whatsapp: {
        bubble: "QSR बैच के बारे में सवाल हैं? डॉ. कपिल की टीम से तुरंत बात करें।",
        button: "WhatsApp पर चैट करें",
        ariaLabel: "क्वांटम स्पीड रीडिंग मास्टरक्लास के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें",
      },
      mumbaiWorkshopCard: {
        badge: "नया · पायलट बैच",
        title: "यह भी उपलब्ध: मुंबई में लाइव, व्यक्तिगत रूप से",
        desc: "इस मास्टरक्लास का एक 2-दिवसीय व्यक्तिगत विस्तार — डॉ. कपिल देव शर्मा से लाइव कोचिंग, एक Cognitive व Focus Engagement Demo, और वही ₹9,999 कीमत।",
        meta: "मुंबई · 2 दिन · ₹9,999 · सीमित सीटें",
        cta: "मुंबई वर्कशॉप एक्सप्लोर करें",
      },
    },
    qsrMumbaiLanding: {
      hero: {
        eyebrow: "लाइव, व्यक्तिगत रूप से · मुंबई · पायलट बैच",
        headline: "5 गुना तेज़ पढ़ें।",
        headlineEm: "मुंबई में लाइव, व्यक्तिगत रूप से।",
        sub: "30-दिवसीय क्वांटम स्पीड रीडिंग मास्टरक्लास का एक 2-दिवसीय, व्यक्तिगत विस्तार — डॉ. कपिल देव शर्मा से लाइव कोचिंग, एक रियल-टाइम कॉग्निटिव व फोकस एंगेजमेंट डेमो, और आपकी रीडिंग स्पीड दिन 1 और फिर एक रात के अंतराल के बाद दिन 2 पर मापी जाती है। इसके बाद बाकी 28 दिन उसी ऐप के ज़रिए जारी रहते हैं जो हमारे ऑनलाइन ट्रैक में इस्तेमाल होता है।",
        ctaPrimary: "पायलट बैच सीट सुरक्षित करें",
        ctaPrimaryMeta: "₹9,999 · ऑनलाइन मास्टरक्लास जैसी ही कीमत",
        ctaSecondary: "2-दिवसीय शेड्यूल देखें",
        badge: "2-दिवसीय लाइव इवेंट",
      },
      whatsDifferent: {
        eyebrow: "व्यक्तिगत बनाम ऑनलाइन",
        title: "ऑनलाइन प्रोग्राम से क्या अलग है",
        items: [
          {
            title: "एक लाइव कॉग्निटिव व फोकस एंगेजमेंट डेमो",
            desc: "दिन 1 पर Muse 2 हेडबैंड का उपयोग करते हुए एक संक्षिप्त, व्यक्तिगत कॉग्निटिव व फोकस एंगेजमेंट डेमो — यह वास्तव में क्या है (और क्या नहीं) यह नीचे देखें।",
          },
          {
            title: "डॉ. कपिल देव शर्मा से व्यक्तिगत कोचिंग",
            desc: "दोनों दिनों में लाइव, आमने-सामने तकनीक सुधार — कोई वीडियो कॉल नहीं।",
          },
          {
            title: "रीडिंग स्पीड दो बार, एक रात के अंतराल पर मापी जाती है",
            desc: "दिन 1 पर एक शुरुआती WPM रीडिंग, फिर दिन 2 पर एक अंतिम WPM और रिटेंशन चेक — एक असली रात के अंतराल के बाद, लगातार नहीं।",
          },
          {
            title: "फिर वही ऐप-आधारित पाठ्यक्रम",
            desc: "2-दिवसीय इवेंट के बाद, बाकी 28 दिन उसी Quantum Speed Reading ऐप के ज़रिए जारी रहते हैं जो हमारे ऑनलाइन विद्यार्थी इस्तेमाल करते हैं — कोई अलग, डिस्कनेक्टेड ट्रैक नहीं।",
          },
        ],
      },
      schedule: {
        eyebrow: "2 दिन",
        title: "वर्कशॉप कैसे चलती है",
        day1: {
          label: "दिन 1 · शनिवार",
          title: "बेसलाइन और तकनीक",
          items: [
            "कॉग्निटिव व फोकस एंगेजमेंट डेमो (Muse 2 हेडबैंड)",
            "मुख्य Quantum Speed Reading तकनीक, लाइव सिखाई जाएगी",
            "पहला गाइडेड प्रैक्टिस सेशन",
            "शुरुआती रीडिंग स्पीड (WPM) मापन",
          ],
        },
        day2: {
          label: "दिन 2 · रविवार",
          title: "अभ्यास और परिणाम",
          items: [
            "आगे का गाइडेड अभ्यास",
            "अंतिम WPM और रिटेंशन मापन",
            "पूर्णता प्रमाणपत्र",
            "वैकल्पिक वीडियो टेस्टिमोनियल रिकॉर्डिंग",
          ],
        },
        overnightCallout: {
          title: "दो दिन ही क्यों, एक क्यों नहीं?",
          desc: "रिटेंशन एक पूरी रात की नींद के बाद मापी जाती है, उसी सेशन में नहीं जिसमें सिखाई गई थी — स्लीप-आधारित कंसॉलिडेशन इस बात का हिस्सा है कि यह तकनीक टिकने के लिए कैसे डिज़ाइन की गई है, इसलिए दिन 1 और दिन 2 के बीच का अंतराल एक जानबूझकर लिया गया डिज़ाइन निर्णय है, कोई शेड्यूलिंग सुविधा नहीं।",
        },
      },
      venue: {
        eyebrow: "वेन्यू और बैच",
        title: "मुंबई · पायलट बैच",
        venueLine: "[वेन्यू का नाम व पता पुष्टि होना बाकी — पवई या बांद्रा वेस्ट क्षेत्र]",
        dateLine: "[सटीक तारीखें पुष्टि होना बाकी]",
        timeLine: "[समय पुष्टि होना बाकी]",
        pilotNote: "यह इस फॉर्मेट में हमारा पहला व्यक्तिगत बैच है — सीटें वाकई सीमित हैं, और हम इसे जानबूझकर छोटा रख रहे हैं। बैच उम्र के अनुसार बांटे जाते हैं (एक युवा समूह और एक बड़ा/वयस्क समूह अलग-अलग चलाया जाता है, मिलाकर नहीं), डिलीवरी की गुणवत्ता के लिए।",
      },
      eegDemo: {
        eyebrow: "दिन 1",
        title: "कॉग्निटिव व फोकस एंगेजमेंट डेमो",
        desc: "दिन 1 पर, हम Muse 2 हेडबैंड का उपयोग करके अभ्यास के दौरान आपके कॉग्निटिव फोकस और एंगेजमेंट का एक लाइव, रियल-टाइम डेमो देते हैं — ट्रेनिंग को होते हुए देखने का एक तरीका, सिर्फ़ हमारी बात मान लेने के बजाय।",
        disclaimer: "यह एक लाइव एंगेजमेंट डेमो टूल है, कोई डायग्नोस्टिक या मेडिकल डिवाइस नहीं। यह कोई क्लिनिकल ब्रेन रिपोर्ट नहीं बनाता, और यह किसी भी मेडिकल या न्यूरोलॉजिकल असेसमेंट का विकल्प नहीं है।",
        addOn: {
          title: "वैकल्पिक: एक विस्तृत व्यक्तिगत एंगेजमेंट रिपोर्ट",
          desc: "जो चाहें उनके लिए, आपके सेशन पर आधारित एक अधिक विस्तृत व्यक्तिगत एंगेजमेंट रिपोर्ट एक पेड ऐड-ऑन के रूप में उपलब्ध है।",
          pricePlaceholder: "[ऐड-ऑन की कीमत पुष्टि होना बाकी]",
        },
      },
      pricing: {
        title: "₹9,999",
        priceNote: "एकमुश्त — ऑनलाइन मास्टरक्लास जैसी ही कीमत। इसमें मुंबई के दोनों दिन और उसके बाद आने वाला पूरा 30-दिवसीय ऐप पाठ्यक्रम शामिल है।",
        addOnNote: "ऊपर बताई गई व्यक्तिगत एंगेजमेंट रिपोर्ट एक अलग, वैकल्पिक ऐड-ऑन है।",
        cta: "पायलट बैच सीट सुरक्षित करें",
      },
      faq: {
        eyebrow: "सवाल",
        title: "सीट सुरक्षित करने से पहले",
        items: [
          {
            question: "यह ऑनलाइन प्रोग्राम से कैसे अलग है?",
            answer: "पाठ्यक्रम वही 30-दिवसीय प्रोग्राम है। इसमें मुंबई में एक लाइव, व्यक्तिगत 2-दिवसीय शुरुआत जुड़ती है — डॉ. कपिल देव शर्मा के साथ आमने-सामने सेशन, एक लाइव कॉग्निटिव व फोकस एंगेजमेंट डेमो, और दोनों दिनों में एक रात के अंतराल के साथ मापी गई रीडिंग स्पीड। दिन 2 के बाद, आप उसी ऐप पर जारी रखते हैं जो ऑनलाइन ट्रैक इस्तेमाल करता है।",
          },
          {
            question: "EEG डिवाइस क्या करता है — क्या यह एक मेडिकल टेस्ट है?",
            answer: "नहीं। यह Muse 2 हेडबैंड का उपयोग करते हुए एक लाइव कॉग्निटिव व फोकस एंगेजमेंट डेमो है, जिसका मकसद अभ्यास के दौरान आपका फोकस रियल-टाइम में दिखाना है। यह कोई डायग्नोस्टिक या मेडिकल डिवाइस नहीं है, और यह कोई क्लिनिकल या मेडिकल ब्रेन रिपोर्ट नहीं बनाता।",
          },
          {
            question: "अगर मेरा बच्चा एक दिन ही आ सकता है, दोनों दिन नहीं — तो क्या होगा?",
            answer: "दोनों दिन एक-दूसरे पर बनने के लिए डिज़ाइन किए गए हैं — दिन 1 तकनीक सिखाता है और एक बेसलाइन लेता है, दिन 2 एक रात के अंतराल के बाद असली रिटेंशन मापता है। हम दोनों दिन आने की ज़ोरदार सलाह देंगे। [आंशिक उपस्थिति के लिए सटीक नीति पुष्टि होना बाकी।]",
          },
          {
            question: "2 दिन के बाद बाकी 30-day प्रोग्राम कैसे continue होगा?",
            answer: "व्यक्तिगत वीकेंड के बाद, आप बाकी 30-दिवसीय पाठ्यक्रम के लिए उसी Quantum Speed Reading ऐप के ज़रिए जारी रखते हैं जो हमारे ऑनलाइन विद्यार्थी इस्तेमाल करते हैं।",
          },
          {
            question: "क्या यह सभी उम्र के बच्चों के लिए है?",
            answer: "हां — लेकिन हम उम्र के अनुसार अलग बैच चलाते हैं (एक युवा समूह और एक बड़ा/वयस्क समूह) बजाय सभी उम्र को एक सेशन में मिलाने के, ताकि गति और डिलीवरी हर समूह के लिए सही रहे।",
          },
          {
            question: "Refund policy in-person workshop के लिए क्या है?",
            answer: "[व्यक्तिगत फॉर्मेट के लिए रिफ़ंड व कैंसिलेशन शर्तें इस पेज के लाइव होने से पहले पुष्टि होना बाकी हैं — ऑनलाइन प्रोग्राम की रिफ़ंड पॉलिसी WPM-सुधार पर आधारित है और यह 2-दिवसीय व्यक्तिगत इवेंट पर सीधे लागू न हो सकती हो।]",
          },
        ],
        ctaLabel: "WhatsApp पर पूछें",
      },
      testimonialsPlaceholder: {
        eyebrow: "सोशल प्रूफ़",
        title: "असली कहानियां, पायलट बैच के बाद आएंगी",
        desc: "यह इस फॉर्मेट में हमारा पहला व्यक्तिगत बैच है। पायलट बैच चलने के बाद हम यहां मुंबई के प्रतिभागियों के असली वीडियो टेस्टिमोनियल जोड़ेंगे — तब तक कुछ भी गढ़ा हुआ नहीं।",
      },
      stickyBar: {
        text: "मुंबई वर्कशॉप · 2-दिवसीय पायलट बैच",
        price: "₹9,999 · एकमुश्त",
        cta: "सीट सुरक्षित करें",
      },
      whatsapp: {
        bubble: "मुंबई वर्कशॉप के बारे में सवाल हैं? डॉ. कपिल की टीम से तुरंत बात करें।",
        button: "WhatsApp पर चैट करें",
        ariaLabel: "मुंबई व्यक्तिगत वर्कशॉप के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें",
      },
    },
    habitBuilderLanding: {
      hero: {
        eyebrow: "21-दिवसीय गाइडेड प्रोग्राम",
        headline: "21 दिनों में एक असली रीडिंग हैबिट बनाएं",
        headlineEm: "एक छोटा दैनिक अभ्यास — कोई personality overhaul नहीं, कोई subscription trap नहीं।",
        sub: "एक गाइडेड, दिन-दर-दिन प्रोग्राम, जो आपकी Quantum Speed Reading प्रैक्टिस को फोकस और मेमोरी अभ्यासों से जोड़ता है — एक दिन में एक छोटा सेशन, 21 असली दिनों तक।",
        ctaPrimary: "मुफ़्त शुरू करें — 7 दिन, कोई भुगतान नहीं",
        navCta: "मुफ़्त शुरू करें",
        ctaPrimaryMeta: "शुरू करने के लिए कार्ड की ज़रूरत नहीं",
        pricingLine: "दिन 1–7 मुफ़्त। फिर Day 21 तक जारी रखने के लिए सिर्फ ₹99 का एक one-time payment — कभी subscription नहीं।",
      },
      benefits: {
        eyebrow: "इसमें क्या मिलता है",
        title: "आपको वापस लौटते रहने के लिए बनाया गया",
        items: [
          {
            title: "डेली स्ट्रीक ट्रैकिंग",
            desc: "एक असली स्ट्रीक काउंटर आपके दिखने वाले दिनों को ट्रैक करता है — Day 1 से ही आपके डैशबोर्ड पर दिखता है।",
          },
          {
            title: "Day 1 बेसलाइन डायग्नोस्टिक",
            desc: "Day 1 पर एक छोटा रीडिंग असेसमेंट आपका असली स्टार्टिंग पॉइंट तय करता है, ताकि उसके बाद हर दिन असली growth को मापे।",
          },
          {
            title: "AI कोच ब्रीफिंग",
            desc: "हर दिन आपके पिछले सेशन के आधार पर एक छोटे, personalized नोट के साथ शुरू होता है — कोई generic reminder नहीं।",
          },
          {
            title: "Day 21 सर्टिफिकेट और सेलिब्रेशन",
            desc: "सभी 21 असली दिन पूरे करें और अपनी असली Day 1-से-Day 21 growth दिखाने वाला एक डाउनलोडेबल, personalized completion certificate अनलॉक करें।",
          },
        ],
      },
      howItWorks: {
        eyebrow: "यह कैसे काम करता है",
        title: "तीन हफ्ते, एक असली structure",
        weeks: [
          {
            range: "दिन 1–7",
            title: "फाउंडेशन एंड ब्रेन जिम",
            desc: "आँखों की मूवमेंट और फोकस drills, साथ ही आदत बनाने के लिए एक mandatory 2-मिनट breathing warm-up।",
          },
          {
            range: "दिन 8–14",
            title: "एक्सपैंशन एंड विज़ुअलाइज़ेशन",
            desc: "मेमोरी और visualisation अभ्यास, Week 1 की नींव पर आगे बढ़ते हैं।",
          },
          {
            range: "दिन 15–21",
            title: "एडवांस्ड क्वांटम फ्लो एंड इंट्यूशन",
            desc: "प्रोग्राम के सबसे advanced अभ्यास, आपके Day 21 finale की ओर ले जाते हुए।",
          },
        ],
        dayShapeTitle: "हर दिन एक जैसा असली ढांचा फॉलो करता है",
        dayShapeSteps: [
          "एक छोटा warm-up अभ्यास",
          "एक दूसरा फोकस या मेमोरी अभ्यास",
          "एक रीडिंग प्रैक्टिस सेशन",
          "एक क्विक रिटेंशन चेक",
        ],
      },
      pricing: {
        eyebrow: "प्राइसिंग",
        title: "सीधी, ईमानदार प्राइसिंग",
        freeCard: {
          label: "दिन 1–7",
          price: "मुफ़्त",
          desc: "पूरा पहला हफ्ता, कोई भुगतान नहीं, कोई कार्ड फ़ाइल पर नहीं।",
        },
        paidCard: {
          label: "दिन 8–21",
          price: "₹99",
          priceNote: "एक one-time payment — subscription नहीं",
          desc: "अपने Day 21 finale तक बाकी दो हफ्ते जारी रखने के लिए एक बार भुगतान करें।",
        },
        cta: "मुफ़्त शुरू करें — Day 1",
      },
      faq: {
        eyebrow: "सवाल-जवाब",
        title: "अक्सर पूछे जाने वाले सवाल",
        items: [
          {
            question: "क्या यह एक subscription है?",
            answer: "नहीं। दिन 1–7 पूरी तरह मुफ़्त हैं। Day 8 से आगे सिर्फ एक one-time payment of ₹99 है — किसी भी समय कोई recurring charge नहीं है।",
          },
          {
            question: "मुफ़्त 7 दिनों के बाद क्या होता है?",
            answer: "आगे जारी रखने के लिए आपसे एक बार का ₹99 भुगतान करने को कहा जाएगा। कुछ भी अपने आप charge नहीं होता — आप खुद तय करते हैं कि कब (या क्या) जारी रखना है।",
          },
          {
            question: "अगर मैं एक दिन मिस कर दूं — क्या मेरी प्रोग्रेस चली जाएगी?",
            answer: "अगर आप पूरा दिन मिस करते हैं तो आपकी स्ट्रीक रीसेट हो जाती है, लेकिन आपकी असली प्रोग्रेस नहीं जाती — आप अगले दिन से जारी रखते हैं, Day 1 से दोबारा शुरू नहीं करना पड़ता।",
          },
          {
            question: "क्या मुझे कोई खास ऐप या equipment चाहिए?",
            answer: "नहीं — बस यह वेबसाइट, अपने फ़ोन या कंप्यूटर से। दिन में बस कुछ मिनट काफी हैं।",
          },
          {
            question: "आख़िर में मुझे क्या मिलता है?",
            answer: "सभी 21 असली दिन पूरे करें और अपनी असली Day 1-से-Day 21 growth दिखाने वाला एक डाउनलोडेबल, personalized completion certificate अनलॉक करें।",
          },
        ],
        ctaLabel: "WhatsApp पर पूछें",
      },
    },
    retreatLanding: {
      hero: {
        eyebrow: "ऑनलाइन · 2014 से · छोटा समूह",
        headline: "अपने उच्च मन को जगाएं",
        headlineEm: "11-दिवसीय ऑनलाइन ध्यान एंड इनर मास्टरी रिट्रीट",
        sub: "कोई और मेडिटेशन ऐप नहीं, जो आपको वहीं छोड़ दे जहां से आपने शुरुआत की थी। यह असली क्रिया योग, प्राण, और ब्रह्मांडीय ऊर्जा में एक गहन, लाइव, 11-दिवसीय यात्रा है — प्रतिरात डॉ. कपिल देव शर्मा द्वारा मार्गदर्शित, जो 2014 से व्यक्तिगत रूप से यह मार्ग सिखा रहे हैं।",
        ctaPrimary: "अपनी रिट्रीट सीट सुरक्षित करें",
        ctaPrimaryMeta: "Razorpay के ज़रिए सुरक्षित चेकआउट",
        ctaSecondary: "11-दिवसीय पाठ्यक्रम देखें",
        ctaTertiary: "बुक करने के लिए तैयार नहीं हैं? पहले असली विद्यार्थियों की कहानियां देखें",
        trustLine: "थके हुए पेशेवरों, लगातार ओवरथिंक करने वालों, और असली आध्यात्मिक खोजियों के लिए — जो सिद्धांत से थक चुके हैं और एक वास्तविक आंतरिक अनुभव के लिए तैयार हैं।",
        visualPlaceholderLabel: "रिट्रीट परिचय — जल्द आ रहा है",
      },
      coreProblem: {
        eyebrow: "मेडिटेशन ऐप्स क्यों काम नहीं करते",
        title: "आपका मन टूटा हुआ नहीं है। यह अप्रशिक्षित है — और अपोषित है।",
        desc: "आपने ऐप्स आज़माए हैं। सांस लेने के अभ्यास। बारिश की आवाज़ों वाले दस-मिनट के गाइडेड सेशन। पांच मिनट बाद भी आपके दिमाग़ का वह चक्र वहीं है।",
        painPoints: [
          "दस मिनट की रिकॉर्डिंग उस पल में मदद कर सकती है। यह ग्यारह रातों का निरंतर, लाइव अभ्यास है — असली गहराई, कोई दोहराई जाने वाली लूप नहीं।",
          "आपको एक और रिलैक्सेशन तकनीक की ज़रूरत नहीं है। आपको किसी असली चीज़ से संपर्क चाहिए — अपनी खुद की जीवन-शक्ति, उसकी अनुपस्थिति से ध्यान भटकाने वाली चीज़ नहीं।",
          "हर ऐप शांति का वादा करता है। लगभग कोई नहीं बताता कि आपके भीतर वास्तव में क्या हो रहा है, या इसे बदलने का कोई असली तरीका देता है।",
        ],
        solution:
          "यह रिट्रीट आधुनिक वेलनेस ट्रेंड्स पर आधारित नहीं है। यह क्रिया योग में निहित है — प्राण, आपकी अपनी जीवन-शक्ति, के साथ सीधे काम करने की एक असली, सदियों पुरानी विधि — ब्रह्मांडीय ऊर्जा और ब्रह्मांडीय संलयन के ज़रिए — सिर्फ आपके ध्यान की अवधि नहीं। 11 रातों तक जो आप अभ्यास करते हैं, वह एक महसूस होने वाला, वास्तविक बदलाव लाता है, पांच शांत मिनट नहीं।",
      },
      schedule: {
        eyebrow: "बैच शेड्यूल",
        title: "अगले बैच में अपनी सीट सुरक्षित करें",
        desc: "हर महीने की 10 तारीख को एक नया बैच शुरू होता है और 11 दिनों तक चलता है — उस बैच में सभी के लिए एक ही दैनिक समय।",
        durationLabel: "अवधि",
        durationValue: "11 दिन · दिन 10 – दिन 20",
        cadenceLabel: "बैच आवृत्ति",
        cadenceValue: "मासिक, ऑनलाइन",
        timingLabel: "दैनिक लाइव सत्र",
        timingValue: "शाम 7:30 – रात 10:30",
        nextBatchLabel: "अगला बैच",
        cta: "अपनी रिट्रीट सीट सुरक्षित करें",
        ctaMeta: "Razorpay के ज़रिए सुरक्षित चेकआउट",
        badges: [
          { title: "सुरक्षित भुगतान", desc: "चेकआउट Razorpay द्वारा संभाला जाता है, एक भरोसेमंद पेमेंट गेटवे।" },
          { title: "व्यक्तिगत रूप से पुष्टि", desc: "डॉ. कपिल की टीम का एक असली व्यक्ति आपके बैच और शेड्यूल की पुष्टि करता है — कोई बॉट नहीं।" },
          { title: "छोटा समूह", desc: "हर बैच जानबूझकर छोटा रखा जाता है — सीमित नामांकन, कोई बड़ा वेबिनार नहीं।" },
        ],
      },
      disciplines: {
        eyebrow: "आप क्या सीखेंगे",
        title: "छह अनुशासन, एक 11-दिवसीय यात्रा",
        desc: "हर रात पिछली रात पर आधारित होती है, डॉ. शर्मा द्वारा लाइव मार्गदर्शित — कभी कोई सिद्धांत नहीं जिसे आप सिर्फ पढ़ें, हमेशा एक अभ्यास जिसे आप महसूस करें।",
        items: [
          {
            title: "मानसिक तरंग संचार (टेलीपैथी)",
            desc: "मौन, प्रत्यक्ष मन-से-मन तालमेल का अनुभव करें — एक ऐसा गहरा जुड़ाव जिसे शब्द कभी व्यक्त नहीं कर सकते।",
          },
          {
            title: "आभा स्कैनिंग और रीडिंग",
            desc: "अपने चारों ओर की ऊर्जा को महसूस करना सीखें, अपनी ऊर्जा की रक्षा करें, और वह पढ़ें जो लोगों के शब्द नहीं बताते।",
          },
          {
            title: "समाधि ध्यान",
            desc: "उन मानसिक चक्रों को शांत करें जो रुकते ही नहीं, और उनके नीचे छिपी उस स्थिरता को छुएं जो हमेशा से वहां थी।",
          },
          {
            title: "चक्र सक्रियण और ज्ञानोदय",
            desc: "वर्षों से ढोए जा रहे ऊर्जा अवरोधों को दूर करें, और असली जीवन-शक्ति — कैफीन नहीं, इच्छाशक्ति नहीं — को फिर से अपने शरीर में प्रवाहित होने दें।",
          },
          {
            title: "कुंडलिनी ध्यान",
            desc: "रीढ़ के आधार पर सुप्त ऊर्जा को सुरक्षित रूप से जगाएं और उसे आपको हिलाने नहीं, बल्कि आगे बढ़ाने दें।",
          },
          {
            title: "सूक्ष्म शरीर यात्रा",
            desc: "भौतिक सीमाओं से आगे कदम रखें — और जो वहां मिले उससे बदलकर लौटें।",
          },
        ],
      },
      authority: {
        eyebrow: "एक दशक का अभ्यास, कोई ट्रेंड नहीं",
        title: "एक दशक से अधिक समय से, एक ही शिक्षक द्वारा मार्गदर्शित",
        desc: "असली साल, असली विद्यार्थी, असली समीक्षाएं — कोई ऐसा कार्यक्रम नहीं जो पिछली तिमाही में लॉन्च हुआ हो।",
        cards: [
          {
            title: "2014 से पढ़ा रहे हैं",
            desc: "इसी मार्ग पर विद्यार्थियों का व्यक्तिगत रूप से 12+ वर्षों से मार्गदर्शन — कोई हाल ही में शुरू हुआ ट्रेंड-आधारित कार्यक्रम नहीं।",
          },
          {
            title: "150+ असली विद्यार्थी समीक्षाएं",
            desc: "असली प्रतिभागियों की लिखित और वीडियो समीक्षाएं — कोई स्टॉक फुटेज या पेड एक्टर नहीं।",
          },
          {
            title: "हर बैच में छोटा समूह",
            desc: "हर बैच जानबूझकर छोटा रखा जाता है ताकि डॉ. शर्मा वास्तव में आपका मार्गदर्शन कर सकें, किसी भीड़ को भाषण न दे रहे हों।",
          },
          {
            title: "हर रात व्यक्तिगत रूप से मार्गदर्शित",
            desc: "कोई पहले से रिकॉर्ड नहीं, किसी सहायक प्रशिक्षक को नहीं सौंपा गया — डॉ. शर्मा, लाइव, सभी 11 रातें।",
          },
        ],
      },
      liveStructure: {
        eyebrow: "11 रातें कैसे काम करती हैं",
        title: "लाइव मार्गदर्शन, कोई पहले से रिकॉर्डेड कोर्स नहीं",
        desc: "11 में से हर रात, शाम 7:30 से रात 10:30 तक, आप डॉ. शर्मा के साथ लाइव होते हैं — कोई वीडियो लाइब्रेरी नहीं जिसे आप जब सुविधाजनक हो तब पूरा करें।",
        points: [
          {
            title: "प्रतिरात लाइव सत्र",
            desc: "रिट्रीट की हर रात डॉ. शर्मा के साथ एक लाइव मार्गदर्शित सत्र, शाम 7:30 – रात 10:30 — रीयल-टाइम में, पहले से रिकॉर्ड नहीं।",
          },
          {
            title: "इंटरैक्टिव अभ्यास",
            desc: "उस दिन के अनुशासन के लिए संरचित अभ्यास समय, खुद जांचने वाली चेकलिस्ट की बजाय सीधी प्रतिक्रिया के साथ।",
          },
          {
            title: "सीधा मार्गदर्शन",
            desc: "रिट्रीट के दौरान सवालों के जवाब सीधे डॉ. शर्मा देते हैं, किसी सपोर्ट टिकट के ज़रिए नहीं।",
          },
        ],
      },
      outcomes: {
        eyebrow: "11 रातों के बाद",
        title: "रिट्रीट खत्म होने पर क्या बदलता है",
        items: [
          "मानसिक चक्र आखिरकार शांत हो जाते हैं — दबाए नहीं जाते, सुलझ जाते हैं",
          "अपनी ऊर्जा का एक महसूस होने वाला एहसास, सिर्फ एक विचार नहीं",
          "उस दबाव में असली भावनात्मक स्थिरता जो पहले आपको तोड़ देता था",
          "अपने मन को अनुभव करने के तरीके में एक स्थायी बदलाव — दिन 12 तक ख़त्म होने वाला 11-दिवसीय उत्साह नहीं",
        ],
      },
      gallery: {
        eyebrow: "रिट्रीट के अंदर",
        title: "लाइव सेशंस वाकई कैसे दिखते हैं",
        desc: "पिछले बैचों के असली स्क्रीनशॉट और पल — हर बैच के होने पर फ़ोटो जोड़ी जाती हैं।",
        viewGalleryCta: "पूरी गैलरी देखें",
      },
      freeMeditation: {
        eyebrow: "पहले मुफ़्त में आज़माएं",
        title: "प्रतिबद्ध होने से पहले एक मुफ़्त अभ्यास",
        desc: "तीन छोटे, गाइडेड रिलैक्सेशन और सांस लेने के अभ्यास — कोई साइनअप ज़रूरी नहीं। पूरी 11 रातों का फैसला करने से पहले गति कैसी महसूस होती है, यह देखें।",
        videoCaption: "एक गाइडेड रिलैक्सेशन अभ्यास जिसे कई लोग बेहद शांतिदायक पाते हैं। प्ले दबाएं — कोई साइनअप ज़रूरी नहीं।",
        comingSoonLabel: "जल्द आ रहा है",
        noSignupNote: "कोई साइनअप ज़रूरी नहीं — बस प्ले दबाएं।",
        downloadPrompt: "इन्हें डाउनलोड के रूप में चाहिए?",
        downloadCtaLabel: "व्हाट्सएप पर पूछें",
      },
      videoTestimonials: {
        eyebrow: "असली विद्यार्थियों को देखें",
        title: "12+ वर्षों के असली रिट्रीट्स से, 150+ असली समीक्षाएं",
        desc: "छह असली विद्यार्थी, रिट्रीट पूरा करने के बाद फिल्माए गए — बिना किसी स्क्रिप्ट के। देखने के लिए किसी भी वीडियो पर टैप करें।",
        ctaLabel: "और वीडियो समीक्षाएं",
      },
      faq: {
        eyebrow: "नामांकन से पहले",
        title: "दिन 1 से पहले लोग जो सवाल पूछते हैं",
        items: [
          {
            question: "क्या मुझे ध्यान या ऊर्जा-कार्य का कोई पूर्व अनुभव चाहिए?",
            answer:
              "किसी विशेष विश्वास प्रणाली या पूर्व अनुभव की ज़रूरत नहीं है। क्रिया योग 11 रातों में धीरे-धीरे आगे बढ़ता है — आप अपना खुलापन लाएं, डॉ. शर्मा हर कदम पर विधि बताएंगे।",
          },
          {
            question: "क्या ऊर्जा कार्य — कुंडलिनी, समाधि — वाकई सुरक्षित है?",
            answer:
              "हर तकनीक चरण-दर-चरण, लाइव सिखाई जाती है, और हर रात डॉ. शर्मा गति का मार्गदर्शन करते हैं। फिर भी, ये गहन अभ्यास हैं — कुछ लोगों के लिए, गहरा ध्यान या ऊर्जा-केंद्रित कार्य तीव्र भावनात्मक अनुभव सामने ला सकता है। हम प्रतिभागियों से रिट्रीट से पहले किसी भी प्रासंगिक मानसिक स्वास्थ्य इतिहास को साझा करने का अनुरोध करते हैं, ताकि गति उसके अनुसार समायोजित की जा सके। यह रिट्रीट एक व्यक्तिगत और आध्यात्मिक अभ्यास है, लाइसेंस-प्राप्त थेरेपी या मनोरोग उपचार का विकल्प नहीं — यदि आप वर्तमान में किसी मानसिक स्वास्थ्य स्थिति के लिए उपचार ले रहे हैं, तो कृपया शामिल होने से पहले अपने चिकित्सक से सलाह लें।",
          },
          {
            question: "क्रिया योग वास्तव में क्या है?",
            answer:
              "क्रिया योग प्राण — आपकी अपनी जीवन-शक्ति — के साथ सीधे काम करने की एक असली, सदियों पुरानी विधि है, सांस और विशेष आंतरिक तकनीकों के ज़रिए, कोई ऐसा दर्शनशास्त्र नहीं जिसे आप सिर्फ पढ़ें। यही पूरे 11-दिवसीय रिट्रीट की नींव है।",
          },
          {
            question: "प्रतिदिन कितना समय देना होगा?",
            answer:
              "हर दिन में डॉ. शर्मा के साथ शाम 7:30 से रात 10:30 तक एक लाइव सत्र और मार्गदर्शित अभ्यास शामिल है — 11-दिवसीय बैच के हर दिन यही समय।",
          },
          {
            question: "लाइव सत्र किस समय होते हैं?",
            answer:
              "शाम 7:30 से रात 10:30 तक, प्रतिदिन, बैच के सभी 11 दिनों के लिए — हर बैच के लिए यही समय, ताकि आप पहले से योजना बना सकें।",
          },
          {
            question: "जुड़ने के लिए तकनीकी रूप से क्या चाहिए?",
            answer:
              "बस एक स्थिर इंटरनेट कनेक्शन और कैमरा व ऑडियो वाला एक डिवाइस। लाइव सत्र लिंक शुरुआत की तारीख के करीब पुष्ट प्रतिभागियों के साथ सीधे साझा किया जाता है।",
          },
          {
            question: "क्या यह धार्मिक है, या किसी विशेष विश्वास प्रणाली से जुड़ा है?",
            answer:
              "किसी विशेष विश्वास प्रणाली की आवश्यकता नहीं है। यह कार्य ध्यान, श्वास-अभ्यास, और जागरूकता की तकनीकों पर आधारित है — आप अपना खुलापन लाएं, विधि हम बताएंगे।",
          },
          {
            question: "अगला बैच कब है, और कितनी सीटें बची हैं?",
            answer:
              "11-दिवसीय ऑनलाइन रिट्रीट हर महीने की 10 तारीख को शुरू होकर 20 तारीख तक चलता है। मौजूदा बैच की बची हुई सीटों के लिए हमें WhatsApp पर संदेश भेजें।",
          },
        ],
        ctaLabel: "WhatsApp पर पूछें",
      },
      finalCta: {
        eyebrow: "जब आप तैयार हों",
        title: "आपका जागरण एक फैसले से शुरू होता है",
        desc: "नामांकन की पुष्टि डॉ. कपिल की अपनी टीम व्यक्तिगत रूप से करती है — कोई ऑटोमेटेड सिस्टम नहीं। बारह साल, 150+ असली विद्यार्थी, एक समय में एक छोटा समूह। अगले बैच में अपनी सीट बुक करें।",
        cta: "अपनी रिट्रीट सीट सुरक्षित करें",
      },
      stickyBar: {
        text: "11-दिवसीय ऑनलाइन ध्यान एंड इनर मास्टरी रिट्रीट",
        price: "छोटा समूह · सीमित नामांकन",
        cta: "अपनी रिट्रीट सीट सुरक्षित करें",
      },
      whatsapp: {
        bubble: "11-दिवसीय रिट्रीट के बारे में सवाल हैं? डॉ. कपिल की टीम से तुरंत बात करें।",
        button: "WhatsApp पर चैट करें",
        ariaLabel: "11-दिवसीय रिट्रीट के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें",
      },
    },
    residentialLanding: {
      hero: {
        eyebrow: "रेजिडेंशियल रिट्रीट्स · 2014 से · छोटे समूह",
        headline: "पूरी तरह दूर हट जाएं।",
        headlineEm: "लोनावला और ऋषिकेश में रेजिडेंशियल रिट्रीट्स",
        sub: "आपने बिस्तर पर मेडिटेशन किया, ट्रैफिक में किया, एक ऐप के साथ किया जो कहता रहा बस सांस लें। यह काम नहीं आया — इसलिए नहीं कि आप असफल हुए, बल्कि इसलिए कि एक 10-मिनट की रिकॉर्डिंग वहां तक कभी नहीं पहुंच सकती जहां थकान असल में रहती है। यह डॉ. कपिल देव शर्मा हैं, आपके साथ उसी कमरे में, कई दिनों तक — क्रिया योग, प्राण, और ब्रह्मांडीय ऊर्जा का काम, सीधे मार्गदर्शन में, 2014 से।",
        ctaPrimary: "अपनी रेजिडेंशियल सीट सुरक्षित करें",
        ctaPrimaryMeta: "डॉ. कपिल की टीम द्वारा व्यक्तिगत रूप से पुष्टि",
        ctaSecondary: "2026–27 का शेड्यूल देखें",
        trustLine: "थके हुए पेशेवरों, लगातार ओवरथिंक करने वालों, और असली आध्यात्मिक खोजियों के लिए — जो सिर्फ लॉग ऑफ नहीं, वाकई छोड़ने के लिए तैयार हैं।",
      },
      roadmap: {
        eyebrow: "आधिकारिक शेड्यूल",
        title: "चार यात्राएं। दो पवित्र स्थान। एक मार्ग।",
        desc: "हर रेजिडेंशियल रिट्रीट जानबूझकर छोटा, जानबूझकर मौसमी, और जानबूझकर अलग-अलग समय पर रखा गया है — ताकि हर एक गहराई तक जा सके, फैलाव में नहीं।",
        items: [
          { when: "नवंबर 2026", where: "लोनावला", theme: "पर्वत और प्रकृति में गहन विसर्जन" },
          { when: "फरवरी 2027", where: "ऋषिकेश", theme: "गंगा के किनारे आध्यात्मिक राजधानी" },
          { when: "जून 2027", where: "लोनावला", theme: "मानसून सोल रिट्रीट" },
          { when: "नवंबर 2027", where: "लोनावला", theme: "विंटर डीप प्रैक्टिस" },
        ],
        ctaLabel: "इस तारीख के लिए आवेदन करें",
      },
      coreProblem: {
        eyebrow: "ऑनलाइन भी क्यों पर्याप्त नहीं है",
        title: "आपके मन को और जानकारी नहीं चाहिए। उसे दूरी चाहिए।",
        desc: "आपने ऐप्स आज़माए। शायद एक लाइव ऑनलाइन सेशन भी। एक घंटे के लिए लूप हल्का होता है, फिर इनबॉक्स खुलता है और वापस आ जाता है।",
        painPoints: [
          "एक ऐप उस नर्वस सिस्टम से मुकाबला करता है जो वर्षों से हल्के अलार्म में रहा है — और हर बार हार जाता है, क्योंकि वह अब भी उसी शोरगुल वाले माहौल में चल रहा है जिसने थकान पैदा की।",
          "एक लाइव ऑनलाइन रिट्रीट में भी आपका फोन मेज़ पर बगल में रखा होता है। असली डिस्कनेक्ट स्क्रीन के ज़रिए कभी नहीं होता, मार्गदर्शन चाहे जितना अच्छा हो।",
          "गहन ऊर्जा कार्य — कुंडलिनी, समाधि, सीधा प्राणिक सक्रियण — सबसे सुरक्षित और सशक्त तब होता है जब गुरु शारीरिक रूप से मौजूद हों और ठीक-ठीक देख सकें आप कहां हैं, वीडियो कॉल से अंदाज़ा लगाने के बजाय।",
        ],
        solution:
          "इसीलिए रेजिडेंशियल फॉर्मैट मौजूद है। असली क्रिया योग, सीधे प्राण के साथ काम — आपकी अपनी जीवन शक्ति — ब्रह्मांडीय ऊर्जा और कॉस्मिक फ्यूज़न के ज़रिए, एक ऐसे कमरे में जहां कोई नोटिफिकेशन नहीं, कोई इनबॉक्स नहीं, और एक जीवित गुरु जो वाकई आपको देख सकते हैं। इन दिनों में जो होता है वह एक महसूस होने वाला, भौतिक बदलाव पैदा करता है, न कि घर लौटते ही मिटने वाली अस्थायी शांति।",
      },
      advantage: {
        eyebrow: "वह हिस्सा जो कोई ऐप दोहरा नहीं सकता",
        title: "चार चीज़ें जो सिर्फ उस कमरे में होती हैं",
        desc: "यही पूरी वजह है कि यह रिट्रीट रेजिडेंशियल है, वैकल्पिक नहीं।",
        items: [
          {
            title: "पूर्ण डिस्कनेक्ट",
            desc: "कोई नोटिफिकेशन नहीं, कोई इनबॉक्स नहीं, कोई \"बस एक चीज़ देख लूं\" नहीं। आपका नर्वस सिस्टम पूरी तरह शांत हो पाता है — अक्सर वर्षों में पहली बार।",
          },
          {
            title: "सीधा ऊर्जा संचरण",
            desc: "एक गुरु की रिकॉर्डिंग और उसी कमरे में बैठने में एक वास्तविक, महसूस होने वाला अंतर है। इसे डिजिटल नहीं किया जा सकता।",
          },
          {
            title: "छोटे, विशिष्ट समूह",
            desc: "यह कोई भीड़ भरा आयोजन नहीं। हर रिट्रीट जानबूझकर छोटा रखा जाता है, ताकि डॉ. कपिल वाकई आपकी मुद्रा, आपकी सांस, आपका प्रतिरोध देख सकें — और उसे तुरंत सुधार सकें।",
          },
          {
            title: "व्यक्तिगत जांच",
            desc: "हर आवेदक की पुष्टि से पहले समीक्षा होती है। इतना अंतरंग कमरा तभी काम करता है जब उसमें मौजूद हर व्यक्ति वाकई काम करने के लिए तैयार हो।",
          },
        ],
      },
      journey: {
        eyebrow: "काम खुद",
        title: "एक संरचित, बहु-दिवसीय विसर्जन",
        desc: "हर रेजिडेंशियल रिट्रीट एक जानबूझकर बनाई गई यात्रा के रूप में खुलता है — पहले ग्राउंडिंग, फिर ऊर्जा सक्रियण, फिर गहन स्थिरता, फिर एकीकरण — ताकि बदलाव को वाकई बैठने का समय मिले।",
        items: [
          {
            title: "ग्राउंडिंग और आगमन",
            desc: "सांस पुनर्संतुलन और नर्वस सिस्टम को शांत करना — गहरे काम की शुरुआत से पहले पूरी तरह उपस्थित होना।",
          },
          {
            title: "क्रिया योग और प्राणिक सक्रियण",
            desc: "मूल तकनीक, संरचित, सुरक्षित क्रम में सिखाई गई, व्यक्तिगत रूप से सुधारी गई।",
          },
          {
            title: "ऊर्जा और चक्र कार्य",
            desc: "सीधा, निर्देशित अभ्यास — किसी स्लाइड पर पढ़ा गया सिद्धांत नहीं।",
          },
          {
            title: "गहन स्थिरता और समाधि अभ्यास",
            desc: "वह अवस्था जिसकी ओर रिट्रीट का बाकी हर हिस्सा चुपचाप बढ़ रहा था।",
          },
          {
            title: "एकीकरण और समापन",
            desc: "ताकि जो आपने बनाया वह घर लौटते ही टूट न जाए।",
          },
        ],
      },
      gallery: {
        eyebrow: "रिट्रीट के अंदर",
        title: "यह वास्तव में कैसा दिखता है",
        desc: "माहौल, समूह, और अभ्यास की एक झलक — हर रिट्रीट के बाद असली तस्वीरें यहां जोड़ी जाएंगी।",
        viewGalleryCta: "पूरी गैलरी देखें",
      },
      authority: {
        eyebrow: "एक सिद्ध मार्ग, कोई ट्रेंड नहीं",
        title: "एक दशक से अधिक समय से एक ही गुरु द्वारा मार्गदर्शित",
        desc: "असली साल, असली विद्यार्थी, असली समीक्षाएं — कोई पिछली तिमाही में शुरू हुआ रिट्रीट नहीं।",
        cards: [
          {
            title: "2014 से पढ़ा रहे हैं",
            desc: "एक दशक से अधिक समय से व्यक्तिगत रूप से रेजिडेंशियल रिट्रीट्स का मार्गदर्शन — कोई हाल में शुरू हुआ रिट्रीट व्यवसाय ट्रेंड के पीछे नहीं भाग रहा।",
          },
          {
            title: "150+ असली विद्यार्थी समीक्षाएं",
            desc: "असली प्रतिभागियों की लिखित और वीडियो समीक्षाएं, कोई स्टॉक फुटेज या पेड एक्टर नहीं।",
          },
          {
            title: "हर रिट्रीट में छोटा समूह",
            desc: "हर रिट्रीट जानबूझकर छोटा रखा जाता है ताकि डॉ. कपिल वाकई आपका मार्गदर्शन कर सकें, भीड़ को लेक्चर न दें।",
          },
          {
            title: "व्यक्तिगत रूप से, स्वयं मौजूद",
            desc: "किसी सहायक प्रशिक्षक को नहीं सौंपा गया — डॉ. कपिल, पूरे रिट्रीट के दौरान शारीरिक रूप से मौजूद।",
          },
        ],
      },
      venues: {
        eyebrow: "यह कहां होता है",
        title: "दो पवित्र स्थान",
        desc: "हर स्थान जानबूझकर चुना गया है — भूमि खुद अभ्यास का हिस्सा है।",
        locations: [
          {
            name: "ड्रीम हॉलिडे रिज़ॉर्ट, तुंगार्ली",
            address: "तुंगार्ली, लोनावला, महाराष्ट्र",
            note: "चार में से तीन 2026–27 रिट्रीट्स की मेज़बानी — नवंबर 2026, जून 2027, और नवंबर 2027।",
          },
          {
            name: "होटल कृष्णा कॉटेज",
            address: "जोंक, स्वर्गाश्रम, ऋषिकेश",
            note: "फरवरी 2027 के रिट्रीट की मेज़बानी — गंगा के किनारे, हिमालय की आध्यात्मिक राजधानी में।",
          },
        ],
      },
      pricing: {
        eyebrow: "अपना कमरा चुनें",
        title: "एक कीमत, कोई आश्चर्य नहीं",
        desc: "सभी चार 2026–27 तारीखों पर एक समान दर — प्रति व्यक्ति, भोजन और ठहरना शामिल।",
        tiers: [
          {
            name: "शेयरिंग रूम",
            price: "₹35,000",
            priceNote: "प्रति व्यक्ति",
            features: [
              "पूरा रेजिडेंशियल रिट्रीट, सभी सेशन शामिल",
              "शेयर्ड डीलक्स आवास",
              "शुद्ध सात्विक भोजन, शामिल",
              "डॉ. कपिल का सीधा, व्यक्तिगत मार्गदर्शन",
            ],
            cta: "शेयरिंग रूम बुक करें",
          },
          {
            name: "प्राइवेट रूम",
            price: "₹45,000",
            priceNote: "प्रति व्यक्ति",
            features: [
              "पूरा रेजिडेंशियल रिट्रीट, सभी सेशन शामिल",
              "प्राइवेट, नॉन-शेयरिंग आवास",
              "शुद्ध सात्विक भोजन, शामिल",
              "डॉ. कपिल का सीधा, व्यक्तिगत मार्गदर्शन",
            ],
            cta: "प्राइवेट रूम बुक करें",
          },
        ],
        note: "सीटें डॉ. कपिल की टीम द्वारा व्यक्तिगत रूप से पुष्टि की जाती हैं, ऑटोमेटेड चेकआउट से नहीं — शुरू करने के लिए अपनी पसंदीदा तारीख के साथ हमें WhatsApp पर मैसेज करें।",
      },
      videoTestimonials: {
        eyebrow: "असली विद्यार्थियों को देखें",
        title: "एक दशक से अधिक के असली रिट्रीट्स से, 150+ असली समीक्षाएं",
        desc: "छह असली विद्यार्थी, रिट्रीट पूरा करने के बाद फिल्माए गए — बिना किसी स्क्रिप्ट के। देखने के लिए किसी भी वीडियो पर टैप करें।",
        ctaLabel: "और वीडियो समीक्षाएं",
      },
      audience: {
        eyebrow: "यहां खुद से ईमानदार रहें",
        title: "यह सबके लिए नहीं है। यह आपके लिए है अगर —",
        items: [
          "आप एक हाई-परफॉर्मर हैं जो चुपचाप बर्नआउट में हैं — कागज़ पर सफल, अंदर से थके हुए",
          "आप लगातार ओवरथिंक करते हैं — हालात ठीक होने से लूप रुकता नहीं",
          "आपने ऐप्स, किताबें, पॉडकास्ट आज़माए हैं — और अस्थायी राहत मिली, असली बदलाव कभी नहीं",
          "आप एक असली आध्यात्मिक खोजी हैं — असली अभ्यास के लिए तैयार, और कंटेंट के लिए नहीं",
          "आप रिट्रीट की पूरी अवधि के लिए पूरी तरह प्रतिबद्ध हो सकते हैं — यह तभी काम करता है जब आप वाकई निकलें",
        ],
        disclaimer: "अगर आप थोड़े योग के साथ एक आरामदायक छुट्टी ढूंढ रहे हैं, तो यह वह नहीं है। अगर आप एक गुरु की करीबी निगरानी में असली, संरचित आंतरिक काम के लिए तैयार हैं, तो आप सही जगह हैं।",
      },
      faq: {
        eyebrow: "आवेदन करने से पहले",
        title: "बुकिंग से पहले लोग जो सवाल पूछते हैं",
        items: [
          {
            question: "क्या यह पूर्ण शुरुआती लोगों के लिए उपयुक्त है?",
            answer: "हां। क्रिया योग, मेडिटेशन, या ऊर्जा कार्य का कोई पूर्व अनुभव आवश्यक नहीं। हर अभ्यास शुरुआत से सिखाया जाता है, सुरक्षित, संरचित क्रम में।",
          },
          {
            question: "क्या ऊर्जा कार्य — कुंडलिनी, समाधि — वाकई सुरक्षित है?",
            answer:
              "हर तकनीक चरण-दर-चरण सिखाई जाती है, सीधी व्यक्तिगत निगरानी में। फिर भी, ये गहन अभ्यास हैं — कुछ लोगों के लिए, गहरा ध्यान या ऊर्जा-केंद्रित कार्य तीव्र भावनात्मक अनुभव सामने ला सकता है। हम प्रतिभागियों से रिट्रीट से पहले किसी भी प्रासंगिक मानसिक स्वास्थ्य इतिहास को साझा करने का अनुरोध करते हैं, ताकि डॉ. शर्मा उसके अनुसार गति समायोजित कर सकें। यह रिट्रीट एक व्यक्तिगत और आध्यात्मिक अभ्यास है, लाइसेंस-प्राप्त थेरेपी या मनोरोग उपचार का विकल्प नहीं — यदि आप वर्तमान में किसी मानसिक स्वास्थ्य स्थिति के लिए उपचार ले रहे हैं, तो कृपया शामिल होने से पहले अपने चिकित्सक से सलाह लें।",
          },
          {
            question: "यह आपके 11-दिवसीय ऑनलाइन रिट्रीट से कैसे अलग है?",
            answer: "ऑनलाइन रिट्रीट एक लाइव, निर्देशित यात्रा है जिसे आप घर से जुड़ते हैं। रेजिडेंशियल रिट्रीट में आपको शारीरिक रूप से यात्रा करनी और वहां ठहरना होता है — पूर्ण डिस्कनेक्ट, सीधा व्यक्तिगत ऊर्जा संचरण, और एक छोटा व्यक्तिगत समूह जो ऑनलाइन फॉर्मैट दोहरा नहीं सकता।",
          },
          {
            question: "कीमत में क्या शामिल है?",
            answer: "दोनों रूम विकल्प — ₹35,000 शेयरिंग, ₹45,000 प्राइवेट — में पूरा रेजिडेंशियल रिट्रीट, सभी सेशन, शुद्ध सात्विक भोजन, और वेन्यू पर आपका ठहरना शामिल है।",
          },
          {
            question: "मुझे क्या साथ लाना चाहिए?",
            answer: "आरामदायक कपड़े, एक डायरी, और एक खुला मन। पूरी ज़रूरी सामान की सूची आपकी सीट की पुष्टि होने के बाद साझा की जाती है।",
          },
          {
            question: "क्या भोजन में आहार संबंधी ज़रूरतों का ध्यान रखा जाता है?",
            answer: "हां — शुद्ध सात्विक शाकाहारी भोजन मानक है, जैन, ग्लूटेन-फ्री, और एलर्जी-फ्रेंडली विकल्प अनुरोध पर उपलब्ध हैं।",
          },
        ],
        ctaLabel: "WhatsApp पर पूछें",
      },
      finalCta: {
        eyebrow: "चार तारीखें। हर एक में सीमित सीटें।",
        title: "कमरा जानबूझकर छोटा है। आवेदन करने में देर न करें।",
        desc: "चारों 2026–2027 रेजिडेंशियल रिट्रीट्स में सीटों की एक सख्त सीमा है, क्योंकि पूरी विधि इस पर निर्भर करती है कि डॉ. कपिल वाकई कमरे में मौजूद हर व्यक्ति को देख सकें। सीटें आवेदन आने के क्रम में पुष्टि की जाती हैं।",
        cta: "अपनी रेजिडेंशियल सीट सुरक्षित करें",
      },
      stickyBar: {
        text: "रेजिडेंशियल रिट्रीट्स — लोनावला और ऋषिकेश",
        price: "₹35,000 प्रति व्यक्ति से शुरू",
        cta: "अपनी सीट सुरक्षित करें",
      },
      whatsapp: {
        bubble: "रेजिडेंशियल रिट्रीट के बारे में सवाल हैं? डॉ. कपिल की टीम से तुरंत बात करें।",
        button: "WhatsApp पर चैट करें",
        ariaLabel: "रेजिडेंशियल रिट्रीट्स के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें",
      },
    },
    mentoringLanding: {
      hero: {
        eyebrowBadges: ["निजी", "संरचित", "सीमित उपलब्धता"],
        headline: "आपकी स्थिति पर केंद्रित काम, किसी ऐसे व्यक्ति के साथ जो 26 वर्षों से यह कर रहा है।",
        sub: "ओवरथिंकिंग, फोकस, और व्यक्तिगत विकास के लिए वन-ऑन-वन मेंटरिंग — आप वास्तव में जिससे जूझ रहे हैं उसके अनुसार ढाला गया, किसी तय पाठ्यक्रम के अनुसार नहीं।",
        guideLabel: "आपके गुरु",
        guideName: "डॉ. कपिल देव शर्मा",
        guideCredential: "प्रोफेसर · शोधकर्ता · लाइफ कोच · 26 वर्ष",
        ctaPrimary: "अभी आवेदन करें",
      },
      fit: {
        eyebrow: "क्या यह आपके लिए है?",
        title: "आपको व्यक्तिगत कार्य से लाभ हो सकता है अगर…",
        items: [
          "मैं अपने पैटर्न समझता/समझती हूं, फिर भी उन्हें दोहराता/दोहराती हूं।",
          "मुझे मार्गदर्शन चाहिए, और जानकारी नहीं।",
          "मैं मानसिक रूप से अत्यधिक बोझिल महसूस करता/करती हूं।",
          "ग्रुप प्रोग्राम मेरी स्थिति में पूरी तरह फिट नहीं बैठते।",
        ],
      },
      areas: {
        eyebrow: "क्षेत्र",
        title: "छह शुरुआती बिंदु, आपके अनुसार ढाले गए",
        items: [
          {
            title: "ओवरथिंकिंग",
            desc: "अपने आप चलने वाले विचार पैटर्न को समझना — और उन्हें अलग तरीके से संभालने की क्षमता बनाना।",
          },
          {
            title: "फोकस",
            desc: "काम पर, बातचीत में, और रोज़मर्रा की ज़िंदगी में जानबूझकर ध्यान केंद्रित करने की क्षमता विकसित करना।",
          },
          {
            title: "मेडिटेशन प्रैक्टिस",
            desc: "एक ऐसी व्यक्तिगत प्रैक्टिस स्थापित करना जो वाकई टिकाऊ हो — गाइडेड, समायोजित, और आपकी दिनचर्या के अनुसार ढाली गई।",
          },
          {
            title: "भावनात्मक जागरूकता",
            desc: "भावनात्मक स्थितियों को प्रतिक्रिया तय करने से पहले पहचानना सीखना — अधिक स्पष्टता और कम प्रतिक्रियात्मकता के साथ।",
          },
          {
            title: "मानसिक स्पष्टता",
            desc: "ऐसी आंतरिक स्थितियां बनाना जहां निर्णय, संवाद, और रोज़मर्रा का अनुभव कम थकाऊ हो जाए।",
          },
          {
            title: "व्यक्तिगत विकास",
            desc: "विशिष्ट पैटर्न, आदतों, या जीवन के उन क्षेत्रों पर काम करना जो अकेली जानकारी से नहीं बदल रहे।",
          },
        ],
        disclaimer:
          "हर प्रोग्राम कस्टमाइज़्ड है। ऊपर दिए गए क्षेत्र शुरुआती बिंदु हैं — सेशंस आपसे जुड़ी बातों के अनुसार ढाले जाते हैं, किसी तय पाठ्यक्रम के अनुसार नहीं। किसी परिणाम की गारंटी न तो दी जाती है, न ही निहित है।",
      },
      comparison: {
        eyebrow: "अंतर को समझना",
        title: "ग्रुप प्रोग्राम बनाम",
        titleEm: "पर्सनल इंटेंसिव।",
        columnGroup: "ग्रुप प्रोग्राम",
        columnPersonal: "पर्सनल इंटेंसिव",
        rows: [
          { label: "सेटिंग", group: "दूसरों के साथ साझा", personal: "निजी, केवल वन-ऑन-वन" },
          { label: "गति", group: "तय बैच शेड्यूल", personal: "आपका शेड्यूल, आपकी गति" },
          { label: "सामग्री", group: "ग्रुप के लिए मानकीकृत", personal: "आपकी स्थिति के अनुसार डिज़ाइन" },
          { label: "उपलब्धता", group: "तय मासिक बैच", personal: "कभी भी आवेदन करें, तैयार होने पर शुरू करें" },
          { label: "फॉलो-अप", group: "साझा ग्रुप चेक-इन", personal: "सेशंस के बीच सीधा फॉलो-अप" },
        ],
      },
      process: {
        eyebrow: "प्रक्रिया",
        title: "यह कैसे काम करता है।",
        steps: [
          {
            title: "आवेदन करें",
            desc: "एक छोटा फॉर्म भरें या WhatsApp पर मैसेज करें। बताएं कि आप वर्तमान में किससे जूझ रहे हैं और किस पर काम करना चाहते हैं।",
          },
          {
            title: "संक्षिप्त बातचीत",
            desc: "किसी भी सिफारिश से पहले आपकी स्थिति को ठीक से समझने के लिए एक छोटी कॉल या WhatsApp बातचीत।",
          },
          {
            title: "कस्टम प्लान",
            desc: "आपने जो साझा किया उसके आधार पर एक सेशन प्लान प्रस्तावित किया जाता है — आगे बढ़ना है या नहीं, यह आप तय करते हैं। कोई दबाव नहीं, कोई अग्रिम प्रतिबद्धता नहीं।",
          },
        ],
        formats: [
          {
            duration: "7 दिन",
            tag: "फोकस्ड",
            desc: "रोज़ाना सेशंस। एक तय क्षेत्र। स्पष्ट दैनिक संरचना और निरंतर सहयोग।",
          },
          {
            duration: "14 दिन",
            tag: "अनुशंसित",
            desc: "आपस में जुड़े मुद्दों के लिए दो सप्ताह। सेशंस आगे बढ़ने के साथ तरीके को समायोजित करने की गुंजाइश।",
          },
        ],
      },
      guide: {
        eyebrow: "गुरु",
        title: "डॉ. कपिल देव शर्मा",
        credential: "प्रोफेसर · शोधकर्ता · लाइफ कोच · 26 वर्षों का अनुभव",
        bio: "डॉ. कपिल देव शर्मा 26 वर्षों का अनुभव लाते हैं — औपचारिक शिक्षा में 15 वर्ष प्रोफेसर और शोधकर्ता के रूप में, और 11 वर्ष लाइफ कोच और माइंड ट्रेनर के रूप में। यही शैक्षणिक कठोरता और प्रत्यक्ष कोचिंग अभ्यास का मेल तय करता है कि सेशंस कैसे बनाए जाते हैं।",
        stats: [
          { value: "26", label: "कुल वर्ष" },
          { value: "15", label: "वर्ष प्रोफेसर" },
          { value: "11", label: "वर्ष कोचिंग" },
        ],
        quote:
          "ज़्यादातर लोग पहले से जानते हैं कि उन्हें क्या बदलना है। मुश्किल काम यह समझना है कि उन्होंने अब तक ऐसा क्यों नहीं किया — और वे स्थितियां बनाना जिनमें यह संभव हो सके।",
      },
      testimonials: {
        eyebrow: "लोग क्या कहते हैं",
        title: "प्रतिभागियों के अनुभव।",
        ctaLabel: "और समीक्षाएं देखें",
        comingSoonNote: "1-on-1 मेंटरिंग क्लाइंट्स की वीडियो समीक्षाएं रिकॉर्ड होते ही यहां जोड़ी जाएंगी।",
      },
      apply: {
        eyebrow: "आवेदन करें",
        title: "बातचीत शुरू करें।",
        sub: "एक छोटा आवेदन। अभी कोई प्रतिबद्धता नहीं।",
        body: "यह फॉर्म किसी भी सिफारिश से पहले आपकी स्थिति को समझने में मदद करता है। आगे बढ़ने की कोई बाध्यता नहीं है।",
        nameLabel: "नाम",
        phoneLabel: "फ़ोन",
        cityLabel: "शहर",
        situationLabel: "आप वर्तमान में किससे जूझ रहे हैं?",
        situationOptionalTag: "वैकल्पिक",
        situationPlaceholder: "वैकल्पिक — एक-दो पंक्तियां काफी हैं",
        submitLabel: "आवेदन भेजें",
        disclaimer:
          "यह एक व्यक्तिगत-विकास और कोचिंग प्रैक्टिस है, लाइसेंस-प्राप्त थेरेपी या मनोरोग उपचार का विकल्प नहीं। यदि आप वर्तमान में किसी मानसिक स्वास्थ्य स्थिति के लिए उपचार ले रहे हैं, या संकट में हैं, तो कृपया किसी लाइसेंस-प्राप्त पेशेवर या स्थानीय आपातकालीन सेवाओं से संपर्क करें।",
      },
      faq: {
        eyebrow: "सवाल",
        title: "आवेदन करने से पहले",
        items: [
          {
            question: "यह ग्रुप प्रोग्राम्स से कैसे अलग है?",
            answer:
              "ग्रुप प्रोग्राम्स (जैसे 30-दिवसीय मास्टरक्लास या 11-दिवसीय रिट्रीट) एक तय शेड्यूल पर चलते हैं, पूरे बैच के लिए मानकीकृत सामग्री के साथ। यह निजी, वन-ऑन-वन है, और पूरी तरह आपकी अपनी स्थिति के अनुसार ढाला गया है — गति, फोकस क्षेत्र, और प्रारूप आपके अनुसार समायोजित होते हैं, इसके उलट नहीं।",
          },
          {
            question: "अगर मुझे यकीन नहीं है कि मुझे किस चीज़ में मदद चाहिए?",
            answer:
              "यही वजह है कि संक्षिप्त बातचीत का चरण मौजूद है। आवेदन करने से पहले आपको स्पष्ट निदान की ज़रूरत नहीं — बस इतना अंदाज़ा काफी है कि क्या ठीक से काम नहीं कर रहा। डॉ. शर्मा उस पहली बातचीत में ही असली फोकस क्षेत्र पहचानने में मदद करते हैं, किसी भी योजना के प्रस्तावित होने से पहले।",
          },
          {
            question: "क्या यह थेरेपी है?",
            answer:
              "नहीं। यह एक व्यक्तिगत-विकास और कोचिंग प्रैक्टिस है, लाइसेंस-प्राप्त थेरेपी या मनोरोग उपचार का विकल्प नहीं। यदि आप वर्तमान में किसी मानसिक स्वास्थ्य स्थिति के लिए उपचार ले रहे हैं, या संकट में हैं, तो कृपया किसी लाइसेंस-प्राप्त पेशेवर या स्थानीय आपातकालीन सेवाओं से संपर्क करें।",
          },
          {
            question: "आवेदन करने के बाद क्या होता है?",
            answer:
              "आपकी स्थिति समझने के लिए आपको एक छोटी कॉल या WhatsApp बातचीत के लिए संपर्क किया जाएगा। उसके बाद, एक सेशन प्लान प्रस्तावित किया जाता है — आगे बढ़ना है या नहीं, यह आप तय करते हैं। आवेदन के चरण में कोई अग्रिम प्रतिबद्धता नहीं है।",
          },
        ],
      },
      whatsapp: {
        bubble: "1-on-1 मेंटरिंग के बारे में सवाल हैं? डॉ. कपिल की टीम से तुरंत बात करें।",
        button: "WhatsApp पर चैट करें",
        ariaLabel: "1-on-1 मेंटरिंग के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें",
      },
      stickyBar: {
        text: "पर्सनल क्लास — 1-on-1 इंटेंसिव मेंटरिंग",
        price: "निजी · पूरी तरह कस्टमाइज़्ड",
        cta: "अभी आवेदन करें",
      },
    },
    mindResetLanding: {
      hero: {
        eyebrow: "ओवरथिंकिंग और मानसिक स्पष्टता",
        productName: "द 21-डे माइंड रीसेट सिस्टम™",
        headline: "अपने विचारों में उलझना बंद करें। अपने मन को समझना शुरू करें।",
        tagline: "अपने मन को समझें • मानसिक स्पष्टता बनाएं",
        sub: "रोज़ाना ट्रेनिंग, मेडिटेशन, और गाइडेड एक्टिविटी के 21 दिन। 6-महीने के एक्सेस के साथ डॉ. कपिल के लाइव सेशंस शामिल हैं।",
        ctaPrimary: "अपना माइंड रीसेट शुरू करें — ₹499",
        ctaSecondary: "मुफ़्त ओवरथिंकिंग टेस्ट लें",
        trustLine: "हिंदी ऑनलाइन प्रोग्राम • 21 दिन • गाइडेड लर्निंग • मेडिटेशन",
      },
      problem: {
        eyebrow: "जाना-पहचाना लगता है?",
        title: "क्या आपका मन आराम करना चाहते हुए भी व्यस्त रहता है?",
        items: [
          "पुरानी बातचीत को बार-बार दोहराना",
          "आगे क्या होगा, इसकी चिंता करना",
          "अपने विचारों को बंद करना मुश्किल लगना",
          "काम, परिवार, या रोज़मर्रा की ज़िम्मेदारियों से मानसिक रूप से अभिभूत महसूस करना",
          "एक समय में एक चीज़ पर फोकस करने में परेशानी होना",
          "सोचने में बहुत समय, और वर्तमान में महसूस करने में बहुत कम समय बिताना",
        ],
        closingLine:
          "आपसे यह उम्मीद नहीं है कि आप एक दिन में सब कुछ बदल दें। आप बस यह समझने से शुरू कर सकते हैं कि आपके मन में क्या हो रहा है।",
      },
      whatIsOverthinking: {
        eyebrow: "फर्क को समझना",
        title: "ओवरथिंकिंग असल में क्या है?",
        desc: "सोचना खुद कोई समस्या नहीं है। ओवरथिंकिंग तब होती है जब सोचना उपयोगी होना बंद कर देता है — वही चिंता बार-बार दोहराई जाती है, बिना किसी निर्णय के करीब पहुंचे।",
        productiveLabel: "उपयोगी सोच",
        productiveSteps: ["समझें", "निर्णय लें", "कार्य करें"],
        overthinkingLabel: "ओवरथिंकिंग",
        overthinkingSteps: ["दोहराएं", "चिंता करें", "मानसिक थकान"],
      },
      assessmentCta: {
        eyebrow: "मुफ़्त ओवरथिंकिंग टेस्ट",
        title: "अपने विचार, चिंता और तनाव के पैटर्न को समझें",
        desc: "ओवरथिंकिंग, चिंता, और तनाव से जुड़े अपने अनुभवों पर विचार करने के लिए एक सरल सेल्फ-अवेयरनेस टेस्ट लें।",
        scoreCards: [
          { title: "ओवरथिंकिंग अवेयरनेस" },
          { title: "चिंता/एंग्ज़ायटी अवेयरनेस" },
          { title: "तनाव अवेयरनेस" },
        ],
        cta: "ओवरथिंकिंग टेस्ट लें",
        disclaimer:
          "केवल सेल्फ-अवेयरनेस और शैक्षणिक उद्देश्यों के लिए — यह कोई क्लिनिकल डायग्नोस्टिक टेस्ट नहीं है, और परिणाम कोई मेडिकल डायग्नोसिस नहीं हैं।",
      },
      experience: {
        eyebrow: "आप क्या अनुभव करेंगे",
        title: "आपके मन के लिए एक सरल 21-दिवसीय यात्रा",
        desc: "हर दिन एक ही संरचित रूटीन का पालन होता है, जो पिछले दिन पर आधारित होता है।",
        items: [
          { title: "ट्रेनिंग वीडियो", desc: "उस दिन के फोकस को पेश करने वाला एक छोटा दैनिक पाठ।" },
          { title: "एजुकेशनल वीडियो", desc: "उस दिन के विषय के पीछे की सोच या मनोविज्ञान, सरल भाषा में समझाया गया।" },
          { title: "गाइडेड मेडिटेशन", desc: "उस दिन जो सिखाया जा रहा है उसे लागू करने के लिए एक छोटा अभ्यास।" },
          { title: "दैनिक गतिविधि", desc: "इसे वास्तविक बनाने के लिए एक व्यावहारिक अभ्यास या चिंतन, सिर्फ़ सिद्धांत नहीं।" },
          { title: "PDF वर्कबुक", desc: "अपने पैटर्न और प्रगति को ट्रैक करने की जगह।" },
        ],
        liveSessionsNote: {
          title: "डॉ. कपिल के साथ 2 लाइव सेशंस",
          desc: "केवल 6-महीने के एक्सेस (₹999) के साथ शामिल — ₹499 प्लान का हिस्सा नहीं।",
        },
      },
      journey: {
        eyebrow: "आपके 21 दिन",
        title: "21-दिवसीय कोर्स यात्रा",
        desc: "तीन चरणों का एक व्यापक अवलोकन — सटीक दैनिक पाठ शीर्षक नहीं।",
        stages: [
          {
            label: "दिन 1–7",
            title: "अपने मन को समझें",
            topics: [
              "ओवरथिंकिंग को समझना",
              "विचार पैटर्न पहचानना",
              "ओवरथिंकिंग साइकल को समझना",
              "थॉट अवेयरनेस",
              "भूत, वर्तमान, और भविष्य की सोच",
              "व्यक्तिगत ट्रिगर्स पहचानना",
              "सप्ताह 1 चिंतन",
            ],
          },
          {
            label: "दिन 8–14",
            title: "अपने विचारों और भावनाओं के साथ काम करें",
            topics: [
              "तनाव को समझना",
              "चिंता और एंग्ज़ायटी से जुड़े अनुभवों को समझना",
              "रुकने (pause) की शक्ति",
              "अनुपयोगी विचारों को पहचानना",
              "आत्म-संदेह और आंतरिक संवाद",
              "इमोशनल अवेयरनेस",
              "सप्ताह 2 चिंतन",
            ],
          },
          {
            label: "दिन 15–21",
            title: "मानसिक स्पष्टता और बेहतर आदतें बनाएं",
            topics: [
              "फोकस और मानसिक स्पष्टता",
              "माइंडफुल लिविंग",
              "डिजिटल ओवरलोड और मानसिक स्थान",
              "बेहतर निर्णय लेना",
              "स्वस्थ सीमाएं (boundaries)",
              "एक व्यक्तिगत माइंड-रीसेट रूटीन बनाना",
              "अंतिम चिंतन और अगले कदम",
            ],
          },
        ],
      },
      whoFor: {
        eyebrow: "यह किसके लिए है?",
        title: "असली भारतीय जीवन के लिए बनाया गया",
        items: [
          { title: "कामकाजी पेशेवर", desc: "काम के दबाव और घंटों बाद भी न रुकने वाले मन को संभालना।" },
          { title: "माता-पिता", desc: "पारिवारिक जीवन की रोज़ की मांगों के बीच शांत, स्पष्ट सोच की तलाश।" },
          { title: "विद्यार्थी", desc: "परीक्षा के तनाव और दौड़ते विचारों को संभालना सीखना।" },
          { title: "गृहणियां", desc: "घर पर पूरे दिन के साथ फिट बैठने वाला एक संरचित अभ्यास चाहने वाली।" },
          { title: "उद्यमी", desc: "लगातार निर्णयों और उनके साथ आने वाले मानसिक बोझ को संभालना।" },
          { title: "सेल्फ-अवेयरनेस के बारे में जिज्ञासु कोई भी व्यक्ति", desc: "अपने मन को बेहतर समझना शुरू करने के लिए आपको किसी खास समस्या की ज़रूरत नहीं।" },
        ],
        disclaimer: "यह कोर्स शैक्षणिक और सेल्फ-अवेयरनेस पर केंद्रित है — यह मानसिक स्वास्थ्य उपचार का विकल्प नहीं है।",
      },
      included: {
        eyebrow: "आपको क्या मिलता है",
        title: "आपके प्लान में शामिल सब कुछ",
        universalLabel: "हर प्लान में शामिल",
        universalItems: [
          "21 दिनों की संरचित लर्निंग",
          "हिंदी ट्रेनिंग वीडियो",
          "एजुकेशनल वीडियो",
          "गाइडेड मेडिटेशन",
          "दैनिक व्यावहारिक गतिविधियां",
          "PDF वर्कबुक्स",
          "₹499 प्लान के साथ 1-महीने का एक्सेस, या ₹999 प्लान के साथ 6-महीने का एक्सेस",
        ],
        extraLabel: "₹999 प्लान के साथ अतिरिक्त",
        extraItem: "डॉ. कपिल देव शर्मा के साथ 2 लाइव सेशंस",
      },
      guide: {
        eyebrow: "आपके गुरु",
        title: "डॉ. कपिल देव शर्मा",
        credential: "प्रोफेसर · शोधकर्ता · लाइफ कोच · 26 वर्षों का अनुभव",
        bio: "डॉ. कपिल देव शर्मा 26 वर्षों का अनुभव लाते हैं — औपचारिक शिक्षा में 15 वर्ष प्रोफेसर और शोधकर्ता के रूप में, और 11 वर्ष लाइफ कोच और माइंड ट्रेनर के रूप में। यही शैक्षणिक कठोरता और प्रत्यक्ष कोचिंग अभ्यास का मेल तय करता है कि यह कोर्स कैसे बनाया गया है।",
        stats: [
          { value: "26", label: "कुल वर्ष" },
          { value: "15", label: "वर्ष प्रोफेसर" },
          { value: "11", label: "वर्ष कोचिंग" },
        ],
        quote:
          "ज़्यादातर लोग पहले से जानते हैं कि उन्हें क्या बदलना है। मुश्किल काम यह समझना है कि उन्होंने अब तक ऐसा क्यों नहीं किया — और वे स्थितियां बनाना जिनमें यह संभव हो सके।",
      },
      pricing: {
        eyebrow: "प्राइसिंग",
        title: "आज ही अपनी माइंड रीसेट यात्रा शुरू करें",
        classplusNote: "आपका प्लान Classplus पर चेकआउट के समय चुना जाता है।",
        card1: {
          name: "माइंड रीसेट स्टार्टर",
          price: "₹499",
          period: "1 महीने का एक्सेस",
          desc: "ट्रेनिंग, मेडिटेशन, गतिविधियों, और PDFs के साथ एक पूरा 21-दिवसीय हिंदी लर्निंग अनुभव — पूरी तरह सेल्फ-पेस्ड।",
          features: [
            "पूरा 21-दिवसीय कोर्स",
            "ट्रेनिंग वीडियो",
            "एजुकेशनल वीडियो",
            "गाइडेड मेडिटेशन",
            "दैनिक गतिविधियां",
            "PDF वर्कबुक्स",
          ],
          cta: "₹499 में जुड़ें",
        },
        card2: {
          name: "माइंड रीसेट एक्सटेंडेड",
          price: "₹999",
          period: "6 महीने का एक्सेस",
          desc: "डॉ. कपिल से लाइव मार्गदर्शन और अभ्यास के लिए ज़्यादा समय चाहिए? इसमें ₹499 प्लान का सब कुछ शामिल है, साथ ही डॉ. कपिल के साथ लाइव सेशंस।",
          features: [
            "पूरा 21-दिवसीय कोर्स",
            "ट्रेनिंग वीडियो",
            "एजुकेशनल वीडियो",
            "गाइडेड मेडिटेशन",
            "दैनिक गतिविधियां",
            "PDF वर्कबुक्स",
          ],
          liveSessionHighlight: "डॉ. कपिल के साथ 2 लाइव सेशंस",
          cta: "6-महीने का एक्सेस चुनें",
        },
        comparisonNote:
          "दोनों प्लान में पूरा 21-दिवसीय सेल्फ-पेस्ड कोर्स शामिल है। 6-महीने का प्लान अतिरिक्त रूप से डॉ. कपिल के साथ 2 लाइव सेशंस और प्रोग्राम पूरा करने के लिए ज़्यादा समय देता है।",
      },
      howItWorks: {
        eyebrow: "यह कैसे काम करता है",
        title: "यह कैसे काम करता है",
        steps: [
          { title: "ओवरथिंकिंग टेस्ट लें", desc: "आप कहां से शुरू कर रहे हैं यह समझने के लिए मुफ़्त ओवरथिंकिंग टेस्ट लें।" },
          { title: "अपना एक्सेस चुनें", desc: "1 महीने के लिए ₹499 चुनें, या 6 महीने और लाइव सेशंस के लिए ₹999।" },
          { title: "सीखें और अभ्यास करें", desc: "21 दिनों तक दैनिक रूटीन का पालन करें — करीब 20–30 मिनट प्रतिदिन।" },
          { title: "बनाते रहें", desc: "दिन 21 के बाद भी अपना व्यक्तिगत माइंड-रीसेट रूटीन बनाना जारी रखें।" },
        ],
      },
      faq: {
        eyebrow: "सवाल",
        title: "शुरू करने से पहले",
        ctaLabel: "WhatsApp पर पूछें",
        items: [
          {
            question: "द 21-डे माइंड रीसेट सिस्टम™ क्या है?",
            answer:
              "ओवरथिंकिंग को समझने, मानसिक स्पष्टता विकसित करने, और बेहतर मन की आदतें बनाने के लिए एक 21-दिवसीय गाइडेड हिंदी ऑनलाइन प्रोग्राम — दैनिक ट्रेनिंग वीडियो, मेडिटेशन, और गतिविधियों के ज़रिए।",
          },
          {
            question: "क्या कोर्स हिंदी में है?",
            answer: "हां। सभी ट्रेनिंग वीडियो, एजुकेशनल वीडियो, और गाइडेड मेडिटेशन हिंदी में हैं।",
          },
          {
            question: "कोर्स में क्या शामिल है?",
            answer:
              "हर दिन में एक ट्रेनिंग वीडियो, एक एजुकेशनल वीडियो, गाइडेड मेडिटेशन, एक दैनिक गतिविधि, और PDF वर्कबुक सामग्री शामिल है। ₹999 प्लान में अतिरिक्त रूप से डॉ. कपिल के साथ 2 लाइव सेशंस शामिल हैं।",
          },
          {
            question: "क्या लाइव सेशंस दोनों प्लान्स में शामिल हैं?",
            answer:
              "नहीं। लाइव सेशंस केवल ₹999 / 6-महीने प्लान के साथ शामिल हैं। ₹499 / 1-महीना प्लान पूरी तरह सेल्फ-पेस्ड है, इसमें कोई लाइव सेशन नहीं है।",
          },
          {
            question: "₹499 और ₹999 में क्या फर्क है?",
            answer:
              "दो चीज़ें: एक्सेस अवधि (₹499 के साथ 1 महीना बनाम ₹999 के साथ 6 महीने), और लाइव सेशंस — ₹999 प्लान में डॉ. कपिल के साथ 2 लाइव सेशंस शामिल हैं, जो ₹499 प्लान में नहीं हैं।",
          },
          {
            question: "कोर्स कितने दिन का है?",
            answer: "21 दिनों की दैनिक सामग्री, जिसे रोज़ाना करीब 20–30 मिनट में पूरा करने के लिए डिज़ाइन किया गया है।",
          },
          {
            question: "क्या मैं अपने मोबाइल से सीख सकता/सकती हूं?",
            answer: "हां, यह कोर्स Classplus ऐप या वेबसाइट के ज़रिए पूरी तरह मोबाइल-फ्रेंडली है।",
          },
          {
            question: "क्या मुझे पहले से मेडिटेशन का अनुभव चाहिए?",
            answer: "किसी पूर्व अनुभव की ज़रूरत नहीं — यह कोर्स आपको जहां से आप शुरू कर रहे हैं वहीं से मार्गदर्शन देने के लिए बनाया गया है।",
          },
          {
            question: "क्या यह कोर्स एंग्ज़ायटी या डिप्रेशन का इलाज है?",
            answer:
              "नहीं। यह एक शैक्षणिक, सेल्फ-अवेयरनेस-केंद्रित कोर्स है। यह लाइसेंस-प्राप्त थेरेपी या मनोरोग उपचार का विकल्प नहीं है। यदि आप वर्तमान में किसी मानसिक स्वास्थ्य स्थिति के लिए उपचार ले रहे हैं, या संकट में हैं, तो कृपया किसी लाइसेंस-प्राप्त पेशेवर या स्थानीय आपातकालीन सेवाओं से संपर्क करें।",
          },
          {
            question: "क्या मैं खरीदने से पहले ओवरथिंकिंग टेस्ट ले सकता/सकती हूं?",
            answer: "हां — ओवरथिंकिंग टेस्ट मुफ़्त है और किसी के लिए भी उपलब्ध है, चाहे आप कोर्स में नामांकन करें या नहीं।",
          },
          {
            question: "खरीदने के बाद क्या होता है?",
            answer: "[एक्सेस-डिलीवरी के विवरण पुष्टि होना बाकी — आपको Classplus प्लेटफ़ॉर्म के लिए एक्सेस निर्देश मिलेंगे, जहां यह कोर्स होस्ट है।]",
          },
        ],
      },
      finalCta: {
        eyebrow: "जब आप तैयार हों",
        headline: "आपके मन को आपके ध्यान की ज़रूरत है।",
        desc: "एक छोटे कदम से शुरू करें। सीखें, चिंतन करें, अभ्यास करें, और अपने विचारों के साथ एक बेहतर रिश्ता बनाएं।",
        ctaPrimary: "अपना माइंड रीसेट शुरू करें — ₹499",
        ctaSecondary: "मुफ़्त ओवरथिंकिंग टेस्ट लें",
      },
      whatsapp: {
        bubble: "द 21-डे माइंड रीसेट सिस्टम के बारे में सवाल हैं? डॉ. कपिल की टीम से तुरंत बात करें।",
        button: "WhatsApp पर चैट करें",
        ariaLabel: "द 21-डे माइंड रीसेट सिस्टम के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें",
      },
      stickyBar: {
        text: "द 21-डे माइंड रीसेट सिस्टम",
        price: "₹499 · 1-महीना एक्सेस",
        cta: "₹499 में शुरू करें",
      },
    },
    overthinkingTestLanding: {
      meta: {
        title: "Overthinking Test — मुफ़्त 2-मिनट सेल्फ-अवेयरनेस टेस्ट",
        description: "ओवरथिंकिंग, चिंता, और तनाव के पैटर्न के लिए एक मुफ़्त 2-मिनट सेल्फ-अवेयरनेस टेस्ट — कोई डायग्नोसिस नहीं, बस एक आईना।",
      },
      hero: {
        eyebrow: "मुफ़्त · 2 मिनट · 15 सवाल",
        headline: "क्या आप ज़रूरत से ज़्यादा सोचते हैं?",
        sub: "एक मुफ़्त 2-मिनट सेल्फ-अवेयरनेस टेस्ट — कोई डायग्नोसिस नहीं, बस एक आईना।",
        startCta: "टेस्ट शुरू करें",
      },
      scaleLabels: ["कभी नहीं", "कभी-कभी", "अक्सर", "ज़्यादातर समय", "हमेशा"],
      progress: { label: "सवाल", of: "में से" },
      backLabel: "पीछे",
      categories: [
        {
          key: "overthinking",
          label: "ओवरथिंकिंग",
          statements: [
            "मैं किसी छोटी सी बात को भी दिमाग से निकाल नहीं पाता",
            "रात को सोने से पहले मेरा दिमाग पुरानी बातें दोहराता है",
            "एक छोटा सा फैसला लेने में भी मुझे घंटों लग जाते हैं",
            "मैं बार-बार सोचता हूं कि कहीं मैंने कुछ गलत तो नहीं कह दिया",
            "कोई भी काम शुरू करने से पहले मैं उसके सारे संभावित बुरे नतीजे सोच लेता हूं",
          ],
        },
        {
          key: "worry",
          label: "चिंता",
          statements: [
            "बिना किसी ठोस वजह के भी मुझे लगता है कुछ बुरा होने वाला है",
            "भविष्य के बारे में सोचते ही मेरा मन बेचैन हो जाता है",
            "किसी ज़रूरी काम से पहले पेट में हलचल या घबराहट होती है",
            "मैं छोटी बातों का भी सबसे बुरा नतीजा सोच लेता हूं",
            "अगर किसी का जवाब देर से आए, तो मैं सोचने लगता हूं कुछ गड़बड़ है",
          ],
        },
        {
          key: "stress",
          label: "तनाव",
          statements: [
            "मुझे लगता है मेरे पास काम इतना है कि समय कम पड़ जाता है",
            "छोटी-छोटी बातों पर भी मुझे चिड़चिड़ाहट या गुस्सा आ जाता है",
            "पूरी नींद लेने के बावजूद मैं थका हुआ महसूस करता हूं",
            "फ़ोन या सोशल मीडिया देखते हुए भी मेरा दिमाग शांत नहीं होता",
            "मुझे लगता है मैं एक साथ बहुत सारी चीज़ें संभाल रहा हूं",
          ],
        },
      ],
      bands: {
        low: {
          label: "कम",
          shortLine: "अभी इसका असर कम है।",
          title: "अभी इसका असर कम है।",
          desc: "आपके जवाब बताते हैं कि यह अभी आपकी रोज़मर्रा की ज़िंदगी पर ज़्यादा असर नहीं डाल रहा। फिर भी, एक हल्का, संरचित दैनिक अभ्यास इसे ऐसे ही बनाए रखने में मदद कर सकता है।",
        },
        moderate: {
          label: "मध्यम",
          shortLine: "थोड़ा ध्यान देने लायक है।",
          title: "थोड़ा ध्यान देने लायक है।",
          desc: "आपके जवाब बताते हैं कि यह अक्सर सामने आता है, इतना कि ध्यान देने लायक है। संरचित दैनिक अभ्यास इसके प्रति जागरूकता बनाने में मदद कर सकता है — कोई इलाज नहीं, बस एक स्थिर शुरुआती बिंदु।",
        },
        high: {
          label: "अधिक",
          shortLine: "ये आपकी रोज़मर्रा की ज़िंदगी को प्रभावित कर सकता है।",
          title: "ये आपकी रोज़मर्रा की ज़िंदगी को प्रभावित कर सकता है।",
          desc: "आपके जवाब बताते हैं कि यह अक्सर सामने आता है, और शायद आपकी रोज़मर्रा की ज़िंदगी में भी दिखता है। इस पर ईमानदारी से ध्यान देना ज़रूरी है — संरचित दैनिक अभ्यास जागरूकता और एक स्थिर रूटीन बनाने में मदद कर सकता है, हालांकि अगर आपको ज़रूरत महसूस हो तो यह किसी पेशेवर मदद का विकल्प नहीं है।",
        },
      },
      teaser: {
        title: "आपका परिणाम",
        overallScoreLabel: "आपका Overthinking Score",
      },
      fullReport: {
        title: "आपकी पूरी रिपोर्ट",
        overallLabel: "ओवरऑल",
        courseTitle: "आगे क्या करें, समझ नहीं आ रहा?",
        courseDesc: "द 21-डे माइंड रीसेट सिस्टम एक संरचित, दैनिक हिंदी प्रोग्राम है जो ठीक इसी तरह की जागरूकता बनाने के लिए बनाया गया है।",
        courseCta: "द 21-डे माइंड रीसेट सिस्टम एक्सप्लोर करें",
      },
      disclaimer: "यह एक self-awareness tool है, कोई clinical diagnosis नहीं।",
      restartLabel: "टेस्ट दोबारा लें",
    },
  },
};

// Deliberately no `as const` on the object above — that would infer each
// language's own literal string values (e.g. "Speed Reading" vs
// "स्पीड रीडिंग") as two structurally-incompatible types, since
// Translations is keyed off the English variant specifically. Every
// consumer only ever displays or iterates these values, never branches
// on their exact literal text, so widening to plain `string` throughout
// (the natural inference without `as const`) is correct here.
export type Translations = typeof translations['en'];
