import React from 'react';
import { AppTab, CefrLevel } from '../types';
import { Award, Volume2, Mic, ArrowRight, ArrowLeft, BarChart2, CheckCircle, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  lang: 'ar' | 'en';
  onSelectTab: (tab: AppTab) => void;
  savedLevel: CefrLevel | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  onSelectTab,
  savedLevel,
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const cefrTiers: { level: CefrLevel; titleAr: string; titleEn: string; color: string }[] = [
    { level: 'A1', titleAr: 'مبتدئ أساسي', titleEn: 'Breakthrough', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/30' },
    { level: 'A2', titleAr: 'أساسي متقدم', titleEn: 'Waystage', color: 'border-teal-500/30 text-teal-400 bg-teal-950/30' },
    { level: 'B1', titleAr: 'متوسط استقلالي', titleEn: 'Threshold', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/30' },
    { level: 'B2', titleAr: 'فوق المتوسط طليق', titleEn: 'Vantage', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-950/30' },
    { level: 'C1', titleAr: 'متقدم فعال', titleEn: 'Effective Operational', color: 'border-violet-500/30 text-violet-400 bg-violet-950/30' },
    { level: 'C2', titleAr: 'إتقان تام (مستوى أم)', titleEn: 'Mastery', color: 'border-amber-500/30 text-amber-400 bg-amber-950/30' },
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-12 lg:pt-10 lg:pb-16 border-b border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Copy & Controls */}
          <div className="lg:col-span-7 flex flex-col items-start text-start space-y-5">
            {/* Editorial Kicker */}
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 tracking-wide">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>{isAr ? 'المنظومة الذكية لتشخيص الإنجليزية وتطوير النطق' : 'AI-Powered English Diagnostic & Speech Lab'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">CEFR A1 ➔ C2</span>
            </div>

            {/* Main Headline (Anti-orphan balancing) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2] max-w-2xl">
              {isAr ? (
                <>
                  حدد مستواك الحقيقي في الإنجليزية مع{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
                    تقييم فوري ومعمل نطق دقيق
                  </span>
                </>
              ) : (
                <>
                  Determine Your Certified English Level with{' '}
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
                    Instant AI Evaluation & Speech Lab
                  </span>
                </>
              )}
            </h1>

            {/* Body Copy */}
            <p className="text-base text-slate-300 leading-relaxed max-w-xl">
              {isAr
                ? 'اختبارات تفاعلية تقيس القواعد والمفردات والاستماع والاستيعاب، مع نظام تصحيح فوري يكشف سبب كل إجابة، ومعمل صوتي متطور لعلاج صعوبات النطق الخاصة بالناطقين بالعربية.'
                : 'Adaptive diagnostic examinations across grammar, vocabulary, reading, and listening. Get instant pedagogical feedback, CEFR radar profiling, and an interactive phonetics coach tailored for Arabic speakers.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('placement_test')}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/40 active:scale-[0.98]"
              >
                <span>{isAr ? 'بدء اختبار تحديد المستوى' : 'Start Placement Exam'}</span>
                <ArrowIcon className="h-4 w-4" />
              </button>

              <button
                onClick={() => onSelectTab('pronunciation_lab')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-indigo-500/50 hover:bg-slate-800 hover:text-white"
              >
                <Volume2 className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>{isAr ? 'معمل نطق وتصحيح الكلمات' : 'Open Pronunciation Lab'}</span>
              </button>

              <button
                onClick={() => onSelectTab('instant_practice')}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:text-slate-200 hover:border-slate-700"
              >
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'تدريب فوري مع التفسير' : 'Instant Practice Mode'}</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-800/80 w-full max-w-xl text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{isAr ? 'معايير كامبريدج وCEFR' : 'CEFR Framework'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>{isAr ? 'تحليل صوتي بالميكروفون' : 'Voice Phonetic Match'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>{isAr ? 'شهادة وخطة 4 أسابيع' : '4-Week Roadmap'}</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-3 shadow-2xl backdrop-blur-sm overflow-hidden group">
              {/* Image asset with fallback container */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-950">
                <img
                  src="/src/assets/images/hero_english_mastery_1790284305476.jpg"
                  alt="English Language Proficiency Assessment Visualizer"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to stylized SVG canvas if needed
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Visual contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                {/* Floating active level badge if user has one */}
                {savedLevel ? (
                  <div className="absolute top-3 left-3 bg-slate-900/90 border border-indigo-500/40 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2">
                    <span className="text-xs text-slate-400">{isAr ? 'مستواك الحالي المحفوظ:' : 'Current Saved Level:'}</span>
                    <span className="font-mono text-sm font-bold text-indigo-300">{savedLevel}</span>
                  </div>
                ) : null}

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md rounded-lg p-2.5 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="font-medium text-white">{isAr ? 'تقييم شامل متعدد المهارات' : 'Multi-Skill Assessment'}</span>
                  </div>
                  <button
                    onClick={() => onSelectTab('analytics')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>{isAr ? 'عرض لوحة التحليل' : 'View Report'}</span>
                    <ArrowIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* CEFR Level Bar Spectrum */}
              <div className="mt-3 grid grid-cols-6 gap-1.5 text-center">
                {cefrTiers.map((tier) => (
                  <div
                    key={tier.level}
                    className={`rounded-md border p-1.5 transition-all ${tier.color}`}
                  >
                    <div className="font-mono text-xs font-bold">{tier.level}</div>
                    <div className="text-[10px] text-slate-400 truncate hidden sm:block">
                      {isAr ? tier.titleAr : tier.titleEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
