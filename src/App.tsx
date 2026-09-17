import React, { useState } from 'react';
import { VehicleConfig, CameraPreset, ToolCallExecution, ClientPersona } from './types';
import { INITIAL_VEHICLE_CONFIG, PORSCHE_MODELS, SHOWROOM_FLEET, CLIENT_PERSONAS } from './data/vehicleData';
import { ShowroomCanvas } from './components/ShowroomCanvas';
import { ShowroomHeader } from './components/ShowroomHeader';
import { VoiceAgentPanel } from './components/VoiceAgentPanel';
import { VehicleConfiguratorPanel } from './components/VehicleConfiguratorPanel';
import { CameraPresetsBar } from './components/CameraPresetsBar';
import { SpecSheetModal } from './components/SpecSheetModal';
import { DealershipAIToolsModal } from './components/DealershipAIToolsModal';
import { audioManager } from './utils/audioSpeech';

export default function App() {
  const [vehicleConfig, setVehicleConfig] = useState<VehicleConfig>(INITIAL_VEHICLE_CONFIG);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('hero');
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isVoicePanelExpanded, setIsVoicePanelExpanded] = useState(true);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);

  // Enterprise Dealership AI Suite & Showroom Fleet State
  const [activeCarId, setActiveCarId] = useState<string>('911_carrera_gts');
  const [showAvatars, setShowAvatars] = useState(true);
  const [isAIToolsOpen, setIsAIToolsOpen] = useState(false);
  const [activePersona, setActivePersona] = useState<ClientPersona>(CLIENT_PERSONAS[0]);

  // Handle fleet car switching
  const handleSelectFleetCar = (carId: string) => {
    setActiveCarId(carId);
    const chosen = SHOWROOM_FLEET.find((c) => c.id === carId);
    if (chosen) {
      if (carId === 'taycan_turbo_gt') {
        setCameraPreset('taycan_bay');
      } else if (carId === '911_gt3_rs') {
        setCameraPreset('gt4_bay');
      } else {
        setCameraPreset('hero');
      }
      setVehicleConfig((prev) => ({
        ...prev,
        modelId: chosen.id,
        modelName: chosen.name,
        bodyColor: chosen.color,
        bodyColorName: chosen.colorName,
        finish: chosen.finish,
      }));
      audioManager.playEngineRevSound();
    }
  };

  // Apply real-time Tool Calls coming from Gemini Voice Agent
  const handleApplyToolCalls = (toolCalls: ToolCallExecution[]) => {
    toolCalls.forEach((call) => {
      if (call.name === 'configure_vehicle') {
        const args = call.args || {};
        setVehicleConfig((prev) => ({
          ...prev,
          bodyColor: args.colorHex || prev.bodyColor,
          bodyColorName: args.colorName || prev.bodyColorName,
          finish: args.finishType || prev.finish,
          rimStyle: args.rimStyle || prev.rimStyle,
          rimColor: args.rimColorHex || prev.rimColor,
          rimColorName: args.rimColorName || prev.rimColorName,
          caliperColor: args.caliperColorHex || prev.caliperColor,
          caliperColorName: args.caliperColorName || prev.caliperColorName,
          interiorColor: args.interiorColorHex || prev.interiorColor,
          interiorColorName: args.interiorColorName || prev.interiorColorName,
          selectedPackage: args.selectedPackage || prev.selectedPackage,
        }));
      } else if (call.name === 'set_camera_view') {
        const args = call.args || {};
        if (args.viewPreset) {
          setCameraPreset(args.viewPreset as CameraPreset);
          setIsAutoRotating(false); // Stop turntable when viewing specific angle
        }
      } else if (call.name === 'toggle_feature') {
        const args = call.args || {};
        const { feature, state } = args;
        if (feature === 'headlights') {
          setVehicleConfig((prev) => ({ ...prev, headlightsOn: Boolean(state) }));
        } else if (feature === 'spoiler') {
          setVehicleConfig((prev) => ({ ...prev, spoilerActive: Boolean(state) }));
          audioManager.playHydraulicAeroSound();
        } else if (feature === 'doors') {
          setVehicleConfig((prev) => ({ ...prev, doorsOpen: Boolean(state) }));
          audioManager.playHydraulicAeroSound();
        } else if (feature === 'exploded_view') {
          setVehicleConfig((prev) => ({ ...prev, explodedView: Boolean(state) }));
          audioManager.playEngineRevSound();
        }
      } else if (call.name === 'switch_model') {
        const args = call.args || {};
        const found = PORSCHE_MODELS.find((m) => m.id === args.modelId);
        if (found) {
          setVehicleConfig((prev) => ({
            ...prev,
            modelId: found.id,
            modelName: found.name,
          }));
          audioManager.playEngineRevSound();
        }
      }
    });
  };

  const handleManualConfigChange = (updated: Partial<VehicleConfig>) => {
    setVehicleConfig((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="relative w-screen h-screen bg-neutral-950 overflow-hidden select-none font-sans text-white">
      {/* 3D WebGL Showroom Canvas */}
      <ShowroomCanvas
        config={vehicleConfig}
        cameraPreset={cameraPreset}
        onCameraChange={setCameraPreset}
        isAutoRotating={isAutoRotating}
        showAvatars={showAvatars}
        onSelectCar={handleSelectFleetCar}
        onSelectAvatar={(type) => {
          if (type === 'owner') {
            setIsAIToolsOpen(true);
            setCameraPreset('owner_desk');
          }
        }}
      />

      {/* Floating Header with Brand Identity, Fleet Switcher, AI Tools Launcher & Avatar Toggles */}
      <ShowroomHeader
        config={vehicleConfig}
        onOpenConfigurator={() => setIsConfiguratorOpen(true)}
        onOpenSpecs={() => setIsSpecsModalOpen(true)}
        onActivateVoice={() => setIsVoicePanelExpanded(true)}
        isVoiceActive={isVoicePanelExpanded}
        onOpenAITools={() => setIsAIToolsOpen(true)}
        showAvatars={showAvatars}
        onToggleAvatars={() => setShowAvatars(!showAvatars)}
        fleet={SHOWROOM_FLEET}
        activeCarId={activeCarId}
        onSelectFleetCar={handleSelectFleetCar}
        activePersona={activePersona}
      />

      {/* Floating Camera Preset Navigation Bar */}
      <CameraPresetsBar
        currentPreset={cameraPreset}
        onSelectPreset={(preset) => {
          setCameraPreset(preset);
          setIsAutoRotating(false);
        }}
        isAutoRotating={isAutoRotating}
        onToggleAutoRotate={() => setIsAutoRotating(!isAutoRotating)}
      />

      {/* Manual Slide-out Configurator Drawer */}
      <VehicleConfiguratorPanel
        config={vehicleConfig}
        onChange={handleManualConfigChange}
        isOpen={isConfiguratorOpen}
        onToggle={() => setIsConfiguratorOpen(!isConfiguratorOpen)}
        onOpenSpecs={() => setIsSpecsModalOpen(true)}
      />

      {/* AI Voice Agent Dialogue & Tool Calling Overlay */}
      <VoiceAgentPanel
        currentConfig={vehicleConfig}
        onApplyToolCalls={handleApplyToolCalls}
        onSelectCamera={setCameraPreset}
        isExpanded={isVoicePanelExpanded}
        onToggleExpand={() => setIsVoicePanelExpanded(!isVoicePanelExpanded)}
      />

      {/* Technical Spec & Build Quote Modal */}
      <SpecSheetModal
        config={vehicleConfig}
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
      />

      {/* Enterprise AI Dealership Automation Suite Modal */}
      <DealershipAIToolsModal
        isOpen={isAIToolsOpen}
        onClose={() => setIsAIToolsOpen(false)}
        config={vehicleConfig}
        onApplyConfig={handleManualConfigChange}
        activePersona={activePersona}
        onSelectPersona={setActivePersona}
      />
    </div>
  );
}
