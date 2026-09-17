// Web Speech API Voice synthesis and recognition utilities, plus Web Audio sound synthesizer

class AudioSpeechManager {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private audioCtx: AudioContext | null = null;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  public isListening: boolean = false;
  public isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prefer natural British or US English voices that sound like a luxury concierge
    const eliteVoices = voices.filter(v => 
      v.lang.startsWith('en') && (
        v.name.includes('Natural') || 
        v.name.includes('Premium') || 
        v.name.includes('Daniel') || 
        v.name.includes('Oliver') || 
        v.name.includes('George') || 
        v.name.includes('Google UK English Male') ||
        v.name.includes('Samantha')
      )
    );
    this.preferredVoice = eliteVoices[0] || voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public speak(text: string, onStart?: () => void, onEnd?: () => void) {
    if (!this.synth) {
      onEnd?.();
      return;
    }

    this.synth.cancel(); // cancel previous utterances

    const cleanText = text
      .replace(/[*_#`]/g, '')
      .replace(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g, '')
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }
    utterance.rate = 1.02;
    utterance.pitch = 0.98;

    utterance.onstart = () => {
      this.isSpeaking = true;
      onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      onEnd?.();
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError("Web Speech Recognition is not supported in this browser. You can type commands directly in the prompt.");
      return false;
    }

    try {
      this.stopSpeaking();
      this.playChime(440, 660, 0.1); // Activation chime

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        const text = finalTranscript || interimTranscript;
        if (text) {
          onResult(text, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError(event.error || "Speech recognition error");
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || "Could not start microphone");
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  // Web Audio Sound Synthesizers for tactile luxury feedback
  public playChime(freq1 = 523.25, freq2 = 659.25, duration = 0.15) {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq1, now);
      osc1.frequency.exponentialRampToValueAtTime(freq2, now + duration);

      osc2.frequency.setValueAtTime(freq1 * 1.5, now);
      osc2.frequency.exponentialRampToValueAtTime(freq2 * 1.5, now + duration);

      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.1);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.15);
      osc2.stop(now + duration + 0.15);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  public playHydraulicAeroSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.35);
      filter.Q.value = 3;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch (e) {}
  }

  public playEngineRevSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(850, now + 0.25);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.7);

      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.7);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {}
  }

  public playColdStartExhaust() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Starter motor crank (whine)
      const starter = ctx.createOscillator();
      const starterGain = ctx.createGain();
      starter.type = 'sawtooth';
      starter.frequency.setValueAtTime(45, now);
      starter.frequency.linearRampToValueAtTime(120, now + 0.35);
      starterGain.gain.setValueAtTime(0.08, now);
      starterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      starter.connect(starterGain);
      starterGain.connect(ctx.destination);
      starter.start(now);
      starter.stop(now + 0.42);

      // Ignition roar & aggressive cold-start throttle flare
      const roar = ctx.createOscillator();
      const roarGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      roar.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now + 0.35);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.65);
      filter.frequency.exponentialRampToValueAtTime(320, now + 1.8);

      roar.frequency.setValueAtTime(60, now + 0.35);
      roar.frequency.exponentialRampToValueAtTime(310, now + 0.7); // 3,000 RPM flare
      roar.frequency.exponentialRampToValueAtTime(110, now + 1.8); // settles to 1,200 RPM high idle

      roarGain.gain.setValueAtTime(0.001, now);
      roarGain.gain.setValueAtTime(0.25, now + 0.38);
      roarGain.gain.exponentialRampToValueAtTime(0.06, now + 1.8);
      roarGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      roar.connect(filter);
      filter.connect(roarGain);
      roarGain.connect(ctx.destination);

      roar.start(now + 0.35);
      roar.stop(now + 2.5);

      // Overrun exhaust pops & burbles
      [0.85, 1.05, 1.28, 1.45].forEach((offset) => {
        const pop = ctx.createOscillator();
        const popGain = ctx.createGain();
        pop.type = 'square';
        pop.frequency.setValueAtTime(140 + Math.random() * 80, now + offset);
        popGain.gain.setValueAtTime(0.08, now + offset);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);
        pop.connect(popGain);
        popGain.connect(ctx.destination);
        pop.start(now + offset);
        pop.stop(now + offset + 0.09);
      });
    } catch (e) {}
  }

  public playDynoSweep(targetRpm: number) {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Convert 800 - 9000 RPM to frequency 50Hz - 650Hz
      const targetFreq = 50 + (targetRpm / 9000) * 580;

      osc.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(targetFreq * 2.5, now);

      osc.frequency.setValueAtTime(Math.max(45, targetFreq * 0.7), now);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.4);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {}
  }
}

export const audioManager = new AudioSpeechManager();
