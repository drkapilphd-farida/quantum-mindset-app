import { brand, programs, trainer } from "@/config/site.config";
export type Lang = "en" | "hi";

export const translations = {
  en: {
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
    hero: {
      eyebrow: "Dr. Kapil Dev Sharma — Mind Ur Mind",
      credentials: trainer.en.shortBio.split(" · "),
      headline: "Sharp Brain™ — Focus · Memory · Smart Reading",
      headlineEm: "Read Faster. Remember More. Study Smarter.",
      headlineNote: "Measured from your own Day 1 baseline.",
      sub: "Struggling to finish your syllabus? Reading for hours but remembering nothing? Your child studies for hours but forgets everything? This isn't a reading problem — it's a training problem. No hypnosis, no shortcuts — structured, measurable skills training.",
      ctaPrimary: "Watch the Free Training Now",
      ctaSecondary: "Take the Free Speed Test",
      portraitName: "Dr. Kapil Dev Sharma",
      portraitTitle: trainer.en.title,
      stats: [
        { value: "30-Day Streak", label: "Sharp Brain™" },
        { value: "11 Days, Monthly", label: programs.onlineRetreat.name },
        { value: "3–4× / Year", label: "Residential · Rishikesh & Lonavala" },
        { value: "1-on-1", label: programs.oneOnOneCoaching.name },
      ],
    },
    homePodcastFeature: {
      eyebrow: "Featured Podcast",
      title: "Dr. Kapil Dev Sharma on Solomon Daniel's Podcast",
      caption: "A long-form conversation with Dr. Kapil Dev Sharma about reading, focus and training the mind.",
      videoTitle: "Dr. Kapil Dev Sharma on Solomon Daniel's Podcast",
      playAriaLabel: "Play video: Dr. Kapil Dev Sharma on Solomon Daniel's Podcast",
      channelCredit: "Featured on Solomon Daniel's Podcast",
    },
    galleryPage: {
      eyebrow: "The Gallery",
      title: "Real Moments From Real Programs",
      desc: "Workshops, retreats, and live sessions — photos dropped in as each program happens.",
      filterAll: "All",
      filterWorkshops: "Workshops",
      filterRetreats: "Retreats",
      filterQsr: "Sharp Brain Sessions",
    },
    franchisePage: {
      hero: {
        eyebrow: "Franchise Opportunity",
        headline: "Are You a Trainer or Edupreneur?",
        sub: "Start your own Sharp Brain™ training business — with a ready platform, marketing kit, and certification.",
        ctaPrimary: "Apply to Become a Certified Trainer",
        ctaSecondary: "Watch Introduction",
        partnerNote: "The program you know as Quantum Speed Reading is now Sharp Brain™ — same core training, clearer name.",
        formatsLine: `Sharp Brain™ formats: Workshop · 30-Day Program · Self-Learning · practice in the ${brand.appName} · for Schools`,
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
            desc: "A structured 7-day trainer certification program that equips you to launch and run your own Sharp Brain™ training practice immediately — not just learn a skill.",
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
            title: "Sharp Brain™ Methodology",
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
      },
      studentTestimonials: {
        eyebrow: "What Students Say",
        title: "What Students Say",
        desc: "Real experiences from learners who have experienced Sharp Brain™.",
        videoLabel: "Student Testimonial",
        oldLabel: "From earlier batches (the program was then called Quantum Speed Reading)",
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
          "The Sharp Brain™ methodology",
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
          { title: "Training", desc: "Learn the complete Sharp Brain™ methodology." },
          { title: "Certification", desc: "Complete the 7-day certification program." },
        ],
      },
      about: {
        eyebrow: "About",
        headline: "Who You're Partnering With",
        bio: trainer.en.longBio,
        credentials: trainer.en.shortBio.split(" · "),
        videoTitle: "Sharp Brain™ Introduction",
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
            answer: "Training and Sharp Brain™ certification, access to the training software under your own brand name and logo, a ready-to-use landing page, and marketing material to help you promote the program.",
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
            answer: "15–20% of each student enrollment goes to Mind Ur Mind — this scales with what you actually earn, not a fixed fee.",
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
        title: "Ready to Build Your Sharp Brain™ Training Practice?",
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
    whatsapp: {
      bubble: "Have questions about our programs? Chat directly with Dr. Kapil's team.",
      button: "Chat on WhatsApp",
      ariaLabel: "Chat with Dr. Kapil's team on WhatsApp",
    },
    contactPage: {
      headline: "Get in Touch",
      sub: "Questions about a program, a payment, or just not sure where to start? Reach us directly.",
      emailLabel: "Email",
      phoneLabel: "Phone",
      whatsappLabel: "WhatsApp",
      addressLabel: "Address",
      hoursLabel: "Working hours",
      responseTime: "We respond to all queries within 24 hours.",
      ctaPrimary: "Chat on WhatsApp",
      ctaSecondary: "Or email us at",
    },
    aboutPage: {
      headline: "About Mind Ur Mind",
      body: [
        "Mind Ur Mind was founded in 2014 by Dr. Kapil Dev Sharma, bringing together academic research and hands-on coaching into a single practice focused on how people read, think, and manage their own minds.",
        `What began as in-person workshops has grown into a full range of programs — Sharp Brain™ (focus, memory and smart reading), meditation retreats, one-on-one coaching, and the ${brand.appName} — while staying rooted in the same principle: real cognitive and personal change comes from structured, sustained practice, not quick fixes.`,
        "Mind Ur Mind is a proprietorship led by Dr. Kapil Dev Sharma, based in Vadodara, Gujarat, and works with students, professionals, and lifelong learners across India.",
      ],
      guide: {
        eyebrow: "The Founder",
        quote:
          "Most people already know what they need to change. The harder work is understanding why they haven't — and building the conditions where that becomes possible.",
      },
    },
    habitBuilderLanding: {
      hero: {
        eyebrow: "Free first step · before the Sharp Brain 30-Day Program",
        headline: programs.focusStarter.name,
        headlineEm: "Try the method for a week, free — then decide.",
        sub: `About 10 minutes a day of focus, memory and reading drills — the same foundations used in the ${programs.sharpBrain.name}. Days 1–7 are free. If it works for you, continue to Day 21 for a one-time ₹99, or move on to the full 30-day program.`,
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
            title: "Advanced Focus Flow & Intuition",
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
      nextStep: {
        title: "Ready for the full program?",
        desc: `The ${programs.sharpBrain.name} adds 7 live sessions with ${trainer.name} and a full 30-day curriculum.`,
        cta: "See the 30-day program",
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
        headline: "Deep Meditation, Guided Live",
        headlineEm: `The ${programs.onlineRetreat.name}`,
        sub: "Not another meditation app that leaves you exactly where you started. Eleven nights of live, guided practice in traditional Kriya Yoga, pranayama (breathwork) and deep meditation — for a calmer mind, steadier emotions and better sleep. Guided nightly by Dr. Kapil Dev Sharma, teaching this path since 2014.",
        ctaPrimary: "Secure Your Retreat Spot",
        ctaPrimaryMeta: "Secure Checkout via Razorpay",
        ctaSecondary: "See the 11-Day Curriculum",
        ctaTertiary: "Not ready to book? Watch real student stories first",
        trustLine: "For busy professionals, chronic overthinkers and sincere seekers who want a real, guided practice — not another app.",
        visualPlaceholderLabel: "Retreat Introduction — Coming Soon",
      },
      coreProblem: {
        eyebrow: "Why Meditation Apps Don't Work",
        title: "Your mind isn't broken. It's untrained — and undernourished.",
        desc: "You've tried the apps. The breathing exercises. The ten-minute guided sessions with rain sounds. The loop in your head is still there five minutes later.",
        painPoints: [
          "A ten-minute recording can help in the moment. This is eleven nights of sustained, live practice — real depth, not a loop you replay.",
          "You don't need another relaxation technique. You need a steady daily practice, taught properly, that you can keep after the retreat ends.",
          "Every app promises calm. Almost none explain what's actually happening inside you, or give you a real method to change it.",
        ],
        solution:
          "This retreat isn't built on modern wellness trends. It's rooted in Kriya Yoga — a traditional discipline of breath, awareness and meditation. Over 11 nights you learn pranayama, deep stillness and simple daily routines that help calm the mind and settle the body.",
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
        eyebrow: "What You Will Practise",
        title: "Six practices, one 11-day journey",
        desc: "Each night builds on the last, guided live by Dr. Kapil Dev Sharma — never a theory you read about, always a practice you feel.",
        items: [
          {
            title: "Kriya Yoga Foundations",
            desc: "The traditional sequence of breath, posture and awareness this retreat is built on, taught step by step.",
          },
          {
            title: "Pranayama & Breathwork",
            desc: "Breathing practices to slow a racing mind and settle the body before meditation.",
          },
          {
            title: "Samadhi Meditation",
            desc: "Quiet the mental loops that won't switch off, and rest in the stillness underneath them.",
          },
          {
            title: "Chakra Meditation",
            desc: "A traditional focused-awareness practice that moves attention through the body's centres, for calm and grounding.",
          },
          {
            title: "Emotional Steadiness",
            desc: "Practices for noticing and settling strong emotions, so pressure knocks you off balance less often.",
          },
          {
            title: "Sleep & Stillness",
            desc: "Wind-down practices that help many participants sleep better and wake calmer.",
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
            desc: "Personally guiding students through this exact path since 2014 — not a recently-launched program chasing a trend.",
          },
          {
            title: "70+ Video Reviews on YouTube",
            desc: "Video reviews from real participants, not stock footage or paid actors.",
          },
          {
            title: "Small Cohort, Every Batch",
            desc: "Every batch is kept deliberately small so Dr. Kapil Dev Sharma can actually guide you, not lecture at a crowd.",
          },
          {
            title: "Personally Led, Every Night",
            desc: "Not pre-recorded, not delegated to an assistant instructor — Dr. Kapil Dev Sharma, live, all 11 nights.",
          },
        ],
      },
      liveStructure: {
        eyebrow: "How The 11 Nights Work",
        title: "Live guidance, not a pre-recorded course",
        desc: "Every one of the 11 nights, 7:30 PM to 10:30 PM, you're live with Dr. Kapil Dev Sharma — not a video library you work through whenever it's convenient.",
        points: [
          {
            title: "Nightly Live Session",
            desc: "A live guided session with Dr. Kapil Dev Sharma every night of the retreat, 7:30 PM – 10:30 PM — real-time, not pre-recorded.",
          },
          {
            title: "Interactive Practice",
            desc: "Structured practice time for that day's discipline, with direct feedback instead of a checklist to self-grade.",
          },
          {
            title: "Direct Mentorship",
            desc: "Questions answered directly by Dr. Kapil Dev Sharma during the retreat, not routed through a support ticket.",
          },
        ],
      },
      outcomes: {
        eyebrow: "After The 11 Nights",
        title: "What changes when the retreat ends",
        items: [
          "A way to quieten the mental loops when they start",
          "Steadier emotions under pressure",
          "Better sleep and calmer mornings, for many participants",
          "A daily meditation routine you can keep after Day 11",
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
        title: "70+ video reviews on YouTube, from real retreats since 2014",
        desc: "Six real students, filmed after finishing the retreat — unscripted. Tap any video to watch.",
        ctaLabel: "More Video Reviews",
      },
      faq: {
        eyebrow: "Before You Enroll",
        title: "Questions people ask before Day 1",
        items: [
          {
            question: "Do I need any prior experience with meditation?",
            answer:
              "No particular belief system or prior experience is required. Kriya Yoga builds up gradually across the 11 nights — you bring your own openness, Dr. Kapil Dev Sharma guides the method, step by step.",
          },
          {
            question: "Is deep meditation safe? What if strong emotions come up?",
            answer:
              "Every technique is taught step by step, live, with Dr. Kapil Dev Sharma guiding the pace each night. That said, these are intensive practices — for a small number of people, deep meditative work can surface strong emotional experiences. We ask participants to share any relevant mental health history before the retreat, so pacing can be adjusted accordingly. This retreat is a personal and spiritual practice, not a substitute for licensed therapy or psychiatric care — if you're currently in treatment for a mental health condition, please consult your provider before joining.",
          },
          {
            question: "What is Kriya Yoga, exactly?",
            answer:
              "Kriya Yoga is a traditional, centuries-old discipline of breathwork (pranayama), awareness and meditation techniques — practised, not just read about. It's the foundation this entire 11-day retreat is built on.",
          },
          {
            question: "What's the daily time commitment?",
            answer:
              "Each day includes a live session with Dr. Kapil Dev Sharma from 7:30 PM to 10:30 PM, plus guided practice — the same window every day of the 11-day batch.",
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
        title: "A Calmer Mind Starts With One Decision",
        desc: "Enrollment is confirmed personally by Dr. Kapil's own team — not an automated system. Since 2014, 150+ real students, one small cohort at a time. Book your spot in the next batch.",
        cta: "Secure Your Retreat Spot",
      },
      stickyBar: {
        text: programs.onlineRetreat.name,
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
        eyebrow: "Residential Meditation Retreats · Since 2014 · Small Cohorts",
        headline: "Step Away. Fully.",
        headlineEm: programs.residentialRetreat.name,
        sub: "You've meditated in bed, in traffic, with an app telling you to just breathe. It didn't work — not because you failed at it, but because a 10-minute recording was never built for real depth. This is Dr. Kapil Dev Sharma, in the room with you, for days — traditional Kriya Yoga, pranayama and deep meditation, guided directly, since 2014.",
        ctaPrimary: "Secure Your Residential Seat",
        ctaPrimaryMeta: "Personally confirmed by Dr. Kapil's team",
        ctaSecondary: "See the 2026–27 Roadmap",
        trustLine: "For busy professionals, chronic overthinkers and sincere seekers — ready to step away properly, not just log off.",
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
          "Deep meditation and breathwork are safest with a teacher physically present to see exactly where you are, not guessing from a video call.",
        ],
        solution:
          "This is why the residential format exists. Traditional Kriya Yoga, pranayama and meditation, in a room with no notifications, no inbox, and a teacher who can actually see you — days of practice that leave you calmer, steadier and better rested.",
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
            title: "In-Person Guidance",
            desc: "There's a real difference between a recording of a teacher and sitting in the same room as one — your posture, breath and pace corrected as you practise.",
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
        desc: "Each residential retreat unfolds as a deliberate arc — grounding first, then breathwork and Kriya Yoga, then deep stillness, then integration — so the change has time to settle.",
        items: [
          {
            title: "Grounding & Arrival",
            desc: "Breath realignment and nervous system down-regulation — arriving fully before the deeper work begins.",
          },
          {
            title: "Kriya Yoga & Pranayama",
            desc: "The core technique, taught in structured, safe progression, corrected in person.",
          },
          {
            title: "Chakra Meditation & Breathwork",
            desc: "Direct, guided practice — not theory read off a slide.",
          },
          {
            title: "Deep Stillness & Samadhi Practice",
            desc: "Longer silent sittings that everything else in the retreat has been building toward.",
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
            title: "70+ Video Reviews on YouTube",
            desc: "Video reviews from real participants, not stock footage or paid actors.",
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
        title: "70+ video reviews on YouTube, from over a decade of real retreats",
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
          "You're a sincere seeker — ready for real practice, not more content to consume",
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
            answer: "Yes. No prior experience with Kriya Yoga or meditation is required. Every practice is taught from the ground up, in safe, structured progression.",
          },
          {
            question: "Is deep meditation safe? What if strong emotions come up?",
            answer:
              "Every technique is taught step by step, under direct in-person supervision. That said, these are intensive practices — for a small number of people, deep meditative work can surface strong emotional experiences. We ask participants to share any relevant mental health history before the retreat, so Dr. Kapil Dev Sharma can adjust pacing accordingly. This retreat is a personal and spiritual practice, not a substitute for licensed therapy or psychiatric care — if you're currently in treatment for a mental health condition, please consult your provider before joining.",
          },
          {
            question: "How is this different from your 11-Day Online Retreat?",
            answer: "The online retreat is a live, guided journey you join from home. The Residential Retreat requires you to physically travel and stay on-site — full disconnect, in-person guidance, and a small in-person cohort the online format can't replicate.",
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
        text: programs.residentialRetreat.name,
        price: "From ₹35,000 per person",
        cta: "Secure Your Seat",
      },
      whatsapp: {
        bubble: "Have questions about a Residential Retreat? Chat with Dr. Kapil's team instantly.",
        button: "Chat on WhatsApp",
        ariaLabel: `Chat with Dr. Kapil's team on WhatsApp about the ${programs.residentialRetreat.name}`,
      },
    },
    mentoringLanding: {
      hero: {
        eyebrowBadges: ["Private", "Structured", "Limited Availability"],
        headline: `Focused work, on your situation, with someone who's done this for ${trainer.years.total} years.`,
        sub: "One-on-one mentoring for overthinking, focus, and personal growth — shaped around what you're actually dealing with, not a fixed curriculum.",
        guideLabel: "Your Guide",
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
          {
            duration: "21 Days",
            tag: "In-Depth",
            desc: "Three weeks for deeper or longer-standing patterns, with time to build and test new habits between sessions.",
          },
        ],
        feeNote: "Fee depends on the package you choose — number of days and session timing. Apply and we'll share your personalised plan and fee.",
      },
      guide: {
        eyebrow: "The Guide",
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
              `Group programs (like the ${programs.sharpBrain.name} or the ${programs.onlineRetreat.name}) run on a fixed schedule with standardised content for everyone in the batch. This is private, one-on-one, and shaped entirely around your own situation — the pace, focus areas, and format adjust to you, not the other way around.`,
          },
          {
            question: "What if I'm not sure what I need help with?",
            answer:
              "That's exactly what the short conversation step is for. You don't need a clear diagnosis before applying — just a sense of what's not working. Dr. Kapil Dev Sharma helps identify the actual focus area during that first exchange, before any plan is proposed.",
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
        bubble: `Have questions about ${programs.oneOnOneCoaching.name}? Chat with Dr. Kapil's team instantly.`,
        button: "Chat on WhatsApp",
        ariaLabel: `Chat with Dr. Kapil's team about ${programs.oneOnOneCoaching.name} on WhatsApp`,
      },
      stickyBar: {
        text: programs.oneOnOneCoaching.name,
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
        productName: programs.overthinkingReset.name,
        headline: "Stop Getting Lost in Your Thoughts. Start Understanding Your Mind.",
        tagline: "Understand Your Mind • Build Mental Clarity",
        sub: "21 days of daily training, meditation, and guided activity. Live sessions with Dr. Kapil included with 6-month access.",
        ctaPrimary: "Start Your Overthinking Reset — ₹499",
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
        quote:
          "Most people already know what they need to change. The harder work is understanding why they haven't — and building the conditions where that becomes possible.",
      },
      pricing: {
        eyebrow: "Pricing",
        title: "Start Your Overthinking Reset Today",
        classplusNote: "Choose your plan (₹499 or ₹999) on the checkout page.",
        card1: {
          name: "Overthinking Reset — 1 Month",
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
          name: "Overthinking Reset — 6 Months",
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
            question: `What is the ${programs.overthinkingReset.name}?`,
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
        ],
      },
      finalCta: {
        eyebrow: "Ready When You Are",
        headline: "Your Mind Deserves Your Attention.",
        desc: "Start with one small step. Learn, reflect, practise, and build a better relationship with your thoughts.",
        ctaPrimary: "Start Your Overthinking Reset — ₹499",
        ctaSecondary: "Take the Free Overthinking Test",
      },
      whatsapp: {
        bubble: `Have questions about the ${programs.overthinkingReset.name}? Chat with Dr. Kapil's team instantly.`,
        button: "Chat on WhatsApp",
        ariaLabel: `Chat with Dr. Kapil's team about the ${programs.overthinkingReset.name} on WhatsApp`,
      },
      stickyBar: {
        text: programs.overthinkingReset.name,
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
        courseDesc: `The ${programs.overthinkingReset.name} is a structured, daily Hindi program to build exactly this kind of awareness.`,
        courseCta: `Explore the ${programs.overthinkingReset.name}`,
      },
      disclaimer: "This is a self-awareness tool, not a clinical diagnosis.",
      restartLabel: "Retake the Test",
    },
  },

  hi: {
    checkoutTrust: {
      line: "भुगतान Razorpay द्वारा सुरक्षित। 100% सुरक्षित और एन्क्रिप्टेड — हम कभी आपके कार्ड की जानकारी संग्रहीत नहीं करते।",
      refundLabel: "रिफंड और कैंसिलेशन नीति",
    },
    wellnessDisclaimer: {
      line: "यह एक आध्यात्मिक और व्यक्तिगत-विकास अभ्यास है, लाइसेंस-प्राप्त चिकित्सा या मानसिक स्वास्थ्य उपचार का विकल्प नहीं। यदि आप संकट में हैं, तो कृपया किसी लाइसेंस-प्राप्त पेशेवर या स्थानीय आपातकालीन सेवाओं से संपर्क करें।",
    },
    hero: {
      eyebrow: "डॉ. कपिल देव शर्मा — माइंड उर माइंड",
      credentials: trainer.hi.shortBio.split(" · "),
      headline: "Sharp Brain™ — Focus · Memory · Smart Reading",
      headlineEm: "तेज़ पढ़ें। ज़्यादा याद रखें। स्मार्ट तरीके से पढ़ाई करें।",
      headlineNote: "आपके अपने दिन 1 के बेसलाइन से मापा गया।",
      sub: "सिलेबस पूरा करने में दिक्कत हो रही है? घंटों पढ़ते हैं पर कुछ याद नहीं रहता? आपका बच्चा घंटों पढ़ता है पर सब भूल जाता है? यह पढ़ाई की समस्या नहीं है — यह ट्रेनिंग की समस्या है। कोई सम्मोहन नहीं, कोई शॉर्टकट नहीं — संरचित, मापने योग्य स्किल ट्रेनिंग।",
      ctaPrimary: "अभी फ्री ट्रेनिंग देखें",
      ctaSecondary: "फ्री स्पीड टेस्ट लें",
      portraitName: "डॉ. कपिल देव शर्मा",
      portraitTitle: trainer.hi.title,
      stats: [
        { value: "30-दिन की स्ट्रीक", label: "Sharp Brain™" },
        { value: "11 दिन, मासिक", label: programs.onlineRetreat.nameHi },
        { value: "वर्ष में 3–4 बार", label: "रेजिडेंशियल · ऋषिकेश और लोनावला" },
        { value: "1-ऑन-1", label: programs.oneOnOneCoaching.nameHi },
      ],
    },
    homePodcastFeature: {
      eyebrow: "फीचर्ड पॉडकास्ट",
      title: "डॉ. कपिल देव शर्मा — Solomon Daniel के पॉडकास्ट पर",
      caption: "डॉ. कपिल देव शर्मा बताते हैं कि जब आप अपने दिमाग की असली क्षमता को अनलॉक करते हैं, तो वाकई क्या मुमकिन है।",
      videoTitle: "Solomon Daniel के पॉडकास्ट पर डॉ. कपिल देव शर्मा",
      playAriaLabel: "वीडियो चलाएं: डॉ. कपिल देव शर्मा — Solomon Daniel के पॉडकास्ट पर",
      channelCredit: "Solomon Daniel के पॉडकास्ट पर फीचर्ड",
    },
    galleryPage: {
      eyebrow: "गैलरी",
      title: "असली प्रोग्राम्स के असली पल",
      desc: "वर्कशॉप्स, रिट्रीट्स, और लाइव सेशंस — हर प्रोग्राम के होने पर फ़ोटो जोड़ी जाती हैं।",
      filterAll: "सभी",
      filterWorkshops: "वर्कशॉप्स",
      filterRetreats: "रिट्रीट्स",
      filterQsr: "Sharp Brain सेशंस",
    },
    franchisePage: {
      hero: {
        eyebrow: "फ्रेंचाइज़ी अवसर",
        headline: "क्या आप Trainer या Edupreneur हैं?",
        sub: "अपना खुद का Sharp Brain™ Training Business शुरू करें — ready platform, marketing kit, और certification के साथ।",
        ctaPrimary: "Certified Trainer बनने के लिए आवेदन करें",
        ctaSecondary: "परिचय वीडियो देखें",
        partnerNote: "जिस प्रोग्राम को आप Quantum Speed Reading के नाम से जानते हैं, वह अब Sharp Brain™ है — वही मूल प्रशिक्षण, साफ़ नाम।",
        formatsLine: `Sharp Brain™ फॉर्मेट: वर्कशॉप · 30-दिवसीय प्रोग्राम · सेल्फ-लर्निंग · ${brand.appName} में अभ्यास · स्कूलों के लिए`,
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
            desc: "एक structured 7-दिन का trainer certification प्रोग्राम, जो आपको सिर्फ एक स्किल सिखाने के बजाय अपनी खुद की Sharp Brain™ training practice तुरंत शुरू करने और चलाने के लिए तैयार करता है।",
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
            title: "Sharp Brain™ मेथडोलॉजी",
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
      },
      studentTestimonials: {
        eyebrow: "विद्यार्थी क्या कहते हैं",
        title: "विद्यार्थी क्या कहते हैं",
        desc: "Sharp Brain™ का अनुभव करने वाले विद्यार्थियों के असली अनुभव।",
        videoLabel: "विद्यार्थी की प्रतिक्रिया",
        oldLabel: "पहले के बैच से (तब इस प्रोग्राम का नाम Quantum Speed Reading था)",
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
          "Sharp Brain™ मेथडोलॉजी",
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
          { title: "ट्रेनिंग", desc: "पूरी Sharp Brain™ मेथडोलॉजी सीखें।" },
          { title: "सर्टिफिकेशन", desc: "7-दिन का सर्टिफिकेशन प्रोग्राम पूरा करें।" },
        ],
      },
      about: {
        eyebrow: "परिचय",
        headline: "आप किनके साथ पार्टनर बन रहे हैं",
        bio: trainer.hi.longBio,
        credentials: trainer.hi.shortBio.split(" · "),
        videoTitle: "Sharp Brain™ परिचय",
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
            answer: "ट्रेनिंग और Sharp Brain™ सर्टिफिकेशन, आपके अपने ब्रांड नाम और लोगो के तहत ट्रेनिंग सॉफ्टवेयर का एक्सेस, एक तैयार लैंडिंग पेज, और प्रोग्राम प्रमोट करने में मदद करने वाली मार्केटिंग सामग्री।",
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
        title: "अपनी Sharp Brain™ Training Practice बनाने के लिए तैयार हैं?",
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
    whatsapp: {
      bubble: "हमारे प्रोग्राम्स के बारे में सवाल हैं? डॉ. कपिल की टीम से सीधे बात करें।",
      button: "WhatsApp पर चैट करें",
      ariaLabel: "डॉ. कपिल की टीम से WhatsApp पर चैट करें",
    },
    contactPage: {
      headline: "संपर्क करें",
      sub: "किसी प्रोग्राम, पेमेंट के बारे में सवाल हैं, या समझ नहीं आ रहा कहां से शुरू करें? सीधे हमसे संपर्क करें।",
      emailLabel: "ईमेल",
      phoneLabel: "फ़ोन",
      whatsappLabel: "WhatsApp",
      addressLabel: "पता",
      hoursLabel: "कार्य समय",
      responseTime: "हम सभी प्रश्नों का उत्तर 24 घंटों के भीतर देते हैं।",
      ctaPrimary: "WhatsApp पर चैट करें",
      ctaSecondary: "या हमें ईमेल करें",
    },
    aboutPage: {
      headline: "माइंड उर माइंड के बारे में",
      body: [
        "माइंड उर माइंड की स्थापना 2014 में डॉ. कपिल देव शर्मा ने की थी, जिन्होंने शैक्षणिक शोध और प्रत्यक्ष कोचिंग को एक ही प्रैक्टिस में जोड़ा — इस पर केंद्रित कि लोग कैसे पढ़ते हैं, सोचते हैं, और अपने मन को कैसे संभालते हैं।",
        `जो व्यक्तिगत वर्कशॉप्स के रूप में शुरू हुआ, वह अब प्रोग्राम्स की एक पूरी रेंज बन चुका है — Sharp Brain™ (फोकस, मेमोरी और स्मार्ट रीडिंग), मेडिटेशन रिट्रीट्स, वन-ऑन-वन कोचिंग, और ${brand.appName} — फिर भी एक ही सिद्धांत में जड़ें जमाए हुए: असली संज्ञानात्मक और व्यक्तिगत बदलाव संरचित, निरंतर अभ्यास से आता है, त्वरित उपायों से नहीं।`,
        "माइंड उर माइंड डॉ. कपिल देव शर्मा के नेतृत्व में एक प्रोप्राइटरशिप है, जो वडोदरा, गुजरात में स्थित है, और पूरे भारत में विद्यार्थियों, पेशेवरों, और आजीवन सीखने वालों के साथ काम करती है।",
      ],
      guide: {
        eyebrow: "संस्थापक",
        quote:
          "ज़्यादातर लोग पहले से जानते हैं कि उन्हें क्या बदलना है। मुश्किल काम यह समझना है कि उन्होंने अब तक ऐसा क्यों नहीं किया — और वे स्थितियां बनाना जिनमें यह संभव हो सके।",
      },
    },
    habitBuilderLanding: {
      hero: {
        eyebrow: "पहला मुफ़्त कदम · Sharp Brain 30-दिवसीय प्रोग्राम से पहले",
        headline: programs.focusStarter.nameHi,
        headlineEm: "एक हफ़्ते तक तरीका मुफ़्त आज़माएं — फिर फ़ैसला करें।",
        sub: `रोज़ लगभग 10 मिनट के फोकस, मेमोरी और रीडिंग अभ्यास — वही बुनियाद जो ${programs.sharpBrain.nameHi} में इस्तेमाल होती है। दिन 1–7 मुफ़्त हैं। अगर यह आपके लिए काम करे, तो ₹99 के एकमुश्त भुगतान से दिन 21 तक जारी रखें, या पूरे 30-दिवसीय प्रोग्राम पर जाएं।`,
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
            title: "एडवांस्ड फोकस फ्लो एंड इंट्यूशन",
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
      nextStep: {
        title: "पूरे प्रोग्राम के लिए तैयार?",
        desc: `${programs.sharpBrain.nameHi} में ${trainer.nameHi} के साथ 7 लाइव सेशन और पूरा 30-दिवसीय पाठ्यक्रम शामिल है।`,
        cta: "30-दिवसीय प्रोग्राम देखें",
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
        headline: "गहरा ध्यान, लाइव मार्गदर्शन में",
        headlineEm: programs.onlineRetreat.nameHi,
        sub: "कोई और मेडिटेशन ऐप नहीं, जो आपको वहीं छोड़ दे जहां से आपने शुरुआत की थी। पारंपरिक क्रिया योग, प्राणायाम (श्वास-अभ्यास) और गहरे ध्यान की 11 रातों की लाइव, मार्गदर्शित साधना — शांत मन, स्थिर भावनाओं और बेहतर नींद के लिए। प्रतिरात डॉ. कपिल देव शर्मा द्वारा मार्गदर्शित, जो 2014 से यह मार्ग सिखा रहे हैं।",
        ctaPrimary: "अपनी रिट्रीट सीट सुरक्षित करें",
        ctaPrimaryMeta: "Razorpay के ज़रिए सुरक्षित चेकआउट",
        ctaSecondary: "11-दिवसीय पाठ्यक्रम देखें",
        ctaTertiary: "बुक करने के लिए तैयार नहीं हैं? पहले असली विद्यार्थियों की कहानियां देखें",
        trustLine: "व्यस्त पेशेवरों, लगातार ओवरथिंक करने वालों और सच्चे साधकों के लिए, जो एक असली, मार्गदर्शित अभ्यास चाहते हैं — कोई और ऐप नहीं।",
        visualPlaceholderLabel: "रिट्रीट परिचय — जल्द आ रहा है",
      },
      coreProblem: {
        eyebrow: "मेडिटेशन ऐप्स क्यों काम नहीं करते",
        title: "आपका मन टूटा हुआ नहीं है। यह अप्रशिक्षित है — और अपोषित है।",
        desc: "आपने ऐप्स आज़माए हैं। सांस लेने के अभ्यास। बारिश की आवाज़ों वाले दस-मिनट के गाइडेड सेशन। पांच मिनट बाद भी आपके दिमाग़ का वह चक्र वहीं है।",
        painPoints: [
          "दस मिनट की रिकॉर्डिंग उस पल में मदद कर सकती है। यह ग्यारह रातों का निरंतर, लाइव अभ्यास है — असली गहराई, कोई दोहराई जाने वाली लूप नहीं।",
          "आपको एक और रिलैक्सेशन तकनीक की ज़रूरत नहीं है। आपको एक नियमित दैनिक अभ्यास चाहिए, सही तरीके से सिखाया गया, जिसे आप रिट्रीट के बाद भी जारी रख सकें।",
          "हर ऐप शांति का वादा करता है। लगभग कोई नहीं बताता कि आपके भीतर वास्तव में क्या हो रहा है, या इसे बदलने का कोई असली तरीका देता है।",
        ],
        solution:
          "यह रिट्रीट आधुनिक वेलनेस ट्रेंड्स पर आधारित नहीं है। यह क्रिया योग में निहित है — श्वास, जागरूकता और ध्यान की एक पारंपरिक विधि। 11 रातों में आप प्राणायाम, गहरी स्थिरता और सरल दैनिक दिनचर्या सीखते हैं, जो मन को शांत और शरीर को स्थिर करने में मदद करती हैं।",
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
        eyebrow: "आप क्या अभ्यास करेंगे",
        title: "छह अभ्यास, एक 11-दिवसीय यात्रा",
        desc: "हर रात पिछली रात पर आधारित होती है, डॉ. कपिल देव शर्मा द्वारा लाइव मार्गदर्शित — कभी कोई सिद्धांत नहीं जिसे आप सिर्फ पढ़ें, हमेशा एक अभ्यास जिसे आप महसूस करें।",
        items: [
          {
            title: "क्रिया योग की बुनियाद",
            desc: "श्वास, आसन और जागरूकता का वह पारंपरिक क्रम जिस पर यह रिट्रीट आधारित है, कदम-दर-कदम सिखाया गया।",
          },
          {
            title: "प्राणायाम और श्वास-अभ्यास",
            desc: "ध्यान से पहले तेज़ दौड़ते मन को धीमा करने और शरीर को स्थिर करने वाले श्वास-अभ्यास।",
          },
          {
            title: "समाधि ध्यान",
            desc: "उन मानसिक चक्रों को शांत करें जो रुकते ही नहीं, और उनके नीचे की स्थिरता में विश्राम करें।",
          },
          {
            title: "चक्र ध्यान",
            desc: "एक पारंपरिक केंद्रित-जागरूकता अभ्यास, जो ध्यान को शरीर के केंद्रों से होकर ले जाता है — शांति और स्थिरता के लिए।",
          },
          {
            title: "भावनात्मक स्थिरता",
            desc: "तीव्र भावनाओं को पहचानने और शांत करने के अभ्यास, ताकि दबाव आपको कम बार असंतुलित करे।",
          },
          {
            title: "नींद और स्थिरता",
            desc: "सोने से पहले के अभ्यास, जो कई प्रतिभागियों को बेहतर नींद और शांत सुबह में मदद करते हैं।",
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
            desc: "इसी मार्ग पर 2014 से विद्यार्थियों का व्यक्तिगत रूप से मार्गदर्शन — कोई हाल ही में शुरू हुआ ट्रेंड-आधारित कार्यक्रम नहीं।",
          },
          {
            title: "YouTube पर 70+ वीडियो रिव्यूज़",
            desc: "असली प्रतिभागियों के वीडियो रिव्यूज़ — कोई स्टॉक फुटेज या पेड एक्टर नहीं।",
          },
          {
            title: "हर बैच में छोटा समूह",
            desc: "हर बैच जानबूझकर छोटा रखा जाता है ताकि डॉ. कपिल देव शर्मा वास्तव में आपका मार्गदर्शन कर सकें, किसी भीड़ को भाषण न दे रहे हों।",
          },
          {
            title: "हर रात व्यक्तिगत रूप से मार्गदर्शित",
            desc: "कोई पहले से रिकॉर्ड नहीं, किसी सहायक प्रशिक्षक को नहीं सौंपा गया — डॉ. कपिल देव शर्मा, लाइव, सभी 11 रातें।",
          },
        ],
      },
      liveStructure: {
        eyebrow: "11 रातें कैसे काम करती हैं",
        title: "लाइव मार्गदर्शन, कोई पहले से रिकॉर्डेड कोर्स नहीं",
        desc: "11 में से हर रात, शाम 7:30 से रात 10:30 तक, आप डॉ. कपिल देव शर्मा के साथ लाइव होते हैं — कोई वीडियो लाइब्रेरी नहीं जिसे आप जब सुविधाजनक हो तब पूरा करें।",
        points: [
          {
            title: "प्रतिरात लाइव सत्र",
            desc: "रिट्रीट की हर रात डॉ. कपिल देव शर्मा के साथ एक लाइव मार्गदर्शित सत्र, शाम 7:30 – रात 10:30 — रीयल-टाइम में, पहले से रिकॉर्ड नहीं।",
          },
          {
            title: "इंटरैक्टिव अभ्यास",
            desc: "उस दिन के अनुशासन के लिए संरचित अभ्यास समय, खुद जांचने वाली चेकलिस्ट की बजाय सीधी प्रतिक्रिया के साथ।",
          },
          {
            title: "सीधा मार्गदर्शन",
            desc: "रिट्रीट के दौरान सवालों के जवाब सीधे डॉ. कपिल देव शर्मा देते हैं, किसी सपोर्ट टिकट के ज़रिए नहीं।",
          },
        ],
      },
      outcomes: {
        eyebrow: "11 रातों के बाद",
        title: "रिट्रीट खत्म होने पर क्या बदलता है",
        items: [
          "जब मानसिक चक्र शुरू हों, तो उन्हें शांत करने का एक तरीका",
          "दबाव में ज़्यादा स्थिर भावनाएं",
          "कई प्रतिभागियों के लिए बेहतर नींद और शांत सुबह",
          "एक दैनिक ध्यान दिनचर्या जिसे आप दिन 11 के बाद भी जारी रख सकें",
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
        title: "2014 से असली रिट्रीट्स के YouTube पर 70+ वीडियो रिव्यूज़",
        desc: "छह असली विद्यार्थी, रिट्रीट पूरा करने के बाद फिल्माए गए — बिना किसी स्क्रिप्ट के। देखने के लिए किसी भी वीडियो पर टैप करें।",
        ctaLabel: "और वीडियो समीक्षाएं",
      },
      faq: {
        eyebrow: "नामांकन से पहले",
        title: "दिन 1 से पहले लोग जो सवाल पूछते हैं",
        items: [
          {
            question: "क्या मुझे ध्यान का कोई पूर्व अनुभव चाहिए?",
            answer:
              "किसी विशेष विश्वास प्रणाली या पूर्व अनुभव की ज़रूरत नहीं है। क्रिया योग 11 रातों में धीरे-धीरे आगे बढ़ता है — आप अपना खुलापन लाएं, डॉ. कपिल देव शर्मा हर कदम पर विधि बताएंगे।",
          },
          {
            question: "क्या गहरा ध्यान सुरक्षित है? अगर तीव्र भावनाएं उभरें तो?",
            answer:
              "हर तकनीक चरण-दर-चरण, लाइव सिखाई जाती है, और हर रात डॉ. कपिल देव शर्मा गति का मार्गदर्शन करते हैं। फिर भी, ये गहन अभ्यास हैं — कुछ लोगों के लिए, गहरा ध्यान तीव्र भावनात्मक अनुभव सामने ला सकता है। हम प्रतिभागियों से रिट्रीट से पहले किसी भी प्रासंगिक मानसिक स्वास्थ्य इतिहास को साझा करने का अनुरोध करते हैं, ताकि गति उसके अनुसार समायोजित की जा सके। यह रिट्रीट एक व्यक्तिगत और आध्यात्मिक अभ्यास है, लाइसेंस-प्राप्त थेरेपी या मनोरोग उपचार का विकल्प नहीं — यदि आप वर्तमान में किसी मानसिक स्वास्थ्य स्थिति के लिए उपचार ले रहे हैं, तो कृपया शामिल होने से पहले अपने चिकित्सक से सलाह लें।",
          },
          {
            question: "क्रिया योग वास्तव में क्या है?",
            answer:
              "क्रिया योग श्वास-अभ्यास (प्राणायाम), जागरूकता और ध्यान तकनीकों की एक पारंपरिक, सदियों पुरानी विधि है — जिसका अभ्यास किया जाता है, सिर्फ पढ़ा नहीं जाता। यही पूरे 11-दिवसीय रिट्रीट की नींव है।",
          },
          {
            question: "प्रतिदिन कितना समय देना होगा?",
            answer:
              "हर दिन में डॉ. कपिल देव शर्मा के साथ शाम 7:30 से रात 10:30 तक एक लाइव सत्र और मार्गदर्शित अभ्यास शामिल है — 11-दिवसीय बैच के हर दिन यही समय।",
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
        title: "शांत मन एक फैसले से शुरू होता है",
        desc: "नामांकन की पुष्टि डॉ. कपिल की अपनी टीम व्यक्तिगत रूप से करती है — कोई ऑटोमेटेड सिस्टम नहीं। 2014 से, 150+ असली विद्यार्थी, एक समय में एक छोटा समूह। अगले बैच में अपनी सीट बुक करें।",
        cta: "अपनी रिट्रीट सीट सुरक्षित करें",
      },
      stickyBar: {
        text: programs.onlineRetreat.nameHi,
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
        eyebrow: "रेजिडेंशियल मेडिटेशन रिट्रीट्स · 2014 से · छोटे समूह",
        headline: "पूरी तरह दूर हट जाएं।",
        headlineEm: programs.residentialRetreat.nameHi,
        sub: "आपने बिस्तर पर मेडिटेशन किया, ट्रैफिक में किया, एक ऐप के साथ किया जो कहता रहा बस सांस लें। यह काम नहीं आया — इसलिए नहीं कि आप असफल हुए, बल्कि इसलिए कि एक 10-मिनट की रिकॉर्डिंग असली गहराई के लिए बनी ही नहीं थी। यह डॉ. कपिल देव शर्मा हैं, आपके साथ उसी कमरे में, कई दिनों तक — पारंपरिक क्रिया योग, प्राणायाम और गहरा ध्यान, सीधे मार्गदर्शन में, 2014 से।",
        ctaPrimary: "अपनी रेजिडेंशियल सीट सुरक्षित करें",
        ctaPrimaryMeta: "डॉ. कपिल की टीम द्वारा व्यक्तिगत रूप से पुष्टि",
        ctaSecondary: "2026–27 का शेड्यूल देखें",
        trustLine: "व्यस्त पेशेवरों, लगातार ओवरथिंक करने वालों और सच्चे साधकों के लिए — जो सिर्फ लॉग ऑफ नहीं, सही मायने में कुछ दिन दूर जाने के लिए तैयार हैं।",
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
          "गहरा ध्यान और श्वास-अभ्यास तब सबसे सुरक्षित होते हैं जब गुरु शारीरिक रूप से मौजूद हों और ठीक-ठीक देख सकें कि आप कहां हैं, वीडियो कॉल से अंदाज़ा लगाकर नहीं।",
        ],
        solution:
          "इसीलिए रेजिडेंशियल फॉर्मैट मौजूद है। पारंपरिक क्रिया योग, प्राणायाम और ध्यान, एक ऐसे कमरे में जहां कोई नोटिफिकेशन नहीं, कोई इनबॉक्स नहीं, और एक गुरु जो आपको वाकई देख सकते हैं — कई दिनों का अभ्यास जो आपको ज़्यादा शांत, स्थिर और बेहतर आराम में छोड़ता है।",
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
            title: "व्यक्तिगत मार्गदर्शन",
            desc: "एक गुरु की रिकॉर्डिंग और उसी कमरे में बैठने में वास्तविक अंतर है — अभ्यास करते समय आपका आसन, सांस और गति ठीक की जाती है।",
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
        desc: "हर रेजिडेंशियल रिट्रीट एक जानबूझकर बनाई गई यात्रा के रूप में खुलता है — पहले ग्राउंडिंग, फिर श्वास-अभ्यास और क्रिया योग, फिर गहन स्थिरता, फिर एकीकरण — ताकि बदलाव को बैठने का समय मिले।",
        items: [
          {
            title: "ग्राउंडिंग और आगमन",
            desc: "सांस पुनर्संतुलन और नर्वस सिस्टम को शांत करना — गहरे काम की शुरुआत से पहले पूरी तरह उपस्थित होना।",
          },
          {
            title: "क्रिया योग और प्राणायाम",
            desc: "मूल तकनीक, संरचित, सुरक्षित क्रम में सिखाई गई, व्यक्तिगत रूप से सुधारी गई।",
          },
          {
            title: "चक्र ध्यान और श्वास-अभ्यास",
            desc: "सीधा, निर्देशित अभ्यास — किसी स्लाइड पर पढ़ा गया सिद्धांत नहीं।",
          },
          {
            title: "गहन स्थिरता और समाधि अभ्यास",
            desc: "लंबे मौन सत्र, जिनकी ओर रिट्रीट का बाकी हर हिस्सा बढ़ रहा था।",
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
            title: "YouTube पर 70+ वीडियो रिव्यूज़",
            desc: "असली प्रतिभागियों के वीडियो रिव्यूज़, कोई स्टॉक फुटेज या पेड एक्टर नहीं।",
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
        title: "एक दशक से अधिक के असली रिट्रीट्स से, YouTube पर 70+ वीडियो रिव्यूज़",
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
          "आप एक सच्चे साधक हैं — असली अभ्यास के लिए तैयार, और कंटेंट के लिए नहीं",
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
            answer: "हां। क्रिया योग या मेडिटेशन का कोई पूर्व अनुभव आवश्यक नहीं। हर अभ्यास शुरुआत से सिखाया जाता है, सुरक्षित, संरचित क्रम में।",
          },
          {
            question: "क्या गहरा ध्यान सुरक्षित है? अगर तीव्र भावनाएं उभरें तो?",
            answer:
              "हर तकनीक चरण-दर-चरण सिखाई जाती है, सीधी व्यक्तिगत निगरानी में। फिर भी, ये गहन अभ्यास हैं — कुछ लोगों के लिए, गहरा ध्यान तीव्र भावनात्मक अनुभव सामने ला सकता है। हम प्रतिभागियों से रिट्रीट से पहले किसी भी प्रासंगिक मानसिक स्वास्थ्य इतिहास को साझा करने का अनुरोध करते हैं, ताकि डॉ. कपिल देव शर्मा उसके अनुसार गति समायोजित कर सकें। यह रिट्रीट एक व्यक्तिगत और आध्यात्मिक अभ्यास है, लाइसेंस-प्राप्त थेरेपी या मनोरोग उपचार का विकल्प नहीं — यदि आप वर्तमान में किसी मानसिक स्वास्थ्य स्थिति के लिए उपचार ले रहे हैं, तो कृपया शामिल होने से पहले अपने चिकित्सक से सलाह लें।",
          },
          {
            question: "यह आपके 11-दिवसीय ऑनलाइन रिट्रीट से कैसे अलग है?",
            answer: "ऑनलाइन रिट्रीट एक लाइव, निर्देशित यात्रा है जिसे आप घर से जुड़ते हैं। रेजिडेंशियल रिट्रीट में आपको शारीरिक रूप से यात्रा करनी और वहां ठहरना होता है — पूर्ण डिस्कनेक्ट, व्यक्तिगत मार्गदर्शन, और एक छोटा व्यक्तिगत समूह जो ऑनलाइन फॉर्मैट दोहरा नहीं सकता।",
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
        text: programs.residentialRetreat.nameHi,
        price: "₹35,000 प्रति व्यक्ति से शुरू",
        cta: "अपनी सीट सुरक्षित करें",
      },
      whatsapp: {
        bubble: `${programs.residentialRetreat.nameHi} के बारे में सवाल हैं? डॉ. कपिल की टीम से तुरंत बात करें।`,
        button: "WhatsApp पर चैट करें",
        ariaLabel: `${programs.residentialRetreat.nameHi} के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें`,
      },
    },
    mentoringLanding: {
      hero: {
        eyebrowBadges: ["निजी", "संरचित", "सीमित उपलब्धता"],
        headline: `आपकी स्थिति पर केंद्रित काम, किसी ऐसे व्यक्ति के साथ जो ${trainer.years.total} वर्षों से यह कर रहा है।`,
        sub: "ओवरथिंकिंग, फोकस, और व्यक्तिगत विकास के लिए वन-ऑन-वन मेंटरिंग — आप वास्तव में जिससे जूझ रहे हैं उसके अनुसार ढाला गया, किसी तय पाठ्यक्रम के अनुसार नहीं।",
        guideLabel: "आपके गुरु",
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
          {
            duration: "21 दिन",
            tag: "गहन",
            desc: "गहरे या लंबे समय से चले आ रहे पैटर्न के लिए तीन सप्ताह, सेशंस के बीच नई आदतें बनाने और परखने का समय।",
          },
        ],
        feeNote: "फीस आपके चुने गए पैकेज पर निर्भर करती है — दिनों की संख्या और सेशन का समय। आवेदन करें, हम आपकी व्यक्तिगत योजना और फीस साझा करेंगे।",
      },
      guide: {
        eyebrow: "गुरु",
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
              `ग्रुप प्रोग्राम्स (जैसे ${programs.sharpBrain.nameHi} या ${programs.onlineRetreat.nameHi}) एक तय शेड्यूल पर चलते हैं, पूरे बैच के लिए मानकीकृत सामग्री के साथ। यह निजी, वन-ऑन-वन है, और पूरी तरह आपकी अपनी स्थिति के अनुसार ढाला गया है — गति, फोकस क्षेत्र, और प्रारूप आपके अनुसार समायोजित होते हैं, इसके उलट नहीं।`,
          },
          {
            question: "अगर मुझे यकीन नहीं है कि मुझे किस चीज़ में मदद चाहिए?",
            answer:
              "यही वजह है कि संक्षिप्त बातचीत का चरण मौजूद है। आवेदन करने से पहले आपको स्पष्ट निदान की ज़रूरत नहीं — बस इतना अंदाज़ा काफी है कि क्या ठीक से काम नहीं कर रहा। डॉ. कपिल देव शर्मा उस पहली बातचीत में ही असली फोकस क्षेत्र पहचानने में मदद करते हैं, किसी भी योजना के प्रस्तावित होने से पहले।",
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
        bubble: `${programs.oneOnOneCoaching.nameHi} के बारे में सवाल हैं? डॉ. कपिल की टीम से तुरंत बात करें।`,
        button: "WhatsApp पर चैट करें",
        ariaLabel: `${programs.oneOnOneCoaching.nameHi} के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें`,
      },
      stickyBar: {
        text: programs.oneOnOneCoaching.nameHi,
        price: "निजी · पूरी तरह कस्टमाइज़्ड",
        cta: "अभी आवेदन करें",
      },
    },
    mindResetLanding: {
      hero: {
        eyebrow: "ओवरथिंकिंग और मानसिक स्पष्टता",
        productName: programs.overthinkingReset.nameHi,
        headline: "अपने विचारों में उलझना बंद करें। अपने मन को समझना शुरू करें।",
        tagline: "अपने मन को समझें • मानसिक स्पष्टता बनाएं",
        sub: "रोज़ाना ट्रेनिंग, मेडिटेशन, और गाइडेड एक्टिविटी के 21 दिन। 6-महीने के एक्सेस के साथ डॉ. कपिल के लाइव सेशंस शामिल हैं।",
        ctaPrimary: "अपना ओवरथिंकिंग रीसेट शुरू करें — ₹499",
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
        quote:
          "ज़्यादातर लोग पहले से जानते हैं कि उन्हें क्या बदलना है। मुश्किल काम यह समझना है कि उन्होंने अब तक ऐसा क्यों नहीं किया — और वे स्थितियां बनाना जिनमें यह संभव हो सके।",
      },
      pricing: {
        eyebrow: "प्राइसिंग",
        title: "आज ही अपना ओवरथिंकिंग रीसेट शुरू करें",
        classplusNote: "चेकआउट पेज पर अपना प्लान (₹499 या ₹999) चुनें।",
        card1: {
          name: "ओवरथिंकिंग रीसेट — 1 महीना",
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
          name: "ओवरथिंकिंग रीसेट — 6 महीने",
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
            question: `${programs.overthinkingReset.nameHi} क्या है?`,
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
        ],
      },
      finalCta: {
        eyebrow: "जब आप तैयार हों",
        headline: "आपके मन को आपके ध्यान की ज़रूरत है।",
        desc: "एक छोटे कदम से शुरू करें। सीखें, चिंतन करें, अभ्यास करें, और अपने विचारों के साथ एक बेहतर रिश्ता बनाएं।",
        ctaPrimary: "अपना ओवरथिंकिंग रीसेट शुरू करें — ₹499",
        ctaSecondary: "मुफ़्त ओवरथिंकिंग टेस्ट लें",
      },
      whatsapp: {
        bubble: `${programs.overthinkingReset.nameHi} के बारे में सवाल हैं? डॉ. कपिल की टीम से तुरंत बात करें।`,
        button: "WhatsApp पर चैट करें",
        ariaLabel: `${programs.overthinkingReset.nameHi} के बारे में डॉ. कपिल की टीम से WhatsApp पर चैट करें`,
      },
      stickyBar: {
        text: programs.overthinkingReset.nameHi,
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
        courseDesc: `${programs.overthinkingReset.nameHi} एक संरचित, दैनिक हिंदी प्रोग्राम है जो ठीक इसी तरह की जागरूकता बनाने के लिए बनाया गया है।`,
        courseCta: `${programs.overthinkingReset.nameHi} एक्सप्लोर करें`,
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
