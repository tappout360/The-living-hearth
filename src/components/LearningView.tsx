import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { COMPREHENSIVE_LEARNING_PATHS, LIVING_INVENTORY_TRADITIONS } from '../data/learningPathsData';
import type {
  ComprehensiveLearningPath,
  PathLevelName,
  SubLesson,
  TraditionCategory,
} from '../types';
import {
  BookOpen,
  ArrowLeft,
  Clock,
  CheckCircle,
  Bookmark,
  Sparkles,
  ChevronRight,
  Feather,
  Search,
  CheckCircle2,
  Compass,
  PlusCircle,
  X,
} from 'lucide-react';

export const LearningView: React.FC = () => {
  const { hearthTone, timeOfDay, setIsPrayComposerOpen } = useHearth();
  const currentTone = HEARTH_TONES[hearthTone];

  // Active top-level mode: 'paths' or 'inventory' (Leave Out None roadmap)
  const [activeViewTab, setActiveViewTab] = useState<'paths' | 'inventory'>('paths');

  // Paths state
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<PathLevelName>('Beginner');
  const [selectedLesson, setSelectedLesson] = useState<SubLesson | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [savedLessons, setSavedLessons] = useState<string[]>([]);

  // Inventory state
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState<string>('All');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestedTraditionName, setRequestedTraditionName] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const selectedPath: ComprehensiveLearningPath | undefined = COMPREHENSIVE_LEARNING_PATHS.find(
    (p) => p.id === selectedPathId
  );

  const handleToggleSaveLesson = (lessonId: string) => {
    setSavedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const handleRequestTradition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedTraditionName.trim()) return;
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setIsRequestModalOpen(false);
      setRequestedTraditionName('');
    }, 2500);
  };

  const categories: TraditionCategory[] = [
    'Abrahamic & Related',
    'Dharmic / Indian-Origin',
    'East Asian & Related',
    'Indigenous & Traditional',
    'Spiritualism & Spiritism',
    'Modern, Interfaith & Contemplative',
  ];

  const filteredPaths = COMPREHENSIVE_LEARNING_PATHS.filter((p) => {
    if (activeCategoryFilter === 'All') return true;
    return p.category === activeCategoryFilter;
  });

  const filteredInventory = LIVING_INVENTORY_TRADITIONS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.category.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.notes.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesStatus =
      inventoryStatusFilter === 'All' || item.coverageStatus === inventoryStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // 1. Detailed Lesson Reader Modal
  if (selectedLesson && selectedPath) {
    const isSaved = savedLessons.includes(selectedLesson.id);
    return (
      <div className="space-y-6 pb-24 animate-in fade-in duration-300">
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4"
          style={{
            borderColor: 'rgba(232, 168, 124, 0.25)',
            backgroundColor: timeOfDay === 'night' ? '#2E2620' : '#FFFFFF',
          }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedLesson(null)}
              className="inline-flex items-center gap-1.5 text-xs font-serif text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              aria-label="Back to path lessons"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {selectedPath.title}
            </button>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
              {selectedLevel} • {selectedLesson.estimatedMinutes} min
            </span>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider font-serif text-stone-400">
              {selectedPath.tradition} • Lesson Overview
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-snug mt-1 m-0">
              {selectedLesson.title}
            </h2>
          </div>

          <div className="p-5 rounded-2xl bg-stone-500/5 border border-stone-200/20 text-stone-700 dark:text-stone-300 space-y-3 font-serif text-sm sm:text-base leading-relaxed">
            <p>{selectedLesson.summary}</p>
          </div>

          {/* Internal Diversity & Perspectives Note */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-serif font-semibold text-amber-700 dark:text-amber-300">
              <Compass className="w-4 h-4" />
              <span>Internal Diversity & Living Perspectives</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
              {selectedLesson.internalDiversityNotes}
            </p>
          </div>

          {/* Scholarly Citations */}
          <div className="p-4 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-serif text-stone-500 font-semibold">
              <Feather className="w-3.5 h-3.5" style={{ color: currentTone.primary }} />
              <span>Scholarly Sourcing & Review:</span>
            </div>
            <ul className="text-xs text-stone-500 list-disc list-inside space-y-0.5 font-sans">
              {selectedPath.scholarlyCitations.map((cite, i) => (
                <li key={i}>{cite}</li>
              ))}
            </ul>
            <div className="text-[10px] text-stone-400 pt-1">
              Last scholarly peer-review: {selectedPath.lastScholarlyReviewDate}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/20 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleSaveLesson(selectedLesson.id)}
                className="px-4 py-2 rounded-full border border-stone-300/40 hover:border-amber-400 flex items-center gap-1.5 font-serif"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-amber-500' : ''}`} />
                <span>{isSaved ? 'Saved to Sanctuary' : 'Save Lesson'}</span>
              </button>
              <button
                onClick={() => setIsPrayComposerOpen(true)}
                className="px-4 py-2 rounded-full border border-stone-300/40 hover:border-amber-400 flex items-center gap-1.5 font-serif"
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: currentTone.primary }} />
                <span>Add Intention to Prayer Vault</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs">
              <CheckCircle className="w-4 h-4" />
              <span>Lesson Complete</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Path Level & Lessons Overview View
  if (selectedPath) {
    const activeLevelGroup = selectedPath.levelGroups.find((g) => g.level === selectedLevel) || selectedPath.levelGroups[0];

    return (
      <div className="space-y-6 pb-24 animate-in fade-in duration-300">
        <div
          className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4"
          style={{
            borderColor: 'rgba(232, 168, 124, 0.25)',
            backgroundColor: timeOfDay === 'night' ? '#2E2620' : '#FFFFFF',
          }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedPathId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-serif text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              aria-label="Back to all learning paths"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to All Learning Paths
            </button>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono">
              Peer-Reviewed Curriculum
            </span>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider font-serif text-stone-400">
              {selectedPath.category} • {selectedPath.tradition}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-snug mt-1 m-0">
              {selectedPath.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-2xl leading-relaxed">
              {selectedPath.shortDescription}
            </p>
          </div>

          {/* What You Will Learn (Outcomes) */}
          <div className="p-4 rounded-2xl bg-stone-500/5 border border-stone-200/20 space-y-2">
            <span className="text-xs font-serif font-semibold text-stone-600 dark:text-stone-300 block">
              What You Will Learn (Outcomes):
            </span>
            <ul className="text-xs text-stone-500 space-y-1 font-sans">
              {selectedPath.learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-600 shrink-0" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Level Tabs (Beginner -> Intermediate -> Deeper Exploration) */}
          <div className="flex items-center gap-2 pt-2 border-t border-stone-200/20 overflow-x-auto scrollbar-none">
            {selectedPath.levelGroups.map((group) => (
              <button
                key={group.level}
                onClick={() => setSelectedLevel(group.level)}
                className={`px-4 py-2 rounded-full text-xs font-serif shrink-0 transition-all ${
                  selectedLevel === group.level ? 'font-semibold shadow-xs' : 'opacity-60 hover:opacity-90'
                }`}
                style={{
                  backgroundColor:
                    selectedLevel === group.level ? currentTone.primary : 'transparent',
                  color: selectedLevel === group.level ? '#2C2520' : 'inherit',
                  border: `1px solid ${currentTone.primary}50`,
                }}
              >
                {group.level} ({group.estimatedTime})
              </button>
            ))}
          </div>
        </div>

        {/* List of Lessons for Selected Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2 text-xs font-serif text-stone-400">
            <span>
              {selectedLevel} Modules ({activeLevelGroup.lessons.length} lessons)
            </span>
            <span>Total Duration: {activeLevelGroup.estimatedTime}</span>
          </div>

          {activeLevelGroup.lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedLesson(lesson);
              }}
              className="group p-5 rounded-3xl border shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-101 flex items-start justify-between gap-4"
              style={{
                borderColor: 'rgba(232, 168, 124, 0.25)',
                backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFDFB',
              }}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-serif text-xs font-semibold"
                  style={{
                    backgroundColor: `${currentTone.primary}20`,
                    border: `1.5px solid ${currentTone.primary}`,
                  }}
                >
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.estimatedMinutes} min
                    </span>
                    {lesson.comparativeLinks && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                        Comparative Links
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base font-normal leading-snug group-hover:underline m-0">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {lesson.summary}
                  </p>
                </div>
              </div>

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 self-center transition-transform group-hover:translate-x-1"
                style={{
                  backgroundColor: `${currentTone.primary}18`,
                  color: currentTone.primary,
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Main Learning Center View with "Leave Out None" Mandate
  return (
    <div className="space-y-8 pb-24">
      {/* Banner with Leave Out None Mandate */}
      <div
        className="rounded-3xl p-6 sm:p-8 border shadow-xs space-y-4"
        style={{
          borderColor: 'rgba(232, 168, 124, 0.25)',
          backgroundColor: timeOfDay === 'night' ? '#2F2620' : '#FFFFFF',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5" style={{ color: currentTone.primary }} />
            <h2 className="font-serif text-2xl font-normal leading-snug m-0">
              The Learning Sanctuary
            </h2>
          </div>

          {/* Mode Switcher: Active Paths vs Living Inventory */}
          <div className="flex items-center gap-1.5 p-1 rounded-full border border-stone-200/20 bg-stone-500/5 text-xs">
            <button
              onClick={() => setActiveViewTab('paths')}
              className={`px-4 py-1.5 rounded-full font-serif transition-all ${
                activeViewTab === 'paths' ? 'font-semibold shadow-xs' : 'opacity-70'
              }`}
              style={{
                backgroundColor: activeViewTab === 'paths' ? currentTone.primary : 'transparent',
                color: activeViewTab === 'paths' ? '#2C2520' : 'inherit',
              }}
            >
              Curated Paths ({COMPREHENSIVE_LEARNING_PATHS.length})
            </button>
            <button
              onClick={() => setActiveViewTab('inventory')}
              className={`px-4 py-1.5 rounded-full font-serif transition-all ${
                activeViewTab === 'inventory' ? 'font-semibold shadow-xs' : 'opacity-70'
              }`}
              style={{
                backgroundColor: activeViewTab === 'inventory' ? currentTone.primary : 'transparent',
                color: activeViewTab === 'inventory' ? '#2C2520' : 'inherit',
              }}
            >
              Living Inventory • Leave Out None
            </button>
          </div>
        </div>

        {/* Maximal Inclusivity Mandate ("Leave Out None") Covenant */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
          <span className="font-serif font-semibold text-amber-700 dark:text-amber-300 block">
            ★ Maximal Inclusivity Mandate (“Leave Out None”)
          </span>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
            No spiritual, religious, indigenous, or philosophical tradition that has attracted a community of practitioners is permanently excluded. All traditions—from major world religions to Spiritualism & Spiritism, Indigenous lifeways, and contemporary paths—are presented with equal scholarly rigor, multiple internal perspectives, and zero proselytizing.
          </p>
        </div>
      </div>

      {/* VIEW TAB 1: CURATED LEARNING PATHS */}
      {activeViewTab === 'paths' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-serif shrink-0 transition-all ${
                  activeCategoryFilter === cat ? 'font-semibold shadow-xs' : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor:
                    activeCategoryFilter === cat ? `${currentTone.primary}25` : 'transparent',
                  borderColor: currentTone.primary,
                  border: '1px solid',
                  color: activeCategoryFilter === cat ? currentTone.primary : 'inherit',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Learning Paths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPaths.map((path) => (
              <div
                key={path.id}
                onClick={() => {
                  setSelectedPathId(path.id);
                  setSelectedLevel('Beginner');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedPathId(path.id);
                    setSelectedLevel('Beginner');
                  }
                }}
                className="group p-6 rounded-3xl border shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 hover:scale-101 flex flex-col justify-between"
                style={{
                  borderColor: 'rgba(232, 168, 124, 0.25)',
                  backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFDFB',
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-serif tracking-wider text-stone-400">
                      {path.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono">
                      {path.levelGroups.length} Levels
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-normal leading-snug group-hover:underline m-0">
                    {path.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                    {path.shortDescription}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-200/20 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">
                    {path.levelGroups.reduce((acc, curr) => acc + curr.lessons.length, 0)} Modular Lessons
                  </span>
                  <span
                    className="font-serif font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    style={{ color: currentTone.primary }}
                  >
                    Enter Pathway →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW TAB 2: LIVING INVENTORY ("LEAVE OUT NONE") ROADMAP */}
      {activeViewTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search any tradition, path, or school... (Leave Out None)"
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-stone-500/5 border border-stone-200/30 text-xs font-serif placeholder-stone-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={inventoryStatusFilter}
                onChange={(e) => setInventoryStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-stone-500/5 border border-stone-200/30 text-xs font-serif"
              >
                <option value="All">All Coverage Statuses</option>
                <option value="Live">Live (Full Curriculum)</option>
                <option value="In Research">In Research / Drafting</option>
                <option value="Queued">Queued for Inclusion</option>
                <option value="Needs Expert Partner">Needs Expert Partner</option>
              </select>

              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="px-4 py-2 rounded-2xl font-serif text-xs font-medium flex items-center gap-1.5 shrink-0 shadow-xs"
                style={{
                  backgroundColor: currentTone.primary,
                  color: '#2C2520',
                }}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Suggest a Tradition</span>
              </button>
            </div>
          </div>

          {/* Public Living Inventory Table / Cards */}
          <div className="space-y-3">
            <div className="text-xs font-serif text-stone-400 px-2 flex justify-between">
              <span>Traditions Catalogued ({filteredInventory.length})</span>
              <span>Every tradition is welcomed with academic care</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInventory.map((item) => {
                const statusColor =
                  item.coverageStatus === 'Live'
                    ? 'text-emerald-600 bg-emerald-500/10'
                    : item.coverageStatus === 'In Research'
                    ? 'text-amber-600 bg-amber-500/10'
                    : item.coverageStatus === 'Needs Expert Partner'
                    ? 'text-rose-600 bg-rose-500/10'
                    : 'text-stone-500 bg-stone-500/10';

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl border shadow-xs space-y-3 flex flex-col justify-between"
                    style={{
                      borderColor: 'rgba(232, 168, 124, 0.25)',
                      backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFDFB',
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-serif tracking-wider text-stone-400">
                          {item.category}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-medium ${statusColor}`}>
                          {item.coverageStatus}
                        </span>
                      </div>

                      <h4 className="font-serif text-base font-normal leading-snug m-0">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {item.notes}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-200/20 text-[11px] text-stone-400 flex flex-col gap-1">
                      <div>
                        <strong>Community Presence: </strong>
                        <span>{item.communityPresence}</span>
                      </div>
                      {item.scholarlyPartnership && (
                        <div className="text-stone-500">
                          <strong>Academic Link: </strong>
                          <span>{item.scholarlyPartnership}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Suggest / Request a Tradition Modal */}
      {isRequestModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4"
            style={{
              backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFFFF',
              borderColor: currentTone.primary,
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-normal m-0">
                Suggest a Tradition to Include
              </h3>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1 rounded-full hover:bg-stone-500/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Under our <strong>Leave Out None</strong> mandate, community submissions directly prioritize our research roadmap and scholarly outreach.
            </p>

            {requestSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-600 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Thank you. This tradition has been queued for scholarly intake!</span>
              </div>
            ) : (
              <form onSubmit={handleRequestTradition} className="space-y-3 text-xs">
                <div>
                  <label className="font-serif block font-medium mb-1">
                    Tradition Name or Lineage:
                  </label>
                  <input
                    type="text"
                    value={requestedTraditionName}
                    onChange={(e) => setRequestedTraditionName(e.target.value)}
                    placeholder="e.g. Jainism, Yezidism, Shinto, Druidry..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-transparent text-xs"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-stone-300 text-xs font-serif"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full font-serif text-xs font-medium"
                    style={{
                      backgroundColor: currentTone.primary,
                      color: '#2C2520',
                    }}
                  >
                    Queue for Inclusion
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
