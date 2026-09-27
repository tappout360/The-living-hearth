import React from 'react';
import { HearthProvider, useHearth } from './context/HearthContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { RoomsView } from './components/RoomsView';
import { LearningView } from './components/LearningView';
import { ProfileSafetyView } from './components/ProfileSafetyView';
import { OnboardingModal } from './components/OnboardingModal';
import { PrayComposerModal } from './components/PrayComposerModal';
import { InvitationsModal } from './components/InvitationsModal';
import { PrayerDetailModal } from './components/PrayerDetailModal';
import { SanctuaryProtocolModal } from './components/SanctuaryProtocolModal';
import { LivingLightField } from './components/LivingLightField';
import { SUPPORTED_LANGUAGES } from './i18n/languages';
import './App.css';

const MainSanctuary: React.FC = () => {
  const { timeOfDay, activeTab, accessibility, currentLanguage } = useHearth();

  const activeLangConfig = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  const isRTL = activeLangConfig.dir === 'rtl';

  // Dynamic time-of-day background color mapping
  const getBackgroundColor = () => {
    switch (timeOfDay) {
      case 'dawn':
        return '#FDF6F0';
      case 'day':
        return '#F9F4EF';
      case 'dusk':
        return '#F5EDE6';
      case 'night':
        return '#2C2520';
    }
  };

  const getTextColor = () => {
    if (accessibility.highContrast) {
      return timeOfDay === 'night' ? '#FFFFFF' : '#000000';
    }
    return timeOfDay === 'night' ? '#F9F4EF' : '#2C2520';
  };

  const getAtmosphereMode = () => {
    switch (activeTab) {
      case 'learn':
        return 'learning';
      case 'rooms':
        return 'practice';
      case 'dashboard':
      default:
        return 'dashboard';
    }
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col transition-colors duration-700 font-sans relative"
      style={{
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        fontSize: `${accessibility.fontSizePercent}%`,
      }}
    >
      {/* Abstract Living Light Field Background with Room-Specific Atmospheric Layer */}
      <LivingLightField atmosphereMode={getAtmosphereMode()} />

      <Header />

      {/* Main Content Area bounded to Sacred Golden Proportion max-w (720px - 820px) */}
      <main
        role="main"
        className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 pb-28 focus:outline-none relative z-10"
        tabIndex={-1}
      >
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'rooms' && <RoomsView />}
        {activeTab === 'learn' && <LearningView />}
        {activeTab === 'profile' && <ProfileSafetyView />}
      </main>

      <Navigation />
      <OnboardingModal />
      <PrayComposerModal />
      <InvitationsModal />
      <PrayerDetailModal />
      <SanctuaryProtocolModal />
    </div>
  );
};

export default function App() {
  return (
    <HearthProvider>
      <MainSanctuary />
    </HearthProvider>
  );
}
