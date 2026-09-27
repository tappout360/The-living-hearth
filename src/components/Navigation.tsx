import React from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { LayoutDashboard, Users, BookOpen, User, Sparkles } from 'lucide-react';
import { ConcentricRings } from './SacredGeometry';

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    timeOfDay,
    hearthTone,
    t,
    setIsPrayComposerOpen,
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];

  return (
    <nav
      role="navigation"
      aria-label="Sanctuary Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md transition-colors duration-500 pb-safe"
      style={{
        borderColor: 'rgba(232, 168, 124, 0.2)',
        backgroundColor:
          timeOfDay === 'night'
            ? 'rgba(38, 32, 28, 0.94)'
            : 'rgba(253, 246, 240, 0.94)',
      }}
    >
      <div className="max-w-xl mx-auto px-4 py-2 flex items-center justify-between relative">
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-2xl transition-all duration-300 ${
            activeTab === 'dashboard' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'dashboard' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="Dashboard - Personal Faith Sanctuary"
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
        >
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span className="text-[11px] tracking-tight">{t('navDashboard')}</span>
        </button>

        {/* Rooms */}
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-2xl transition-all duration-300 ${
            activeTab === 'rooms' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'rooms' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="Rooms - Moderated Tradition and Interfaith Circles"
          aria-current={activeTab === 'rooms' ? 'page' : undefined}
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-[11px] tracking-tight">{t('navRooms')}</span>
        </button>

        {/* Floating Pray Button (Sacred Center) */}
        <div className="relative -top-5 flex flex-col items-center">
          <div className="relative">
            {/* Concentric rings halo */}
            <div className="absolute inset-0 -m-2 pointer-events-none flex items-center justify-center">
              <ConcentricRings size={76} ringsCount={2} glowColor={currentTone.primary} className="animate-breath" />
            </div>

            <button
              onClick={() => setIsPrayComposerOpen(true)}
              className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-108 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
              style={{
                backgroundColor: currentTone.primary,
                boxShadow: `0 8px 24px ${currentTone.glow}`,
                color: '#2C2520',
              }}
              title="Offer or record a prayer or positive intention"
              aria-label="Floating Pray Button - Expand Prayer and Intention Sanctuary"
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
            </button>
          </div>
          <span
            className="text-[10px] font-serif font-medium mt-1 uppercase tracking-widest"
            style={{ color: currentTone.primary }}
          >
            {t('navPray')}
          </span>
        </div>

        {/* Learn */}
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-2xl transition-all duration-300 ${
            activeTab === 'learn' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'learn' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="Learn - Interfaith and Tradition Learning Paths"
          aria-current={activeTab === 'learn' ? 'page' : undefined}
        >
          <BookOpen className="w-5 h-5 mb-1" />
          <span className="text-[11px] tracking-tight">{t('navLearn')}</span>
        </button>

        {/* Profile / Safety */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-2xl transition-all duration-300 ${
            activeTab === 'profile' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'profile' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="Profile and Safety Sanctuary Controls"
          aria-current={activeTab === 'profile' ? 'page' : undefined}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-[11px] tracking-tight">{t('navProfile')}</span>
        </button>
      </div>
    </nav>
  );
};
