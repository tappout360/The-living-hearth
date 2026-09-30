import React from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { LayoutDashboard, Users, BookOpen, User, Sparkles, BookMarked, Radio, ShoppingBag, Crown } from 'lucide-react';
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
      <div className="max-w-3xl mx-auto px-1 sm:px-4 py-1.5 flex items-center justify-around relative">
        {/* Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[34px] sm:min-w-[46px] min-h-[44px] rounded-2xl transition-all duration-300 ${
            activeTab === 'dashboard' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'dashboard' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="Dashboard - Personal Faith Sanctuary"
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
        >
          <LayoutDashboard className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] tracking-tight">{t('navDashboard')}</span>
        </button>

        {/* Rooms */}
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex flex-col items-center justify-center min-w-[34px] sm:min-w-[46px] min-h-[44px] rounded-2xl transition-all duration-300 ${
            activeTab === 'rooms' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'rooms' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="Rooms - Moderated Circles"
          aria-current={activeTab === 'rooms' ? 'page' : undefined}
        >
          <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] tracking-tight">{t('navRooms')}</span>
        </button>

        {/* Scripture Study */}
        <button
          onClick={() => setActiveTab('scripture')}
          className={`flex flex-col items-center justify-center min-w-[34px] sm:min-w-[46px] min-h-[44px] rounded-2xl transition-all duration-300 ${
            activeTab === 'scripture' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'scripture' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="Scripture Study & Highlighting"
          aria-current={activeTab === 'scripture' ? 'page' : undefined}
        >
          <BookMarked className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] tracking-tight">Scripture</span>
        </button>

        {/* Floating Pray Button (Sacred Center) */}
        <div className="relative -top-3 sm:-top-4 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 -m-2 pointer-events-none flex items-center justify-center">
              <ConcentricRings size={62} ringsCount={2} glowColor={currentTone.primary} className="animate-breath" />
            </div>

            <button
              onClick={() => setIsPrayComposerOpen(true)}
              className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-108 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
              style={{
                backgroundColor: currentTone.primary,
                boxShadow: `0 8px 24px ${currentTone.glow}`,
                color: '#2C2520',
              }}
              title="Offer or record a prayer or positive intention"
              aria-label="Floating Pray Button - Expand Prayer and Intention Sanctuary"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </button>
          </div>
          <span
            className="text-[8px] sm:text-[9px] font-serif font-medium mt-0.5 uppercase tracking-widest"
            style={{ color: currentTone.primary }}
          >
            {t('navPray')}
          </span>
        </div>

        {/* Church Streams & Classes */}
        <button
          onClick={() => setActiveTab('churches')}
          className={`flex flex-col items-center justify-center min-w-[34px] sm:min-w-[46px] min-h-[44px] rounded-2xl transition-all duration-300 ${
            activeTab === 'churches' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'churches' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="Churches & Sacred Streams"
          aria-current={activeTab === 'churches' ? 'page' : undefined}
        >
          <Radio className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] tracking-tight">Streams</span>
        </button>

        {/* Sacred Store */}
        <button
          onClick={() => setActiveTab('store')}
          className={`flex flex-col items-center justify-center min-w-[34px] sm:min-w-[46px] min-h-[44px] rounded-2xl transition-all duration-300 ${
            activeTab === 'store' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'store' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="Sacred Store & Study Materials"
          aria-current={activeTab === 'store' ? 'page' : undefined}
        >
          <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] tracking-tight">Store</span>
        </button>

        {/* Patronage / Plans */}
        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex flex-col items-center justify-center min-w-[34px] sm:min-w-[46px] min-h-[44px] rounded-2xl transition-all duration-300 ${
            activeTab === 'subscription' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'subscription' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="Sanctuary Patronage & Subscription Details"
          aria-current={activeTab === 'subscription' ? 'page' : undefined}
        >
          <Crown className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] tracking-tight">Plans</span>
        </button>

        {/* Learn / Library */}
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex flex-col items-center justify-center min-w-[34px] sm:min-w-[46px] min-h-[44px] rounded-2xl transition-all duration-300 ${
            activeTab === 'learn' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'learn' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="The Library - Interfaith Learning"
          aria-current={activeTab === 'learn' ? 'page' : undefined}
        >
          <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] tracking-tight">Library</span>
        </button>

        {/* Profile / Safety */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center min-w-[34px] sm:min-w-[46px] min-h-[44px] rounded-2xl transition-all duration-300 ${
            activeTab === 'profile' ? 'scale-105 font-medium' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            color: activeTab === 'profile' ? currentTone.primary : timeOfDay === 'night' ? '#DFD7CF' : '#5C544E',
          }}
          aria-label="Profile and Safety Sanctuary Controls"
          aria-current={activeTab === 'profile' ? 'page' : undefined}
        >
          <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5" />
          <span className="text-[9px] sm:text-[10px] tracking-tight">{t('navProfile')}</span>
        </button>
      </div>
    </nav>
  );
};
