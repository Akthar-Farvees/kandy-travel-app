import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import type { FilterState, ProductCategory } from '../types';

const CATEGORY_KEYWORDS: Record<ProductCategory, string[]> = {
  tea: ['tea', 'teas'],
  handicraft: ['handicraft', 'handicrafts', 'craft', 'crafts', 'wooden'],
  jewelry: ['jewelry', 'jewellery', 'jewel', 'jewels'],
  spice: ['spice', 'spices', 'cinnamon', 'cardamom', 'clove'],
  textile: ['textile', 'textiles', 'fabric', 'batik', 'scarf'],
  pottery: ['pottery', 'pot', 'pots', 'ceramic', 'clay'],
};

const NUMBER_WORDS: Record<string, number> = {
  ten: 10,
  twenty: 20,
  twentyfive: 25,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
};

function extractPriceLimit(transcript: string) {
  if (transcript.includes('cheap') || transcript.includes('budget') || transcript.includes('affordable')) {
    return 25;
  }

  const numericMatch = transcript.match(/(?:under|below|less than|max)\s+(\d+)/);
  if (numericMatch?.[1]) {
    return Number.parseInt(numericMatch[1], 10);
  }

  const wordMatch = transcript.match(/(?:under|below|less than|max)\s+([a-z-]+)/);
  if (!wordMatch?.[1]) {
    return undefined;
  }

  const normalizedWord = wordMatch[1].replace(/[^a-z]/g, '');
  return NUMBER_WORDS[normalizedWord];
}

function parseVoicePrompt(transcript: string): FilterState {
  const normalizedTranscript = transcript.toLowerCase().trim();
  const result: FilterState = {};

  const categoryEntry = Object.entries(CATEGORY_KEYWORDS).find(([, keywords]) =>
    keywords.some((keyword) => normalizedTranscript.includes(keyword)),
  );

  if (categoryEntry) {
    result.category = categoryEntry[0] as ProductCategory;
  }

  const maxPrice = extractPriceLimit(normalizedTranscript);
  if (maxPrice) {
    result.max_price = maxPrice;
  }

  if (!result.category) {
    result.q = normalizedTranscript
      .replace(/show me/gi, '')
      .replace(/show/gi, '')
      .replace(/find/gi, '')
      .replace(/looking for/gi, '')
      .trim();
  }

  return result;
}

export function useVoiceSearch() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  const normalizedTranscript = transcript.trim();
  const filterResult = !listening && normalizedTranscript ? parseVoicePrompt(normalizedTranscript) : null;

  const toggleListening = () => {
    if (listening) {
      void SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      void SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
    }
  };

  return {
    transcript: normalizedTranscript,
    listening,
    toggleListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    filterResult
  };
}
