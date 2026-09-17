import React from 'react';
import { 
  RotateCw, 
  Car, 
  Disc, 
  Cpu, 
  Compass, 
  Maximize, 
  Layers,
  ArrowUpCircle
} from 'lucide-react';
import { CameraPreset } from '../types';
import { audioManager } from '../utils/audioSpeech';

interface CameraPresetsBarProps {
  currentPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
  isAutoRotating: boolean;
  onToggleAutoRotate: () => void;
}

export const CameraPresetsBar: React.FC<CameraPresetsBarProps> = ({
  currentPreset,
  onSelectPreset,
  isAutoRotating,
  onToggleAutoRotate,
}) => {
  const PRESETS: { id: CameraPreset; label: string; icon: React.ReactNode }[] = [
    { id: 'showroom_overview', label: 'Showroom Floor', icon: <Maximize className="w-3.5 h-3.5 text-blue-400" /> },
    { id: 'hero', label: 'Center Stage', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'taycan_bay', label: 'Taycan EV Bay', icon: <Car className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'gt4_bay', label: 'GT3 RS Wing', icon: <Car className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'owner_desk', label: 'AI Clone Desk', icon: <Cpu className="w-3.5 h-3.5 text-red-400" /> },
    { id: 'front', label: 'Front Grille', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'side', label: 'Profile', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'rear', label: 'Rear Diffuser', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'engine', label: 'Boxer Engine', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'wheel_detail', label: 'Forged Wheels', icon: <Disc className="w-3.5 h-3.5" /> },
    { id: 'interior', label: 'Cockpit', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'top', label: 'Birdseye', icon: <ArrowUpCircle className="w-3.5 h-3.5" /> },
  ];

  const handlePresetClick = (preset: CameraPreset) => {
    audioManager.playChime(640, 780, 0.06);
    onSelectPreset(preset);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-950/85 backdrop-blur-xl border border-neutral-800/90 shadow-2xl max-w-[95vw] overflow-x-auto no-scrollbar">
      {/* Auto Rotate Turntable Toggle */}
      <button
        onClick={onToggleAutoRotate}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          isAutoRotating
            ? 'bg-red-600 text-white shadow-md'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/70'
        }`}
        title={isAutoRotating ? 'Stop 360° Turntable' : 'Start 360° Turntable'}
      >
        <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">Turntable</span>
      </button>

      <div className="w-px h-5 bg-neutral-800 mx-1" />

      {/* Preset Camera Angles */}
      {PRESETS.map((p) => {
        const isActive = currentPreset === p.id;
        return (
          <button
            key={p.id}
            onClick={() => handlePresetClick(p.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
              isActive
                ? 'bg-neutral-800 text-white font-semibold shadow-inner border border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
            }`}
          >
            {p.icon}
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
};
