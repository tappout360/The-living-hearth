import React, { useState } from 'react';
import { useHearth } from '../context/HearthContext';
import { HEARTH_TONES } from '../data/mockData';
import { ambientAudio } from '../audio/ambientAudioEngine';
import type { AudioAtmosphereProfile } from '../types';
import {
  Volume2,
  VolumeX,
  Waves,
  Info,
  X,
} from 'lucide-react';

export const AmbientAudioBar: React.FC = () => {
  const {
    hearthTone,
    timeOfDay,
    ambientSettings,
    setAmbientSettings,
    selectedRoomId,
    rooms,
  } = useHearth();

  const currentTone = HEARTH_TONES[hearthTone];
  const [isOpen, setIsOpen] = useState(false);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const currentProfile = selectedRoom?.atmosphereProfile || ambientSettings.activeProfile;

  const toggleMasterAudio = () => {
    const nextState = !ambientSettings.isEnabled;
    setAmbientSettings((prev) => ({ ...prev, isEnabled: nextState }));

    if (nextState) {
      ambientAudio.start(currentProfile, ambientSettings.volume);
    } else {
      ambientAudio.stop();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAmbientSettings((prev) => ({ ...prev, volume: val }));
    ambientAudio.setVolume(val);
  };

  const handleProfileChange = (profile: AudioAtmosphereProfile) => {
    setAmbientSettings((prev) => ({ ...prev, activeProfile: profile }));
    ambientAudio.switchProfile(profile);
  };

  return (
    <div className="relative">
      {/* Subtle Soft Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all"
        style={{
          borderColor: currentTone.primary,
          backgroundColor: ambientSettings.isEnabled
            ? `${currentTone.primary}25`
            : timeOfDay === 'night'
            ? '#382F27'
            : '#FFFFFF',
          color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
        }}
        aria-label="Open Ambient Sound Sanctuary Controls"
        title="Ambient sound is optional and can be turned off at any time."
      >
        {ambientSettings.isEnabled ? (
          <Volume2 className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-stone-400" />
        )}
        <span className="hidden sm:inline text-[11px] font-serif">
          {ambientSettings.isEnabled ? 'Sound: On' : 'Sound: Off'}
        </span>
      </button>

      {/* Popover Controls Modal */}
      {isOpen && (
        <div
          role="region"
          aria-label="Ambient Sound Sanctuary Settings"
          className="absolute right-0 mt-2 w-72 rounded-3xl p-4 shadow-2xl border z-50 animate-in fade-in zoom-in-95 duration-200 text-xs space-y-4"
          style={{
            backgroundColor: timeOfDay === 'night' ? '#2A221C' : '#FFFFFF',
            borderColor: currentTone.primary,
            color: timeOfDay === 'night' ? '#F9F4EF' : '#2C2520',
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/20">
            <div className="flex items-center gap-1.5">
              <Waves className="w-4 h-4" style={{ color: currentTone.primary }} />
              <h3 className="font-serif font-medium m-0 text-sm">
                Ambient Sound Sanctuary
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-stone-500/20"
              aria-label="Close Sound Controls"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-serif font-medium block">Master Ambient Sound</span>
              <span className="text-[10px] text-stone-400">Soft meditative harmonic drone</span>
            </div>
            <button
              onClick={toggleMasterAudio}
              role="switch"
              aria-checked={ambientSettings.isEnabled}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                ambientSettings.isEnabled ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  ambientSettings.isEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Volume Slider */}
          {ambientSettings.isEnabled && (
            <div className="space-y-1.5 animate-in fade-in">
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>Sanctuary Volume</span>
                <span>{Math.round(ambientSettings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={ambientSettings.volume}
                onChange={handleVolumeChange}
                className="w-full accent-amber-500 cursor-pointer"
                aria-label="Ambient volume"
              />
            </div>
          )}

          {/* Room / Atmosphere Sonic Profiles */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-serif text-stone-400 block">
              Atmospheric Audio Profile:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'contemplative', label: 'Contemplative Drone' },
                { id: 'study', label: 'Clear Study Tone' },
                { id: 'interfaith', label: 'Interfaith Fifth' },
                { id: 'nature', label: 'Quiet Wind / Leaves' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProfileChange(p.id as AudioAtmosphereProfile)}
                  className={`px-2 py-1.5 rounded-xl border text-[10px] text-left transition-all ${
                    ambientSettings.activeProfile === p.id
                      ? 'font-semibold ring-1 shadow-xs'
                      : 'opacity-70'
                  }`}
                  style={{
                    borderColor: currentTone.primary,
                    backgroundColor:
                      ambientSettings.activeProfile === p.id
                        ? `${currentTone.primary}20`
                        : 'transparent',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fade on Interaction Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-stone-200/20 text-[11px]">
            <span className="text-stone-500">Fade volume when writing</span>
            <input
              type="checkbox"
              checked={ambientSettings.fadeOnInteraction}
              onChange={(e) =>
                setAmbientSettings((prev) => ({
                  ...prev,
                  fadeOnInteraction: e.target.checked,
                }))
              }
              className="rounded text-amber-600 focus:ring-amber-500"
            />
          </div>

          {/* Microcopy disclaimer */}
          <div className="p-2.5 rounded-xl bg-stone-500/5 text-[10px] text-stone-400 leading-relaxed flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              Ambient sound is optional, non-melodic, and contains no vocals or sacred hymns. Can be turned off at any time.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
