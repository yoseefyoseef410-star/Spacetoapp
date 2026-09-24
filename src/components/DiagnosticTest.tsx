import React, { useState, useEffect } from 'react';
import { Question, CefrLevel, SkillCategory, CefrScoreBreakdown } from '../types';
import { QUESTION_BANK } from '../data/questionBank';
import { SpeechAudioService } from '../services/speechService';
import { GeminiService } from '../services/geminiService';
import {
  CheckCircle2,
  XCircle,
  Volume2,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';

interface DiagnosticTestProps {
  mode: 'placement' | 'instant';
  lang: 'ar' | 'en';
  onCompleteTest: (breakdown: CefrScoreBreakdown) => void;
  onOpenPronunciationLab: () => void;
}

export const DiagnosticTest: React.FC<DiagnosticTestProps> = ({
  mode,
  lang,
  onCompleteTest,
  onOpenPronunciationLab,
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Filter states for instant practice mode
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<CefrLevel | 'all'>('all');
  const [selectedCatFilter, setSelectedCatFilter] = useState<SkillCategory | 'all'>('all');

  // Filtered list of questions
  const filteredQuestions = QUESTION_BANK.filter((q) => {
    if (selectedLevelFilter !== 'all' && q.level !== selectedLevelFilter) return false;
    if (selectedCatFilter !== 'all' && q.category !== selectedCatFilter) return false;
    return true;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = filteredQuestions[currentIndex] || QUESTION_BANK[0];

  // User answers map: questionId -> selectedOptionId
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showInstantFeedback, setShowInstantFeedback] = useState<Record<string, boolean>>({});

  // Audio playing state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9);

  // Timer for placement mode
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  // AI Deep Explanation modal state
  const [aiExplaining, setAiExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<{
    explanationAr: string;
    explanationEn: string;
    ruleTipAr: string;
  } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'placement' && !isTestSubmitted) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, isTestSubmitted]);

  // Audio Playback
  const handlePlayAudio = (text: string) => {
    if (isPlayingAudio) {
      SpeechAudioService.stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    SpeechAudioService.speak(text, {
      rate: audioSpeed,
      lang: 'en-US',
      onEnd: () => setIsPlayingAudio(false),
    });
  };

  // Option select handler
  const handleSelectOption = (optionId: string) => {
    if (mode === 'placement' && isTestSubmitted) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));

    if (mode === 'instant') {
      setShowInstantFeedback((prev) => ({
        ...prev,
        [currentQuestion.id]: true,
      }));
      setAiExplanation(null);
    }
  };

  // Ask AI Tutor for deep explanation
  const handleAskAiTutor = async () => {
    const chosen = userAnswers[currentQuestion.id];
    setAiExplaining(true);
    try {
      const result = await GeminiService.explainQuestion({
        questionText: currentQuestion.prompt,
        options: currentQuestion.options,
        correctAnswer: currentQuestion.options.find((o) => o.id === currentQuestion.correctOptionId)?.text || '',
        userAnswer: currentQuestion.options.find((o) => o.id === chosen)?.text || 'None selected',
        contextCategory: currentQuestion.category,
      });
      setAiExplanation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAiExplaining(false);
    }
  };

  // Finish and compute score
  const handleSubmitExam = () => {
    setIsTestSubmitted(true);

    let total = QUESTION_BANK.length;
    let correct = 0;

    let catTotals: Record<SkillCategory, number> = {
      grammar: 0,
      vocabulary: 0,
      reading: 0,
      listening: 0,
      speaking: 1,
    };
    let catCorrect: Record<SkillCategory, number> = {
      grammar: 0,
      vocabulary: 0,
      reading: 0,
      listening: 0,
      speaking: 1,
    };

    QUESTION_BANK.forEach((q) => {
      catTotals[q.category] = (catTotals[q.category] || 0) + 1;
      if (userAnswers[q.id] === q.correctOptionId) {
        correct += 1;
        catCorrect[q.category] = (catCorrect[q.category] || 0) + 1;
      }
    });

    const percent = Math.round((correct / total) * 100);

    // Map percentage to CEFR
    let cefr: CefrLevel = 'A1';
    if (percent >= 88) cefr = 'C2';
    else if (percent >= 76) cefr = 'C1';
    else if (percent >= 62) cefr = 'B2';
    else if (percent >= 48) cefr = 'B1';
    else if (percent >= 32) cefr = 'A2';
    else cefr = 'A1';

    const grammarPct = catTotals.grammar ? Math.round((catCorrect.grammar / catTotals.grammar) * 100) : 70;
    const vocabPct = catTotals.vocabulary ? Math.round((catCorrect.vocabulary / catTotals.vocabulary) * 100) : 70;
    const readingPct = catTotals.reading ? Math.round((catCorrect.reading / catTotals.reading) * 100) : 75;
    const listeningPct = catTotals.listening ? Math.round((catCorrect.listening / catTotals.listening) * 100) : 75;

    const breakdown: CefrScoreBreakdown = {
      overallScore: percent,
      overallCefr: cefr,
      grammarScore: grammarPct,
      vocabScore: vocabPct,
      readingScore: readingPct,
      listeningScore: listeningPct,
      speakingScore: Math.min(100, Math.round((grammarPct + vocabPct) / 2)),
      totalQuestions: total,
      correctCount: correct,
      date: new Date().toISOString(),
    };

    onCompleteTest(breakdown);
  };

  const currentSelected = userAnswers[currentQuestion.id];
  const isAnswered = Boolean(currentSelected);
  const isCorrect = currentSelected === currentQuestion.correctOptionId;
  const showFeedback = mode === 'instant' ? showInstantFeedback[currentQuestion.id] : isTestSubmitted;

  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / filteredQuestions.length) * 100);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header bar of the test */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
            <span>
              {mode === 'placement'
                ? isAr
                  ? 'اختبار تحديد المستوى المعتمد'
                  : 'Official CEFR Placement Examination'
                : isAr
                ? 'وضع التقييم الفوري والشروحات التعليمية'
                : 'Instant Evaluation & Practice Mode'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-400">
              {currentIndex + 1} / {filteredQuestions.length}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {isAr ? currentQuestion.titleAr : currentQuestion.titleEn}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {mode === 'placement' && (
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs font-semibold text-amber-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          )}

          {/* Level Pill indicator */}
          <div className="rounded-md border border-indigo-500/30 bg-indigo-950/40 px-2.5 py-1 font-mono text-xs font-bold text-indigo-300">
            CEFR {currentQuestion.level}
          </div>
        </div>
      </div>

      {/* Instant Practice Filter Bar (only visible in instant mode) */}
      {mode === 'instant' && (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-medium me-2">
            <Filter className="h-3.5 w-3.5" />
            <span>{isAr ? 'تصفية المستوى:' : 'Level Filter:'}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {(['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevelFilter(lvl);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-md font-mono transition-colors ${
                  selectedLevelFilter === lvl
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lvl === 'all' ? (isAr ? 'الكل' : 'All') : lvl}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-800 mx-2 hidden sm:block" />

          <div className="flex flex-wrap gap-1">
            {(['all', 'grammar', 'vocabulary', 'reading', 'listening'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCatFilter(cat);
                  setCurrentIndex(0);
                }}
                className={`px-2 py-1 rounded-md capitalize transition-colors ${
                  selectedCatFilter === cat
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat === 'all'
                  ? isAr
                    ? 'جميع المهارات'
                    : 'All Skills'
                  : cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>{isAr ? 'نسبة إنجاز الأسئلة' : 'Progress'}</span>
          <span className="font-mono tabular-nums">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-sm">
        {/* Context Passage if Reading */}
        {currentQuestion.contextPassage && (
          <div className="mb-5 rounded-xl border border-slate-700/80 bg-slate-950/70 p-4 text-sm leading-relaxed text-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-2">
              <BookOpen className="h-4 w-4" />
              <span>{isAr ? 'اقرأ النص واستنتج الإجابة' : 'Reading Passage'}</span>
            </div>
            <p className="font-latin text-slate-200 leading-relaxed text-base">
              {currentQuestion.contextPassage}
            </p>
          </div>
        )}

        {/* Audio Player if Listening */}
        {currentQuestion.audioText && (
          <div className="mb-5 rounded-xl border border-indigo-900/50 bg-indigo-950/30 p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-indigo-400" />
                <div>
                  <div className="text-xs font-semibold text-indigo-300">
                    {isAr ? 'مقطع استماع صوتي ناطق (استمع بعناية)' : 'Native Spoken Audio Passage'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {isAr ? 'اضغط لتشغيل الصوت وملاحظة النطق' : 'Click to listen to native speaker articulation'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={audioSpeed}
                  onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                  className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300"
                  aria-label="Playback speed"
                >
                  <option value={0.75}>0.75x ({isAr ? 'بطيء' : 'Slow'})</option>
                  <option value={0.9}>0.9x ({isAr ? 'متزن' : 'Natural'})</option>
                  <option value={1.1}>1.1x ({isAr ? 'سريع' : 'Fast'})</option>
                </select>

                <button
                  onClick={() => handlePlayAudio(currentQuestion.audioText!)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-white transition-colors ${
                    isPlayingAudio
                      ? 'bg-amber-600 hover:bg-amber-500 animate-pulse'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  <Volume2 className="h-4 w-4" />
                  <span>{isPlayingAudio ? (isAr ? 'إيقاف الصوت' : 'Stop Audio') : (isAr ? 'استمع الآن' : 'Play Audio')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question Prompt */}
        <div className="mb-6">
          <p className="font-latin text-lg sm:text-xl font-semibold text-white leading-relaxed">
            {currentQuestion.prompt}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isChosen = currentSelected === option.id;
            const isTargetCorrect = option.id === currentQuestion.correctOptionId;

            let optionStyle = 'border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60';

            if (showFeedback) {
              if (isTargetCorrect) {
                optionStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-semibold ring-1 ring-emerald-500/50';
              } else if (isChosen && !isTargetCorrect) {
                optionStyle = 'border-rose-500/80 bg-rose-950/40 text-rose-200 font-semibold ring-1 ring-rose-500/50';
              } else {
                optionStyle = 'border-slate-800/50 bg-slate-950/30 text-slate-500 opacity-60';
              }
            } else if (isChosen) {
              optionStyle = 'border-indigo-500 bg-indigo-950/50 text-white ring-2 ring-indigo-500/40';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={mode === 'placement' && isTestSubmitted}
                className={`w-full text-start flex items-center justify-between rounded-xl border p-4 transition-all ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 font-mono text-xs font-bold text-slate-300">
                    {option.id.toUpperCase()}
                  </span>
                  <span className="font-latin text-sm sm:text-base">{option.text}</span>
                </div>

                {showFeedback && (
                  <div className="shrink-0 ms-2">
                    {isTargetCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                    {isChosen && !isTargetCorrect && <XCircle className="h-5 w-5 text-rose-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Pedagogical Breakdown (Visible in Instant Mode or after Submit) */}
        {showFeedback && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                {isCorrect ? (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    {isAr ? 'إجابة صحيحة! أحسنت' : 'Correct Answer! Great Job'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <XCircle className="h-4 w-4" />
                    {isAr ? 'إجابة غير صحيحة، طالع التفسير التعليمي' : 'Incorrect, examine the pedagogical breakdown'}
                  </span>
                )}
              </div>

              {/* Ask AI Button */}
              <button
                onClick={handleAskAiTutor}
                disabled={aiExplaining}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 hover:text-white transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>{aiExplaining ? (isAr ? 'جارٍ التحليل...' : 'Analyzing...') : (isAr ? 'شرح أعمق بالذكاء الاصطناعي' : 'Deep AI Explanation')}</span>
              </button>
            </div>

            {/* In-depth explanation in Arabic and English */}
            <div className="text-sm space-y-2 text-slate-300 leading-relaxed">
              <p className="text-slate-200">{isAr ? currentQuestion.explanationAr : currentQuestion.explanationEn}</p>
              {isAr && (
                <p className="font-latin text-xs text-slate-400 italic">
                  {currentQuestion.explanationEn}
                </p>
              )}
            </div>

            {/* Grammar rule reminder */}
            {currentQuestion.grammarRuleAr && (
              <div className="rounded-lg border border-indigo-900/40 bg-indigo-950/20 p-3 text-xs text-indigo-300 flex items-start gap-2">
                <BookOpen className="h-4 w-4 shrink-0 mt-0.5 text-indigo-400" />
                <div>
                  <span className="font-semibold text-indigo-200">{isAr ? 'القاعدة النحوية الذهبية: ' : 'Grammar Golden Rule: '}</span>
                  <span>{currentQuestion.grammarRuleAr}</span>
                </div>
              </div>
            )}

            {/* Arabic Learner Pitfall warning */}
            {currentQuestion.commonPitfallAr && (
              <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <span className="font-semibold text-amber-200">{isAr ? 'فخ شائع للمتحدثين بالعربية: ' : 'Common Pitfall for Arabic Speakers: '}</span>
                  <span>{currentQuestion.commonPitfallAr}</span>
                </div>
              </div>
            )}

            {/* AI Explanation Accordion */}
            {aiExplanation && (
              <div className="mt-3 rounded-lg border border-violet-800/40 bg-violet-950/30 p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-violet-300">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <span>{isAr ? 'تحليل معلم الذكاء الاصطناعي الخاص:' : 'Personalized AI Tutor Breakdown:'}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{aiExplanation.explanationAr}</p>
                <div className="text-[11px] text-violet-200 bg-violet-900/40 p-2 rounded">
                  <span className="font-semibold">{isAr ? 'نصيحة للحفظ والاسترجاع: ' : 'Memory Anchor: '}</span>
                  <span>{aiExplanation.ruleTipAr}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex((prev) => prev - 1);
                setAiExplanation(null);
              }
            }}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            {isAr ? 'السؤال السابق' : 'Previous'}
          </button>

          {currentIndex < filteredQuestions.length - 1 ? (
            <button
              onClick={() => {
                setCurrentIndex((prev) => prev + 1);
                setAiExplanation(null);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20"
            >
              <span>{isAr ? 'السؤال التالي' : 'Next Question'}</span>
              <ArrowIcon className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitExam}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/30"
            >
              <Check className="h-4 w-4" />
              <span>{isAr ? 'إنهاء وحساب المستوى (CEFR)' : 'Complete & Calculate CEFR'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Access to Pronunciation Lab banner */}
      <div className="mt-8 rounded-xl border border-indigo-900/40 bg-slate-900/40 p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
            <Volume2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isAr ? 'هل ترغب في اختبار وتحسين نطق الكلمات الصعبة؟' : 'Ready to practice speaking and correct tough phonetics?'}
            </div>
            <div className="text-xs text-slate-400">
              {isAr ? 'معمل تفاعلي يعالج أصوات P/B والحروف الصامتة والعناقيد الساكنة بالذكاء الاصطناعي' : 'Interactive phonetic lab diagnosing Arabic speaker speech patterns'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenPronunciationLab}
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-600/10 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
        >
          <span>{isAr ? 'الانتقال لمعمل النطق' : 'Open Speech Lab'}</span>
          <ArrowIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
