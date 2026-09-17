import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Sparkles, 
  DollarSign, 
  Volume2, 
  Zap, 
  FileText, 
  TrendingUp, 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  Play, 
  RotateCcw,
  Palette,
  Download,
  Copy,
  ChevronRight
} from 'lucide-react';
import { VehicleConfig, ClientPersona, TradeInEstimate, FinanceStructure } from '../types';
import { CLIENT_PERSONAS, calculateFinanceStructure, calculateVehicleQuote } from '../data/vehicleData';
import { audioManager } from '../utils/audioSpeech';

interface DealershipAIToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: VehicleConfig;
  onApplyConfig: (partial: Partial<VehicleConfig>) => void;
  activePersona: ClientPersona;
  onSelectPersona: (persona: ClientPersona) => void;
}

export const DealershipAIToolsModal: React.FC<DealershipAIToolsModalProps> = ({
  isOpen,
  onClose,
  config,
  onApplyConfig,
  activePersona,
  onSelectPersona,
}) => {
  const [activeTab, setActiveTab] = useState<'clone' | 'tradein' | 'finance' | 'pts' | 'dyno' | 'crm'>('clone');

  // Trade-In State
  const [tradeIn, setTradeIn] = useState<TradeInEstimate>({
    year: 2022,
    make: 'BMW',
    model: 'M4 Competition xDrive',
    mileage: 18400,
    condition: 'Excellent',
    estimatedValue: 68500,
    allowanceApplied: true,
  });
  const [isAppraising, setIsAppraising] = useState(false);

  // Finance State
  const quote = calculateVehicleQuote(config);
  const [financeMode, setFinanceMode] = useState<'lease' | 'finance' | 'cash'>('lease');
  const [downPercent, setDownPercent] = useState(20);
  const [termMonths, setTermMonths] = useState(36);

  const finance = calculateFinanceStructure(
    quote.totalPrice,
    financeMode,
    downPercent,
    termMonths,
    tradeIn.allowanceApplied ? tradeIn.estimatedValue : 0
  );

  // PTS Custom Color State
  const [ptsPrompt, setPtsPrompt] = useState('Viola Metallic Deep Violet with fine gold pearl');
  const [ptsHex, setPtsHex] = useState('#3B1443');
  const [ptsFinish, setPtsFinish] = useState<'metallic' | 'matte' | 'glossy'>('metallic');

  // Dyno State
  const [dynoRpm, setDynoRpm] = useState(1200);
  const [isDynoTesting, setIsDynoTesting] = useState(false);
  const [exhaustMode, setExhaustMode] = useState<'sport' | 'quiet'>('sport');

  // CRM State
  const [crmCopied, setCrmCopied] = useState(false);

  if (!isOpen) return null;

  // Instant AI Trade-In Appraisal handler
  const handleRecalculateTradeIn = () => {
    setIsAppraising(true);
    audioManager.playChime(600, 900, 0.1);
    setTimeout(() => {
      let baseVal = 70000;
      if (tradeIn.make.toLowerCase().includes('porsche')) baseVal = 95000;
      else if (tradeIn.make.toLowerCase().includes('mercedes')) baseVal = 64000;
      else if (tradeIn.make.toLowerCase().includes('audi')) baseVal = 58000;
      
      const mileagePenalty = Math.max(0, (tradeIn.mileage - 10000) * 0.45);
      const conditionMultiplier = tradeIn.condition === 'Excellent' ? 1.05 : tradeIn.condition === 'Good' ? 0.95 : 0.85;
      const finalVal = Math.round((baseVal - mileagePenalty) * conditionMultiplier);
      
      setTradeIn(prev => ({ ...prev, estimatedValue: finalVal, allowanceApplied: true }));
      setIsAppraising(false);
      audioManager.playChime(800, 1100, 0.15);
    }, 600);
  };

  // PTS Generator
  const handleSynthesizePtsColor = () => {
    audioManager.playChime(500, 850, 0.12);
    // Simple harmonic color generator from prompt
    let hex = '#1D3557';
    let name = 'PTS Maritime Blue';
    const lower = ptsPrompt.toLowerCase();

    if (lower.includes('violet') || lower.includes('viola') || lower.includes('purple')) {
      hex = '#40174A';
      name = 'PTS Viola Metallic Heritage';
    } else if (lower.includes('emerald') || lower.includes('green') || lower.includes('oak')) {
      hex = '#0F382A';
      name = 'PTS Oak Green Metallic Neo';
    } else if (lower.includes('gold') || lower.includes('bronze') || lower.includes('copper')) {
      hex = '#7B4B1C';
      name = 'PTS Nordic Bronze Metallic';
    } else if (lower.includes('orange') || lower.includes('lava') || lower.includes('sunset')) {
      hex = '#EA580C';
      name = 'PTS Continental Sunset Orange';
    } else if (lower.includes('grey') || lower.includes('chalk') || lower.includes('nardo')) {
      hex = '#71717A';
      name = 'PTS Slate Nardo Matte';
    }

    setPtsHex(hex);
    onApplyConfig({
      bodyColor: hex,
      bodyColorName: name,
      finish: ptsFinish,
    });
  };

  // Dyno RPM sweep test
  const handleDynoRpmChange = (newRpm: number) => {
    setDynoRpm(newRpm);
    audioManager.playDynoSweep(newRpm);
  };

  const handleRunColdStart = () => {
    audioManager.playColdStartExhaust();
  };

  const handleCopyCrmPayload = () => {
    const payload = {
      dealership: "Porsche Zentrum Berlin - Exclusive Manufaktur",
      vin: "WP0AB2A98SS294812",
      model: config.modelName,
      clientName: activePersona.name,
      clientPersona: activePersona.role,
      totalMSRP: quote.totalPrice,
      tradeInAllowance: tradeIn.allowanceApplied ? tradeIn.estimatedValue : 0,
      monthlyPayment: finance.monthlyPayment,
      financeMode: finance.mode,
      downPayment: finance.downPayment,
      specSummary: {
        exteriorColor: `${config.bodyColorName} (${config.finish})`,
        wheelSpec: `${config.rimStyle} in ${config.rimColorName}`,
        package: config.selectedPackage,
        brakes: `Calipers in ${config.caliperColorName}`
      },
      exportTimestamp: new Date().toISOString(),
      leadStatus: "Tier 1 Verified - Pre-Qualified Allocation"
    };

    navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
    setCrmCopied(true);
    audioManager.playChime(600, 800, 0.1);
    setTimeout(() => setCrmCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-5xl h-[88vh] bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Dealership AI Automation Suite
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/50">
                  Enterprise Client Engine
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Live Automotive B2B Tools • AI Clone Sales • Automated Trade-In & CRM Allocation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-neutral-950 border-b border-neutral-800/60 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'clone', label: 'Owner AI Clone (Marcus)', icon: UserCheck },
            { id: 'tradein', label: 'AI VIN Trade-In Appraisal', icon: Car },
            { id: 'finance', label: 'Lease & Allocation Structuring', icon: DollarSign },
            { id: 'pts', label: 'PTS Color Synthesizer', icon: Palette },
            { id: 'dyno', label: 'AI Dyno & Acoustic Telemetry', icon: Volume2 },
            { id: 'crm', label: 'Dealership CRM & Lead Export', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  audioManager.playChime(500, 700, 0.08);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  active 
                    ? 'bg-neutral-800 text-white border border-neutral-700 shadow-md' 
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-red-400' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-neutral-800">
          
          {/* TAB 1: OWNER AI CLONE & CLIENT PERSONA */}
          {activeTab === 'clone' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-neutral-600 flex items-center justify-center font-bold text-white text-sm">
                        MV
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Herr Marcus Vance</h3>
                        <p className="text-xs text-neutral-400">Founder & Managing Director • AI Digital Clone</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live Conversational Clone Active
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800">
                    "Welcome to our Berlin showroom floor. As dealership founder, I configured this AI clone trained on 24 years of Porsche engineering and allocation management. You can speak to me naturally about track setup,PTS allocations, trade-ins, or custom lease structuring."
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        audioManager.speak("Marcus here. The 911 Carrera GTS before you combines our 3.6-liter twin-turbo boxer with an integrated T-Hybrid electric turbocharger, eliminating turbo lag entirely.");
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Hear Marcus's Technical Overview</span>
                    </button>
                    <button
                      onClick={() => {
                        audioManager.speak("Our current Zuffenhausen factory allocations for Q3 are nearly locked. With your trade-in equity, we can secure this GTS build slot with delivery in under ten weeks.");
                      }}
                      className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors"
                    >
                      <span>Inquire About Factory Allocation Slots</span>
                    </button>
                  </div>
                </div>

                {/* Client Persona Selector */}
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">
                    Active Client Avatar & VIP Persona
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CLIENT_PERSONAS.map((persona) => {
                      const isSelected = activePersona.id === persona.id;
                      return (
                        <div
                          key={persona.id}
                          onClick={() => {
                            onSelectPersona(persona);
                            audioManager.playChime(600, 800, 0.1);
                          }}
                          className={`p-3 rounded-xl cursor-pointer border transition-all ${
                            isSelected 
                              ? 'bg-neutral-800 border-red-500/80 shadow-md' 
                              : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">{persona.name}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />}
                          </div>
                          <p className="text-[11px] text-red-400 font-medium">{persona.role}</p>
                          <p className="text-[10px] text-neutral-400 mt-1">Budget: {persona.budget}</p>
                          <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">{persona.preference}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dealership Quick Specs */}
              <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                  Dealership Authority Matrix
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex justify-between items-center">
                    <span className="text-neutral-400">Dealership Branch</span>
                    <span className="font-semibold text-white">Berlin Exclusive</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex justify-between items-center">
                    <span className="text-neutral-400">Lead AI Concierge</span>
                    <span className="font-semibold text-emerald-400">Alex & Marcus v2.4</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex justify-between items-center">
                    <span className="text-neutral-400">Allocations Available</span>
                    <span className="font-semibold text-amber-400">3 of 8 Remaining</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 flex justify-between items-center">
                    <span className="text-neutral-400">Trade-In Allowance</span>
                    <span className="font-semibold text-white">${tradeIn.estimatedValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300">
                  <strong>Client Ready:</strong> This platform can be white-labeled for any luxury automotive dealer, marine yacht broker, or motorcycle brand.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI TRADE-IN APPRAISAL */}
          {activeTab === 'tradein' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4 text-red-500" />
                    <span>Instant AI Market Trade-In Appraisal</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mb-4">
                    Our neural valuation model pulls live auction comps, Black Book trade indices, and localized demand metrics to provide immediate equity calculation.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Year</label>
                      <input
                        type="number"
                        value={tradeIn.year}
                        onChange={(e) => setTradeIn({ ...tradeIn, year: Number(e.target.value) })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Make</label>
                      <input
                        type="text"
                        value={tradeIn.make}
                        onChange={(e) => setTradeIn({ ...tradeIn, make: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Model</label>
                      <input
                        type="text"
                        value={tradeIn.model}
                        onChange={(e) => setTradeIn({ ...tradeIn, model: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Mileage</label>
                      <input
                        type="number"
                        value={tradeIn.mileage}
                        onChange={(e) => setTradeIn({ ...tradeIn, mileage: Number(e.target.value) })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">Condition</label>
                      <select
                        value={tradeIn.condition}
                        onChange={(e) => setTradeIn({ ...tradeIn, condition: e.target.value as any })}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="Excellent">Excellent (Like New)</option>
                        <option value="Good">Good (Minor Wear)</option>
                        <option value="Fair">Fair (Needs Recon)</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleRecalculateTradeIn}
                        disabled={isAppraising}
                        className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isAppraising ? 'Appraising...' : 'Run Valuation'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-neutral-400">Estimated Trade-In Allowance</p>
                      <h4 className="text-xl font-black text-emerald-400 mt-0.5">
                        ${tradeIn.estimatedValue.toLocaleString()} USD
                      </h4>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tradeIn.allowanceApplied}
                        onChange={(e) => setTradeIn({ ...tradeIn, allowanceApplied: e.target.checked })}
                        className="w-4 h-4 rounded text-red-600 bg-neutral-900 border-neutral-700"
                      />
                      <span>Apply directly to reduction</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400">Equity Impact</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Base MSRP:</span>
                    <span className="text-white">${quote.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Trade-In Credit:</span>
                    <span>-${tradeIn.allowanceApplied ? tradeIn.estimatedValue.toLocaleString() : '0'}</span>
                  </div>
                  <div className="border-t border-neutral-800 pt-2 flex justify-between font-bold text-white">
                    <span>Net Outflow:</span>
                    <span>${Math.max(0, quote.totalPrice - (tradeIn.allowanceApplied ? tradeIn.estimatedValue : 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEASE & ALLOCATION STRUCTURING */}
          {activeTab === 'finance' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center justify-between">
                    <span>Financial Structuring Engine</span>
                    <span className="text-xs font-mono text-neutral-400">Tier 1 Porsche Financial Services</span>
                  </h3>

                  {/* Mode Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'lease', label: 'Porsche Premier Lease' },
                      { id: 'finance', label: 'Traditional Retail' },
                      { id: 'cash', label: 'Direct Wire Allocation' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setFinanceMode(m.id as any);
                          audioManager.playChime(500, 700, 0.08);
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                          financeMode === m.id
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-neutral-950 hover:bg-neutral-900 text-neutral-300 border border-neutral-800'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {financeMode !== 'cash' && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <div className="flex justify-between text-xs text-neutral-300 mb-1">
                          <span>Down Payment Percentage: {downPercent}%</span>
                          <span className="font-mono text-white">${Math.round(quote.totalPrice * (downPercent / 100)).toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          step="5"
                          value={downPercent}
                          onChange={(e) => setDownPercent(Number(e.target.value))}
                          className="w-full accent-red-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-neutral-300 mb-1">
                          <span>Term Duration: {termMonths} Months</span>
                          <span className="font-mono text-neutral-400">Annual 10,000 Miles</span>
                        </div>
                        <div className="flex gap-2">
                          {[24, 36, 48, 60].map((t) => (
                            <button
                              key={t}
                              onClick={() => setTermMonths(t)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                                termMonths === t 
                                  ? 'bg-neutral-800 text-white border border-neutral-700' 
                                  : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
                              }`}
                            >
                              {t} Mo
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Highlighted Monthly Payment */}
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono uppercase text-neutral-400">
                        {financeMode === 'lease' ? 'Estimated Monthly Lease' : financeMode === 'finance' ? 'Monthly Retail Payment' : 'Total Wire Transfer'}
                      </p>
                      <h4 className="text-2xl font-black text-white mt-0.5">
                        {financeMode === 'cash' 
                          ? `$${finance.totalOutflow.toLocaleString()}` 
                          : `$${finance.monthlyPayment.toLocaleString()}/mo`}
                      </h4>
                    </div>
                    <div className="text-right text-[11px] text-neutral-400">
                      <p>Residual: 62% ($102,238)</p>
                      <p className="text-emerald-400 font-medium">Pre-Approved Rate: 5.9%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3 text-xs">
                <h4 className="font-mono uppercase tracking-widest text-neutral-400">Contract Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-neutral-400">
                    <span>Configured Price:</span>
                    <span className="text-white">${quote.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Trade Credit Applied:</span>
                    <span className="text-emerald-400">-${finance.tradeInCredit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Initial Due at Signing:</span>
                    <span className="text-white">${finance.downPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Total Lease Obligation:</span>
                    <span className="text-white">${finance.totalOutflow.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PTS COLOR SYNTHESIZER */}
          {activeTab === 'pts' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-red-500" />
                    <span>Porsche Paint to Sample (PTS) AI Synthesis Lab</span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Describe any bespoke historical or atmospheric tone in natural language. Our neural formulation engine generates matching pigment codes and applies them to the 3D vehicle in real-time.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-neutral-400">Bespoke Color Prompt</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ptsPrompt}
                        onChange={(e) => setPtsPrompt(e.target.value)}
                        placeholder="e.g. Vintage British Racing Emerald with pearl metallic flake..."
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                      <button
                        onClick={handleSynthesizePtsColor}
                        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Synthesize & Apply</span>
                      </button>
                    </div>
                  </div>

                  {/* Preset PTS Swatches */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-mono uppercase text-neutral-400">Historical PTS Archives</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { name: 'Viola Metallic', hex: '#3B1443', finish: 'metallic' },
                        { name: 'Oak Green Neo', hex: '#0F382A', finish: 'metallic' },
                        { name: 'Maritime Blue', hex: '#1D3557', finish: 'glossy' },
                        { name: 'Nordic Bronze', hex: '#7B4B1C', finish: 'matte' },
                        { name: 'Ruby Star Neo', hex: '#BE185D', finish: 'glossy' },
                        { name: 'Frozen Berry', hex: '#9D6B78', finish: 'metallic' },
                        { name: 'Nardo Stealth', hex: '#52525B', finish: 'matte' },
                        { name: 'Signal Yellow', hex: '#EAB308', finish: 'glossy' },
                      ].map((swatch) => (
                        <button
                          key={swatch.name}
                          onClick={() => {
                            setPtsHex(swatch.hex);
                            onApplyConfig({
                              bodyColor: swatch.hex,
                              bodyColorName: swatch.name,
                              finish: swatch.finish as any,
                            });
                            audioManager.playChime(600, 900, 0.1);
                          }}
                          className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-600 flex items-center gap-2 text-left transition-colors"
                        >
                          <span className="w-4 h-4 rounded-full border border-neutral-700 shrink-0" style={{ backgroundColor: swatch.hex }} />
                          <span className="text-[11px] text-neutral-300 truncate">{swatch.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4 text-xs">
                <h4 className="font-mono uppercase tracking-widest text-neutral-400">Active Formulation</h4>
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl mx-auto shadow-inner border border-neutral-700" style={{ backgroundColor: ptsHex }} />
                  <p className="font-bold text-white">{config.bodyColorName}</p>
                  <p className="font-mono text-neutral-400 text-[10px] uppercase">HEX: {ptsHex} • {config.finish}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI DYNO & ACOUSTIC TELEMETRY */}
          {activeTab === 'dyno' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-red-500" />
                      <span>Dyno Telemetry & Exhaust Acoustics Lab</span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs">
                      <button
                        onClick={() => setExhaustMode('quiet')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${exhaustMode === 'quiet' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}
                      >
                        Standard
                      </button>
                      <button
                        onClick={() => setExhaustMode('sport')}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${exhaustMode === 'sport' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}
                      >
                        Sport Active Exhaust
                      </button>
                    </div>
                  </div>

                  {/* Dyno Gauge */}
                  <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-4">
                    <div className="inline-block p-4 rounded-full bg-neutral-900/80 border border-neutral-800">
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-red-500">
                        {dynoRpm}
                      </span>
                      <span className="text-xs font-mono text-neutral-400 block">RPM</span>
                    </div>

                    {/* RPM Slider */}
                    <div>
                      <div className="flex justify-between text-xs text-neutral-400 font-mono mb-1">
                        <span>IDLE: 800 RPM</span>
                        <span className="text-red-400">PEAK HP: 6,800 RPM</span>
                        <span className="text-amber-400">REDLINE: 9,000 RPM</span>
                      </div>
                      <input
                        type="range"
                        min="800"
                        max="9000"
                        step="100"
                        value={dynoRpm}
                        onChange={(e) => handleDynoRpmChange(Number(e.target.value))}
                        className="w-full accent-red-600"
                      />
                    </div>

                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        onClick={handleRunColdStart}
                        className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Simulate Cold-Start Flare & Exhaust Overrun</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3 text-xs">
                <h4 className="font-mono uppercase tracking-widest text-neutral-400">Live Telemetry</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-neutral-400">
                    <span>Output at {dynoRpm} RPM:</span>
                    <span className="text-white font-bold">{Math.round(180 + (dynoRpm / 9000) * 352)} HP</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Torque Output:</span>
                    <span className="text-white font-bold">{Math.min(449, Math.round(220 + (dynoRpm / 5000) * 229))} lb-ft</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Acoustic Output:</span>
                    <span className="text-red-400 font-bold">{Math.round(68 + (dynoRpm / 9000) * 34)} dBA</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CRM & LEAD EXPORT */}
          {activeTab === 'crm' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-500" />
                      <span>Dealership CRM Integration & Buyer Allocation Packet</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      1-click CRM payload compliant with Salesforce Automotive Cloud, HubSpot, and Porsche DMS.
                    </p>
                  </div>
                  <button
                    onClick={handleCopyCrmPayload}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    {crmCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{crmCopied ? 'Copied JSON Payload' : 'Copy CRM Data Packet'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-neutral-300 overflow-x-auto">
                  <pre>{JSON.stringify({
                    dealership: "Porsche Zentrum Berlin - Exclusive Manufaktur",
                    vin: "WP0AB2A98SS294812",
                    model: config.modelName,
                    clientName: activePersona.name,
                    clientPersona: activePersona.role,
                    totalMSRP: quote.totalPrice,
                    tradeInAllowance: tradeIn.allowanceApplied ? tradeIn.estimatedValue : 0,
                    monthlyPayment: finance.monthlyPayment,
                    financeMode: finance.mode,
                    downPayment: finance.downPayment,
                    specSummary: {
                      exteriorColor: `${config.bodyColorName} (${config.finish})`,
                      wheelSpec: `${config.rimStyle} in ${config.rimColorName}`,
                      package: config.selectedPackage,
                      brakes: `Calipers in ${config.caliperColorName}`
                    },
                    exportTimestamp: new Date().toISOString(),
                    leadStatus: "Tier 1 Verified - Pre-Qualified Allocation"
                  }, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
