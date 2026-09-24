import React, { useState, useEffect } from 'react';
import { CefrScoreBreakdown, CefrLevel, DiagnosticAiReport } from '../types';
import { GeminiService } from '../services/geminiService';
import {
  Award,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Download,
  RotateCcw,
  BookOpen,
  Headphones,
  Volume2,
  Mic,
  Printer,
  Sparkles,
  Share2
} from 'lucide-react';

interface PerformanceDashboardProps {
  scoreData: CefrScoreBreakdown;
  lang: 'ar' | 'en';
  onRetakeTest: () => void;
  onOpenPronunciationLab: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  scoreData,
  lang,
  onRetakeTest,
  onOpenPronunciationLab,
}) => {
  const isAr = lang === 'ar';

  const [aiReport, setAiReport] = useState<DiagnosticAiReport | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [candidateName, setCandidateName] = useState('English Learner');
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    // Fetch AI Diagnostic report
    const fetchReport = async () => {
      setLoadingAi(true);
      try {
        const report = await GeminiService.getDeepDiagnosis({
          overallScore: scoreData.overallScore,
          cefrLevel: scoreData.overallCefr,
          grammarScore: scoreData.grammarScore,
          vocabScore: scoreData.vocabScore,
          readingScore: scoreData.readingScore,
          listeningScore: scoreData.listeningScore,
          speakingScore: scoreData.speakingScore,
          totalQuestions: scoreData.totalQuestions,
        });
        setAiReport(report);
      } catch (e) {
        console.error('Error fetching diagnosis:', e);
      } finally {
        setLoadingAi(false);
      }
    };

    fetchReport();
  }, [scoreData]);

  const cefrDescriptions: Record<CefrLevel, { nameAr: string; nameEn: string; descAr: string; descEn: string }> = {
    A1: {
      nameAr: 'مبتدئ أساسي (Breakthrough)',
      nameEn: 'A1 Breakthrough',
      descAr: 'تستطيع فهم واستخدام التعبيرات اليومية المألوفة والجمل البسيطة جداً لتلبية احتياجات محددة.',
      descEn: 'Can understand and use familiar everyday expressions and very basic phrases for concrete needs.',
    },
    A2: {
      nameAr: 'أساسي متقدم (Waystage)',
      nameEn: 'A2 Waystage',
      descAr: 'تستطيع التواصل في المهام البسيطة والروتينية التي تتطلب تبادلاً بسيطاً ومباشراً للمعلومات.',
      descEn: 'Can communicate in simple, routine tasks requiring direct exchange of basic information.',
    },
    B1: {
      nameAr: 'متوسط مستقل (Threshold)',
      nameEn: 'B1 Threshold',
      descAr: 'تستطيع فهم النقاط الرئيسية في موضوعات مألوفة، والتعامل مع معظم المواقف وتكوين نصوص مترابطة بسيطة.',
      descEn: 'Can understand main points of familiar matters, handle travel situations, and produce connected simple text.',
    },
    B2: {
      nameAr: 'فوق المتوسط طليق (Vantage)',
      nameEn: 'B2 Vantage',
      descAr: 'تستطيع فهم الأفكار الرئيسية في النصوص المعقدة والتفاعل بدرجة من الطلاقة والعفوية دون عناء ملحوظ.',
      descEn: 'Can understand complex text, interact with spontaneity and fluency without strain for native speakers.',
    },
    C1: {
      nameAr: 'متقدم فعال (Effective Operational)',
      nameEn: 'C1 Effective Operational Proficiency',
      descAr: 'تستطيع فهم نصوص طويلة ومتطلبة، والتعبير عن أفكارك بطلاقة وبشكل عفوي لأغراض أكاديمية ومهنية راقية.',
      descEn: 'Can express ideas fluently and spontaneously for academic and professional purposes with subtle nuance.',
    },
    C2: {
      nameAr: 'إتقان تام واقتدار لغوي (Mastery)',
      nameEn: 'C2 Mastery',
      descAr: 'تستطيع فهم كل ما يُسمع أو يُقرأ بسهولة فائقة، وإعادة صياغة الحجج والتعبير بدقة متناهية تشبه المتحدثين الأصليين المتمكنين.',
      descEn: 'Can understand with ease virtually everything heard or read, expressing spontaneously and very fluently with high precision.',
    },
  };

  const currentDesc = cefrDescriptions[scoreData.overallCefr] || cefrDescriptions.B1;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Award className="h-4 w-4" />
            <span>{isAr ? 'تقرير الكفاءة اللغوية والتشخيص المعياري' : 'Official CEFR Language Proficiency Report'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-400">{new Date(scoreData.date).toLocaleDateString()}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {isAr ? 'تحليل الأداء الشامل والشهادة المعتمدة' : 'Performance Analysis & Certification'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetakeTest}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isAr ? 'إعادة الاختبار' : 'Retake Exam'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
          >
            <Printer className="h-4 w-4" />
            <span>{isAr ? 'طباعة / حفظ الشهادة' : 'Print Certificate'}</span>
          </button>
        </div>
      </div>

      {/* Main CEFR Level Hero Card */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Level Badge & Score */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r md:border-slate-800/80">
            <div className="relative mb-3">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-600 text-white font-mono text-4xl font-extrabold shadow-xl shadow-indigo-600/40 ring-4 ring-indigo-500/20">
                {scoreData.overallCefr}
              </div>
            </div>

            <div className="font-mono text-xs font-semibold text-indigo-300 uppercase tracking-widest">
              CEFR Framework
            </div>
            <div className="font-bold text-white text-base mt-1">
              {isAr ? currentDesc.nameAr : currentDesc.nameEn}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              {isAr ? 'الدرجة الإجمالية:' : 'Composite Score:'} <span className="text-amber-400 font-bold">{scoreData.overallScore}%</span> ({scoreData.correctCount}/{scoreData.totalQuestions})
            </div>
          </div>

          {/* Level Qualitative Description & Summary */}
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <Sparkles className="h-4 w-4" />
              <span>{isAr ? 'التشخيص اللغوي للأداء' : 'Qualitative Linguistic Diagnosis'}</span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {isAr ? currentDesc.descAr : currentDesc.descEn}
            </p>

            {aiReport && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300 leading-relaxed space-y-2">
                <p className="text-slate-200">{isAr ? aiReport.summaryAr : aiReport.summaryEn}</p>
                {isAr && (
                  <p className="font-latin text-[11px] text-slate-400 italic">
                    {aiReport.summaryEn}
                  </p>
                )}
              </div>
            )}

            {loadingAi && (
              <div className="text-xs text-indigo-300 animate-pulse flex items-center gap-2 py-2">
                <Sparkles className="h-4 w-4" />
                <span>{isAr ? 'جارٍ توليد التقرير التحليلي بالذكاء الاصطناعي...' : 'Generating tailored AI diagnostic roadmap...'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5-Dimensional Skill Breakdown Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
          <span>{isAr ? 'تحليل المهارات اللغوية الخمس' : 'Five-Skill Language Breakdown'}</span>
          <span>{isAr ? 'النسبة المئوية' : 'Percentage'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Grammar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span>{isAr ? 'القواعد' : 'Grammar'}</span>
              </div>
              <span className="font-mono text-sm font-bold text-emerald-400">{scoreData.grammarScore}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${scoreData.grammarScore}%` }} />
            </div>
            <div className="text-[11px] text-slate-400">
              {scoreData.grammarScore >= 75 ? (isAr ? 'فهم متين للتراكيب' : 'Solid syntax control') : (isAr ? 'يحتاج ضبط للأزمنة' : 'Tense focus needed')}
            </div>
          </div>

          {/* Vocabulary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Award className="h-4 w-4 text-cyan-400" />
                <span>{isAr ? 'المفردات' : 'Vocabulary'}</span>
              </div>
              <span className="font-mono text-sm font-bold text-cyan-400">{scoreData.vocabScore}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${scoreData.vocabScore}%` }} />
            </div>
            <div className="text-[11px] text-slate-400">
              {scoreData.vocabScore >= 75 ? (isAr ? 'حصيلة معجمية واسعة' : 'Broad lexical range') : (isAr ? 'تعزيز المتلازمات' : 'Expand collocations')}
            </div>
          </div>

          {/* Reading */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                <span>{isAr ? 'القراءة' : 'Reading'}</span>
              </div>
              <span className="font-mono text-sm font-bold text-indigo-400">{scoreData.readingScore}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${scoreData.readingScore}%` }} />
            </div>
            <div className="text-[11px] text-slate-400">
              {scoreData.readingScore >= 75 ? (isAr ? 'استيعاب دقيق للسياق' : 'Accurate inference') : (isAr ? 'تحليل النصوص المعقدة' : 'Complex texts practice')}
            </div>
          </div>

          {/* Listening */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Headphones className="h-4 w-4 text-amber-400" />
                <span>{isAr ? 'الاستماع' : 'Listening'}</span>
              </div>
              <span className="font-mono text-sm font-bold text-amber-400">{scoreData.listeningScore}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${scoreData.listeningScore}%` }} />
            </div>
            <div className="text-[11px] text-slate-400">
              {scoreData.listeningScore >= 75 ? (isAr ? 'التقاط المعاني السريعة' : 'Sharp acoustic grasp') : (isAr ? 'التدريب على السرعات' : 'Practice native audio')}
            </div>
          </div>

          {/* Speaking & Pronunciation */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Mic className="h-4 w-4 text-violet-400" />
                <span>{isAr ? 'النطق والحديث' : 'Speaking'}</span>
              </div>
              <span className="font-mono text-sm font-bold text-violet-400">{scoreData.speakingScore}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${scoreData.speakingScore}%` }} />
            </div>
            <div className="text-[11px] text-slate-400">
              <button
                onClick={onOpenPronunciationLab}
                className="text-violet-400 hover:underline font-semibold"
              >
                {isAr ? 'معمل النطق ➔' : 'Speech Lab ➔'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses Analysis */}
      {aiReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="rounded-2xl border border-emerald-900/40 bg-slate-900/70 p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <span>{isAr ? 'نقاط القوة المتميزة (Strengths)' : 'Demonstrated Strengths'}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {aiReport.strengthsAr.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses / Opportunities */}
          <div className="rounded-2xl border border-amber-900/40 bg-slate-900/70 p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
              <TrendingUp className="h-5 w-5" />
              <span>{isAr ? 'نقاط التحسين والتطوير المستهدف' : 'Targeted Growth Opportunities'}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {aiReport.weaknessesAr.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 4-Week Custom Study Plan */}
      {aiReport && aiReport.actionPlanWeeks && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <span>{isAr ? 'الخطة الأسبوعية المقترحة لتخطي مستواك الحالي (4 أسابيع)' : 'Personalized 4-Week Progression Roadmap'}</span>
            </div>
            <span className="text-xs text-indigo-400 font-mono font-semibold">CEFR Mastery Plan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {aiReport.actionPlanWeeks.map((wk) => (
              <div
                key={wk.week}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-400 mb-1">
                    <span>{isAr ? `الأسبوع ${wk.week}` : `Week ${wk.week}`}</span>
                    <span className="text-slate-400 text-[10px]">{wk.hoursPerWeek} {isAr ? 'ساعات' : 'hrs/wk'}</span>
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">
                    {isAr ? wk.focusAr : wk.focusEn}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-indigo-300 font-semibold">{isAr ? 'تطبيق عملي: ' : 'Drill: '}</span>
                  <span>{wk.practicalTipAr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable CEFR Certificate Card */}
      <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden certificate-print-area">
        {/* Subtle decorative gold borders */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500/10 via-amber-400 to-amber-500/10" />

        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* Certificate Badge Seal */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-xl bg-slate-950 p-1">
              <img
                src="/src/assets/images/badge_cefr_certificate_1790284317086.jpg"
                alt="CEFR Certificate Seal"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          <div>
            <div className="font-latin text-xs font-bold uppercase tracking-widest text-amber-400">
              Certificate of English Language Proficiency
            </div>
            <h3 className="font-latin text-2xl sm:text-3xl font-extrabold text-white mt-1">
              CEFR English Competence Attestation
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isAr ? 'شهادة إلكترونية صادرة وفق معايير الإطار الأوروبي المرجعي الموحد للغات' : 'Issued in accordance with the Common European Framework of Reference for Languages (CEFR)'}
            </p>
          </div>

          {/* Candidate Name Input */}
          <div className="pt-2">
            <label className="text-xs text-slate-400 block mb-1">
              {isAr ? 'اسم حامل الشهادة:' : 'Candidate Full Name:'}
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="font-latin text-xl font-bold text-center text-white bg-transparent border-b border-indigo-500/40 focus:border-indigo-400 focus:outline-none pb-1 w-full max-w-sm"
              placeholder="Candidate Name"
            />
          </div>

          {/* Assigned Level Highlight */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 max-w-md mx-auto">
            <div className="text-xs font-mono text-amber-300 font-semibold uppercase">
              Certified CEFR Placement
            </div>
            <div className="font-mono text-3xl font-black text-amber-400 my-1">
              LEVEL {scoreData.overallCefr}
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {isAr ? currentDesc.nameAr : currentDesc.nameEn}
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div>
              <div className="text-[10px] text-slate-500">{isAr ? 'تاريخ التقييم' : 'Issue Date'}</div>
              <div className="font-mono font-medium text-slate-300">{new Date(scoreData.date).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">{isAr ? 'الدرجة المحققة' : 'Exam Score'}</div>
              <div className="font-mono font-medium text-emerald-400">{scoreData.overallScore}% ({scoreData.correctCount}/{scoreData.totalQuestions})</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">{isAr ? 'معرف الوثيقة' : 'Credential ID'}</div>
              <div className="font-mono font-medium text-slate-300">LL-{Math.abs(scoreData.overallScore * 8931).toString(16).toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
