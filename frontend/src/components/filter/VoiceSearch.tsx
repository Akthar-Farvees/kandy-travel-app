import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterState } from '../../types';

interface VoiceSearchProps {
  setFilters: Dispatch<SetStateAction<FilterState>>;
}

export function VoiceSearch({ setFilters }: VoiceSearchProps) {
  const { 
    listening, 
    transcript, 
    toggleListening, 
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    filterResult 
  } = useVoiceSearch();
  const lastAppliedTranscriptRef = useRef('');

  useEffect(() => {
    if (!listening && filterResult && transcript && lastAppliedTranscriptRef.current !== transcript) {
      setFilters(prev => ({
        ...prev,
        ...filterResult,
        page: 1
      }));
      lastAppliedTranscriptRef.current = transcript;
    }
  }, [filterResult, listening, setFilters, transcript]);

  if (!browserSupportsSpeechRecognition || !isMicrophoneAvailable) {
    return (
      <div className="flex items-center gap-2 rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-text-muted">
        <MicOff size={16} />
        <span>Voice search unavailable. Text filtering still works.</span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-end md:items-start">
      <button
        onClick={toggleListening}
        className={cn(
          "relative h-11 w-11 flex items-center justify-center rounded-sm border transition-all duration-300 z-10",
          listening 
            ? "border-primary bg-primary text-white shadow-[0_0_15px_rgba(200,150,62,0.5)]" 
            : "border-gray-300 bg-white text-gray-600 hover:border-primary hover:text-primary"
        )}
        title={listening ? "Stop listening" : "Voice Search"}
      >
        <Mic size={18} className={listening ? "animate-pulse" : ""} />
        
        {/* Pulsing ring animation when listening */}
        {listening && (
          <div className="absolute inset-0 rounded-sm animate-pulse-ring pointer-events-none" />
        )}
      </button>

      <AnimatePresence>
        {(listening || transcript) && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute top-full right-0 md:left-0 mt-3 w-64 bg-secondary text-white p-4 rounded-md shadow-xl z-50 border border-secondary-light"
          >
            <div className="absolute -top-2 right-4 md:left-4 md:right-auto w-4 h-4 bg-secondary transform rotate-45 border-l border-t border-secondary-light" />
            <p className="text-sm font-medium mb-1 text-primary">
              {listening ? 'Listening...' : 'Last voice prompt'}
            </p>
            <p className="text-sm font-light italic">
              "{transcript || 'Speak now...'}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
