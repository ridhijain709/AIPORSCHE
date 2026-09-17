import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Gauge, 
  Zap, 
  ShieldCheck, 
  Download, 
  Share2, 
  Calendar,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { VehicleConfig } from '../types';
import { PORSCHE_MODELS, calculateVehicleQuote } from '../data/vehicleData';
import { audioManager } from '../utils/audioSpeech';

interface SpecSheetModalProps {
  config: VehicleConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const SpecSheetModal: React.FC<SpecSheetModalProps> = ({
  config,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [testDriveBooked, setTestDriveBooked] = useState(false);

  if (!isOpen) return null;

  const model = PORSCHE_MODELS.find(m => m.id === config.modelId) || PORSCHE_MODELS[0];
  const quote = calculateVehicleQuote(config);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    audioManager.playChime(600, 800, 0.1);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleBookTestDrive = () => {
    audioManager.playEngineRevSound();
    setTestDriveBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                OFFICIAL SPECIFICATION & BUILD SHEET
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{config.modelName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800">
          {/* Key Metric Bento Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">0-60 MPH</span>
              <span className="text-lg font-bold text-white font-mono mt-0.5 block">{model.specs.acceleration.split('in ')[1] || '2.9s'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">POWER</span>
              <span className="text-lg font-bold text-red-400 font-mono mt-0.5 block">{model.specs.horsepower.split(' ')[0]} HP</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">TOP SPEED</span>
              <span className="text-lg font-bold text-white font-mono mt-0.5 block">{model.specs.topSpeed.split(' ')[0]} MPH</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center">
              <span className="text-[10px] font-mono text-neutral-400 uppercase block">DRIVETRAIN</span>
              <span className="text-xs font-semibold text-neutral-300 mt-1 block truncate">{model.specs.drivetrain.split(' ')[0]}</span>
            </div>
          </div>

          {/* Technical Powertrain Specs */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-red-500" />
              <span>Engineering Specifications</span>
            </h3>
            <div className="divide-y divide-neutral-800/80 rounded-2xl border border-neutral-800 bg-neutral-900/30 text-xs">
              <div className="flex items-center justify-between p-3">
                <span className="text-neutral-400">Powertrain Architecture</span>
                <span className="font-medium text-white text-right max-w-[65%]">{model.specs.engine}</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-neutral-400">Torque</span>
                <span className="font-medium text-white">{model.specs.torque}</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-neutral-400">Transmission</span>
                <span className="font-medium text-white text-right max-w-[65%]">{model.specs.transmission}</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-neutral-400">Curb Weight</span>
                <span className="font-medium text-white">{model.specs.weight}</span>
              </div>
            </div>
          </div>

          {/* Itemized Price Quote Breakdown */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Configured Itemized Build Quote</span>
            </h3>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>Base MSRP ({config.modelName})</span>
                <span className="font-mono text-white">${quote.basePrice.toLocaleString()}</span>
              </div>

              {quote.options.map((opt, i) => (
                <div key={i} className="flex justify-between text-neutral-400">
                  <span>+ {opt.name}</span>
                  <span className="font-mono text-neutral-300">+${opt.price.toLocaleString()}</span>
                </div>
              ))}

              <div className="flex justify-between text-neutral-400">
                <span>Delivery, Processing and Handling</span>
                <span className="font-mono text-neutral-300">+${quote.destinationCharge.toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-white block">Total Configured Price</span>
                  <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">{quote.estimatedDelivery}</span>
                </div>
                <span className="text-xl font-bold text-red-500 font-mono">
                  ${quote.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Test Drive Confirmation Banner if booked */}
          {testDriveBooked && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">VIP Priority Track & Showroom Allocation Reserved!</p>
                <p className="text-emerald-300 mt-0.5">
                  Alex has filed your bespoke configuration code with the regional Porsche Experience Center. An executive concierge will confirm your appointment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Build Link Copied!' : 'Share Build'}</span>
          </button>

          <button
            onClick={handleBookTestDrive}
            disabled={testDriveBooked}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg ${
              testDriveBooked
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{testDriveBooked ? 'Test Drive Requested' : 'Book VIP Experience Drive'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
