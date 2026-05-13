import type { Ref } from "vue";


export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Ref<Theme>;
  toggleTheme: () => void;
  isDark: Ref<boolean>;
}



export interface ShahadaStep {
  id: number;
  arabic: string;
  phonetic: string;
  promptLine: string;
  keywords: string[];
  compactHints?: string[];
}


export interface SessionRefs {
  sessionActiveRef: Ref<boolean>;
  recognitionPausedRef: Ref<boolean>;
}

export interface SpeechRecognitionHook {
  transcript: Readonly<Ref<string>>;
  isListening: Readonly<Ref<boolean>>;
  hasSupport: boolean;
  error: Readonly<Ref<string | null>>;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}



export interface AudioVisualizerHook {
  volume: Readonly<Ref<number>>;
  startVisualizer: () => Promise<void>;
  stopVisualizer: () => void;
  resumeAudioContext: () => Promise<void>;
  suspendVisualizer: () => Promise<void>;
  resumeVisualizer: () => Promise<void>;
}



export interface UseAudioPlaybackReturn {
  isPlaying: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  play: (src: string) => Promise<void>;
  stop: () => void;
}



export type OrbVisualMode =
  | "idle"
  | "listening"
  | "speaking"
  | "engaged"
  | "error";

export interface VisualizerOrbProps {
  mode: OrbVisualMode;
}



export type ButtonVariant =
  | "start"
  | "stop"
  | "certificate"
  | "learnMore";

export interface ButtonProps {
  variant: ButtonVariant;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}



export interface HeaderProps {
  class?: string;
}



export interface SessionState {
  isRecording: boolean;
  currentStep: number;
  completedSteps: number;
}