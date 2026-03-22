import { useMemo } from "react";

export function useVoiceSearch(onText) {
  return useMemo(() => {
    if (typeof window === "undefined") return { supported: false, start: () => undefined };
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return { supported: false, start: () => undefined };
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onText(text);
    };
    return { supported: true, start: () => recognition.start() };
  }, [onText]);
}
