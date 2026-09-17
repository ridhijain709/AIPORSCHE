import React from 'react';
import { Sparkles, Sliders, FileText, Mic, Cpu, Users, Car, ChevronDown } from 'lucide-react';
import { VehicleConfig, ShowroomVehicle, ClientPersona } from '../types';
import { calculateVehicleQuote } from '../data/vehicleData';
import { audioManager } from '../utils/audioSpeech';

interface ShowroomHeaderProps {
  config: VehicleConfig;
  onOpenConfigurator: () => void;
  onOpenSpecs: () => void;
  onActivateVoice: () => void;
  isVoiceActive: boolean;
  onOpenAITools: () => void;
  showAvatars: boolean;
  onToggleAvatars: () => void;
  fleet: ShowroomVehicle[];
  activeCarId: string;
  onSelectFleetCar: (carId: string) => void;
  activePersona: ClientPersona;
}

export const ShowroomHeader: React.FC<ShowroomHeaderProps> = ({
  config,
  onOpenConfigurator,
  onOpenSpecs,
  onActivateVoice,
  isVoiceActive,
  onOpenAITools,
  showAvatars,
  onToggleAvatars,
  fleet,
  activeCarId,
  onSelectFleetCar,
  activePersona,
}) => {
  const quote = calculateVehicleQuote(config);

  return (
    <header className="fixed top-0 left-0 w-full z-20 pointer-events-none p-3 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      {/* Left Brand & Active Car Identity */}
      <div className="pointer-events-auto flex items-center gap-3 bg-neutral-950/85 backdrop-blur-xl p-2.5 sm:px-4 sm:py-3 rounded-2xl border border-neutral-800/90 shadow-2xl">
        {/* Porsche Gold Crest Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-md flex items-center justify-center shrink-0">
          <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
            <span className="font-serif font-black text-xs tracking-widest text-amber-400">P</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
              PORSCHE BERLIN EXCLUSIVE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
              {activePersona.name}
            </span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
            {config.modelName}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-neutral-400 font-mono">
              ${quote.totalPrice.toLocaleString()} MSRP
            </span>
            <span className="text-[10px] text-neutral-600">•</span>
            <span className="text-[11px] text-red-400 font-medium capitalize">
              {config.bodyColorName} ({config.finish})
            </span>
          </div>
        </div>
      </div>

      {/* Center Fleet Quick Switcher */}
      <div className="pointer-events-auto hidden md:flex items-center gap-1.5 bg-neutral-950/85 backdrop-blur-xl p-1.5 rounded-2xl border border-neutral-800/90 shadow-2xl">
        {fleet.map((car) => {
          const isActive = activeCarId === car.id;
          return (
            <button
              key={car.id}
              onClick={() => {
                onSelectFleetCar(car.id);
                audioManager.playChime(600, 800, 0.08);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-neutral-800 text-white border border-neutral-700 shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: car.color }} />
              <span>{car.name.replace('Porsche ', '')}</span>
            </button>
          );
        })}
      </div>

      {/* Right Action Bar */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-neutral-950/85 backdrop-blur-xl p-1.5 rounded-2xl border border-neutral-800/90 shadow-2xl">
        {/* Dealership AI Tools & Automation Suite */}
        <button
          onClick={() => {
            onOpenAITools();
            audioManager.playChime(700, 950, 0.1);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all"
        >
          <Cpu className="w-4 h-4 text-white animate-pulse" />
          <span className="hidden lg:inline">AI Dealership Suite</span>
          <span className="lg:hidden">AI Tools</span>
        </button>

        {/* 3D Avatars Toggle */}
        <button
          onClick={() => {
            onToggleAvatars();
            audioManager.playChime(500, 650, 0.08);
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
            showAvatars 
              ? 'bg-neutral-800 text-emerald-400 border border-neutral-700' 
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
          title="Toggle 3D Avatars (Marcus AI Clone & Alexander VIP)"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">3D Avatars {showAvatars ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={onActivateVoice}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            isVoiceActive
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
              : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">AI Voice</span>
        </button>

        <button
          onClick={onOpenConfigurator}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-200 text-xs font-medium transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline">Customize</span>
        </button>

        <button
          onClick={onOpenSpecs}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-200 text-xs font-medium transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline">Quote</span>
        </button>
      </div>
    </header>
  );
};
