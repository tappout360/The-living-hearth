import type {
  TraditionPersonalizationProfile,
  CalendarSystemType,
  SacredObservance,
} from '../types/traditionPersonalization';

export const TRADITION_PERSONALIZATION_PROFILES: Record<string, TraditionPersonalizationProfile> = {
  judaism: {
    id: 'judaism',
    traditionName: 'Judaism',
    family: 'Abrahamic',
    coverageStatus: 'Live',
    orientation: {
      type: 'fixed_point',
      target: {
        name: 'The Temple Mount / Western Wall',
        latitude: 31.778,
        longitude: 35.2354,
        city: 'Jerusalem',
        description: 'The historic and spiritual heart of Jewish yearning, prayer, and covenant.',
        theologicalSignificance:
          'From Daniel 6:10 and the dedication of Solomon’s Temple (1 Kings 8), Jewish communities throughout history turn in prayer toward Jerusalem (Mizrah).',
      },
      advisoryNote:
        'Traditional Jewish prayer turns toward Jerusalem (Mizrah). In Western regions, this is generally Eastward; in Eastern regions, it is Westward.',
    },
    dailyRhythm: [
      {
        id: 'judaism-shacharit',
        name: 'Morning Prayer',
        traditionalName: 'Shacharit (שַחֲרִית)',
        timeWindow: 'Morning (from sunrise to ~10:00 AM)',
        description: 'Gratitude for returning consciousness (Modeh Ani), Shema affirmation of divine unity, and the Amidah standing blessing.',
        practiceType: 'prayer',
      },
      {
        id: 'judaism-mincha',
        name: 'Afternoon Prayer',
        traditionalName: 'Mincha (מִנְחָה)',
        timeWindow: 'Afternoon (from midday to sunset)',
        description: 'A brief, steady pause during the work day to re-center upon justice, kindness, and divine presence before dusk falls.',
        practiceType: 'prayer',
      },
      {
        id: 'judaism-maariv',
        name: 'Evening Prayer',
        traditionalName: 'Maariv / Arvit (מַעֲרִיב)',
        timeWindow: 'Nightfall (after sunset)',
        description: 'Nighttime Shema, prayers for safe shelter during the darkness (Hashkiveinu), and evening reflection.',
        practiceType: 'prayer',
      },
    ],
    calendar: {
      primarySystem: 'hebrew',
      systemDisplayName: 'Hebrew Lunisolar Calendar (לוח עברי)',
      currentEraYear: 'Year 5786 / 5787 AM',
      astronomicalNotice: 'Observances begin at sunset on the eve of the date listed and conclude at nightfall.',
      upcomingObservances: [
        {
          id: 'shabbat-weekly',
          traditionId: 'judaism',
          name: 'Shabbat (שַׁבָּת)',
          calendarSystem: 'hebrew',
          dateDisplay: 'Weekly from Friday Sunset to Saturday Nightfall',
          beginsAtSunset: true,
          description: 'The weekly sanctuary in time — setting aside commercial labor and technology to delight in fellowship, study, and peace.',
          spiritualTheme: 'Covenant Rest & Creation Delight',
          internalDiversityNotes: 'Observed with diverse liturgical styles across Orthodox, Conservative, Reform, Reconstructionist, and renewal communities.',
        },
        {
          id: 'rosh-hashanah',
          traditionId: 'judaism',
          name: 'Rosh Hashanah (ראש השנה)',
          calendarSystem: 'hebrew',
          dateDisplay: '1-2 Tishrei (Autumn Season)',
          beginsAtSunset: true,
          description: 'The Jewish New Year and Day of Memorial (Yom HaZikaron), awakening the soul with the sounding of the Shofar.',
          spiritualTheme: 'Renewal, Teshuvah (Return) & Life Purpose',
          internalDiversityNotes: 'Observed for two days in traditional diaspora communities; some liberal communities celebrate one day.',
        },
        {
          id: 'yom-kippur',
          traditionId: 'judaism',
          name: 'Yom Kippur (יום כיפור)',
          calendarSystem: 'hebrew',
          dateDisplay: '10 Tishrei (Autumn Season)',
          beginsAtSunset: true,
          description: 'The Day of Atonement — the holiest day of the Jewish calendar, observed with prayer, fasting, and heartfelt reconciliation.',
          spiritualTheme: 'Atonement, Forgiveness & Clean Slate',
          internalDiversityNotes: 'Fasting and white vestments are customary across virtually all Jewish movements.',
        },
        {
          id: 'pesach',
          traditionId: 'judaism',
          name: 'Passover (Pesach - פֶּסַח)',
          calendarSystem: 'hebrew',
          dateDisplay: '15-22 Nisan (Spring Season)',
          beginsAtSunset: true,
          description: 'The Festival of Freedom, commemorating the Exodus from Egyptian bondage through the Seder table.',
          spiritualTheme: 'Liberation from Oppression & Hope for All Humankind',
          internalDiversityNotes: 'Haggadah readings range from traditional rabbinic texts to contemporary social justice and ecological seders.',
        },
      ],
    },
    spatialHeritage: {
      id: 'mizrah-wall',
      traditionId: 'judaism',
      systemName: 'Mizrah Plaque & Home Sanctuary Space',
      corePrinciple: 'Dedicated intentionality (Kavanah) in physical space pointing toward the sacred center.',
      gentleGuidance: [
        'Place a Mizrah marker, art piece, or peaceful study table along the wall facing toward Jerusalem.',
        'Keep prayer books (Siddurim) and scriptures in a clean, elevated, dignified position.',
        'Welcome natural light and avoid clutter in the designated quiet corner of your room.',
      ],
      educationalDisclaimer:
        'This guidance is an optional cultural and architectural heritage contemplation. It is never prescriptive or required for prayer.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'Shalom aleichem — may deep peace, discernment, and loving-kindness accompany your sanctuary time.',
      intentionPromptTemplate: 'Baruch atah... Blessed is the Source of Life who grants strength to the weary and guides our steps.',
      closingBlessing: 'May the Maker of peace in the celestial heights establish peace upon us and all living beings.',
    },
    ambientProfileDefault: 'study',
    abstractAccentColor: '#2B5B84', // Classic dignified lapis / sapphire blue
    internalDiversityStatement:
      'Jewish practice encompasses rich internal diversity across Sephardic, Ashkenazi, Mizrahi, Ethiopian (Beta Israel), and contemporary streams. We honor all authentic voices.',
  },

  christianity: {
    id: 'christianity',
    traditionName: 'Christianity',
    family: 'Abrahamic',
    coverageStatus: 'Live',
    orientation: {
      type: 'symbolic_east',
      cardinalDirection: 'East',
      advisoryNote:
        'Historic Christian prayer faces East (symbolizing Christ as the rising Sun of Righteousness), while many contemporary traditions emphasize inward, non-directional contemplation.',
    },
    dailyRhythm: [
      {
        id: 'christ-morning',
        name: 'Morning Devotion & Praise',
        traditionalName: 'Morning Prayer / Matins',
        timeWindow: 'Dawn to early morning',
        description: 'Opening the day with Psalms, scripture meditation, and dedicating daily labor to the love of God and neighbor.',
        practiceType: 'prayer',
      },
      {
        id: 'christ-midday',
        name: 'Midday Re-centering',
        traditionalName: 'Sext / Midday Pause',
        timeWindow: 'Noon',
        description: 'A brief stillness pause in the middle of duties to recall the Beatitudes and release anxiety.',
        practiceType: 'reflection',
      },
      {
        id: 'christ-evening',
        name: 'Evening Gratitude & Compline',
        traditionalName: 'Vespers / Night Prayer',
        timeWindow: 'Dusk to nightfall',
        description: 'Confession of shortcomings, lighting evening lamps, thanksgiving for grace, and peaceful rest.',
        practiceType: 'contemplation',
      },
    ],
    calendar: {
      primarySystem: 'gregorian',
      systemDisplayName: 'Christian Liturgical Calendar (Western & Eastern Seasons)',
      currentEraYear: 'Year of Our Lord 2026',
      astronomicalNotice: 'Liturgical cycles follow the solar year with Easter determined by the first full moon of spring.',
      upcomingObservances: [
        {
          id: 'sunday-resurrection',
          traditionId: 'christianity',
          name: 'Sunday Lord’s Day (Communion & Worship)',
          calendarSystem: 'gregorian',
          dateDisplay: 'Every Sunday',
          beginsAtSunset: false,
          description: 'The weekly celebration of the Resurrection and fellowship at the Table of Grace.',
          spiritualTheme: 'Resurrection Hope & Shared Fellowship',
          internalDiversityNotes: 'Varies from liturgical Eucharist to unprogrammed Quaker silence, acoustic worship, and evangelical preaching.',
        },
        {
          id: 'advent-season',
          traditionId: 'christianity',
          name: 'Advent Season',
          calendarSystem: 'gregorian',
          dateDisplay: 'Four weeks preceding Christmas',
          beginsAtSunset: false,
          description: 'A quiet, expectant season of watching for divine light to pierce worldly darkness.',
          spiritualTheme: 'Hope, Peace, Joy & Love',
          internalDiversityNotes: 'Observed with advent wreath candles across liturgical Protestant and Catholic communions.',
        },
        {
          id: 'easter-resurrection',
          traditionId: 'christianity',
          name: 'The Great Feast of Easter (Pascha)',
          calendarSystem: 'gregorian',
          dateDisplay: 'Spring Equinox Full Moon Tide',
          beginsAtSunset: false,
          description: 'The heart of Christian hope — the triumph of self-giving love over death and suffering.',
          spiritualTheme: 'Victory of Love, Renewal & Eternal Life',
          internalDiversityNotes: 'Eastern Orthodox Christians calculate Pascha using the Julian calendar, often falling 1-5 weeks later.',
        },
      ],
    },
    spatialHeritage: {
      id: 'prayer-corner',
      traditionId: 'christianity',
      systemName: 'Home Prayer Corner & Lectern',
      corePrinciple: 'Cultivating an uncluttered domestic altar that invites quiet contemplation of the Word.',
      gentleGuidance: [
        'Dedicate a simple table or bookshelf with an open Bible, a candle, and a cross or icon.',
        'Position the chair toward a source of natural morning light (the symbolic East).',
        'Keep a journal nearby to record promptings of grace and intercessions for others.',
      ],
      educationalDisclaimer: 'This guidance is an optional devotional suggestion drawn from Christian heritage.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'Grace and peace to you in abundance — welcome to your quiet place of renewal.',
      intentionPromptTemplate: 'Lord, make me an instrument of your peace; where there is hatred, let me sow love...',
      closingBlessing: 'May the peace of God, which surpasses all understanding, guard your heart and mind.',
    },
    ambientProfileDefault: 'contemplative',
    abstractAccentColor: '#8C3B2F', // Traditional warm sanctuary crimson / carnelian
    internalDiversityStatement:
      'Christianity spans vast liturgical, historical, and theological expressions: Protestant, Catholic, Orthodox, Anglican, Anabaptist, Pentecostal, and Quaker. All are treated with equal honor.',
  },

  catholicism: {
    id: 'catholicism',
    traditionName: 'Catholicism',
    family: 'Abrahamic',
    coverageStatus: 'Live',
    orientation: {
      type: 'symbolic_east',
      cardinalDirection: 'East',
      advisoryNote:
        'Historic Catholic tradition faces East (ad orientem), awaiting the coming of Christ; personal home prayer focuses upon the Crucifix and Eucharistic presence.',
    },
    dailyRhythm: [
      {
        id: 'catholic-lauds',
        name: 'Morning Praise',
        traditionalName: 'Lauds (Morning Prayer of the Church)',
        timeWindow: 'Dawn to early morning',
        description: 'Psalms of praise, the Benedictus canticle, and intercessions consecrating the day to Christ.',
        practiceType: 'prayer',
      },
      {
        id: 'catholic-angelus',
        name: 'The Angelus / Midday Pause',
        traditionalName: 'Angelus Domini',
        timeWindow: 'Noon (12:00 PM)',
        description: 'A traditional three-minute bells pause commemorating the Incarnation and Mary’s humble fiat.',
        practiceType: 'prayer',
      },
      {
        id: 'catholic-vespers',
        name: 'Evening Thanksgiving',
        traditionalName: 'Vespers & Compline',
        timeWindow: 'Sunset to bedtime',
        description: 'The Magnificat of Our Lady, examination of conscience, and the Salve Regina for nocturnal protection.',
        practiceType: 'contemplation',
      },
    ],
    calendar: {
      primarySystem: 'gregorian',
      systemDisplayName: 'Roman Catholic Liturgical Calendar',
      currentEraYear: 'Year of Grace 2026',
      astronomicalNotice: 'Liturgical colors transition between White, Green, Violet, Red, and Rose across the seasons.',
      upcomingObservances: [
        {
          id: 'sunday-mass',
          traditionId: 'catholicism',
          name: 'The Holy Mass (Sacrifice & Communion)',
          calendarSystem: 'gregorian',
          dateDisplay: 'Every Sunday & Holy Days of Obligation',
          beginsAtSunset: false,
          description: 'The source and summit of the Christian life, uniting the faithful with Christ in the Holy Eucharist.',
          spiritualTheme: 'Sacramental Communion & Sacrificial Love',
          internalDiversityNotes: 'Celebrated in the Ordinary Form, Eastern Catholic Rites (Byzantine, Maronite, Chaldean), and Latin traditions.',
        },
        {
          id: 'lent-season',
          traditionId: 'catholicism',
          name: 'Lent & Holy Week',
          calendarSystem: 'gregorian',
          dateDisplay: 'Ash Wednesday through Easter Triduum',
          beginsAtSunset: false,
          description: 'Forty days of prayer, fasting, and almsgiving walking the Way of the Cross.',
          spiritualTheme: 'Penitence, Conversion & Divine Mercy',
          internalDiversityNotes: 'Includes the devotion of the Stations of the Cross and Eucharistic Adoration.',
        },
      ],
    },
    spatialHeritage: {
      id: 'catholic-oratory',
      traditionId: 'catholicism',
      systemName: 'Home Oratory & Sacred Hearth',
      corePrinciple: 'Creating a domestic church (Ecclesia domestica) centered on the Real Presence and communion of saints.',
      gentleGuidance: [
        'Adorn your prayer space with a blessed Crucifix, holy water, and an image of the Sacred Heart or Our Lady.',
        'Light a beeswax candle to recall the Light of Christ in the Paschal mystery.',
        'Keep a Rosary and the Roman Missal or Christian Prayer book easily accessible.',
      ],
      educationalDisclaimer: 'Devotional suggestions for domestic prayer according to Catholic liturgical heritage.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'Laudetur Jesus Christus — blessed be God in His angels and in His saints.',
      intentionPromptTemplate: 'O Jesus, through the Immaculate Heart of Mary, I offer you my prayers, works, joys, and sufferings...',
      closingBlessing: 'May the souls of the faithful departed, through the mercy of God, rest in peace.',
    },
    ambientProfileDefault: 'contemplative',
    abstractAccentColor: '#7A2048', // Liturgical amaranth / Marian burgundy
    internalDiversityStatement:
      'Catholicism embraces the Latin Rite alongside 23 Eastern Catholic Churches in full communion, each possessing ancient liturgical and contemplative treasures.',
  },

  'latter-day-saints': {
    id: 'latter-day-saints',
    traditionName: 'Latter-day Saint Tradition',
    family: 'Abrahamic',
    coverageStatus: 'Live',
    orientation: {
      type: 'inward_none',
      cardinalDirection: 'Inward',
      advisoryNote:
        'Latter-day Saint prayer is addressed directly to Heavenly Father in the name of Jesus Christ, without fixed geographic orientation, drawing reverent strength from holy temple covenants.',
    },
    dailyRhythm: [
      {
        id: 'lds-morning',
        name: 'Individual & Family Morning Prayer',
        traditionalName: 'Morning Family Altar',
        timeWindow: 'Morning start of day',
        description: 'Kneeling together or in personal solitude to thank the Father, seek the guidance of the Holy Spirit, and pray for protection.',
        practiceType: 'prayer',
      },
      {
        id: 'lds-scripture',
        name: 'Daily Feast upon the Word',
        traditionalName: 'Come, Follow Me Study',
        timeWindow: 'Any quiet study window',
        description: 'Daily study of the Book of Mormon, Bible, and modern revelation to deepen testimony of the living Christ.',
        practiceType: 'study',
      },
      {
        id: 'lds-evening',
        name: 'Evening Family Prayer & Gratitude',
        traditionalName: 'Evening Devotional',
        timeWindow: 'Before retiring to bed',
        description: 'Closing the day with forgiveness, unified gratitude, and prayers for loved ones and missionaries worldwide.',
        practiceType: 'prayer',
      },
    ],
    calendar: {
      primarySystem: 'gregorian',
      systemDisplayName: 'Restoration Faith Calendar',
      currentEraYear: 'Year 2026',
      astronomicalNotice: 'General Conferences are broadcast globally biannually on the first weekends of April and October.',
      upcomingObservances: [
        {
          id: 'lds-sunday-sabbath',
          traditionId: 'latter-day-saints',
          name: 'Sabbath Day & Sacrament Meeting',
          calendarSystem: 'gregorian',
          dateDisplay: 'Every Sunday',
          beginsAtSunset: false,
          description: 'Partaking of the bread and water in remembrance of the body and blood of the Lord Jesus Christ, renewing sacred baptismal covenants.',
          spiritualTheme: 'Sacrament Renewal & Sabbath Holiness',
          internalDiversityNotes: 'Held in local ward and branch chapels worldwide with lay member leadership.',
        },
        {
          id: 'general-conference',
          traditionId: 'latter-day-saints',
          name: 'Semiannual General Conference',
          calendarSystem: 'gregorian',
          dateDisplay: 'First Weekend of April & October',
          beginsAtSunset: false,
          description: 'Global assembly to receive spiritual counsel, revelation, and testimony from living prophets and apostles.',
          spiritualTheme: 'Living Revelation, Prophecy & Covenant Unity',
          internalDiversityNotes: 'Broadcast in over 90 languages to millions in every continent.',
        },
      ],
    },
    spatialHeritage: {
      id: 'lds-home-sanctuary',
      traditionId: 'latter-day-saints',
      systemName: 'The Home as a Sanctuary of Faith',
      corePrinciple: 'No success can compensate for failure in the home; domestic spaces are sacred grounds for love and gospel learning.',
      gentleGuidance: [
        'Display an image of the Savior Jesus Christ or the Holy Temple in a prominent living area.',
        'Keep the home uncluttered and filled with music, wholesome conversation, and reverent peace.',
        'Establish a consistent spot where the family or individual kneels for daily communion with Heavenly Father.',
      ],
      educationalDisclaimer: 'Cultural and pastoral guidance drawn from Latter-day Saint teachings on home and family.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'Welcome, brother or sister. May the light of Christ brighten your sanctuary today.',
      intentionPromptTemplate: 'Our Dear Heavenly Father, we come before Thee with grateful hearts for the gift of Thy Son...',
      closingBlessing: 'We pray for these blessings humbly, in the sacred name of Jesus Christ, Amen.',
    },
    ambientProfileDefault: 'luminous',
    abstractAccentColor: '#9C7A3C', // Warm temple gold / burnished brass
    internalDiversityStatement:
      'We recognize the broader Restoration movement heritage while faithfully honoring the worldwide Church of Jesus Christ of Latter-day Saints.',
  },

  islam: {
    id: 'islam',
    traditionName: 'Islam',
    family: 'Abrahamic',
    coverageStatus: 'Live',
    orientation: {
      type: 'fixed_point',
      target: {
        name: 'The Holy Kaaba (Al-Masjid al-Haram)',
        latitude: 21.4225,
        longitude: 39.8262,
        city: 'Mecca',
        description: 'The primordial House of God built by Ibrahim (Abraham) and Ismail, the singular focal axis (Qibla) for all Muslim prayer.',
        theologicalSignificance:
          'Qur’an Surah Al-Baqarah 2:144 commands: “Turn then your face in the direction of the sacred Mosque: Wherever you are, turn your faces in that direction.”',
      },
      advisoryNote:
        'Calculated precisely as the Great Circle geodesic azimuth from your location to Mecca. Used for the five daily obligatory prayers (Salah).',
    },
    dailyRhythm: [
      {
        id: 'islam-fajr',
        name: 'Dawn Prayer',
        traditionalName: 'Salāt al-Fajr (صَلَاة الفَجْر)',
        timeWindow: 'From true dawn until just before sunrise',
        description: 'Two units of prayer accompanied by recitation of the Holy Qur’an, awakening with divine remembrance before the world stirs.',
        practiceType: 'prayer',
      },
      {
        id: 'islam-dhuhr',
        name: 'Midday Prayer',
        traditionalName: 'Salāt al-Dhuhr (صَلَاة الظُّهْر)',
        timeWindow: 'After the sun passes its zenith until mid-afternoon',
        description: 'Four units of prayer pausing the midday rush to renew submission to the Creator.',
        practiceType: 'prayer',
      },
      {
        id: 'islam-asr',
        name: 'Late Afternoon Prayer',
        traditionalName: 'Salāt al-ʿAsr (صَلَاة العَصْر)',
        timeWindow: 'Late afternoon until the sky begins to amber',
        description: 'Guarding the middle prayer amid evening fatigue, affirming steadfastness and trust.',
        practiceType: 'prayer',
      },
      {
        id: 'islam-maghrib',
        name: 'Sunset Prayer',
        traditionalName: 'Salāt al-Maghrib (صَلَاة المَغْرِب)',
        timeWindow: 'Immediately after the sun dips below the horizon',
        description: 'Greeting the nightfall with praise and gratitude for the day’s provisions.',
        practiceType: 'prayer',
      },
      {
        id: 'islam-isha',
        name: 'Night Prayer',
        traditionalName: 'Salāt al-ʿIshāʾ (صَلَاة العِشَاء)',
        timeWindow: 'After twilight fades into full night darkness',
        description: 'Final prayer of the day, followed by Witr supplication, surrendering consciousness into God’s safekeeping.',
        practiceType: 'prayer',
      },
    ],
    calendar: {
      primarySystem: 'hijri',
      systemDisplayName: 'Hijri Lunar Calendar (التقويم الهجري)',
      currentEraYear: 'Year 1448 AH',
      astronomicalNotice: 'Days begin at sunset; exact festival dates depend on local crescent moon sightings (Hilāl).',
      upcomingObservances: [
        {
          id: 'jumuah-weekly',
          traditionId: 'islam',
          name: 'Jumu’ah (صلاة الجمعة - Friday Congregation)',
          calendarSystem: 'hijri',
          dateDisplay: 'Every Friday at Midday',
          beginsAtSunset: false,
          description: 'The blessed congregational day of the week, featuring the Khutbah (sermon) and communal prayer.',
          spiritualTheme: 'Communal Unity, Spiritual Purification & Charity',
          internalDiversityNotes: 'Celebrated across Sunni, Shia, and Ibadi traditions with shared veneration for Friday blessings.',
        },
        {
          id: 'ramadan-month',
          traditionId: 'islam',
          name: 'The Blessed Month of Ramadan (شهر رمضان)',
          calendarSystem: 'hijri',
          dateDisplay: 'Month 9 of the Hijri Calendar',
          beginsAtSunset: true,
          description: 'The month in which the Holy Qur’an was revealed; observed with daily dawn-to-dusk fasting (Sawm), charity, and nighttime Taraweeh prayers.',
          spiritualTheme: 'Taqwa (God-Consciousness), Compassion for the Poor & Self-Restraint',
          internalDiversityNotes: 'Concludes with Laylat al-Qadr (Night of Power) and the grand celebration of Eid al-Fitr.',
        },
        {
          id: 'eid-al-adha',
          traditionId: 'islam',
          name: 'Eid al-Adha (عيد الأضحى - Feast of Sacrifice)',
          calendarSystem: 'hijri',
          dateDisplay: '10-13 Dhu al-Hijjah',
          beginsAtSunset: true,
          description: 'Commemorating the devotion of Prophet Ibrahim and marking the completion of the Hajj pilgrimage in Mecca.',
          spiritualTheme: 'Sacrifice, Generosity & Universal Brotherhood',
          internalDiversityNotes: 'Meat from the Qurbani is divided equally among family, neighbors, and those in poverty.',
        },
      ],
    },
    spatialHeritage: {
      id: 'tahara-rug',
      traditionId: 'islam',
      systemName: 'Tahara & Prayer Rug Sanctity',
      corePrinciple: 'Purity of body (Wudu), clothes, and floor as a sacred prerequisite for entering divine presence.',
      gentleGuidance: [
        'Ensure the prayer rug or contemplation area is pristine, clean, and free of dirt.',
        'Face directly toward the Qibla bearing calculated for your coordinates.',
        'Keep the space free from distracting images or loud worldly noises during prayer.',
      ],
      educationalDisclaimer: 'Advisory heritage guidance for maintaining a clean, reverent prayer environment.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'As-salāmu ʿalaykum wa-raḥmatu -llāhi wa-barakātuh — peace and divine mercy be upon you.',
      intentionPromptTemplate: 'Bismillāh ar-Raḥmān ar-Raḥīm... In the name of God, the Most Gracious, the Most Merciful...',
      closingBlessing: 'Al-ḥamdu lillāh — all praise belongs to God, Lord of all the worlds.',
    },
    ambientProfileDefault: 'nature',
    abstractAccentColor: '#286E53', // Deep emerald sanctuary green
    internalDiversityStatement:
      'Islam encompasses deep scholarly diversity across Sunni schools of jurisprudence (Hanafi, Maliki, Shafi’i, Hanbali), Shia traditions (Ja’fari, Zaydi, Ismaili), and contemplative Sufi paths.',
  },

  hinduism: {
    id: 'hinduism',
    traditionName: 'Hinduism (Sanātana Dharma)',
    family: 'Dharmic',
    coverageStatus: 'Live',
    orientation: {
      type: 'cardinal',
      cardinalDirection: 'East',
      advisoryNote:
        'Vastu Shastra and traditional Vedic puja recommend facing East (toward the rising sun, symbol of Surya and awakening) or North (direction of stillness and Dhruva, the pole star).',
    },
    dailyRhythm: [
      {
        id: 'hindu-pratah',
        name: 'Dawn Meditation & Sandhya',
        traditionalName: 'Brahma Muhurta & Pratah Puja',
        timeWindow: 'Brahma Muhurta (1.5 hours before sunrise) to dawn',
        description: 'The golden hour of quiet mind; lighting the diya, chanting the Gayatri Mantra, and offering salutations to the divine light.',
        practiceType: 'puja',
      },
      {
        id: 'hindu-madhyahna',
        name: 'Midday Gratitude',
        traditionalName: 'Madhyahna Sandhya',
        timeWindow: 'Noon',
        description: 'Honoring food as Brahman (Annam Parabrahma Swaroopam) and pausing for gratitude.',
        practiceType: 'reflection',
      },
      {
        id: 'hindu-sayam',
        name: 'Dusk Aarti & Japa',
        traditionalName: 'Sayam Sandhya / Aarti',
        timeWindow: 'Twilight transition at sunset',
        description: 'Kindling the evening lamp, devotional singing (Bhajan), and silent japa meditation counting the sacred names on a mala.',
        practiceType: 'chanting',
      },
    ],
    calendar: {
      primarySystem: 'hindu_panchang',
      systemDisplayName: 'Vedic Lunisolar Panchang (पञ्चाङ्ग)',
      currentEraYear: 'Vikram Samvat 2083 / Saka 1948',
      astronomicalNotice: 'Calculated using lunar Tithis and solar transits (Sankranti); dates shift slightly according to regional calculations.',
      upcomingObservances: [
        {
          id: 'diwali-deepavali',
          traditionId: 'hinduism',
          name: 'Diwali / Deepavali (दीपावली)',
          calendarSystem: 'hindu_panchang',
          dateDisplay: 'Kartika Amavasya (New Moon in Autumn)',
          beginsAtSunset: true,
          description: 'The Festival of Lights celebrating the victory of light over darkness, knowledge over ignorance, and divine righteousness.',
          spiritualTheme: 'Inner Illumination, Prosperity & Generosity',
          internalDiversityNotes: 'Celebrated as Rama’s return to Ayodhya in the North, Krishna’s triumph in the South, and Kali Puja in Bengal.',
        },
        {
          id: 'navaratri',
          traditionId: 'hinduism',
          name: 'Maha Navaratri (नवरात्रि)',
          calendarSystem: 'hindu_panchang',
          dateDisplay: 'Ashwin Shukla Paksha 1-9',
          beginsAtSunset: true,
          description: 'Nine sacred nights venerating the Divine Mother (Durga, Lakshmi, Saraswati) representing courage, wisdom, and benevolence.',
          spiritualTheme: 'Triumph of Divine Shakti over Demonic Egotism',
          internalDiversityNotes: 'Celebrated through Garba dancing in Gujarat, Durga Puja pandals in Bengal, and Golu altars in Tamil Nadu.',
        },
        {
          id: 'maha-shivaratri',
          traditionId: 'hinduism',
          name: 'Maha Shivaratri (महाशिवरात्रि)',
          calendarSystem: 'hindu_panchang',
          dateDisplay: 'Phalguna Krishna Chaturdashi',
          beginsAtSunset: true,
          description: 'The Great Night of Shiva — an all-night vigil of fasting, chanting Om Namah Shivaya, and meditative immersion in transcendental stillness.',
          spiritualTheme: 'Overcoming Ignorance & Dissolving the Ego',
          internalDiversityNotes: 'Observed with sacred bathing of the Shiva Lingam and profound silent meditation across India and the diaspora.',
        },
      ],
    },
    spatialHeritage: {
      id: 'vastu-puja',
      traditionId: 'hinduism',
      systemName: 'Vastu Shastra & The Sacred Home Altar (Mandir)',
      corePrinciple: 'Harmonizing domestic spatial energy with cosmic cardinal directions and the subtle flow of Prana.',
      gentleGuidance: [
        'The Northeast corner (Ishanya) is traditionally considered the most auspicious sanctuary for the home altar.',
        'Face East or North while meditating or offering flowers and incense.',
        'Keep the altar elevated above the waist level and illuminated with a gentle oil lamp (Diya).',
      ],
      educationalDisclaimer: 'Cultural and architectural wisdom from Vedic Vastu heritage. Treated as optional domestic harmony.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'Namaste — I bow to the divine presence within you that is also within all creation.',
      intentionPromptTemplate: 'Om Tat Sat... May all beings be peaceful, may all beings be free from suffering...',
      closingBlessing: 'Om Shanti, Shanti, Shanti — peace in the cosmos, peace in the atmosphere, peace within.',
    },
    ambientProfileDefault: 'nature',
    abstractAccentColor: '#D97326', // Vibrant sacred saffron / terracotta
    internalDiversityStatement:
      'Sanātana Dharma encompasses Vaishnava, Shaiva, Shakta, Smarta, and Vedanta philosophies, respecting monotheistic, pantheistic, and non-dual approaches to the Divine.',
  },

  buddhism: {
    id: 'buddhism',
    traditionName: 'Buddhism',
    family: 'Dharmic',
    coverageStatus: 'Live',
    orientation: {
      type: 'cardinal',
      cardinalDirection: 'East',
      advisoryNote:
        'Buddhist practice does not demand rigid geographic alignment; traditional shrines often face East (symbol of the Buddha’s enlightenment under the Bodhi tree) or toward nature.',
    },
    dailyRhythm: [
      {
        id: 'buddh-morning',
        name: 'Morning Sitting & Chanting',
        traditionalName: 'Morning Shamatha / Vipassana',
        timeWindow: 'Early morning',
        description: 'Settling the mind through breath awareness (Anapanasati), taking refuge in the Three Jewels, and setting intentions for harmlessness.',
        practiceType: 'meditation',
      },
      {
        id: 'buddh-mindful',
        name: 'Mindful Breathing Pauses',
        traditionalName: 'Bell of Mindfulness',
        timeWindow: 'Throughout daily activities',
        description: 'Short three-breath pauses throughout the day returning to the present moment without grasping or aversion.',
        practiceType: 'contemplation',
      },
      {
        id: 'buddh-evening',
        name: 'Evening Metta & Dedication',
        traditionalName: 'Metta Bhavana & Merit Dedication',
        timeWindow: 'Evening before sleep',
        description: 'Cultivating unconditional loving-kindness radiating outward to all sentient beings, dedicating the day’s merits.',
        practiceType: 'meditation',
      },
    ],
    calendar: {
      primarySystem: 'seasonal_solstice',
      systemDisplayName: 'Buddhist Lunar & Uposatha Calendar',
      currentEraYear: 'Buddhist Era 2570',
      astronomicalNotice: 'Uposatha practice days coincide with the New Moon, Full Moon, and quarter moon phases.',
      upcomingObservances: [
        {
          id: 'uposatha-monthly',
          traditionId: 'buddhism',
          name: 'Uposatha Observance Day (Full & New Moon)',
          calendarSystem: 'seasonal_solstice',
          dateDisplay: 'Twice Monthly on Full & New Moons',
          beginsAtSunset: false,
          description: 'A dedicated day for lay practitioners to renew the Five Precepts (or take Eight Precepts), meditate, and hear Dhamma teachings.',
          spiritualTheme: 'Precept Renewal, Mindful Restraint & Stillness',
          internalDiversityNotes: 'Central in Theravada countries like Sri Lanka, Thailand, Myanmar, and Cambodian communities.',
        },
        {
          id: 'vesak-buddha-day',
          traditionId: 'buddhism',
          name: 'Vesak / Visakha Puja (Buddha Day)',
          calendarSystem: 'seasonal_solstice',
          dateDisplay: 'Full Moon of the 6th Lunar Month (May)',
          beginsAtSunset: false,
          description: 'Commemorating the birth, supreme enlightenment (Bodhi), and final passing (Parinirvana) of Gautama Buddha.',
          spiritualTheme: 'Enlightenment, Compassion & Peace',
          internalDiversityNotes: 'Known as Hanamatsuri in Japan, Saga Dawa in Tibet, and Vesak across South and Southeast Asia.',
        },
      ],
    },
    spatialHeritage: {
      id: 'buddhist-shrine',
      traditionId: 'buddhism',
      systemName: 'Home Shrine & Mandala Harmony',
      corePrinciple: 'Simplicity and tranquility that mirror the peaceful state of the awakened mind.',
      gentleGuidance: [
        'Place a serene representation of the Buddha at eye level when seated in meditation.',
        'Offer seven small bowls of pure clean water, representing purity of conduct and generosity without clinging.',
        'Keep the seating cushion (zafu) in a quiet alcove with gentle airflow and soft ambient lighting.',
      ],
      educationalDisclaimer: 'Reflective guidance for cultivating an inspiring, calm meditation corner.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'May you be peaceful, may you be healthy, may you be safe from harm.',
      intentionPromptTemplate: 'I take refuge in the Buddha (the Awakened One), the Dhamma (the Truth), and the Sangha (the Community)...',
      closingBlessing: 'Sabbe satta sukhi hontu — May all living beings everywhere be happy, peaceful, and liberated.',
    },
    ambientProfileDefault: 'contemplative',
    abstractAccentColor: '#8E5A84', // Mindful plum / lotus lavender
    internalDiversityStatement:
      'Buddhism spans Theravada, Mahayana (Zen, Pure Land, Nichiren), and Vajrayana (Tibetan traditions), uniting non-theistic mindfulness with boundless compassion.',
  },

  sikhism: {
    id: 'sikhism',
    traditionName: 'Sikhism (Sikhi)',
    family: 'Dharmic',
    coverageStatus: 'Live',
    orientation: {
      type: 'inward_none',
      cardinalDirection: 'All',
      advisoryNote:
        'Guru Nanak taught that Waheguru resides in all directions equally. Sikh prayer requires no physical directional orientation, focusing upon the living Word (Shabad Guru).',
    },
    dailyRhythm: [
      {
        id: 'sikh-amrit-vela',
        name: 'The Ambrossial Hours',
        traditionalName: 'Amrit Vela (ਅੰਮ੍ਰਿਤ ਵੇਲਾ)',
        timeWindow: 'Pre-dawn (3:00 AM – 6:00 AM)',
        description: 'Bathing, meditating upon the Divine Name (Naam Simran), and reciting the morning banis (Japji Sahib, Jaap Sahib, Tav-Prasad Savaiye).',
        practiceType: 'prayer',
      },
      {
        id: 'sikh-rehras',
        name: 'Sunset Prayers',
        traditionalName: 'Rehras Sahib (ਰਹਿਰਾਸ ਸਾਹਿਬ)',
        timeWindow: 'Sunset',
        description: 'Recited at the close of day to dispel exhaustion, thank the Creator, and fill the mind with peace.',
        practiceType: 'prayer',
      },
      {
        id: 'sikh-sohila',
        name: 'Bedtime Hymn of Peace',
        traditionalName: 'Kirtan Sohila (ਕੀਰਤਨ ਸੋਹਿਲਾ)',
        timeWindow: 'Immediately before sleep',
        description: 'The final night prayer shielding the mind from fear and uniting the soul with the divine beloved.',
        practiceType: 'chanting',
      },
    ],
    calendar: {
      primarySystem: 'nanakshahi',
      systemDisplayName: 'Nanakshahi Solar Calendar (ਨਾਨਕਸ਼ਾਹੀ)',
      currentEraYear: 'Year 558 Nanakshahi',
      astronomicalNotice: 'Commemorates the Gurpurabs (birth and Guruship anniversaries of the Ten Gurus) and historic Sikh events.',
      upcomingObservances: [
        {
          id: 'vaisakhi',
          traditionId: 'sikhism',
          name: 'Vaisakhi (Khalsa Day - ਵਿਸਾਖੀ)',
          calendarSystem: 'nanakshahi',
          dateDisplay: 'April 14 (Fixed Nanakshahi)',
          beginsAtSunset: false,
          description: 'Commemorating the creation of the Khalsa Panth by Guru Gobind Singh Ji in 1699, inaugurating a lineage of saint-soldiers.',
          spiritualTheme: 'Courage, Equality, Sovereignty & Divine Justice',
          internalDiversityNotes: 'Celebrated with Nagar Kirtan processions, Gatka martial demonstrations, and open community Langar.',
        },
        {
          id: 'guru-nanak-gurpurab',
          traditionId: 'sikhism',
          name: 'Prakash Utsav Guru Nanak Dev Ji',
          calendarSystem: 'nanakshahi',
          dateDisplay: 'Kattak Puranmashi (Autumn Full Moon)',
          beginsAtSunset: false,
          description: 'The birth celebration of Guru Nanak, founder of Sikhi, who proclaimed the oneness of humanity and universal brotherhood.',
          spiritualTheme: 'Universal Compassion, Truth & Humility',
          internalDiversityNotes: 'Marked by 48-hour continuous reading of the Guru Granth Sahib (Akhand Path) in Gurdwaras worldwide.',
        },
      ],
    },
    spatialHeritage: {
      id: 'sikh-space',
      traditionId: 'sikhism',
      systemName: 'The Sanctity of Sangat & Langar',
      corePrinciple: 'Divine presence in egalitarian gathering; no human ranking or ritual hierarchy.',
      gentleGuidance: [
        'Keep the home study area clean, covering the head with a Rumāl or Dastar out of reverence during scripture reading.',
        'Treat sacred texts (Senchiya / Gutka Sahib) with utmost respect, wrapping them in clean cloth on an elevated surface.',
        'Cultivate hospitality by sharing food (Langar principles) with any traveler who crosses the threshold.',
      ],
      educationalDisclaimer: 'Historical and communal guidance rooted in Sikh teachings on equality and reverent devotion.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh — the Khalsa belongs to God, victory belongs to God.',
      intentionPromptTemplate: 'Ik Onkar Satnam Karta Purakh... One Universal Creator, Whose Name is Truth, the Creative Being...',
      closingBlessing: 'Nanak Naam Chardi Kala, Tere Bhane Sarbat Da Bhala — May the Divine Name forever elevate us; in Your Will, may there be blessing for all.',
    },
    ambientProfileDefault: 'study',
    abstractAccentColor: '#2D4E82', // Royal Sikh blue (Neela)
    internalDiversityStatement:
      'Sikhi strictly rejects caste, gender inequality, and superstitious ritualism, welcoming seekers of all backgrounds without distinction.',
  },

  'bahai': {
    id: 'bahai',
    traditionName: 'Bahá\'í Faith',
    family: 'Abrahamic',
    coverageStatus: 'Live',
    orientation: {
      type: 'fixed_point',
      target: {
        name: 'The Shrine of Bahá’u’lláh (Bahjí)',
        latitude: 32.9436,
        longitude: 35.0924,
        city: 'Acre (Akka)',
        description: 'The resting place of Bahá’u’lláh, Prophet-Founder of the Bahá’í Faith, designated as the Qiblih for daily obligatory prayer.',
        theologicalSignificance:
          'In the Kitáb-i-Aqdas, Bahá’u’lláh designates His resting place as the Point of Adoration toward which the faithful face when reciting obligatory prayer.',
      },
      advisoryNote: 'Used specifically during the recitation of the daily Obligatory Prayer (Short, Medium, or Long).',
    },
    dailyRhythm: [
      {
        id: 'bahai-obligatory',
        name: 'Daily Obligatory Prayer',
        traditionalName: 'Short, Medium, or Long Obligatory Prayer',
        timeWindow: 'Short prayer: Between noon and sunset',
        description: 'Personal communion affirming human servitude and the majesty of God, recited facing the Qiblih.',
        practiceType: 'prayer',
      },
      {
        id: 'bahai-95',
        name: 'Remembrance of God (95 Times)',
        traditionalName: 'Recitation of Alláh-u-Abhá',
        timeWindow: 'Any quiet daily window',
        description: 'Repeating the Greatest Name (God is Most Glorious) 95 times in 24 hours after ablutions.',
        practiceType: 'chanting',
      },
    ],
    calendar: {
      primarySystem: 'bahai_badi',
      systemDisplayName: 'Badí‘ Solar Calendar (تقويم بديع)',
      currentEraYear: 'Year 183 Bahá’í Era',
      astronomicalNotice: 'Consists of 19 months of 19 days each, with 4-5 Intercalary Days (Ayyám-i-Há). Year begins at Naw-Rúz (Spring Equinox).',
      upcomingObservances: [
        {
          id: 'naw-ruz',
          traditionId: 'bahai',
          name: 'Naw-Rúz (Bahá’í New Year)',
          calendarSystem: 'bahai_badi',
          dateDisplay: 'Spring Equinox (March 20/21)',
          beginsAtSunset: true,
          description: 'The celebration of spiritual springtime and renewal concluding the nineteen-day fasting period.',
          spiritualTheme: 'Spiritual Springtime, Joy & Fellowship',
          internalDiversityNotes: 'Celebrated with readings, music, and joyful community meals worldwide.',
        },
        {
          id: 'ridvan',
          traditionId: 'bahai',
          name: 'The Most Great Festival of Ridván',
          calendarSystem: 'bahai_badi',
          dateDisplay: 'April 21 – May 2 (12 Days)',
          beginsAtSunset: true,
          description: 'Commemorating Bahá’u’lláh’s public declaration of His mission in the Garden of Ridván in Baghdad (1863).',
          spiritualTheme: 'The King of Festivals & Unity of Humankind',
          internalDiversityNotes: 'The 1st, 9th, and 12th days are observed as holy days of rest from work.',
        },
      ],
    },
    spatialHeritage: {
      id: 'bahai-space',
      traditionId: 'bahai',
      systemName: 'Sanctuary of Cleanliness and Light',
      corePrinciple: 'Radiant cleanliness, exquisite refinement, and openness to all seekers.',
      gentleGuidance: [
        'Cultivate an uncluttered sanctuary space bathed in natural light and fresh air.',
        'Display the symbol of the Greatest Name or the Nine-Pointed Star in a reverent location.',
        'Keep the space welcoming for unified consultation and collective interfaith prayer gatherings.',
      ],
      educationalDisclaimer: 'Inspirational guidance based on Bahá’í teachings regarding beauty, consultation, and cleanliness.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'Alláh-u-Abhá — may the glory of God shine upon your thoughts and deeds today.',
      intentionPromptTemplate: 'I bear witness, O my God, that Thou hast created me to know Thee and to worship Thee...',
      closingBlessing: 'Blessed is the spot, and the house, and the place, and the city, and the heart where mention of God hath been made.',
    },
    ambientProfileDefault: 'luminous',
    abstractAccentColor: '#2B7A78', // Radiant teal / ocean sanctuary
    internalDiversityStatement:
      'The Bahá’í Faith emphasizes the fundamental unity of all world religions, viewing them as chapters in an ongoing divine education of humankind.',
  },

  'spiritualism-spiritism': {
    id: 'spiritualism-spiritism',
    traditionName: 'Spiritualism & Spiritism',
    family: 'Spiritualism & Esoteric',
    coverageStatus: 'Live',
    orientation: {
      type: 'inward_none',
      cardinalDirection: 'Inward',
      advisoryNote:
        'Spiritualism and Spiritism (Kardecist) emphasize inner attunement, moral elevation, and mental vibration rather than physical compass directions.',
    },
    dailyRhythm: [
      {
        id: 'spirit-morning',
        name: 'Morning Attunement',
        traditionalName: 'Prayer of the Guardian Angel',
        timeWindow: 'Upon waking',
        description: 'A quiet prayer requesting inspiration from spirit benefactors and guardian spirits to act with patience, kindness, and moral courage.',
        practiceType: 'prayer',
      },
      {
        id: 'spirit-gospel-home',
        name: 'Gospel at Home',
        traditionalName: 'Evangelho no Lar',
        timeWindow: 'Weekly designated hour',
        description: 'Family or solitary study of The Gospel According to Spiritism, blessing the atmosphere of the home.',
        practiceType: 'study',
      },
      {
        id: 'spirit-evening',
        name: 'Evening Moral Review',
        traditionalName: 'Examination of Conscience',
        timeWindow: 'Before sleep',
        description: 'Saint Augustine’s practice: reflecting on the day’s deeds, asking if anyone was hurt, and striving to be better tomorrow.',
        practiceType: 'contemplation',
      },
    ],
    calendar: {
      primarySystem: 'gregorian',
      systemDisplayName: 'Spiritist Memorial & Commemorative Dates',
      currentEraYear: 'Year 2026',
      upcomingObservances: [
        {
          id: 'spirits-book-day',
          traditionId: 'spiritualism-spiritism',
          name: 'The Spirits’ Book Anniversary',
          calendarSystem: 'gregorian',
          dateDisplay: 'April 18',
          beginsAtSunset: false,
          description: 'Commemorates the publication of The Spirits’ Book by Allan Kardec in Paris (1857), establishing the philosophical foundation of Spiritism.',
          spiritualTheme: 'Immortality of the Soul, Reincarnation & Moral Progress',
          internalDiversityNotes: 'Widely observed throughout Brazil, Portugal, France, and international Spiritist centers.',
        },
      ],
    },
    spatialHeritage: {
      id: 'spiritist-fluid',
      traditionId: 'spiritualism-spiritism',
      systemName: 'Harmonious Fluidic Atmosphere',
      corePrinciple: 'Cultivating a high spiritual vibration in the home through charity, constructive words, and unselfish thoughts.',
      gentleGuidance: [
        'Keep a glass of pure drinking water covered on your table during prayer, asking spirit benefactors to energize it with spiritual fluids.',
        'Maintain a peaceful environment free from arguments, vulgarity, or pessimistic discourse.',
        'Keep uplifting literature nearby to re-align thoughts whenever grief or agitation arises.',
      ],
      educationalDisclaimer: 'Educational reflection based on Spiritist codification and mediumship ethics.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'Peace and light to your spirit. May good benefactors guide your thoughts toward charity and moral progress.',
      intentionPromptTemplate: 'Lord God, permit good spirits to assist me in my weaknesses, that I may overcome selfish instincts...',
      closingBlessing: 'Outside of charity, there is no salvation. Go in peace, surrounded by the consoling light of truth.',
    },
    ambientProfileDefault: 'luminous',
    abstractAccentColor: '#4A6B82', // Serene celestial slate / ethereal mist
    internalDiversityStatement:
      'We treat Spiritism (Allan Kardec codification) and modern Spiritualism with scholarly seriousness, emphasizing ethical mediumship, continuity of consciousness, and consolation.',
  },

  'celtic-indigenous': {
    id: 'celtic-indigenous',
    traditionName: 'Celtic & Indigenous Traditions',
    family: 'Indigenous & Earth-Honoring',
    coverageStatus: 'Live',
    orientation: {
      type: 'cardinal',
      cardinalDirection: 'All',
      advisoryNote:
        'Reverence for the Four Sacred Directions (East, South, West, North) together with Above (Sky), Below (Mother Earth), and Within (The Heart).',
    },
    dailyRhythm: [
      {
        id: 'earth-dawn',
        name: 'Greeting the Dawn',
        traditionalName: 'Morning Offering to the Quarters',
        timeWindow: 'Sunrise',
        description: 'Facing the dawn sky, thanking the Earth for sustenance, and acknowledging kinship with birds, trees, water, and stones.',
        practiceType: 'contemplation',
      },
      {
        id: 'earth-dusk',
        name: 'Sunset Hearth Lighting',
        traditionalName: 'Smooring the Hearth / Evening Gratitude',
        timeWindow: 'Dusk',
        description: 'Tending the hearth fire or lighting an evening candle, honoring ancestors and releasing the day’s weariness into the cool earth.',
        practiceType: 'prayer',
      },
    ],
    calendar: {
      primarySystem: 'seasonal_solstice',
      systemDisplayName: 'The Wheel of the Year & Earth Seasons',
      currentEraYear: 'Perennial Earth Cycle',
      astronomicalNotice: 'Governed by the solstices, equinoxes, and cross-quarter transitions between the seasons.',
      upcomingObservances: [
        {
          id: 'spring-equinox',
          traditionId: 'celtic-indigenous',
          name: 'Spring Equinox (Alban Eilir / Ostara)',
          calendarSystem: 'seasonal_solstice',
          dateDisplay: 'Around March 20–21',
          beginsAtSunset: false,
          description: 'The day of equal balance between light and dark; the awakening of seed, sap, and migratory birds.',
          spiritualTheme: 'Equilibrium, Emergence & Vitality',
          internalDiversityNotes: 'Celebrated across Celtic reconstructive and nature-centered paths with clean water blessings.',
        },
        {
          id: 'autumn-equinox',
          traditionId: 'celtic-indigenous',
          name: 'Autumn Equinox (Alban Elfed / Mabon)',
          calendarSystem: 'seasonal_solstice',
          dateDisplay: 'Around September 21–23',
          beginsAtSunset: false,
          description: 'The second harvest festival; balancing thanksgiving for food and shelter as the earth prepares for restful slumber.',
          spiritualTheme: 'Harvest Gratitude, Balance & Preparation',
          internalDiversityNotes: 'Observed with feast offerings to local wildlife, trees, and land spirits.',
        },
      ],
    },
    spatialHeritage: {
      id: 'sacred-hearth-earth',
      traditionId: 'celtic-indigenous',
      systemName: 'The Living Hearth & Sacred Well',
      corePrinciple: 'Honoring the three realms of Land, Sea, and Sky through simple, unpretentious natural tokens.',
      gentleGuidance: [
        'Collect natural items with permission and reverence: a river stone, a fallen acorn, or a bowl of well water.',
        'Maintain a hearth candle as a focal point for stillness and ancestor remembrance.',
        'Step outdoors barefoot onto the soil whenever possible to ground your body and clear scattered thoughts.',
      ],
      educationalDisclaimer: 'Non-appropriative cultural and seasonal reflections celebrating kinship with nature and ancestral memory.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'Blessed be your footsteps upon the living earth. Welcome to this sacred circle.',
      intentionPromptTemplate: 'O ancient Mother Earth and deep Father Sky, grant me the patience of the stone and the resilience of the oak...',
      closingBlessing: 'Deep peace of the running wave to you. Deep peace of the flowing air to you. Deep peace of the quiet earth to you.',
    },
    ambientProfileDefault: 'nature',
    abstractAccentColor: '#4A6B3D', // Ancient moss green / highland lichen
    internalDiversityStatement:
      'Indigenous traditions are deeply nation-, language-, and land-specific. We present humble, non-generic seasonal observations and strongly discourage commercial or superficial appropriation.',
  },

  'interfaith-exploring': {
    id: 'interfaith-exploring',
    traditionName: 'Exploring & Interfaith Contemplation',
    family: 'Universal, Interfaith & Contemplative',
    coverageStatus: 'Live',
    orientation: {
      type: 'inward_none',
      cardinalDirection: 'Inward',
      advisoryNote:
        'The sacred orientation is the inner sanctuary of the heart. All directions and all traditions are respected as facets of the one luminous truth.',
    },
    dailyRhythm: [
      {
        id: 'univ-morning',
        name: 'Morning Stillness & Compassion',
        traditionalName: 'Centering the Living Hearth',
        timeWindow: 'Dawn / Start of day',
        description: 'Breathing in silence, letting go of prejudice and anxiety, and cultivating goodwill for all travelers on the way.',
        practiceType: 'meditation',
      },
      {
        id: 'univ-evening',
        name: 'Evening Reflection & Gratitude',
        traditionalName: 'Review of the Shared Light',
        timeWindow: 'Dusk / Before sleep',
        description: 'Acknowledging moments of insight, compassion, and shared humanity experienced throughout the day.',
        practiceType: 'contemplation',
      },
    ],
    calendar: {
      primarySystem: 'gregorian',
      systemDisplayName: 'Global Interfaith & Shared Wisdom Calendar',
      currentEraYear: 'Year 2026',
      upcomingObservances: [
        {
          id: 'world-interfaith-harmony',
          traditionId: 'interfaith-exploring',
          name: 'World Interfaith Harmony Week',
          calendarSystem: 'gregorian',
          dateDisplay: 'First Week of February',
          beginsAtSunset: false,
          description: 'A global United Nations observance encouraging love of the Divine and love of neighbor across all traditions without exception.',
          spiritualTheme: 'Universal Hospitality, Mutual Dignity & Peace',
          internalDiversityNotes: 'Celebrated by faith communities, academic centers, and solitary pilgrims globally.',
        },
      ],
    },
    spatialHeritage: {
      id: 'universal-hearth-space',
      traditionId: 'interfaith-exploring',
      systemName: 'The Living Hearth Sanctuary Center',
      corePrinciple: 'A welcoming refuge free of sectarian division, commercial clutter, or competitive scoring.',
      gentleGuidance: [
        'Cultivate a quiet corner with comfortable seating, a soft warm light, and a personal journal.',
        'Keep comparative wisdom texts from diverse traditions side-by-side on your shelf.',
        'Ensure the space remains free of phones, alarms, and urgent work deadlines during intention time.',
      ],
      educationalDisclaimer: 'Universal contemplative design principles for personal domestic sanctuaries.',
    },
    toneAndLanguage: {
      greetingAffirmation: 'Welcome, traveler. No matter where you come from or what you believe, your presence here is honored.',
      intentionPromptTemplate: 'In stillness, I remember the sacred thread that binds all living things together...',
      closingBlessing: 'May light, understanding, and peace dwell in your home and within your heart.',
    },
    ambientProfileDefault: 'interfaith',
    abstractAccentColor: '#C47A47', // Hearth ember gold
    internalDiversityStatement:
      'We welcome seekers, pilgrims who hold multiple heritage traditions, and those exploring sacred wisdom with an open and respectful heart.',
  },
};

/**
 * Resolves a tradition string (e.g. from userProfile.primaryTradition)
 * into its matching TraditionPersonalizationProfile.
 */
export function getTraditionPersonalizationProfile(
  traditionName?: string
): TraditionPersonalizationProfile {
  if (!traditionName) {
    return TRADITION_PERSONALIZATION_PROFILES['interfaith-exploring'];
  }
  const s = traditionName.toLowerCase();

  if (s.includes('juda')) return TRADITION_PERSONALIZATION_PROFILES.judaism;
  if (s.includes('catholic')) return TRADITION_PERSONALIZATION_PROFILES.catholicism;
  if (s.includes('latter-day') || s.includes('mormon') || s.includes('lds')) {
    return TRADITION_PERSONALIZATION_PROFILES['latter-day-saints'];
  }
  if (s.includes('christian')) return TRADITION_PERSONALIZATION_PROFILES.christianity;
  if (s.includes('islam') || s.includes('muslim') || s.includes('sufi')) {
    return TRADITION_PERSONALIZATION_PROFILES.islam;
  }
  if (s.includes('hindu') || s.includes('vedan')) return TRADITION_PERSONALIZATION_PROFILES.hinduism;
  if (s.includes('buddh') || s.includes('dharma')) return TRADITION_PERSONALIZATION_PROFILES.buddhism;
  if (s.includes('sikh')) return TRADITION_PERSONALIZATION_PROFILES.sikhism;
  if (s.includes('bahai') || s.includes('bahá')) return TRADITION_PERSONALIZATION_PROFILES['bahai'];
  if (s.includes('spirit')) return TRADITION_PERSONALIZATION_PROFILES['spiritualism-spiritism'];
  if (s.includes('celtic') || s.includes('indigenous') || s.includes('earth')) {
    return TRADITION_PERSONALIZATION_PROFILES['celtic-indigenous'];
  }

  // Default to universal interfaith exploring profile
  return TRADITION_PERSONALIZATION_PROFILES['interfaith-exploring'];
}

/**
 * Helper to fetch all upcoming observances across all opted-in calendars
 */
export function getUpcomingObservancesForCalendars(
  activeSystems: CalendarSystemType[]
): SacredObservance[] {
  const all: SacredObservance[] = [];
  const seenIds = new Set<string>();

  Object.values(TRADITION_PERSONALIZATION_PROFILES).forEach((profile) => {
    profile.calendar.upcomingObservances.forEach((obs) => {
      if (activeSystems.includes(obs.calendarSystem) && !seenIds.has(obs.id)) {
        seenIds.add(obs.id);
        all.push(obs);
      }
    });
  });

  return all;
}
