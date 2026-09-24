export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type SkillCategory = 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'speaking';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  level: CefrLevel;
  category: SkillCategory;
  titleAr: string;
  titleEn: string;
  prompt: string;
  contextPassage?: string; // For reading or listening questions
  audioText?: string; // Text to be spoken natively for listening test
  options: QuestionOption[];
  correctOptionId: string;
  explanationAr: string;
  explanationEn: string;
  grammarRuleAr?: string;
  commonPitfallAr?: string;
}

export interface TestAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface CefrScoreBreakdown {
  overallScore: number;
  overallCefr: CefrLevel;
  grammarScore: number;
  vocabScore: number;
  readingScore: number;
  listeningScore: number;
  speakingScore: number;
  totalQuestions: number;
  correctCount: number;
  date: string;
}

export interface PronunciationWord {
  id: string;
  word: string;
  ipa: string;
  arabicMeaning: string;
  level: CefrLevel;
  category: 'p_vs_b' | 'v_vs_f' | 'th_sounds' | 'silent_letters' | 'consonant_clusters' | 'vowels_diphthongs' | 'word_stress';
  categoryLabelAr: string;
  syllableStress: string;
  sampleSentence: string;
  mouthTipAr: string;
  commonArabMistakeAr: string;
}

export interface PronunciationResult {
  word: string;
  score: number;
  accuracyGrade: 'Excellent' | 'Good' | 'Needs Practice';
  spokenTranscript: string;
  feedbackAr: string;
  feedbackEn: string;
  tonguePlacementAr: string;
  arabicSpeakerWarning: string;
  syllableBreakdown: string;
  drillWords: string[];
}

export interface DiagnosticAiReport {
  cefrLevel: CefrLevel;
  levelDescriptionAr: string;
  summaryAr: string;
  summaryEn: string;
  strengthsAr: string[];
  weaknessesAr: string[];
  actionPlanWeeks: {
    week: number;
    focusAr: string;
    focusEn: string;
    hoursPerWeek: number;
    practicalTipAr: string;
  }[];
  recommendedTopics: string[];
}

export type AppTab = 'home' | 'placement_test' | 'instant_practice' | 'pronunciation_lab' | 'speaking_test' | 'analytics';
