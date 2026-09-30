import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import {
  VERIFIED_HOUSES_OF_WORSHIP,
  CHURCH_BROADCAST_EVENTS,
  type ChurchEventStream,
} from '../data/churchEventsData';
import { MAJOR_RELIGIONS, type MajorReligionId } from '../data/scriptureData';
import { TraditionVisual } from './ReligiousVisuals';
import { analyzeContentSafety, type SafetyAnalysisResult } from '../services/aiSafetyGuardian';
import {
  Church,
  Video,
  Radio,
  Users,
  CheckCircle,
  Clock,
  Shield,
  Send,
  X,
  AlertTriangle,
  MapPin,
  GraduationCap,
  Calendar,
  BookOpen,
} from 'lucide-react';

interface PrayerStudyClass {
  id: string;
  religionId: MajorReligionId;
  title: string;
  instructor: string;
  schedule: string;
  description: string;
  companionWorkbookTitle: string;
  enrolledCount: number;
}

const PRAYER_STUDY_CLASSES: PrayerStudyClass[] = [
  {
    id: 'cls-chr-01',
    religionId: 'christianity',
    title: 'The Beatitudes of Grace: 8-Week Contemplative Class',
    instructor: 'Pastor David & Rev. Sarah Mitchell',
    schedule: 'Every Tuesday at 7:00 PM CST',
    description: 'Verse-by-verse slow immersion into Matthew 5. Focus on the inner postures of spiritual poverty, meekness, and pure peacemaking.',
    companionWorkbookTitle: 'The Beatitudes of Grace: 8-Week Scripture Class Workbook',
    enrolledCount: 68,
  },
  {
    id: 'cls-isl-01',
    religionId: 'islam',
    title: 'Tajweed Recitation & Heart of the Qur\'an',
    instructor: 'Ustadh Tariq Al-Baqir',
    schedule: 'Every Wednesday at 6:30 PM EST',
    description: 'Master the vocal science of Tajweed while exploring Surah Al-Fatiha and Ayat al-Kursi with classical spiritual tafsir.',
    companionWorkbookTitle: 'The Noble Qur\'an: Tajweed Color-Coded Study Edition',
    enrolledCount: 92,
  },
  {
    id: 'cls-jud-01',
    religionId: 'judaism',
    title: 'Pirkei Avot: Living the Ethics of the Sages',
    instructor: 'Rabbi Jonathan Levi',
    schedule: 'Every Thursday at 7:30 PM EST',
    description: 'In-depth Shabbat preparation class analyzing the ethical aphorisms of Hillel, Shammai, and Akiva for moral daily living.',
    companionWorkbookTitle: 'Pirkei Avot: Ethics of the Sages Study Companion',
    enrolledCount: 54,
  },
  {
    id: 'cls-hin-01',
    religionId: 'hinduism',
    title: 'Bhagavad Gita: Journey of the Soul (Chapter 2)',
    instructor: 'Swami Vedananda',
    schedule: 'Every Saturday at 9:00 AM PST',
    description: 'Detailed analysis of Krishna\'s discourse on the indestructible nature of the Atman and the practice of Karma Yoga.',
    companionWorkbookTitle: 'The Bhagavad Gita: Devanagari & Verse-by-Verse Study Edition',
    enrolledCount: 77,
  },
  {
    id: 'cls-bud-01',
    religionId: 'buddhism',
    title: 'Four Foundations of Mindfulness (Satipatthāna)',
    instructor: 'Bhikkhu Dhammarakkhita',
    schedule: 'Every Sunday at 5:00 PM PST',
    description: 'Weekly meditation coaching and sutta study exploring mindfulness of breath, bodily postures, and mental sensations.',
    companionWorkbookTitle: 'The Satipatthāna Sutta: Mindfulness Class Study Manual',
    enrolledCount: 110,
  },
];

export const ChurchEventsView: React.FC = () => {
  const { hearthTone, timeOfDay, userProfile, setActiveTab } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  const mapTraditionToMajorReligion = (trad: string): MajorReligionId => {
    const s = trad.toLowerCase();
    if (s.includes('islam') || s.includes('muslim') || s.includes('sufi')) return 'islam';
    if (s.includes('juda') || s.includes('jew') || s.includes('torah')) return 'judaism';
    if (s.includes('hindu') || s.includes('vedan') || s.includes('gita')) return 'hinduism';
    if (s.includes('buddh') || s.includes('dharma') || s.includes('zen')) return 'buddhism';
    return 'christianity';
  };

  const [selectedReligion, setSelectedReligion] = useState<MajorReligionId>(() =>
    mapTraditionToMajorReligion(userProfile.primaryTradition)
  );

  // Active Stream Player Modal
  const [activeStream, setActiveStream] = useState<ChurchEventStream | null>(null);
  const [affirmationInput, setAffirmationInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    { id: 'aff-1', sender: 'Sister Clara', text: 'Grace and peace to everyone gathering tonight.', time: '2m ago' },
    { id: 'aff-2', sender: 'Pilgrim-19', text: 'Amen. Holding our healthcare workers in prayer.', time: 'Just now' },
  ]);
  const [streamSafetyAlert, setStreamSafetyAlert] = useState<SafetyAnalysisResult | null>(null);

  const [registeredClassIds, setRegisteredClassIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hearth_registered_classes');
      return saved ? JSON.parse(saved) : ['cls-chr-01'];
    } catch {
      return ['cls-chr-01'];
    }
  });

  const toggleClassRegistration = (classId: string) => {
    setRegisteredClassIds((prev) => {
      const next = prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId];
      localStorage.setItem('hearth_registered_classes', JSON.stringify(next));
      return next;
    });
  };

  const filteredHouses = VERIFIED_HOUSES_OF_WORSHIP.filter(
    (h) => h.religionId === selectedReligion
  );
  const filteredEvents = CHURCH_BROADCAST_EVENTS.filter(
    (e) => e.religionId === selectedReligion
  );
  const filteredClasses = PRAYER_STUDY_CLASSES.filter(
    (c) => c.religionId === selectedReligion
  );

  const handleSendAffirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affirmationInput.trim() || !activeStream) return;

    const safety = analyzeContentSafety(affirmationInput, selectedReligion);
    if (!safety.isSafe) {
      setStreamSafetyAlert(safety);
      return;
    }

    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: userProfile.displayName,
        text: safety.sanitizedText,
        time: 'Just now',
      },
    ]);
    setAffirmationInput('');
    setStreamSafetyAlert(null);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* 1. Top Banner & 5 Major Religions Selector */}
      <div
        className="rounded-3xl p-6 sm:p-7 border shadow-xs space-y-5"
        style={{
          borderColor: 'rgba(232, 168, 124, 0.25)',
          backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs"
              style={{
                backgroundColor: `${currentTone.primary}20`,
                borderColor: `${currentTone.primary}60`,
                color: currentTone.primary,
              }}
            >
              <Church className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-normal leading-snug m-0">
                  Houses of Worship & Liturgical Broadcasts
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono font-medium">
                  Verified Congregations
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 m-0 mt-0.5">
                Connect with verified churches, mosques, synagogues, and temples. Stream live services and sacred sermon archives.
              </p>
            </div>
          </div>
        </div>

        {/* 5 Major Religions Selector */}
        <div className="pt-2 border-t border-stone-200/20">
          <div className="text-[11px] font-serif uppercase tracking-wider text-stone-400 mb-2 flex items-center justify-between">
            <span>Filter Houses of Worship & Streams (5 Major Religions)</span>
            <span className="text-stone-400 font-sans">
              Personalized to: <strong>{userProfile.primaryTradition}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {MAJOR_RELIGIONS.map((rel) => {
              const isSelected = selectedReligion === rel.id;
              return (
                <button
                  key={rel.id}
                  onClick={() => setSelectedReligion(rel.id)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'shadow-sm font-semibold scale-102'
                      : 'opacity-70 hover:opacity-100 hover:bg-stone-500/5'
                  }`}
                  style={{
                    borderColor: isSelected ? currentTone.primary : 'rgba(232, 168, 124, 0.25)',
                    backgroundColor: isSelected
                      ? `${currentTone.primary}20`
                      : timeOfDay === 'night'
                      ? '#251E19'
                      : '#FAF8F5',
                  }}
                >
                  <TraditionVisual tradition={rel.name} size={24} color={currentTone.primary} />
                  <div className="min-w-0">
                    <span className="text-xs font-serif block truncate">{rel.name}</span>
                    <span className="text-[10px] text-stone-400 block truncate">
                      {rel.id === 'christianity'
                        ? 'Churches'
                        : rel.id === 'islam'
                        ? 'Mosques'
                        : rel.id === 'judaism'
                        ? 'Synagogues'
                        : rel.id === 'hinduism'
                        ? 'Mandirs'
                        : 'Monasteries'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Live & Pre-Recorded Streams Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h3 className="font-serif text-lg font-normal m-0">
              Live Liturgical Broadcasts & Sermon Archives
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {filteredEvents.length} Available Streams
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-6 rounded-3xl border shadow-xs flex flex-col justify-between space-y-4 transition-all hover:scale-101"
              style={{
                borderColor: 'rgba(232, 168, 124, 0.25)',
                backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFFFF',
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-serif tracking-wider text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                    {evt.broadcastType === 'live' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        LIVE BROADCAST
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        PRE-RECORDED ARCHIVE
                      </>
                    )}
                  </span>
                  <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {evt.viewerCount} in sanctuary
                  </span>
                </div>

                <div>
                  <span className="text-xs text-stone-400 block font-serif">
                    {evt.houseOfWorshipName} • {evt.sacredRhythmTag}
                  </span>
                  <h4 className="font-serif text-base font-normal leading-snug m-0 mt-0.5">
                    {evt.title}
                  </h4>
                </div>

                <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 m-0">
                  {evt.description}
                </p>

                <div className="text-[11px] text-stone-400 font-serif flex items-center gap-3">
                  <span>Speaker: <strong>{evt.speaker}</strong></span>
                  <span>•</span>
                  <span>{evt.scheduledTime}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200/20 flex items-center justify-between">
                <span className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Quiet Sanctuary Mode
                </span>
                <button
                  onClick={() => setActiveStream(evt)}
                  className="px-4 py-2 rounded-full font-serif text-xs font-semibold flex items-center gap-1.5 transition-transform hover:scale-102 shadow-xs"
                  style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Enter Broadcast</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2.5. Upcoming Prayer & Scripture Classes (Interactive with Store Companions) */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <h3 className="font-serif text-lg font-normal m-0 text-stone-100">
              Upcoming Prayer & Scripture Classes
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {filteredClasses.length} Scheduled Circle{filteredClasses.length !== 1 ? 's' : ''}
          </span>
        </div>

        <p className="text-xs text-stone-400 m-0 -mt-2">
          Reverent, verse-by-verse spiritual instruction guided by verified educators. Download official companion study workbooks directly from our sacred store.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClasses.map((cls) => {
            const isRegistered = registeredClassIds.includes(cls.id);
            return (
              <div
                key={cls.id}
                className="p-5 rounded-2xl border border-stone-800 bg-stone-900/60 flex flex-col justify-between space-y-4 hover:border-stone-700 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-stone-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      {cls.schedule}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {cls.enrolledCount + (isRegistered ? 1 : 0)} Enrolled
                    </span>
                  </div>

                  <h4 className="font-serif text-base text-stone-100 font-normal m-0">
                    {cls.title}
                  </h4>
                  <p className="text-xs text-stone-400 m-0 leading-relaxed">
                    {cls.description}
                  </p>

                  <div className="text-[11px] text-stone-400">
                    Teacher: <strong className="text-stone-300">{cls.instructor}</strong>
                  </div>

                  {/* Companion Workbook Link to Store */}
                  <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] text-stone-500 uppercase font-semibold">
                          Required / Recommended Study Workbook
                        </div>
                        <div className="text-xs text-stone-200 truncate font-medium">
                          {cls.companionWorkbookTitle}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('store')}
                      className="px-2.5 py-1 rounded-lg text-[11px] border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-stone-100 whitespace-nowrap transition"
                    >
                      Get in Store
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-stone-500 flex items-center gap-1 font-mono">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    AI Guarded Circle
                  </span>
                  <button
                    onClick={() => toggleClassRegistration(cls.id)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-medium transition ${
                      isRegistered
                        ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800'
                        : 'text-stone-950 shadow-sm'
                    }`}
                    style={{
                      backgroundColor: isRegistered ? undefined : currentTone.primary,
                    }}
                  >
                    {isRegistered ? '✓ Enrolled in Class' : 'Register for Class'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Verified Houses of Worship Directory */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Church className="w-4 h-4 text-amber-500" />
            <h3 className="font-serif text-lg font-normal m-0">
              Verified Congregations & Ministries
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {filteredHouses.length} Congregations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHouses.map((house) => (
            <div
              key={house.id}
              className="p-5 rounded-3xl border shadow-xs flex items-start gap-4"
              style={{
                borderColor: 'rgba(232, 168, 124, 0.25)',
                backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFFFF',
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border"
                style={{
                  backgroundColor: `${currentTone.primary}18`,
                  borderColor: `${currentTone.primary}40`,
                }}
              >
                {house.avatarIcon}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif text-base font-normal leading-snug m-0 truncate">
                    {house.name}
                  </h4>
                  {house.verifiedStatus && (
                    <span title="Verified Congregation">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    </span>
                  )}
                </div>

                <div className="text-xs text-stone-400 flex items-center gap-1 font-serif">
                  <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                  <span>
                    {house.locationCity}, {house.locationStateOrCountry}
                  </span>
                </div>

                <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 m-0">
                  {house.description}
                </p>

                <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-between border-t border-stone-200/20 font-serif">
                  <span>Leader: <strong>{house.pastorOrLeader}</strong></span>
                  <span className="font-mono">{house.memberCount} members</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Stream Player Modal with Quiet Sanctuary Mode & AI Safety Guardian */}
      {activeStream && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(28, 22, 18, 0.9)' }}
        >
          <div
            className="w-full max-w-4xl rounded-3xl border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
            style={{
              backgroundColor: timeOfDay === 'night' ? '#241D18' : '#FAF7F2',
              borderColor: `${currentTone.primary}60`,
              color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
            }}
          >
            {/* Player Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeStream.religionId === 'christianity' ? '✝️' : activeStream.religionId === 'islam' ? '🕌' : activeStream.religionId === 'judaism' ? '🕍' : activeStream.religionId === 'hinduism' ? '🛕' : '☸️'}</span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-normal m-0 truncate">
                    {activeStream.title}
                  </h3>
                  <span className="text-xs text-stone-500">
                    {activeStream.houseOfWorshipName} • Speaker: {activeStream.speaker}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveStream(null)}
                className="p-2 rounded-full hover:bg-stone-500/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Broadcast Stage & Sacred Chat Split */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-6">
              {/* Left: Video / Audio Sanctuary Stage */}
              <div className="lg:col-span-8 flex flex-col space-y-4">
                <div
                  className="w-full aspect-video rounded-3xl flex flex-col items-center justify-center relative overflow-hidden border shadow-inner"
                  style={{
                    backgroundColor: '#1C1613',
                    borderColor: `${currentTone.primary}30`,
                  }}
                >
                  {/* Atmospheric Glow */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none animate-pulse"
                    style={{
                      background: `radial-gradient(circle at center, ${currentTone.primary} 0%, transparent 70%)`,
                    }}
                  />
                  <TraditionVisual tradition={activeStream.religionId} size={72} color={currentTone.primary} glow={true} />
                  <div className="text-center mt-3 z-10 px-4">
                    <span className="text-xs font-mono tracking-widest uppercase text-amber-400">
                      ● Sanctuary Broadcast Active
                    </span>
                    <h4 className="font-serif text-base text-stone-200 mt-1 m-0">
                      {activeStream.sacredRhythmTag}
                    </h4>
                    <p className="text-xs text-stone-400 max-w-sm mt-1">
                      Streaming liturgical reverent audio and contemplation directly from {activeStream.houseOfWorshipName}.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-500/10 border border-stone-200/20 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-serif font-semibold text-emerald-600">
                    <Shield className="w-4 h-4" />
                    <span>Quiet Sanctuary Mode Active</span>
                  </div>
                  <p className="text-stone-500 m-0">
                    To preserve holy presence, this broadcast chat is restricted to prayer affirmations, blessings, and quiet gratitude. Debates, solicitations, and profanity are blocked by AI.
                  </p>
                </div>
              </div>

              {/* Right: Sacred Affirmations & AI Guarded Chat */}
              <div className="lg:col-span-4 flex flex-col rounded-3xl border p-4 space-y-3 justify-between"
                style={{
                  backgroundColor: timeOfDay === 'night' ? '#1F1814' : '#FFFFFF',
                  borderColor: 'rgba(232, 168, 124, 0.25)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200/20">
                    <span className="text-xs font-serif font-semibold">Sanctuary Fellowship</span>
                    <span className="text-[10px] text-stone-400 font-mono">{chatMessages.length} offerings</span>
                  </div>

                  <div className="space-y-2 mt-3 max-h-56 overflow-y-auto pr-1">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="p-2 rounded-xl bg-stone-500/5 text-xs font-serif space-y-0.5">
                        <div className="flex items-center justify-between text-[10px] text-stone-400">
                          <span className="font-medium text-amber-700 dark:text-amber-300">{msg.sender}</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="m-0 text-stone-700 dark:text-stone-200">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form to submit affirmation */}
                <form onSubmit={handleSendAffirmation} className="space-y-2 pt-2 border-t border-stone-200/20">
                  {streamSafetyAlert && (
                    <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-600 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{streamSafetyAlert.warningMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={affirmationInput}
                      onChange={(e) => {
                        setAffirmationInput(e.target.value);
                        setStreamSafetyAlert(null);
                      }}
                      placeholder="Offer prayer or 'Amen'..."
                      className="flex-1 text-xs p-2 rounded-full border bg-transparent font-serif focus:outline-none"
                      style={{ borderColor: `${currentTone.primary}50` }}
                    />
                    <button
                      type="submit"
                      disabled={!affirmationInput.trim()}
                      className="p-2 rounded-full transition-transform hover:scale-105 disabled:opacity-40"
                      style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
