import React from 'react';
import { AppTab } from '../types';
import { Award, Mic, CheckCircle2, BarChart3, Globe, Volume2 } from 'lucide-react';

interface NavbarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  onStartExam: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  onStartExam,
}) => {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2 text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Award className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-latin text-lg font-bold tracking-tight text-white">
              LinguaLevel
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-line, unboxed, clean hover states) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectTab('placement_test')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              currentTab === 'placement_test'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{isAr ? 'اختبار تحديد المستوى' : 'Placement Test'}</span>
          </button>

          <button
            onClick={() => onSelectTab('instant_practice')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              currentTab === 'instant_practice'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="h-4 w-4 shrink-0" />
            <span>{isAr ? 'التقييم الفوري والتدريب' : 'Instant Practice'}</span>
          </button>

          <button
            onClick={() => onSelectTab('pronunciation_lab')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              currentTab === 'pronunciation_lab'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Volume2 className="h-4 w-4 shrink-0" />
            <span>{isAr ? 'معمل نطق الكلمات' : 'Pronunciation Lab'}</span>
          </button>

          <button
            onClick={() => onSelectTab('speaking_test')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              currentTab === 'speaking_test'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="h-4 w-4 shrink-0" />
            <span>{isAr ? 'اختبار التحدث والطلاقة' : 'Speaking Test'}</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              currentTab === 'analytics'
                ? 'text-indigo-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span>{isAr ? 'تحليل الأداء والشهادة' : 'Analytics & CEFR'}</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 rounded-md border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
            title={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span className="whitespace-nowrap">{isAr ? 'English' : 'عربي'}</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={onStartExam}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 whitespace-nowrap"
          >
            {isAr ? 'ابدأ الاختبار الشامل' : 'Start Full Assessment'}
          </button>
        </div>
      </div>

      {/* Mobile sub-bar for easy navigation on small screens */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-800/80 bg-slate-950 px-2 py-2 text-xs">
        <button
          onClick={() => onSelectTab('placement_test')}
          className={`px-2 py-1 ${currentTab === 'placement_test' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          {isAr ? 'الاختبار' : 'Test'}
        </button>
        <button
          onClick={() => onSelectTab('instant_practice')}
          className={`px-2 py-1 ${currentTab === 'instant_practice' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          {isAr ? 'فوري' : 'Practice'}
        </button>
        <button
          onClick={() => onSelectTab('pronunciation_lab')}
          className={`px-2 py-1 ${currentTab === 'pronunciation_lab' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          {isAr ? 'النطق' : 'Pronounce'}
        </button>
        <button
          onClick={() => onSelectTab('speaking_test')}
          className={`px-2 py-1 ${currentTab === 'speaking_test' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          {isAr ? 'المحادثة' : 'Speaking'}
        </button>
        <button
          onClick={() => onSelectTab('analytics')}
          className={`px-2 py-1 ${currentTab === 'analytics' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          {isAr ? 'التقرير' : 'Report'}
        </button>
      </div>
    </header>
  );
};
