import React from 'react';
import { 
  Palette, 
  Disc, 
  ShieldAlert, 
  Layers, 
  Sliders, 
  Eye, 
  DoorOpen, 
  Lightbulb, 
  Wind,
  Check
} from 'lucide-react';
import { VehicleConfig, PaintFinish, RimStyle } from '../types';
import { 
  COLOR_PRESETS, 
  RIM_PRESETS, 
  RIM_COLORS, 
  CALIPER_COLORS, 
  INTERIOR_COLORS,
  PORSCHE_MODELS
} from '../data/vehicleData';
import { audioManager } from '../utils/audioSpeech';

interface VehicleConfiguratorPanelProps {
  config: VehicleConfig;
  onChange: (updated: Partial<VehicleConfig>) => void;
  isOpen: boolean;
  onToggle: () => void;
  onOpenSpecs: () => void;
}

export const VehicleConfiguratorPanel: React.FC<VehicleConfiguratorPanelProps> = ({
  config,
  onChange,
  isOpen,
  onToggle,
  onOpenSpecs,
}) => {
  const [activeTab, setActiveTab] = React.useState<'exterior' | 'wheels' | 'interior' | 'mechanics'>('exterior');

  const handleFinishChange = (finish: PaintFinish) => {
    audioManager.playChime(600, 700, 0.08);
    onChange({ finish });
  };

  const handleColorSelect = (colorHex: string, name: string, defaultFinish?: PaintFinish) => {
    audioManager.playChime(550, 750, 0.1);
    onChange({ 
      bodyColor: colorHex, 
      bodyColorName: name,
      finish: defaultFinish || config.finish
    });
  };

  const handleRimStyleSelect = (rimStyle: RimStyle) => {
    audioManager.playChime(500, 650, 0.08);
    onChange({ rimStyle });
  };

  const handleRimColorSelect = (rimColor: string, rimColorName: string) => {
    audioManager.playChime(520, 680, 0.08);
    onChange({ rimColor, rimColorName });
  };

  const handleCaliperSelect = (caliperColor: string, caliperColorName: string) => {
    audioManager.playChime(580, 720, 0.08);
    onChange({ caliperColor, caliperColorName });
  };

  const handleInteriorSelect = (interiorColor: string, interiorColorName: string) => {
    audioManager.playChime(500, 600, 0.08);
    onChange({ interiorColor, interiorColorName });
  };

  const toggleSpoiler = () => {
    audioManager.playHydraulicAeroSound();
    onChange({ spoilerActive: !config.spoilerActive });
  };

  const toggleHeadlights = () => {
    audioManager.playChime(700, 900, 0.05);
    onChange({ headlightsOn: !config.headlightsOn });
  };

  const toggleDoors = () => {
    audioManager.playHydraulicAeroSound();
    onChange({ doorsOpen: !config.doorsOpen });
  };

  const toggleExploded = () => {
    audioManager.playEngineRevSound();
    onChange({ explodedView: !config.explodedView });
  };

  return (
    <>
      {/* Drawer Toggle Button when collapsed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-20 left-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-white shadow-xl backdrop-blur-md transition-all text-xs font-semibold"
        >
          <Sliders className="w-4 h-4 text-red-500" />
          <span>Manual Configurator</span>
        </button>
      )}

      {/* Main Left Drawer */}
      <div
        className={`fixed top-0 left-0 z-30 h-full w-[380px] max-w-[90vw] bg-neutral-950/95 border-r border-neutral-800/90 backdrop-blur-2xl shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">PORSCHE EXCLUSIVE MANUFAKTUR</span>
            <h2 className="text-base font-bold text-white tracking-tight">Studio Configurator</h2>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs"
          >
            ✕
          </button>
        </div>

        {/* Model Selector Bar */}
        <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/40">
          <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block mb-1.5">
            Vehicle Model
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {PORSCHE_MODELS.map((m) => {
              const active = config.modelId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    audioManager.playEngineRevSound();
                    onChange({ modelId: m.id, modelName: m.name });
                  }}
                  className={`py-2 px-1 text-center rounded-lg text-[11px] font-medium transition-all ${
                    active
                      ? 'bg-red-600 text-white font-semibold shadow-md'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                  }`}
                >
                  {m.id === '911_carrera_gts' ? '911 Carrera' : m.id === '911_gt3_rs' ? '911 GT3 RS' : 'Taycan GT'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/60 text-xs">
          <button
            onClick={() => setActiveTab('exterior')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors border-b-2 ${
              activeTab === 'exterior'
                ? 'border-red-500 text-white bg-neutral-800/40'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Exterior</span>
          </button>
          <button
            onClick={() => setActiveTab('wheels')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors border-b-2 ${
              activeTab === 'wheels'
                ? 'border-red-500 text-white bg-neutral-800/40'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Wheels</span>
          </button>
          <button
            onClick={() => setActiveTab('interior')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors border-b-2 ${
              activeTab === 'interior'
                ? 'border-red-500 text-white bg-neutral-800/40'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cockpit</span>
          </button>
          <button
            onClick={() => setActiveTab('mechanics')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors border-b-2 ${
              activeTab === 'mechanics'
                ? 'border-red-500 text-white bg-neutral-800/40'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Aero & Tech</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-neutral-800">
          {/* TAB 1: EXTERIOR */}
          {activeTab === 'exterior' && (
            <div className="space-y-4">
              {/* Finish Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-200">Paint Finish</span>
                  <span className="text-[11px] font-mono text-neutral-400 uppercase">{config.finish}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['glossy', 'metallic', 'matte'] as PaintFinish[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => handleFinishChange(f)}
                      className={`py-1.5 text-xs rounded-lg capitalize border transition-all ${
                        config.finish === f
                          ? 'border-red-500 bg-red-950/40 text-white font-medium'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-neutral-200">Paint Color</span>
                  <span className="text-xs text-red-400 font-medium">{config.bodyColorName}</span>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {COLOR_PRESETS.map((color) => {
                    const isSelected = config.bodyColor.toLowerCase() === color.hex.toLowerCase();
                    return (
                      <button
                        key={color.name}
                        onClick={() => handleColorSelect(color.hex, color.name, color.finish)}
                        className={`group flex flex-col items-center p-2 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-red-500 bg-neutral-900 shadow-md ring-1 ring-red-500/50'
                            : 'border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-900'
                        }`}
                        title={color.name}
                      >
                        <div
                          className="w-8 h-8 rounded-full border border-white/20 shadow-inner flex items-center justify-center transition-transform group-hover:scale-105"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                        </div>
                        <span className="text-[10px] text-neutral-300 mt-1.5 text-center leading-tight truncate w-full">
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHEELS */}
          {activeTab === 'wheels' && (
            <div className="space-y-4">
              {/* Wheel Rim Designs */}
              <div>
                <span className="text-xs font-semibold text-neutral-200 block mb-2">Wheel Architecture</span>
                <div className="space-y-2">
                  {RIM_PRESETS.map((rim) => {
                    const isSelected = config.rimStyle === rim.id;
                    return (
                      <button
                        key={rim.id}
                        onClick={() => handleRimStyleSelect(rim.id)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-red-500 bg-red-950/20 shadow-md'
                            : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">{rim.name}</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{rim.description}</p>
                        </div>
                        <span className="text-xs font-mono text-neutral-300 shrink-0 ml-2">
                          {rim.price === 0 ? 'Standard' : `+$${rim.price.toLocaleString()}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wheel Rim Color */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-200">Rim Finish Color</span>
                  <span className="text-xs text-neutral-400">{config.rimColorName}</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {RIM_COLORS.map((c) => {
                    const isSelected = config.rimColor.toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        key={c.name}
                        onClick={() => handleRimColorSelect(c.hex, c.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-all ${
                          isSelected
                            ? 'border-red-500 bg-neutral-900 text-white'
                            : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brake Caliper Colors */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-200">Brake Caliper Package</span>
                  <span className="text-xs text-neutral-400">{config.caliperColorName}</span>
                </div>
                <div className="space-y-1.5">
                  {CALIPER_COLORS.map((caliper) => {
                    const isSelected = config.caliperColor.toLowerCase() === caliper.hex.toLowerCase();
                    return (
                      <button
                        key={caliper.name}
                        onClick={() => handleCaliperSelect(caliper.hex, caliper.name)}
                        className={`w-full p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-red-500 bg-neutral-900'
                            : 'border-neutral-800/80 bg-neutral-900/30 hover:bg-neutral-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: caliper.hex }} />
                          <span className="text-xs text-neutral-200">{caliper.name}</span>
                        </div>
                        <span className="text-xs font-mono text-neutral-400">
                          {caliper.price === 0 ? 'Included' : `+$${caliper.price.toLocaleString()}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COCKPIT */}
          {activeTab === 'interior' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-200">Upholstery & Leather</span>
                  <span className="text-xs text-neutral-400">{config.interiorColorName}</span>
                </div>
                <div className="space-y-2">
                  {INTERIOR_COLORS.map((interior) => {
                    const isSelected = config.interiorColor.toLowerCase() === interior.hex.toLowerCase();
                    return (
                      <button
                        key={interior.name}
                        onClick={() => handleInteriorSelect(interior.hex, interior.name)}
                        className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-red-500 bg-red-950/20'
                            : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-lg border border-white/20" style={{ backgroundColor: interior.hex }} />
                          <span className="text-xs font-medium text-white">{interior.name}</span>
                        </div>
                        <span className="text-xs font-mono text-neutral-400">
                          {interior.price === 0 ? 'Standard' : `+$${interior.price.toLocaleString()}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Performance Package */}
              <div>
                <span className="text-xs font-semibold text-neutral-200 block mb-2">Performance Package</span>
                <div className="space-y-2">
                  {(['Standard', 'Sport Chrono', 'Weissach Lightweight'] as const).map((pkg) => {
                    const isSelected = config.selectedPackage === pkg;
                    return (
                      <button
                        key={pkg}
                        onClick={() => onChange({ selectedPackage: pkg })}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between text-xs transition-all ${
                          isSelected
                            ? 'border-red-500 bg-neutral-900 font-semibold text-white'
                            : 'border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:bg-neutral-900'
                        }`}
                      >
                        <span>{pkg}</span>
                        <span className="font-mono text-neutral-400">
                          {pkg === 'Standard' ? 'Included' : pkg === 'Sport Chrono' ? '+$2,790' : '+$33,520'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MECHANICS & TECH */}
          {activeTab === 'mechanics' && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block mb-2">Interactive 3D Mechanisms</span>
              
              {/* Active Wing */}
              <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Wind className={`w-4 h-4 ${config.spoilerActive ? 'text-red-500' : 'text-neutral-400'}`} />
                  <div>
                    <p className="text-xs font-semibold text-white">Active Rear Aerofoil Wing</p>
                    <p className="text-[11px] text-neutral-400">Pivoting hydraulic downforce spoiler</p>
                  </div>
                </div>
                <button
                  onClick={toggleSpoiler}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    config.spoilerActive
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {config.spoilerActive ? 'Deployed' : 'Stowed'}
                </button>
              </div>

              {/* Headlights */}
              <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Lightbulb className={`w-4 h-4 ${config.headlightsOn ? 'text-blue-400' : 'text-neutral-400'}`} />
                  <div>
                    <p className="text-xs font-semibold text-white">Matrix LED Headlights</p>
                    <p className="text-[11px] text-neutral-400">Quad-point DRL & continuous light bar</p>
                  </div>
                </div>
                <button
                  onClick={toggleHeadlights}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    config.headlightsOn
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {config.headlightsOn ? 'Illuminated' : 'Off'}
                </button>
              </div>

              {/* Cockpit Doors */}
              <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <DoorOpen className={`w-4 h-4 ${config.doorsOpen ? 'text-amber-400' : 'text-neutral-400'}`} />
                  <div>
                    <p className="text-xs font-semibold text-white">Driver & Passenger Doors</p>
                    <p className="text-[11px] text-neutral-400">Pivots outward to showcase interior</p>
                  </div>
                </div>
                <button
                  onClick={toggleDoors}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    config.doorsOpen
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {config.doorsOpen ? 'Open' : 'Closed'}
                </button>
              </div>

              {/* Exploded Architecture Mode */}
              <div className="p-3 rounded-xl border border-red-900/40 bg-red-950/20 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sliders className={`w-4 h-4 ${config.explodedView ? 'text-red-400' : 'text-neutral-400'}`} />
                  <div>
                    <p className="text-xs font-semibold text-white">Exploded Engineering View</p>
                    <p className="text-[11px] text-neutral-400">Reveals boxer engine & suspension</p>
                  </div>
                </div>
                <button
                  onClick={toggleExploded}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    config.explodedView
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                >
                  {config.explodedView ? 'Exploded' : 'Assemble'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Spec & Quote Callout */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-400 font-mono uppercase block">Estimated Configuration</span>
            <span className="text-base font-bold text-white font-mono">
              ${(PORSCHE_MODELS.find(m => m.id === config.modelId)?.basePrice || 164900).toLocaleString()}
            </span>
          </div>
          <button
            onClick={onOpenSpecs}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-red-600/30"
          >
            Full Quote & Specs
          </button>
        </div>
      </div>
    </>
  );
};
