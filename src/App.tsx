import React, { useState, useEffect } from 'react';
import { AppTab, CefrScoreBreakdown, CefrLevel } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DiagnosticTest } from './components/DiagnosticTest';
import { PronunciationLab } from './components/PronunciationLab';
import { SpeakingAssessment } from './components/SpeakingAssessment';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { Award, Volume2, Mic, CheckCircle2, BarChart3, Globe, Heart } from 'lucide-react';

const STORAGE_KEY_SCORE = 'lingualvl_last_score';
const STORAGE_KEY_LANG = 'lingualvl_lang';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'en' || saved === 'ar') return saved;
    }
    return 'ar';
  });

  const isAr = lang === 'ar';

  const [currentTab, setCurrentTab] = useState<AppTab>('home');

  // Stored test score breakdown
  const [latestScore, setLatestScore] = useState<CefrScoreBreakdown | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_SCORE);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  // Keep html dir in sync with language
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isAr ? 'rtl' : 'ltr';
      document.documentElement.lang = isAr ? 'ar' : 'en';
    }
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  }, [lang, isAr]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // When a placement or test completes
  const handleTestCompleted = (breakdown: CefrScoreBreakdown) => {
    setLatestScore(breakdown);
    localStorage.setItem(STORAGE_KEY_SCORE, JSON.stringify(breakdown));
    setCurrentTab('analytics');
  };

  // If user updates speaking or pronunciation score
  const handlePronunciationScore = (score: number) => {
    if (latestScore) {
      const updated: CefrScoreBreakdown = {
        ...latestScore,
        speakingScore: Math.round((latestScore.speakingScore + score) / 2),
      };
      setLatestScore(updated);
      localStorage.setItem(STORAGE_KEY_SCORE, JSON.stringify(updated));
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${isAr ? 'font-arabic' : 'font-latin'}`}>
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
        onToggleLang={handleToggleLang}
        onStartExam={() => setCurrentTab('placement_test')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            <HeroSection
              lang={lang}
              onSelectTab={setCurrentTab}
              savedLevel={latestScore?.overallCefr || null}
            />

            {/* Quick Access Feature Bento Cards */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {isAr ? 'منظومة متكاملة لقياس وتطوير مهاراتك في الإنجليزية' : 'A Unified Engine for Assessment & Phonetics'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  {isAr
                    ? 'اختر المسار الذي ترغب في البدء به: اختبار شامل، تدريب فوري، أو معمل النطق المتخصص.'
                    : 'Select your learning trajectory: Full placement test, instant feedback drills, or targeted speech lab.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Placement Exam */}
                <div
                  onClick={() => setCurrentTab('placement_test')}
                  className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-600/10 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {isAr ? 'اختبار تحديد المستوى (CEFR)' : 'Official Placement Exam'}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isAr
                        ? 'اختبار معياري شامل يغطي القواعد والمفردات والاستماع والاستيعاب، ويمنحك تصنيفاً دقيقاً من A1 إلى C2 مع شهادة وخطة دراسية.'
                        : 'Comprehensive multi-skill assessment calibrated across CEFR criteria, delivering certified placement, radar analytics, and a 4-week roadmap.'}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
                    <span>{isAr ? 'بدء الاختبار الآن' : 'Take Exam'}</span>
                    <span className="font-mono text-slate-500">15-20 Min</span>
                  </div>
                </div>

                {/* Card 2: Pronunciation Lab */}
                <div
                  onClick={() => setCurrentTab('pronunciation_lab')}
                  className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-600/10 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Volume2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {isAr ? 'معمل نطق الكلمات الصعبة' : 'Word Pronunciation Lab'}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isAr
                        ? 'تدريب مخصص يعالج صعوبات P/B و V/F والحروف الصامتة والعناقيد الساكنة مع تحليل صوتي بالميكروفون وإرشادات اللسان بالذكاء الاصطناعي.'
                        : 'Acoustic voice analysis targeting Arab learner phonetic hurdles (P vs B, silent letters, dark L, syllable shifts) with real-time feedback.'}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
                    <span>{isAr ? 'دخول معمل النطق' : 'Open Speech Lab'}</span>
                    <span className="font-mono text-slate-500">Voice AI</span>
                  </div>
                </div>

                {/* Card 3: Instant Practice with Explanations */}
                <div
                  onClick={() => setCurrentTab('instant_practice')}
                  className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-600/10 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Award className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {isAr ? 'التقييم الفوري والشروحات' : 'Instant Pedagogical Drills'}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {isAr
                        ? 'أجب على الأسئلة واكتشف فوراً سبب صحة أو خطأ كل خيار، مع استخراج القاعدة النحوية وشرح ذكي من معلم الذكاء الاصطناعي.'
                        : 'Practice with instant green/red reveals, in-depth bilingual explanations, common pitfall warnings, and on-demand AI tutor insights.'}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400">
                    <span>{isAr ? 'بدء التدريب الفوري' : 'Start Drills'}</span>
                    <span className="font-mono text-slate-500">Adaptive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'placement_test' && (
          <DiagnosticTest
            mode="placement"
            lang={lang}
            onCompleteTest={handleTestCompleted}
            onOpenPronunciationLab={() => setCurrentTab('pronunciation_lab')}
          />
        )}

        {currentTab === 'instant_practice' && (
          <DiagnosticTest
            mode="instant"
            lang={lang}
            onCompleteTest={handleTestCompleted}
            onOpenPronunciationLab={() => setCurrentTab('pronunciation_lab')}
          />
        )}

        {currentTab === 'pronunciation_lab' && (
          <PronunciationLab
            lang={lang}
            onScoreRecorded={handlePronunciationScore}
          />
        )}

        {currentTab === 'speaking_test' && (
          <SpeakingAssessment
            lang={lang}
            onScoreRecorded={handlePronunciationScore}
          />
        )}

        {currentTab === 'analytics' && (
          <PerformanceDashboard
            scoreData={
              latestScore || {
                overallScore: 78,
                overallCefr: 'B2',
                grammarScore: 82,
                vocabScore: 76,
                readingScore: 80,
                listeningScore: 74,
                speakingScore: 78,
                totalQuestions: 15,
                correctCount: 12,
                date: new Date().toISOString(),
              }
            }
            lang={lang}
            onRetakeTest={() => setCurrentTab('placement_test')}
            onOpenPronunciationLab={() => setCurrentTab('pronunciation_lab')}
          />
        )}
      </main>

      {/* Clean, unboxed footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-latin font-bold text-slate-300">LinguaLevel</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'نظام تحديد مستوى اللغة الإنجليزية ومعمل النطق الصوتي' : 'CEFR English Diagnostic & Speech Lab'}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('placement_test')}
              className="hover:text-slate-300 transition-colors"
            >
              {isAr ? 'اختبار المستوى' : 'Placement Test'}
            </button>
            <button
              onClick={() => setCurrentTab('pronunciation_lab')}
              className="hover:text-slate-300 transition-colors"
            >
              {isAr ? 'معمل النطق' : 'Pronunciation Lab'}
            </button>
            <button
              onClick={() => setCurrentTab('analytics')}
              className="hover:text-slate-300 transition-colors"
            >
              {isAr ? 'التقرير والشهادة' : 'CEFR Report'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
