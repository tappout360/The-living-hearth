import React, { useState, useEffect, useCallback } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import {
  MAJOR_RELIGIONS,
  PRELOADED_SCRIPTURE_BOOKS,
  HIGHLIGHT_TONE_CONFIG,
  type MajorReligionId,
  type HighlightColor,
  type VerseHighlight,
  type ScriptureBook,
  type ScriptureVerse,
} from '../data/scriptureData';
import { TraditionVisual } from './ReligiousVisuals';
import { analyzeContentSafety, type SafetyAnalysisResult } from '../services/aiSafetyGuardian';
import {
  BookOpen,
  Highlighter,
  FileText,
  Upload,
  Search,
  Check,
  Shield,
  Eye,
  ChevronRight,
  Share2,
  Lock,
  X,
  AlertTriangle,
} from 'lucide-react';

const HIGHLIGHT_STORAGE_KEY = 'sovereign_sanctuary_scripture_highlights';

export const ScriptureStudyView: React.FC = () => {
  const { hearthTone, timeOfDay, userProfile } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  // Helper to resolve user's primary tradition to a major religion ID
  const mapTraditionToMajorReligion = (trad: string): MajorReligionId => {
    const s = trad.toLowerCase();
    if (s.includes('islam') || s.includes('muslim') || s.includes('sufi')) return 'islam';
    if (s.includes('juda') || s.includes('jew') || s.includes('torah')) return 'judaism';
    if (s.includes('hindu') || s.includes('vedan') || s.includes('gita')) return 'hinduism';
    if (s.includes('buddh') || s.includes('dharma') || s.includes('zen')) return 'buddhism';
    return 'christianity'; // Default
  };

  const [selectedReligion, setSelectedReligion] = useState<MajorReligionId>(() =>
    mapTraditionToMajorReligion(userProfile.primaryTradition)
  );

  const [books, setBooks] = useState<ScriptureBook[]>(PRELOADED_SCRIPTURE_BOOKS);
  const [selectedBookId, setSelectedBookId] = useState<string>(() => {
    const defaultBook = PRELOADED_SCRIPTURE_BOOKS.find(
      (b) => b.religionId === mapTraditionToMajorReligion(userProfile.primaryTradition)
    );
    return defaultBook ? defaultBook.id : PRELOADED_SCRIPTURE_BOOKS[0].id;
  });

  const activeBook = books.find((b) => b.id === selectedBookId) || books[0];
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    activeBook?.chapters[0]?.id || ''
  );

  const activeChapter =
    activeBook?.chapters.find((c) => c.id === selectedChapterId) || activeBook?.chapters[0];

  // Highlighting State
  const [activeHighlightColor, setActiveHighlightColor] = useState<HighlightColor>('gold');
  const [highlights, setHighlights] = useState<VerseHighlight[]>(() => {
    try {
      const stored = localStorage.getItem(HIGHLIGHT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Custom Scriptures Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importTitle, setImportTitle] = useState('');
  const [importChapterTheme, setImportChapterTheme] = useState('');
  const [importTextContent, setImportTextContent] = useState('');
  const [importReligion, setImportReligion] = useState<MajorReligionId>(selectedReligion);

  // Note-Taking / Reflection State
  const [activeVerseForNote, setActiveVerseForNote] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [aiNoteSafety, setAiNoteSafety] = useState<SafetyAnalysisResult | null>(null);
  const [copiedVerseNum, setCopiedVerseNum] = useState<number | null>(null);

  // "One Opinion Only If You Seek It" Perspective State
  const [selectedPerspectiveId, setSelectedPerspectiveId] = useState<string | null>(null);
  const [isPerspectiveOpen, setIsPerspectiveOpen] = useState(false);

  // Search filter inside active chapter
  const [searchQuery, setSearchQuery] = useState('');

  // Persist highlights
  useEffect(() => {
    try {
      localStorage.setItem(HIGHLIGHT_STORAGE_KEY, JSON.stringify(highlights));
    } catch {
      // Ignore
    }
  }, [highlights]);

  // When religion changes, select corresponding book
  const handleReligionChange = (relId: MajorReligionId) => {
    setSelectedReligion(relId);
    const matchingBook = books.find((b) => b.religionId === relId);
    if (matchingBook) {
      setSelectedBookId(matchingBook.id);
      setSelectedChapterId(matchingBook.chapters[0]?.id || '');
    }
    setSelectedPerspectiveId(null);
    setIsPerspectiveOpen(false);
  };

  // Toggle Highlight on Verse
  const handleToggleHighlight = useCallback((verseNumber: number) => {
    if (!activeChapter) return;
    const existingIdx = highlights.findIndex(
      (h) => h.chapterId === activeChapter.id && h.verseNumber === verseNumber
    );

    if (existingIdx >= 0) {
      const existing = highlights[existingIdx];
      if (existing.color === activeHighlightColor && !existing.note) {
        // Remove highlight if clicked again with same color
        setHighlights((prev) => prev.filter((_, idx) => idx !== existingIdx));
      } else {
        // Change color
        setHighlights((prev) =>
          prev.map((h, idx) =>
            idx === existingIdx ? { ...h, color: activeHighlightColor } : h
          )
        );
      }
    } else {
      // Add new highlight
      const newHighlight: VerseHighlight = {
        id: `hl-${verseNumber}-${Math.random().toString(36).substring(2, 9)}`,
        chapterId: activeChapter.id,
        verseNumber,
        color: activeHighlightColor,
        timestamp: new Date().toISOString(),
      };
      setHighlights((prev) => [...prev, newHighlight]);
    }
  }, [activeChapter, highlights, activeHighlightColor]);

  const getVerseHighlight = (verseNumber: number): VerseHighlight | undefined => {
    if (!activeChapter) return undefined;
    return highlights.find(
      (h) => h.chapterId === activeChapter.id && h.verseNumber === verseNumber
    );
  };

  // Note Input validation with AI Safety Guardian
  const handleNoteInputChange = (val: string) => {
    setNoteInput(val);
    if (val.trim().length > 3) {
      const safety = analyzeContentSafety(val, selectedReligion);
      setAiNoteSafety(safety);
    } else {
      setAiNoteSafety(null);
    }
  };

  // Save Verse Note
  const handleSaveVerseNote = () => {
    if (!activeChapter || activeVerseForNote === null) return;
    if (aiNoteSafety && !aiNoteSafety.isSafe) {
      alert(aiNoteSafety.blockedReason || 'Please modify your note to ensure reverent harmony.');
      return;
    }

    const cleanText = aiNoteSafety ? aiNoteSafety.sanitizedText : noteInput;

    setHighlights((prev) => {
      const existingIdx = prev.findIndex(
        (h) => h.chapterId === activeChapter.id && h.verseNumber === activeVerseForNote
      );
      if (existingIdx >= 0) {
        return prev.map((h, idx) =>
          idx === existingIdx ? { ...h, note: cleanText } : h
        );
      } else {
        return [
          ...prev,
          {
            id: `hl-${Date.now()}-${activeVerseForNote}`,
            chapterId: activeChapter.id,
            verseNumber: activeVerseForNote,
            color: activeHighlightColor,
            note: cleanText,
            timestamp: new Date().toISOString(),
          },
        ];
      }
    });

    setActiveVerseForNote(null);
    setNoteInput('');
    setAiNoteSafety(null);
  };

  // Import Custom Scripture Text
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importTitle.trim() || !importTextContent.trim()) return;

    // Break lines into verses
    const lines = importTextContent.split('\n').filter((l) => l.trim().length > 0);
    const verses: ScriptureVerse[] = lines.map((line, idx) => {
      // Check if line starts with a number like "1. " or "1 "
      const match = line.match(/^(\d+)[.\s]+(.+)$/);
      if (match) {
        return { number: parseInt(match[1], 10), text: match[2].trim() };
      }
      return { number: idx + 1, text: line.trim() };
    });

    const newChapterId = `cust-ch-${Date.now()}`;
    const newBookId = `cust-book-${Date.now()}`;

    const newBook: ScriptureBook = {
      id: newBookId,
      religionId: importReligion,
      religionName: MAJOR_RELIGIONS.find((r) => r.id === importReligion)?.name || 'Custom',
      title: importTitle.trim(),
      originalLanguage: 'Custom Translation',
      standardTranslation: 'User Imported Scripture',
      description: 'Imported personal scripture translation stored in sovereign local vault.',
      chapters: [
        {
          id: newChapterId,
          bookId: newBookId,
          chapterNumber: 1,
          title: `${importTitle.trim()} — Chapter 1`,
          theme: importChapterTheme.trim() || 'Personal Scripture Study',
          verses,
          optInPerspectives: [],
        },
      ],
    };

    setBooks((prev) => [newBook, ...prev]);
    setSelectedReligion(importReligion);
    setSelectedBookId(newBookId);
    setSelectedChapterId(newChapterId);

    setIsImportModalOpen(false);
    setImportTitle('');
    setImportChapterTheme('');
    setImportTextContent('');
  };

  // Copy Verse to Clipboard
  const handleCopyVerse = (verse: ScriptureVerse) => {
    if (!activeChapter || !activeBook) return;
    const citation = `"${verse.text}" — ${activeChapter.title}, v.${verse.number} (${activeBook.standardTranslation})`;
    navigator.clipboard.writeText(citation);
    setCopiedVerseNum(verse.number);
    setTimeout(() => setCopiedVerseNum(null), 2000);
  };

  // Filter verses by search query
  const filteredVerses = activeChapter
    ? activeChapter.verses.filter((v) =>
        searchQuery ? v.text.toLowerCase().includes(searchQuery.toLowerCase()) : true
      )
    : [];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* 1. Header Banner & Major Religion Selector */}
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
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-normal leading-snug m-0">
                  Scripture & Bible Study Sanctuary
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono font-medium hidden sm:inline">
                  AI Guarded
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 m-0 mt-0.5">
                Multi-canon reading, 4-tone sacred highlighting, custom import, and opt-in perspectives.
              </p>
            </div>
          </div>

          {/* Action: Import Custom Scripture */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-serif text-xs font-medium border transition-transform hover:scale-102 shadow-xs shrink-0 self-start sm:self-auto"
            style={{
              backgroundColor: `${currentTone.primary}18`,
              borderColor: `${currentTone.primary}80`,
              color: currentTone.primary,
            }}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Scripture / Bible</span>
          </button>
        </div>

        {/* 5 Major Religions Selector */}
        <div className="pt-2 border-t border-stone-200/20">
          <div className="text-[11px] font-serif uppercase tracking-wider text-stone-400 mb-2 flex items-center justify-between">
            <span>Select Sacred Canon (5 Major Religions)</span>
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
                  onClick={() => handleReligionChange(rel.id)}
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
                      {rel.scriptureName.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Scripture Study Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Book & Chapter Navigation + Highlighting Palette */}
        <div className="lg:col-span-4 space-y-5">
          {/* Chapter Selector Card */}
          <div
            className="p-5 rounded-3xl border shadow-xs space-y-4"
            style={{
              borderColor: 'rgba(232, 168, 124, 0.25)',
              backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFFFF',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-semibold text-stone-700 dark:text-stone-200">
                Available Books & Chapters
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-500/10 text-stone-400 font-mono">
                {books.filter((b) => b.religionId === selectedReligion).length} Collections
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {books
                .filter((b) => b.religionId === selectedReligion)
                .map((book) => (
                  <div key={book.id} className="space-y-1">
                    <div className="text-[11px] font-serif text-stone-400 font-medium px-2 py-1 bg-stone-500/5 rounded-lg flex items-center justify-between">
                      <span className="truncate">{book.title}</span>
                      <span className="text-[9px] font-mono">{book.standardTranslation}</span>
                    </div>
                    {book.chapters.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setSelectedBookId(book.id);
                          setSelectedChapterId(ch.id);
                          setSelectedPerspectiveId(null);
                          setIsPerspectiveOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs font-serif transition-colors flex items-center justify-between ${
                          selectedChapterId === ch.id
                            ? 'font-medium shadow-xs'
                            : 'opacity-70 hover:opacity-100 hover:bg-stone-500/10'
                        }`}
                        style={{
                          borderColor:
                            selectedChapterId === ch.id
                              ? currentTone.primary
                              : 'rgba(232, 168, 124, 0.2)',
                          backgroundColor:
                            selectedChapterId === ch.id ? `${currentTone.primary}25` : 'transparent',
                        }}
                      >
                        <span className="truncate">{ch.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      </button>
                    ))}
                  </div>
                ))}
            </div>
          </div>

          {/* 4-Color Sacred Highlighting Palette */}
          <div
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{
              borderColor: 'rgba(232, 168, 124, 0.25)',
              backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFFFF',
            }}
          >
            <div className="flex items-center gap-2">
              <Highlighter className="w-4 h-4 text-amber-500" />
              <span className="font-serif text-sm font-semibold text-stone-700 dark:text-stone-200">
                Sacred Highlighting Tones
              </span>
            </div>
            <p className="text-[11px] text-stone-500 m-0">
              Select a tone, then tap any verse to mark sacred insight.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {(Object.keys(HIGHLIGHT_TONE_CONFIG) as HighlightColor[]).map((colorKey) => {
                const cfg = HIGHLIGHT_TONE_CONFIG[colorKey];
                const isSelected = activeHighlightColor === colorKey;
                return (
                  <button
                    key={colorKey}
                    onClick={() => setActiveHighlightColor(colorKey)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                      isSelected ? 'ring-2 shadow-xs font-medium scale-102' : 'opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: cfg.border,
                      backgroundColor: cfg.bg,
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: cfg.border }}
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-serif block truncate">{cfg.name}</span>
                      <span className="text-[9px] text-stone-500 block truncate">{cfg.meaning}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-between border-t border-stone-200/20">
              <span>Saved Highlights in Chapter:</span>
              <span className="font-mono font-bold">
                {highlights.filter((h) => h.chapterId === activeChapter?.id).length}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Scripture Reader Surface */}
        <div className="lg:col-span-8 space-y-5">
          {activeChapter && (
            <div
              className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6"
              style={{
                borderColor: 'rgba(232, 168, 124, 0.3)',
                backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFDFB',
              }}
            >
              {/* Chapter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/20">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-serif text-stone-400">
                    {activeBook?.religionName} • {activeBook?.standardTranslation}
                  </span>
                  <h3 className="font-serif text-2xl font-normal leading-snug m-0 mt-0.5">
                    {activeChapter.title}
                  </h3>
                  <p className="text-xs text-stone-500 m-0 mt-1 italic">{activeChapter.theme}</p>
                </div>

                {/* In-Chapter Search */}
                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search verses..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-full border text-xs bg-transparent focus:outline-none"
                    style={{ borderColor: `${currentTone.primary}50` }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Verses Container */}
              <div className="space-y-4 font-serif text-sm sm:text-base leading-relaxed">
                {filteredVerses.map((verse) => {
                  const hl = getVerseHighlight(verse.number);
                  const isMarked = !!hl;
                  const hlColorCfg = hl ? HIGHLIGHT_TONE_CONFIG[hl.color] : null;

                  return (
                    <div
                      key={verse.number}
                      className={`p-3.5 rounded-2xl transition-all duration-200 group relative border ${
                        isMarked ? 'border-amber-400/40 shadow-xs' : 'border-transparent hover:border-stone-300/30'
                      }`}
                      style={{
                        backgroundColor: hlColorCfg ? hlColorCfg.bg : 'transparent',
                      }}
                    >
                      {/* Original Script if present (e.g. Arabic, Hebrew, Sanskrit) */}
                      {verse.originalText && (
                        <div
                          className="text-right font-serif text-lg text-stone-600 dark:text-stone-300 mb-2 leading-loose"
                          dir={selectedReligion === 'islam' || selectedReligion === 'judaism' ? 'rtl' : 'ltr'}
                        >
                          {verse.originalText}
                        </div>
                      )}

                      {/* Transliteration if present */}
                      {verse.transliteration && (
                        <div className="text-xs text-stone-400 italic font-sans mb-1.5">
                          {verse.transliteration}
                        </div>
                      )}

                      {/* Verse Text with Number */}
                      <div className="flex items-start gap-2.5">
                        <span className="text-xs font-mono font-semibold text-stone-400 select-none mt-1 shrink-0">
                          {verse.number}
                        </span>
                        <p className="flex-1 m-0 text-stone-800 dark:text-stone-200 leading-relaxed">
                          {verse.text}
                        </p>
                      </div>

                      {/* Attached Note if any */}
                      {hl?.note && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-stone-500/10 border border-stone-300/20 text-xs font-sans text-stone-600 dark:text-stone-300 flex items-start gap-2">
                          <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-semibold block text-[10px] uppercase font-serif text-stone-400">
                              Personal Reflection Note:
                            </span>
                            <span>{hl.note}</span>
                          </div>
                        </div>
                      )}

                      {/* Action Bar on Hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-stone-200/10 text-xs font-sans">
                        <button
                          onClick={() => handleToggleHighlight(verse.number)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-serif border hover:scale-102 flex items-center gap-1"
                          style={{
                            borderColor: HIGHLIGHT_TONE_CONFIG[activeHighlightColor].border,
                            backgroundColor: HIGHLIGHT_TONE_CONFIG[activeHighlightColor].bg,
                          }}
                        >
                          <Highlighter className="w-3 h-3" />
                          <span>{isMarked ? 'Change Tone' : 'Highlight'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveVerseForNote(verse.number);
                            setNoteInput(hl?.note || '');
                          }}
                          className="px-2.5 py-1 rounded-full text-[11px] font-serif border border-stone-300/40 hover:bg-stone-500/10 flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{hl?.note ? 'Edit Note' : 'Add Note'}</span>
                        </button>

                        <button
                          onClick={() => handleCopyVerse(verse)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-serif border border-stone-300/40 hover:bg-stone-500/10 flex items-center gap-1"
                        >
                          {copiedVerseNum === verse.number ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3 h-3" />
                              <span>Copy Citation</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 3. "ONE OPINION ONLY IF YOU SEEK IT" SECTION */}
              <div className="pt-6 border-t border-stone-200/20">
                <div className="p-4 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span className="font-serif text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-200">
                        The "One Opinion Only If You Seek It" Shield
                      </span>
                    </div>
                    <button
                      onClick={() => setIsPerspectiveOpen(!isPerspectiveOpen)}
                      className="px-3 py-1 rounded-full text-xs font-serif border border-stone-300/40 hover:border-amber-400 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-amber-500" />
                      <span>{isPerspectiveOpen ? 'Hide Perspectives' : 'Seek Perspectives'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-stone-500 m-0">
                    No theological arguments or unwanted opinions are forced into your study. Commentary remains strictly hidden until you specifically choose whose historical lens you wish to consult.
                  </p>

                  {/* Expandable Perspectives */}
                  {isPerspectiveOpen && activeChapter.optInPerspectives.length > 0 && (
                    <div className="space-y-3 pt-2 animate-in fade-in">
                      <span className="text-[11px] font-serif uppercase tracking-wider text-stone-400 block">
                        Choose One Specific Historical Commentary:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeChapter.optInPerspectives.map((persp) => {
                          const isSelected = selectedPerspectiveId === persp.id;
                          return (
                            <button
                              key={persp.id}
                              onClick={() =>
                                setSelectedPerspectiveId(isSelected ? null : persp.id)
                              }
                              className={`p-3 rounded-xl border text-left transition-all ${
                                isSelected
                                  ? 'ring-2 font-medium shadow-xs'
                                  : 'hover:bg-stone-500/10 opacity-80'
                              }`}
                              style={{
                                borderColor: isSelected ? currentTone.primary : 'rgba(232, 168, 124, 0.25)',
                                backgroundColor: isSelected ? `${currentTone.primary}20` : 'transparent',
                              }}
                            >
                              <span className="text-xs font-serif font-semibold block">{persp.author}</span>
                              <span className="text-[10px] text-stone-400 block">
                                {persp.traditionOrSchool} • {persp.era}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Render Only The One Selected Perspective */}
                      {selectedPerspectiveId && (
                        <div
                          className="p-4 rounded-2xl border shadow-inner mt-3 space-y-2 animate-in fade-in"
                          style={{
                            backgroundColor: timeOfDay === 'night' ? '#221B17' : '#FFFDF9',
                            borderColor: `${currentTone.primary}40`,
                          }}
                        >
                          {(() => {
                            const activePersp = activeChapter.optInPerspectives.find(
                              (p) => p.id === selectedPerspectiveId
                            );
                            if (!activePersp) return null;
                            return (
                              <>
                                <div className="flex items-center justify-between pb-1 border-b border-stone-200/20">
                                  <span className="font-serif text-xs font-semibold text-amber-700 dark:text-amber-300">
                                    {activePersp.sourceTitle} — {activePersp.author} ({activePersp.era})
                                  </span>
                                  <span className="text-[10px] font-mono text-stone-400">
                                    {activePersp.traditionOrSchool}
                                  </span>
                                </div>
                                <p className="text-xs text-stone-700 dark:text-stone-300 font-serif leading-relaxed m-0">
                                  "{activePersp.commentaryText}"
                                </p>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Verse Note Dialog Modal with AI Safety Guardian */}
      {activeVerseForNote !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(28, 22, 18, 0.85)' }}
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4"
            style={{
              backgroundColor: timeOfDay === 'night' ? '#2A231D' : '#FAF6F0',
              borderColor: currentTone.primary,
              color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200/20">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-lg font-normal m-0">
                  Attach Reflection Note: Verse {activeVerseForNote}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveVerseForNote(null);
                  setNoteInput('');
                  setAiNoteSafety(null);
                }}
                className="p-1 rounded-full hover:bg-stone-500/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 m-0">
              Record a personal insight or devotional prayer. All notes are protected by the real-time AI Safety Guardian.
            </p>

            {/* AI Guardian Alert */}
            {aiNoteSafety && aiNoteSafety.warningMessage && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  aiNoteSafety.isSafe
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
                }`}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-serif">AI Safety Notice:</strong>
                  <span>{aiNoteSafety.warningMessage}</span>
                  {aiNoteSafety.pastoralAdvice && (
                    <span className="block mt-1 italic opacity-90">
                      {aiNoteSafety.pastoralAdvice}
                    </span>
                  )}
                </div>
              </div>
            )}

            <textarea
              rows={4}
              value={noteInput}
              onChange={(e) => handleNoteInputChange(e.target.value)}
              placeholder="Write your contemplative reflection..."
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border bg-transparent font-serif focus:outline-none resize-none leading-relaxed"
              style={{ borderColor: `${currentTone.primary}60` }}
              autoFocus
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-stone-400 flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3 text-emerald-500" />
                Saved to Sovereign Local Vault
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveVerseForNote(null);
                    setNoteInput('');
                    setAiNoteSafety(null);
                  }}
                  className="px-4 py-2 rounded-full border border-stone-300 text-xs font-serif"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={aiNoteSafety ? !aiNoteSafety.isSafe : false}
                  onClick={handleSaveVerseNote}
                  className="px-5 py-2 rounded-full font-serif text-xs font-semibold disabled:opacity-40"
                  style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Custom Scripture Import Modal */}
      {isImportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(28, 22, 18, 0.85)' }}
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: timeOfDay === 'night' ? '#2A231D' : '#FAF6F0',
              borderColor: currentTone.primary,
              color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200/20">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-lg font-normal m-0">Import Custom Scripture / Bible</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="p-1 rounded-full hover:bg-stone-500/20">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 m-0">
              Import personal translations, favorite translations, or family scriptures directly into your local encrypted sanctuary.
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-4 text-xs font-serif">
              <div>
                <label className="block text-stone-500 mb-1">Target Religion:</label>
                <select
                  value={importReligion}
                  onChange={(e) => setImportReligion(e.target.value as MajorReligionId)}
                  className="w-full p-2.5 rounded-xl border bg-transparent font-serif"
                  style={{ borderColor: `${currentTone.primary}60` }}
                >
                  {MAJOR_RELIGIONS.map((r) => (
                    <option key={r.id} value={r.id} className="text-stone-900 bg-white dark:bg-stone-900 dark:text-stone-100">
                      {r.name} ({r.scriptureName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-500 mb-1">Scripture Book / Title:</label>
                <input
                  type="text"
                  required
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  placeholder="e.g. Epistle to the Ephesians or Surah Al-Kahf"
                  className="w-full p-2.5 rounded-xl border bg-transparent font-serif"
                  style={{ borderColor: `${currentTone.primary}60` }}
                />
              </div>

              <div>
                <label className="block text-stone-500 mb-1">Theme / Chapter Subtitle (Optional):</label>
                <input
                  type="text"
                  value={importChapterTheme}
                  onChange={(e) => setImportChapterTheme(e.target.value)}
                  placeholder="e.g. Grace through Faith or Refuge of Light"
                  className="w-full p-2.5 rounded-xl border bg-transparent font-serif"
                  style={{ borderColor: `${currentTone.primary}60` }}
                />
              </div>

              <div>
                <label className="block text-stone-500 mb-1">
                  Paste Scripture Verses (one verse per line, or with verse numbers):
                </label>
                <textarea
                  rows={6}
                  required
                  value={importTextContent}
                  onChange={(e) => setImportTextContent(e.target.value)}
                  placeholder="1. In the beginning...&#10;2. Through Him all things were made..."
                  className="w-full p-3 rounded-2xl border bg-transparent font-serif resize-none text-xs leading-relaxed"
                  style={{ borderColor: `${currentTone.primary}60` }}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-stone-300 text-xs font-serif"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full font-serif text-xs font-semibold"
                  style={{ backgroundColor: currentTone.primary, color: '#2C2520' }}
                >
                  Save to My Scriptures
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
