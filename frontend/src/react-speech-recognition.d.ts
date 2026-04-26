declare module 'react-speech-recognition' {
  export interface StartListeningOptions {
    continuous?: boolean;
    language?: string;
  }

  export interface UseSpeechRecognitionResult {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  }

  const SpeechRecognition: {
    startListening: (options?: StartListeningOptions) => Promise<void> | void;
    stopListening: () => Promise<void> | void;
  };

  export function useSpeechRecognition(): UseSpeechRecognitionResult;

  export default SpeechRecognition;
}
