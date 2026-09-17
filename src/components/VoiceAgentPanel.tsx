import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  Wrench, 
  Camera, 
  Maximize2,
  HelpCircle,
  Zap
} from 'lucide-react';
import { VehicleConfig, ChatMessage, ToolCallExecution } from '../types';
import { audioManager } from '../utils/audioSpeech';

interface VoiceAgentPanelProps {
  currentConfig: VehicleConfig;
  onApplyToolCalls: (toolCalls: ToolCallExecution[]) => void;
  onSelectCamera: (preset: any) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const VoiceAgentPanel: React.FC<VoiceAgentPanelProps> = ({
  currentConfig,
  onApplyToolCalls,
  onSelectCamera,
  isExpanded,
  onToggleExpand,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Welcome to the Porsche Digital Design Studio. I am Alex, your AI Sales & Engineering Specialist. Would you like to explore our 532 hp Carrera GTS in Guards Red, or configure a bespoke PTS finish with forged alloys?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recentTool, setRecentTool] = useState<ToolCallExecution | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Voice recognition cleanup
  useEffect(() => {
    return () => {
      audioManager.stopListening();
      audioManager.stopSpeaking();
    };
  }, []);

  // Quick prompt suggestions
  const SUGGESTIONS = [
    { label: "Showroom Floor", prompt: "Show me the entire showroom floor overview with all cars and Marcus's desk." },
    { label: "Taycan EV Bay", prompt: "Zoom into Bay A and show me the Porsche Taycan Turbo GT." },
    { label: "GT3 RS Wing", prompt: "Take me to Bay B to inspect the Porsche 911 GT3 RS with the high-downforce wing." },
    { label: "Guards Red Gloss", prompt: "Can I see this Porsche in classic Guards Red with glossy finish?" },
    { label: "Stealth Matte & Gold Rims", prompt: "Give it a stealth matte black paint job with aurum gold rims and yellow calipers." },
    { label: "Deploy Active Wing", prompt: "Deploy the active aerodynamic rear wing into high downforce mode." },
    { label: "Boxer Engine Bay", prompt: "Show me the boxer engine specs and zoom into the engine bay." },
    { label: "Exploded Architecture", prompt: "Engage the exploded engineering view to show the chassis and wheels." },
    { label: "Open Doors & Cockpit", prompt: "Open the doors so I can see the interior." },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isProcessing) return;

    setInputText('');
    setSpeechError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          currentConfig,
          history: messages.slice(-4),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const reply = data.replyText || "Your request has been configured on the vehicle.";
      const tools: ToolCallExecution[] = data.toolCalls || [];

      // Apply tool calls to the 3D model
      if (tools.length > 0) {
        onApplyToolCalls(tools);
        setRecentTool(tools[0]);
        // Visual/sound feedback
        audioManager.playChime(580, 880, 0.12);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCalls: tools,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Voice synthesis
      if (soundEnabled) {
        setIsSpeaking(true);
        audioManager.speak(
          reply,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    } catch (err: any) {
      console.error("Failed to query voice agent:", err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've applied your changes directly to the 3D canvas. What else would you like to configure?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      audioManager.stopListening();
      setIsListening(false);
      return;
    }

    setSpeechError(null);
    const started = audioManager.startListening(
      (transcript, isFinal) => {
        setInputText(transcript);
        if (isFinal) {
          setIsListening(false);
          handleSendMessage(transcript);
        }
      },
      (error) => {
        setIsListening(false);
        setSpeechError(error);
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  const toggleMute = () => {
    if (soundEnabled) {
      audioManager.stopSpeaking();
      setIsSpeaking(false);
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
    }
  };

  return (
    <div 
      className={`fixed z-30 transition-all duration-300 flex flex-col backdrop-blur-xl border border-neutral-800/80 shadow-2xl rounded-2xl overflow-hidden ${
        isExpanded
          ? 'bottom-4 right-4 w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[85vh] bg-neutral-950/92'
          : 'bottom-4 right-4 w-[360px] max-w-[calc(100vw-2rem)] h-[240px] bg-neutral-950/85'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/60">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-red-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
              A
            </div>
            {isSpeaking && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-neutral-950 rounded-full animate-ping" />
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-neutral-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-white">Alex</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50">
                AI Showroom
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 flex items-center gap-1">
              {isSpeaking ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" /> Speaking...
                </span>
              ) : isListening ? (
                <span className="text-blue-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" /> Listening to mic...
                </span>
              ) : (
                "Porsche Specialist Ready"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-lg transition-colors ${
              soundEnabled 
                ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' 
                : 'text-amber-400 bg-amber-950/40 hover:bg-amber-900/40'
            }`}
            title={soundEnabled ? "Mute Voice Speech" : "Unmute Voice Speech"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title={isExpanded ? "Minimize Chat" : "Expand Dialogue"}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time Tool Call Notification Pill */}
      {recentTool && (
        <div className="px-3 py-1.5 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between text-[11px] text-neutral-300">
          <div className="flex items-center gap-1.5 truncate">
            <Zap className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="font-mono text-amber-400">{recentTool.name}</span>
            <span className="truncate text-neutral-400">{recentTool.summary}</span>
          </div>
          <span className="text-[10px] text-emerald-400 shrink-0 flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3" /> Live
          </span>
        </div>
      )}

      {/* Message History */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-neutral-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-red-600 text-white rounded-br-none shadow-md font-medium'
                  : 'bg-neutral-900/90 border border-neutral-800 text-neutral-200 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.content}
            </div>
            
            {/* Tool tags attached to assistant message */}
            {msg.toolCalls && msg.toolCalls.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {msg.toolCalls.map((tc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800/80 border border-neutral-700 text-neutral-300"
                  >
                    <Wrench className="w-2.5 h-2.5 text-amber-400" />
                    <span>{tc.name}</span>
                  </span>
                ))}
              </div>
            )}
            <span className="text-[10px] text-neutral-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-neutral-400 text-xs py-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Alex is consulting the telemetry & updating the 3D model...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions scroll (only when expanded) */}
      {isExpanded && (
        <div className="px-3 py-2 border-t border-neutral-800/80 bg-neutral-900/40">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono shrink-0">
              Voice Prompts:
            </span>
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s.prompt)}
                disabled={isProcessing}
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/70 text-neutral-300 hover:text-white transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mic Status & Error */}
      {speechError && (
        <div className="px-3 py-1 bg-red-950/60 border-t border-red-900/50 text-[11px] text-red-300 flex items-center justify-between">
          <span>{speechError}</span>
          <button onClick={() => setSpeechError(null)} className="text-red-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-900/80 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMic}
          className={`relative p-2.5 rounded-full transition-all duration-200 shrink-0 ${
            isListening
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 ring-4 ring-red-500/30 animate-pulse'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700'
          }`}
          title={isListening ? "Stop listening" : "Click to speak to Alex"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={isListening ? "Listening... Speak now..." : "Ask Alex: 'Show it in matte black with gold wheels'..."}
          className="flex-1 bg-neutral-950/90 border border-neutral-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
        />

        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isProcessing}
          className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
