export type MajorReligionId =
  | 'christianity'
  | 'islam'
  | 'judaism'
  | 'hinduism'
  | 'buddhism';

export type HighlightColor = 'gold' | 'rose' | 'indigo' | 'sage';

export interface ScriptureVerse {
  number: number;
  text: string;
  originalText?: string;
  transliteration?: string;
}

export interface ScripturePerspective {
  id: string;
  sourceTitle: string;
  author: string;
  traditionOrSchool: string;
  commentaryText: string;
  era: string;
}

export interface ScriptureChapter {
  id: string;
  bookId: string;
  chapterNumber: number;
  title: string;
  theme: string;
  verses: ScriptureVerse[];
  optInPerspectives: ScripturePerspective[];
}

export interface ScriptureBook {
  id: string;
  religionId: MajorReligionId;
  religionName: string;
  title: string;
  originalLanguage: string;
  standardTranslation: string;
  description: string;
  chapters: ScriptureChapter[];
}

export interface VerseHighlight {
  id: string;
  chapterId: string;
  verseNumber: number;
  color: HighlightColor;
  note?: string;
  timestamp: string;
}

export interface CustomScriptureImport {
  id: string;
  title: string;
  religionId: MajorReligionId;
  format: 'text' | 'json' | 'usfm';
  importedAt: string;
  content: string;
}

export const MAJOR_RELIGIONS: {
  id: MajorReligionId;
  name: string;
  scriptureName: string;
  canonicalBooksCount: number;
  description: string;
  primaryColors: { primary: string; secondary: string };
}[] = [
  {
    id: 'christianity',
    name: 'Christianity',
    scriptureName: 'The Holy Bible (Old & New Testaments)',
    canonicalBooksCount: 66,
    description: 'The sacred canon of Old and New Testaments testifying of God, the prophets, Jesus Christ, and the apostolic Church.',
    primaryColors: { primary: '#E8A87C', secondary: '#D47E4A' },
  },
  {
    id: 'islam',
    name: 'Islam',
    scriptureName: 'The Holy Qur’an (القرآن الكريم)',
    canonicalBooksCount: 114,
    description: 'The verbatim revelation of Allah revealed to the Prophet Muhammad (peace be upon him) in classic Arabic.',
    primaryColors: { primary: '#7D9475', secondary: '#4F6649' },
  },
  {
    id: 'judaism',
    name: 'Judaism',
    scriptureName: 'The Tanakh (Torah, Nevi’im, Ketuvim)',
    canonicalBooksCount: 24,
    description: 'The sacred Hebrew scriptures containing the Torah (Law), Nevi’im (Prophets), and Ketuvim (Writings).',
    primaryColors: { primary: '#6B7B8A', secondary: '#4B5E70' },
  },
  {
    id: 'hinduism',
    name: 'Hinduism',
    scriptureName: 'Bhagavad Gītā & The Upanishads',
    canonicalBooksCount: 18,
    description: 'The eternal wisdom of Sanātana Dharma: the dialogue between Śrī Kṛṣṇa and Arjuna, and the contemplative Upaniṣads.',
    primaryColors: { primary: '#D4B483', secondary: '#B08849' },
  },
  {
    id: 'buddhism',
    name: 'Buddhism',
    scriptureName: 'The Dhammapada & Sacred Sūtras',
    canonicalBooksCount: 26,
    description: 'The words of the Buddha on mindfulness, mental discipline, compassion, and the cessation of suffering.',
    primaryColors: { primary: '#D4A5A5', secondary: '#B87B7B' },
  },
];

export const HIGHLIGHT_TONE_CONFIG: Record<
  HighlightColor,
  { name: string; bg: string; border: string; meaning: string }
> = {
  gold: {
    name: 'Golden Promise',
    bg: 'rgba(251, 191, 36, 0.28)',
    border: '#F59E0B',
    meaning: 'Covenants, divine promises, and hope',
  },
  rose: {
    name: 'Rose Devotion',
    bg: 'rgba(244, 63, 94, 0.22)',
    border: '#E11D48',
    meaning: 'Love, compassion, charity, and grace',
  },
  indigo: {
    name: 'Indigo Wisdom',
    bg: 'rgba(99, 102, 241, 0.22)',
    border: '#6366F1',
    meaning: 'Commandments, law, deep truth, and discernment',
  },
  sage: {
    name: 'Sage Healing',
    bg: 'rgba(34, 197, 94, 0.22)',
    border: '#16A34A',
    meaning: 'Peace, renewal, healing, and rest',
  },
};

export const PRELOADED_SCRIPTURE_BOOKS: ScriptureBook[] = [
  // 1. CHRISTIANITY: HOLY BIBLE
  {
    id: 'bible-gospels',
    religionId: 'christianity',
    religionName: 'Christianity',
    title: 'The Gospel According to Matthew & Psalms',
    originalLanguage: 'Ancient Greek / Hebrew',
    standardTranslation: 'World English Bible (WEB) & KJV',
    description: 'Core teachings of the Sermon on the Mount, Beatitudes, and contemplative prayer of David.',
    chapters: [
      {
        id: 'psalm-23',
        bookId: 'bible-gospels',
        chapterNumber: 23,
        title: 'Psalm 23 — The Good Shepherd',
        theme: 'Trust, divine guidance, and inner rest in times of darkness.',
        verses: [
          { number: 1, text: 'The Lord is my shepherd; I shall not lack.' },
          { number: 2, text: 'He makes me lie down in green pastures. He leads me beside still waters.' },
          { number: 3, text: 'He restores my soul. He leads me in paths of righteousness for his name’s sake.' },
          { number: 4, text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.' },
          { number: 5, text: 'You prepare a table before me in the presence of my enemies. You have anointed my head with oil. My cup runs over.' },
          { number: 6, text: 'Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in the house of the Lord forever.' },
        ],
        optInPerspectives: [
          {
            id: 'persp-psalm23-patristic',
            sourceTitle: 'Exposition on the Psalms',
            author: 'St. Augustine of Hippo',
            traditionOrSchool: 'Early Christian Patristic',
            era: '4th Century CE',
            commentaryText: 'Augustine treats the "still waters" as the baptismal waters of spiritual renewal and the "table prepared" as the Eucharistic feast sustaining the soul on pilgrimage.',
          },
          {
            id: 'persp-psalm23-pastoral',
            sourceTitle: 'Treasury of David',
            author: 'Charles Spurgeon',
            traditionOrSchool: 'Protestant Devotional',
            era: '19th Century',
            commentaryText: 'Spurgeon notes: "He makes me lie down — the shepherd does not merely drive, but provides tranquil assurance where fear is utterly dismantled."',
          },
        ],
      },
      {
        id: 'matthew-5',
        bookId: 'bible-gospels',
        chapterNumber: 5,
        title: 'Matthew 5 — The Beatitudes & Salt of the Earth',
        theme: 'The foundation of Christ’s ethical and spiritual kingdom.',
        verses: [
          { number: 3, text: '“Blessed are the poor in spirit, for theirs is the Kingdom of Heaven.' },
          { number: 4, text: 'Blessed are those who mourn, for they shall be comforted.' },
          { number: 5, text: 'Blessed are the gentle, for they shall inherit the earth.' },
          { number: 6, text: 'Blessed are those who hunger and thirst for righteousness, for they shall be filled.' },
          { number: 7, text: 'Blessed are the merciful, for they shall obtain mercy.' },
          { number: 8, text: 'Blessed are the pure in heart, for they shall see God.' },
          { number: 9, text: 'Blessed are the peacemakers, for they shall be called children of God.' },
          { number: 14, text: 'You are the light of the world. A city located on a hill can’t be hidden.' },
        ],
        optInPerspectives: [
          {
            id: 'persp-matt5-chrysostom',
            sourceTitle: 'Homilies on Matthew',
            author: 'St. John Chrysostom',
            traditionOrSchool: 'Eastern Christian / Byzantine',
            era: '4th Century CE',
            commentaryText: 'Chrysostom emphasizes that "poor in spirit" refers to voluntary humility: the conscious release of arrogance, creating room for divine grace.',
          },
          {
            id: 'persp-matt5-tolstoy',
            sourceTitle: 'The Gospel in Brief',
            author: 'Leo Tolstoy',
            traditionOrSchool: 'Christian Non-Violence',
            era: '19th Century',
            commentaryText: 'Tolstoy reads the Beatitudes as an immediate social and inner imperative of non-resistance and universal brotherly love.',
          },
        ],
      },
    ],
  },

  // 2. ISLAM: THE HOLY QUR'AN
  {
    id: 'quran-select',
    religionId: 'islam',
    religionName: 'Islam',
    title: 'The Holy Qur’an (Selected Surahs)',
    originalLanguage: 'Classical Arabic',
    standardTranslation: 'Sahih International & Yusuf Ali',
    description: 'The foundational opening of the Qur’an (Al-Fatiha) and the Throne Verse (Ayat al-Kursi).',
    chapters: [
      {
        id: 'surah-al-fatiha',
        bookId: 'quran-select',
        chapterNumber: 1,
        title: 'Surah Al-Fātiḥah (The Opening)',
        theme: 'The essence of worship, praise of the Creator, and prayer for the straight path.',
        verses: [
          {
            number: 1,
            originalText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            transliteration: 'Bismillāhir-Raḥmānir-Raḥīm',
            text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
          },
          {
            number: 2,
            originalText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
            transliteration: 'Al-ḥamdu lillāhi Rabbil-ʿālamīn',
            text: '[All] praise is [due] to Allah, Lord of the worlds.',
          },
          {
            number: 3,
            originalText: 'الرَّحْمَٰنِ الرَّحِيمِ',
            transliteration: 'Ar-Raḥmānir-Raḥīm',
            text: 'The Entirely Merciful, the Especially Merciful,',
          },
          {
            number: 4,
            originalText: 'مَالِكِ يَوْمِ الدِّينِ',
            transliteration: 'Māliki yawmid-dīn',
            text: 'Sovereign of the Day of Recompense.',
          },
          {
            number: 5,
            originalText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
            transliteration: 'Iyyāka naʿbudu wa-iyyāka nastaʿīn',
            text: 'It is You we worship and You we ask for help.',
          },
          {
            number: 6,
            originalText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
            transliteration: 'Ihdinaṣ-ṣirāṭal-mustaqīm',
            text: 'Guide us to the straight path—',
          },
        ],
        optInPerspectives: [
          {
            id: 'persp-fatiha-ghazali',
            sourceTitle: 'Ihya Ulum al-Din (Revival of Religious Sciences)',
            author: 'Imam Abu Hamid Al-Ghazali',
            traditionOrSchool: 'Sunni / Sufi Spiritual Psychology',
            era: '11th Century CE',
            commentaryText: 'Al-Ghazali contemplates the duality of Ar-Rahman (universal mercy nourishing all creation) and Ar-Rahim (specific mercy comforting seekers on the spiritual path).',
          },
          {
            id: 'persp-fatiha-tabatabai',
            sourceTitle: 'Al-Mizan fi Tafsir al-Qur’an',
            author: 'Allamah Tabataba’i',
            traditionOrSchool: 'Shia Philosophical Tafsir',
            era: '20th Century',
            commentaryText: 'Tabataba’i observes that "Iyyaka na’budu" (You alone we worship) uses the collective "we" to signify that spiritual elevation is bound with communal solidarity.',
          },
        ],
      },
      {
        id: 'ayat-al-kursi',
        bookId: 'quran-select',
        chapterNumber: 2,
        title: 'Ayat al-Kursī (The Throne Verse — 2:255)',
        theme: 'The sovereign transcendence, omniscience, and unslumbering protection of God.',
        verses: [
          {
            number: 255,
            originalText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
            transliteration: 'Allāhu lā ilāha illā Huwal-Ḥayyul-Qayyūm. Lā ta’khudhuhū sinatuw-wa lā nawm...',
            text: 'Allah—there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.',
          },
        ],
        optInPerspectives: [
          {
            id: 'persp-kursi-kathir',
            sourceTitle: 'Tafsir Ibn Kathir',
            author: 'Ibn Kathir',
            traditionOrSchool: 'Traditional Sunni Exegesis',
            era: '14th Century CE',
            commentaryText: 'Ibn Kathir highlights the 10 distinct sentences in this verse, each affirming an aspect of divine independence and eternal oversight.',
          },
        ],
      },
    ],
  },

  // 3. JUDAISM: THE TANAKH
  {
    id: 'tanakh-select',
    religionId: 'judaism',
    religionName: 'Judaism',
    title: 'The Tanakh (Torah & Tehillim)',
    originalLanguage: 'Biblical Hebrew',
    standardTranslation: 'Jewish Publication Society (JPS)',
    description: 'The creation narrative of Bereshit (Genesis) and the Shepherd Psalm of David.',
    chapters: [
      {
        id: 'genesis-1',
        bookId: 'tanakh-select',
        chapterNumber: 1,
        title: 'Bereshit 1 — In the Beginning',
        theme: 'Order out of chaos, divine light, and the sanctity of creation.',
        verses: [
          {
            number: 1,
            originalText: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ',
            text: 'When God began to create heaven and earth—',
          },
          {
            number: 2,
            originalText: 'וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ',
            text: 'the earth being unformed and void, with darkness over the surface of the deep and a wind from God sweeping over the water—',
          },
          {
            number: 3,
            originalText: 'וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי אוֹר',
            text: 'God said, “Let there be light”; and there was light.',
          },
          {
            number: 4,
            originalText: 'וַיַּרְא אֱלֹהִים אֶת הָאוֹר כִּי טוֹב',
            text: 'God saw that the light was good, and God separated the light from the darkness.',
          },
        ],
        optInPerspectives: [
          {
            id: 'persp-bereshit-rashi',
            sourceTitle: 'Commentary on Genesis',
            author: 'Rashi (Rabbi Shlomo Yitzchaki)',
            traditionOrSchool: 'Classical Rabbinic Exegesis',
            era: '11th Century CE',
            commentaryText: 'Rashi examines the grammatical nuance of "Bereshit", demonstrating that the text speaks not of a chronological beginning, but of the purposeful foundation of moral order.',
          },
          {
            id: 'persp-bereshit-rambam',
            sourceTitle: 'The Guide for the Perplexed',
            author: 'Moses Maimonides (Rambam)',
            traditionOrSchool: 'Jewish Philosophical Rationalism',
            era: '12th Century CE',
            commentaryText: 'Maimonides warns against purely literal readings of creation, interpreting the days of Genesis as metaphysical tiers of reality brought forth from wisdom.',
          },
        ],
      },
    ],
  },

  // 4. HINDUISM: BHAGAVAD GĪTĀ
  {
    id: 'gita-select',
    religionId: 'hinduism',
    religionName: 'Hinduism',
    title: 'The Bhagavad Gītā (Song of the Lord)',
    originalLanguage: 'Sanskrit',
    standardTranslation: 'Swami Vivekananda & Eknath Easwaran',
    description: 'The profound battlefield dialogue between Lord Krishna and Arjuna on duty, yoga, and soul immortality.',
    chapters: [
      {
        id: 'gita-chapter-2',
        bookId: 'gita-select',
        chapterNumber: 2,
        title: 'Chapter 2 — Sāṅkhya Yoga (The Yoga of Wisdom)',
        theme: 'The eternal nature of the soul (Atman) and Nishkama Karma (selfless action).',
        verses: [
          {
            number: 20,
            originalText: 'न जायते म्रियते वा कदाचिन्',
            transliteration: 'Na jāyate mriyate vā kadāchin...',
            text: 'The soul is never born nor does it ever die; having once been, it never ceases to be. Unborn, eternal, ever-existing, and primeval, it is not slain when the body is slain.',
          },
          {
            number: 47,
            originalText: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
            transliteration: 'Karmaṇy evādhikāras te mā phaleṣu kadācana...',
            text: 'You have a right to perform your prescribed duties, but never to the fruits of action. Never consider yourself the cause of the results of your activities, nor be attached to inaction.',
          },
          {
            number: 48,
            originalText: 'योगस्थ: कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय',
            transliteration: 'Yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya...',
            text: 'Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called Yoga.',
          },
        ],
        optInPerspectives: [
          {
            id: 'persp-gita-shankara',
            sourceTitle: 'Gita Bhashya',
            author: 'Adi Shankaracharya',
            traditionOrSchool: 'Advaita Vedanta (Non-Dualism)',
            era: '8th Century CE',
            commentaryText: 'Shankara interprets verse 47 as the purification of the mind (Citta Shuddhi), preparing the aspirant for Jnana (the liberating realization that Atman is identical with Brahman).',
          },
          {
            id: 'persp-gita-gandhi',
            sourceTitle: 'The Bhagavad Gita According to Gandhi',
            author: 'Mahatma Gandhi',
            traditionOrSchool: 'Anasakti Yoga (Selfless Service)',
            era: '20th Century',
            commentaryText: 'Gandhi called the Gita his spiritual dictionary: "By detachment from results, one attains boundless joy and remains immune to anxiety."',
          },
        ],
      },
    ],
  },

  // 5. BUDDHISM: THE DHAMMAPADA
  {
    id: 'dhammapada-select',
    religionId: 'buddhism',
    religionName: 'Buddhism',
    title: 'The Dhammapada (Verses on the Dhamma)',
    originalLanguage: 'Pāli',
    standardTranslation: 'Narada Thera & Gil Fronsdal',
    description: 'The anthology of 423 aphorisms spoken by the Buddha on mindfulness, intention, and awakening.',
    chapters: [
      {
        id: 'dhammapada-ch1',
        bookId: 'dhammapada-select',
        chapterNumber: 1,
        title: 'Chapter 1 — Yamakavagga (The Twin Verses)',
        theme: 'Mind as the architect of experience, suffering, and joy.',
        verses: [
          {
            number: 1,
            originalText: 'मनोपुब्बङ्गमा धम्मा मनोसेट्ठा मनोमया',
            transliteration: 'Manopubbaṅgamā dhammā manoseṭṭhā manomayā...',
            text: 'Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If with an impure mind a person speaks or acts, suffering follows him like the wheel that follows the foot of the ox.',
          },
          {
            number: 2,
            originalText: 'मनोपुब्बङ्गमा धम्मा मनोसेट्ठा मनोमया',
            transliteration: 'Manopubbaṅgamā dhammā manoseṭṭhā manomayā...',
            text: 'Mind precedes all mental states. Mind is their chief; they are all mind-wrought. If with a pure mind a person speaks or acts, happiness follows him like his never-departing shadow.',
          },
          {
            number: 5,
            originalText: 'न हि वेरेन वेरानि सम्मन्तीध कुदाचनं',
            transliteration: 'Na hi verena verāni sammantīdha kudācanaṁ...',
            text: 'Hatred does not cease by hatred at any time; hatred ceases only through love (non-hatred). This is an eternal law.',
          },
        ],
        optInPerspectives: [
          {
            id: 'persp-dhamma-buddhaghosa',
            sourceTitle: 'Dhammapada-Atthakatha',
            author: 'Bhadantacariya Buddhaghosa',
            traditionOrSchool: 'Theravāda Commentary',
            era: '5th Century CE',
            commentaryText: 'Buddhaghosa details how volition (cetana) serves as the primary karmic seed: purity of thought directly alters psychological reality before speech occurs.',
          },
          {
            id: 'persp-dhamma-thichnhathanh',
            sourceTitle: 'The Heart of the Buddha’s Teaching',
            author: 'Thich Nhat Hanh',
            traditionOrSchool: 'Engaged Zen Buddhism',
            era: '20th Century',
            commentaryText: 'Thich Nhat Hanh reflects: "To smile in the face of anger is not weak; it is the courage of understanding that anger cannot put out anger."',
          },
        ],
      },
    ],
  },
];
