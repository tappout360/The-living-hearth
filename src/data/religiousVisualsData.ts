/**
 * Master Registry mapping every tradition name, room motif, or category
 * to its unique authentic religious visual.
 */
export type TraditionVisualType =
  | 'christianity'
  | 'catholicism'
  | 'latter-day-saints'
  | 'islam'
  | 'judaism'
  | 'hinduism'
  | 'buddhism'
  | 'sikhism'
  | 'bahai'
  | 'jainism'
  | 'taoism'
  | 'shinto'
  | 'celtic-indigenous'
  | 'contemplative-interfaith';

export function resolveTraditionVisualType(nameOrId?: string): TraditionVisualType {
  if (!nameOrId) return 'contemplative-interfaith';
  const s = nameOrId.toLowerCase();

  // Catholicism
  if (s.includes('catholic') || s.includes('vatican') || s.includes('liturgy of the hours')) {
    return 'catholicism';
  }

  // Latter-day Saints / Mormonism
  if (
    s.includes('latter-day') ||
    s.includes('mormon') ||
    s.includes('lds') ||
    s.includes('restoration') ||
    s.includes('nephi')
  ) {
    return 'latter-day-saints';
  }

  // Christianity (General / Protestant / Orthodox)
  if (s.includes('christian') || s.includes('gospel') || s.includes('desert fathers')) {
    return 'christianity';
  }

  // Islam & Sufism
  if (s.includes('islam') || s.includes('muslim') || s.includes('sufi') || s.includes('quran') || s.includes('dhikr')) {
    return 'islam';
  }

  // Judaism
  if (s.includes('juda') || s.includes('jew') || s.includes('torah') || s.includes('kavanah') || s.includes('shabbat')) {
    return 'judaism';
  }

  // Hinduism
  if (s.includes('hindu') || s.includes('vedan') || s.includes('gita') || s.includes('upanishad') || s.includes('bhakti')) {
    return 'hinduism';
  }

  // Buddhism
  if (s.includes('buddh') || s.includes('dharma') || s.includes('karun') || s.includes('zen') || s.includes('vipassana')) {
    return 'buddhism';
  }

  // Sikhism
  if (s.includes('sikh') || s.includes('gurmat') || s.includes('seva') || s.includes('khanda') || s.includes('granth')) {
    return 'sikhism';
  }

  // Bahá'í
  if (s.includes('bahá') || s.includes('bahai') || s.includes('baha')) {
    return 'bahai';
  }

  // Jainism
  if (s.includes('jain') || s.includes('ahimsa') || s.includes('anekantavada')) {
    return 'jainism';
  }

  // Taoism / Daoism
  if (s.includes('tao') || s.includes('dao') || s.includes('wu wei') || s.includes('daodejing')) {
    return 'taoism';
  }

  // Shinto
  if (s.includes('shinto') || s.includes('kami') || s.includes('torii')) {
    return 'shinto';
  }

  // Celtic & Indigenous
  if (s.includes('celtic') || s.includes('indigenous') || s.includes('earth') || s.includes('native')) {
    return 'celtic-indigenous';
  }

  // Default to contemplative / interfaith
  return 'contemplative-interfaith';
}

/**
 * Metadata descriptor for visual iconography and scholarly symbolism
 */
export interface TraditionVisualMeta {
  type: TraditionVisualType;
  displayName: string;
  primaryEmblem: string;
  spiritualMeaning: string;
  historicOrigins: string;
}

export const SACRED_VISUAL_REGISTRY: TraditionVisualMeta[] = [
  {
    type: 'christianity',
    displayName: 'Christianity',
    primaryEmblem: 'The Latin Cross & Celestial Radiance',
    spiritualMeaning: 'Symbolizes the life, sacrificial love, resurrection of Jesus Christ, and the light of divine grace encompassing humanity.',
    historicOrigins: 'Adopted from early Christian antiquity, evolving from simple fish (Ichthys) and staurogram motifs into the universal cross of redemption.',
  },
  {
    type: 'catholicism',
    displayName: 'Catholicism',
    primaryEmblem: 'Sacred Cross with Chi-Rho (☧) & Eucharistic Halo',
    spiritualMeaning: 'Represents the Christological monogram (Chi-Rho), the continuous sacrificial celebration of the Eucharist, and communion with the Church universal.',
    historicOrigins: 'Dating to Constantine and the early Church Fathers, uniting sacramental theology with apostolic liturgical order.',
  },
  {
    type: 'latter-day-saints',
    displayName: 'Latter-day Saint Tradition',
    primaryEmblem: 'Angel Moroni with Herald Trumpet & Temple Spire',
    spiritualMeaning: 'Symbolizes the restoration of the everlasting gospel (Revelation 14:6), the gathering of seekers, and holy covenants made in temple sanctuaries.',
    historicOrigins: 'Designed by Cyrus Dallin for the Salt Lake Temple in 1892, celebrated worldwide as a herald of peace, light, and restored covenants.',
  },
  {
    type: 'islam',
    displayName: 'Islam & Sufism',
    primaryEmblem: 'Rub el Hizb (۞ Octagram) with Hilal (Crescent) & Star',
    spiritualMeaning: 'Emphasizes Tawhid (divine unity) through infinite sacred geometry, the lunar calendar of prayer and Ramadan, and humble surrender to the Divine.',
    historicOrigins: 'Rub el Hizb marked reading divisions in Qur’anic manuscripts; the Hilal grew as a widespread symbol of Islamic civilization and lunar devotion.',
  },
  {
    type: 'judaism',
    displayName: 'Judaism',
    primaryEmblem: 'Magen David (Star of David ✡) & Seven-Branched Menorah',
    spiritualMeaning: 'The Menorah symbolizes divine illumination and the creation week; the Magen David represents God’s protection shielding David from all six directions.',
    historicOrigins: 'The Menorah was commanded in Exodus for the Tabernacle and Temple in Jerusalem; the Magen David emerged in Jewish medieval liturgy and community seals.',
  },
  {
    type: 'hinduism',
    displayName: 'Hinduism (Sanātana Dharma)',
    primaryEmblem: 'Sacred Om (ॐ) & Blossoming Lotus (Padma)',
    spiritualMeaning: 'Om is the primordial cosmic vibration (Pranava) of Brahman; the lotus signifies spiritual awakening blooming unsullied above muddy waters.',
    historicOrigins: 'Extensively praised in the Mandukya and Chandogya Upanishads, foundational to Vedic and post-Vedic contemplative traditions.',
  },
  {
    type: 'buddhism',
    displayName: 'Buddhism',
    primaryEmblem: 'Dharmachakra (Wheel of Dhamma ☸)',
    spiritualMeaning: 'The 8 spokes embody the Noble Eightfold Path (Right View to Right Samadhi) leading to liberation from suffering (Nirvana).',
    historicOrigins: 'First turned by Siddhartha Gautama in the Deer Park at Sarnath; erected by Emperor Ashoka on the Pillars of Dharma across ancient India.',
  },
  {
    type: 'sikhism',
    displayName: 'Sikhism (Sikhi)',
    primaryEmblem: 'The Sacred Khanda (☬)',
    spiritualMeaning: 'The central sword represents divine knowledge separating truth from illusion; the circle (Chakar) represents eternal oneness; twin swords (Miri & Piri) unite worldly justice with spiritual depth.',
    historicOrigins: 'Formalized under Guru Gobind Singh and the Khalsa tradition in 1699 as a badge of fearlessness, divine justice, and protection of the vulnerable.',
  },
  {
    type: 'bahai',
    displayName: 'Bahá\'í Faith',
    primaryEmblem: 'The Nine-Pointed Star',
    spiritualMeaning: 'Number 9 represents the highest single digit, symbolizing completion, the unity of all worldwide religions, and the oneness of humankind.',
    historicOrigins: 'Designed by early Bahá\'í architects and artists to encapsulate the teachings of Bahá\'u\'lláh in pure non-representational geometry.',
  },
  {
    type: 'jainism',
    displayName: 'Jainism',
    primaryEmblem: 'Ahimsa Hand (Abhayamudra with Wheel)',
    spiritualMeaning: 'The open palm bestows fearlessness; the wheel in the palm signifies non-violence (Ahimsa) stopping the cyclical wheel of suffering in worldly existence.',
    historicOrigins: 'Formalized at the 2500th anniversary of Mahavira’s Nirvana as the universal seal of Jain ethics and unconditional reverence for all living souls.',
  },
  {
    type: 'taoism',
    displayName: 'Taoism (Daoism)',
    primaryEmblem: 'Taijitu (Yin and Yang ☯)',
    spiritualMeaning: 'Illustrates the complementary harmony of dark and light, receptive and active, stillness and motion, effortlessly aligned with the Dao (the Way).',
    historicOrigins: 'Rooted in the I Ching (Book of Changes) and developed by Song Dynasty Daoist metaphysicians including Zhou Dunyi.',
  },
  {
    type: 'shinto',
    displayName: 'Shinto',
    primaryEmblem: 'Sacred Torii Gate (⛩️)',
    spiritualMeaning: 'The sacred boundary threshold that purifies the traveler, moving from the secular everyday world into sacred communion with the Kami (spirits of nature).',
    historicOrigins: 'Present at Japanese shrines since antiquity, traditionally made of sacred cypress wood and facing nature’s cardinal orientations.',
  },
  {
    type: 'celtic-indigenous',
    displayName: 'Celtic & Indigenous Traditions',
    primaryEmblem: 'Triquetra Trinity Knot & Earth Wheel',
    spiritualMeaning: 'Celebrates the threefold sanctity of Earth, Sea, and Sky; the continuum of past, present, and future; and reverent kinship with creation.',
    historicOrigins: 'Illuminated in ancient Insular art (Book of Kells) and stone megaliths, expressing continuous interconnectedness without beginning or end.',
  },
  {
    type: 'contemplative-interfaith',
    displayName: 'Interfaith & Contemplative Seeking',
    primaryEmblem: 'Living Hearth Labyrinth & Sacred Flame',
    spiritualMeaning: 'A sanctuary space where all seekers, pilgrims, and traditions meet around the common warmth of the hearth and interior stillness.',
    historicOrigins: 'Inspired by ancient contemplative labyrinths and the sacred hearth fires kept burning in universal human sanctuaries across history.',
  },
];
