import type { LanguageCode, LanguageConfig, SacredGlossaryTerm } from '../types';

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    scriptFamily: 'Latin',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
    scriptFamily: 'Latin',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    dir: 'ltr',
    scriptFamily: 'Latin',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    scriptFamily: 'Arabic (RTL)',
  },
  {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עִבְרִית',
    dir: 'rtl',
    scriptFamily: 'Hebrew (RTL)',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    scriptFamily: 'Devanagari',
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    dir: 'ltr',
    scriptFamily: 'Han',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    scriptFamily: 'Latin',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    dir: 'ltr',
    scriptFamily: 'Kanji / Kana',
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    dir: 'ltr',
    scriptFamily: 'Latin',
  },
];

export const SACRED_GLOSSARY: Record<string, SacredGlossaryTerm> = {
  tawhid: {
    term: 'Tawhid',
    originalScript: 'تَوْحِيد',
    transliteration: 'Tawḥīd',
    tradition: 'Islam',
    gloss: 'Indivisible Divine Oneness',
    scholarlyNotes: 'The absolute monotheistic foundation of Islam; not translated simply as "monotheism" to preserve the active affirmation of God’s unique unity.',
  },
  hesed: {
    term: 'Hesed',
    originalScript: 'חֶסֶד',
    transliteration: 'Ḥesed',
    tradition: 'Judaism',
    gloss: 'Covenantal Loving-Kindness',
    scholarlyNotes: 'Enduring benevolence and loyalty beyond legal obligation; transcends simple "mercy".',
  },
  karuna: {
    term: 'Karunā',
    originalScript: 'करुणा',
    transliteration: 'Karuṇā',
    tradition: 'Buddhism & Hinduism',
    gloss: 'Universal Compassionate Resonance',
    scholarlyNotes: 'The trembling of the tender heart in response to the suffering of all sentient beings.',
  },
  agape: {
    term: 'Agape',
    originalScript: 'ἀγάπη',
    transliteration: 'Agápē',
    tradition: 'Christianity',
    gloss: 'Unconditional Self-Giving Love',
    scholarlyNotes: 'Distinguished from eros (romantic) or philia (friendship); sacrificial divine goodwill.',
  },
  anatta: {
    term: 'Anatta / Anatman',
    originalScript: 'अनात्मन् / अनत्त',
    transliteration: 'Anattā',
    tradition: 'Buddhism',
    gloss: 'Non-Self / Insentience of Fixed Ego',
    scholarlyNotes: 'The core teaching that no permanent, unchanging soul exists independently.',
  },
  moksha: {
    term: 'Moksha',
    originalScript: 'मोक्ष',
    transliteration: 'Mokṣa',
    tradition: 'Hinduism & Jainism',
    gloss: 'Spiritual Liberation / Release',
    scholarlyNotes: 'Emancipation from the cycle of samsara (rebirth and suffering).',
  },
  perispirit: {
    term: 'Perispirit',
    originalScript: 'Périsprit',
    transliteration: 'Perispírito',
    tradition: 'Spiritism (Kardecist)',
    gloss: 'Subtle Fluidic Envelope of the Soul',
    scholarlyNotes: 'The semi-material intermediary link connecting the immaterial spirit to the physical body.',
  },
  orisha: {
    term: 'Orisha',
    originalScript: 'Òrìṣà',
    transliteration: 'Òrìṣà',
    tradition: 'Yoruba & Diaspora',
    gloss: 'Emissary of the Divine / Sacred Spirit',
    scholarlyNotes: 'Spiritual beings reflecting the divine attributes of Olodumare.',
  },
  shekhinah: {
    term: 'Shekhinah',
    originalScript: 'שְׁכִינָה',
    transliteration: 'Shekhīnah',
    tradition: 'Judaism',
    gloss: 'Divine Indwelling Presence',
    scholarlyNotes: 'The feminine aspect of the divine presence residing among humanity.',
  },
  mitakuye_oyasin: {
    term: 'Mitakuye Oyasin',
    transliteration: 'Mitákuye Oyásʼiŋ',
    tradition: 'Lakota / Indigenous',
    gloss: 'All My Relations / Universal Kinship',
    scholarlyNotes: 'A prayer affirmation of the interconnected sacredness of all living creatures.',
  },
};

// Localized UI dictionary
export const UI_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    appTitle: 'The Living Hearth',
    sanctuarySubtitle: 'Sacred Sanctuary',
    navDashboard: 'Dashboard',
    navRooms: 'Rooms',
    navPray: 'Pray',
    navLearn: 'Learn',
    navProfile: 'Profile',
    todayLight: 'Today’s Light & Focus',
    offerIntention: 'Offer an Intention',
    privateJournal: 'Private Journal',
    sendToPerson: 'Send to a Person',
    offerToRoom: 'Offer to a Room',
    moderatedCircles: 'Moderated Circles of Faith & Study',
    scholarlyWisdom: 'Scholarly Wisdom Pathways',
    leaveOutNoneMandate: 'Maximal Inclusivity Mandate (“Leave Out None”)',
    livingInventoryTab: 'Living Inventory • Leave Out None',
    curatedPathsTab: 'Curated Paths',
    ambientSoundLabel: 'Ambient Sound Sanctuary',
    translatedNotice: 'This reflection was translated into your language. Tap to see original.',
    seeOriginal: 'See original',
    seeTranslation: 'See translation',
    audioMutedNotice: 'Ambient sound is optional and can be turned off at any time.',
  },
  es: {
    appTitle: 'El Hogar Viviente',
    sanctuarySubtitle: 'Santuario Sagrado',
    navDashboard: 'Panel',
    navRooms: 'Círculos',
    navPray: 'Rezar',
    navLearn: 'Aprender',
    navProfile: 'Perfil',
    todayLight: 'Luz y Enfoque de Hoy',
    offerIntention: 'Ofrecer una Intención',
    privateJournal: 'Diario Privado',
    sendToPerson: 'Enviar a una Persona',
    offerToRoom: 'Ofrecer a un Círculo',
    moderatedCircles: 'Círculos Moderados de Fe y Estudio',
    scholarlyWisdom: 'Senderos de Sabiduría Académica',
    leaveOutNoneMandate: 'Mandato de Máxima Inclusión («No Omitir Ninguna»)',
    livingInventoryTab: 'Inventario Vivo • Sin Exclusiones',
    curatedPathsTab: 'Senderos Seleccionados',
    ambientSoundLabel: 'Santuario de Sonido Ambiental',
    translatedNotice: 'Esta reflexión fue traducida a su idioma. Toque para ver el original.',
    seeOriginal: 'Ver original',
    seeTranslation: 'Ver traducción',
    audioMutedNotice: 'El sonido ambiental es opcional y se puede desactivar en cualquier momento.',
  },
  pt: {
    appTitle: 'O Lar Vivente',
    sanctuarySubtitle: 'Santuário Sagrado',
    navDashboard: 'Painel',
    navRooms: 'Círculos',
    navPray: 'Orar',
    navLearn: 'Aprender',
    navProfile: 'Perfil',
    todayLight: 'Luz e Foco de Hoje',
    offerIntention: 'Oferecer uma Intenção',
    privateJournal: 'Diário Privado',
    sendToPerson: 'Enviar a uma Pessoa',
    offerToRoom: 'Oferecer a uma Sala',
    moderatedCircles: 'Círculos Moderados de Fé e Estudo',
    scholarlyWisdom: 'Caminhos de Sabedoria Acadêmica',
    leaveOutNoneMandate: 'Mandato de Inclusão Máxima («Nenhum de Fora»)',
    livingInventoryTab: 'Inventário Vivo • Todos Bem-Vindos',
    curatedPathsTab: 'Trilhas Curadas',
    ambientSoundLabel: 'Santuário de Som Ambiente',
    translatedNotice: 'Esta reflexão foi traduzida para o seu idioma. Toque para ver o original.',
    seeOriginal: 'Ver original',
    seeTranslation: 'Ver tradução',
    audioMutedNotice: 'O som ambiente é opcional e pode ser desativado a qualquer momento.',
  },
  ar: {
    appTitle: 'الموقد الحي',
    sanctuarySubtitle: 'ملاذ مقدس',
    navDashboard: 'لوحة التأمل',
    navRooms: 'الحلقات',
    navPray: 'صلاة ودعاء',
    navLearn: 'تعلم وبحث',
    navProfile: 'الملف والخصوصية',
    todayLight: 'نور اليوم وتأمله',
    offerIntention: 'تقديم نية ودعاء',
    privateJournal: 'يوميات سرية خاصة',
    sendToPerson: 'إرسال لشخص (بموافقة)',
    offerToRoom: 'مشاركة في حلقة مقدسة',
    moderatedCircles: 'حلقات مباركة للدراسة والإيمان',
    scholarlyWisdom: 'مسارات الحكمة الأكاديمية',
    leaveOutNoneMandate: 'مبدأ الشمولية الأقصى («لا استثناء لأي تقليد»)',
    livingInventoryTab: 'سجل التقاليد الحي • بلا إقصاء',
    curatedPathsTab: 'المسارات الأكاديمية',
    ambientSoundLabel: 'الصوت المحيط الهادئ',
    translatedNotice: 'تمت ترجمة هذه الرسالة إلى لغتك. انقر لرؤية الأصل.',
    seeOriginal: 'عرض النص الأصلي',
    seeTranslation: 'عرض الترجمة',
    audioMutedNotice: 'الصوت المحيطي اختياري تمامًا ويمكن إيقافه في أي وقت.',
  },
  he: {
    appTitle: 'האח החיה',
    sanctuarySubtitle: 'מקדש קדוש',
    navDashboard: 'לוח אישי',
    navRooms: 'מעגלים',
    navPray: 'תפילה וכוונה',
    navLearn: 'לימוד',
    navProfile: 'פרופיל ובטיחות',
    todayLight: 'אור היום והתכוונות',
    offerIntention: 'הצעת כוונה',
    privateJournal: 'יומן אישי מוצפן',
    sendToPerson: 'שליחה לאדם (בהסכמה)',
    offerToRoom: 'הצעה למעגל',
    moderatedCircles: 'מעגלי לימוד ואמונה מונחים',
    scholarlyWisdom: 'נתיבי חכמה מלומדת',
    leaveOutNoneMandate: 'עקרון ההכלה המלאה («לא להשאיר אף מסורת בחוץ»)',
    livingInventoryTab: 'מצאי חי של מסורות',
    curatedPathsTab: 'נתיבים נבחרים',
    ambientSoundLabel: 'צליל אווירה מרגיע',
    translatedNotice: 'הודעה זו תורגמה לשפתך. לחץ כדי לראות את המקור.',
    seeOriginal: 'הצג מקור',
    seeTranslation: 'הצג תרגום',
    audioMutedNotice: 'צליל האווירה הוא אופציונלי וניתן לכיבוי בכל עת.',
  },
  hi: {
    appTitle: 'द लिविंग हर्थ',
    sanctuarySubtitle: 'पवित्र आध्यात्मिक शरण',
    navDashboard: 'डैशबोर्ड',
    navRooms: 'सत्संग कक्ष',
    navPray: 'प्रार्थना व संकल्प',
    navLearn: 'ज्ञान पथ',
    navProfile: 'सुरक्षा व प्रोफ़ाइल',
    todayLight: 'आज का पावन प्रकाश',
    offerIntention: 'एक पावन संकल्प अर्पित करें',
    privateJournal: 'निजी साधना डायरी',
    sendToPerson: 'सहमति से मित्र को भेजें',
    offerToRoom: 'कक्ष में अर्पित करें',
    moderatedCircles: 'संयम और अध्ययन के पावन मंडल',
    scholarlyWisdom: 'विद्वत्तापूर्ण ज्ञान मार्ग',
    leaveOutNoneMandate: 'सार्वभौमिक समावेशिता संकल्प («किसी को न छोड़ें»)',
    livingInventoryTab: 'जीवंत परंपरा सूची • संपूर्ण समावेश',
    curatedPathsTab: 'संरचित ज्ञान पथ',
    ambientSoundLabel: 'शांत परिवेशी ध्वनि',
    translatedNotice: 'यह संदेश आपकी भाषा में अनुवादित किया गया है। मूल देखने के लिए स्पर्श करें।',
    seeOriginal: 'मूल पाठ देखें',
    seeTranslation: 'अनुवाद देखें',
    audioMutedNotice: 'परिवेशीय ध्वनि वैकल्पिक है और इसे किसी भी समय बंद किया जा सकता है।',
  },
  zh: {
    appTitle: '生命之炉',
    sanctuarySubtitle: '心灵避风港',
    navDashboard: '仪表盘',
    navRooms: '圆桌圆圈',
    navPray: '祈愿与静心',
    navLearn: '求知与探索',
    navProfile: '隐私与安全',
    todayLight: '今日圣光与冥想',
    offerIntention: '奉献一份祈愿',
    privateJournal: '私人加密日志',
    sendToPerson: '发送给同道（经同意）',
    offerToRoom: '献给共修房间',
    moderatedCircles: '学术与修行交流空间',
    scholarlyWisdom: '学术智慧之路',
    leaveOutNoneMandate: '全包容准则（“包罗所有传统”）',
    livingInventoryTab: '活态传统清单 • 无一遗漏',
    curatedPathsTab: '精选研习路径',
    ambientSoundLabel: '宁静环境白噪音',
    translatedNotice: '此感悟已翻译为您使用的语言。点击查看原文。',
    seeOriginal: '查看原文',
    seeTranslation: '查看译文',
    audioMutedNotice: '背景声音完全自选，可随时关闭。',
  },
  fr: {
    appTitle: 'Le Foyer Vivant',
    sanctuarySubtitle: 'Sanctuaire Sacré',
    navDashboard: 'Tableau de bord',
    navRooms: 'Cercles',
    navPray: 'Prier',
    navLearn: 'Apprendre',
    navProfile: 'Profil',
    todayLight: 'Lumière et Focus d’Aujourd’hui',
    offerIntention: 'Offrir une Intention',
    privateJournal: 'Journal Privé',
    sendToPerson: 'Envoyer à une Personne',
    offerToRoom: 'Offrir à un Cercle',
    moderatedCircles: 'Cercles Modérés de Foi et d’Étude',
    scholarlyWisdom: 'Voies de Sagesse Universitaire',
    leaveOutNoneMandate: 'Mandat d’Inclusivité Maximale (« N’en omettre aucune »)',
    livingInventoryTab: 'Inventaire Vivant • Sans Exclusion',
    curatedPathsTab: 'Parcours Structurés',
    ambientSoundLabel: 'Sanctuaire Sonore Ambiant',
    translatedNotice: 'Ce message a été traduit dans votre langue. Touchez pour voir l’original.',
    seeOriginal: 'Voir l’original',
    seeTranslation: 'Voir la traduction',
    audioMutedNotice: 'Le son ambiant est facultatif et peut être désactivé à tout moment.',
  },
  ja: {
    appTitle: '生命の炉火',
    sanctuarySubtitle: '聖なる安らぎの場',
    navDashboard: 'ダッシュボード',
    navRooms: '対話の輪',
    navPray: '祈りと意図',
    navLearn: '学びの道',
    navProfile: '安全と設定',
    todayLight: '今日の光と静寂',
    offerIntention: '祈りの心を捧げる',
    privateJournal: '個人的な祈りの日記',
    sendToPerson: '同意のもと友に送る',
    offerToRoom: '祈りの場に届ける',
    moderatedCircles: '穏やかな学びと対話の輪',
    scholarlyWisdom: '学術的叡智の小径',
    leaveOutNoneMandate: '完全包摂の誓約（「一つも取り残さない」）',
    livingInventoryTab: '伝統の生きた目録',
    curatedPathsTab: '学習カリキュラム',
    ambientSoundLabel: '穏やかな環境音',
    translatedNotice: 'この言葉はあなたの言語に翻訳されました。タップして原文を表示。',
    seeOriginal: '原文を見る',
    seeTranslation: '翻訳を見る',
    audioMutedNotice: '環境音は任意であり、いつでもオフにできます。',
  },
  sw: {
    appTitle: 'Jiko Hai la Roho',
    sanctuarySubtitle: 'Hifadhi Takatifu',
    navDashboard: 'Dashibodi',
    navRooms: 'Vyumba vya Imani',
    navPray: 'Omba na Nia',
    navLearn: 'Jifunze',
    navProfile: 'Wasifu na Usalama',
    todayLight: 'Nuru na Makini ya Leo',
    offerIntention: 'Toa Nia Takatifu',
    privateJournal: 'Shajara Binafsi',
    sendToPerson: 'Tuma kwa Mtu (Kwa Idhini)',
    offerToRoom: 'Shiriki Chumbani',
    moderatedCircles: 'Duru Zinazoongozwa za Imani na Somo',
    scholarlyWisdom: 'Njia za Hekima ya Kisomi',
    leaveOutNoneMandate: 'Ahadi ya Ushirika Mkuu («Usiache Mila Yoyote»)',
    livingInventoryTab: 'Orodha Hai ya Mila • Hakuna Ubaguzi',
    curatedPathsTab: 'Masomo Maalumu',
    ambientSoundLabel: 'Sauti Tulivu ya Mazingira',
    translatedNotice: 'Ujumbe huu umetafsiriwa kwa lugha yako. Gusa kuona asili.',
    seeOriginal: 'Tazama ya asili',
    seeTranslation: 'Tazama tafsiri',
    audioMutedNotice: 'Sauti ya mazingira ni ya hiari na inaweza kuzimwa wakati wowote.',
  },
};

// Safe Cross-Tradition Translation Simulator preserving Sacred Terms
export function translateSpiritualText(
  text: string,
  targetLang: LanguageCode
): { translated: string; containsSacredTerm: boolean; termInfo?: SacredGlossaryTerm } {
  if (targetLang === 'en') {
    return { translated: text, containsSacredTerm: false };
  }

  // Check if any sacred glossary terms are present
  const lower = text.toLowerCase();
  let foundTerm: SacredGlossaryTerm | undefined;

  for (const key of Object.keys(SACRED_GLOSSARY)) {
    if (lower.includes(key)) {
      foundTerm = SACRED_GLOSSARY[key];
      break;
    }
  }

  // Pre-translated high-fidelity responses for demo messages in Arabic, Spanish, Portuguese, Hebrew, etc.
  if (targetLang === 'es') {
    return {
      translated: foundTerm
        ? `${text} [Término sagrado preservado: ${foundTerm.transliteration} — ${foundTerm.gloss}]`
        : `«Que la paz profunda y el consuelo interior te acompañen en este momento de quietud.»`,
      containsSacredTerm: !!foundTerm,
      termInfo: foundTerm,
    };
  }

  if (targetLang === 'pt') {
    return {
      translated: foundTerm
        ? `${text} [Termo sagrado preservado: ${foundTerm.transliteration} — ${foundTerm.gloss}]`
        : `«Que a paz profunda e a consolação espiritual envolvam seu coração na jornada de elevação.»`,
      containsSacredTerm: !!foundTerm,
      termInfo: foundTerm,
    };
  }

  if (targetLang === 'ar') {
    return {
      translated: foundTerm
        ? `${text} [المصطلح المقدس محفوظ: ${foundTerm.transliteration} — ${foundTerm.gloss}]`
        : `«اللهم أنزل السكينة والطمأنينة على قلوب المتعبين، واجعل هذا المساء ملاذاً للنور والرحمة.»`,
      containsSacredTerm: !!foundTerm,
      termInfo: foundTerm,
    };
  }

  if (targetLang === 'he') {
    return {
      translated: foundTerm
        ? `${text} [מונח קדוש שמור: ${foundTerm.transliteration} — ${foundTerm.gloss}]`
        : `«עושה שלום במרומיו הוא יעשה שלום עלינו ועל כל שוחרי האור. יהי רצון לשקט ולנחמה בלב.»`,
      containsSacredTerm: !!foundTerm,
      termInfo: foundTerm,
    };
  }

  return {
    translated: `[${targetLang.toUpperCase()}] ${text}`,
    containsSacredTerm: !!foundTerm,
    termInfo: foundTerm,
  };
}
