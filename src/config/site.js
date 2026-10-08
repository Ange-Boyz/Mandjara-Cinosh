// Public, non-secret site configuration. Content that changes weekly
// (film, date, venue, price, capacity) comes from the API, not from here.

export const SITE = {
  name: 'Mandjara Cinosh',
  tagline: 'The culture that feeds the Soul.',
  city: 'Buea',
  country: 'Cameroon',
  timeZone: 'Africa/Douala',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'mandjara777@gmail.com',
  social: '@MANDJARACINOSH',
};

export const BOOKING_LIMITS = {
  maxPerBooking: 6,
};

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

// The mock backend is available in dev, or when explicitly enabled.
// It is never silently used in a production build.
export const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true' || (import.meta.env.DEV && !API_BASE_URL);

export const PAYMENT_METHODS = [
  { id: 'MOBILE_MONEY', label: 'Mobile Money', hint: 'MTN MoMo or Orange Money' },
  { id: 'CARD', label: 'Bank card', hint: 'Visa or Mastercard' },
];

export const EXPERIENCE_STEPS = [
  { n: '01', title: 'Arrive', text: 'Music, warm light, and faces you are about to know. Doors open before the film so the evening can breathe.' },
  { n: '02', title: 'Feel', text: 'Young artists open the night with poetry, slam, spoken word, acoustic music or storytelling.' },
  { n: '03', title: 'Reflect', text: 'The Mandjara Word, an African proverb tied to the film, then a short introduction to the theme.' },
  { n: '04', title: 'Watch', text: 'Lights dim together, a moment of sacred silence, and the film in a room built for focus.' },
  { n: '05', title: 'Connect', text: 'The Mandjara Circle: talk it through, vote on what comes next, and take the group photo.' },
];

// The eight moments of the Mandjara ritual (from the project proposal).
export const RITUAL = [
  { name: 'The Arrival', duration: '15 min', text: 'Welcome, music, ambient light, informal exchanges and cultural hospitality.' },
  { name: 'The Mandjara Prelude', duration: '10 min', text: 'A word of prayer, then poetry, slam, spoken word, acoustic music or storytelling.' },
  { name: 'The Mandjara Word', duration: '5 min', text: 'A proverb connected to the film’s theme is projected for the whole room.' },
  { name: 'The Introduction', duration: '10 min', text: 'A member of the team presents the film, its themes and its cultural significance.' },
  { name: 'The Sacred Silence', duration: '2 min', text: 'Lights are dimmed together and silence is observed before the projection.' },
  { name: 'The Film', duration: '90–120 min', text: 'The screening, in an atmosphere designed for concentration and emotion.' },
  { name: 'The Mandjara Circle', duration: '30 min', text: 'A moderated conversation about themes, lessons and cultural values.' },
  { name: 'The Vote & Collective Memory', duration: '10 min', text: 'Vote on the next theme, share feedback, and gather for the group photograph.' },
];

export const REASONS = [
  { n: '01', title: 'Experience it together', text: 'Some films take on another dimension when a whole room breathes with them.' },
  { n: '02', title: 'Discover something beyond the screen', text: 'Live performance, discussion and reflection wrap around the film.' },
  { n: '03', title: 'Meet your people', text: 'A space for young people, film lovers, creatives and the simply curious.' },
];

export const VOTE_THEMES = ['Family', 'Identity', 'Love', 'African history', 'Community'];

export const FAQ = [
  {
    q: 'What exactly is Mandjara Cinosh?',
    a: 'A cultural cinema experience. In Cameroon, “mandjara” means cousin. Each screening is an evening of music, live performance, a film and a conversation, built so that nobody sits alone in the dark.',
  },
  {
    q: 'Why is there only one screening at a time?',
    a: 'One week, one event, one film. Focusing on a single screening lets us put real care into the atmosphere, the artists and the discussion around it.',
  },
  {
    q: 'How do I get my ticket?',
    a: 'Choose the number of tickets, enter your name, phone number and email, and pay. Your booking is confirmed only once the payment is verified by our server. You then get a QR ticket you can open on your phone.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'Mobile Money (MTN MoMo and Orange Money) and bank cards. More methods will be added later.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. A name, a phone number and an email are enough. Keep your ticket link or screenshot your QR code.',
  },
  {
    q: 'When should I arrive?',
    a: 'Doors open an hour before the film starts. The evening begins with music and a live prelude, so arriving early is part of the experience.',
  },
  {
    q: 'Is every seat numbered?',
    a: 'Not at launch. You book a number of tickets and we seat the room on arrival. Seat selection will come once our venue layout is stable.',
  },
  {
    q: 'What if the screening is cancelled?',
    a: 'If Mandjara cancels a screening, every booking for it is refunded in full.',
  },
  {
    q: 'I am a filmmaker or an artist. Can I take part?',
    a: 'We would love to hear from you. Write to us through the contact page and tell us about your work.',
  },
  {
    q: 'How is my personal data used?',
    a: 'We collect only what is needed to confirm your booking and send you your ticket and reminders. We never sell personal data. Any audience insight we share is anonymised and aggregated.',
  },
];

// Primary navigation (public site).
export const NAV_LINKS = [
  { to: '/next-screening', label: 'The Next Mandjara' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

// Hosts the booking page may redirect to for payment (defence in depth: the API
// response alone is never enough to send a visitor off-site). Comma-separated
// origins in VITE_PAYMENT_ORIGINS, e.g. "https://pay.provider.com".
export const PAYMENT_ORIGINS = (import.meta.env.VITE_PAYMENT_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const FOCUS_AREAS = [
  { title: 'Cinema & storytelling', text: 'Films rooted in African stories, proverbs and real-life heroes.' },
  { title: 'Cultural identity', text: 'A place to recognise yourself on screen and reconnect with heritage.' },
  { title: 'Youth engagement', text: 'Built with and for young people, students and emerging creatives.' },
  { title: 'Community dialogue', text: 'Every screening ends with a conversation, not a credit roll.' },
  { title: 'African film appreciation', text: 'Visibility for local filmmakers, storytellers and artists.' },
  { title: 'Social reflection', text: 'Cinema as a tool for education, memory and living together.' },
];
