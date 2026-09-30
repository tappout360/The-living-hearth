import type { MajorReligionId } from './scriptureData';

export type EventBroadcastType = 'live' | 'prerecorded' | 'upcoming';
export type HouseOfWorshipType = 'church' | 'mosque' | 'synagogue' | 'temple' | 'vihara';

export interface HouseOfWorship {
  id: string;
  name: string;
  religionId: MajorReligionId;
  type: HouseOfWorshipType;
  denominationOrLineage: string;
  locationCity: string;
  locationStateOrCountry: string;
  pastorOrLeader: string;
  description: string;
  memberCount: number;
  verifiedStatus: boolean;
  avatarIcon: string;
  coverImage?: string;
  websiteUrl?: string;
}

export interface ChurchEventStream {
  id: string;
  houseOfWorshipId: string;
  houseOfWorshipName: string;
  religionId: MajorReligionId;
  title: string;
  description: string;
  broadcastType: EventBroadcastType;
  speaker: string;
  scheduledTime: string;
  durationMinutes: number;
  viewerCount: number;
  videoUrlPlaceholder?: string;
  sacredRhythmTag: string; // e.g. 'Sunday Liturgy', 'Jumu\'ah Prayer', 'Shabbat Evening', 'Aarti', 'Dharma Talk'
  quietModeActive: boolean; // Only prayer affirmations allowed, zero argumentative chat
  publicAccessAllowed: boolean;
}

export const VERIFIED_HOUSES_OF_WORSHIP: HouseOfWorship[] = [
  // 1. CHRISTIANITY
  {
    id: 'how-grace-cathedral',
    name: 'Grace Sanctuary & Fellowship',
    religionId: 'christianity',
    type: 'church',
    denominationOrLineage: 'Ecumenical Christian / Liturgical',
    locationCity: 'Chicago',
    locationStateOrCountry: 'Illinois, USA',
    pastorOrLeader: 'Pastor David & Rev. Sarah Mitchell',
    description: 'A Christ-centered contemplative community focused on scripture study, pastoral care, and liturgical hymns.',
    memberCount: 840,
    verifiedStatus: true,
    avatarIcon: '✝️',
  },
  {
    id: 'how-st-mary-basilica',
    name: 'St. Mary of the Angels Parish',
    religionId: 'christianity',
    type: 'church',
    denominationOrLineage: 'Catholic (Roman Rite)',
    locationCity: 'Boston',
    locationStateOrCountry: 'Massachusetts, USA',
    pastorOrLeader: 'Father Thomas Augustine, OFM',
    description: 'Daily Eucharistic adoration, contemplative evening Vespers, and works of mercy in the local parish.',
    memberCount: 1420,
    verifiedStatus: true,
    avatarIcon: '⛪',
  },

  // 2. ISLAM
  {
    id: 'how-dar-al-salam-mosque',
    name: 'Dar Al-Salam Islamic Center',
    religionId: 'islam',
    type: 'mosque',
    denominationOrLineage: 'Sunni Community / Universal Islamic Center',
    locationCity: 'Dallas',
    locationStateOrCountry: 'Texas, USA',
    pastorOrLeader: 'Imam Tariq Al-Hashimi',
    description: 'Daily five prayers, Jumu\'ah khutbah, Quranic memorization, and compassionate community outreach.',
    memberCount: 1150,
    verifiedStatus: true,
    avatarIcon: '🕌',
  },

  // 3. JUDAISM
  {
    id: 'how-or-hadash-synagogue',
    name: 'Congregation Or Hadash (Light of Dawn)',
    religionId: 'judaism',
    type: 'synagogue',
    denominationOrLineage: 'Conservative / Traditional Shabbat Observance',
    locationCity: 'Philadelphia',
    locationStateOrCountry: 'Pennsylvania, USA',
    pastorOrLeader: 'Rabbi Miriam Levin & Cantor Ari Rubin',
    description: 'Torah study cohorts, joyful Shabbat evening Kabbalat Shabbat, and Tikkun Olam community service.',
    memberCount: 620,
    verifiedStatus: true,
    avatarIcon: '🕍',
  },

  // 4. HINDUISM
  {
    id: 'how-shri-krishna-mandir',
    name: 'Shri Radha Krishna Mandir & Cultural Center',
    religionId: 'hinduism',
    type: 'temple',
    denominationOrLineage: 'Vedanta & Bhakti Sampradaya',
    locationCity: 'San Jose',
    locationStateOrCountry: 'California, USA',
    pastorOrLeader: 'Pandit Ramesh Sharma',
    description: 'Vedic chanting, weekly Bhagavad Gita discourses, evening Sandhya Aarti, and community seva.',
    memberCount: 950,
    verifiedStatus: true,
    avatarIcon: '🛕',
  },

  // 5. BUDDHISM
  {
    id: 'how-clear-mountain-monastery',
    name: 'Clear Mountain Mindfulness Sanctuary',
    religionId: 'buddhism',
    type: 'vihara',
    denominationOrLineage: 'Theravāda & Zen Contemplative Forest Tradition',
    locationCity: 'Seattle',
    locationStateOrCountry: 'Washington, USA',
    pastorOrLeader: 'Ajahn Kovilo & Venerable Nisabho',
    description: 'Silent sitting meditation, Dhammapada readings, metta chantings, and weekly live Dharma teachings.',
    memberCount: 780,
    verifiedStatus: true,
    avatarIcon: '☸️',
  },
];

export const CHURCH_BROADCAST_EVENTS: ChurchEventStream[] = [
  // Christian Streams
  {
    id: 'evt-christian-sunday-liturgy',
    houseOfWorshipId: 'how-grace-cathedral',
    houseOfWorshipName: 'Grace Sanctuary & Fellowship',
    religionId: 'christianity',
    title: 'Sunday Morning Liturgy & Sermon: “The Beatitudes of Grace”',
    description: 'Live morning worship service with acoustic choral hymns and verse-by-verse exposition of Matthew 5.',
    broadcastType: 'live',
    speaker: 'Pastor David Mitchell',
    scheduledTime: 'Sunday 10:00 AM CST',
    durationMinutes: 65,
    viewerCount: 312,
    sacredRhythmTag: 'Sunday Liturgy',
    quietModeActive: true,
    publicAccessAllowed: false,
  },
  {
    id: 'evt-catholic-evening-vespers',
    houseOfWorshipId: 'how-st-mary-basilica',
    houseOfWorshipName: 'St. Mary of the Angels Parish',
    religionId: 'christianity',
    title: 'Choral Vespers & Liturgy of the Hours (Psalm 23)',
    description: 'Pre-recorded Gregorian chant and evening reflection for caregivers, healthcare workers, and pilgrims.',
    broadcastType: 'prerecorded',
    speaker: 'Father Thomas Augustine, OFM',
    scheduledTime: 'Daily at Dusk',
    durationMinutes: 30,
    viewerCount: 540,
    sacredRhythmTag: 'Liturgy of the Hours',
    quietModeActive: true,
    publicAccessAllowed: false,
  },

  // Islamic Streams
  {
    id: 'evt-islam-jumuah-prayer',
    houseOfWorshipId: 'how-dar-al-salam-mosque',
    houseOfWorshipName: 'Dar Al-Salam Islamic Center',
    religionId: 'islam',
    title: 'Jumu\'ah Khutbah: “Patience (Sabr) and Sincere Devotion in Daily Life”',
    description: 'Live Friday congregational sermon with recitation of Surah Al-Kahf and communal Du’a.',
    broadcastType: 'live',
    speaker: 'Imam Tariq Al-Hashimi',
    scheduledTime: 'Friday 1:15 PM CST',
    durationMinutes: 45,
    viewerCount: 428,
    sacredRhythmTag: 'Jumu\'ah Prayer',
    quietModeActive: true,
    publicAccessAllowed: false,
  },

  // Jewish Streams
  {
    id: 'evt-jewish-kabbalat-shabbat',
    houseOfWorshipId: 'how-or-hadash-synagogue',
    houseOfWorshipName: 'Congregation Or Hadash',
    religionId: 'judaism',
    title: 'Kabbalat Shabbat: Welcoming the Sabbath Bride (Lecha Dodi)',
    description: 'Live musical Shabbat evening service with blessings over the lights and peaceful cantorial melodies.',
    broadcastType: 'live',
    speaker: 'Rabbi Miriam Levin & Cantor Ari Rubin',
    scheduledTime: 'Friday at Sundown',
    durationMinutes: 55,
    viewerCount: 195,
    sacredRhythmTag: 'Shabbat Evening',
    quietModeActive: true,
    publicAccessAllowed: false,
  },

  // Hindu Streams
  {
    id: 'evt-hindu-evening-aarti',
    houseOfWorshipId: 'how-shri-krishna-mandir',
    houseOfWorshipName: 'Shri Radha Krishna Mandir',
    religionId: 'hinduism',
    title: 'Sandhyā Aarti & Bhagavad Gītā Discourse (Chapter 2)',
    description: 'Evening light offering with traditional conch, bell chimes, and reflection on Nishkama Karma.',
    broadcastType: 'live',
    speaker: 'Pandit Ramesh Sharma',
    scheduledTime: 'Daily 7:00 PM PST',
    durationMinutes: 40,
    viewerCount: 280,
    sacredRhythmTag: 'Sandhyā Aarti',
    quietModeActive: true,
    publicAccessAllowed: false,
  },

  // Buddhist Streams
  {
    id: 'evt-buddhist-dharma-stream',
    houseOfWorshipId: 'how-clear-mountain-monastery',
    houseOfWorshipName: 'Clear Mountain Mindfulness Sanctuary',
    religionId: 'buddhism',
    title: 'Live Dharma Talk: “Taming the Mind Through the Twin Verses of the Dhammapada”',
    description: 'Guided 30-minute silent breath meditation followed by open Q&A on mindfulness and ethical presence.',
    broadcastType: 'live',
    speaker: 'Ajahn Kovilo',
    scheduledTime: 'Wednesday 6:30 PM PST',
    durationMinutes: 60,
    viewerCount: 380,
    sacredRhythmTag: 'Mindful Dharma',
    quietModeActive: true,
    publicAccessAllowed: false,
  },
];
