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
import './App.css';

const MainSanctuary: React.FC = () => {
  const { timeOfDay, activeTab, accessibility } = useHearth();

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

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-700 font-sans"
      style={{
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        fontSize: `${accessibility.fontSizePercent}%`,
      }}
    >
      <Header />

      {/* Main Content Area bounded to Sacred Golden Proportion max-w (720px - 820px) */}
      <main
        role="main"
        className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 pb-28 focus:outline-none"
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
