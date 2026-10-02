import { CategoryMetadata, InsecurityCategory, PeerResonanceCard } from './types';

export const INSECURITY_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'impostor_career',
    label: 'Impostor & Career',
    shortDesc: 'Feeling like a fraud, fear of failing tests or falling behind in life.',
    icon: 'Sparkles',
    accentColor: 'indigo',
  },
  {
    id: 'body_image',
    label: 'Body & Self-Image',
    shortDesc: 'Insecurity about physical looks, weight, height, or facial features.',
    icon: 'HeartHandshake',
    accentColor: 'emerald',
  },
  {
    id: 'social_anxiety',
    label: 'Social Inadequacy',
    shortDesc: 'Fear of judgment, feeling awkward in groups, or being excluded.',
    icon: 'Users',
    accentColor: 'amber',
  },
  {
    id: 'belonging_relationships',
    label: 'Belonging & Loneliness',
    shortDesc: 'Feeling unloved, disconnected, or believing friends secretly dislike you.',
    icon: 'Moon',
    accentColor: 'violet',
  },
];

export const MOCK_PEERS: PeerResonanceCard[] = [
  // Impostor & Career
  {
    id: 'peer-imp-1',
    alias: 'QuietPine',
    category: 'impostor_career',
    distilledStruggle: 'I freeze during coding tests and feel like everyone in my cohort is leagues smarter than me.',
    perspectiveGift: 'I spent a year terrified of being exposed. When I finally asked for help, my top classmate admitted he was crying in the bathroom before every exam too. Nobody has it all figured out.',
    isOnline: true,
    activeMinutesAgo: 1,
    resonanceCount: 429,
  },
  {
    id: 'peer-imp-2',
    alias: 'EtherealCreek',
    category: 'impostor_career',
    distilledStruggle: 'I got into my dream program but I feel like an admissions mistake that will be found out.',
    perspectiveGift: 'Impostor syndrome only attacks people who care deeply about their craft. It is a sign of high standards, not low intelligence.',
    isOnline: true,
    activeMinutesAgo: 3,
    resonanceCount: 618,
  },

  // Body Image
  {
    id: 'peer-body-1',
    alias: 'StarlitFern',
    category: 'body_image',
    distilledStruggle: 'I avoid mirrors and dread group photos because I feel visibly heavier and ungraceful compared to my peers.',
    perspectiveGift: 'Photos capture 1/1000th of a second under bad lighting. Your body carries your laughter, your walks with friends, and your entire existence. You are a living person, not a static portrait to be inspected.',
    isOnline: true,
    activeMinutesAgo: 2,
    resonanceCount: 532,
  },
  {
    id: 'peer-body-2',
    alias: 'AmberGlow',
    category: 'body_image',
    distilledStruggle: 'I obsess over my skin texture and hair. I feel like whenever someone talks to me, they are just staring at my flaws.',
    perspectiveGift: 'We judge our own faces from 2 inches away in bathroom mirrors. Other people experience you through your voice, your kindness, and your energy. They do not see the micro-flaws you obsess over.',
    isOnline: false,
    activeMinutesAgo: 14,
    resonanceCount: 387,
  },

  // Social Anxiety
  {
    id: 'peer-soc-1',
    alias: 'GentleBreeze',
    category: 'social_anxiety',
    distilledStruggle: 'Whenever I speak up in class or group chats, my heart races and I replay my awkward words for three days straight.',
    perspectiveGift: 'The "Spotlight Effect" is real. Nobody remembers your stumble because five seconds later they are worrying about their own voice. Be as gentle with yourself as you are with an awkward stranger.',
    isOnline: true,
    activeMinutesAgo: 1,
    resonanceCount: 741,
  },
  {
    id: 'peer-soc-2',
    alias: 'SilentDawn',
    category: 'social_anxiety',
    distilledStruggle: 'I feel exhausted trying to pretend to be bubbly so people do not think I am weird or boring.',
    perspectiveGift: 'Quiet, thoughtful presence is a superpower in a noisy world. The right friends appreciate calm depths, not forced extroversion.',
    isOnline: true,
    activeMinutesAgo: 4,
    resonanceCount: 466,
  },

  // Belonging & Loneliness
  {
    id: 'peer-bel-1',
    alias: 'CalmDrifter',
    category: 'belonging_relationships',
    distilledStruggle: 'I look at Instagram stories of parties and dinners and feel like I am an alien ghost who belongs nowhere.',
    perspectiveGift: 'Social media is curated PR for people who are often battling their own secret emptiness. True belonging starts when you stop performing and accept your quiet chapters.',
    isOnline: true,
    activeMinutesAgo: 2,
    resonanceCount: 890,
  },
  {
    id: 'peer-bel-2',
    alias: 'VelvetMoss',
    category: 'belonging_relationships',
    distilledStruggle: 'I feel like my friends only invite me as an afterthought and would not care if I disappeared.',
    perspectiveGift: 'Depression lies to you. It whispers that people do not care to keep you isolated. When I reached out first with vulnerability, I realized my friends were just drowning in their own stress.',
    isOnline: false,
    activeMinutesAgo: 22,
    resonanceCount: 654,
  },
];

/**
 * Filter mock peers by category, prioritizing online peers first.
 */
export function getPeersByCategory(category: InsecurityCategory): PeerResonanceCard[] {
  return MOCK_PEERS
    .filter((peer) => peer.category === category)
    .sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));
}
