// Web Speech API and Audio Utilities

// Check SpeechRecognition support
const SpeechRecognition =
  typeof window !== 'undefined'
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export class SpeechAudioService {
  private static synth: SpeechSynthesis | null =
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis
      : null;

  // Speak text with native voice
  public static speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      lang?: 'en-US' | 'en-GB';
      onEnd?: () => void;
    }
  ) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser environment.');
      options?.onEnd?.();
      return;
    }

    this.synth.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || 0.9;
    utterance.pitch = options?.pitch || 1.0;
    utterance.lang = options?.lang || 'en-US';

    // Try to pick a natural English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith(options?.lang || 'en-US') &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      options?.onEnd?.();
    };

    this.synth.speak(utterance);
  }

  public static stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Create a speech recognition session
  public static createRecognitionSession(callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (err: any) => void;
    onEnd: () => void;
  }) {
    if (!SpeechRecognition) {
      return null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const transcript = final || interim;
        callbacks.onResult(transcript.trim(), Boolean(final));
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        callbacks.onError(event.error);
      };

      recognition.onend = () => {
        callbacks.onEnd();
      };

      return recognition;
    } catch (err) {
      console.error('Failed to create SpeechRecognition:', err);
      return null;
    }
  }

  // Calculate similarity ratio between target word and recognized speech
  public static calculatePhoneticMatch(target: string, actual: string): number {
    const cleanTarget = target.toLowerCase().replace(/[^a-z]/g, '');
    const cleanActual = actual.toLowerCase().replace(/[^a-z]/g, '');

    if (!cleanTarget || !cleanActual) return 0;
    if (cleanTarget === cleanActual) return 100;

    // Levenshtein distance
    const track = Array(cleanActual.length + 1)
      .fill(null)
      .map(() => Array(cleanTarget.length + 1).fill(null));

    for (let i = 0; i <= cleanActual.length; i += 1) {
      track[i][0] = i;
    }
    for (let j = 0; j <= cleanTarget.length; j += 1) {
      track[0][j] = j;
    }

    for (let i = 1; i <= cleanActual.length; i += 1) {
      for (let j = 1; j <= cleanTarget.length; j += 1) {
        const indicator = cleanActual[i - 1] === cleanTarget[j - 1] ? 0 : 1;
        track[i][j] = Math.min(
          track[i - 1][j] + 1, // deletion
          track[i][j - 1] + 1, // insertion
          track[i - 1][j - 1] + indicator // substitution
        );
      }
    }

    const distance = track[cleanActual.length][cleanTarget.length];
    const maxLength = Math.max(cleanTarget.length, cleanActual.length);
    const score = Math.max(0, Math.round(((maxLength - distance) / maxLength) * 100));

    return score;
  }
}
