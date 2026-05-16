'use client';

import { useState } from 'react';
import ResumeSheet from './sheets/ResumeSheet';
import ProjectsSheet from './sheets/ProjectsSheet';

const tabs = [
  { id: 'resume', label: 'Resume' },
  { id: 'projects', label: 'Projects' },
];

const ribbonGroups = {
  home: [
    {
      label: 'Clipboard',
      buttons: [
        { icon: '📋', label: 'Paste' },
        { icon: '✂️', label: 'Cut' },
        { icon: '📄', label: 'Copy' },
      ],
    },
    {
      label: 'Font',
      buttons: [
        { icon: 'B', label: 'Bold', style: 'font-bold text-base' },
        { icon: 'I', label: 'Italic', style: 'italic text-base' },
        { icon: 'U', label: 'Underline', style: 'underline text-base' },
      ],
    },
    {
      label: 'Alignment',
      buttons: [
        { icon: '≡', label: 'Left', style: 'text-base' },
        { icon: '≡', label: 'Center', style: 'text-base' },
        { icon: '≡', label: 'Right', style: 'text-base' },
        { icon: '↵', label: 'Wrap' },
        { icon: '⊞', label: 'Merge' },
      ],
    },
    {
      label: 'Number',
      buttons: [
        { icon: '$', label: 'Currency' },
        { icon: '%', label: 'Percent' },
        { icon: ',', label: 'Comma' },
      ],
    },
    {
      label: 'Styles',
      buttons: [
        { icon: '🎨', label: 'Cond. Format' },
        { icon: '📊', label: 'Table' },
        { icon: '🖌️', label: 'Cell Styles' },
      ],
    },
    {
      label: 'Cells',
      buttons: [
        { icon: '+', label: 'Insert' },
        { icon: '🗑', label: 'Delete' },
        { icon: '⚙', label: 'Format' },
      ],
    },
    {
      label: 'Editing',
      buttons: [
        { icon: 'Σ', label: 'Sum', style: 'text-base' },
        { icon: '↓', label: 'Fill' },
        { icon: '🔍', label: 'Find' },
        { icon: '⬇', label: 'Sort' },
      ],
    },
  ],
  insert: [
    {
      label: 'Tables',
      buttons: [
        { icon: '📊', label: 'PivotTable' },
        { icon: '⊞', label: 'Table' },
      ],
    },
    {
      label: 'Charts',
      buttons: [
        { icon: '📈', label: 'Line' },
        { icon: '📊', label: 'Bar' },
        { icon: '🥧', label: 'Pie' },
        { icon: '📉', label: 'Area' },
      ],
    },
    {
      label: 'Links',
      buttons: [
        { icon: '🔗', label: 'Link' },
      ],
    },
  ],
};

type RibbonTab = 'home' | 'insert';

export type CellSelection = {
  ref: string;    // e.g. "C4"
  formula: string; // e.g. '=XLOOKUP(...)'
};

export default function ExcelShell() {
  const [activeSheet, setActiveSheet] = useState<string>('resume');
  const [activeRibbon, setActiveRibbon] = useState<RibbonTab>('home');
  const [selection, setSelection] = useState<CellSelection>({
    ref: 'C1',
    formula: '="Abby Ramadan"',
  });

  const groups = ribbonGroups[activeRibbon] ?? ribbonGroups.home;

  function handleSheetChange(id: string) {
    setActiveSheet(id);
    if (id === 'resume') {
      setSelection({ ref: 'C1', formula: '="Abby Ramadan"' });
    } else {
      setSelection({ ref: 'C1', formula: '="Projects"' });
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f3f3f3]" style={{ fontFamily: "'Calibri', 'Segoe UI', Arial, sans-serif" }}>

      {/* Title bar */}
      <div className="flex items-center justify-between bg-[#217346] text-white px-3 h-8 text-xs select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg leading-none">🟢</span>
          <span className="font-semibold">abbyramadan.com — Excel</span>
        </div>
        <div className="flex items-center gap-1 text-white/80 text-[11px]">
          <span className="px-2 py-0.5 hover:bg-white/20 rounded cursor-pointer">?</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded text-sm">─</button>
          <button className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded text-sm">□</button>
          <button className="w-6 h-6 flex items-center justify-center hover:bg-red-600 rounded text-sm">✕</button>
        </div>
      </div>

      {/* Ribbon tab bar */}
      <div className="flex items-end bg-[#217346] px-2 pt-0 shrink-0">
        {(['home', 'insert'] as RibbonTab[]).map(rt => (
          <button
            key={rt}
            onClick={() => setActiveRibbon(rt)}
            className={`px-4 py-1.5 text-xs font-medium rounded-t capitalize transition-colors select-none ${
              activeRibbon === rt
                ? 'bg-[#f3f3f3] text-[#217346]'
                : 'text-white hover:bg-white/20'
            }`}
          >
            {rt.charAt(0).toUpperCase() + rt.slice(1)}
          </button>
        ))}
        {(['Page Layout', 'Formulas', 'Data', 'Review', 'View'] as string[]).map(rt => (
          <button
            key={rt}
            className="px-4 py-1.5 text-xs font-medium rounded-t capitalize transition-colors text-white hover:bg-white/20 select-none"
          >
            {rt}
          </button>
        ))}
      </div>

      {/* Ribbon content */}
      <div className="flex items-end bg-[#f3f3f3] border-b border-[#d1d1d1] px-2 pt-1 shrink-0 overflow-x-auto">
        {groups.map((group, gi) => (
          <div key={gi} className="flex flex-col items-center mr-1">
            <div className="flex items-end gap-0.5 pb-1">
              {group.buttons.map((btn, bi) => (
                <button
                  key={bi}
                  className="xl-ribbon-btn"
                  title={btn.label}
                >
                  <span className={`text-lg leading-none ${(btn as { style?: string }).style ?? ''}`}>
                    {btn.icon}
                  </span>
                  <span className="text-[10px] leading-none text-[#555]">{btn.label}</span>
                </button>
              ))}
            </div>
            <div className="text-[10px] text-[#888] border-t border-[#d1d1d1] w-full text-center pt-0.5 leading-none">
              {group.label}
            </div>
          </div>
        ))}
      </div>

      {/* Formula bar */}
      <div className="flex items-center bg-white border-b border-[#c0c0c0] px-2 h-7 shrink-0 gap-1">
        <div className="flex items-center justify-center w-16 h-5 border border-[#c0c0c0] text-xs text-[#333] font-mono px-2 shrink-0 bg-white">
          {selection.ref}
        </div>
        <div className="w-px h-5 bg-[#c0c0c0] shrink-0" />
        <span className="text-[#217346] font-bold text-base leading-none px-1 shrink-0">fx</span>
        <div className="flex-1 h-5 border border-[#c0c0c0] text-xs font-mono px-2 flex items-center bg-white text-[#0563c1] overflow-hidden">
          <span className="truncate">{selection.formula}</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {activeSheet === 'resume' && <ResumeSheet onSelect={setSelection} />}
        {activeSheet === 'projects' && <ProjectsSheet onSelect={setSelection} />}
      </div>

      {/* Sheet tabs + status bar */}
      <div className="shrink-0 bg-[#f3f3f3] border-t border-[#d1d1d1]">
        <div className="flex items-end px-2 pt-1 gap-0.5">
          <button className="w-5 h-5 flex items-center justify-center text-[#888] hover:text-[#333] text-lg leading-none" title="Add sheet">+</button>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleSheetChange(tab.id)}
              className={`xl-sheet-tab ${activeSheet === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between bg-[#217346] text-white text-[11px] px-3 h-5 select-none">
          <div className="flex items-center gap-4">
            <span>Ready</span>
            <span className="text-white/70">|</span>
            <span>🔒 Sheet protected</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Average: –</span>
            <span>Count: –</span>
            <span>Sum: –</span>
            <span className="text-white/70">|</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
